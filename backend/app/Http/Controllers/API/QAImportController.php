<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\QAImport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class QAImportController extends Controller
{
    /**
     * Display a listing of the resource with pagination and filtering.
     */
    public function index(Request $request)
    {
        $query = QAImport::with('importedBy');
        
        // Filter by user
        if ($request->has('imported_by')) {
            $query->where('imported_by', $request->imported_by);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('imported_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('imported_at', '<=', $request->end_date);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'imported_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Apply pagination
        $perPage = $request->input('per_page', 15);
        $imports = $query->paginate($perPage);
        
        return response()->json($imports);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(QAImport $import)
    {
        return response()->json($import->load('importedBy'));
    }
}

