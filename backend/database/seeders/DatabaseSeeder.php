<?php

namespace Database\Seeders;

use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    
    public function run(): void
    {
        // Create an admin user if it doesn't exist
        if (!\App\Models\User::where('email', 'admin@example.com')->exists()) {
            \App\Models\User::factory()->create([
                'name' => 'Admin User',
                'email' => '    ',
                'password' => Hash::make('admin123'),
                'is_admin' => true, // Add this line to make the user an admin
            ]);
        } else {
            // Update existing admin user to have admin privileges if not already set
            $adminUser = \App\Models\User::where('email', 'admin@example.com')->first();
            if (!$adminUser->is_admin) {
                $adminUser->is_admin = true;
                $adminUser->save();
            }
        }

        // Run other seeders
        $this->call([
            CategorySeeder::class,
            QAPairSeeder::class,
        ]);
    }
}

