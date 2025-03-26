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
        Schema::create('qa_pair_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qa_pair_id')->constrained()->cascadeOnDelete();
            $table->text('question');
            $table->text('answer');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('changed_at');
            $table->string('change_type'); // 'create', 'update', 'delete'
            
            // Add index for better performance
            $table->index('qa_pair_id');
            $table->index('changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qa_pair_history');
    }
};

