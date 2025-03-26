<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Only super admins can see all companies
        if (!Auth::user()->is_admin || Auth::user()->company_id !== null) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $query = Company::query();
        
        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        
        // Apply search
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('domain', 'like', $searchTerm);
            });
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Apply pagination
        $perPage = $request->input('per_page', 15);
        $companies = $query->withCount('users')->paginate($perPage);
        
        return response()->json($companies);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Only super admins can create companies
        if (!Auth::user()->is_admin || Auth::user()->company_id !== null) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'nullable|string|max:255|unique:companies',
            'is_active' => 'boolean',
            'settings' => 'array|nullable',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|string|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Create the company
            $company = new Company();
            $company->name = $validated['name'];
            $company->slug = Str::slug($validated['name']);
            $company->domain = $validated['domain'] ?? null;
            $company->is_active = $validated['is_active'] ?? true;
            $company->settings = $validated['settings'] ?? null;
            $company->save();
            
            // Create the company admin
            $admin = new User();
            $admin->name = $validated['admin_name'];
            $admin->email = $validated['admin_email'];
            $admin->password = Hash::make($validated['admin_password']);
            $admin->is_admin = true;
            $admin->company_id = $company->id;
            $admin->save();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'company' => $company,
                'admin' => $admin,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to create company: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create company',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        // Only super admins or users from the company can view it
        if (!Auth::user()->is_admin && Auth::user()->company_id !== $company->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $company->load('users');
        $company->loadCount(['qaPairs', 'categories']);
        
        return response()->json($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        // Only super admins or company admins can update
        if (!Auth::user()->is_admin) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        // Company admins can only update their own company
        if (Auth::user()->company_id !== null && Auth::user()->company_id !== $company->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'domain' => 'nullable|string|max:255|unique:companies,domain,' . $company->id,
            'is_active' => 'boolean',
            'settings' => 'array|nullable',
        ]);
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Update the company
            $company->fill($validated);
            $company->save();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json($company);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update company: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update company',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        // Only super admins can delete companies
        if (!Auth::user()->is_admin || Auth::user()->company_id !== null) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        // Check if the company has any users
        if ($company->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete company with associated users',
            ], Response::HTTP_CONFLICT);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Delete the company
            $company->delete();
            
            // Commit the transaction
            DB::commit();
            
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to delete company: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete company',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Toggle the active status of the specified company.
     */
    public function toggle(Company $company)
    {
        // Only super admins can toggle company status
        if (!Auth::user()->is_admin || Auth::user()->company_id !== null) {
            return response()->json([
                'message' => 'Unauthorized',
            ], Response::HTTP_FORBIDDEN);
        }
        
        $company->is_active = !$company->is_active;
        $company->save();
        
        return response()->json($company);
    }
}

