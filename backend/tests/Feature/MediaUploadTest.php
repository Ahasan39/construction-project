<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_upload_a_png_which_is_reencoded_and_recorded(): void
    {
        Storage::fake('public');

        $editor = User::factory()->editor()->create();
        $token = $this->apiToken($editor);

        $response = $this->withApiToken($token)->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('logo.png', 320, 180),
            'purpose' => 'logo',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.purpose', 'logo')
            ->assertJsonPath('data.mime_type', 'image/png')
            ->assertJsonPath('data.width', 320)
            ->assertJsonPath('data.height', 180);

        $media = Media::query()->firstOrFail();

        Storage::disk('public')->assertExists($media->path);
        $this->assertStringStartsWith('uploads/logo/', $media->path);
        $this->assertSame($editor->id, $media->uploaded_by);
        $this->assertDatabaseHas('audit_logs', ['action' => 'media.uploaded']);
    }

    public function test_viewer_cannot_upload_media(): void
    {
        Storage::fake('public');

        $viewer = User::factory()->viewer()->create();

        $this->withApiToken($this->apiToken($viewer))->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('logo.png'),
            'purpose' => 'logo',
        ])->assertForbidden();
    }

    public function test_svg_and_disguised_scripts_are_rejected(): void
    {
        Storage::fake('public');

        $editor = User::factory()->editor()->create();
        $token = $this->apiToken($editor);

        $this->withApiToken($token)->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->createWithContent(
                'logo.svg',
                '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
            ),
            'purpose' => 'logo',
        ])->assertStatus(422)->assertJsonValidationErrors('file');

        $this->withApiToken($token)->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->createWithContent('logo.png', '<?php echo "owned";'),
            'purpose' => 'logo',
        ])->assertStatus(422)->assertJsonValidationErrors('file');

        $this->assertSame(0, Media::query()->count());
    }

    public function test_upload_requires_a_known_purpose(): void
    {
        Storage::fake('public');

        $editor = User::factory()->editor()->create();

        $this->withApiToken($this->apiToken($editor))->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('logo.png'),
            'purpose' => 'script',
        ])->assertStatus(422)->assertJsonValidationErrors('purpose');
    }
}
