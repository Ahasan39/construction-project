<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_user_management(): void
    {
        $this->get('/admin/users')->assertRedirect(route('login'));
        $this->post('/admin/users', [])->assertRedirect(route('login'));
        $this->patch('/admin/users/1', [])->assertRedirect(route('login'));
    }

    public function test_viewer_cannot_view_or_manage_users(): void
    {
        $this->withoutVite();

        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)
            ->get('/admin/users')
            ->assertForbidden();

        $this->actingAs($viewer)
            ->post('/admin/users', [
                'name' => 'Test',
                'email' => 'test@example.com',
                'password' => 'SecurePass123!#',
                'password_confirmation' => 'SecurePass123!#',
                'role' => UserRole::Editor->value,
            ])
            ->assertForbidden();
    }

    public function test_admin_can_view_users_with_inertia_props(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create(['name' => 'Alice Admin']);
        $editor = User::factory()->editor()->create(['name' => 'Bob Editor']);

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users')
                ->has('users.data', 2)
                ->where('can.create', true)
                ->where('can.manage', true)
                ->where('currentUserId', $admin->id)
                ->has('roles'));
    }

    public function test_admin_can_filter_users_by_search_and_role(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create(['name' => 'Alice Admin', 'email' => 'alice@example.com']);
        User::factory()->editor()->create(['name' => 'Bob Editor', 'email' => 'bob@example.com']);

        $this->actingAs($admin)
            ->get('/admin/users?search=Bob&role=editor')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users')
                ->has('users.data', 1)
                ->where('users.data.0.name', 'Bob Editor'));
    }

    public function test_admin_can_create_editor_and_creation_is_audited(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'New Staff',
                'email' => 'staff@example.com',
                'password' => 'Password123!#',
                'password_confirmation' => 'Password123!#',
                'role' => UserRole::Editor->value,
                'is_active' => true,
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('status', 'User created successfully.');

        $created = User::where('email', 'staff@example.com')->first();
        $this->assertNotNull($created);
        $this->assertSame(UserRole::Editor, $created->role);
        $this->assertTrue($created->is_active);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.created',
            'subject_type' => User::class,
            'subject_id' => $created->id,
        ]);
    }

    public function test_admin_cannot_create_super_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->post('/admin/users', [
                'name' => 'Rogue SuperAdmin',
                'email' => 'rogue@example.com',
                'password' => 'Password123!#',
                'password_confirmation' => 'Password123!#',
                'role' => UserRole::SuperAdmin->value,
                'is_active' => true,
            ])
            ->assertForbidden();
    }

    public function test_admin_can_update_user_role_and_active_status(): void
    {
        $admin = User::factory()->admin()->create();
        $editor = User::factory()->editor()->create(['is_active' => true]);

        $response = $this->actingAs($admin)
            ->patch("/admin/users/{$editor->id}", [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
                'role' => UserRole::Viewer->value,
                'is_active' => false,
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('status', 'User updated successfully.');

        $editor->refresh();
        $this->assertSame('Updated Name', $editor->name);
        $this->assertSame('updated@example.com', $editor->email);
        $this->assertSame(UserRole::Viewer, $editor->role);
        $this->assertFalse($editor->is_active);
    }

    public function test_super_admin_cannot_demote_or_deactivate_self(): void
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superAdmin)
            ->patch("/admin/users/{$superAdmin->id}", [
                'role' => UserRole::Admin->value,
            ]);

        $response->assertSessionHasErrors('role');

        $superAdmin->refresh();
        $this->assertSame(UserRole::SuperAdmin, $superAdmin->role);
    }
}

