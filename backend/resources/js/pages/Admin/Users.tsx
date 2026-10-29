import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader, SectionCard } from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

type SharedProps = {
    auth: {
        user: {
            permissions: string[];
        } | null;
    };
};

export default function Users() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <AdminLayout>
            <Head title="Admin users">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Admin users"
                description="Server-side permission enforcement is active for this placeholder. User management moves here in a later sprint."
            />

            <SectionCard title="Protected module" description="Only roles with users.view can open this page.">
                <p className="text-sm leading-6 text-slate-600">
                    The API already supports user listing, role assignment, activation, and audit logging.
                    This page will become the user-management interface in a later migration sprint.
                </p>
                <p className="mt-4 text-xs text-slate-500">
                    Current permissions: {auth.user?.permissions.join(', ') ?? 'none'}
                </p>
                <Link
                    href="/admin"
                    className="mt-5 inline-flex text-sm font-medium text-sky-700 hover:underline"
                >
                    Back to dashboard
                </Link>
            </SectionCard>
        </AdminLayout>
    );
}
