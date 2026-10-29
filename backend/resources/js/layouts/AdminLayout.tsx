import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

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
    flash: {
        status: string | null;
        error: string | null;
    };
};

type NavItem = {
    href: string;
    label: string;
    icon: string;
    permission?: string;
};

const navGroups: Array<{ heading: string; items: NavItem[] }> = [
    {
        heading: 'Overview',
        items: [
            {
                href: '/admin',
                label: 'Dashboard',
                icon: 'M3 12l9-9 9 9M4 10v10h5v-6h6v6h5V10',
            },
        ],
    },
    {
        heading: 'Administration',
        items: [
            {
                href: '/admin/settings/general',
                label: 'General settings',
                icon: 'M12 8v4l3 2M12 2a10 10 0 100 20 10 10 0 000-20z',
                permission: 'settings.view',
            },
            {
                href: '/admin/users',
                label: 'Users',
                icon: 'M16 11a4 4 0 10-8 0 4 4 0 008 0z M3 21v-1a7 7 0 0114 0v1',
                permission: 'users.view',
            },
        ],
    },
];

const pageTitles: Array<{ match: RegExp; title: string }> = [
    { match: /^\/admin\/?$/, title: 'Dashboard' },
    { match: /^\/admin\/settings\/general$/, title: 'General settings' },
    { match: /^\/admin\/users$/, title: 'Users' },
    { match: /^\/admin\/profile$/, title: 'Your profile' },
];

const roleLabels: Record<string, string> = {
    super_admin: 'Super administrator',
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
};

function pageTitle(pathname: string): string {
    return pageTitles.find((row) => row.match.test(pathname))?.title ?? 'Administration';
}

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function NavIcon({ path, active }: { path: string; active: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className={`h-[18px] w-[18px] flex-none ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`}
            aria-hidden="true"
        >
            <path d={path} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedProps>();
    const { appName, auth, flash } = page.props;
    const user = auth.user;
    const pathname = page.url.split(/[?#]/)[0];
    const [navOpen, setNavOpen] = useState(false);

    useEffect(() => {
        setNavOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!navOpen || window.matchMedia('(min-width: 1024px)').matches) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [navOpen]);

    useEffect(() => {
        if (!navOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setNavOpen(false);
                document.getElementById('admin-nav-trigger')?.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [navOpen]);

    const allowedGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => !item.permission || user?.permissions.includes(item.permission)
            ),
        }))
        .filter((group) => group.items.length > 0);

    const userInitials = user ? initials(user.name) : 'AD';

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClick = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                menuTriggerRef.current?.focus();
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [menuOpen]);

    return (
        <div className="admin-root min-h-screen bg-slate-50 font-sans text-slate-800">
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
            >
                Skip to content
            </a>

            <div
                className={`fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${navOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={() => setNavOpen(false)}
                aria-hidden="true"
            />

            <aside
                aria-label="Admin navigation"
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-900/40 bg-[#0f2231] text-slate-100 shadow-xl transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 lg:shadow-none ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 px-5 py-4">
                    <Link href="/admin" className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-[#d9232a] text-sm font-bold text-white shadow-sm">
                            MR
                        </span>
                        <span className="min-w-0 leading-tight">
                            <span className="block truncate text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                {appName}
                            </span>
                            <span className="block text-sm font-semibold">Admin CMS</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setNavOpen(false)}
                        className="rounded-md p-2 text-slate-300 hover:bg-slate-700/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:hidden"
                        aria-label="Close navigation"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <nav id="admin-sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sections">
                    {allowedGroups.map((group) => (
                        <div key={group.heading} className="mb-5">
                            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/80">
                                {group.heading}
                            </p>
                            <ul className="space-y-0.5">
                                {group.items.map((item) => {
                                    const active =
                                        item.href === '/admin'
                                            ? pathname === '/admin' || pathname === '/admin/'
                                            : pathname.startsWith(item.href);

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setNavOpen(false)}
                                                aria-current={active ? 'page' : undefined}
                                                className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                                                    active
                                                        ? 'bg-[#d9232a] text-white shadow-sm'
                                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r-full bg-white transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                                <NavIcon path={item.icon} active={active} />
                                                <span className="truncate">{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                    <p className="px-3 text-xs leading-5 text-slate-500">
                        Content and growth modules will be migrated in later sprints.
                    </p>
                </nav>

                <div className="border-t border-slate-700/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                            {userInitials}
                        </span>
                        <span className="min-w-0 flex-1 text-xs leading-tight">
                            <span className="block truncate font-semibold text-slate-100">
                                {user?.name ?? 'Admin user'}
                            </span>
                            <span className="block truncate text-slate-400">
                                {user ? roleLabels[user.role] ?? user.role : 'Signed in'}
                            </span>
                        </span>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                    <div className="mx-auto flex h-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
                        <button
                            id="admin-nav-trigger"
                            type="button"
                            onClick={() => setNavOpen(true)}
                            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:hidden"
                            aria-label="Open navigation"
                            aria-expanded={navOpen}
                            aria-controls="admin-sidebar-nav"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                            </svg>
                        </button>

                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900 lg:text-base">
                            {pageTitle(pathname)}
                        </p>

                        <div className="relative" ref={menuRef}>
                            <button
                                ref={menuTriggerRef}
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                aria-controls="admin-profile-menu"
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2231] text-xs font-semibold text-white"
                                >
                                    {userInitials}
                                </span>
                                <span className="hidden text-xs leading-tight sm:block">
                                    <span className="block max-w-[10rem] truncate font-semibold text-slate-800">
                                        {user?.name ?? 'Admin user'}
                                    </span>
                                    <span className="block max-w-[10rem] truncate text-slate-500">
                                        {user ? roleLabels[user.role] ?? user.role : 'Signed in'}
                                    </span>
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    className="h-4 w-4 text-slate-500"
                                    aria-hidden="true"
                                >
                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div
                                    id="admin-profile-menu"
                                    role="menu"
                                    aria-label="Account menu"
                                    className="absolute right-0 top-[calc(100%+8px)] z-30 w-60 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
                                >
                                    <div className="rounded-md px-3 py-2">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user?.name ?? 'Admin user'}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {user?.email ?? ''}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            {user ? roleLabels[user.role] ?? user.role : ''}
                                        </p>
                                    </div>
                                    <div className="my-1 border-t border-slate-100" />
                                    <Link
                                        href="/admin/profile"
                                        role="menuitem"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4 text-slate-500"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M16 11a4 4 0 10-8 0 4 4 0 008 0z M4 20v-1a7 7 0 0116 0v1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Your profile
                                    </Link>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.post('/admin/logout');
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4 text-slate-500"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M15 12H4 M8 8l-4 4 4 4 M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main
                    id="admin-main"
                    tabIndex={-1}
                    className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8"
                >
                    {flash.status && (
                        <div
                            role="status"
                            className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                        >
                            {flash.status}
                        </div>
                    )}
                    {flash.error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                        >
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
