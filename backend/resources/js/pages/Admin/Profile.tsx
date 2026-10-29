import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { PageHeader } from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

type ProfileProps = {
    profile: {
        name: string;
        email: string;
        role: string;
        role_label: string;
        is_active: boolean;
        last_login_at: string | null;
        created_at: string | null;
    };
};

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
}

function PasswordInput({
    id,
    label,
    value,
    autoComplete,
    error,
    required = true,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    autoComplete: string;
    error?: string;
    required?: boolean;
    onChange: (next: string) => void;
}) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-slate-800">
                {label}
            </label>
            <div className="relative mt-1.5">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    required={required}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-invalid={error ? true : undefined}
                    className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    aria-pressed={show}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                    {show ? (
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
            {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}

export default function Profile() {
    const { profile } = usePage<ProfileProps>().props;

    const nameForm = useForm({ name: profile.name });
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitName = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        nameForm.patch('/admin/profile', { preserveScroll: true });
    };

    const submitPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        passwordForm.put('/admin/profile/password', {
            preserveScroll: true,
            onSuccess: () =>
                passwordForm.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Your profile">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Your profile"
                description="Update your name and change your password. Role and account status are managed by an administrator."
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                    <header className="border-b border-slate-100 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">Profile details</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Only your display name can be edited here.
                        </p>
                    </header>

                    <form className="space-y-5 p-5" onSubmit={submitName} noValidate>
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="text-sm font-medium text-slate-800"
                            >
                                Full name
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                autoComplete="name"
                                required
                                minLength={2}
                                maxLength={120}
                                value={nameForm.data.name}
                                onChange={(e) => nameForm.setData('name', e.target.value)}
                                aria-invalid={nameForm.errors.name ? true : undefined}
                                className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                            {nameForm.errors.name && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {nameForm.errors.name}
                                </p>
                            )}
                        </div>

                        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Email
                                </dt>
                                <dd className="mt-0.5 break-all text-sm text-slate-700">
                                    {profile.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Role
                                </dt>
                                <dd className="mt-0.5 text-sm text-slate-700">
                                    {profile.role_label}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Account status
                                </dt>
                                <dd className="mt-0.5 text-sm">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                            profile.is_active
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-amber-50 text-amber-700'
                                        }`}
                                    >
                                        {profile.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Last sign-in
                                </dt>
                                <dd className="mt-0.5 text-sm text-slate-700">
                                    {formatDate(profile.last_login_at)}
                                </dd>
                            </div>
                        </dl>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <button
                                type="submit"
                                disabled={nameForm.processing}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-[#d9232a] px-4 text-sm font-semibold text-white transition hover:bg-[#b81b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {nameForm.processing ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-1">
                    <header className="border-b border-slate-100 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">Change password</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Minimum 12 characters with mixed case and a number.
                        </p>
                    </header>

                    <form className="space-y-4 p-5" onSubmit={submitPassword} noValidate>
                        <PasswordInput
                            id="current-password"
                            label="Current password"
                            autoComplete="current-password"
                            value={passwordForm.data.current_password}
                            onChange={(v) => passwordForm.setData('current_password', v)}
                            error={passwordForm.errors.current_password}
                        />
                        <PasswordInput
                            id="new-password"
                            label="New password"
                            autoComplete="new-password"
                            value={passwordForm.data.password}
                            onChange={(v) => passwordForm.setData('password', v)}
                            error={passwordForm.errors.password}
                        />
                        <PasswordInput
                            id="new-password-confirmation"
                            label="Confirm new password"
                            autoComplete="new-password"
                            value={passwordForm.data.password_confirmation}
                            onChange={(v) =>
                                passwordForm.setData('password_confirmation', v)
                            }
                        />

                        <div className="flex items-center justify-end border-t border-slate-100 pt-4">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {passwordForm.processing ? 'Updating…' : 'Update password'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
}
