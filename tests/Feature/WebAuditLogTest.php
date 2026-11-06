<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebAuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_audit_logs(): void
    {
        $this->get('/admin/audit-logs')->assertRedirect(route('login'));
    }

    public function test_viewer_and_editor_cannot_view_audit_logs(): void
    {
        $this->withoutVite();

        $viewer = User::factory()->viewer()->create();
        $editor = User::factory()->editor()->create();

        $this->actingAs($viewer)
            ->get('/admin/audit-logs')
            ->assertForbidden();

        $this->actingAs($editor)
            ->get('/admin/audit-logs')
            ->assertForbidden();
    }

    public function test_admin_can_view_audit_logs_with_inertia_props(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create();

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'settings.updated',
            'subject_type' => User::class,
            'subject_id' => $admin->id,
            'metadata' => ['key' => 'value'],
            'ip_address' => '127.0.0.1',
        ]);

        $this->actingAs($admin)
            ->get('/admin/audit-logs')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AuditLogs')
                ->has('logs.data', 1)
                ->where('logs.data.0.action', 'settings.updated')
                ->where('logs.data.0.ip_address', '127.0.0.1')
                ->has('actions')
                ->has('filters'));
    }

    public function test_admin_can_filter_audit_logs_by_action_and_search(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create(['name' => 'Commander Admin']);
        $other = User::factory()->editor()->create(['name' => 'Junior Staff']);

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'user.created',
            'subject_type' => User::class,
            'subject_id' => $other->id,
            'metadata' => ['role' => 'editor'],
            'ip_address' => '192.168.1.100',
        ]);

        AuditLog::create([
            'user_id' => $other->id,
            'action' => 'auth.login',
            'subject_type' => null,
            'subject_id' => null,
            'metadata' => [],
            'ip_address' => '10.0.0.5',
        ]);

        $this->actingAs($admin)
            ->get('/admin/audit-logs?action=user.created')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AuditLogs')
                ->has('logs.data', 1)
                ->where('logs.data.0.action', 'user.created'));

        $this->actingAs($admin)
            ->get('/admin/audit-logs?search=192.168.1.100')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AuditLogs')
                ->has('logs.data', 1)
                ->where('logs.data.0.ip_address', '192.168.1.100'));
    }
}

