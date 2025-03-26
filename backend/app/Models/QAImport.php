<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QAImport extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qa_imports';
    
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
        'filename',
        'imported_by',
        'imported_at',
        'record_count',
        'status',
        'error_message',
    ];
    
    /**
     * Get the user who imported the QA pairs.
     */
    public function importedBy()
    {
        return $this->belongsTo(User::class, 'imported_by');
    }
}

