<?php

namespace Database\Factories;

use App\Enums\LeadStatus;
use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'service' => fake()->randomElement(['roofing', 'siding', 'windows', 'gutters', 'masonry']),
            'location' => fake()->randomElement(['nashville-area', 'grand-rapids-area', 'south-east-michigan', 'cincinnati-area']),
            'status' => LeadStatus::New,
            'consent_reminders' => true,
            'consent_promotions' => false,
            'notes' => fake()->sentence(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    public function contacted(): static
    {
        return $this->state(fn () => [
            'status' => LeadStatus::Contacted,
            'contacted_at' => now(),
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn () => [
            'status' => LeadStatus::Scheduled,
            'contacted_at' => now()->subDay(),
            'scheduled_at' => now(),
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn () => [
            'status' => LeadStatus::Closed,
            'contacted_at' => now()->subDays(2),
            'scheduled_at' => now()->subDay(),
            'closed_at' => now(),
        ]);
    }
}

