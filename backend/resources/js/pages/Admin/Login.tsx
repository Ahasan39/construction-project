import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

type LoginProps = {
    status?: string | null;
};

export default function Login({ status }: LoginProps) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/admin/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin sign in">
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
                        Administration
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Use your CMS account to continue.
                    </p>

                    {status && (
                        <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {status}
                        </p>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={submit}>
                        <div>
                            <label
                                className="text-sm font-medium text-slate-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                autoComplete="username"
                                autoFocus
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                id="email"
                                onChange={(event) => form.setData('email', event.target.value)}
                                required
                                type="email"
                                value={form.data.email}
                            />
                            {form.errors.email && (
                                <p className="mt-2 text-sm text-red-700">{form.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="text-sm font-medium text-slate-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                autoComplete="current-password"
                                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                                id="password"
                                onChange={(event) => form.setData('password', event.target.value)}
                                required
                                type="password"
                                value={form.data.password}
                            />
                            {form.errors.password && (
                                <p className="mt-2 text-sm text-red-700">{form.errors.password}</p>
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                checked={form.data.remember}
                                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                onChange={(event) =>
                                    form.setData('remember', event.target.checked)
                                }
                                type="checkbox"
                            />
                            Remember me
                        </label>

                        <button
                            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={form.processing}
                            type="submit"
                        >
                            {form.processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="mt-6 text-xs leading-5 text-slate-500">
                        Password recovery is not enabled in the web admin yet. Ask a
                        super administrator to reset your account.
                    </p>
                </section>
            </main>
        </>
    );
}
