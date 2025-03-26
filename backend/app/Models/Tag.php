<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];
    
    /**
     * The QA pairs that belong to the tag.
     */
    public function qaPairs()
    {
        return $this->belongsToMany(QAPair::class, 'qa_pair_tags');
    }
}

