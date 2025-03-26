<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QAPairHistory extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qa_pair_history';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'qa_pair_id',
        'question',
        'answer',
        'changed_by',
        'changed_at',
        'change_type',
    ];
    
    /**
     * Get the QA pair that owns the history record.
     */
    public function qaPair()
    {
        return $this->belongsTo(QAPair::class);
    }
    
    /**
     * Get the user who changed the QA pair.
     */
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

