<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            if ($this->isApiRequest($request)) {
                abort(401, 'Unauthenticated.');
            }

            return redirect()->guest(route('login'));
        }

        if ($user->is_active) {
            return $next($request);
        }

        if ($this->isApiRequest($request)) {
            $token = $user->currentAccessToken();

            if ($token && method_exists($token, 'delete')) {
                $token->delete();
            }

            abort(403, 'This account is inactive.');
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->withErrors([
            'email' => 'This account is inactive.',
        ]);
    }

    private function isApiRequest(Request $request): bool
    {
        return $request->is('api/*');
    }
}
