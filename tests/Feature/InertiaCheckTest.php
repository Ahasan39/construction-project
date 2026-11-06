<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InertiaCheckTest extends TestCase
{
    public function test_inertia_check_page_resolves_through_the_inertia_middleware(): void
    {
        $this->withoutVite();

        $response = $this->get('/inertia-check');

        $response->assertOk();
        $response->assertSee('noindex, nofollow', false);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('InertiaCheck')
            ->where('message', 'Laravel + Inertia + React are wired up.')
            ->where('appName', config('app.name'))
            ->where('auth.user', null)
            ->has('checkedAt'));
    }

    public function test_inertia_check_page_returns_an_inertia_json_response(): void
    {
        $headers = ['X-Inertia' => 'true'];
        $manifest = public_path('build/manifest.json');

        if (is_file($manifest)) {
            $headers['X-Inertia-Version'] = hash_file('xxh128', $manifest);
        }

        $response = $this->withHeaders($headers)->get('/inertia-check');

        $response->assertOk();
        $response->assertHeader('X-Inertia', 'true');
        $response->assertJsonPath('component', 'InertiaCheck');
        $response->assertJsonPath('props.message', 'Laravel + Inertia + React are wired up.');
    }
}
