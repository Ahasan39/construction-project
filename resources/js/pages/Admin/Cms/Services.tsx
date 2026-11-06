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

export type CmsServiceItem = {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    icon: string | null;
    hero_image: string | null;
    is_active: boolean;
    display_order: number;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedServices = {
    data: CmsServiceItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type ServicesProps = {
    services: PaginatedServices;
    filters: {
        search: string;
    };
    canManage: boolean;
};

export default function Services({ services, filters, canManage }: ServicesProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingService, setEditingService] = useState<CmsServiceItem | null>(null);

    const form = useForm({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        icon: '',
        hero_image: '',
        is_active: true,
        display_order: 0,
    });

    function applyFilters(newSearch: string) {
        router.get(
            '/admin/cms/services',
            { search: newSearch || undefined },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search);
    }

    function openCreate() {
        form.reset();
        form.clearErrors();
        form.setData({
            name: '',
            slug: '',
            tagline: '',
            description: '',
            icon: '',
            hero_image: '',
            is_active: true,
            display_order: 0,
        });
        setIsCreateOpen(true);
    }

    function openEdit(service: CmsServiceItem) {
        setEditingService(service);
        form.clearErrors();
        form.setData({
            name: service.name,
            slug: service.slug,
            tagline: service.tagline ?? '',
            description: service.description ?? '',
            icon: service.icon ?? '',
            hero_image: service.hero_image ?? '',
            is_active: service.is_active,
            display_order: service.display_order,
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/services', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingService) return;
        form.patch(`/admin/cms/services/${editingService.id}`, {
            onSuccess: () => {
                setEditingService(null);
                form.reset();
            },
        });
    }

    function deleteService(service: CmsServiceItem) {
        if (!confirm(`Are you sure you want to delete "${service.name}"?`)) return;
        router.delete(`/admin/cms/services/${service.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Services CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Services"
                description="Manage core exterior services, sub-variants, display ordering, and descriptions."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add service
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter services" className="mb-6">
                <form onSubmit={handleSearchSubmit} className="flex gap-3">
                    <TextInput
                        placeholder="Search services by name, tagline, or slug…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <AdminButton variant="secondary" type="submit">
                        Search
                    </AdminButton>
                </form>
            </SectionCard>

            <SectionCard title={`Services (${services?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Service</th>
                                <th scope="col" className="px-3 py-3.5">Slug</th>
                                <th scope="col" className="px-3 py-3.5">Status</th>
                                <th scope="col" className="px-3 py-3.5">Order</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(services?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        No services found.
                                    </td>
                                </tr>
                            ) : (
                                (services?.data ?? []).map((srv) => (
                                    <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="font-medium text-slate-900">{srv.name}</div>
                                            <div className="text-xs text-slate-500">{srv.tagline}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-mono text-slate-600">
                                            /{srv.slug}/
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {srv.is_active ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                            {srv.display_order}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(srv)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteService(srv)}
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

                {(services?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {services.current_page} of {services.last_page}
                        </div>
                        <div className="flex gap-1">
                            {services.links.map((link, idx) => link.url ? (
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
            {(isCreateOpen || editingService) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        <form onSubmit={editingService ? submitEdit : submitCreate} className="space-y-4">
                            <FormField label="Service Name" required error={form.errors.name}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="e.g. Roofing"
                                    />
                                )}
                            </FormField>
                            <FormField label="URL Slug" error={form.errors.slug}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.slug}
                                        onChange={(e) => form.setData('slug', e.target.value)}
                                        placeholder="e.g. roofing (auto-generated if empty)"
                                    />
                                )}
                            </FormField>
                            <FormField label="Tagline" error={form.errors.tagline}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.tagline}
                                        onChange={(e) => form.setData('tagline', e.target.value)}
                                        placeholder="Short summary tagline"
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
                                    id="service-active"
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                />
                                <label htmlFor="service-active" className="text-sm font-medium text-slate-700">
                                    Service is active on website
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingService(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Service'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
