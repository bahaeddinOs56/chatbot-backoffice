<?php

namespace Database\Seeders;

use App\Models\QAPair;
use Illuminate\Database\Seeder;

class QAPairSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $qaPairs = [
            [
                'question' => 'What is your name?',
                'answer' => 'I am your AI assistant, designed to help with your questions and tasks.',
                'category_id' => 1, // General
                'enabled' => true,
            ],
            [
                'question' => 'How do I reset my password?',
                'answer' => 'To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email.',
                'category_id' => 2, // Account
                'enabled' => true,
            ],
            [
                'question' => 'What are your business hours?',
                'answer' => 'Our customer support is available Monday to Friday, 9 AM to 5 PM Eastern Time.',
                'category_id' => 1, // General
                'enabled' => true,
            ],
            [
                'question' => 'How much does the premium plan cost?',
                'answer' => 'Our premium plan costs $29.99 per month, billed monthly, or $299 per year, saving you two months when billed annually.',
                'category_id' => 3, // Pricing
                'enabled' => true,
            ],
            [
                'question' => 'How do I integrate the chatbot with my website?',
                'answer' => 'To integrate our chatbot with your website, copy the provided script tag from your dashboard and paste it before the closing </body> tag in your HTML.',
                'category_id' => 4, // Technical
                'enabled' => true,
            ],
        ];

        foreach ($qaPairs as $qaPair) {
            QAPair::create($qaPair);
        }
    }
}