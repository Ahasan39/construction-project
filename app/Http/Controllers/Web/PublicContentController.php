<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CmsArticle;
use App\Models\CmsGallery;
use App\Models\CmsLocation;
use App\Models\CmsService;
use App\Models\CmsTestimonial;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PublicContentController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('AboutPage');
    }

    public function specialOffers(): Response
    {
        return Inertia::render('SpecialOffersPage');
    }

    public function financing(): Response
    {
        return Inertia::render('FinancingPage');
    }

    public function warranties(): Response
    {
        return Inertia::render('WarrantiesPage');
    }

    public function referAFriend(): Response
    {
        return Inertia::render('ReferAFriendPage');
    }

    public function contactUs(): Response
    {
        return Inertia::render('ContactUsPage');
    }

    public function reviews(): Response
    {
        $cmsReviews = [];
        try {
            if (Schema::hasTable('cms_testimonials')) {
                $cmsReviews = CmsTestimonial::where('is_published', true)
                    ->orderBy('display_order')
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $cmsReviews = [];
        }

        return Inertia::render('ReviewsPage', [
            'cmsReviews' => $cmsReviews,
        ]);
    }

    public function gallery(): Response
    {
        $cmsProjects = [];
        try {
            if (Schema::hasTable('cms_galleries')) {
                $cmsProjects = CmsGallery::where('is_active', true)
                    ->latest()
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $cmsProjects = [];
        }

        return Inertia::render('GalleryPage', [
            'cmsProjects' => $cmsProjects,
        ]);
    }

    public function commercialProjects(): Response
    {
        return Inertia::render('CommercialProjectsPage');
    }

    public function salesCareers(): Response
    {
        return Inertia::render('SalesCareersPage');
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('PrivacyPolicyPage');
    }

    public function terms(): Response
    {
        return Inertia::render('TermsPage');
    }

    public function freeEstimate(): Response
    {
        return Inertia::render('FreeEstimatePage');
    }

    public function billpay(): Response
    {
        return Inertia::render('PayMyBillPage');
    }

    public function visualizer(): Response
    {
        return Inertia::render('VisualizerPage');
    }

    public function crew(): Response
    {
        return Inertia::render('ExternalEntryPage', [
            'meta' => [
                'title' => 'Crew Portal',
                'description' => 'External crew/employee portal entry point.',
                'canonicalPath' => '/crew/',
                'noindex' => true,
            ],
            'title' => 'Crew portal',
            'intro' => 'Internal portal — external authentication required.',
            'outboundLabel' => 'Open crew portal',
            'outboundHref' => null,
        ]);
    }

    public function blog(): Response
    {
        $cmsArticles = [];
        try {
            if (Schema::hasTable('cms_articles')) {
                $cmsArticles = CmsArticle::where('is_published', true)
                    ->latest()
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $cmsArticles = [];
        }

        return Inertia::render('BlogIndexPage', [
            'cmsArticles' => $cmsArticles,
        ]);
    }

    public function blogArticle(string $slug): Response
    {
        $article = null;
        try {
            if (Schema::hasTable('cms_articles')) {
                $article = CmsArticle::where('slug', $slug)
                    ->where('is_published', true)
                    ->first();
            }
        } catch (\Throwable) {
            $article = null;
        }

        return Inertia::render('BlogArticlePage', [
            'slug' => $slug,
            'cmsArticle' => $article,
        ]);
    }

    public function locationFreeEstimate(string $locationSlug): Response
    {
        return Inertia::render('LocationFreeEstimatePage', [
            'locationSlug' => $locationSlug,
        ]);
    }

    public function locationFinancing(string $locationSlug): Response
    {
        return Inertia::render('LocationFinancingPage', [
            'locationSlug' => $locationSlug,
        ]);
    }

    public function locationServiceArea(string $locationSlug): Response
    {
        return Inertia::render('LocationServiceAreaPage', [
            'locationSlug' => $locationSlug,
        ]);
    }

    public function locationServiceAreaChild(string $locationSlug, string $childSlug): Response
    {
        return Inertia::render('ServiceAreaChildPage', [
            'locationSlug' => $locationSlug,
            'childSlug' => $childSlug,
        ]);
    }

    public function locationServiceVariant(string $locationSlug, string $serviceSlug, string $variantSlug): Response
    {
        return Inertia::render('ThreeSegmentLocationPage', [
            'locationSlug' => $locationSlug,
            'serviceSlug' => $serviceSlug,
            'variantSlug' => $variantSlug,
        ]);
    }

    public function twoSegment(string $a, string $b): Response
    {
        return Inertia::render('TwoSegmentPage', [
            'a' => $a,
            'b' => $b,
        ]);
    }

    public function topLevelSlug(string $slug): Response
    {
        return Inertia::render('TopLevelSlugPage', [
            'slug' => $slug,
        ]);
    }
}
