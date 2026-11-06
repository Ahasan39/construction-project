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

export type CmsGalleryItem = {
    id: number;
    title: string;
    category: string;
    location: string | null;
    image_url: string;
    before_image_url: string | null;
    description: string | null;
    is_published: boolean;
    display_order: number;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedGallery = {
    data: CmsGalleryItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type GalleryProps = {
    galleries: PaginatedGallery;
    filters: {
        search: string;
        category: string;
    };
    categories: string[];
    canManage: boolean;
};

export default function Gallery({ galleries, filters, categories, canManage }: GalleryProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CmsGalleryItem | null>(null);

    const form = useForm({
        title: '',
        category: 'Roofing',
        location: '',
        image_url: '',
        before_image_url: '',
        description: '',
        is_published: true,
        display_order: 0,
    });

    function applyFilters(newSearch: string, newCategory: string) {
        router.get(
            '/admin/cms/gallery',
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
            category: 'Roofing',
            location: '',
            image_url: '',
            before_image_url: '',
            description: '',
            is_published: true,
            display_order: 0,
        });
        setIsCreateOpen(true);
    }

    function openEdit(item: CmsGalleryItem) {
        setEditingItem(item);
        form.clearErrors();
        form.setData({
            title: item.title,
            category: item.category,
            location: item.location ?? '',
            image_url: item.image_url,
            before_image_url: item.before_image_url ?? '',
            description: item.description ?? '',
            is_published: item.is_published,
            display_order: item.display_order,
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/gallery', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingItem) return;
        form.patch(`/admin/cms/gallery/${editingItem.id}`, {
            onSuccess: () => {
                setEditingItem(null);
                form.reset();
            },
        });
    }

    function deleteItem(item: CmsGalleryItem) {
        if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
        router.delete(`/admin/cms/gallery/${item.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Gallery CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Project Gallery"
                description="Manage residential exterior projects, showcase photography, categories, and before/after comparisons."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add project
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter gallery" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <TextInput
                        placeholder="Search projects by title, location…"
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

            <SectionCard title={`Gallery items (${galleries?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Project</th>
                                <th scope="col" className="px-3 py-3.5">Category</th>
                                <th scope="col" className="px-3 py-3.5">Location</th>
                                <th scope="col" className="px-3 py-3.5">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(galleries?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        No gallery projects found.
                                    </td>
                                </tr>
                            ) : (
                                (galleries?.data ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="font-medium text-slate-900">{item.title}</div>
                                            <div className="text-xs text-slate-400 font-mono truncate max-w-xs">{item.image_url}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                            {item.location ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {item.is_published ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(item)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(item)}
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

                {(galleries?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {galleries.current_page} of {galleries.last_page}
                        </div>
                        <div className="flex gap-1">
                            {galleries.links.map((link, idx) => link.url ? (
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
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingItem ? 'Edit Gallery Project' : 'Add New Project'}
                        </h2>
                        <form onSubmit={editingItem ? submitEdit : submitCreate} className="space-y-4">
                            <FormField label="Project Title" required error={form.errors.title}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.title}
                                        onChange={(e) => form.setData('title', e.target.value)}
                                        placeholder="e.g. Modern Shingle Replacement in Nashville"
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
                                <FormField label="Location" error={form.errors.location}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.location}
                                            onChange={(e) => form.setData('location', e.target.value)}
                                            placeholder="e.g. Nashville, TN"
                                        />
                                    )}
                                </FormField>
                            </div>
                            <FormField label="Image URL" required error={form.errors.image_url}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.image_url}
                                        onChange={(e) => form.setData('image_url', e.target.value)}
                                        placeholder="/images/gallery/roof-nashville.webp"
                                    />
                                )}
                            </FormField>
                            <FormField label="Before Image URL (Optional)" error={form.errors.before_image_url}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.before_image_url}
                                        onChange={(e) => form.setData('before_image_url', e.target.value)}
                                        placeholder="/images/gallery/roof-nashville-before.webp"
                                    />
                                )}
                            </FormField>
                            <FormField label="Description" error={form.errors.description}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        rows={3}
                                    />
                                )}
                            </FormField>
                            <div className="flex items-center gap-2">
                                <input
                                    id="gallery-published"
                                    type="checkbox"
                                    checked={form.data.is_published}
                                    onChange={(e) => form.setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                />
                                <label htmlFor="gallery-published" className="text-sm font-medium text-slate-700">
                                    Project is published in gallery
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingItem(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Project'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
