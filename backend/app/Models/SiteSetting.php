<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_name',
        'short_description',
        'website_url',
        'locale',
        'timezone',
        'default_cta',
        'business_hours',
        'contact_number',
        'secondary_phone',
        'email',
        'address',
        'emergency_label',
        'estimate_destination',
        'social_links',
        'logo_path',
        'favicon_path',
        'primary_color',
        'accent_color',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'business_hours' => 'array',
            'social_links' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1], static::defaults());
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'company_name' => 'Construction Project',
            'short_description' => null,
            'website_url' => null,
            'locale' => 'en-US',
            'timezone' => 'America/New_York',
            'default_cta' => 'Request a Free Estimate',
            'business_hours' => [
                ['day' => 'Monday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                ['day' => 'Tuesday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                ['day' => 'Wednesday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                ['day' => 'Thursday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                ['day' => 'Friday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                ['day' => 'Saturday', 'open' => '09:00', 'close' => '13:00', 'closed' => false],
                ['day' => 'Sunday', 'open' => '00:00', 'close' => '00:00', 'closed' => true],
            ],
            'contact_number' => null,
            'secondary_phone' => null,
            'email' => null,
            'address' => null,
            'emergency_label' => null,
            'estimate_destination' => '/free-estimate',
            'social_links' => [
                'facebook' => null,
                'instagram' => null,
                'linkedin' => null,
                'youtube' => null,
            ],
            'logo_path' => null,
            'favicon_path' => null,
            'primary_color' => '#0f2231',
            'accent_color' => '#d9232a',
        ];
    }
}
