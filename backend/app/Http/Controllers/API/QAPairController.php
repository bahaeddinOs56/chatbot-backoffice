<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\QAPair;
use App\Models\Category;
use App\Models\QAPairHistory;
use App\Models\QAImport;
use App\Models\Tag;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class QAPairController extends Controller
{
    /**
     * Display a listing of the resource with pagination and filtering.
     */
    public function index(Request $request)
    {
        // Get company ID from authenticated user
        $companyId = Auth::user()->company_id;
        
        $query = QAPair::with(['category', 'tags'])
            ->where('company_id', $companyId);
        
        // Apply filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        if ($request->has('tag_id')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }
        
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('question', 'like', $searchTerm)
                  ->orWhere('answer', 'like', $searchTerm);
            });
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Apply pagination
        $perPage = $request->input('per_page', 15);
        $qaPairs = $query->paginate($perPage);
        
        return response()->json($qaPairs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'priority' => 'integer|nullable',
            'metadata' => 'array|nullable',
            'tags' => 'array|nullable',
            'tags.*' => 'exists:tags,id',
        ]);
        
        // Get company ID from authenticated user
        $companyId = Auth::user()->company_id;
        
        // Verify category belongs to user's company
        $category = Category::findOrFail($validated['category_id']);
        if ($category->company_id !== $companyId) {
            return response()->json([
                'message' => 'Category does not belong to your company',
            ], Response::HTTP_FORBIDDEN);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create the QA pair
            $qaPair = new QAPair();
            $qaPair->question = $validated['question'];
            $qaPair->answer = $validated['answer'];
            $qaPair->category_id = $validated['category_id'];
            $qaPair->is_active = $validated['is_active'] ?? true;
            $qaPair->priority = $validated['priority'] ?? 0;
            $qaPair->metadata = $validated['metadata'] ?? null;
            $qaPair->created_by = Auth::id();
            $qaPair->updated_by = Auth::id();
            $qaPair->company_id = $companyId;
            $qaPair->save();
            
            // Attach tags if provided
            if (isset($validated['tags'])) {
                // Verify tags belong to user's company
                $tags = Tag::whereIn('id', $validated['tags'])->get();
                $validTagIds = $tags->where('company_id', $companyId)->pluck('id')->toArray();
                
                $qaPair->tags()->attach($validTagIds);
            }
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'entity_type' => 'qa_pair',
                'entity_id' => $qaPair->id,
                'details' => [
                    'question' => $qaPair->question,
                    'category_id' => $qaPair->category_id,
                ],
                'performed_at' => now(),
                'company_id' => $companyId,
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($qaPair->load(['category', 'tags']), Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to create QA pair: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create QA pair',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(QAPair $qaPair)
    {
        return response()->json($qaPair->load(['category', 'tags', 'history']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QAPair $qaPair)
    {
        $validated = $request->validate([
            'question' => 'string|max:255',
            'answer' => 'string',
            'category_id' => 'exists:categories,id',
            'is_active' => 'boolean',
            'priority' => 'integer|nullable',
            'metadata' => 'array|nullable',
            'tags' => 'array|nullable',
            'tags.*' => 'exists:tags,id',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Save the old version to history
            QAPairHistory::create([
                'qa_pair_id' => $qaPair->id,
                'question' => $qaPair->question,
                'answer' => $qaPair->answer,
                'changed_by' => Auth::id(),
                'changed_at' => now(),
                'change_type' => 'update',
            ]);
            
            // Update the QA pair
            $oldData = $qaPair->toArray();
            
            if (isset($validated['question'])) {
                $qaPair->question = $validated['question'];
            }
            
            if (isset($validated['answer'])) {
                $qaPair->answer = $validated['answer'];
            }
            
            if (isset($validated['category_id'])) {
                $qaPair->category_id = $validated['category_id'];
            }
            
            if (isset($validated['is_active'])) {
                $qaPair->is_active = $validated['is_active'];
            }
            
            if (isset($validated['priority'])) {
                $qaPair->priority = $validated['priority'];
            }
            
            if (isset($validated['metadata'])) {
                $qaPair->metadata = $validated['metadata'];
            }
            
            $qaPair->updated_by = Auth::id();
            $qaPair->save();
            
            // Update tags if provided
            if (isset($validated['tags'])) {
                $qaPair->tags()->sync($validated['tags']);
            }
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'qa_pair',
                'entity_id' => $qaPair->id,
                'details' => [
                    'old' => $oldData,
                    'new' => $qaPair->toArray(),
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($qaPair->load(['category', 'tags']));
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update QA pair: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update QA pair',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QAPair $qaPair)
    {
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Save to history before deleting
            QAPairHistory::create([
                'qa_pair_id' => $qaPair->id,
                'question' => $qaPair->question,
                'answer' => $qaPair->answer,
                'changed_by' => Auth::id(),
                'changed_at' => now(),
                'change_type' => 'delete',
            ]);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'entity_type' => 'qa_pair',
                'entity_id' => $qaPair->id,
                'details' => [
                    'question' => $qaPair->question,
                    'category_id' => $qaPair->category_id,
                ],
                'performed_at' => now(),
            ]);
            
            // Detach all tags
            $qaPair->tags()->detach();
            
            // Delete the QA pair
            $qaPair->delete();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to delete QA pair: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete QA pair',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Toggle the active status of the specified resource.
     */
    public function toggle(QAPair $qaPair)
    {
        $qaPair->is_active = !$qaPair->is_active;
        $qaPair->updated_by = Auth::id();
        $qaPair->save();
        
        // Log the activity
        UserActivity::create([
            'user_id' => Auth::id(),
            'action' => 'toggle',
            'entity_type' => 'qa_pair',
            'entity_id' => $qaPair->id,
            'details' => [
                'is_active' => $qaPair->is_active,
            ],
            'performed_at' => now(),
        ]);
        
        return response()->json($qaPair);
    }

    /**
     * Bulk import QA pairs.
     */
    public function bulkImport(Request $request)
    {
        $validated = $request->validate([
            'qa_pairs' => 'required|array',
            'qa_pairs.*.question' => 'required|string|max:255',
            'qa_pairs.*.answer' => 'required|string',
            'qa_pairs.*.category_id' => 'required|exists:categories,id',
            'qa_pairs.*.is_active' => 'boolean',
            'qa_pairs.*.priority' => 'integer|nullable',
            'qa_pairs.*.tags' => 'array|nullable',
            'qa_pairs.*.tags.*' => 'exists:tags,id',
            'filename' => 'string|nullable',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create an import record
            $import = QAImport::create([
                'filename' => $validated['filename'] ?? 'Manual import',
                'imported_by' => Auth::id(),
                'imported_at' => now(),
                'record_count' => count($validated['qa_pairs']),
                'status' => 'processing',
            ]);
            
            $imported = [];
            foreach ($validated['qa_pairs'] as $qaPairData) {
                // Create the QA pair
                $qaPair = new QAPair();
                $qaPair->question = $qaPairData['question'];
                $qaPair->answer = $qaPairData['answer'];
                $qaPair->category_id = $qaPairData['category_id'];
                $qaPair->is_active = $qaPairData['is_active'] ?? true;
                $qaPair->priority = $qaPairData['priority'] ?? 0;
                $qaPair->created_by = Auth::id();
                $qaPair->updated_by = Auth::id();
                $qaPair->save();
                
                // Attach tags if provided
                if (isset($qaPairData['tags'])) {
                    $qaPair->tags()->attach($qaPairData['tags']);
                }
                
                $imported[] = $qaPair;
            }
            
            // Update the import record
            $import->status = 'completed';
            $import->save();
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'bulk_import',
                'entity_type' => 'qa_pairs',
                'entity_id' => $import->id,
                'details' => [
                    'filename' => $import->filename,
                    'record_count' => $import->record_count,
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'message' => count($imported) . ' QA pairs imported successfully',
                'qa_pairs' => $imported,
                'import_id' => $import->id,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to import QA pairs: ' . $e->getMessage());
            
            // Update the import record if it was created
            if (isset($import)) {
                $import->status = 'failed';
                $import->error_message = $e->getMessage();
                $import->save();
            }
            
            return response()->json([
                'message' => 'Failed to import QA pairs',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Bulk delete QA pairs.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:qa_pairs,id',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            $qaPairs = QAPair::whereIn('id', $validated['ids'])->get();
            
            foreach ($qaPairs as $qaPair) {
                // Save to history before deleting
                QAPairHistory::create([
                    'qa_pair_id' => $qaPair->id,
                    'question' => $qaPair->question,
                    'answer' => $qaPair->answer,
                    'changed_by' => Auth::id(),
                    'changed_at' => now(),
                    'change_type' => 'delete',
                ]);
                
                // Detach all tags
                $qaPair->tags()->detach();
            }
            
            // Delete the QA pairs
            QAPair::whereIn('id', $validated['ids'])->delete();
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'bulk_delete',
                'entity_type' => 'qa_pairs',
                'entity_id' => null,
                'details' => [
                    'ids' => $validated['ids'],
                    'count' => count($validated['ids']),
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'message' => count($validated['ids']) . ' QA pairs deleted successfully'
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to delete QA pairs: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete QA pairs',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Bulk toggle QA pairs.
     */
    public function bulkToggle(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:qa_pairs,id',
            'is_active' => 'required|boolean',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Update the QA pairs
            QAPair::whereIn('id', $validated['ids'])->update([
                'is_active' => $validated['is_active'],
                'updated_by' => Auth::id(),
            ]);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'bulk_toggle',
                'entity_type' => 'qa_pairs',
                'entity_id' => null,
                'details' => [
                    'ids' => $validated['ids'],
                    'count' => count($validated['ids']),
                    'is_active' => $validated['is_active'],
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'message' => count($validated['ids']) . ' QA pairs updated successfully'
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update QA pairs: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update QA pairs',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Export QA pairs to CSV.
     */
    public function export(Request $request)
    {
        // Apply filters
        $query = QAPair::with(['category', 'tags']);
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        if ($request->has('tag_id')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }
        
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('question', 'like', $searchTerm)
                  ->orWhere('answer', 'like', $searchTerm);
            });
        }
        
        $qaPairs = $query->get();
        
        // Log the activity
        UserActivity::create([
            'user_id' => Auth::id(),
            'action' => 'export',
            'entity_type' => 'qa_pairs',
            'entity_id' => null,
            'details' => [
                'count' => $qaPairs->count(),
                'filters' => $request->all(),
            ],
            'performed_at' => now(),
        ]);
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="qa_pairs_export_' . date('Y-m-d') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($qaPairs) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($file, ['id', 'question', 'answer', 'category_id', 'category_name', 'is_active', 'priority', 'tags', 'created_at', 'updated_at']);
            
            // Add data rows
            foreach ($qaPairs as $qaPair) {
                $tags = $qaPair->tags->pluck('name')->implode(', ');
                
                fputcsv($file, [
                    $qaPair->id,
                    $qaPair->question,
                    $qaPair->answer,
                    $qaPair->category_id,
                    $qaPair->category->name ?? 'Uncategorized',
                    $qaPair->is_active ? 'true' : 'false',
                    $qaPair->priority,
                    $tags,
                    $qaPair->created_at,
                    $qaPair->updated_at,
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Search QA pairs.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|min:2',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'nullable|boolean',
            'tag_id' => 'nullable|exists:tags,id',
        ]);

        $query = QAPair::query()->with(['category', 'tags']);

        // Apply search query
        if (!empty($validated['query'])) {
            $searchTerm = '%' . $validated['query'] . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('question', 'like', $searchTerm)
                  ->orWhere('answer', 'like', $searchTerm);
            });
        }

        // Filter by category
        if (isset($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        // Filter by active status
        if (isset($validated['is_active'])) {
            $query->where('is_active', $validated['is_active']);
        }
        
        // Filter by tag
        if (isset($validated['tag_id'])) {
            $query->whereHas('tags', function($q) use ($validated) {
                $q->where('tags.id', $validated['tag_id']);
            });
        }

        $qaPairs = $query->get();
        
        // Log the search activity
        UserActivity::create([
            'user_id' => Auth::id(),
            'action' => 'search',
            'entity_type' => 'qa_pairs',
            'entity_id' => null,
            'details' => [
                'query' => $validated['query'],
                'filters' => $validated,
                'results_count' => $qaPairs->count(),
            ],
            'performed_at' => now(),
        ]);

        return response()->json($qaPairs);
    }
    
    /**
     * Get QA pair history.
     */
    public function history(QAPair $qaPair)
    {
        $history = $qaPair->history()->with('changedBy')->orderBy('changed_at', 'desc')->get();
        
        return response()->json($history);
    }
    
    /**
     * Restore QA pair from history.
     */
    public function restore(Request $request, QAPair $qaPair)
    {
        $validated = $request->validate([
            'history_id' => 'required|exists:qa_pair_history,id',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Get the history record
            $history = QAPairHistory::findOrFail($validated['history_id']);
            
            // Save the current version to history
            QAPairHistory::create([
                'qa_pair_id' => $qaPair->id,
                'question' => $qaPair->question,
                'answer' => $qaPair->answer,
                'changed_by' => Auth::id(),
                'changed_at' => now(),
                'change_type' => 'update_before_restore',
            ]);
            
            // Restore the QA pair
            $qaPair->question = $history->question;
            $qaPair->answer = $history->answer;
            $qaPair->updated_by = Auth::id();
            $qaPair->save();
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'restore',
                'entity_type' => 'qa_pair',
                'entity_id' => $qaPair->id,
                'details' => [
                    'history_id' => $history->id,
                    'restored_from' => $history->changed_at,
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($qaPair->load(['category', 'tags']));
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to restore QA pair: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to restore QA pair',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display a listing of active QA pairs for public use.
     */
    public function publicIndex()
    {
        $qaPairs = QAPair::with('category')
            ->where('is_active', true)
            ->orderBy('priority', 'desc')
            ->get();
        
        return response()->json($qaPairs);
    }
    
    /**
     * Search active QA pairs for public use.
     */
    public function publicSearch(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|min:2',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $query = QAPair::query()
            ->with('category')
            ->where('is_active', true);

        // Apply search query
        if (!empty($validated['query'])) {
            $searchTerm = '%' . $validated['query'] . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('question', 'like', $searchTerm)
                  ->orWhere('answer', 'like', $searchTerm);
            });
        }

        // Filter by category
        if (isset($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        $qaPairs = $query->orderBy('priority', 'desc')->get();

        return response()->json($qaPairs);
    }
}

