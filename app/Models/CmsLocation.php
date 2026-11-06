<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CmsLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'state',
        'slug',
        'region',
        'phone',
        'address',
        'is_active',
        'display_order',
        'service_areas',
        'supported_services',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'service_areas' => 'array',
            'supported_services' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $model): void {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->city);
            }
        });
    }
}
