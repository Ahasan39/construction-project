<?php

use App\Http\Controllers\Api\V1\Admin\AuditLogController;
use App\Http\Controllers\Api\V1\Admin\MediaController;
use App\Http\Controllers\Api\V1\Admin\SettingsController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\PublicSettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:api')->group(function (): void {
    Route::get('health', [HealthController::class, 'show'])->name('api.health');
    Route::get('settings/public', [PublicSettingsController::class, 'show'])->name('api.settings.public');

    Route::prefix('auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:login')
            ->name('api.auth.login');

        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
            ->middleware('throttle:password-reset')
            ->name('api.auth.forgot-password');

        Route::post('reset-password', [AuthController::class, 'resetPassword'])
            ->middleware('throttle:password-reset')
            ->name('api.auth.reset-password');

        Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
            Route::get('me', [AuthController::class, 'me'])->name('api.auth.me');
            Route::post('logout', [AuthController::class, 'logout'])->name('api.auth.logout');
            Route::put('password', [AuthController::class, 'changePassword'])->name('api.auth.password');
        });
    });

    Route::middleware(['auth:sanctum', 'active'])->prefix('admin')->group(function (): void {
        Route::get('settings', [SettingsController::class, 'show'])
            ->middleware('permission:settings.view')
            ->name('api.admin.settings.show');

        Route::put('settings', [SettingsController::class, 'update'])
            ->middleware('permission:settings.manage')
            ->name('api.admin.settings.update');

        Route::post('media', [MediaController::class, 'store'])
            ->middleware('permission:media.upload')
            ->name('api.admin.media.store');

        Route::get('users', [UserController::class, 'index'])
            ->middleware('permission:users.view')
            ->name('api.admin.users.index');

        Route::post('users', [UserController::class, 'store'])
            ->middleware('permission:users.manage')
            ->name('api.admin.users.store');

        Route::patch('users/{user}', [UserController::class, 'update'])
            ->middleware('permission:users.manage')
            ->name('api.admin.users.update');

        Route::get('audit-logs', [AuditLogController::class, 'index'])
            ->middleware('permission:audit.view')
            ->name('api.admin.audit-logs.index');
    });
});
