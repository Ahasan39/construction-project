<?php

namespace App\Models;

use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'location',
        'status',
        'consent_reminders',
        'consent_promotions',
        'notes',
        'ip_address',
        'user_agent',
        'contacted_at',
        'scheduled_at',
        'closed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => LeadStatus::class,
            'consent_reminders' => 'boolean',
            'consent_promotions' => 'boolean',
            'contacted_at' => 'datetime',
            'scheduled_at' => 'datetime',
            'closed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}

