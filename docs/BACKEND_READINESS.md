# Backend-readiness notes — Admin CMS (Sprint 6.3)

Sprint 6.3 completed the frontend-only admin panel audit. This document records the integration seams the Laravel + MySQL sprint will replace, so the backend swap is a single-direction change rather than a UI rewrite.

Nothing here is a backend plan or a prescription for the data model — it is the **current frontend contract**, written down.

## 1. Mock store seam

Single React context in [src/admin/store.tsx](../src/admin/store.tsx) holds every mutable admin collection:

| Collection | Type | Current source |
|---|---|---|
| `pages` (read-only) | `AdminPageRow[]` | `initialPages` seed |
| `homepage` | `HomepageContent` | `initialHomepage` |
| `services` | `AdminServiceRow[]` | derived from `@/data/services` |
| `locations` | `AdminLocationRow[]` | derived from `@/data/locations` |
| `projects` | `AdminProjectRow[]` | derived from `@/data/galleryProjects` |
| `blogPosts` | `AdminBlogRow[]` | hard-coded sample |
| `testimonials` | `AdminTestimonialRow[]` | hard-coded sample, visibly flagged |
| `navItems` | `NavItemRow[]` | hard-coded sample |
| `leads` | `AdminLead[]` | hard-coded sample |
| `seoPages`, `globalSeo` | `SeoPageEntry[]` + `GlobalSeo` | hard-coded sample |
| `general`, `branding`, `contact` | `GeneralSettings`, `BrandingSettings`, `ContactSettings` | derived from `@/data/brand` |
| `integrations` | `IntegrationState` | zero-value seed |

**Backend swap:** replace the `useState` initial values + setters inside `AdminStoreProvider` with API-backed hooks (`useQuery`/`useMutation` or similar). Component call sites use `useAdminStore()` and should not need to change.

## 2. Persistence gaps per module

| Admin route | Needs server-side | Notes |
|---|---|---|
| `/admin/pages/homepage` | yes | Published content delivered to public homepage. Must be versioned/draft-publish. |
| `/admin/services`, `/admin/locations` | yes | Public routes derived from these. Currently they come from typed data files; a CMS swap means moving the single source of truth. |
| `/admin/gallery` | yes | Also needs image upload pipeline (see §4). |
| `/admin/blog` | yes | Posts + schedule. |
| `/admin/testimonials` | yes | Must preserve `sampleContent` flag until authentic consented quotes replace samples. |
| `/admin/navigation` | yes | Public header/footer links. |
| `/admin/leads` | **yes, with auth** | Inbound write path from public `/free-estimate`; outbound read + status mutations from admin. |
| `/admin/seo` | yes | Both global defaults and per-path overrides; must regenerate sitemap/robots on write. |
| `/admin/marketing` | yes, with care | Tracking IDs are config, not secrets, but the loader itself (consent, enable, actual script injection) is a backend/responsibility shift — do not inject scripts in the admin UI. |
| `/admin/settings/*` | yes | General, branding, contact, notification prefs. User list requires real auth. |

## 3. Lead ingestion path

Current state: the public `FreeEstimatePage` does **not** POST to a backend. The admin `/admin/leads` list is seeded demo data only. The future flow needs:

- A public endpoint accepting form submissions with abuse controls (rate-limit, CAPTCHA, honeypot).
- Server-side normalisation and status defaulting (`status: "new"`).
- Admin API with read + status mutation under auth.
- Lead data retention policy consistent with the privacy policy page.

## 4. Image / asset pipeline

Branding and project uploads currently stay as **in-memory data URLs** (see `FileInput` in [src/admin/components.tsx](../src/admin/components.tsx)):

- Logo and favicon on `/admin/settings/branding`.
- Project thumbnails on `/admin/gallery`.
- Homepage hero image on `/admin/pages/homepage`.

A real pipeline needs:
- Chunked upload endpoint with MIME + magic-byte validation.
- Server-side resize/optimisation (WebP sizes mirroring `vite.config.ts` preloads).
- Stable public URLs served via the GitHub Pages or future CDN origin.
- Soft-delete and backreference check before purge.

## 5. Authentication & authorisation

The admin UI assumes **no auth** and renders a visible "Mock" badge in the sidebar footer and a sticky banner on `/admin/settings/users`. Required for production:

- Session-backed login (admin only).
- CSRF protection on every mutating endpoint.
- Role model (owner / editor / viewer) matching the Users page preview.
- Audit log of every write (page edit, lead status change, marketing config change).
- Route guard on both server and client. The current route-level `useNoIndex` is defence-in-depth, not an auth boundary.

## 6. Marketing / tracking boundary

Admin UI must stay script-free in Sprint 6.3 — this is a hard rule:

- No `<script>` injection from user input.
- No `eval`, no `innerHTML` of user strings, no dynamic script src from form values.
- Pixel/GTM/GA4 IDs are validated against known patterns and stored as **draft config**; a verified live connection requires a backend handshake.
- Consent-gated loading of real scripts belongs on the public site under a consent manager that respects visitor opt-out.

## 7. SEO ownership

Public SEO today is driven by typed data and prerender headers in [vite.config.ts](../vite.config.ts). After backend wiring:

- Sitemap and `robots.txt` should regenerate on CMS writes (or on CI build with CMS data).
- Canonical URLs must stay stable; CMS-side slug rename must trigger redirect records.
- Admin paths must stay excluded from the generated public sitemap and keep `Disallow: /admin/` in `robots.txt`. The current `staticRoutes()` test guards this and should remain in place.

## 8. What *not* to change in the backend swap

Keep these frontend behaviours intact:

- `useNoIndex` runtime meta injection on every admin page.
- `staticRoutes()` admin-exclusion test.
- `robots.txt` `Disallow: /admin/`.
- Admin layout + sidebar + topbar + shared components (`PageHeader`, `StatCard`, `DataTable`, `Modal`, `ConfirmDialog`, `IntegrationCard`, `FormField`, etc.) — they are the design-system contract Sprint 6.2 and 6.3 established.

Any backend sprint PR that touches these surfaces needs a design review before merge.
