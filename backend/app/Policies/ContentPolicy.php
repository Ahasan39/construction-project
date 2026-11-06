<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\User;

class ContentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permission::ContentView);
    }

    public function view(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::ContentView);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(Permission::ContentManage);
    }

    public function update(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::ContentManage);
    }

    public function delete(User $user, mixed $model): bool
    {
        return $user->hasPermission(Permission::ContentManage);
    }
}
