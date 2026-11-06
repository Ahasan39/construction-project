<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsSeoSetting;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CmsSeoController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsSeoSetting::class);

        $query = CmsSeoSetting::query()->orderBy('route_pattern');

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('route_pattern', 'like', $search)
                    ->orWhere('title', 'like', $search)
                    ->orWhere('meta_description', 'like', $search);
            });
        }

        $seoSettings = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Seo', [
            'seoSettings' => $seoSettings,
            'filters' => [
                'search' => $request->string('search')->toString(),
            ],
            'canManage' => $request->user()?->can('create', CmsSeoSetting::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsSeoSetting::class);

        $validated = $request->validate([
            'route_pattern' => ['required', 'string', 'max:255', 'unique:cms_seo_settings,route_pattern'],
            'title' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'twitter_title' => ['nullable', 'string', 'max:255'],
            'twitter_description' => ['nullable', 'string'],
            'twitter_image' => ['nullable', 'string', 'max:255'],
            'schema_json' => ['nullable', 'array'],
            'is_noindex' => ['sometimes', 'boolean'],
        ]);

        $setting = CmsSeoSetting::create($validated);

        $this->audit->record('cms.seo.created', $setting, ['route_pattern' => $setting->route_pattern]);

        return redirect()->route('admin.cms.seo.index')->with('status', 'SEO rule created successfully.');
    }

    public function update(Request $request, CmsSeoSetting $seoSetting): RedirectResponse
    {
        Gate::authorize('update', $seoSetting);

        $validated = $request->validate([
            'route_pattern' => ['required', 'string', 'max:255', 'unique:cms_seo_settings,route_pattern,'.$seoSetting->id],
            'title' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'twitter_title' => ['nullable', 'string', 'max:255'],
            'twitter_description' => ['nullable', 'string'],
            'twitter_image' => ['nullable', 'string', 'max:255'],
            'schema_json' => ['nullable', 'array'],
            'is_noindex' => ['sometimes', 'boolean'],
        ]);

        $seoSetting->update($validated);

        $this->audit->record('cms.seo.updated', $seoSetting, ['route_pattern' => $seoSetting->route_pattern]);

        return redirect()->route('admin.cms.seo.index')->with('status', 'SEO rule updated successfully.');
    }

    public function destroy(CmsSeoSetting $seoSetting): RedirectResponse
    {
        Gate::authorize('delete', $seoSetting);

        $pattern = $seoSetting->route_pattern;
        $seoSetting->delete();

        $this->audit->record('cms.seo.deleted', $seoSetting, ['route_pattern' => $pattern]);

        return redirect()->route('admin.cms.seo.index')->with('status', 'SEO rule deleted successfully.');
    }
}
