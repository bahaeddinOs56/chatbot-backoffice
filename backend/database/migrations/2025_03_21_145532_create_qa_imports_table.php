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
        Schema::create('qa_imports', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->foreignId('imported_by')->constrained('users');
            $table->timestamp('imported_at');
            $table->integer('record_count');
            $table->string('status'); // 'pending', 'processing', 'completed', 'failed'
            $table->text('error_message')->nullable();
            
            // Add index for better performance
            $table->index('imported_by');
            $table->index('imported_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qa_imports');
    }
};

