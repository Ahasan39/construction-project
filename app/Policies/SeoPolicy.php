<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\User;

class SeoPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permission::ContentView) || $user->hasPermission(Permission::SeoManage);
    }

    public function view(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::ContentView) || $user->hasPermission(Permission::SeoManage);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(Permission::SeoManage);
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::SeoManage);
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::SeoManage);
    }
}
