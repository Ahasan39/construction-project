<?php

use App\Http\Controllers\Web\AuditLogController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\Cms\CmsArticleController;
use App\Http\Controllers\Web\Cms\CmsGalleryController;
use App\Http\Controllers\Web\Cms\CmsLocationController;
use App\Http\Controllers\Web\Cms\CmsSeoController;
use App\Http\Controllers\Web\Cms\CmsServiceController;
use App\Http\Controllers\Web\Cms\CmsTestimonialController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\InertiaCheckController;
use App\Http\Controllers\Web\LeadController;
use App\Http\Controllers\Web\MediaController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\PublicContentController;
use App\Http\Controllers\Web\SettingsController;
use App\Http\Controllers\Web\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/inertia-check', InertiaCheckController::class)->name('inertia.check');

Route::middleware('guest')->group(function (): void {
    Route::get('/admin/login', [AuthController::class, 'create'])->name('login');
    Route::post('/admin/login', [AuthController::class, 'store'])
        ->middleware('throttle:login')
        ->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/admin/logout', [AuthController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'active'])->prefix('admin')->group(function (): void {
    Route::get('/', DashboardController::class)->name('admin.dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])
        ->middleware('throttle:login')
        ->name('admin.profile.password.update');

    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view')
        ->name('admin.users.index');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.manage')
        ->name('admin.users.store');

    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:users.manage')
        ->name('admin.users.update');

    Route::get('/leads', [LeadController::class, 'index'])
        ->middleware('permission:leads.view')
        ->name('admin.leads.index');

    Route::get('/leads/export', [LeadController::class, 'exportCsv'])
        ->middleware('permission:leads.view')
        ->name('admin.leads.export');

    Route::patch('/leads/{lead}', [LeadController::class, 'update'])
        ->middleware('permission:leads.manage')
        ->name('admin.leads.update');

    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('permission:audit.view')
        ->name('admin.audit-logs.index');

    Route::prefix('cms')->group(function (): void {
        Route::get('/services', [CmsServiceController::class, 'index'])->name('admin.cms.services.index');
        Route::post('/services', [CmsServiceController::class, 'store'])->name('admin.cms.services.store');
        Route::patch('/services/{service}', [CmsServiceController::class, 'update'])->name('admin.cms.services.update');
        Route::delete('/services/{service}', [CmsServiceController::class, 'destroy'])->name('admin.cms.services.destroy');

        Route::get('/locations', [CmsLocationController::class, 'index'])->name('admin.cms.locations.index');
        Route::post('/locations', [CmsLocationController::class, 'store'])->name('admin.cms.locations.store');
        Route::patch('/locations/{location}', [CmsLocationController::class, 'update'])->name('admin.cms.locations.update');
        Route::delete('/locations/{location}', [CmsLocationController::class, 'destroy'])->name('admin.cms.locations.destroy');

        Route::get('/gallery', [CmsGalleryController::class, 'index'])->name('admin.cms.gallery.index');
        Route::post('/gallery', [CmsGalleryController::class, 'store'])->name('admin.cms.gallery.store');
        Route::patch('/gallery/{gallery}', [CmsGalleryController::class, 'update'])->name('admin.cms.gallery.update');
        Route::delete('/gallery/{gallery}', [CmsGalleryController::class, 'destroy'])->name('admin.cms.gallery.destroy');

        Route::get('/blog', [CmsArticleController::class, 'index'])->name('admin.cms.blog.index');
        Route::post('/blog', [CmsArticleController::class, 'store'])->name('admin.cms.blog.store');
        Route::patch('/blog/{article}', [CmsArticleController::class, 'update'])->name('admin.cms.blog.update');
        Route::delete('/blog/{article}', [CmsArticleController::class, 'destroy'])->name('admin.cms.blog.destroy');

        Route::get('/testimonials', [CmsTestimonialController::class, 'index'])->name('admin.cms.testimonials.index');
        Route::post('/testimonials', [CmsTestimonialController::class, 'store'])->name('admin.cms.testimonials.store');
        Route::patch('/testimonials/{testimonial}', [CmsTestimonialController::class, 'update'])->name('admin.cms.testimonials.update');
        Route::delete('/testimonials/{testimonial}', [CmsTestimonialController::class, 'destroy'])->name('admin.cms.testimonials.destroy');

        Route::get('/seo', [CmsSeoController::class, 'index'])->name('admin.cms.seo.index');
        Route::post('/seo', [CmsSeoController::class, 'store'])->name('admin.cms.seo.store');
        Route::patch('/seo/{seoSetting}', [CmsSeoController::class, 'update'])->name('admin.cms.seo.update');
        Route::delete('/seo/{seoSetting}', [CmsSeoController::class, 'destroy'])->name('admin.cms.seo.destroy');
    });

    Route::get('/settings/general', [SettingsController::class, 'edit'])
        ->middleware('permission:settings.view')
        ->name('admin.settings.general.edit');

    Route::put('/settings/general', [SettingsController::class, 'update'])
        ->middleware('permission:settings.manage')
        ->name('admin.settings.general.update');

    Route::post('/media', [MediaController::class, 'store'])
        ->middleware('permission:media.upload')
        ->name('admin.media.store');
});

Route::get('/', HomeController::class)->name('home');

// Public Static & Informational Pages
Route::get('/free-estimate', [PublicContentController::class, 'freeEstimate'])->name('public.free-estimate');
Route::get('/about', [PublicContentController::class, 'about'])->name('public.about');
Route::get('/special-offers', [PublicContentController::class, 'specialOffers'])->name('public.special-offers');
Route::get('/financing', [PublicContentController::class, 'financing'])->name('public.financing');
Route::get('/warranties', [PublicContentController::class, 'warranties'])->name('public.warranties');
Route::get('/refer-a-friend', [PublicContentController::class, 'referAFriend'])->name('public.refer-a-friend');
Route::get('/contact-us', [PublicContentController::class, 'contactUs'])->name('public.contact-us');
Route::get('/reviews', [PublicContentController::class, 'reviews'])->name('public.reviews');
Route::get('/gallery', [PublicContentController::class, 'gallery'])->name('public.gallery');
Route::get('/commercial-projects', [PublicContentController::class, 'commercialProjects'])->name('public.commercial-projects');
Route::get('/careers/sales', [PublicContentController::class, 'salesCareers'])->name('public.careers.sales');
Route::get('/privacy-policy', [PublicContentController::class, 'privacyPolicy'])->name('public.privacy-policy');
Route::get('/terms-and-conditions', [PublicContentController::class, 'terms'])->name('public.terms');
Route::get('/billpay', [PublicContentController::class, 'billpay'])->name('public.billpay');
Route::get('/visualizer', [PublicContentController::class, 'visualizer'])->name('public.visualizer');
Route::get('/crew', [PublicContentController::class, 'crew'])->name('public.crew');

// Public Blog
Route::get('/blog', [PublicContentController::class, 'blog'])->name('public.blog.index');
Route::get('/blog/{slug}', [PublicContentController::class, 'blogArticle'])
    ->where('slug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.blog.article');

// Public Location Scoped Capability Routes
Route::get('/{locationSlug}/free-estimate', [PublicContentController::class, 'locationFreeEstimate'])
    ->where('locationSlug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.location.free-estimate');
Route::get('/{locationSlug}/financing', [PublicContentController::class, 'locationFinancing'])
    ->where('locationSlug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.location.financing');
Route::get('/{locationSlug}/service-area', [PublicContentController::class, 'locationServiceArea'])
    ->where('locationSlug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.location.service-area');
Route::get('/{locationSlug}/service-area/{childSlug}', [PublicContentController::class, 'locationServiceAreaChild'])
    ->where('locationSlug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.location.service-area-child');

// 3-Segment Dynamic Route: {locationSlug}/{serviceSlug}/{variantSlug}
Route::get('/{locationSlug}/{serviceSlug}/{variantSlug}', [PublicContentController::class, 'locationServiceVariant'])
    ->where('locationSlug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.location.service-variant');

// 2-Segment Dispatcher: {service}/{variant} or {location}/{service}
Route::get('/{a}/{b}', [PublicContentController::class, 'twoSegment'])
    ->where('a', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.two-segment');

// 1-Segment Dispatcher: {service} or {location}
Route::get('/{slug}', [PublicContentController::class, 'topLevelSlug'])
    ->where('slug', '^(?!admin|api|storage|build|_vite)[a-zA-Z0-9_-]+$')
    ->name('public.top-level-slug');
