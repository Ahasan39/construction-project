<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\MediaController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/inertia-check', function () {
    return Inertia::render('InertiaCheck', [
        'message' => 'Laravel + Inertia + React are wired up.',
        'checkedAt' => now()->toIso8601String(),
    ]);
})->name('inertia.check');

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

    Route::get('/users', function () {
        return Inertia::render('Admin/Users');
    })->middleware('permission:users.view')->name('admin.users.index');

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

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name'),
        'status' => 'ok',
        'health' => url('/api/v1/health'),
    ]);
});
