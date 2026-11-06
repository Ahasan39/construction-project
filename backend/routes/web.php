<?php

use App\Http\Controllers\Web\AuditLogController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\InertiaCheckController;
use App\Http\Controllers\Web\LeadController;
use App\Http\Controllers\Web\MediaController;
use App\Http\Controllers\Web\ProfileController;
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
