<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'permissions' => $user->permissionValues(),
                ] : null,
            ],
            'flash' => [
                'status' => fn (): ?string => $request->session()->get('status'),
                'error' => fn (): ?string => $request->session()->get('error'),
            ],
        ]);
    }
}
