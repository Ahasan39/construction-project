<?php

namespace App\Http\Controllers\Web;

use App\Enums\Permission;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $usersSummary = null;
        if ($user?->hasPermission(Permission::UsersView)) {
            $usersSummary = [
                'total' => User::query()->count(),
                'active' => User::query()->where('is_active', true)->count(),
            ];
        }

        $mediaSummary = null;
        if ($user?->hasPermission(Permission::MediaUpload)) {
            $mediaSummary = [
                'total' => Media::query()->count(),
            ];
        }

        $recentActivity = null;
        $auditSummary = null;
        if ($user?->hasPermission(Permission::AuditView)) {
            $auditSummary = [
                'total' => AuditLog::query()->count(),
                'last_24h' => AuditLog::query()
                    ->where('created_at', '>=', now()->subDay())
                    ->count(),
            ];

            $recentActivity = AuditLog::query()
                ->with('user:id,name')
                ->latest('created_at')
                ->limit(6)
                ->get()
                ->map(fn (AuditLog $entry) => [
                    'id' => $entry->id,
                    'action' => $entry->action,
                    'actor' => $entry->user?->name,
                    'created_at' => $entry->created_at?->toIso8601String(),
                ])
                ->all();
        }

        $settingsSummary = null;
        if ($user?->hasPermission(Permission::SettingsView)) {
            $settings = SiteSetting::current();

            $checklist = [
                ['label' => 'Company name', 'done' => filled($settings->company_name)],
                ['label' => 'Contact email', 'done' => filled($settings->email)],
                ['label' => 'Primary phone', 'done' => filled($settings->contact_number)],
                ['label' => 'Street address', 'done' => filled($settings->address)],
                ['label' => 'Logo uploaded', 'done' => filled($settings->logo_path)],
                ['label' => 'Favicon uploaded', 'done' => filled($settings->favicon_path)],
            ];

            $settingsSummary = [
                'checklist' => $checklist,
                'completed' => count(array_filter($checklist, fn ($row) => $row['done'])),
                'total' => count($checklist),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'summaries' => [
                'users' => $usersSummary,
                'media' => $mediaSummary,
                'audit' => $auditSummary,
                'settings' => $settingsSummary,
            ],
            'recentActivity' => $recentActivity,
            'session' => [
                'last_login_at' => $user?->last_login_at?->toIso8601String(),
            ],
        ]);
    }
}
