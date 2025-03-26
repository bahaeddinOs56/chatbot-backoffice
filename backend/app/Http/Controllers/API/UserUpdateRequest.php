<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admins can update users
        return $this->user() && $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 
                'required', 
                'string', 
                'email', 
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
            'is_admin' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.max' => 'The name may not be greater than 255 characters.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already in use by another user.',
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function passedValidation(): void
    {
        // Check if trying to remove admin status from the last admin
        if ($this->has('is_admin') && $this->input('is_admin') === false) {
            $userId = $this->route('user');
            $user = \App\Models\User::find($userId);
            
            if ($user && $user->is_admin) {
                $adminCount = \App\Models\User::where('is_admin', true)->count();
                
                if ($adminCount <= 1) {
                    $this->validator->errors()->add(
                        'is_admin', 'Cannot remove admin status from the last admin user.'
                    );
                }
            }
        }
    }
}