import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    AdminButton,
    FormField,
    PageHeader,
    SectionCard,
    SelectInput,
    TextArea,
    TextInput,
} from '../../../components/AdminUI';
import { AdminLayout } from '../../../layouts/AdminLayout';

export type CmsArticleItem = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body_html: string;
    category: string;
    thumbnail_url: string | null;
    is_published: boolean;
    published_at: string | null;
    author_name: string | null;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedArticles = {
    data: CmsArticleItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type BlogProps = {
    articles: PaginatedArticles;
    filters: {
        search: string;
        category: string;
    };
    categories: string[];
    canManage: boolean;
};

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function Blog({ articles, filters, categories, canManage }: BlogProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<CmsArticleItem | null>(null);

    const form = useForm({
        title: '',
        slug: '',
        excerpt: '',
        body_html: '',
        category: 'Roofing',
        thumbnail_url: '',
        is_published: true,
        published_at: '',
        author_name: 'Editorial Team',
    });

    function applyFilters(newSearch: string, newCategory: string) {
        router.get(
            '/admin/cms/blog',
            {
                search: newSearch || undefined,
                category: newCategory || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleFilterSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search, categoryFilter);
    }

    function openCreate() {
        form.reset();
        form.clearErrors();
        form.setData({
            title: '',
            slug: '',
            excerpt: '',
            body_html: '',
            category: 'Roofing',
            thumbnail_url: '',
            is_published: true,
            published_at: new Date().toISOString().slice(0, 10),
            author_name: 'Editorial Team',
        });
        setIsCreateOpen(true);
    }

    function openEdit(article: CmsArticleItem) {
        setEditingArticle(article);
        form.clearErrors();
        form.setData({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? '',
            body_html: article.body_html,
            category: article.category,
            thumbnail_url: article.thumbnail_url ?? '',
            is_published: article.is_published,
            published_at: article.published_at ? article.published_at.slice(0, 10) : '',
            author_name: article.author_name ?? 'Editorial Team',
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/blog', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingArticle) return;
        form.patch(`/admin/cms/blog/${editingArticle.id}`, {
            onSuccess: () => {
                setEditingArticle(null);
                form.reset();
            },
        });
    }

    function deleteArticle(article: CmsArticleItem) {
        if (!confirm(`Are you sure you want to delete "${article.title}"?`)) return;
        router.delete(`/admin/cms/blog/${article.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Blog Articles CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Blog & Resources"
                description="Manage customer knowledge base articles, guidelines, tips, and category taxonomy."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add article
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter articles" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <TextInput
                        placeholder="Search articles by title, excerpt, slug…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <SelectInput
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            applyFilters(search, e.target.value);
                        }}
                        className="w-48"
                    >
                        <option value="">All categories</option>
                        {(categories ?? []).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </SelectInput>
                    <AdminButton variant="secondary" type="submit">
                        Filter
                    </AdminButton>
                </form>
            </SectionCard>

            <SectionCard title={`Articles (${articles?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Article</th>
                                <th scope="col" className="px-3 py-3.5">Category</th>
                                <th scope="col" className="px-3 py-3.5">Status</th>
                                <th scope="col" className="px-3 py-3.5">Published Date</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(articles?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        No articles found.
                                    </td>
                                </tr>
                            ) : (
                                (articles?.data ?? []).map((art) => (
                                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="font-medium text-slate-900">{art.title}</div>
                                            <div className="text-xs font-mono text-slate-500">/blog/{art.slug}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                                                {art.category}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {art.is_published ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                            {formatDate(art.published_at)}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(art)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteArticle(art)}
                                                        className="font-medium text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">Read only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {(articles?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {articles.current_page} of {articles.last_page}
                        </div>
                        <div className="flex gap-1">
                            {articles.links.map((link, idx) => link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`rounded px-2.5 py-1 text-xs font-medium ${link.active ? 'bg-[#d9232a] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : null)}
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Modal */}
            {(isCreateOpen || editingArticle) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingArticle ? 'Edit Article' : 'Add New Article'}
                        </h2>
                        <form onSubmit={editingArticle ? submitEdit : submitCreate} className="space-y-4">
                            <FormField label="Title" required error={form.errors.title}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="Article headline"
                                    />
                                )}
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Category" required error={form.errors.category}>
                                    {(fieldProps) => (
                                        <SelectInput
                                            {...fieldProps}
                                            value={form.data.category}
                                            onChange={(e) => form.setData('category', e.target.value)}
                                        >
                                            {(categories ?? []).map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    )}
                                </FormField>
                                <FormField label="Author Name" error={form.errors.author_name}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.author_name}
                                            onChange={(e) => form.setData('author_name', e.target.value)}
                                            placeholder="Editorial Team"
                                        />
                                    )}
                                </FormField>
                            </div>
                            <FormField label="URL Slug" error={form.errors.slug}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.slug}
                                        onChange={(e) => form.setData('slug', e.target.value)}
                                        placeholder="article-slug (auto-generated if empty)"
                                    />
                                )}
                            </FormField>
                            <FormField label="Thumbnail Image URL" error={form.errors.thumbnail_url}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.thumbnail_url}
                                        onChange={(e) => form.setData('thumbnail_url', e.target.value)}
                                        placeholder="/images/blog/article-thumbnail.webp"
                                    />
                                )}
                            </FormField>
                            <FormField label="Short Excerpt" error={form.errors.excerpt}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        value={form.data.excerpt}
                                        onChange={(e) => form.setData('excerpt', e.target.value)}
                                        rows={2}
                                    />
                                )}
                            </FormField>
                            <FormField label="Article HTML Body" required error={form.errors.body_html}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        value={form.data.body_html}
                                        onChange={(e) => form.setData('body_html', e.target.value)}
                                        rows={8}
                                        className="font-mono text-xs"
                                        placeholder="<p>Article paragraphs and headings…</p>"
                                    />
                                )}
                            </FormField>
                            <div className="flex items-center gap-2">
                                <input
                                    id="article-published"
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) => form.setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                />
                                <label htmlFor="article-published" className="text-sm font-medium text-slate-700">
                                    Article is published live
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingArticle(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Article'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
