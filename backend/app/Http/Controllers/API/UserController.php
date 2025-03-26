<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();
            
            // Search by name or email
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            }
            
            // Filter by admin status
            if ($request->has('is_admin') && $request->is_admin !== null) {
                $query->where('is_admin', $request->is_admin === 'true' || $request->is_admin === '1');
            }
            
            // Sort results
            $sortField = $request->input('sort_field', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $allowedSortFields = ['name', 'email', 'created_at', 'is_admin'];
            
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }
            
            // Paginate results
            $perPage = $request->input('per_page', 10);
            $users = $query->paginate($perPage);
            
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'is_admin' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();
        
        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'is_admin' => $request->is_admin ?? false
            ]);
            
            // Log activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'details' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin
                ],
                'performed_at' => now()
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create user: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            
            return response()->json([
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Update the specified user in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Find user
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'is_admin' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        DB::beginTransaction();
        
        try {
            // Update user
            $oldData = [
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin
            ];
            
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            
            if ($request->has('is_admin')) {
                // Prevent removing admin status from the last admin
                if ($user->is_admin && !$request->is_admin) {
                    $adminCount = User::where('is_admin', true)->count();
                    if ($adminCount <= 1) {
                        return response()->json([
                            'message' => 'Cannot remove admin status from the last admin user'
                        ], Response::HTTP_CONFLICT);
                    }
                }
                
                $user->is_admin = $request->is_admin;
            }
            
            $user->save();
            
            // Log activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'details' => [
                    'old' => $oldData,
                    'new' => [
                        'name' => $user->name,
                        'email' => $user->email,
                        'is_admin' => $user->is_admin
                    ]
                ],
                'performed_at' => now()
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update user: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Find user
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], Response::HTTP_CONFLICT);
        }
        
        // Prevent deleting the last admin
        if ($user->is_admin) {
            $adminCount = User::where('is_admin', true)->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot delete the last admin user'
                ], Response::HTTP_CONFLICT);
            }
        }

        DB::beginTransaction();
        
        try {
            // Log activity before deletion
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'details' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin
                ],
                'performed_at' => now()
            ]);
            
            // Delete user
            $user->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete user: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Toggle admin status for a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleAdmin(Request $request, $id)
    {
        // Find user
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        // Validate request
        $validator = Validator::make($request->all(), [
            'is_admin' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        
        // Prevent removing admin status from the last admin
        if ($user->is_admin && !$request->is_admin) {
            $adminCount = User::where('is_admin', true)->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot remove admin status from the last admin user'
                ], Response::HTTP_CONFLICT);
            }
        }

        DB::beginTransaction();
        
        try {
            // Update admin status
            $oldStatus = $user->is_admin;
            $user->is_admin = $request->is_admin;
            $user->save();
            
            // Log activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'toggle_admin',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'details' => [
                    'old_status' => $oldStatus,
                    'new_status' => $user->is_admin
                ],
                'performed_at' => now()
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'User admin status updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update user admin status: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to update user admin status',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Reset password for a user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function resetPassword($id)
    {
        // Find user
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], Response::HTTP_NOT_FOUND);
        }

        DB::beginTransaction();
        
        try {
            // Generate random password
            $newPassword = Str::random(12);
            
            // Update user password
            $user->password = Hash::make($newPassword);
            $user->save();
            
            // Log activity (without including the password)
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'reset_password',
                'entity_type' => 'user',
                'entity_id' => $user->id,
                'details' => [
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'performed_at' => now()
            ]);
            
            // In a real application, you would send an email with the new password
            // For now, we'll just return it in the response
            
            DB::commit();
            
            return response()->json([
                'message' => 'User password reset successfully',
                'user' => $user,
                'new_password' => $newPassword // In production, you would send this via email instead
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to reset user password: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to reset user password',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

