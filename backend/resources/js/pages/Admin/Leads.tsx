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
} from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

export type LeadItem = {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    location: string;
    status: string;
    status_label: string;
    consent_reminders: boolean;
    consent_promotions: boolean;
    notes: string | null;
    ip_address: string | null;
    contacted_at: string | null;
    scheduled_at: string | null;
    closed_at: string | null;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedLeads = {
    data: LeadItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};

export type LeadMetrics = {
    total: number;
    new: number;
    contacted: number;
    scheduled: number;
    closed: number;
};

export type StatusOption = {
    value: string;
    label: string;
};

export type LeadsProps = {
    leads: PaginatedLeads;
    metrics: LeadMetrics;
    statuses: StatusOption[];
    filters: {
        search: string;
        status: string;
        service: string;
        location: string;
        from: string;
        to: string;
    };
    canManage: boolean;
};

const statusBadgeClasses: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
    closed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatTimestamp(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Leads({ leads, metrics, statuses, filters, canManage }: LeadsProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? '');
    const [serviceFilter, setServiceFilter] = useState(filters?.service ?? '');
    const [fromDate, setFromDate] = useState(filters?.from ?? '');
    const [toDate, setToDate] = useState(filters?.to ?? '');

    const [activeLead, setActiveLead] = useState<LeadItem | null>(null);

    const updateForm = useForm({
        status: 'new',
        notes: '',
    });

    function applyFilters(
        newSearch: string,
        newStatus: string,
        newService: string,
        newFrom: string,
        newTo: string
    ) {
        router.get(
            '/admin/leads',
            {
                search: newSearch || undefined,
                status: newStatus || undefined,
                service: newService || undefined,
                from: newFrom || undefined,
                to: newTo || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function handleFilterSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search, statusFilter, serviceFilter, fromDate, toDate);
    }

    function handleResetFilters() {
        setSearch('');
        setStatusFilter('');
        setServiceFilter('');
        setFromDate('');
        setToDate('');
        router.get('/admin/leads', {}, { preserveState: true, replace: true });
    }

    function openLeadModal(lead: LeadItem) {
        setActiveLead(lead);
        updateForm.clearErrors();
        updateForm.setData({
            status: lead.status,
            notes: lead.notes ?? '',
        });
    }

    function closeLeadModal() {
        setActiveLead(null);
        updateForm.reset();
        updateForm.clearErrors();
    }

    function handleUpdateLead(e: FormEvent) {
        e.preventDefault();
        if (!activeLead) return;

        updateForm.patch(`/admin/leads/${activeLead.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeLeadModal();
            },
        });
    }

    function handleQuickStatusChange(lead: LeadItem, newStatus: string) {
        if (!canManage || lead.status === newStatus) return;

        router.patch(
            `/admin/leads/${lead.id}`,
            {
                status: newStatus,
                notes: lead.notes,
            },
            {
                preserveScroll: true,
            }
        );
    }

    const exportUrl = `/admin/leads/export?${new URLSearchParams({
        ...(search ? { search } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(serviceFilter ? { service: serviceFilter } : {}),
        ...(fromDate ? { from: fromDate } : {}),
        ...(toDate ? { to: toDate } : {}),
    }).toString()}`;

    const hasFilters = Boolean(search || statusFilter || serviceFilter || fromDate || toDate);

    return (
        <AdminLayout>
            <Head title="Leads & Enquiries">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Leads & Enquiries"
                description="Review customer quote requests, advance pipeline status, and maintain follow-up notes."
                actions={
                    <a
                        href={exportUrl}
                        download
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </a>
                }
            />

            {/* Metrics cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div
                    onClick={() => {
                        setStatusFilter('');
                        applyFilters(search, '', serviceFilter, fromDate, toDate);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        statusFilter === '' ? 'border-sky-500 bg-sky-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                    <div className="text-xs font-medium text-slate-500">All leads</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{metrics?.total ?? 0}</div>
                </div>

                <div
                    onClick={() => {
                        setStatusFilter('new');
                        applyFilters(search, 'new', serviceFilter, fromDate, toDate);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        statusFilter === 'new' ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                    <div className="text-xs font-medium text-blue-600">New</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{metrics?.new ?? 0}</div>
                </div>

                <div
                    onClick={() => {
                        setStatusFilter('contacted');
                        applyFilters(search, 'contacted', serviceFilter, fromDate, toDate);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        statusFilter === 'contacted' ? 'border-amber-500 bg-amber-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                    <div className="text-xs font-medium text-amber-600">Contacted</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{metrics?.contacted ?? 0}</div>
                </div>

                <div
                    onClick={() => {
                        setStatusFilter('scheduled');
                        applyFilters(search, 'scheduled', serviceFilter, fromDate, toDate);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        statusFilter === 'scheduled' ? 'border-purple-500 bg-purple-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                    <div className="text-xs font-medium text-purple-600">Scheduled</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{metrics?.scheduled ?? 0}</div>
                </div>

                <div
                    onClick={() => {
                        setStatusFilter('closed');
                        applyFilters(search, 'closed', serviceFilter, fromDate, toDate);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        statusFilter === 'closed' ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                >
                    <div className="text-xs font-medium text-emerald-600">Closed</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{metrics?.closed ?? 0}</div>
                </div>
            </div>

            {/* Filter controls */}
            <SectionCard title="Filter leads" description="Search leads by customer contact details, service requested, or timeline." className="mb-6">
                <form onSubmit={handleFilterSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <label htmlFor="lead-search" className="block text-xs font-medium text-slate-700 mb-1">
                                Customer or keywords
                            </label>
                            <TextInput
                                id="lead-search"
                                type="search"
                                placeholder="Search by name, email, phone…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="lead-status" className="block text-xs font-medium text-slate-700 mb-1">
                                Pipeline status
                            </label>
                            <SelectInput
                                id="lead-status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                {(statuses ?? []).map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>

                        <div>
                            <label htmlFor="lead-from" className="block text-xs font-medium text-slate-700 mb-1">
                                From date
                            </label>
                            <TextInput
                                id="lead-from"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="lead-to" className="block text-xs font-medium text-slate-700 mb-1">
                                To date
                            </label>
                            <TextInput
                                id="lead-to"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <AdminButton variant="secondary" type="submit">
                            Filter
                        </AdminButton>
                        {hasFilters && (
                            <AdminButton variant="ghost" type="button" onClick={handleResetFilters}>
                                Reset
                            </AdminButton>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* Table */}
            <SectionCard title={`Leads (${leads?.total ?? 0})`} description="Incoming enquiries and quote requests from website estimate forms.">
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
                                    Customer
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Service & Location
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Received
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(leads?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">
                                        No leads found matching your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                (leads?.data ?? []).map((lead) => {
                                    const badgeClass = statusBadgeClasses[lead.status] ?? 'bg-slate-50 text-slate-700 border-slate-200';

                                    return (
                                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                <div>
                                                    <div className="font-medium text-slate-900">{lead.name}</div>
                                                    <div className="text-xs text-slate-500">{lead.email} · {lead.phone}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <div className="text-xs">
                                                    <span className="font-semibold text-slate-800 capitalize">
                                                        {lead.service}
                                                    </span>
                                                    <div className="text-slate-500">{lead.location}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                {canManage ? (
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleQuickStatusChange(lead, e.target.value)}
                                                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-pointer focus:outline-none ${badgeClass}`}
                                                    >
                                                        {(statuses ?? []).map((s) => (
                                                            <option key={s.value} value={s.value}>
                                                                {s.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                                                        {lead.status_label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 font-mono">
                                                {formatTimestamp(lead.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => openLeadModal(lead)}
                                                    className="font-medium text-sky-700 hover:text-sky-900 hover:underline"
                                                >
                                                    Manage & Notes
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {(leads?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Showing page {leads.current_page} of {leads.last_page} ({leads.total} total leads)
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {leads.links.map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 text-xs text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-[#d9232a] text-white'
                                                : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* Lead Manage Modal */}
            {activeLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Lead #{activeLead.id}</h2>
                                <p className="text-xs text-slate-500">
                                    Submitted {formatTimestamp(activeLead.created_at)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeLeadModal}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Customer overview */}
                        <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-xs border border-slate-200">
                            <div>
                                <span className="font-semibold text-slate-700 block">Customer:</span>
                                <span className="text-slate-900 font-medium">{activeLead.name}</span>
                                <div className="text-slate-500">{activeLead.email}</div>
                                <div className="text-slate-500">{activeLead.phone}</div>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-700 block">Scope:</span>
                                <span className="text-slate-900 font-medium capitalize">{activeLead.service}</span>
                                <div className="text-slate-500">{activeLead.location}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-1">IP: {activeLead.ip_address ?? '—'}</div>
                            </div>
                        </div>

                        {/* Pipeline dates */}
                        <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50/50 p-2.5 text-[11px] border border-slate-100">
                            <div>
                                <span className="text-slate-500 block">Contacted:</span>
                                <span className="font-medium text-slate-800">{formatTimestamp(activeLead.contacted_at)}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Scheduled:</span>
                                <span className="font-medium text-slate-800">{formatTimestamp(activeLead.scheduled_at)}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Closed:</span>
                                <span className="font-medium text-slate-800">{formatTimestamp(activeLead.closed_at)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateLead} className="space-y-4">
                            <FormField label="Pipeline status" required error={updateForm.errors.status}>
                                {(fieldProps) => (
                                    <SelectInput
                                        {...fieldProps}
                                        value={updateForm.data.status}
                                        disabled={!canManage}
                                        onChange={(e) => updateForm.setData('status', e.target.value)}
                                    >
                                        {(statuses ?? []).map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                )}
                            </FormField>

                            <FormField label="Internal notes & follow-up log" error={updateForm.errors.notes}>
                                {(fieldProps) => (
                                    <TextArea
                                        {...fieldProps}
                                        rows={4}
                                        disabled={!canManage}
                                        placeholder="Add conversation notes, inspection quotes, or customer requirements…"
                                        value={updateForm.data.notes}
                                        onChange={(e) => updateForm.setData('notes', e.target.value)}
                                    />
                                )}
                            </FormField>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <AdminButton variant="outline" type="button" onClick={closeLeadModal}>
                                    Close
                                </AdminButton>
                                {canManage && (
                                    <AdminButton variant="primary" type="submit" disabled={updateForm.processing}>
                                        {updateForm.processing ? 'Saving…' : 'Save changes'}
                                    </AdminButton>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

