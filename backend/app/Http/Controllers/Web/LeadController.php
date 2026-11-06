<?php

namespace App\Http\Controllers\Web;

use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Lead::class);

        $query = Lead::query()->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('service')) {
            $query->where('service', $request->string('service')->toString());
        }

        if ($request->filled('location')) {
            $query->where('location', $request->string('location')->toString());
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->date('to')->endOfDay());
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('phone', 'like', $search)
                    ->orWhere('location', 'like', $search)
                    ->orWhere('service', 'like', $search)
                    ->orWhere('notes', 'like', $search);
            });
        }

        $paginator = $query->paginate(20)->withQueryString();

        $leads = $paginator->through(fn (Lead $lead) => [
            'id' => $lead->id,
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'service' => $lead->service,
            'location' => $lead->location,
            'status' => $lead->status->value,
            'status_label' => $lead->status->label(),
            'consent_reminders' => (bool) $lead->consent_reminders,
            'consent_promotions' => (bool) $lead->consent_promotions,
            'notes' => $lead->notes,
            'ip_address' => $lead->ip_address,
            'contacted_at' => $lead->contacted_at?->toIso8601String(),
            'scheduled_at' => $lead->scheduled_at?->toIso8601String(),
            'closed_at' => $lead->closed_at?->toIso8601String(),
            'created_at' => $lead->created_at?->toIso8601String(),
        ]);

        $metrics = [
            'total' => Lead::count(),
            'new' => Lead::where('status', LeadStatus::New->value)->count(),
            'contacted' => Lead::where('status', LeadStatus::Contacted->value)->count(),
            'scheduled' => Lead::where('status', LeadStatus::Scheduled->value)->count(),
            'closed' => Lead::where('status', LeadStatus::Closed->value)->count(),
        ];

        $statuses = array_map(static fn (LeadStatus $s): array => [
            'value' => $s->value,
            'label' => $s->label(),
        ], LeadStatus::cases());

        return Inertia::render('Admin/Leads', [
            'leads' => $leads,
            'metrics' => $metrics,
            'statuses' => $statuses,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'status' => $request->string('status')->toString(),
                'service' => $request->string('service')->toString(),
                'location' => $request->string('location')->toString(),
                'from' => $request->string('from')->toString(),
                'to' => $request->string('to')->toString(),
            ],
            'canManage' => $request->user()?->can('update', new Lead()) ?? false,
        ]);
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        Gate::authorize('update', $lead);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', LeadStatus::values())],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $newStatus = LeadStatus::from($validated['status']);
        $oldStatus = $lead->status;

        $updates = [
            'status' => $newStatus,
            'notes' => $validated['notes'] ?? null,
        ];

        if ($newStatus !== $oldStatus) {
            if ($newStatus === LeadStatus::Contacted && ! $lead->contacted_at) {
                $updates['contacted_at'] = now();
            } elseif ($newStatus === LeadStatus::Scheduled && ! $lead->scheduled_at) {
                $updates['scheduled_at'] = now();
            } elseif ($newStatus === LeadStatus::Closed && ! $lead->closed_at) {
                $updates['closed_at'] = now();
            }
        }

        $lead->update($updates);

        $this->audit->record('lead.updated', $lead, [
            'old_status' => $oldStatus->value,
            'new_status' => $newStatus->value,
            'notes_changed' => array_key_exists('notes', $validated),
        ]);

        return redirect()->back()->with('status', 'Lead updated successfully.');
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', Lead::class);

        $query = Lead::query()->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('service')) {
            $query->where('service', $request->string('service')->toString());
        }

        if ($request->filled('location')) {
            $query->where('location', $request->string('location')->toString());
        }

        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->date('to')->endOfDay());
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('phone', 'like', $search)
                    ->orWhere('location', 'like', $search)
                    ->orWhere('service', 'like', $search);
            });
        }

        $filename = 'leads-export-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) return;

            // Header row
            fputcsv($handle, [
                'ID',
                'Name',
                'Email',
                'Phone',
                'Service',
                'Location',
                'Status',
                'Consent Reminders',
                'Consent Promotions',
                'Created At',
                'Contacted At',
                'Scheduled At',
                'Closed At',
                'Notes',
            ]);

            $query->chunk(200, function ($chunk) use ($handle): void {
                foreach ($chunk as $row) {
                    fputcsv($handle, [
                        $row->id,
                        $row->name,
                        $row->email,
                        $row->phone,
                        $row->service,
                        $row->location,
                        $row->status->value,
                        $row->consent_reminders ? 'Yes' : 'No',
                        $row->consent_promotions ? 'Yes' : 'No',
                        $row->created_at?->toIso8601String(),
                        $row->contacted_at?->toIso8601String(),
                        $row->scheduled_at?->toIso8601String(),
                        $row->closed_at?->toIso8601String(),
                        $row->notes,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}

