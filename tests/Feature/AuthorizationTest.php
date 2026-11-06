<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_viewer_cannot_manage_users_or_settings(): void
    {
        $viewer = User::factory()->viewer()->create();
        $token = $this->apiToken($viewer);

        $this->withApiToken($token)->getJson('/api/v1/admin/users')->assertForbidden();
        $this->withApiToken($token)->postJson('/api/v1/admin/users', [])->assertForbidden();
        $this->withApiToken($token)->putJson('/api/v1/admin/settings', [])->assertForbidden();
        $this->withApiToken($token)->getJson('/api/v1/admin/audit-logs')->assertForbidden();
        $this->withApiToken($token)->postJson('/api/v1/admin/media', [])->assertForbidden();
    }

    public function test_editor_can_view_settings_but_cannot_change_them(): void
    {
        $editor = User::factory()->editor()->create();
        $token = $this->apiToken($editor);

        $this->withApiToken($token)
            ->getJson('/api/v1/admin/settings')
            ->assertOk();

        $this->withApiToken($token)
            ->putJson('/api/v1/admin/settings', ['company_name' => 'Hijacked'])
            ->assertForbidden();
    }

    public function test_admin_can_create_editor_and_action_is_audited(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);

        $response = $this->withApiToken($token)->postJson('/api/v1/admin/users', [
            'name' => 'New Editor',
            'email' => 'new.editor@example.com',
            'password' => 'Password1234',
            'password_confirmation' => 'Password1234',
            'role' => UserRole::Editor->value,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'new.editor@example.com')
            ->assertJsonPath('data.role', UserRole::Editor->value);

        $this->assertDatabaseHas('users', ['email' => 'new.editor@example.com']);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.created',
            'user_id' => $admin->id,
        ]);
    }

    public function test_admin_cannot_create_another_super_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $this->apiToken($admin);

        $this->withApiToken($token)->postJson('/api/v1/admin/users', [
            'name' => 'Escalation Attempt',
            'email' => 'escalation@example.com',
            'password' => 'Password1234',
            'password_confirmation' => 'Password1234',
            'role' => UserRole::SuperAdmin->value,
        ])->assertForbidden();

        $this->assertDatabaseMissing('users', ['email' => 'escalation@example.com']);
    }

    public function test_admin_cannot_modify_a_super_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $superAdmin = User::factory()->superAdmin()->create();
        $token = $this->apiToken($admin);

        $this->withApiToken($token)
            ->patchJson("/api/v1/admin/users/{$superAdmin->id}", ['name' => 'Changed'])
            ->assertForbidden();

        $this->assertNotSame('Changed', $superAdmin->fresh()->name);
    }

    public function test_super_admin_cannot_demote_or_deactivate_self(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();
        $token = $this->apiToken($superAdmin);

        $this->withApiToken($token)
            ->patchJson("/api/v1/admin/users/{$superAdmin->id}", ['role' => UserRole::Admin->value])
            ->assertStatus(422);

        $this->withApiToken($token)
            ->patchJson("/api/v1/admin/users/{$superAdmin->id}", ['is_active' => false])
            ->assertStatus(422);

        $this->assertSame(UserRole::SuperAdmin, $superAdmin->fresh()->role);
        $this->assertTrue($superAdmin->fresh()->is_active);
    }

    public function test_role_change_revokes_existing_tokens(): void
    {
        $admin = User::factory()->admin()->create();
        $viewer = User::factory()->viewer()->create();
        $viewerToken = $this->apiToken($viewer);

        $this->withApiToken($this->apiToken($admin))
            ->patchJson("/api/v1/admin/users/{$viewer->id}", ['role' => UserRole::Editor->value])
            ->assertOk()
            ->assertJsonPath('data.role', UserRole::Editor->value);

        $this->withApiToken($viewerToken)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();
    }

    public function test_deactivation_revokes_tokens_and_blocks_login(): void
    {
        $admin = User::factory()->admin()->create();
        $viewer = User::factory()->viewer()->create(['password' => 'Password1234']);
        $viewerToken = $this->apiToken($viewer);

        $this->withApiToken($this->apiToken($admin))
            ->patchJson("/api/v1/admin/users/{$viewer->id}", ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->withApiToken($viewerToken)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();

        $this->postJson('/api/v1/auth/login', [
            'email' => $viewer->email,
            'password' => 'Password1234',
        ])->assertStatus(422);
    }
}
