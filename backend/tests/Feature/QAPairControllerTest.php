<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\QAPair;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class QAPairControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $category;
    protected $tag;

    public function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        $this->admin = User::factory()->create([
            'is_admin' => true
        ]);
        
        // Create a category
        $this->category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test Category Description'
        ]);
        
        // Create a tag
        $this->tag = Tag::create([
            'name' => 'Test Tag'
        ]);
    }

    /** @test */
    public function admin_can_view_qa_pairs_list()
    {
        // Create some QA pairs
        QAPair::factory()->count(5)->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        $response = $this->actingAs($this->admin)
                         ->getJson('/api/qa-pairs');
        
        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    /** @test */
    public function admin_can_create_qa_pair()
    {
        $qaData = [
            'question' => 'Test Question?',
            'answer' => 'Test Answer',
            'category_id' => $this->category->id,
            'status' => 'active',
            'tags' => [$this->tag->id],
            'metadata' => ['priority' => 'high']
        ];
        
        $response = $this->actingAs($this->admin)
                         ->postJson('/api/qa-pairs', $qaData);
        
        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'question' => 'Test Question?',
                     'answer' => 'Test Answer'
                 ]);
        
        $this->assertDatabaseHas('q_a_pairs', [
            'question' => 'Test Question?',
            'answer' => 'Test Answer'
        ]);
        
        // Check if tag was attached
        $qaPair = QAPair::where('question', 'Test Question?')->first();
        $this->assertTrue($qaPair->tags->contains($this->tag->id));
    }

    /** @test */
    public function admin_can_update_qa_pair()
    {
        $qaPair = QAPair::factory()->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        $updateData = [
            'question' => 'Updated Question?',
            'answer' => 'Updated Answer',
            'status' => 'inactive'
        ];
        
        $response = $this->actingAs($this->admin)
                         ->putJson("/api/qa-pairs/{$qaPair->id}", $updateData);
        
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'question' => 'Updated Question?',
                     'answer' => 'Updated Answer',
                     'status' => 'inactive'
                 ]);
        
        $this->assertDatabaseHas('q_a_pairs', [
            'id' => $qaPair->id,
            'question' => 'Updated Question?',
            'answer' => 'Updated Answer',
            'status' => 'inactive'
        ]);
        
        // Check if history was created
        $this->assertDatabaseHas('qa_history', [
            'qa_pair_id' => $qaPair->id,
            'question' => $qaPair->question, // Original question
            'answer' => $qaPair->answer // Original answer
        ]);
    }

    /** @test */
    public function admin_can_delete_qa_pair()
    {
        $qaPair = QAPair::factory()->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        $response = $this->actingAs($this->admin)
                         ->deleteJson("/api/qa-pairs/{$qaPair->id}");
        
        $response->assertStatus(200);
        
        $this->assertSoftDeleted('q_a_pairs', [
            'id' => $qaPair->id
        ]);
        
        // Check if deletion was recorded in history
        $this->assertDatabaseHas('qa_history', [
            'qa_pair_id' => $qaPair->id,
            'is_deletion' => true
        ]);
    }

    /** @test */
    public function admin_can_restore_qa_pair_version()
    {
        $qaPair = QAPair::factory()->create([
            'question' => 'Original Question',
            'answer' => 'Original Answer',
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        // Update to create history
        $qaPair->update([
            'question' => 'Updated Question',
            'answer' => 'Updated Answer'
        ]);
        
        // Create history record
        $history = $qaPair->history()->create([
            'question' => 'Original Question',
            'answer' => 'Original Answer',
            'category_id' => $qaPair->category_id,
            'status' => $qaPair->status,
            'user_id' => $this->admin->id
        ]);
        
        $response = $this->actingAs($this->admin)
                         ->postJson("/api/qa-pairs/{$qaPair->id}/restore/{$history->id}");
        
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'question' => 'Original Question',
                     'answer' => 'Original Answer'
                 ]);
        
        $this->assertDatabaseHas('q_a_pairs', [
            'id' => $qaPair->id,
            'question' => 'Original Question',
            'answer' => 'Original Answer'
        ]);
    }

    /** @test */
    public function admin_can_view_qa_pair_history()
    {
        $qaPair = QAPair::factory()->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        // Create some history records
        for ($i = 1; $i <= 3; $i++) {
            $qaPair->history()->create([
                'question' => "Question Version $i",
                'answer' => "Answer Version $i",
                'category_id' => $qaPair->category_id,
                'status' => $qaPair->status,
                'user_id' => $this->admin->id
            ]);
        }
        
        $response = $this->actingAs($this->admin)
                         ->getJson("/api/qa-pairs/{$qaPair->id}/history");
        
        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function public_can_query_qa_database()
    {
        // Create some active QA pairs
        QAPair::factory()->count(3)->create([
            'question' => $this->faker->sentence() . ' keyword ' . $this->faker->sentence(),
            'status' => 'active',
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        // Create some inactive QA pairs (shouldn't be returned)
        QAPair::factory()->count(2)->create([
            'question' => $this->faker->sentence() . ' keyword ' . $this->faker->sentence(),
            'status' => 'inactive',
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id
        ]);
        
        $response = $this->postJson('/api/qa/query', [
            'query' => 'keyword'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'results');
    }

    /** @test */
    public function admin_can_bulk_import_qa_pairs()
    {
        $qaPairsData = [
            [
                'question' => 'Bulk Question 1?',
                'answer' => 'Bulk Answer 1',
                'category_id' => $this->category->id,
                'status' => 'active',
                'tags' => [$this->tag->id]
            ],
            [
                'question' => 'Bulk Question 2?',
                'answer' => 'Bulk Answer 2',
                'category_id' => $this->category->id,
                'status' => 'active',
                'tags' => [$this->tag->id]
            ]
        ];
        
        $response = $this->actingAs($this->admin)
                         ->postJson('/api/qa-pairs/bulk-import', [
                             'qa_pairs' => $qaPairsData
                         ]);
        
        $response->assertStatus(200)
                 ->assertJson([
                     'imported_count' => 2,
                     'total_count' => 2
                 ]);
        
        $this->assertDatabaseHas('q_a_pairs', [
            'question' => 'Bulk Question 1?',
            'answer' => 'Bulk Answer 1'
        ]);
        
        $this->assertDatabaseHas('q_a_pairs', [
            'question' => 'Bulk Question 2?',
            'answer' => 'Bulk Answer 2'
        ]);
    }

    /** @test */
    public function filtering_qa_pairs_works_correctly()
    {
        // Create QA pairs with different categories and tags
        $category2 = Category::create(['name' => 'Category 2', 'description' => 'Description 2']);
        $tag2 = Tag::create(['name' => 'Tag 2']);
        
        // Create QA pairs in first category with first tag
        QAPair::factory()->count(3)->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id,
            'status' => 'active'
        ])->each(function ($qaPair) {
            $qaPair->tags()->attach($this->tag->id);
        });
        
        // Create QA pairs in second category with second tag
        QAPair::factory()->count(2)->create([
            'category_id' => $category2->id,
            'user_id' => $this->admin->id,
            'status' => 'active'
        ])->each(function ($qaPair) use ($tag2) {
            $qaPair->tags()->attach($tag2->id);
        });
        
        // Test category filter
        $response = $this->actingAs($this->admin)
                         ->getJson("/api/qa-pairs?category_id={$this->category->id}");
        
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
        
        // Test tag filter
        $response = $this->actingAs($this->admin)
                         ->getJson("/api/qa-pairs?tags[]={$tag2->id}");
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
        
        // Test status filter
        QAPair::factory()->create([
            'category_id' => $this->category->id,
            'user_id' => $this->admin->id,
            'status' => 'draft'
        ]);
        
        $response = $this->actingAs($this->admin)
                         ->getJson("/api/qa-pairs?status=draft");
        
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }
}

