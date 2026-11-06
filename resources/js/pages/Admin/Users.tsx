import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    AdminButton,
    FormField,
    PageHeader,
    SectionCard,
    SelectInput,
    TextInput,
} from '../../components/AdminUI';
import { AdminLayout } from '../../layouts/AdminLayout';

export type UserItem = {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
    is_active: boolean;
    tokens_count: number;
    last_login_at: string | null;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedUsers = {
    data: UserItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLink[];
};

export type RoleOption = {
    value: string;
    label: string;
};

export type UsersProps = {
    users: PaginatedUsers;
    filters: {
        search: string;
        role: string;
        active: string;
    };
    roles: RoleOption[];
    can: {
        create: boolean;
        manage: boolean;
    };
    currentUserId?: number;
};

const roleBadgeClasses: Record<string, string> = {
    super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-blue-50 text-blue-700 border-blue-200',
    editor: 'bg-amber-50 text-amber-700 border-amber-200',
    viewer: 'bg-slate-50 text-slate-700 border-slate-200',
};

function formatDate(iso: string | null): string {
    if (!iso) return 'Never';
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Users({ users, filters, roles, can, currentUserId }: UsersProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [roleFilter, setRoleFilter] = useState(filters?.role ?? '');
    const [activeFilter, setActiveFilter] = useState(filters?.active ?? '');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        role: 'editor',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    function applyFilters(newSearch: string, newRole: string, newActive: string) {
        router.get(
            '/admin/users',
            {
                search: newSearch || undefined,
                role: newRole || undefined,
                active: newActive !== '' ? newActive : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function handleSearchSubmit(e: FormEvent) {
        e.preventDefault();
        applyFilters(search, roleFilter, activeFilter);
    }

    function handleResetFilters() {
        setSearch('');
        setRoleFilter('');
        setActiveFilter('');
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    }

    function openCreate() {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    }

    function closeCreate() {
        setIsCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    }

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                closeCreate();
            },
        });
    }

    function openEdit(user: UserItem) {
        setEditingUser(user);
        editForm.clearErrors();
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
            is_active: user.is_active,
        });
    }

    function closeEdit() {
        setEditingUser(null);
        editForm.reset();
        editForm.clearErrors();
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();
        if (!editingUser) return;

        const payload: Record<string, unknown> = {
            name: editForm.data.name,
            email: editForm.data.email,
        };

        // Only include role / is_active if not self-editing
        if (editingUser.id !== currentUserId) {
            payload.role = editForm.data.role;
            payload.is_active = editForm.data.is_active;
        }

        if (editForm.data.password) {
            payload.password = editForm.data.password;
            payload.password_confirmation = editForm.data.password_confirmation;
        }

        editForm.patch(`/admin/users/${editingUser.id}`, {
            onSuccess: () => {
                closeEdit();
            },
        });
    }

    function toggleActiveStatus(user: UserItem) {
        if (user.id === currentUserId) return;
        router.patch(
            `/admin/users/${user.id}`,
            {
                is_active: !user.is_active,
            },
            {
                preserveScroll: true,
            }
        );
    }

    const hasActiveFilters = Boolean(search || roleFilter || activeFilter !== '');

    return (
        <AdminLayout>
            <Head title="Admin users">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageHeader
                title="Admin users"
                description="Manage administrator accounts, assign roles, toggle access, and review activity."
                actions={
                    can?.create ? (
                        <AdminButton variant="primary" onClick={openCreate}>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create user
                        </AdminButton>
                    ) : null
                }
            />

            {/* Filter controls */}
            <SectionCard title="Filter users" description="Search by name or email, or narrow down by role and status." className="mb-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label htmlFor="user-search" className="block text-xs font-medium text-slate-700 mb-1">
                            Search keywords
                        </label>
                        <TextInput
                            id="user-search"
                            type="search"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <label htmlFor="role-filter" className="block text-xs font-medium text-slate-700 mb-1">
                            Role
                        </label>
                        <SelectInput
                            id="role-filter"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                applyFilters(search, e.target.value, activeFilter);
                            }}
                        >
                            <option value="">All roles</option>
                            {(roles ?? []).map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </SelectInput>
                    </div>

                    <div className="w-full sm:w-40">
                        <label htmlFor="status-filter" className="block text-xs font-medium text-slate-700 mb-1">
                            Status
                        </label>
                        <SelectInput
                            id="status-filter"
                            value={activeFilter}
                            onChange={(e) => {
                                setActiveFilter(e.target.value);
                                applyFilters(search, roleFilter, e.target.value);
                            }}
                        >
                            <option value="">All statuses</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </SelectInput>
                    </div>

                    <div className="flex items-center gap-2">
                        <AdminButton variant="secondary" type="submit">
                            Search
                        </AdminButton>
                        {hasActiveFilters && (
                            <AdminButton variant="ghost" type="button" onClick={handleResetFilters}>
                                Reset
                            </AdminButton>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* User table */}
            <SectionCard title={`Users (${users?.total ?? 0})`} description="List of all staff and administrative accounts.">
                <div className="overflow-x-auto -mx-5 -my-5 sm:mx-0 sm:my-0">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50/75 text-left text-xs font-semibold text-slate-600">
                                <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
                                    User
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Role
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Tokens
                                </th>
                                <th scope="col" className="px-3 py-3.5">
                                    Last login
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-sm">
                            {(users?.data ?? []).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500">
                                        No users found matching your search criteria.
                                    </td>
                                </tr>
                            ) : (
                                (users?.data ?? []).map((user) => {
                                    const isSelf = user.id === currentUserId;
                                    const roleClass = roleBadgeClasses[user.role] ?? 'bg-slate-50 text-slate-700 border-slate-200';

                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#0f2231] text-xs font-semibold text-white">
                                                        {user.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900 flex items-center gap-1.5">
                                                            {user.name}
                                                            {isSelf && (
                                                                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleClass}`}
                                                >
                                                    {user.role_label}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-300">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600">
                                                {user.tokens_count} active
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">
                                                {formatDate(user.last_login_at)}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right text-xs">
                                                {can?.manage ? (
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEdit(user)}
                                                            className="font-medium text-sky-700 hover:text-sky-900 hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        {!isSelf && (
                                                            <>
                                                                <span className="text-slate-300">|</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleActiveStatus(user)}
                                                                    className={`font-medium hover:underline ${
                                                                        user.is_active
                                                                            ? 'text-amber-700 hover:text-amber-900'
                                                                            : 'text-emerald-700 hover:text-emerald-900'
                                                                    }`}
                                                                >
                                                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">Read only</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination links */}
                {(users?.links ?? []).length > 3 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-xs text-slate-500">
                            Showing page {users.current_page} of {users.last_page} ({users.total} total users)
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {users.links.map((link, idx) => {
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

            {/* Create User Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-semibold text-slate-900">Create new user</h2>
                            <button
                                type="button"
                                onClick={closeCreate}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitCreate} className="space-y-4">
                            <FormField label="Full name" required error={createForm.errors.name}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Jane Doe"
                                    />
                                )}
                            </FormField>

                            <FormField label="Email address" required error={createForm.errors.email}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="jane.doe@example.com"
                                    />
                                )}
                            </FormField>

                            <FormField label="Role" required error={createForm.errors.role}>
                                {(fieldProps) => (
                                    <SelectInput
                                        {...fieldProps}
                                        value={createForm.data.role}
                                        onChange={(e) => createForm.setData('role', e.target.value)}
                                    >
                                        {(roles ?? []).map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </SelectInput>
                                )}
                            </FormField>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField label="Password" required error={createForm.errors.password}>
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            type="password"
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    label="Confirm password"
                                    required
                                    error={createForm.errors.password_confirmation}
                                >
                                    {(fieldProps) => (
                                        <TextInput
                                            {...fieldProps}
                                            type="password"
                                            value={createForm.data.password_confirmation}
                                            onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                                        />
                                    )}
                                </FormField>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="create-active"
                                    type="checkbox"
                                    checked={createForm.data.is_active}
                                    onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#d9232a] focus:ring-[#d9232a]"
                                />
                                <label htmlFor="create-active" className="text-sm font-medium text-slate-700">
                                    Account is active and permitted to log in
                                </label>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <AdminButton variant="outline" type="button" onClick={closeCreate}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={createForm.processing}>
                                    {createForm.processing ? 'Creating…' : 'Create user'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Edit user</h2>
                                <p className="text-xs text-slate-500">{editingUser.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {editingUser.id === currentUserId && (
                            <div className="mb-4 rounded-md bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                                <strong>Self-protection active:</strong> You cannot change your own role or deactivate your account.
                            </div>
                        )}

                        <form onSubmit={submitEdit} className="space-y-4">
                            <FormField label="Full name" required error={editForm.errors.name}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                )}
                            </FormField>

                            <FormField label="Email address" required error={editForm.errors.email}>
                                {(fieldProps) => (
                                    <TextInput
                                        {...fieldProps}
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                )}
                            </FormField>

                            {editingUser.id !== currentUserId && (
                                <>
                                    <FormField label="Role" required error={editForm.errors.role}>
                                        {(fieldProps) => (
                                            <SelectInput
                                                {...fieldProps}
                                                value={editForm.data.role}
                                                onChange={(e) => editForm.setData('role', e.target.value)}
                                            >
                                                {(roles ?? []).map((r) => (
                                                    <option key={r.value} value={r.value}>
                                                        {r.label}
                                                    </option>
                                                ))}
                                            </SelectInput>
                                        )}
                                    </FormField>

                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            id="edit-active"
                                            type="checkbox"
                                            checked={editForm.data.is_active}
                                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-[#d9232a] focus:ring-[#d9232a]"
                                        />
                                        <label htmlFor="edit-active" className="text-sm font-medium text-slate-700">
                                            Account is active and permitted to log in
                                        </label>
                                    </div>
                                </>
                            )}

                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                    Change password (optional)
                                </p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField label="New password" error={editForm.errors.password}>
                                        {(fieldProps) => (
                                            <TextInput
                                                {...fieldProps}
                                                type="password"
                                                placeholder="Leave blank to keep"
                                                value={editForm.data.password}
                                                onChange={(e) => editForm.setData('password', e.target.value)}
                                            />
                                        )}
                                    </FormField>

                                    <FormField
                                        label="Confirm new password"
                                        error={editForm.errors.password_confirmation}
                                    >
                                        {(fieldProps) => (
                                            <TextInput
                                                {...fieldProps}
                                                type="password"
                                                value={editForm.data.password_confirmation}
                                                onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                            />
                                        )}
                                    </FormField>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <AdminButton variant="outline" type="button" onClick={closeEdit}>
                                    Cancel
                                </AdminButton>
                                <AdminButton variant="primary" type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Saving…' : 'Save changes'}
                                </AdminButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
