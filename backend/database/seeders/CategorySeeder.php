<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'General',
                'description' => 'General questions about the service',
            ],
            [
                'name' => 'Account',
                'description' => 'Account-related questions',
            ],
            [
                'name' => 'Pricing',
                'description' => 'Questions about pricing and plans',
            ],
            [
                'name' => 'Technical',
                'description' => 'Technical support questions',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}