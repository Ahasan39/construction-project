<?php

namespace Tests\Feature;

use App\Models\CmsArticle;
use App\Models\CmsGallery;
use App\Models\CmsLocation;
use App\Models\CmsSeoSetting;
use App\Models\CmsService;
use App\Models\CmsTestimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CmsContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_cms_modules(): void
    {
        $this->get('/admin/cms/services')->assertRedirect(route('login'));
        $this->get('/admin/cms/locations')->assertRedirect(route('login'));
        $this->get('/admin/cms/gallery')->assertRedirect(route('login'));
        $this->get('/admin/cms/blog')->assertRedirect(route('login'));
        $this->get('/admin/cms/testimonials')->assertRedirect(route('login'));
        $this->get('/admin/cms/seo')->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_cms_pages_but_cannot_modify(): void
    {
        $this->withoutVite();

        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)->get('/admin/cms/services')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Cms/Services')->where('canManage', false));

        $this->actingAs($viewer)->post('/admin/cms/services', ['name' => 'Test Service'])->assertForbidden();
    }

    public function test_editor_can_create_update_and_delete_service(): void
    {
        $editor = User::factory()->editor()->create();

        // Create
        $response = $this->actingAs($editor)->post('/admin/cms/services', [
            'name' => 'Metal Roofing',
            'tagline' => 'Durable standing-seam roofs',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.cms.services.index'));
        $this->assertDatabaseHas('cms_services', [
            'name' => 'Metal Roofing',
            'slug' => 'metal-roofing',
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'cms.service.created',
        ]);

        $service = CmsService::where('slug', 'metal-roofing')->first();
        $this->assertNotNull($service);

        // Update
        $this->actingAs($editor)->patch("/admin/cms/services/{$service->id}", [
            'name' => 'Metal Roofing Solutions',
            'slug' => 'metal-roofing',
            'tagline' => 'Updated tagline',
        ])->assertRedirect(route('admin.cms.services.index'));

        $service->refresh();
        $this->assertSame('Metal Roofing Solutions', $service->name);

        // Delete
        $this->actingAs($editor)->delete("/admin/cms/services/{$service->id}")
            ->assertRedirect(route('admin.cms.services.index'));

        $this->assertDatabaseMissing('cms_services', ['id' => $service->id]);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'cms.service.deleted',
        ]);
    }

    public function test_editor_can_create_and_manage_locations(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->post('/admin/cms/locations', [
            'city' => 'Cleveland',
            'state' => 'OH',
            'region' => 'cleveland-area',
            'phone' => '+1 555-0199',
        ])->assertRedirect(route('admin.cms.locations.index'));

        $this->assertDatabaseHas('cms_locations', [
            'city' => 'Cleveland',
            'slug' => 'cleveland',
            'state' => 'OH',
        ]);

        $location = CmsLocation::where('slug', 'cleveland')->first();
        $this->assertNotNull($location);

        $this->actingAs($editor)->delete("/admin/cms/locations/{$location->id}")
            ->assertRedirect(route('admin.cms.locations.index'));

        $this->assertDatabaseMissing('cms_locations', ['id' => $location->id]);
    }

    public function test_editor_can_create_and_manage_gallery_projects(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->post('/admin/cms/gallery', [
            'title' => 'Suburban Roof Replacement',
            'category' => 'Roofing',
            'location' => 'Nashville, TN',
            'image_url' => '/images/gallery/suburban-roof.webp',
        ])->assertRedirect(route('admin.cms.gallery.index'));

        $this->assertDatabaseHas('cms_galleries', [
            'title' => 'Suburban Roof Replacement',
            'category' => 'Roofing',
        ]);

        $gallery = CmsGallery::where('title', 'Suburban Roof Replacement')->first();
        $this->assertNotNull($gallery);

        $this->actingAs($editor)->delete("/admin/cms/gallery/{$gallery->id}")
            ->assertRedirect(route('admin.cms.gallery.index'));

        $this->assertDatabaseMissing('cms_galleries', ['id' => $gallery->id]);
    }

    public function test_editor_can_create_and_manage_blog_articles(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->post('/admin/cms/blog', [
            'title' => 'Winter Roof Inspection Checklist',
            'category' => 'Roofing',
            'body_html' => '<p>Check your shingles before snow accumulates.</p>',
            'excerpt' => 'Short tips for winter.',
            'is_published' => true,
        ])->assertRedirect(route('admin.cms.blog.index'));

        $this->assertDatabaseHas('cms_articles', [
            'title' => 'Winter Roof Inspection Checklist',
            'slug' => 'winter-roof-inspection-checklist',
            'is_published' => true,
        ]);

        $article = CmsArticle::where('slug', 'winter-roof-inspection-checklist')->first();
        $this->assertNotNull($article);
        $this->assertNotNull($article->published_at);

        $this->actingAs($editor)->delete("/admin/cms/blog/{$article->id}")
            ->assertRedirect(route('admin.cms.blog.index'));

        $this->assertDatabaseMissing('cms_articles', ['id' => $article->id]);
    }

    public function test_editor_can_create_and_manage_testimonials(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)->post('/admin/cms/testimonials', [
            'author' => 'Sarah M.',
            'city_state' => 'Grand Rapids, MI',
            'rating' => 5,
            'service' => 'gutters',
            'body' => 'Excellent gutter guards, no more clogs.',
            'is_featured' => true,
        ])->assertRedirect(route('admin.cms.testimonials.index'));

        $this->assertDatabaseHas('cms_testimonials', [
            'author' => 'Sarah M.',
            'rating' => 5,
            'is_featured' => true,
        ]);

        $testimonial = CmsTestimonial::where('author', 'Sarah M.')->first();
        $this->assertNotNull($testimonial);

        $this->actingAs($editor)->delete("/admin/cms/testimonials/{$testimonial->id}")
            ->assertRedirect(route('admin.cms.testimonials.index'));

        $this->assertDatabaseMissing('cms_testimonials', ['id' => $testimonial->id]);
    }

    public function test_editor_cannot_modify_seo_settings_but_admin_can(): void
    {
        $editor = User::factory()->editor()->create();
        $admin = User::factory()->admin()->create();

        // Editor forbidden
        $this->actingAs($editor)->post('/admin/cms/seo', [
            'route_pattern' => '/roofing',
            'title' => 'Roofing Services',
        ])->assertForbidden();

        // Admin allowed
        $this->actingAs($admin)->post('/admin/cms/seo', [
            'route_pattern' => '/roofing',
            'title' => 'Expert Roofing Contractor | Mr. Roof',
            'meta_description' => 'Top-rated residential and commercial roofing services.',
            'is_noindex' => false,
        ])->assertRedirect(route('admin.cms.seo.index'));

        $this->assertDatabaseHas('cms_seo_settings', [
            'route_pattern' => '/roofing',
            'title' => 'Expert Roofing Contractor | Mr. Roof',
        ]);

        $seo = CmsSeoSetting::where('route_pattern', '/roofing')->first();
        $this->assertNotNull($seo);

        $this->actingAs($admin)->delete("/admin/cms/seo/{$seo->id}")
            ->assertRedirect(route('admin.cms.seo.index'));

        $this->assertDatabaseMissing('cms_seo_settings', ['id' => $seo->id]);
    }
}
