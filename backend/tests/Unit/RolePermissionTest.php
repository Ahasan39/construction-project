<?php

namespace Tests\Unit;

use App\Enums\Permission;
use App\Enums\UserRole;
use PHPUnit\Framework\TestCase;

class RolePermissionTest extends TestCase
{
    public function test_super_admin_receives_every_permission(): void
    {
        $this->assertSame(Permission::values(), UserRole::SuperAdmin->permissionValues());
    }

    public function test_admin_has_operational_permissions(): void
    {
        $permissions = UserRole::Admin->permissionValues();

        $this->assertContains(Permission::SettingsManage->value, $permissions);
        $this->assertContains(Permission::UsersManage->value, $permissions);
        $this->assertContains(Permission::LeadsManage->value, $permissions);
        $this->assertContains(Permission::AuditView->value, $permissions);
    }

    public function test_editor_cannot_manage_settings_users_or_audit(): void
    {
        $permissions = UserRole::Editor->permissionValues();

        $this->assertContains(Permission::ContentManage->value, $permissions);
        $this->assertContains(Permission::MediaUpload->value, $permissions);
        $this->assertNotContains(Permission::SettingsManage->value, $permissions);
        $this->assertNotContains(Permission::UsersManage->value, $permissions);
        $this->assertNotContains(Permission::AuditView->value, $permissions);
    }

    public function test_viewer_is_read_only(): void
    {
        $permissions = UserRole::Viewer->permissionValues();

        $this->assertContains(Permission::ContentView->value, $permissions);
        $this->assertContains(Permission::LeadsView->value, $permissions);
        $this->assertNotContains(Permission::ContentManage->value, $permissions);
        $this->assertNotContains(Permission::MediaUpload->value, $permissions);
        $this->assertNotContains(Permission::SettingsManage->value, $permissions);
    }
}
