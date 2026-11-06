<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsTestimonial;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CmsTestimonialController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsTestimonial::class);

        $query = CmsTestimonial::query()->orderBy('display_order')->latest('id');

        if ($request->filled('service')) {
            $query->where('service', $request->string('service')->toString());
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('author', 'like', $search)
                    ->orWhere('city_state', 'like', $search)
                    ->orWhere('body', 'like', $search);
            });
        }

        $testimonials = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Testimonials', [
            'testimonials' => $testimonials,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'service' => $request->string('service')->toString(),
            ],
            'canManage' => $request->user()?->can('create', CmsTestimonial::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsTestimonial::class);

        $validated = $request->validate([
            'author' => ['required', 'string', 'max:120'],
            'city_state' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'service' => ['nullable', 'string', 'max:80'],
            'body' => ['required', 'string'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
        ]);

        $testimonial = CmsTestimonial::create($validated);

        $this->audit->record('cms.testimonial.created', $testimonial, ['author' => $testimonial->author]);

        return redirect()->route('admin.cms.testimonials.index')->with('status', 'Testimonial created successfully.');
    }

    public function update(Request $request, CmsTestimonial $testimonial): RedirectResponse
    {
        Gate::authorize('update', $testimonial);

        $validated = $request->validate([
            'author' => ['required', 'string', 'max:120'],
            'city_state' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'service' => ['nullable', 'string', 'max:80'],
            'body' => ['required', 'string'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'display_order' => ['sometimes', 'integer'],
        ]);

        $testimonial->update($validated);

        $this->audit->record('cms.testimonial.updated', $testimonial, ['author' => $testimonial->author]);

        return redirect()->route('admin.cms.testimonials.index')->with('status', 'Testimonial updated successfully.');
    }

    public function destroy(CmsTestimonial $testimonial): RedirectResponse
    {
        Gate::authorize('delete', $testimonial);

        $author = $testimonial->author;
        $testimonial->delete();

        $this->audit->record('cms.testimonial.deleted', $testimonial, ['author' => $author]);

        return redirect()->route('admin.cms.testimonials.index')->with('status', 'Testimonial deleted successfully.');
    }
}
