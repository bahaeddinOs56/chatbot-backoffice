<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('qa_pairs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('category_id');
            $table->index('is_active');
            $table->index('priority');
        });
        
        // // Add database-specific full-text search index
        // if (DB::connection()->getDriverName() === 'pgsql') {
        //     // PostgreSQL full-text search index
        //     DB::statement('CREATE INDEX qa_pairs_search_idx ON qa_pairs USING gin(to_tsvector(\'english\', question || \' \' || answer))');
        // } else {
        //     // MySQL full-text search index
        //     DB::statement('ALTER TABLE qa_pairs ADD FULLTEXT search_index (question, answer)');
        // }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the database-specific index first
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS qa_pairs_search_idx');
        }
        
        Schema::dropIfExists('qa_pairs');
    }
};