<?php

namespace App\Providers;

use App\Enums\Permission;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        config(['inertia.ssr.enabled' => false]);

        Gate::before(function (User $user): ?bool {
            return $user->isSuperAdmin() ? true : null;
        });

        foreach (Permission::cases() as $permission) {
            Gate::define(
                $permission->value,
                static fn (User $user): bool => $user->hasPermission($permission)
            );
        }

        Password::defaults(
            static fn (): Password => Password::min(12)->letters()->mixedCase()->numbers()
        );

        ResetPassword::createUrlUsing(static function (User $user, string $token): string {
            $base = config('app.frontend_reset_url');

            if (! $base) {
                $origins = (array) config('cors.allowed_origins', []);
                $base = rtrim((string) ($origins[0] ?? config('app.url')), '/').'/reset-password';
            }

            return $base.'?'.http_build_query([
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ]);
        });

        RateLimiter::for('api', static function (Request $request): Limit {
            return Limit::perMinute(60)->by($request->user()?->getKey() ?: $request->ip());
        });

        RateLimiter::for('login', static function (Request $request): Limit {
            $email = Str::lower((string) $request->input('email'));

            return Limit::perMinute(5)->by($email.'|'.$request->ip());
        });

        RateLimiter::for('password-reset', static function (Request $request): Limit {
            return Limit::perMinute(3)->by($request->ip());
        });

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        DB::prohibitDestructiveCommands($this->app->isProduction());
    }
}
