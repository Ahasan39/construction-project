<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->has('appName')
                ->has('services')
                ->has('locations')
                ->has('testimonials')
                ->has('articles')
                ->has('contact')
                ->has('settings')
            );
    }
}
