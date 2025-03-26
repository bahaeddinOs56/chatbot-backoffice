<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    /**
     * Update the user's profile information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore(Auth::id()),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Start a database transaction
            DB::beginTransaction();

            $user = Auth::user();
            $oldData = [
                'name' => $user->name,
                'email' => $user->email,
            ];

            // Update user profile
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'profile',
                'entity_id' => Auth::id(),
                'details' => [
                    'old_data' => $oldData,
                    'new_data' => [
                        'name' => $request->name,
                        'email' => $request->email,
                    ],
                ],
                'performed_at' => now(),
            ]);

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update profile: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = Auth::user();

        // Check if the current password matches
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Start a database transaction
            DB::beginTransaction();

            // Update the password
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Log the activity
            UserActivity::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'entity_type' => 'password',
                'entity_id' => Auth::id(),
                'details' => [
                    'message' => 'Password updated',
                ],
                'performed_at' => now(),
            ]);

            // Commit the transaction
            DB::commit();

            return response()->json([
                'message' => 'Password updated successfully',
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            Log::error('Failed to update password: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update password',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

