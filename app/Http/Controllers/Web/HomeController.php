<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CmsArticle;
use App\Models\CmsLocation;
use App\Models\CmsService;
use App\Models\CmsTestimonial;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $services = [];
        try {
            if (Schema::hasTable('cms_services')) {
                $services = CmsService::where('is_active', true)
                    ->orderBy('display_order')
                    ->take(6)
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $services = [];
        }

        $locations = [];
        try {
            if (Schema::hasTable('cms_locations')) {
                $locations = CmsLocation::where('is_active', true)
                    ->orderBy('city')
                    ->take(8)
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $locations = [];
        }

        $testimonials = [];
        try {
            if (Schema::hasTable('cms_testimonials')) {
                $testimonials = CmsTestimonial::where('is_published', true)
                    ->where('is_featured', true)
                    ->orderBy('display_order')
                    ->take(3)
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $testimonials = [];
        }

        $articles = [];
        try {
            if (Schema::hasTable('cms_articles')) {
                $articles = CmsArticle::where('is_published', true)
                    ->latest()
                    ->take(3)
                    ->get()
                    ->values()
                    ->all();
            }
        } catch (\Throwable) {
            $articles = [];
        }

        $settings = null;
        try {
            if (Schema::hasTable('site_settings')) {
                $settings = SiteSetting::current();
            }
        } catch (\Throwable) {
            $settings = null;
        }

        return Inertia::render('Welcome', [
            'appName' => (string) ($settings?->company_name ?: config('app.name', 'Mr Roof Construction Project')),
            'services' => $services,
            'locations' => $locations,
            'testimonials' => $testimonials,
            'articles' => $articles,
            'contact' => [
                'phone' => (string) ($settings?->contact_number ?: '1-800-4-MR-ROOF'),
                'email' => (string) ($settings?->email ?: 'contact@mrroof.com'),
                'address' => (string) ($settings?->address ?: '123 Construction Way, Suite 100'),
            ],
            'settings' => $settings ? [
                'company_name' => (string) $settings->company_name,
                'contact_number' => (string) $settings->contact_number,
                'email' => (string) $settings->email,
                'address' => (string) $settings->address,
            ] : (object) [],
        ]);
    }
}

