<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    public function test_home_page_renders_with_inertia(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->has('appName')
                ->has('services')
                ->has('locations')
                ->has('testimonials')
                ->has('articles')
                ->has('contact')
                ->has('settings')
            );
    }

    public function test_static_company_and_resource_pages_render(): void
    {
        $pages = [
            '/about' => 'AboutPage',
            '/special-offers' => 'SpecialOffersPage',
            '/financing' => 'FinancingPage',
            '/warranties' => 'WarrantiesPage',
            '/refer-a-friend' => 'ReferAFriendPage',
            '/contact-us' => 'ContactUsPage',
            '/reviews' => 'ReviewsPage',
            '/gallery' => 'GalleryPage',
            '/commercial-projects' => 'CommercialProjectsPage',
            '/careers/sales' => 'SalesCareersPage',
            '/privacy-policy' => 'PrivacyPolicyPage',
            '/terms-and-conditions' => 'TermsPage',
            '/free-estimate' => 'FreeEstimatePage',
            '/billpay' => 'PayMyBillPage',
            '/visualizer' => 'VisualizerPage',
            '/crew' => 'ExternalEntryPage',
        ];

        foreach ($pages as $url => $component) {
            $response = $this->get($url);
            $response->assertStatus(200)
                ->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_blog_index_and_article_routes_render(): void
    {
        $indexResponse = $this->get('/blog');
        $indexResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('BlogIndexPage')
                ->has('cmsArticles')
            );

        $articleResponse = $this->get('/blog/how-to-choose-shingles');
        $articleResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('BlogArticlePage')
                ->where('slug', 'how-to-choose-shingles')
            );
    }

    public function test_location_scoped_pages_render(): void
    {
        $estimateResponse = $this->get('/nashville/free-estimate');
        $estimateResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('LocationFreeEstimatePage')
                ->where('locationSlug', 'nashville')
            );

        $financingResponse = $this->get('/nashville/financing');
        $financingResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('LocationFinancingPage')
                ->where('locationSlug', 'nashville')
            );

        $serviceAreaResponse = $this->get('/nashville/service-area');
        $serviceAreaResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('LocationServiceAreaPage')
                ->where('locationSlug', 'nashville')
            );

        $serviceAreaChildResponse = $this->get('/nashville/service-area/franklin');
        $serviceAreaChildResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('ServiceAreaChildPage')
                ->where('locationSlug', 'nashville')
                ->where('childSlug', 'franklin')
            );

        $threeSegmentResponse = $this->get('/nashville/roofing/commercial-roofing');
        $threeSegmentResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('ThreeSegmentLocationPage')
                ->where('locationSlug', 'nashville')
                ->where('serviceSlug', 'roofing')
                ->where('variantSlug', 'commercial-roofing')
            );
    }

    public function test_generic_one_and_two_segment_dispatchers_render(): void
    {
        $oneSegmentResponse = $this->get('/roofing');
        $oneSegmentResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('TopLevelSlugPage')
                ->where('slug', 'roofing')
            );

        $twoSegmentResponse = $this->get('/roofing/metal-roofing');
        $twoSegmentResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('TwoSegmentPage')
                ->where('a', 'roofing')
                ->where('b', 'metal-roofing')
            );
    }

    public function test_admin_routes_are_not_captured_by_public_catchalls(): void
    {
        $loginResponse = $this->get('/admin/login');
        $loginResponse->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Login'));

        $protectedResponse = $this->get('/admin/leads');
        $protectedResponse->assertRedirect('/admin/login');
    }
}
