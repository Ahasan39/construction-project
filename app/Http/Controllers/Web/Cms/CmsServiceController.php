<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsService;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsServiceController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsService::class);

        $query = CmsService::query()->orderBy('display_order')->orderBy('name');

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('name', 'like', $search)
                    ->orWhere('tagline', 'like', $search)
                    ->orWhere('slug', 'like', $search);
            });
        }

        $services = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Services', [
            'services' => $services,
            'filters' => [
                'search' => $request->string('search')->toString(),
            ],
            'canManage' => $request->user()?->can('create', CmsService::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsService::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:120', 'unique:cms_services,slug'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'hero_image' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
            'variants' => ['nullable', 'array'],
        ]);

        $validated['slug'] = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']);
        $service = CmsService::create($validated);

        $this->audit->record('cms.service.created', $service, ['name' => $service->name]);

        return redirect()->route('admin.cms.services.index')->with('status', 'Service created successfully.');
    }

    public function update(Request $request, CmsService $service): RedirectResponse
    {
        Gate::authorize('update', $service);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:120', 'unique:cms_services,slug,'.$service->id],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:100'],
            'hero_image' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
            'variants' => ['nullable', 'array'],
        ]);

        $service->update($validated);

        $this->audit->record('cms.service.updated', $service, ['name' => $service->name]);

        return redirect()->route('admin.cms.services.index')->with('status', 'Service updated successfully.');
    }

    public function destroy(CmsService $service): RedirectResponse
    {
        Gate::authorize('delete', $service);

        $name = $service->name;
        $service->delete();

        $this->audit->record('cms.service.deleted', $service, ['name' => $name]);

        return redirect()->route('admin.cms.services.index')->with('status', 'Service deleted successfully.');
    }
}
