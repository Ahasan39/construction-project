<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_user_can_login_and_receive_a_token(): void
    {
        $user = User::factory()->editor()->create([
            'email' => 'editor@example.com',
            'password' => 'Password1234',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'editor@example.com',
            'password' => 'Password1234',
            'device_name' => 'phpunit',
        ]);

        $response->assertOk()
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonPath('user.email', 'editor@example.com')
            ->assertJsonPath('user.role', UserRole::Editor->value)
            ->assertJsonStructure(['token', 'expires_at', 'user' => ['permissions']]);

        $this->assertNotNull($user->fresh()->last_login_at);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'auth.login',
            'user_id' => $user->id,
        ]);
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->inactive()->create([
            'email' => 'inactive@example.com',
            'password' => 'Password1234',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive@example.com',
            'password' => 'Password1234',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_invalid_credentials_are_rejected_without_user_enumeration(): void
    {
        User::factory()->create(['email' => 'real@example.com']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'real@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'The provided credentials are incorrect.');

        $this->postJson('/api/v1/auth/login', [
            'email' => 'missing@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'The provided credentials are incorrect.');
    }

    public function test_authenticated_user_can_read_profile_and_sign_out(): void
    {
        $user = User::factory()->viewer()->create();
        $token = $this->apiToken($user);

        $this->withApiToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('user.role', UserRole::Viewer->value);

        $this->withApiToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->withApiToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();
    }

    public function test_password_reset_request_is_generic_and_sends_only_for_existing_users(): void
    {
        Notification::fake();
        config(['app.frontend_reset_url' => 'https://admin.example.test/reset-password']);

        $user = User::factory()->create(['email' => 'reset@example.com']);

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'reset@example.com'])
            ->assertOk()
            ->assertJsonPath('message', 'If an account exists for that email, a password reset link has been sent.');

        $this->postJson('/api/v1/auth/forgot-password', ['email' => 'unknown@example.com'])
            ->assertOk()
            ->assertJsonPath('message', 'If an account exists for that email, a password reset link has been sent.');

        Notification::assertSentTo(
            $user,
            ResetPassword::class,
            function (ResetPassword $notification) use ($user): bool {
                $url = $notification->toMail($user)->actionUrl;

                return str_starts_with($url, 'https://admin.example.test/reset-password?')
                    && str_contains($url, 'email='.urlencode($user->email));
            }
        );
    }

    public function test_password_can_be_reset_and_existing_tokens_are_revoked(): void
    {
        $user = User::factory()->create([
            'email' => 'reset2@example.com',
            'password' => 'OldPassword1234',
        ]);
        $token = $this->apiToken($user);
        $resetToken = Password::broker()->createToken($user);

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $resetToken,
            'email' => 'reset2@example.com',
            'password' => 'NewPassword1234',
            'password_confirmation' => 'NewPassword1234',
        ])->assertOk();

        $this->withApiToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();

        $this->postJson('/api/v1/auth/login', [
            'email' => 'reset2@example.com',
            'password' => 'NewPassword1234',
        ])->assertOk();

        $this->assertDatabaseHas('audit_logs', ['action' => 'auth.password_reset']);
    }

    public function test_password_change_requires_current_password_and_revokes_other_tokens(): void
    {
        $user = User::factory()->create(['password' => 'Password1234']);
        $firstToken = $this->apiToken($user, 'first');
        $secondToken = $this->apiToken($user, 'second');

        $this->withApiToken($firstToken)
            ->putJson('/api/v1/auth/password', [
                'current_password' => 'not-the-password',
                'password' => 'NewPassword1234',
                'password_confirmation' => 'NewPassword1234',
            ])->assertStatus(422);

        $this->withApiToken($firstToken)
            ->putJson('/api/v1/auth/password', [
                'current_password' => 'Password1234',
                'password' => 'NewPassword1234',
                'password_confirmation' => 'NewPassword1234',
            ])->assertOk();

        $this->withApiToken($secondToken)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();

        $this->withApiToken($firstToken)
            ->getJson('/api/v1/auth/me')
            ->assertOk();

        $this->assertDatabaseHas('audit_logs', ['action' => 'auth.password_changed']);
    }
}
