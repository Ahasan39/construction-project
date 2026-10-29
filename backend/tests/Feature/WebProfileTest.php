<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_profile_pages(): void
    {
        $this->get('/admin/profile')->assertRedirect(route('login'));
        $this->patch('/admin/profile', ['name' => 'Someone'])->assertRedirect(route('login'));
        $this->put('/admin/profile/password', [
            'current_password' => 'Password1234',
            'password' => 'NewPassword9876',
            'password_confirmation' => 'NewPassword9876',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_sees_only_their_own_data(): void
    {
        $viewer = User::factory()->viewer()->create([
            'name' => 'Jane Viewer',
            'email' => 'jane.viewer@example.com',
        ]);
        User::factory()->admin()->create([
            'name' => 'Someone Else',
            'email' => 'else@example.com',
        ]);

        $this->actingAs($viewer)
            ->get('/admin/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Profile')
                ->where('profile.name', 'Jane Viewer')
                ->where('profile.email', 'jane.viewer@example.com')
                ->where('profile.role', UserRole::Viewer->value)
                ->where('profile.role_label', 'Viewer')
                ->where('profile.is_active', true)
                ->missing('profile.password'));
    }

    public function test_valid_profile_update_persists_and_is_audited(): void
    {
        $user = User::factory()->editor()->create(['name' => 'Old Name']);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->patch('/admin/profile', ['name' => 'New Name'])
            ->assertRedirect('/admin/profile')
            ->assertSessionHas('status', 'Profile updated.');

        $this->assertSame('New Name', $user->fresh()->name);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->getKey(),
            'action' => 'profile.updated',
        ]);
    }

    public function test_profile_update_redirects_to_profile_even_without_a_referer(): void
    {
        $user = User::factory()->viewer()->create(['name' => 'Current Name']);

        // Simulates a browser request made under Referrer-Policy: no-referrer,
        // where no Referer header reaches the server. Without the explicit
        // route redirect, `back()` would fall through to '/' (the health JSON
        // endpoint) and Inertia would raise an invalid-response error.
        $this->actingAs($user)
            ->patch('/admin/profile', ['name' => 'Later Name'])
            ->assertRedirect(route('admin.profile.edit'))
            ->assertSessionHas('status', 'Profile updated.');

        $this->assertSame('Later Name', $user->fresh()->name);
    }

    public function test_password_change_redirects_to_profile_even_without_a_referer(): void
    {
        $user = User::factory()->viewer()->create([
            'password' => 'Password1234',
        ]);

        $this->actingAs($user)
            ->put('/admin/profile/password', [
                'current_password' => 'Password1234',
                'password' => 'BrandNewSecret42',
                'password_confirmation' => 'BrandNewSecret42',
            ])
            ->assertRedirect(route('admin.profile.edit'))
            ->assertSessionHas('status', 'Password updated.');

        $this->assertTrue(Hash::check('BrandNewSecret42', $user->fresh()->password));
    }

    public function test_profile_update_rejects_invalid_name(): void
    {
        $user = User::factory()->viewer()->create(['name' => 'Keep Me']);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->patch('/admin/profile', ['name' => ''])
            ->assertRedirect('/admin/profile')
            ->assertSessionHasErrors(['name']);

        $this->assertSame('Keep Me', $user->fresh()->name);
    }

    public function test_profile_update_ignores_role_and_active_fields(): void
    {
        $user = User::factory()->editor()->create([
            'name' => 'Editor Dan',
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->patch('/admin/profile', [
                'name' => 'Editor Dan',
                'role' => UserRole::SuperAdmin->value,
                'is_active' => false,
                'email' => 'hacker@example.com',
                'permissions' => ['users.manage'],
            ])
            ->assertRedirect('/admin/profile');

        $fresh = $user->fresh();
        $this->assertSame(UserRole::Editor, $fresh->role);
        $this->assertTrue($fresh->is_active);
        $this->assertNotSame('hacker@example.com', $fresh->email);
    }

    public function test_password_change_requires_correct_current_password(): void
    {
        $user = User::factory()->viewer()->create([
            'password' => 'Password1234',
        ]);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->put('/admin/profile/password', [
                'current_password' => 'WrongCurrent99',
                'password' => 'BrandNewSecret42',
                'password_confirmation' => 'BrandNewSecret42',
            ])
            ->assertRedirect('/admin/profile')
            ->assertSessionHasErrors(['current_password']);

        $this->assertTrue(Hash::check('Password1234', $user->fresh()->password));
    }

    public function test_password_change_validates_confirmation(): void
    {
        $user = User::factory()->viewer()->create([
            'password' => 'Password1234',
        ]);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->put('/admin/profile/password', [
                'current_password' => 'Password1234',
                'password' => 'BrandNewSecret42',
                'password_confirmation' => 'MismatchedConfirm42',
            ])
            ->assertRedirect('/admin/profile')
            ->assertSessionHasErrors(['password']);

        $this->assertTrue(Hash::check('Password1234', $user->fresh()->password));
    }

    public function test_valid_password_change_persists_and_is_audited(): void
    {
        $user = User::factory()->viewer()->create([
            'password' => 'Password1234',
        ]);

        $this->actingAs($user)
            ->from('/admin/profile')
            ->put('/admin/profile/password', [
                'current_password' => 'Password1234',
                'password' => 'BrandNewSecret42',
                'password_confirmation' => 'BrandNewSecret42',
            ])
            ->assertRedirect('/admin/profile')
            ->assertSessionHas('status', 'Password updated.');

        $fresh = $user->fresh();
        $this->assertTrue(Hash::check('BrandNewSecret42', $fresh->password));
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->getKey(),
            'action' => 'profile.password_changed',
        ]);
    }
}
