<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_read_audit_logs_but_editor_cannot(): void
    {
        $admin = User::factory()->admin()->create();
        $editor = User::factory()->editor()->create();

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'settings.updated',
            'metadata' => ['fields' => ['company_name']],
        ]);

        $this->withApiToken($this->apiToken($admin))
            ->getJson('/api/v1/admin/audit-logs')
            ->assertOk()
            ->assertJsonPath('data.0.action', 'settings.updated');

        $this->withApiToken($this->apiToken($editor))
            ->getJson('/api/v1/admin/audit-logs')
            ->assertForbidden();
    }

    public function test_audit_metadata_redacts_sensitive_keys_recursively(): void
    {
        app(AuditLogger::class)->record('test.event', null, [
            'password' => 'super-secret',
            'safe' => 'visible',
            'nested' => [
                'api_key' => 'abc123',
                'authorization' => 'Bearer token',
                'note' => 'keep me',
            ],
        ]);

        $log = AuditLog::query()->firstOrFail();

        $this->assertSame('[redacted]', $log->metadata['password']);
        $this->assertSame('visible', $log->metadata['safe']);
        $this->assertSame('[redacted]', $log->metadata['nested']['api_key']);
        $this->assertSame('[redacted]', $log->metadata['nested']['authorization']);
        $this->assertSame('keep me', $log->metadata['nested']['note']);
    }

    public function test_audit_logs_can_be_filtered_by_action(): void
    {
        $admin = User::factory()->admin()->create();

        AuditLog::create(['action' => 'auth.login', 'user_id' => $admin->id]);
        AuditLog::create(['action' => 'settings.updated', 'user_id' => $admin->id]);

        $this->withApiToken($this->apiToken($admin))
            ->getJson('/api/v1/admin/audit-logs?action=auth.login')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.action', 'auth.login');
    }
}
