<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsSeoSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_pattern',
        'title',
        'meta_description',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'schema_json',
        'is_noindex',
    ];

    protected function casts(): array
    {
        return [
            'schema_json' => 'array',
            'is_noindex' => 'boolean',
        ];
    }
}
