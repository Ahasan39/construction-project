<?php

namespace Tests\Feature;

use App\Enums\LeadStatus;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebLeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_leads_crm(): void
    {
        $this->get('/admin/leads')->assertRedirect(route('login'));
        $this->patch('/admin/leads/1', [])->assertRedirect(route('login'));
        $this->get('/admin/leads/export')->assertRedirect(route('login'));
    }

    public function test_viewer_can_view_leads_but_cannot_update(): void
    {
        $this->withoutVite();

        $viewer = User::factory()->viewer()->create();
        $lead = Lead::factory()->create(['name' => 'Homeowner Dave']);

        $this->actingAs($viewer)
            ->get('/admin/leads')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Leads')
                ->has('leads.data', 1)
                ->where('leads.data.0.name', 'Homeowner Dave')
                ->where('canManage', false));

        $this->actingAs($viewer)
            ->patch("/admin/leads/{$lead->id}", ['status' => 'contacted'])
            ->assertForbidden();
    }

    public function test_admin_can_view_and_filter_leads_with_metrics(): void
    {
        $this->withoutVite();

        $admin = User::factory()->admin()->create();

        Lead::factory()->create([
            'name' => 'Target Roofing Lead',
            'status' => LeadStatus::New,
            'service' => 'roofing',
        ]);

        Lead::factory()->contacted()->create([
            'name' => 'Siding Lead',
            'service' => 'siding',
        ]);

        $this->actingAs($admin)
            ->get('/admin/leads?status=new&service=roofing')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Leads')
                ->has('leads.data', 1)
                ->where('leads.data.0.name', 'Target Roofing Lead')
                ->where('metrics.total', 2)
                ->where('metrics.new', 1)
                ->where('metrics.contacted', 1)
                ->where('canManage', true));
    }

    public function test_admin_can_advance_lead_status_and_update_notes(): void
    {
        $admin = User::factory()->admin()->create();
        $lead = Lead::factory()->create([
            'status' => LeadStatus::New,
            'notes' => null,
        ]);

        $response = $this->actingAs($admin)
            ->patch("/admin/leads/{$lead->id}", [
                'status' => LeadStatus::Contacted->value,
                'notes' => 'Spoke with client. Inspection booked for Friday.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Lead updated successfully.');

        $lead->refresh();
        $this->assertSame(LeadStatus::Contacted, $lead->status);
        $this->assertSame('Spoke with client. Inspection booked for Friday.', $lead->notes);
        $this->assertNotNull($lead->contacted_at);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'lead.updated',
            'subject_type' => Lead::class,
            'subject_id' => $lead->id,
        ]);
    }

    public function test_admin_can_export_leads_to_csv(): void
    {
        $admin = User::factory()->admin()->create();

        Lead::factory()->create([
            'name' => 'Exportable Lead',
            'email' => 'export@example.com',
            'service' => 'windows',
        ]);

        $response = $this->actingAs($admin)->get('/admin/leads/export');

        $response->assertOk();
        $this->assertStringContainsString('text/csv', (string) $response->headers->get('Content-Type'));
        $this->assertStringContainsString('attachment;', (string) $response->headers->get('Content-Disposition'));
        $this->assertStringContainsString('leads-export-', (string) $response->headers->get('Content-Disposition'));

        $content = $response->streamedContent();
        $this->assertStringContainsString('ID,Name,Email,Phone,Service,Location', $content);
        $this->assertStringContainsString('Exportable Lead', $content);
        $this->assertStringContainsString('export@example.com', $content);
    }
}
