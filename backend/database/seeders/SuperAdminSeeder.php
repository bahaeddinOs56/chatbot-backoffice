<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'is_super_admin' => true,
            'company_id' => null, // Super admin is not associated with any company
        ]);
        
        $this->command->info('Super Admin user created successfully!');
    }
}

