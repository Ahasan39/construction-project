import { Head, usePage } from '@inertiajs/react';

type SharedProps = {
    appName: string;
    auth: {
        user: {
            name: string;
            role: string;
        } | null;
    };
};

type InertiaCheckProps = {
    message: string;
    checkedAt: string;
};

export default function InertiaCheck({ message, checkedAt }: InertiaCheckProps) {
    const { appName, auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Inertia Check">
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
                <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
                        Foundation check
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{appName}</h1>
                    <p className="mt-4 text-base leading-7 text-slate-600">{message}</p>
                    <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Rendered at
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-slate-900">{checkedAt}</dd>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Session user
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-slate-900">
                                {auth.user?.name ?? 'Guest'}
                            </dd>
                        </div>
                    </dl>
                    <p className="mt-8 text-xs text-slate-500">
                        Internal verification page. Not linked from public navigation or sitemap.
                    </p>
                </section>
            </main>
        </>
    );
}
