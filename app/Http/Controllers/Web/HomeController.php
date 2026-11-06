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
        $services = Schema::hasTable('cms_services')
            ? CmsService::where('is_active', true)->orderBy('display_order')->take(6)->get()
            : collect();

        $locations = Schema::hasTable('cms_locations')
            ? CmsLocation::where('is_active', true)->orderBy('city')->take(8)->get()
            : collect();

        $testimonials = Schema::hasTable('cms_testimonials')
            ? CmsTestimonial::where('is_published', true)->where('is_featured', true)->orderBy('display_order')->take(3)->get()
            : collect();

        $articles = Schema::hasTable('cms_articles')
            ? CmsArticle::where('is_published', true)->latest()->take(3)->get()
            : collect();

        $settings = null;
        if (Schema::hasTable('site_settings')) {
            try {
                $settings = SiteSetting::current();
            } catch (\Throwable) {
                $settings = null;
            }
        }

        return Inertia::render('Welcome', [
            'appName' => $settings?->company_name ?: config('app.name', 'Mr Roof Construction Project'),
            'services' => $services,
            'locations' => $locations,
            'testimonials' => $testimonials,
            'articles' => $articles,
            'contact' => [
                'phone' => $settings?->contact_number ?: '1-800-4-MR-ROOF',
                'email' => $settings?->email ?: 'contact@mrroof.com',
                'address' => $settings?->address ?: '123 Construction Way, Suite 100',
            ],
        ]);
    }
}
