<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_general_settings(): void
    {
        $this->get('/admin/settings/general')->assertRedirect(route('login'));
        $this->put('/admin/settings/general', [])->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_general_settings_but_cannot_update_them(): void
    {
        $this->withoutVite();

        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)
            ->get('/admin/settings/general')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Settings/General')
                ->where('settings.company_name', 'Construction Project')
                ->where('settings.primary_color', '#0f2231')
                ->where('settings.estimate_destination', '/free-estimate'));

        $this->actingAs($viewer)
            ->put('/admin/settings/general', ['company_name' => 'Viewer edit'])
            ->assertForbidden();
    }

    public function test_admin_can_update_general_settings_and_the_change_is_audited(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->from(route('admin.settings.general.edit'))
            ->put('/admin/settings/general', [
                'company_name' => 'Ahasan Builders',
                'short_description' => 'Exterior construction across the Midwest.',
                'website_url' => 'https://example.com',
                'locale' => 'en-US',
                'timezone' => 'America/New_York',
                'default_cta' => 'Book an estimate',
                'business_hours' => [
                    ['day' => 'Monday', 'open' => '08:00', 'close' => '17:00', 'closed' => false],
                    ['day' => 'Sunday', 'open' => null, 'close' => null, 'closed' => true],
                ],
                'contact_number' => '+1 555 0100',
                'secondary_phone' => '+1 555 0101',
                'email' => 'hello@example.com',
                'address' => '123 Main Street, Columbus, OH',
                'emergency_label' => 'Storm damage? Call our emergency line 24/7.',
                'estimate_destination' => '/contact',
                'social_links' => [
                    'facebook' => 'https://facebook.com/example',
                    'instagram' => 'https://instagram.com/example',
                ],
                'primary_color' => '#123abc',
                'accent_color' => '#abcdef',
            ]);

        $response->assertRedirect(route('admin.settings.general.edit'))
            ->assertSessionHas('status', 'General settings saved.');

        $settings = SiteSetting::current();

        $this->assertSame('Ahasan Builders', $settings->company_name);
        $this->assertSame('hello@example.com', $settings->email);
        $this->assertSame('/contact', $settings->estimate_destination);
        $this->assertSame('https://facebook.com/example', $settings->social_links['facebook']);
        $this->assertSame('#123abc', $settings->primary_color);

        $this->assertDatabaseHas('site_settings', [
            'id' => 1,
            'company_name' => 'Ahasan Builders',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'settings.updated',
            'user_id' => $admin->id,
        ]);
    }

    public function test_general_settings_validation_errors_are_returned(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->from(route('admin.settings.general.edit'))
            ->put('/admin/settings/general', [
                'company_name' => '',
                'email' => 'not-an-email',
                'primary_color' => 'red',
                'estimate_destination' => 'contact',
            ])
            ->assertRedirect(route('admin.settings.general.edit'))
            ->assertSessionHasErrors([
                'company_name',
                'email',
                'primary_color',
                'estimate_destination',
            ]);
    }

    public function test_editor_can_upload_a_logo_through_the_web_endpoint(): void
    {
        Storage::fake('public');

        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)
            ->post('/admin/media', [
                'file' => UploadedFile::fake()->image('logo.png', 320, 180),
                'purpose' => 'logo',
            ])
            ->assertCreated()
            ->assertJsonPath('data.purpose', 'logo')
            ->assertJsonPath('data.mime_type', 'image/png');

        $this->assertDatabaseHas('media', [
            'purpose' => 'logo',
            'uploaded_by' => $editor->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'media.uploaded',
            'user_id' => $editor->id,
        ]);
    }

    public function test_viewer_cannot_upload_media_through_the_web_endpoint(): void
    {
        Storage::fake('public');

        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)
            ->post('/admin/media', [
                'file' => UploadedFile::fake()->image('logo.png'),
                'purpose' => 'logo',
            ])
            ->assertForbidden();
    }
}
