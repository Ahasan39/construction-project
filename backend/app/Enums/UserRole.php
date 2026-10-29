<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';

    /** @return list<Permission> */
    public function permissions(): array
    {
        return match ($this) {
            self::SuperAdmin => Permission::cases(),
            self::Admin => [
                Permission::ContentView,
                Permission::ContentManage,
                Permission::MediaUpload,
                Permission::LeadsView,
                Permission::LeadsManage,
                Permission::SeoManage,
                Permission::MarketingManage,
                Permission::SettingsView,
                Permission::SettingsManage,
                Permission::UsersView,
                Permission::UsersManage,
                Permission::AuditView,
            ],
            self::Editor => [
                Permission::ContentView,
                Permission::ContentManage,
                Permission::MediaUpload,
                Permission::LeadsView,
                Permission::SettingsView,
            ],
            self::Viewer => [
                Permission::ContentView,
                Permission::LeadsView,
                Permission::SettingsView,
            ],
        };
    }

    /** @return list<string> */
    public function permissionValues(): array
    {
        return array_map(
            static fn (Permission $permission): string => $permission->value,
            $this->permissions()
        );
    }

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super administrator',
            self::Admin => 'Administrator',
            self::Editor => 'Editor',
            self::Viewer => 'Viewer',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $role): string => $role->value, self::cases());
    }
}
