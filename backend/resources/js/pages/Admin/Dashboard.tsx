import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader, SectionCard } from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

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

export default function Dashboard() {
    const { appName, auth } = usePage<SharedProps>().props;
    const user = auth.user;
    const permissions = user?.permissions ?? [];

    return (
        <AdminLayout>
            <Head title="Admin dashboard">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Admin dashboard"
                description={`Signed in to ${appName}. This shell is connected to Laravel, MySQL, and the web session guard.`}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <SectionCard title="Current session" description="Authenticated web session details.">
                    <dl className="space-y-3 text-sm">
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">User</dt>
                            <dd className="mt-0.5 font-medium text-slate-900">{user?.name ?? 'Unknown'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                            <dd className="mt-0.5 break-all text-slate-700">{user?.email ?? 'Unknown'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                            <dd className="mt-0.5 text-slate-700">
                                {user ? roleLabels[user.role] ?? user.role : 'Unknown'}
                            </dd>
                        </div>
                    </dl>
                </SectionCard>

                <SectionCard title="General settings" description="Company identity, contact details, hours, and brand assets.">
                    <p className="text-sm leading-6 text-slate-600">
                        These values are stored in MySQL and validated on the server. Viewers and editors can
                        inspect them; only settings managers can save changes.
                    </p>
                    <Link
                        href="/admin/settings/general"
                        className="mt-4 inline-flex h-9 items-center rounded-md bg-[#d9232a] px-4 text-sm font-medium text-white transition hover:bg-[#b81b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                    >
                        Open settings
                    </Link>
                </SectionCard>

                <SectionCard title="Available modules" description="The admin is being migrated incrementally from the static demo.">
                    <ul className="space-y-3 text-sm">
                        {permissions.includes('settings.view') && (
                            <li>
                                <Link href="/admin/settings/general" className="font-medium text-sky-700 hover:underline">
                                    General settings
                                </Link>
                                <p className="text-xs text-slate-500">Database-backed site configuration.</p>
                            </li>
                        )}
                        {permissions.includes('users.view') && (
                            <li>
                                <Link href="/admin/users" className="font-medium text-sky-700 hover:underline">
                                    Users
                                </Link>
                                <p className="text-xs text-slate-500">Protected user-management placeholder.</p>
                            </li>
                        )}
                        <li>
                            <a href="/api/v1/health" className="font-medium text-sky-700 hover:underline">
                                API health
                            </a>
                            <p className="text-xs text-slate-500">JSON health endpoint.</p>
                        </li>
                    </ul>
                </SectionCard>
            </div>

            <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                Content, media, leads, SEO, and marketing modules remain in the GitHub Pages demo until their
                backend modules are migrated.
            </div>
        </AdminLayout>
    );
}
