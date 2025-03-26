<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });
        
        Schema::create('qa_pair_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qa_pair_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            // Add unique constraint to prevent duplicate tags on a QA pair
            $table->unique(['qa_pair_id', 'tag_id']);
            
            // Add index for better performance
            $table->index('qa_pair_id');
            $table->index('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qa_pair_tags');
        Schema::dropIfExists('tags');
    }
};

