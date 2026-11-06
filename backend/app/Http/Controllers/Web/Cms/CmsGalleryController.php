<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsGallery;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CmsGalleryController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsGallery::class);

        $query = CmsGallery::query()->orderBy('display_order')->latest('id');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->toString());
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('title', 'like', $search)
                    ->orWhere('location', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

        $galleries = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Gallery', [
            'galleries' => $galleries,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'category' => $request->string('category')->toString(),
            ],
            'categories' => ['Roofing', 'Siding', 'Gutters', 'Windows', 'Masonry', 'Commercial'],
            'canManage' => $request->user()?->can('create', CmsGallery::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsGallery::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:80'],
            'location' => ['nullable', 'string', 'max:120'],
            'image_url' => ['required', 'string', 'max:255'],
            'before_image_url' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_published' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
        ]);

        $item = CmsGallery::create($validated);

        $this->audit->record('cms.gallery.created', $item, ['title' => $item->title]);

        return redirect()->route('admin.cms.gallery.index')->with('status', 'Gallery item created successfully.');
    }

    public function update(Request $request, CmsGallery $gallery): RedirectResponse
    {
        Gate::authorize('update', $gallery);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:80'],
            'location' => ['nullable', 'string', 'max:120'],
            'image_url' => ['required', 'string', 'max:255'],
            'before_image_url' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_published' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
        ]);

        $gallery->update($validated);

        $this->audit->record('cms.gallery.updated', $gallery, ['title' => $gallery->title]);

        return redirect()->route('admin.cms.gallery.index')->with('status', 'Gallery item updated successfully.');
    }

    public function destroy(CmsGallery $gallery): RedirectResponse
    {
        Gate::authorize('delete', $gallery);

        $title = $gallery->title;
        $gallery->delete();

        $this->audit->record('cms.gallery.deleted', $gallery, ['title' => $title]);

        return redirect()->route('admin.cms.gallery.index')->with('status', 'Gallery item deleted successfully.');
    }
}
