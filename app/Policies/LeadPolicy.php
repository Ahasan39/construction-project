<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(Permission::LeadsView);
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->hasPermission(Permission::LeadsView);
    }

    public function update(User $user, Lead $lead): bool
    {
        return $user->hasPermission(Permission::LeadsManage);
    }

    public function delete(User $user, Lead $lead): bool
    {
        return $user->hasPermission(Permission::LeadsManage);
    }
}

