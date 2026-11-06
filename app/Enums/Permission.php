<?php

namespace App\Enums;

enum Permission: string
{
    case ContentView = 'content.view';
    case ContentManage = 'content.manage';
    case MediaUpload = 'media.upload';
    case LeadsView = 'leads.view';
    case LeadsManage = 'leads.manage';
    case SeoManage = 'seo.manage';
    case MarketingManage = 'marketing.manage';
    case SettingsView = 'settings.view';
    case SettingsManage = 'settings.manage';
    case UsersView = 'users.view';
    case UsersManage = 'users.manage';
    case AuditView = 'audit.view';

    /** @return list<string> */
    public static function values(): array
    {
        return array_map(static fn (self $permission): string => $permission->value, self::cases());
    }
}
