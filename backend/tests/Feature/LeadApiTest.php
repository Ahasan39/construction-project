<?php

namespace Tests\Feature;

use App\Enums\LeadStatus;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_submit_valid_lead_and_it_is_audited(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => 'John Homeowner',
            'email' => 'john@example.com',
            'phone' => '(555) 123-4567',
            'serviceKey' => 'roofing',
            'regionKey' => 'nashville-area',
            'consentReminders' => true,
            'consentPromotions' => false,
            'notes' => 'Roof leaking near chimney',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('status', 'success');
        $response->assertJsonPath('lead.name', 'John Homeowner');
        $response->assertJsonPath('lead.email', 'john@example.com');
        $response->assertJsonPath('lead.service', 'roofing');
        $response->assertJsonPath('lead.location', 'nashville-area');
        $response->assertJsonPath('lead.status', 'new');

        $this->assertDatabaseHas('leads', [
            'name' => 'John Homeowner',
            'email' => 'john@example.com',
            'phone' => '(555) 123-4567',
            'service' => 'roofing',
            'location' => 'nashville-area',
            'status' => LeadStatus::New->value,
            'consent_reminders' => true,
            'consent_promotions' => false,
            'notes' => 'Roof leaking near chimney',
        ]);

        $lead = Lead::where('email', 'john@example.com')->first();
        $this->assertNotNull($lead);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'lead.created',
            'subject_type' => Lead::class,
            'subject_id' => $lead->id,
        ]);
    }

    public function test_lead_submission_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => '',
            'email' => 'not-an-email',
            'phone' => '',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['name', 'email', 'phone']);
    }

    public function test_lead_submission_rate_limiting(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/v1/leads', [
                'name' => "Tester {$i}",
                'email' => "tester{$i}@example.com",
                'phone' => '555-0000',
                'service' => 'roofing',
            ]);
        }

        $rateLimited = $this->postJson('/api/v1/leads', [
            'name' => 'Tester Overflow',
            'email' => 'overflow@example.com',
            'phone' => '555-0000',
            'service' => 'roofing',
        ]);

        $rateLimited->assertStatus(429);
    }
}

