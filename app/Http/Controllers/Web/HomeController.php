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
            ? CmsService::where('is_active', true)->orderBy('order')->take(6)->get()
            : collect();

        $locations = Schema::hasTable('cms_locations')
            ? CmsLocation::where('is_active', true)->orderBy('city')->take(8)->get()
            : collect();

        $testimonials = Schema::hasTable('cms_testimonials')
            ? CmsTestimonial::where('is_published', true)->where('is_featured', true)->take(3)->get()
            : collect();

        $articles = Schema::hasTable('cms_articles')
            ? CmsArticle::where('is_published', true)->latest()->take(3)->get()
            : collect();

        $settings = Schema::hasTable('site_settings')
            ? SiteSetting::pluck('value', 'key')->all()
            : [];

        return Inertia::render('Welcome', [
            'appName' => config('app.name', 'Mr Roof Construction Project'),
            'services' => $services,
            'locations' => $locations,
            'testimonials' => $testimonials,
            'articles' => $articles,
            'contact' => [
                'phone' => $settings['company_phone'] ?? '1-800-4-MR-ROOF',
                'email' => $settings['company_email'] ?? 'contact@mrroof.com',
                'address' => $settings['company_address'] ?? '123 Construction Way, Suite 100',
            ],
        ]);
    }
}
