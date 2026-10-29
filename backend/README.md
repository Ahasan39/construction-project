# Construction Project CMS API

Laravel API and Inertia admin foundation for the construction project website.
The existing React frontend remains the public site and is deployed separately.

## Requirements

- PHP 8.2+ with `gd`, `fileinfo`, `pdo_mysql`, and `mbstring`
- Composer 2
- MySQL 8.0+ or MariaDB 10.4+
- A writable `storage/` directory
- Node.js 20.19+ for building the backend Inertia assets

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Create a MySQL database and set `DB_DATABASE`, `DB_USERNAME`, and
`DB_PASSWORD` in `.env`. Then run:

```bash
php artisan migrate
php artisan storage:link
php artisan admin:create
php artisan serve
```

`admin:create` prompts for a name, email, and password. There is deliberately
no seeded default account or default password. The password policy is at least
12 characters with mixed case, letters, and numbers.

The API is served from `http://localhost:8000/api/v1`.

## Inertia foundation

The Laravel application now has its own Inertia + React + TypeScript + Tailwind
frontend build. It is intentionally separate from the root Vite/GitHub Pages
build so the public site deployment keeps working unchanged.

```bash
cd backend
npm install
npm run build
php artisan serve
```

Visit `http://localhost:8000/admin/login` for the web-session admin sign-in,
`http://localhost:8000/admin` for the authenticated admin layout, and
`http://localhost:8000/inertia-check` for the internal verification page. They
are not linked from public navigation or the sitemap and are marked
`noindex, nofollow`.

For local development, run the Laravel server and the backend Vite dev server
in separate terminals:

```bash
cd backend
php artisan serve
```

```bash
cd backend
npm run dev
```

The backend Vite dev server uses port `5174` so it can run alongside the public
frontend dev server on `5173`.

`npm run build` writes the production manifest and assets to
`backend/public/build`, which Laravel's `@vite` directive reads. The root
`npm run build` remains the GitHub Pages build for the public React site.

## Admin layout and general settings

The authenticated admin uses a responsive Inertia layout with permission-aware
navigation, mobile drawer behavior, flash messages, and a CSRF-protected sign-out
control. The first migrated settings module is available at
`GET /admin/settings/general` and saves through `PUT /admin/settings/general`.

General settings are stored in the singleton `site_settings` row and cover
company identity, website/locale/timezone, default CTA and estimate destination,
contact details, address, business hours, social profiles, logo/favicon media,
and brand colors. Validation is server-side; only `settings.manage` can save,
while `settings.view` can read. Saves are audited as `settings.updated`.

Logo and favicon uploads use `POST /admin/media` with `media.upload`. Uploaded
images are re-encoded by the existing media service and referenced from settings
by media ID; SVG and ICO uploads remain rejected. The existing
`/api/v1/admin/settings` and `/api/v1/admin/media` endpoints remain available for
bearer-token API clients.

The existing Sanctum bearer-token API and all `/api/v1` endpoints remain
unchanged. The same-origin web admin uses Laravel's `web` guard, database
sessions, CSRF protection, and the existing active-user and permission checks.
See [`docs/WEB_SESSION_AUTH_PLAN.md`](../docs/WEB_SESSION_AUTH_PLAN.md) for the
implemented flow and [`docs/HOSTINGER_READINESS.md`](../docs/HOSTINGER_READINESS.md)
for production deployment requirements.

## Configuration

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Application/API origin, used for generated URLs and media |
| `FRONTEND_URLS` | Comma-separated exact browser origins allowed by CORS |
| `FRONTEND_RESET_URL` | Frontend page that accepts `token` and `email` reset parameters |
| `SANCTUM_TOKEN_EXPIRATION` | Bearer token lifetime in minutes (default 720) |
| `DB_*` | MySQL connection settings |
| `MAIL_*` | Password reset delivery; use a real mailer in production |

`FRONTEND_URLS` must not contain `*`. Include the exact GitHub Pages origin,
for example `https://ahasan39.github.io`, without a path. The frontend must
provide a password reset page at `FRONTEND_RESET_URL`; otherwise reset links
fall back to the first allowed origin plus `/reset-password`.

## Authentication and roles

The public API uses Sanctum personal access tokens sent as
`Authorization: Bearer <token>`. The Laravel-served admin uses the `web` guard
with database sessions and CSRF protection instead. Both paths share the same
active-user, role, permission, audit, and password-policy rules.

Web admin sign-in is available at `GET|POST /admin/login`. Sign-out is
`POST /admin/logout`; it invalidates the session and regenerates the CSRF token.
Guests are redirected to the login page, inactive sessions are terminated, and
permission failures return `403`. Bearer tokens are never stored in
`localStorage` by the Inertia admin.

Web password recovery is intentionally not exposed yet. The existing API reset
flow remains available, but production mail delivery must be verified before a
web reset screen is added.

| Role | Capabilities |
| --- | --- |
| `super_admin` | Everything, including managing other super administrators |
| `admin` | Content, media, leads, SEO, marketing, settings, users, audit |
| `editor` | Content, media upload, lead viewing, settings viewing |
| `viewer` | Content, lead, and settings viewing |

Safeguards include revoking tokens after role or password changes, blocking
self-demotion and self-deactivation, and requiring at least one active super
administrator.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| `GET` | `/admin/login` | Guest only |
| `POST` | `/admin/login` | Guest only, rate limited |
| `POST` | `/admin/logout` | Authenticated |
| `GET` | `/admin` | Authenticated, active user |
| `GET` | `/admin/users` | `users.view` |
| `GET` | `/admin/settings/general` | `settings.view` |
| `PUT` | `/admin/settings/general` | `settings.manage` |
| `POST` | `/admin/media` | `media.upload` |
| `GET` | `/api/v1/health` | Public |
| `GET` | `/api/v1/settings/public` | Public |
| `POST` | `/api/v1/auth/login` | Public, rate limited |
| `POST` | `/api/v1/auth/forgot-password` | Public, rate limited |
| `POST` | `/api/v1/auth/reset-password` | Public, rate limited |
| `GET` | `/api/v1/auth/me` | Authenticated |
| `POST` | `/api/v1/auth/logout` | Authenticated |
| `PUT` | `/api/v1/auth/password` | Authenticated |
| `GET/PUT` | `/api/v1/admin/settings` | `settings.view` / `settings.manage` |
| `POST` | `/api/v1/admin/media` | `media.upload` |
| `GET/POST` | `/api/v1/admin/users` | `users.view` / `users.manage` |
| `PATCH` | `/api/v1/admin/users/{user}` | `users.manage` |
| `GET` | `/api/v1/admin/audit-logs` | `audit.view` |

## Media handling

Uploads are limited to JPEG, PNG, and WebP files up to 5 MB. Every image is
decoded and re-encoded with GD, which strips EXIF metadata and embedded
payloads. SVG and ICO uploads are rejected. Files are stored on the `public`
disk under `uploads/{purpose}/`.

## Verification

```bash
php artisan test
vendor/bin/pint --test
npm run build
```

## Production notes

- Point the web server document root at `backend/public`, never at the project
  root.
- Set `APP_ENV=production`, `APP_DEBUG=false`, and a strong `APP_KEY`.
- Serve the API and admin over HTTPS and force HTTPS at the web server or proxy.
- Set `SESSION_SECURE_COOKIE=true` in production and keep
  `SESSION_HTTP_ONLY=true` with `SESSION_SAME_SITE=lax`.
- Set `FRONTEND_URLS` to the exact production origin(s).
- Run `php artisan migrate --force` during deployment, then
  `php artisan storage:link` if it is not already present.
- Keep `.env`, `vendor/`, and logs outside the web root.
- Configure a real mailer for password resets and a queue worker if queued
  notifications are enabled.
