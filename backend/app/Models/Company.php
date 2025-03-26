<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'domain',
        'is_active',
    ];

    /**
     * Get the users for the company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the QA pairs for the company.
     */
    public function qaPairs(): HasMany
    {
        return $this->hasMany(QAPair::class);
    }

    /**
     * Get the categories for the company.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
}

