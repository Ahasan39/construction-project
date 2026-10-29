<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        return [
            'company_name' => ['sometimes', 'string', 'max:160'],
            'short_description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'website_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'locale' => ['sometimes', 'string', 'max:10', 'regex:/^[a-z]{2}(-[A-Z]{2})?$/'],
            'timezone' => ['sometimes', 'string', 'timezone'],
            'default_cta' => ['sometimes', 'nullable', 'string', 'max:80'],
            'business_hours' => ['sometimes', 'nullable', 'array', 'max:7'],
            'business_hours.*.day' => ['required', 'string', 'in:'.implode(',', $days)],
            'business_hours.*.open' => ['nullable', 'date_format:H:i'],
            'business_hours.*.close' => ['nullable', 'date_format:H:i'],
            'business_hours.*.closed' => ['required', 'boolean'],
            'contact_number' => ['sometimes', 'nullable', 'string', 'max:40'],
            'secondary_phone' => ['sometimes', 'nullable', 'string', 'max:40'],
            'email' => ['sometimes', 'nullable', 'string', 'email', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'emergency_label' => ['sometimes', 'nullable', 'string', 'max:160'],
            'estimate_destination' => ['sometimes', 'nullable', 'string', 'max:255', 'starts_with:/'],
            'social_links' => ['sometimes', 'nullable', 'array'],
            'social_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_links.linkedin' => ['nullable', 'url', 'max:255'],
            'social_links.youtube' => ['nullable', 'url', 'max:255'],
            'social_links.x' => ['nullable', 'url', 'max:255'],
            'social_links.tiktok' => ['nullable', 'url', 'max:255'],
            'logo_media_id' => ['sometimes', 'nullable', 'integer', 'exists:media,id'],
            'favicon_media_id' => ['sometimes', 'nullable', 'integer', 'exists:media,id'],
            'primary_color' => ['sometimes', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_color' => ['sometimes', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ];
    }
}
