<?php

namespace App\Http\Resources;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin SiteSetting */
class SiteSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'company_name' => $this->company_name,
            'short_description' => $this->short_description,
            'website_url' => $this->website_url,
            'locale' => $this->locale,
            'timezone' => $this->timezone,
            'default_cta' => $this->default_cta,
            'business_hours' => $this->business_hours ?? [],
            'contact_number' => $this->contact_number,
            'secondary_phone' => $this->secondary_phone,
            'email' => $this->email,
            'address' => $this->address,
            'emergency_label' => $this->emergency_label,
            'estimate_destination' => $this->estimate_destination,
            'social_links' => $this->social_links ?? [],
            'logo_url' => $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null,
            'favicon_url' => $this->favicon_path ? Storage::disk('public')->url($this->favicon_path) : null,
            'primary_color' => $this->primary_color,
            'accent_color' => $this->accent_color,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
