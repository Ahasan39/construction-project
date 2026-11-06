<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadSubmissionController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:40'],
            'serviceKey' => ['nullable', 'string', 'max:80'],
            'service' => ['nullable', 'string', 'max:80'],
            'regionKey' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:100'],
            'consentReminders' => ['sometimes', 'boolean'],
            'consentPromotions' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $service = $validated['serviceKey'] ?? $validated['service'] ?? 'roofing';
        $location = $validated['regionKey'] ?? $validated['location'] ?? 'general';

        $lead = Lead::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'service' => $service,
            'location' => $location,
            'status' => LeadStatus::New,
            'consent_reminders' => (bool) ($validated['consentReminders'] ?? false),
            'consent_promotions' => (bool) ($validated['consentPromotions'] ?? false),
            'notes' => $validated['notes'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        $this->audit->record('lead.created', $lead, [
            'service' => $lead->service,
            'location' => $lead->location,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Your estimate request has been received. Our local team will contact you shortly.',
            'lead' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'service' => $lead->service,
                'location' => $lead->location,
                'status' => $lead->status->value,
                'created_at' => $lead->created_at->toIso8601String(),
            ],
        ], 201);
    }
}

