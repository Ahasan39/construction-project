import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { PageHeader } from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

type ChecklistRow = { label: string; done: boolean };

type DashboardProps = {
    summaries: {
        users: { total: number; active: number } | null;
        media: { total: number } | null;
        audit: { total: number; last_24h: number } | null;
        settings: {
            checklist: ChecklistRow[];
            completed: number;
            total: number;
        } | null;
    };
    recentActivity:
        | Array<{
              id: number;
              action: string;
              actor: string | null;
              created_at: string | null;
          }>
        | null;
    session: {
        last_login_at: string | null;
    };
};

type SharedProps = {
    appName: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            permissions: string[];
        } | null;
    };
};

const roleLabels: Record<string, string> = {
    super_admin: 'Super administrator',
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
};

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className={className}
            aria-hidden="true"
        >
            <path d={d} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type StatTone = 'default' | 'accent' | 'success' | 'warning' | 'muted';

function StatCard({
    label,
    value,
    hint,
    icon,
    tone = 'default',
}: {
    label: string;
    value: ReactNode;
    hint?: string;
    icon?: ReactNode;
    tone?: StatTone;
}) {
    const toneClasses: Record<StatTone, string> = {
        default: 'bg-white text-slate-900 border-slate-200',
        accent: 'bg-white text-slate-900 border-slate-200',
        success: 'bg-white text-slate-900 border-slate-200',
        warning: 'bg-white text-slate-900 border-slate-200',
        muted: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    const iconToneClasses: Record<StatTone, string> = {
        default: 'bg-slate-100 text-slate-600',
        accent: 'bg-[#d9232a]/10 text-[#d9232a]',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        muted: 'bg-slate-100 text-slate-500',
    };

    return (
        <div
            className={`flex items-start gap-4 rounded-xl border p-5 shadow-sm ${toneClasses[tone]}`}
        >
            {icon && (
                <span
                    className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${iconToneClasses[tone]}`}
                >
                    {icon}
                </span>
            )}
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                </p>
                <p className="mt-1 text-2xl font-semibold leading-none">{value}</p>
                {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
            </div>
        </div>
    );
}

function Panel({
    title,
    description,
    action,
    children,
    className = '',
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
            <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                    {description && (
                        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                    )}
                </div>
                {action}
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

function formatRelative(iso: string | null): string {
    if (!iso) {
        return '—';
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString();
}

const actionLabels: Record<string, string> = {
    'auth.login': 'Signed in',
    'auth.logout': 'Signed out',
    'settings.updated': 'Updated site settings',
    'media.uploaded': 'Uploaded media',
    'user.created': 'Created user',
    'user.updated': 'Updated user',
    'user.deleted': 'Deleted user',
};

export default function Dashboard() {
    const page = usePage<SharedProps & DashboardProps>();
    const { auth, summaries, recentActivity, session } = page.props;
    const user = auth.user;
    const permissions = user?.permissions ?? [];

    const canViewSettings = permissions.includes('settings.view');
    const canViewUsers = permissions.includes('users.view');
    const canUploadMedia = permissions.includes('media.upload');
    const canViewAudit = permissions.includes('audit.view');

    return (
        <AdminLayout>
            <Head title="Admin dashboard">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'admin'}`}
                description="A quick snapshot of your CMS. Numbers below come from the live database — only modules with real backend data are counted."
                actions={
                    canViewSettings ? (
                        <Link
                            href="/admin/settings/general"
                            className="inline-flex h-9 items-center rounded-md bg-[#d9232a] px-4 text-sm font-medium text-white transition hover:bg-[#b81b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                        >
                            Open general settings
                        </Link>
                    ) : null
                }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaries.users && (
                    <StatCard
                        label="CMS users"
                        value={summaries.users.total}
                        hint={`${summaries.users.active} active`}
                        tone="accent"
                        icon={<Icon d="M16 11a4 4 0 10-8 0 4 4 0 008 0z M3 21v-1a7 7 0 0114 0v1" />}
                    />
                )}
                {summaries.settings && (
                    <StatCard
                        label="Settings complete"
                        value={`${summaries.settings.completed}/${summaries.settings.total}`}
                        hint="General site information"
                        tone="success"
                        icon={<Icon d="M12 8v4l3 2 M12 2a10 10 0 100 20 10 10 0 000-20z" />}
                    />
                )}
                {summaries.media && (
                    <StatCard
                        label="Media files"
                        value={summaries.media.total}
                        hint="Uploaded to the library"
                        icon={<Icon d="M4 4h16v16H4z M4 14l4-4 4 4 4-4 4 4" />}
                    />
                )}
                {summaries.audit && (
                    <StatCard
                        label="Audit events"
                        value={summaries.audit.total}
                        hint={`${summaries.audit.last_24h} in the last 24h`}
                        tone="muted"
                        icon={<Icon d="M4 4h16v16H4z M8 10h8 M8 14h5" />}
                    />
                )}
                {!summaries.users &&
                    !summaries.settings &&
                    !summaries.media &&
                    !summaries.audit && (
                        <div className="col-span-full rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
                            Your role does not include any dashboard metrics. Use the sidebar to
                            open the areas you have access to.
                        </div>
                    )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    {canViewAudit && (
                        <Panel
                            title="Recent activity"
                            description="Latest audit entries recorded by Laravel."
                        >
                            {recentActivity && recentActivity.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {recentActivity.map((entry) => (
                                        <li
                                            key={entry.id}
                                            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-1 h-2 w-2 flex-none rounded-full bg-[#d9232a]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {actionLabels[entry.action] ?? entry.action}
                                                </p>
                                                <p className="truncate text-xs text-slate-500">
                                                    {entry.actor ?? 'System'} ·{' '}
                                                    {formatRelative(entry.created_at)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No activity has been recorded yet. Audit entries will appear
                                    here after the first sign-in or settings change.
                                </p>
                            )}
                        </Panel>
                    )}

                    <Panel
                        title="Module status"
                        description="Only modules with real backend data are counted; the rest remain in the public demo until later sprints migrate them."
                    >
                        <ul className="divide-y divide-slate-100 text-sm">
                            {[
                                { label: 'Authentication & roles', status: 'live' as const },
                                {
                                    label: 'General settings',
                                    status: canViewSettings
                                        ? ('live' as const)
                                        : ('restricted' as const),
                                },
                                {
                                    label: 'Media library',
                                    status: canUploadMedia
                                        ? ('live' as const)
                                        : ('restricted' as const),
                                },
                                {
                                    label: 'Audit log',
                                    status: canViewAudit
                                        ? ('live' as const)
                                        : ('restricted' as const),
                                },
                                { label: 'Pages & content', status: 'pending' as const },
                                { label: 'Project gallery', status: 'pending' as const },
                                { label: 'Leads / enquiries', status: 'pending' as const },
                                { label: 'SEO & marketing', status: 'pending' as const },
                            ].map((row) => (
                                <li
                                    key={row.label}
                                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                                >
                                    <span className="text-slate-700">{row.label}</span>
                                    {row.status === 'live' && (
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                            Live
                                        </span>
                                    )}
                                    {row.status === 'restricted' && (
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                            Not your role
                                        </span>
                                    )}
                                    {row.status === 'pending' && (
                                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                                            Coming in a later sprint
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Panel>
                </div>

                <div className="space-y-5">
                    <Panel title="Your session" description="Signed-in web session.">
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Account
                                </dt>
                                <dd className="mt-0.5 font-medium text-slate-900">
                                    {user?.name ?? 'Unknown'}
                                </dd>
                                <dd className="break-all text-xs text-slate-500">
                                    {user?.email ?? ''}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Role
                                </dt>
                                <dd className="mt-0.5 text-slate-700">
                                    {user ? roleLabels[user.role] ?? user.role : 'Unknown'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Last sign-in
                                </dt>
                                <dd className="mt-0.5 text-slate-700">
                                    {formatRelative(session.last_login_at)}
                                </dd>
                            </div>
                        </dl>
                    </Panel>

                    {summaries.settings && (
                        <Panel
                            title="Site setup checklist"
                            description="Fields saved on the General settings record."
                        >
                            <ul className="space-y-2.5 text-sm">
                                {summaries.settings.checklist.map((row) => (
                                    <li
                                        key={row.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-slate-700">{row.label}</span>
                                        <span
                                            className={`text-xs font-semibold ${
                                                row.done
                                                    ? 'text-emerald-700'
                                                    : 'text-amber-700'
                                            }`}
                                        >
                                            {row.done ? 'Complete' : 'Pending'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Panel>
                    )}

                    <Panel title="Quick links">
                        <ul className="space-y-2 text-sm">
                            {canViewSettings && (
                                <li>
                                    <Link
                                        href="/admin/settings/general"
                                        className="font-medium text-sky-700 hover:underline"
                                    >
                                        General settings →
                                    </Link>
                                </li>
                            )}
                            {canViewUsers && (
                                <li>
                                    <Link
                                        href="/admin/users"
                                        className="font-medium text-sky-700 hover:underline"
                                    >
                                        Users →
                                    </Link>
                                </li>
                            )}
                            <li>
                                <a
                                    href="/api/v1/health"
                                    className="font-medium text-sky-700 hover:underline"
                                >
                                    API health endpoint →
                                </a>
                            </li>
                        </ul>
                    </Panel>
                </div>
            </div>
        </AdminLayout>
    );
}
