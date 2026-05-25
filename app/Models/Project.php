<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'description',
        'category',
        'technologies',
        'image',
        'live_url',
        'repo_url',
        'status',
    ];

    protected $casts = [
        'technologies' => 'array',
    ];
}
