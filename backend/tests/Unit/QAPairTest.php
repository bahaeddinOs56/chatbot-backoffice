<?php

namespace Tests\Unit;

use App\Models\QAPair;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QAPairTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function qa_pair_belongs_to_category()
    {
        $category = Category::factory()->create();
        $qaPair = QAPair::factory()->create(['category_id' => $category->id]);
        
        $this->assertInstanceOf(Category::class, $qaPair->category);
        $this->assertEquals($category->id, $qaPair->category->id);
    }

    /** @test */
    public function qa_pair_belongs_to_user()
    {
        $user = User::factory()->create();
        $qaPair = QAPair::factory()->create(['user_id' => $user->id]);
        
        $this->assertInstanceOf(User::class, $qaPair->user);
        $this->assertEquals($user->id, $qaPair->user->id);
    }

    /** @test */
    public function qa_pair_can_have_many_tags()
    {
        $qaPair = QAPair::factory()->create();
        $tags = Tag::factory()->count(3)->create();
        
        $qaPair->tags()->attach($tags->pluck('id'));
        
        $this->assertCount(3, $qaPair->tags);
        $this->assertInstanceOf(Tag::class, $qaPair->tags->first());
    }

    /** @test */
    public function qa_pair_can_have_history()
    {
        $qaPair = QAPair::factory()->create();
        $user = User::factory()->create();
        
        // Create history records
        $qaPair->history()->create([
            'question' => 'Old Question',
            'answer' => 'Old Answer',
            'category_id' => $qaPair->category_id,
            'status' => $qaPair->status,
            'user_id' => $user->id
        ]);
        
        $qaPair->history()->create([
            'question' => 'Older Question',
            'answer' => 'Older Answer',
            'category_id' => $qaPair->category_id,
            'status' => $qaPair->status,
            'user_id' => $user->id
        ]);
        
        $this->assertCount(2, $qaPair->history);
        $this->assertEquals('Old Question', $qaPair->history->first()->question);
    }

    /** @test */
    public function qa_pair_can_store_metadata()
    {
        $metadata = [
            'priority' => 'high',
            'source' => 'manual',
            'views' => 0,
            'helpful_count' => 0
        ];
        
        $qaPair = QAPair::factory()->create([
            'metadata' => $metadata
        ]);
        
        $this->assertEquals($metadata, $qaPair->metadata);
        $this->assertEquals('high', $qaPair->metadata['priority']);
    }

    /** @test */
    public function qa_pair_can_be_soft_deleted()
    {
        $qaPair = QAPair::factory()->create();
        $qaPairId = $qaPair->id;
        
        $qaPair->delete();
        
        $this->assertSoftDeleted('q_a_pairs', ['id' => $qaPairId]);
        $this->assertEquals(0, QAPair::count());
        $this->assertEquals(1, QAPair::withTrashed()->count());
    }

    /** @test */
    public function qa_pair_can_be_restored()
    {
        $qaPair = QAPair::factory()->create();
        $qaPairId = $qaPair->id;
        
        $qaPair->delete();
        $this->assertSoftDeleted('q_a_pairs', ['id' => $qaPairId]);
        
        $qaPair->restore();
        $this->assertDatabaseHas('q_a_pairs', ['id' => $qaPairId, 'deleted_at' => null]);
    }

    /** @test */
    public function qa_pair_scope_active_returns_only_active_pairs()
    {
        // Create active QA pairs
        QAPair::factory()->count(3)->create(['status' => 'active']);
        
        // Create inactive QA pairs
        QAPair::factory()->count(2)->create(['status' => 'inactive']);
        QAPair::factory()->count(1)->create(['status' => 'draft']);
        
        $activePairs = QAPair::active()->get();
        
        $this->assertCount(3, $activePairs);
        $activePairs->each(function ($pair) {
            $this->assertEquals('active', $pair->status);
        });
    }
}

