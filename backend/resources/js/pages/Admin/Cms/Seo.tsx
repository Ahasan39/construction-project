import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    AdminButton,
    FormField,
    PageHeader,
    SectionCard,
    TextArea,
    TextInput,
} from '../../../components/AdminUI';
import { AdminLayout } from '../../../layouts/AdminLayout';

export type CmsSeoSettingItem = {
    id: number;
    route_pattern: string;
    title: string;
    meta_description: string | null;
    canonical_url: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    twitter_image: string | null;
    schema_json: Record<string, unknown> | null;
    is_noindex: boolean;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedSeo = {
    data: CmsSeoSettingItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type SeoProps = {
    seoSettings: PaginatedSeo;
    filters: {
        search: string;
    };
    canManage: boolean;
};

export default function Seo({ seoSettings, filters, canManage }: SeoProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CmsSeoSettingItem | null>(null);

    const form = useForm({
        route_pattern: '',
        title: '',
        meta_description: '',
        canonical_url: '',
        og_title: '',
        og_description: '',
        og_image: '',
        twitter_title: '',
        twitter_description: '',
        twitter_image: '',
        is_noindex: false,
    });

    function applyFilters(newSearch: string) {
        router.get(
            '/admin/cms/seo',
            { search: newSearch || undefined },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleFilterSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search);
    }

    function openCreate() {
        form.reset();
        form.clearErrors();
        form.setData({
            route_pattern: '',
            title: '',
            meta_description: '',
            canonical_url: '',
            og_title: '',
            og_description: '',
            og_image: '',
            twitter_title: '',
            twitter_description: '',
            twitter_image: '',
            is_noindex: false,
        });
        setIsCreateOpen(true);
    }

    function openEdit(item: CmsSeoSettingItem) {
        setEditingItem(item);
        form.clearErrors();
        form.setData({
            route_pattern: item.route_pattern,
            title: item.title,
            meta_description: item.meta_description ?? '',
            canonical_url: item.canonical_url ?? '',
            og_title: item.og_title ?? '',
            og_description: item.og_description ?? '',
            og_image: item.og_image ?? '',
            twitter_title: item.twitter_title ?? '',
            twitter_description: item.twitter_description ?? '',
            twitter_image: item.twitter_image ?? '',
            is_noindex: item.is_noindex,
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/seo', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingItem) return;
        form.patch(`/admin/cms/seo/${editingItem.id}`, {
            onSuccess: () => {
                setEditingItem(null);
                form.reset();
            },
        });
    }

    function deleteItem(item: CmsSeoSettingItem) {
        if (!confirm(`Are you sure you want to delete SEO rule for "${item.route_pattern}"?`)) return;
        router.delete(`/admin/cms/seo/${item.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="SEO Rules CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="SEO & Metadata Rules"
                description="Manage route-level page titles, meta descriptions, canonical URLs, and Open Graph card previews."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add SEO rule
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter SEO rules" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex gap-3">
                    <TextInput
                        placeholder="Search by route pattern, title, description…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <AdminButton variant="secondary" type="submit">
                        Search
                    </AdminButton>
                </form>
            </SectionCard>

            <SectionCard title={`SEO Rules (${seoSettings?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Route Pattern</th>
                                <th scope="col" className="px-3 py-3.5">Title</th>
                                <th scope="col" className="px-3 py-3.5">Meta Description</th>
                                <th scope="col" className="px-3 py-3.5">Robots</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(seoSettings?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        No SEO rules found.
                                    </td>
                                </tr>
                            ) : (
                                (seoSettings?.data ?? []).map((rule) => (
                                    <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 text-xs font-mono font-medium text-slate-900">
                                            {rule.route_pattern}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-medium text-slate-800">
                                            {rule.title}
                                        </td>
                                        <td className="px-3 py-4 text-xs text-slate-500 max-w-xs truncate">
                                            {rule.meta_description ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                                            {rule.is_noindex ? (
                                                <span className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-800">
                                                    noindex
                                                </span>
                                            ) : (
                                                <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                                                    index
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(rule)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(rule)}
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

                {(seoSettings?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {seoSettings.current_page} of {seoSettings.last_page}
                        </div>
                        <div className="flex gap-1">
                            {seoSettings.links.map((link, idx) => link.url ? (
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
            {(isCreateOpen || editingItem) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingItem ? 'Edit SEO Rule' : 'Add New SEO Rule'}
                        </h2>
                        <form onSubmit={editingItem ? submitEdit : submitCreate} className="space-y-4">
                            <FormField label="Route Pattern" required error={form.errors.route_pattern}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.route_pattern}
                                        onChange={(e) => form.setData('route_pattern', e.target.value)}
                                        placeholder="e.g. /roofing or /nashville"
                                    />
                                )}
                            </FormField>
                            <FormField label="Page Title" required error={form.errors.title}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="Meta page title"
                                    />
                                )}
                            </FormField>
                            <FormField label="Meta Description" error={form.errors.meta_description}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        value={form.data.meta_description}
                                        onChange={(e) => form.setData('meta_description', e.target.value)}
                                        rows={3}
                                        placeholder="150-160 character snippet"
                                    />
                                )}
                            </FormField>
                            <FormField label="Canonical URL" error={form.errors.canonical_url}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.canonical_url}
                                        onChange={(e) => form.setData('canonical_url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                )}
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="OG Title" error={form.errors.og_title}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.og_title}
                                            onChange={(e) => form.setData('og_title', e.target.value)}
                                        />
                                    )}
                                </FormField>
                                <FormField label="OG Image" error={form.errors.og_image}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.og_image}
                                            onChange={(e) => form.setData('og_image', e.target.value)}
                                        />
                                    )}
                                </FormField>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    id="seo-noindex"
                                    type="checkbox"
                                    checked={form.data.is_noindex}
                                    onChange={(e) => form.setData('is_noindex', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                />
                                <label htmlFor="seo-noindex" className="text-sm font-medium text-slate-700">
                                    Apply noindex directive (hide from crawlers)
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingItem(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Rule'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
