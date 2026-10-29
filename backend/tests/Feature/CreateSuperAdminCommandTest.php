<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CreateSuperAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_creates_a_super_admin_without_a_default_password(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'Root Administrator',
            '--email' => 'root@example.com',
        ])
            ->expectsQuestion('Password (minimum 12 characters, mixed case, letters, and numbers)', 'Password1234')
            ->expectsQuestion('Confirm password', 'Password1234')
            ->assertSuccessful();

        $user = User::query()->where('email', 'root@example.com')->firstOrFail();

        $this->assertSame(UserRole::SuperAdmin, $user->role);
        $this->assertTrue($user->is_active);
        $this->assertTrue(Hash::check('Password1234', $user->password));
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'user.created',
            'subject_id' => $user->id,
        ]);
    }

    public function test_command_rejects_mismatched_passwords(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'Root Administrator',
            '--email' => 'root@example.com',
        ])
            ->expectsQuestion('Password (minimum 12 characters, mixed case, letters, and numbers)', 'Password1234')
            ->expectsQuestion('Confirm password', 'DifferentPassword1234')
            ->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'root@example.com']);
    }
}
