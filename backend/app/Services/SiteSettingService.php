<?php

namespace App\Services;

use App\Models\Media;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SiteSettingService
{
    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): SiteSetting
    {
        $logoProvided = array_key_exists('logo_media_id', $data);
        $faviconProvided = array_key_exists('favicon_media_id', $data);
        $logoMediaId = $data['logo_media_id'] ?? null;
        $faviconMediaId = $data['favicon_media_id'] ?? null;

        unset($data['logo_media_id'], $data['favicon_media_id']);

        return DB::transaction(function () use ($data, $logoProvided, $logoMediaId, $faviconProvided, $faviconMediaId): SiteSetting {
            $settings = SiteSetting::current();
            $settings->fill($data);

            if ($logoProvided) {
                $settings->logo_path = $this->mediaPath($logoMediaId, 'logo');
            }

            if ($faviconProvided) {
                $settings->favicon_path = $this->mediaPath($faviconMediaId, 'favicon');
            }

            $settings->save();

            $this->audit->record('settings.updated', $settings, [
                'fields' => array_keys($data),
                'logo_changed' => $logoProvided,
                'favicon_changed' => $faviconProvided,
            ]);

            return $settings;
        });
    }

    private function mediaPath(?int $mediaId, string $purpose): ?string
    {
        if ($mediaId === null) {
            return null;
        }

        $media = Media::query()->findOrFail($mediaId);

        if ($media->purpose !== $purpose) {
            $field = $purpose === 'logo' ? 'logo_media_id' : 'favicon_media_id';

            throw ValidationException::withMessages([
                $field => ["The selected media was not uploaded for the {$purpose} purpose."],
            ]);
        }

        return $media->path;
    }
}
