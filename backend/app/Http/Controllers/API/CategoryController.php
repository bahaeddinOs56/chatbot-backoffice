<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get company ID from authenticated user
        $companyId = Auth::user()->company_id;
        
        $query = Category::withCount('qaPairs')
            ->where('company_id', $companyId);
        
        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        // Filter by parent
        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }
        
        // Get only root categories
        if ($request->has('root_only') && $request->root_only) {
            $query->whereNull('parent_id');
        }
        
        // Include children
        if ($request->has('with_children') && $request->with_children) {
            $query->with(['children' => function($query) use ($companyId) {
                $query->where('company_id', $companyId);
            }]);
        }
        
        $categories = $query->get();
        
        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        
        // Get company ID from authenticated user
        $companyId = Auth::user()->company_id;
        
        // If parent_id is provided, verify it belongs to the same company
        if (isset($validated['parent_id'])) {
            $parentCategory = Category::findOrFail($validated['parent_id']);
            if ($parentCategory->company_id !== $companyId) {
                return response()->json([
                    'message' => 'Parent category does not belong to your company',
                ], Response::HTTP_FORBIDDEN);
            }
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create the category
            $validated['company_id'] = $companyId;
            $category = Category::create($validated);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'entity_type' => 'category',
                'entity_id' => $category->id,
                'details' => [
                    'name' => $category->name,
                    'parent_id' => $category->parent_id,
                ],
                'performed_at' => now(),
                'company_id' => $companyId,
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($category, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to create category: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create category',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category)
    {
        // Include children
        if ($request->has('with_children') && $request->with_children) {
            $category->load('children');
        }
        
        // Include QA pairs
        if ($request->has('with_qa_pairs') && $request->with_qa_pairs) {
            $category->load('qaPairs');
        }
        
        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        
        // Prevent circular references
        if (isset($validated['parent_id']) && $validated['parent_id'] == $category->id) {
            return response()->json([
                'message' => 'A category cannot be its own parent',
            ], Response::HTTP_BAD_REQUEST);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Update the category
            $oldData = $category->toArray();
            $category->update($validated);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'category',
                'entity_id' => $category->id,
                'details' => [
                    'old' => $oldData,
                    'new' => $category->toArray(),
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($category);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update category: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update category',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if the category has any Q&A pairs
        if ($category->qaPairs()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with associated Q&A pairs',
            ], Response::HTTP_CONFLICT);
        }
        
        // Check if the category has any children
        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with child categories',
            ], Response::HTTP_CONFLICT);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'entity_type' => 'category',
                'entity_id' => $category->id,
                'details' => [
                    'name' => $category->name,
                    'parent_id' => $category->parent_id,
                ],
                'performed_at' => now(),
            ]);
            
            // Delete the category
            $category->delete();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to delete category: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get the category tree.
     */
    public function tree()
    {
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function($query) {
                $query->withCount('qaPairs');
            }])
            ->withCount('qaPairs')
            ->get();
        
        return response()->json($categories);
    }
    
    /**
     * Move a category to a new parent.
     */
    public function move(Request $request, Category $category)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
        ]);
        
        // Prevent circular references
        if (isset($validated['parent_id']) && $validated['parent_id'] == $category->id) {
            return response()->json([
                'message' => 'A category cannot be its own parent',
            ], Response::HTTP_BAD_REQUEST);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Update the category
            $oldParentId = $category->parent_id;
            $category->parent_id = $validated['parent_id'];
            $category->save();
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'move',
                'entity_type' => 'category',
                'entity_id' => $category->id,
                'details' => [
                    'name' => $category->name,
                    'old_parent_id' => $oldParentId,
                    'new_parent_id' => $category->parent_id,
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($category);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to move category: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to move category',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

