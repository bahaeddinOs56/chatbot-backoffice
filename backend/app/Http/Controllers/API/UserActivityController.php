<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class UserActivityController extends Controller
{
    /**
     * Display a listing of the resource with pagination and filtering.
     */
    public function index(Request $request)
    {
        $query = UserActivity::with('user');
        
        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }
        
        // Filter by entity type
        if ($request->has('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }
        
        // Filter by entity ID
        if ($request->has('entity_id')) {
            $query->where('entity_id', $request->entity_id);
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('performed_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('performed_at', '<=', $request->end_date);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'performed_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Apply pagination
        $perPage = $request->input('per_page', 15);
        $activities = $query->paginate($perPage);
        
        return response()->json($activities);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(UserActivity $activity)
    {
        return response()->json($activity->load('user'));
    }
    
    /**
     * Get activity statistics.
     */
    public function statistics(Request $request)
    {
        // Filter by date range
        $query = UserActivity::query();
        
        if ($request->has('start_date')) {
            $query->where('performed_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('performed_at', '<=', $request->end_date);
        }
        
        // Get counts by action
        $actionCounts = $query->select('action', DB::raw('count(*) as count'))
            ->groupBy('action')
            ->get();
        
        // Get counts by entity type
        $entityTypeCounts = $query->select('entity_type', DB::raw('count(*) as count'))
            ->groupBy('entity_type')
            ->get();
        
        // Get counts by user
        $userCounts = $query->select('user_id', DB::raw('count(*) as count'))
            ->groupBy('user_id')
            ->with('user')
            ->get();
        
        // Get counts by day
        $dailyCounts = $query->select(DB::raw('DATE(performed_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        return response()->json([
            'action_counts' => $actionCounts,
            'entity_type_counts' => $entityTypeCounts,
            'user_counts' => $userCounts,
            'daily_counts' => $dailyCounts,
        ]);
    }
}

