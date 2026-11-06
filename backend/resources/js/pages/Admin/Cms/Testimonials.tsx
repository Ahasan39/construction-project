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

export type CmsTestimonialItem = {
    id: number;
    author: string;
    city_state: string;
    rating: number;
    service: string | null;
    body: string;
    is_featured: boolean;
    is_published: boolean;
    display_order: number;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedTestimonials = {
    data: CmsTestimonialItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type TestimonialsProps = {
    testimonials: PaginatedTestimonials;
    filters: {
        search: string;
        service: string;
    };
    canManage: boolean;
};

export default function Testimonials({ testimonials, filters, canManage }: TestimonialsProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [serviceFilter, setServiceFilter] = useState(filters?.service ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CmsTestimonialItem | null>(null);

    const form = useForm({
        author: '',
        city_state: '',
        rating: 5,
        service: 'roofing',
        body: '',
        is_featured: false,
        is_published: true,
        display_order: 0,
    });

    function applyFilters(newSearch: string, newService: string) {
        router.get(
            '/admin/cms/testimonials',
            {
                search: newSearch || undefined,
                service: newService || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleFilterSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search, serviceFilter);
    }

    function openCreate() {
        form.reset();
        form.clearErrors();
        form.setData({
            author: '',
            city_state: '',
            rating: 5,
            service: 'roofing',
            body: '',
            is_featured: false,
            is_published: true,
            display_order: 0,
        });
        setIsCreateOpen(true);
    }

    function openEdit(item: CmsTestimonialItem) {
        setEditingItem(item);
        form.clearErrors();
        form.setData({
            author: item.author,
            city_state: item.city_state,
            rating: item.rating,
            service: item.service ?? 'roofing',
            body: item.body,
            is_featured: item.is_featured,
            is_published: item.is_published,
            display_order: item.display_order,
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/testimonials', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingItem) return;
        form.patch(`/admin/cms/testimonials/${editingItem.id}`, {
            onSuccess: () => {
                setEditingItem(null);
                form.reset();
            },
        });
    }

    function deleteItem(item: CmsTestimonialItem) {
        if (!confirm(`Are you sure you want to delete review by "${item.author}"?`)) return;
        router.delete(`/admin/cms/testimonials/${item.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Testimonials CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Customer Reviews & Testimonials"
                description="Manage verified customer feedback, star ratings, service attribution, and featured display states."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add review
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter testimonials" className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <TextInput
                        placeholder="Search by author, location, keywords…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <AdminButton variant="secondary" type="submit">
                        Filter
                    </AdminButton>
                </form>
            </SectionCard>

            <SectionCard title={`Reviews (${testimonials?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Author</th>
                                <th scope="col" className="px-3 py-3.5">Rating</th>
                                <th scope="col" className="px-3 py-3.5">Service</th>
                                <th scope="col" className="px-3 py-3.5">Featured</th>
                                <th scope="col" className="px-3 py-3.5">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(testimonials?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                (testimonials?.data ?? []).map((rev) => (
                                    <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="font-medium text-slate-900">{rev.author}</div>
                                            <div className="text-xs text-slate-500">{rev.city_state}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-semibold text-amber-600">
                                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs capitalize text-slate-600">
                                            {rev.service ?? 'General'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                                            {rev.is_featured ? (
                                                <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {rev.is_published ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                                                    Hidden
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(rev)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(rev)}
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

                {(testimonials?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {testimonials.current_page} of {testimonials.last_page}
                        </div>
                        <div className="flex gap-1">
                            {testimonials.links.map((link, idx) => link.url ? (
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
                            {editingItem ? 'Edit Review' : 'Add Customer Review'}
                        </h2>
                        <form onSubmit={editingItem ? submitEdit : submitCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Author Name" required error={form.errors.author}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.author}
                                            onChange={(e) => form.setData('author', e.target.value)}
                                            placeholder="e.g. Paul R."
                                        />
                                    )}
                                </FormField>
                                <FormField label="City, State" required error={form.errors.city_state}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.city_state}
                                            onChange={(e) => form.setData('city_state', e.target.value)}
                                            placeholder="e.g. Columbus, OH"
                                        />
                                    )}
                                </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Star Rating" required error={form.errors.rating}>
                                    {(fieldProps) => (
                                        <SelectInput
                                            {...fieldProps}
                                            value={form.data.rating}
                                            onChange={(e) => form.setData('rating', Number(e.target.value))}
                                        >
                                            <option value={5}>5 Stars (★★★★★)</option>
                                            <option value={4}>4 Stars (★★★★☆)</option>
                                            <option value={3}>3 Stars (★★★☆☆)</option>
                                            <option value={2}>2 Stars (★★☆☆☆)</option>
                                            <option value={1}>1 Star (★☆☆☆☆)</option>
                                        </SelectInput>
                                    )}
                                </FormField>
                                <FormField label="Service Scope" error={form.errors.service}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            value={form.data.service}
                                            onChange={(e) => form.setData('service', e.target.value)}
                                            placeholder="e.g. roofing"
                                        />
                                    )}
                                </FormField>
                            </div>
                            <FormField label="Review Body" required error={form.errors.body}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        value={form.data.body}
                                        onChange={(e) => form.setData('body', e.target.value)}
                                        rows={4}
                                        placeholder="Customer review statement…"
                                    />
                                )}
                            </FormField>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) => form.setData('is_featured', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                    />
                                    Feature on homepage
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_published}
                                        onChange={(e) => form.setData('is_published', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                    />
                                    Published
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingItem(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Review'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
