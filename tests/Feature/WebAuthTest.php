<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Router;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_the_login_page_with_csrf_cookie(): void
    {
        $this->withoutVite();

        $response = $this->get('/admin/login');

        $response->assertOk()
            ->assertCookie('XSRF-TOKEN')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Login')
                ->where('auth.user', null)
                ->where('status', null));
    }

    public function test_authenticated_user_is_redirected_away_from_the_login_page(): void
    {
        $user = User::factory()->viewer()->create();

        $this->actingAs($user)
            ->get('/admin/login')
            ->assertRedirect(route('admin.dashboard'));
    }

    public function test_active_user_can_sign_in_and_reaches_the_intended_admin_page(): void
    {
        $user = User::factory()->editor()->create([
            'email' => 'web-editor@example.com',
            'password' => 'Password1234',
        ]);

        $this->get('/admin')->assertRedirect(route('login'));

        $response = $this->post('/admin/login', [
            'email' => 'web-editor@example.com',
            'password' => 'Password1234',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->last_login_at);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'auth.login',
            'user_id' => $user->id,
        ]);
    }

    public function test_invalid_credentials_and_inactive_users_get_the_same_generic_error(): void
    {
        User::factory()->create(['email' => 'active@example.com']);
        User::factory()->inactive()->create([
            'email' => 'inactive@example.com',
            'password' => 'Password1234',
        ]);

        foreach ([
            ['email' => 'active@example.com', 'password' => 'wrong-password'],
            ['email' => 'inactive@example.com', 'password' => 'Password1234'],
        ] as $credentials) {
            $this->from(route('login'))
                ->post('/admin/login', $credentials)
                ->assertRedirect(route('login'))
                ->assertSessionHasErrors([
                    'email' => 'The provided credentials are incorrect.',
                ]);

            $this->assertGuest();
        }
    }

    public function test_login_is_rate_limited(): void
    {
        User::factory()->create(['email' => 'limited@example.com']);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->from(route('login'))
                ->post('/admin/login', [
                    'email' => 'limited@example.com',
                    'password' => 'wrong-password',
                ])->assertRedirect(route('login'));
        }

        $this->post('/admin/login', [
            'email' => 'limited@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_authenticated_user_can_sign_out(): void
    {
        $user = User::factory()->viewer()->create();

        $this->actingAs($user)
            ->post('/admin/logout')
            ->assertRedirect(route('login'));

        $this->assertGuest();
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'auth.logout',
            'user_id' => $user->id,
        ]);
    }

    public function test_guests_are_redirected_from_protected_admin_pages(): void
    {
        $this->get('/admin')->assertRedirect(route('login'));
        $this->get('/admin/users')->assertRedirect(route('login'));
    }

    public function test_admin_shell_and_permission_protected_page_render_for_authorized_users(): void
    {
        $admin = User::factory()->admin()->create();

        $this->withoutVite();

        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('auth.user.role', UserRole::Admin->value));

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Users'));
    }

    public function test_viewer_cannot_open_the_permission_protected_users_page(): void
    {
        $viewer = User::factory()->viewer()->create();

        $this->actingAs($viewer)
            ->get('/admin/users')
            ->assertForbidden();
    }

    public function test_inactive_session_is_terminated_and_sent_back_to_login(): void
    {
        $user = User::factory()->inactive()->create();

        $this->actingAs($user)
            ->get('/admin')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors([
                'email' => 'This account is inactive.',
            ]);

        $this->assertGuest();
    }

    public function test_login_and_logout_routes_use_the_web_csrf_middleware(): void
    {
        $router = app(Router::class);

        foreach (['login.store', 'logout'] as $routeName) {
            $route = $router->getRoutes()->getByName($routeName);

            $this->assertNotNull($route);
            $this->assertContains(
                ValidateCsrfToken::class,
                $router->gatherRouteMiddleware($route)
            );
        }
    }
}
