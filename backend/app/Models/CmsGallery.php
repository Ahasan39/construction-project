<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'location',
        'image_url',
        'before_image_url',
        'description',
        'is_published',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'display_order' => 'integer',
        ];
    }
}
