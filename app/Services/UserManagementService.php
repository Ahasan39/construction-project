<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class UserManagementService
{
    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * @param  array{name: string, email: string, password: string, role: string, is_active?: bool}  $data
     */
    public function create(User $actor, array $data): User
    {
        $role = UserRole::from($data['role']);

        if ($role === UserRole::SuperAdmin && ! $actor->isSuperAdmin()) {
            throw new AuthorizationException('Only a super administrator can create another super administrator.');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $role,
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->audit->record('user.created', $user, [
            'role' => $role->value,
            'is_active' => $user->is_active,
        ]);

        return $user;
    }

    /**
     * @param  array{name?: string, email?: string, password?: string, role?: string, is_active?: bool}  $data
     */
    public function update(User $actor, User $target, array $data): User
    {
        $oldRole = $target->role;
        $oldActive = $target->is_active;

        $newRole = array_key_exists('role', $data) ? UserRole::from($data['role']) : $oldRole;
        $newActive = array_key_exists('is_active', $data) ? (bool) $data['is_active'] : $oldActive;

        if (! $actor->isSuperAdmin() && ($target->isSuperAdmin() || $newRole === UserRole::SuperAdmin)) {
            throw new AuthorizationException('Only a super administrator can manage a super administrator.');
        }

        if ($actor->is($target) && ($newRole !== $oldRole || $newActive !== $oldActive)) {
            throw ValidationException::withMessages([
                'role' => 'You cannot change your own role or deactivate your own account.',
            ]);
        }

        $losesSuperAdmin = $target->isSuperAdmin() && ($newRole !== UserRole::SuperAdmin || ! $newActive);

        if ($losesSuperAdmin && $this->activeSuperAdminCountExcluding($target) === 0) {
            throw ValidationException::withMessages([
                'role' => 'At least one active super administrator must remain.',
            ]);
        }

        $changes = Arr::only($data, ['name', 'email', 'role', 'is_active']);

        if (array_key_exists('password', $data)) {
            $changes['password'] = $data['password'];
        }

        $target->fill($changes)->save();

        if ($newRole !== $oldRole || $newActive !== $oldActive || array_key_exists('password', $data)) {
            $target->tokens()->delete();
        }

        $this->audit->record('user.updated', $target, [
            'changed' => array_keys($changes),
            'role' => $newRole->value,
            'is_active' => $newActive,
        ]);

        return $target->refresh();
    }

    private function activeSuperAdminCountExcluding(User $target): int
    {
        return User::query()
            ->where('role', UserRole::SuperAdmin->value)
            ->where('is_active', true)
            ->whereKeyNot($target->getKey())
            ->count();
    }
}
