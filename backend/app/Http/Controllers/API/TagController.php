<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::withCount('qaPairs')->get();
        return response()->json($tags);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create the tag
            $tag = Tag::create($validated);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'entity_type' => 'tag',
                'entity_id' => $tag->id,
                'details' => [
                    'name' => $tag->name,
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($tag, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to create tag: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create tag',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        return response()->json($tag->load('qaPairs'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Update the tag
            $oldName = $tag->name;
            $tag->update($validated);
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'tag',
                'entity_id' => $tag->id,
                'details' => [
                    'old_name' => $oldName,
                    'new_name' => $tag->name,
                ],
                'performed_at' => now(),
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($tag);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update tag: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update tag',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Detach all QA pairs
            $tag->qaPairs()->detach();
            
            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'entity_type' => 'tag',
                'entity_id' => $tag->id,
                'details' => [
                    'name' => $tag->name,
                ],
                'performed_at' => now(),
            ]);
            
            // Delete the tag
            $tag->delete();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to delete tag: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete tag',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get QA pairs for a tag.
     */
    public function qaPairs(Tag $tag)
    {
        $qaPairs = $tag->qaPairs()->with('category')->get();
        return response()->json($qaPairs);
    }
}

