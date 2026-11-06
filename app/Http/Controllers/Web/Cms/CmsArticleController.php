<?php

namespace App\Http\Controllers\Web\Cms;

use App\Http\Controllers\Controller;
use App\Models\CmsArticle;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsArticleController extends Controller
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', CmsArticle::class);

        $query = CmsArticle::query()->latest('published_at')->latest('id');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->toString());
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($b) use ($search): void {
                $b->where('title', 'like', $search)
                    ->orWhere('excerpt', 'like', $search)
                    ->orWhere('slug', 'like', $search);
            });
        }

        $articles = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Cms/Blog', [
            'articles' => $articles,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'category' => $request->string('category')->toString(),
            ],
            'categories' => ['Roofing', 'Siding', 'Gutters', 'Windows', 'Masonry', 'Maintenance', 'Energy Efficiency'],
            'canManage' => $request->user()?->can('create', CmsArticle::class) ?? false,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', CmsArticle::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:cms_articles,slug'],
            'excerpt' => ['nullable', 'string'],
            'body_html' => ['required', 'string'],
            'category' => ['required', 'string', 'max:80'],
            'thumbnail_url' => ['nullable', 'string', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'author_name' => ['nullable', 'string', 'max:120'],
        ]);

        $validated['slug'] = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        if (empty($validated['published_at']) && !empty($validated['is_published'])) {
            $validated['published_at'] = now();
        }

        $article = CmsArticle::create($validated);

        $this->audit->record('cms.article.created', $article, ['title' => $article->title]);

        return redirect()->route('admin.cms.blog.index')->with('status', 'Article created successfully.');
    }

    public function update(Request $request, CmsArticle $article): RedirectResponse
    {
        Gate::authorize('update', $article);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:cms_articles,slug,'.$article->id],
            'excerpt' => ['nullable', 'string'],
            'body_html' => ['required', 'string'],
            'category' => ['required', 'string', 'max:80'],
            'thumbnail_url' => ['nullable', 'string', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'author_name' => ['nullable', 'string', 'max:120'],
        ]);

        $article->update($validated);

        $this->audit->record('cms.article.updated', $article, ['title' => $article->title]);

        return redirect()->route('admin.cms.blog.index')->with('status', 'Article updated successfully.');
    }

    public function destroy(CmsArticle $article): RedirectResponse
    {
        Gate::authorize('delete', $article);

        $title = $article->title;
        $article->delete();

        $this->audit->record('cms.article.deleted', $article, ['title' => $title]);

        return redirect()->route('admin.cms.blog.index')->with('status', 'Article deleted successfully.');
    }
}
