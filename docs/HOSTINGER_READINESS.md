# Hostinger shared-hosting readiness

This document lists what must be confirmed or configured before deploying the
Laravel application to Hostinger shared hosting. It does **not** claim that a
deployment has been performed.

## Confirm with Hostinger first

Do not assume any of the following. Verify them in hPanel, SSH, or with
Hostinger support:

- The plan supports the required PHP version and extensions.
- SSH access is available.
- Composer is available on the server, or `vendor/` can be uploaded from a
  matching local build.
- Node.js is available, or assets can be built locally/CI and uploaded.
- The domain or subdomain document root can be changed.
- Cron jobs are available.
- Long-running queue workers are supported.
- The MySQL version, connection limits, and backup policy.
- Outbound SMTP is allowed and the required mail credentials are available.

If SSH, Composer, Node.js, or queue workers are unavailable, use the
build-locally and upload workflow described below.

## Recommended layout

- Point the domain or subdomain document root at `backend/public`.
- Keep `backend/` application files outside the public document root.
- Never expose `.env`, `vendor/`, `storage/`, logs, source maps, or the
  repository root through the web server.
- If the document root cannot be changed, use a subdomain that allows it or ask
  Hostinger support for the correct layout. Do not place the Laravel app root
  inside `public_html`.

## PHP and extensions

Set the production PHP version in hPanel to PHP 8.2 or newer. Confirm these
extensions are enabled:

- `gd`
- `fileinfo`
- `mbstring`
- `openssl`
- `pdo_mysql`
- `tokenizer`
- `xml`
- `ctype`
- `curl`
- `dom`
- `json`

Run `php -m` over SSH if available, or check the hPanel PHP configuration.
Composer platform requirements should be checked with
`composer check-platform-reqs` on the target PHP version.

## MySQL

1. Create a dedicated database and least-privilege user in hPanel.
2. Use `utf8mb4` and a matching collation.
3. Store credentials only in the server environment or `.env`.
4. Take a backup before every migration.
5. Run `php artisan migrate --force` during a maintenance window.
6. Never run `migrate:fresh`, `db:wipe`, or destructive seed commands in
   production. The application already prohibits destructive database commands
   when `APP_ENV=production`.

## Required production environment

At minimum, verify these values:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_KEY=<generated key>
APP_URL=https://your-production-domain.example

DB_CONNECTION=mysql
DB_HOST=<host>
DB_PORT=3306
DB_DATABASE=<database>
DB_USERNAME=<user>
DB_PASSWORD=<password>

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=database

FRONTEND_URLS=https://your-public-site.example
FRONTEND_RESET_URL=https://your-public-site.example/reset-password
SANCTUM_TOKEN_EXPIRATION=720

MAIL_MAILER=<real mailer>
MAIL_HOST=<host>
MAIL_PORT=<port>
MAIL_USERNAME=<user>
MAIL_PASSWORD=<password>
MAIL_FROM_ADDRESS=<verified sender>
```

Set `SESSION_SECURE_COOKIE=true` only when HTTPS is working. Keep
`APP_DEBUG=false`; debug pages can expose secrets.

## Files, permissions, and assets

- Make `storage/` and `bootstrap/cache/` writable by the PHP user.
- Run `php artisan storage:link` once if media URLs need the public disk.
- Set restrictive permissions on `.env` (for example `600` where supported).
- Build the Inertia assets locally or in CI with:

```bash
cd backend
npm ci
npm run build
```

- Upload `backend/public/build` with the deployment. Node.js is not required on
  the server if the assets are built elsewhere.
- Do not upload `node_modules`, source maps, test files, or local caches.
- The root public React site remains a separate GitHub Pages build. Do not
  replace its workflow or upload `dist/` into the Laravel public root.

## Caching and deployment commands

After the environment and uploaded files are correct:

```bash
php artisan config:cache
php artisan view:cache
```

Do **not** run `php artisan route:cache` or `php artisan optimize` while the
application still has closure-based routes. Laravel cannot serialize those
routes, so route caching will fail. Convert the remaining closures to controller
actions before enabling route caching.

Clear and rebuild after any environment change:

```bash
php artisan config:clear
php artisan view:clear
php artisan config:cache
php artisan view:cache
```

If SSH is unavailable, confirm with Hostinger which of these commands can be run
through hPanel or support. Do not claim optimization succeeded without running
it.

## Scheduler, queues, and mail

- Password reset delivery currently uses Laravel's synchronous notification
  path. A queue worker is not required unless notifications are changed to
  implement `ShouldQueue`.
- If queue jobs are added, confirm that Hostinger supports a persistent worker.
  Shared hosting may require an alternative queue strategy.
- If scheduled tasks are added, configure cron to run
  `php artisan schedule:run` every minute.
- Verify production mail delivery before enabling any web password-recovery
  screen. The web admin currently tells users to contact a super administrator.

## Security checks

- Serve the site over HTTPS and force HTTPS at the host or proxy.
- Confirm session cookies are `Secure`, `HttpOnly`, and `SameSite=Lax`.
- Confirm `/admin` and `/admin/login` return `noindex, nofollow`.
- Confirm `robots.txt` disallows the admin surface.
- Confirm the Laravel security headers are present on web and API responses.
- Confirm Sanctum bearer-token API endpoints still work unchanged.
- Confirm CORS allows only the exact public frontend origin(s), never `*`.
- Keep `.env`, logs, and database backups outside the public web root.
- Rotate `APP_KEY` only with a planned migration of encrypted data.

## Post-deployment verification

1. `GET /up` returns healthy.
2. `GET /api/v1/health` reports the database connection.
3. `GET /admin/login` renders the Inertia login page with a CSRF cookie.
4. A valid active account can sign in and reaches `/admin`.
5. An invalid or inactive account gets a generic error.
6. Logout invalidates the session and returns to `/admin/login`.
7. A viewer receives `403` on `/admin/users`.
8. The public GitHub Pages site is unchanged.
9. A Sanctum API login and authenticated `/api/v1/auth/me` still work.
10. No secrets, tokens, or password hashes appear in Inertia props or logs.

## Rollback

- Keep the previous release directory and database backup.
- Restore the previous release and database backup if migrations fail.
- Rebuild caches after rollback.
- Do not force-push or rewrite published Git history.
