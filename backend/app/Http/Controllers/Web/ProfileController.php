<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProfilePasswordRequest;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'role_label' => $user->role->label(),
                'is_active' => (bool) $user->is_active,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $previousName = $user->name;
        $newName = $request->validated('name');

        if ($newName !== $previousName) {
            $user->forceFill(['name' => $newName])->save();

            $this->audit->record(
                'profile.updated',
                $user,
                ['changed' => ['name']],
                $user,
            );
        }

        return redirect()
            ->route('admin.profile.edit')
            ->with('status', 'Profile updated.');
    }

    public function updatePassword(UpdateProfilePasswordRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->forceFill(['password' => $request->validated('password')])->save();

        $this->audit->record('profile.password_changed', $user, [], $user);

        return redirect()
            ->route('admin.profile.edit')
            ->with('status', 'Password updated.');
    }
}
