<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_settings_are_available_without_authentication(): void
    {
        $this->getJson('/api/v1/settings/public')
            ->assertOk()
            ->assertJsonPath('data.company_name', 'Construction Project')
            ->assertJsonPath('data.primary_color', '#0f2231')
            ->assertJsonStructure(['data' => ['business_hours', 'social_links', 'logo_url', 'favicon_url']]);
    }

    public function test_admin_can_update_settings_and_change_is_audited(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);

        $response = $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'company_name' => 'Ahasan Builders',
            'contact_number' => '+1 555 0100',
            'email' => 'hello@example.com',
            'primary_color' => '#123abc',
            'social_links' => ['facebook' => 'https://facebook.com/example'],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.company_name', 'Ahasan Builders')
            ->assertJsonPath('data.contact_number', '+1 555 0100')
            ->assertJsonPath('data.primary_color', '#123abc');

        $this->assertDatabaseHas('site_settings', [
            'id' => 1,
            'company_name' => 'Ahasan Builders',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'settings.updated',
            'user_id' => $admin->id,
        ]);

        $this->getJson('/api/v1/settings/public')
            ->assertOk()
            ->assertJsonPath('data.company_name', 'Ahasan Builders');
    }

    public function test_settings_are_stored_as_a_singleton(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', ['company_name' => 'One']);
        $this->withApiToken($token)->putJson('/api/v1/admin/settings', ['company_name' => 'Two']);
        $this->getJson('/api/v1/settings/public');

        $this->assertSame(1, SiteSetting::query()->count());
        $this->assertSame('Two', SiteSetting::current()->company_name);
    }

    public function test_logo_and_favicon_must_match_their_media_purpose(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);
        $logo = $this->media('logo');
        $favicon = $this->media('favicon');

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'logo_media_id' => $logo->id,
            'favicon_media_id' => $favicon->id,
        ])->assertOk()
            ->assertJsonPath('data.logo_url', $logo->url)
            ->assertJsonPath('data.favicon_url', $favicon->url);

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'logo_media_id' => $favicon->id,
        ])->assertStatus(422)
            ->assertJsonValidationErrors('logo_media_id');
    }

    public function test_settings_validation_rejects_invalid_colors(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'primary_color' => 'red',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('primary_color');
    }

    public function test_admin_can_clear_a_logo_by_sending_null(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);
        $logo = $this->media('logo');

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'logo_media_id' => $logo->id,
        ])->assertOk();

        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [
            'logo_media_id' => null,
        ])->assertOk()
            ->assertJsonPath('data.logo_url', null);

        $this->assertNull(SiteSetting::current()->logo_path);
    }

    private function media(string $purpose): Media
    {
        return Media::create([
            'disk' => 'public',
            'path' => "uploads/{$purpose}/test.png",
            'original_name' => 'test.png',
            'mime_type' => 'image/png',
            'extension' => 'png',
            'size' => 100,
            'width' => 10,
            'height' => 10,
            'checksum' => str_repeat('a', 64),
            'purpose' => $purpose,
        ]);
    }
}
