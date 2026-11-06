import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    AdminButton,
    PageHeader,
    SectionCard,
    SelectInput,
    TextInput,
} from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

export type AuditLogItem = {
    id: number;
    action: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    subject_type: string | null;
    subject_id: number | string | null;
    metadata: Record<string, unknown>;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedAuditLogs = {
    data: AuditLogItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};

export type AuditLogsProps = {
    logs: PaginatedAuditLogs;
    filters: {
        action: string;
        user_id: string;
        search: string;
        from: string;
        to: string;
    };
    actions: string[];
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
        second: '2-digit',
    });
}

function getActionBadgeClass(action: string): string {
    if (action.startsWith('auth.') || action.startsWith('login')) {
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (action.startsWith('user.')) {
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (action.startsWith('settings.')) {
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (action.startsWith('media.')) {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('delete') || action.includes('revoke') || action.includes('deactivate')) {
        return 'bg-red-50 text-red-700 border-red-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
}

export default function AuditLogs({ logs, filters, actions }: AuditLogsProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [actionFilter, setActionFilter] = useState(filters?.action ?? '');
    const [fromDate, setFromDate] = useState(filters?.from ?? '');
    const [toDate, setToDate] = useState(filters?.to ?? '');
    const [inspectLog, setInspectLog] = useState<AuditLogItem | null>(null);

    function applyFilters(newSearch: string, newAction: string, newFrom: string, newTo: string) {
        router.get(
            '/admin/audit-logs',
            {
                search: newSearch || undefined,
                action: newAction || undefined,
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

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search, actionFilter, fromDate, toDate);
    }

    function handleReset() {
        setSearch('');
        setActionFilter('');
        setFromDate('');
        setToDate('');
        router.get('/admin/audit-logs', {}, { preserveState: true, replace: true });
    }

    const hasFilters = Boolean(search || actionFilter || fromDate || toDate);

    return (
        <AdminLayout>
            <Head title="Audit logs">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Audit logs"
                description="Search, filter, and inspect sensitive security and operational events recorded across the platform."
            />

            {/* Filters */}
            <SectionCard title="Filter audit logs" description="Narrow down log records by action type, user, keyword, or date range." className="mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label htmlFor="log-search" className="block text-xs font-medium text-slate-700 mb-1">
                                Keyword search
                            </label>
                            <TextInput
                                id="log-search"
                                type="search"
                                placeholder="Search action, IP, user…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="action-filter" className="block text-xs font-medium text-slate-700 mb-1">
                                Action type
                            </label>
                            <SelectInput
                                id="action-filter"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                            >
                                <option value="">All actions</option>
                                {(actions ?? []).map((act) => (
                                    <option key={act} value={act}>
                                        {act}
                                    </option>
                                ))}
                            </SelectInput>
                        </div>

                        <div>
                            <label htmlFor="from-filter" className="block text-xs font-medium text-slate-700 mb-1">
                                From date
                            </label>
                            <TextInput
                                id="from-filter"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="to-filter" className="block text-xs font-medium text-slate-700 mb-1">
                                To date
                            </label>
                            <TextInput
                                id="to-filter"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <AdminButton variant="secondary" type="submit">
                            Filter records
                        </AdminButton>
                        {hasFilters && (
                            <AdminButton variant="ghost" type="button" onClick={handleReset}>
                                Reset filters
                            </AdminButton>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* Table */}
            <SectionCard title={`Audit trail (${logs?.total ?? 0})`} description="Chronological record of events with actor, target, IP, and changes.">
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
                                    Timestamp
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Actor
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Action
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Subject
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    IP Address
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(logs?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">
                                        No audit log entries found.
                                    </td>
                                </tr>
                            ) : (
                                (logs?.data ?? []).map((log) => {
                                    const badgeClass = getActionBadgeClass(log.action);

                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="whitespace-nowrap py-3.5 pl-4 pr-3 sm:pl-6 text-xs text-slate-600 font-mono">
                                                {formatTimestamp(log.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3.5">
                                                {log.user ? (
                                                    <div>
                                                        <div className="font-medium text-slate-900">{log.user.name}</div>
                                                        <div className="text-xs text-slate-500">{log.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                        System / Guest
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
                                                >
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3.5 text-xs text-slate-600">
                                                {log.subject_type ? (
                                                    <span>
                                                        <span className="font-semibold text-slate-800">{log.subject_type}</span>
                                                        {log.subject_id && <span className="text-slate-500"> #{log.subject_id}</span>}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3.5 text-xs text-slate-500 font-mono">
                                                {log.ip_address ?? '—'}
                                            </td>
                                            <td className="whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setInspectLog(log)}
                                                    className="font-medium text-sky-700 hover:text-sky-900 hover:underline"
                                                >
                                                    View metadata
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
                {(logs?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Showing page {logs.current_page} of {logs.last_page} ({logs.total} total entries)
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {logs.links.map((link, idx) => {
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

            {/* Metadata Inspector Modal */}
            {inspectLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Log entry #{inspectLog.id}</h2>
                                <p className="text-xs text-slate-500">
                                    Action: <span className="font-semibold text-slate-700">{inspectLog.action}</span> ·{' '}
                                    {formatTimestamp(inspectLog.created_at)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInspectLog(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div>
                                    <span className="font-semibold text-slate-700 block">Actor:</span>
                                    <span>{inspectLog.user ? `${inspectLog.user.name} (${inspectLog.user.email})` : 'System / Guest'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700 block">IP Address:</span>
                                    <span className="font-mono">{inspectLog.ip_address ?? '—'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700 block">Subject:</span>
                                    <span>{inspectLog.subject_type ? `${inspectLog.subject_type} #${inspectLog.subject_id}` : '—'}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700 block">User Agent:</span>
                                    <span className="truncate block" title={inspectLog.user_agent ?? ''}>
                                        {inspectLog.user_agent ?? '—'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Metadata payload (JSON):</label>
                                <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-emerald-400 text-xs">
                                    {JSON.stringify(inspectLog.metadata, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
                            <AdminButton variant="outline" type="button" onClick={() => setInspectLog(null)}>
                                Close
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

