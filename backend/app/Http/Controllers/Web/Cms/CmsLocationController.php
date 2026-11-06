<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsLocation;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsLocationController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsLocation::class);

        $query = CmsLocation::query()->orderBy('display_order')->orderBy('city');

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('city', 'like', $search)
                    ->orWhere('state', 'like', $search)
                    ->orWhere('region', 'like', $search)
                    ->orWhere('slug', 'like', $search);
            });
        }

        $locations = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Locations', [
            'locations' => $locations,
            'filters' => [
                'search' => $request->string('search')->toString(),
            ],
            'canManage' => $request->user()?->can('create', CmsLocation::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsLocation::class);

        $validated = $request->validate([
            'city' => ['required', 'string', 'max:120'],
            'state' => ['required', 'string', 'max:10'],
            'slug' => ['nullable', 'string', 'max:120', 'unique:cms_locations,slug'],
            'region' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
            'service_areas' => ['nullable', 'array'],
            'supported_services' => ['nullable', 'array'],
        ]);

        $validated['slug'] = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['city']);
        $location = CmsLocation::create($validated);

        $this->audit->record('cms.location.created', $location, ['city' => $location->city]);

        return redirect()->route('admin.cms.locations.index')->with('status', 'Location created successfully.');
    }

    public function update(Request $request, CmsLocation $location): RedirectResponse
    {
        Gate::authorize('update', $location);

        $validated = $request->validate([
            'city' => ['required', 'string', 'max:120'],
            'state' => ['required', 'string', 'max:10'],
            'slug' => ['required', 'string', 'max:120', 'unique:cms_locations,slug,'.$location->id],
            'region' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
            'service_areas' => ['nullable', 'array'],
            'supported_services' => ['nullable', 'array'],
        ]);

        $location->update($validated);

        $this->audit->record('cms.location.updated', $location, ['city' => $location->city]);

        return redirect()->route('admin.cms.locations.index')->with('status', 'Location updated successfully.');
    }

    public function destroy(CmsLocation $location): RedirectResponse
    {
        Gate::authorize('delete', $location);

        $city = $location->city;
        $location->delete();

        $this->audit->record('cms.location.deleted', $location, ['city' => $city]);

        return redirect()->route('admin.cms.locations.index')->with('status', 'Location deleted successfully.');
    }
}
