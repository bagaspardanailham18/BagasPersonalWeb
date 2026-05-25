<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'category',
        'date',
        'reading_time',
        'cover_image',
        'status',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
        'date' => 'date',
    ];
}
