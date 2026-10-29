# Web-session authentication

Sprint 7.4 adds a same-origin Laravel web-session login for the Inertia admin.
Sprint 7.5 builds on it with the responsive admin layout and the first
database-backed settings module. The Sanctum bearer-token API and the
independent GitHub Pages public site remain unchanged.

## Implemented flow

1. `GET /admin/login` renders the Inertia login page for guests.
2. `POST /admin/login` validates email/password, applies the existing
   `throttle:login` limiter, and calls `Auth::guard('web')->attempt()` with
   `is_active` included in the credentials.
3. On success it regenerates the session ID, records `last_login_at`, writes an
   `auth.login` audit entry, and redirects to the intended admin page.
4. Invalid credentials and inactive accounts receive the same generic
   validation error to avoid account enumeration.
5. `POST /admin/logout` requires an authenticated session, writes an
   `auth.logout` audit entry, logs out the web guard, invalidates the session,
   regenerates the CSRF token, and redirects to `/admin/login`.
6. Protected admin routes require `auth` and `active`. Permission-protected
   routes also use the existing `permission:<value>` middleware.
7. Guests are redirected to `/admin/login`. Inactive sessions are terminated and
   returned to login with an inactive-account error. Permission failures return
   `403`.
8. Inertia shared props expose only `id`, `name`, `email`, `role`, and permission
   values. Tokens, password hashes, session identifiers, and environment values
   are never shared.
9. All web routes use the `web` guard, session cookies, and CSRF protection.

## Current admin surface

- `GET /admin/login` - login page, guest only.
- `POST /admin/login` - login submission, guest only and rate limited.
- `POST /admin/logout` - session termination, authenticated.
- `GET /admin` - authenticated admin layout and dashboard.
- `GET /admin/users` - permission-protected placeholder for `users.view`.
- `GET /admin/settings/general` - database-backed settings, `settings.view`.
- `PUT /admin/settings/general` - settings update, `settings.manage`.
- `POST /admin/media` - logo/favicon upload, `media.upload`.

The Inertia layout is responsive and permission-aware, uses shared safe auth
props, displays flash messages, and signs out through the web route. General
settings are stored in MySQL, validated server-side, and audited. The existing
mock admin at `/admin` on the GitHub Pages site is unchanged. Full module
migration is a later sprint.

## Password recovery

The web admin does not expose password recovery yet. The existing API reset
flow remains available. Before adding a web reset screen, production mail
delivery and reset-link routing must be verified on Hostinger. No password reset
claim should be made until that is tested.

## Transition rules

- Keep all existing `/api/v1` endpoints and bearer-token authentication.
- Do not store bearer tokens in `localStorage` for the Inertia admin.
- Do not remove Sanctum or the public API until the admin UI is fully migrated.
- Keep the admin surface `noindex` and keep `/admin/` disallowed in
  `robots.txt`.
- Keep the root Vite/GitHub Pages build independent from `backend/`.

## Remaining decisions

- Final production domain/subpath and Hostinger plan capabilities.
- Whether the public React site moves into Laravel/Inertia or remains a separate
  deployment.
- Whether the admin will use client-side Inertia only or add SSR later.
- When to add web password recovery after mail delivery is verified.
