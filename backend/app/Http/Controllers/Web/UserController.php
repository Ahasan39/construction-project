<?php

namespace App\Http\Controllers\Web;

use App\Enums\Permission;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Services\UserManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserManagementService $users) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $query = User::query()->withCount('tokens');

        if ($request->filled('role')) {
            $query->where('role', $request->string('role')->toString());
        }

        if ($request->filled('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(function ($builder) use ($search): void {
                $builder->where('name', 'like', $search)
                    ->orWhere('email', 'like', $search);
            });
        }

        $paginator = $query->orderBy('name')->paginate(20)->withQueryString();

        $users = $paginator->through(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role->value,
            'role_label' => $user->role->label(),
            'is_active' => (bool) $user->is_active,
            'tokens_count' => $user->tokens_count,
            'last_login_at' => $user->last_login_at?->toIso8601String(),
            'created_at' => $user->created_at?->toIso8601String(),
        ]);

        $roles = array_map(static fn (UserRole $role): array => [
            'value' => $role->value,
            'label' => $role->label(),
        ], UserRole::cases());

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $request->string('search')->toString(),
                'role' => $request->string('role')->toString(),
                'active' => $request->has('active') ? $request->string('active')->toString() : '',
            ],
            'roles' => $roles,
            'can' => [
                'create' => $request->user()?->can('create', User::class) ?? false,
                'manage' => $request->user()?->hasPermission(Permission::UsersManage) ?? false,
            ],
            'currentUserId' => $request->user()?->id,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $this->users->create($request->user(), $request->validated());

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User created successfully.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $this->users->update($request->user(), $user, $request->validated());

        return redirect()
            ->route('admin.users.index')
            ->with('status', 'User updated successfully.');
    }
}

