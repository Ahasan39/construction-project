<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_populated_summaries_and_recent_activity(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(2)->create();
        User::factory()->inactive()->create();

        AuditLog::create([
            'user_id' => $admin->getKey(),
            'action' => 'auth.login',
            'subject_type' => User::class,
            'subject_id' => $admin->getKey(),
            'metadata' => ['guard' => 'web'],
        ]);

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('summaries.users.total', 4)
                ->where('summaries.users.active', 3)
                ->has('summaries.settings.checklist', 6)
                ->where('summaries.audit.total', 1)
                ->has('recentActivity', 1)
                ->where('recentActivity.0.action', 'auth.login'));
    }

    public function test_viewer_sees_only_permitted_summaries(): void
    {
        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('summaries.users', null)
                ->where('summaries.media', null)
                ->where('summaries.audit', null)
                ->where('recentActivity', null)
                ->has('summaries.settings.checklist'));
    }

    public function test_editor_sees_media_summary_but_not_users_or_audit(): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('summaries.users', null)
                ->where('summaries.audit', null)
                ->where('recentActivity', null)
                ->has('summaries.media')
                ->has('summaries.settings'));
    }
}
