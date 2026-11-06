import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    AdminButton,
    FormField,
    PageHeader,
    SectionCard,
    TextInput,
} from '../../../components/AdminUI';
import { AdminLayout } from '../../../layouts/AdminLayout';

export type CmsLocationItem = {
    id: number;
    city: string;
    state: string;
    slug: string;
    region: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    display_order: number;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedLocations = {
    data: CmsLocationItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type LocationsProps = {
    locations: PaginatedLocations;
    filters: {
        search: string;
    };
    canManage: boolean;
};

export default function Locations({ locations, filters, canManage }: LocationsProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<CmsLocationItem | null>(null);

    const form = useForm({
        city: '',
        state: '',
        slug: '',
        region: '',
        phone: '',
        address: '',
        is_active: true,
        display_order: 0,
    });

    function applyFilters(newSearch: string) {
        router.get(
            '/admin/cms/locations',
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
            city: '',
            state: '',
            slug: '',
            region: '',
            phone: '',
            address: '',
            is_active: true,
            display_order: 0,
        });
        setIsCreateOpen(true);
    }

    function openEdit(loc: CmsLocationItem) {
        setEditingLocation(loc);
        form.clearErrors();
        form.setData({
            city: loc.city,
            state: loc.state,
            slug: loc.slug,
            region: loc.region ?? '',
            phone: loc.phone ?? '',
            address: loc.address ?? '',
            is_active: loc.is_active,
            display_order: loc.display_order,
        });
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        form.post('/admin/cms/locations', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingLocation) return;
        form.patch(`/admin/cms/locations/${editingLocation.id}`, {
            onSuccess: () => {
                setEditingLocation(null);
                form.reset();
            },
        });
    }

    function deleteLocation(loc: CmsLocationItem) {
        if (!confirm(`Are you sure you want to delete "${loc.city}, ${loc.state}"?`)) return;
        router.delete(`/admin/cms/locations/${loc.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Locations CMS">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Locations"
                description="Manage operational branch hubs, regions, addresses, phone contacts, and status."
                actions={
                    canManage ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            Add location
                        </AdminButton>
                    ) : null
                }
            />

            <SectionCard title="Filter locations" className="mb-6">
                <form onSubmit={handleSearchSubmit} className="flex gap-3">
                    <TextInput
                        placeholder="Search locations by city, state, or region…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                    <AdminButton variant="secondary" type="submit">
                        Search
                    </AdminButton>
                </form>
            </SectionCard>

            <SectionCard title={`Locations (${locations?.total ?? 0})`}>
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">Location</th>
                                <th scope="col" className="px-3 py-3.5">Slug</th>
                                <th scope="col" className="px-3 py-3.5">Region</th>
                                <th scope="col" className="px-3 py-3.5">Phone</th>
                                <th scope="col" className="px-3 py-3.5">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(locations?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">
                                        No locations found.
                                    </td>
                                </tr>
                            ) : (
                                (locations?.data ?? []).map((loc) => (
                                    <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="font-medium text-slate-900">{loc.city}, {loc.state}</div>
                                            <div className="text-xs text-slate-500">{loc.address}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs font-mono text-slate-600">
                                            /{loc.slug}/
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                            {loc.region ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                            {loc.phone ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            {loc.is_active ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                            {canManage ? (
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(loc)}
                                                        className="font-medium text-sky-700 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteLocation(loc)}
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

                {(locations?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Page {locations.current_page} of {locations.last_page}
                        </div>
                        <div className="flex gap-1">
                            {locations.links.map((link, idx) => link.url ? (
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
            {(isCreateOpen || editingLocation) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            {editingLocation ? 'Edit Location' : 'Add New Location'}
                        </h2>
                        <form onSubmit={editingLocation ? submitEdit : submitCreate} className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <FormField label="City" required error={form.errors.city}>
                                        {(fieldProps) => (
                                            <TextInput
                                                {...fieldProps}
                                                value={form.data.city}
                                                onChange={(e) => form.setData('city', e.target.value)}
                                                placeholder="e.g. Nashville"
                                            />
                                        )}
                                    </FormField>
                                </div>
                                <div>
                                    <FormField label="State" required error={form.errors.state}>
                                        {(fieldProps) => (
                                            <TextInput
                                                {...fieldProps}
                                                value={form.data.state}
                                                onChange={(e) => form.setData('state', e.target.value)}
                                                placeholder="e.g. TN"
                                            />
                                        )}
                                    </FormField>
                                </div>
                            </div>
                            <FormField label="URL Slug" error={form.errors.slug}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.slug}
                                        onChange={(e) => form.setData('slug', e.target.value)}
                                        placeholder="e.g. nashville (auto-generated if empty)"
                                    />
                                )}
                            </FormField>
                            <FormField label="Region" error={form.errors.region}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.region}
                                        onChange={(e) => form.setData('region', e.target.value)}
                                        placeholder="e.g. nashville-area"
                                    />
                                )}
                            </FormField>
                            <FormField label="Phone Number" error={form.errors.phone}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        placeholder="+1 555-0100"
                                    />
                                )}
                            </FormField>
                            <FormField label="Address" error={form.errors.address}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={form.data.address}
                                        onChange={(e) => form.setData('address', e.target.value)}
                                        placeholder="Street address, City, State ZIP"
                                    />
                                )}
                            </FormField>
                            <div className="flex items-center gap-2">
                                <input
                                    id="location-active"
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a]"
                                />
                                <label htmlFor="location-active" className="text-sm font-medium text-slate-700">
                                    Location hub is active
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <AdminButton variant="outline" type="button" onClick={() => { setIsCreateOpen(false); setEditingLocation(null); }}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={form.processing}>
                                    {form.processing ? 'Saving…' : 'Save Location'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
