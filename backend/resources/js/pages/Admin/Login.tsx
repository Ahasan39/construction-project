import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type LoginProps = {
    status?: string | null;
};

type SharedProps = {
    appName: string;
};

export default function Login({ status }: LoginProps) {
    const { appName } = usePage<SharedProps>().props;

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.processing) return;
        form.post('/admin/login', {
            onFinish: () => form.reset('password'),
        });
    };

    const emailError = form.errors.email;
    const passwordError = form.errors.password;

    return (
        <>
            <Head title="Admin sign in">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <main className="relative flex min-h-screen flex-col bg-slate-100 lg:flex-row">
                <section
                    aria-hidden="true"
                    className="relative hidden overflow-hidden bg-[#0f2231] text-slate-100 lg:flex lg:w-5/12 lg:flex-col lg:justify-between lg:px-12 lg:py-14"
                >
                    <div
                        className="pointer-events-none absolute inset-0 opacity-80"
                        style={{
                            background:
                                'radial-gradient(circle at 20% 20%, rgba(217,35,42,0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(15,34,49,0.9), transparent 60%)',
                        }}
                    />
                    <div className="relative flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9232a] text-sm font-bold text-white shadow-md">
                            MR
                        </span>
                        <div className="leading-tight">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                                {appName}
                            </p>
                            <p className="text-sm font-semibold text-white">Admin CMS</p>
                        </div>
                    </div>

                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f28088]">
                            Construction Project CMS
                        </p>
                        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
                            Build better.
                            <br />
                            Manage smarter.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                            One secure workspace to manage your construction website, content,
                            media, and team.
                        </p>

                        <ul className="mt-8 space-y-4 text-sm text-slate-200">
                            <li className="flex gap-3">
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#d9232a]/15 text-[#f28088]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        className="h-3.5 w-3.5"
                                    >
                                        <path
                                            d="M12 3l8 4v5c0 4.5-3.3 8.5-8 9-4.7-.5-8-4.5-8-9V7l8-4z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-semibold text-white">
                                        Secure access
                                    </span>
                                    <span className="block text-slate-300">
                                        Protected sessions and role-based permissions.
                                    </span>
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#d9232a]/15 text-[#f28088]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.75"
                                        className="h-3.5 w-3.5"
                                    >
                                        <path
                                            d="M4 6h16v4H4z M4 14h16v4H4z"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-semibold text-white">
                                        One central workspace
                                    </span>
                                    <span className="block text-slate-300">
                                        Manage settings, media, users, and activity.
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative flex items-center gap-3 text-xs text-slate-400">
                        <span className="h-px flex-1 bg-slate-700/70" aria-hidden="true" />
                        <span>© {new Date().getFullYear()} {appName}</span>
                        <span className="h-px flex-1 bg-slate-700/70" aria-hidden="true" />
                    </div>
                </section>

                <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9232a] text-sm font-bold text-white shadow-sm">
                                MR
                            </span>
                            <div className="leading-tight">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                    {appName}
                                </p>
                                <p className="text-sm font-semibold text-slate-900">
                                    Admin CMS
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9232a]">
                                Administration
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                                Sign in to your account
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Use your CMS credentials. Access is logged and rate limited.
                            </p>

                            {status && (
                                <p
                                    role="status"
                                    className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                                >
                                    {status}
                                </p>
                            )}

                            <form className="mt-7 space-y-4" onSubmit={submit} noValidate>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-slate-800"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        autoFocus
                                        required
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        aria-invalid={emailError ? true : undefined}
                                        aria-describedby={emailError ? 'email-error' : undefined}
                                        className={`mt-1.5 block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                                            emailError
                                                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                                : 'border-slate-300 focus:border-slate-900 focus:ring-sky-100'
                                        }`}
                                    />
                                    {emailError && (
                                        <p
                                            id="email-error"
                                            className="mt-1.5 text-xs font-medium text-red-600"
                                        >
                                            {emailError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-slate-800"
                                    >
                                        Password
                                    </label>
                                    <div className="relative mt-1.5">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={form.data.password}
                                            onChange={(e) =>
                                                form.setData('password', e.target.value)
                                            }
                                            aria-invalid={passwordError ? true : undefined}
                                            aria-describedby={
                                                passwordError ? 'password-error' : undefined
                                            }
                                            className={`block w-full rounded-md border bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                                                passwordError
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-300 focus:border-slate-900 focus:ring-sky-100'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={
                                                showPassword ? 'Hide password' : 'Show password'
                                            }
                                            aria-pressed={showPassword}
                                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                                        >
                                            {showPassword ? (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.75"
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 3l18 18 M10.6 10.6a2 2 0 002.8 2.8 M9.9 5.1A10 10 0 0121 12a10 10 0 01-2.2 3.3 M6.2 6.2A10 10 0 003 12a10 10 0 0012.9 5.8"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.75"
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 100-6 3 3 0 000 6z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {passwordError && (
                                        <p
                                            id="password-error"
                                            className="mt-1.5 text-xs font-medium text-red-600"
                                        >
                                            {passwordError}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={form.data.remember}
                                            onChange={(e) =>
                                                form.setData('remember', e.target.checked)
                                            }
                                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        />
                                        Keep me signed in
                                    </label>
                                    <span
                                        className="text-xs text-slate-400"
                                        title="Password recovery will be enabled in a later sprint."
                                    >
                                        Forgot password? Contact an admin.
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#d9232a] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b81b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {form.processing && (
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="9"
                                                stroke="currentColor"
                                                strokeOpacity="0.3"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M21 12a9 9 0 00-9-9"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    )}
                                    {form.processing ? 'Signing in…' : 'Sign in'}
                                </button>
                            </form>

                            <p className="mt-6 text-xs leading-5 text-slate-500">
                                Password recovery is not available from this screen yet. If
                                you cannot sign in, ask a super administrator to reset your
                                account.
                            </p>
                        </div>

                        <p className="mt-6 text-center text-xs text-slate-400 lg:text-left">
                            © {new Date().getFullYear()} {appName}. For authorized personnel
                            only.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}
