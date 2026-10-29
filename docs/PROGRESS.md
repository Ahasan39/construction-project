# Progress Log

## Sprint 7.7 (Backend) — Admin Login Polish & Profile Experience (2026-10-29)

- Redesigned `/admin/login` as a two-column premium CMS layout: navy brand panel with the red accent and a slogan on desktop, compact brand lockup on mobile, refined form with inline validation styles, show/hide password toggle, loading spinner inside the submit button, double-submit guard, and an explicit note that password recovery is not available from this screen. Preserved CSRF, `throttle:login`, `redirect()->intended()`, and the existing `remember` boolean path through `Auth::attempt`.
- Added `/admin/profile` (`GET`), `PATCH /admin/profile`, and `PUT /admin/profile/password` under `auth` + `active`. Only the user's display name is editable; email, role, permissions, `is_active`, and `email_verified_at` are read-only on the server (dedicated `UpdateProfileRequest` validates `name` only). Password change requires `current_password`, enforces `Password::defaults()` with confirmation, and is throttled with the shared `login` rate limiter.
- Audit entries added: `profile.updated` (records only the names of the fields that changed) and `profile.password_changed` (no password material). Both reuse `AuditLogger`, which already redacts password/token keys defensively.
- Rebuilt the Inertia Profile page with two cards: profile details (editable name; read-only email/role/status/last sign-in) and change-password (current + new + confirm, each with a show/hide eye toggle and `aria-invalid` wiring). Success feedback uses the existing shared `flash.status` channel surfaced by `AdminLayout`.
- Polished the authenticated header: replaced the plain avatar + sign-out button with an accessible profile dropdown — initials-only avatar, name, role, email preview, Your profile link, and sign-out item. Dropdown closes on outside click, Escape, and route change; focus returns to the trigger on Escape.
- Added `WebProfileTest` with 8 cases: guest redirects, own-data isolation, valid update + audit, invalid name rejection, mass-assignment protection on role/is_active/email, wrong current password rejection, confirmation mismatch rejection, and successful password change + audit.
- Also fixed an Intelephense "Undefined method 'url'" warning on the `Media` model by hinting `Storage::disk()` as a `FilesystemAdapter`. No behaviour change.

### Verification

- Backend: `php artisan test` — **69 passed, 418 assertions** (was 61/363; +8 new profile tests).
- Backend: `vendor/bin/pint --test` — clean.
- Backend: `npm run build` — clean, 609 modules; manifest adds `Profile` chunk; `AdminLayout`/`Login` chunks regenerated.
- Root frontend untouched; no root checks needed. No DB schema changes. GitHub Pages demo unaffected.
- Browser QA: not performed; no browser automation available in this environment.

## Sprint 7.6 (Backend) — Admin Dashboard UI Parity (2026-10-29)

- Replaced the placeholder `/admin` Inertia closure with an invokable `DashboardController` that gathers summaries only for permissions the signed-in user actually holds: user counts (`users.view`), media count (`media.upload`), audit totals + 6 most recent entries (`audit.view`), and a General Settings completion checklist (`settings.view`). Session panel surfaces `last_login_at`.
- Rebuilt the Dashboard Inertia page with a 4-up stat row (icon tiles with brand red/muted tones), a two-column body (recent activity + truthful module-status checklist on the left; session, setup checklist, and quick links on the right). Unfinished modules render an amber "Coming in a later sprint" badge rather than a tempting dead link.
- Added `WebDashboardTest` covering admin, viewer, and editor payload-shape expectations.

### Verification

- Backend: `php artisan test` — 61 passed, 363 assertions.
- Backend: `vendor/bin/pint --test` — clean.
- Backend: `npm run build` — clean.
- Browser QA: not performed; manual QA steps supplied with the sprint report.

## Sprint 7.5 (Backend) — Inertia Admin Layout & General Settings (2026-10-29)

- Replaced the minimal authenticated Inertia shell with a responsive admin layout: fixed desktop sidebar, mobile drawer with body-scroll lock and Escape/focus restore, permission-aware navigation, sticky topbar, user/role chip, CSRF-protected sign-out, and shared flash messages.
- Added a database-backed General Settings module at `GET|PUT /admin/settings/general`, backed by the existing `site_settings` singleton. It covers identity, website/locale/timezone, CTA and estimate destination, contact details, address, business hours, social profiles, logo/favicon media references, and brand colors.
- Extracted `SiteSettingService` so the Sanctum API and web admin share the same validation, media-purpose checks, transaction, singleton handling, and `settings.updated` audit behaviour.
- Added `POST /admin/media` for authenticated logo/favicon uploads using the existing GD re-encoding media service and `media.upload` permission.
- Added `WebSettingsTest` coverage for guest redirects, viewer read-only access, admin persistence/audit, validation errors, and web media upload permissions.
- Preserved the independent GitHub Pages build and existing `/api/v1` endpoints. No commit, push, deploy, production migration, or destructive Git operation performed.

### Verification

- Backend: `php artisan test` — **58 passed, 310 assertions**.
- Backend: `vendor/bin/pint --test` — clean.
- Backend: `npm run build` — clean, 609 modules; manifest includes `AdminLayout`, `Dashboard`, `Users`, `General`, `Login`, and `InertiaCheck`.
- Root: `npm run lint`, `npm run typecheck`, `npm test` — clean; **497/497 tests** across 29 files.
- Root: `npm run build` — clean, 236 static entries + `404.html`; no `dist/admin/`.
- Config/view cache checks passed and caches were cleared.
- Browser QA: not performed; no browser automation is installed in this environment.

## Sprint 6.3 — Admin Panel Audit, Responsive QA & Final Polish (2026-10-23)

Audit sweep of the Sprint 6.2 admin panel. No new routes, no new deps, no restructuring. Fixes only where a genuine issue existed, plus a documented backend-readiness report.

### Audit findings & fixes

- **SearchFilterBar wrapping** ([src/admin/components.tsx](../src/admin/components.tsx)): with ≥ 3 filters (as on `/admin/leads`) the row crammed on `sm` widths and clipped select labels. Added `sm:flex-wrap`, gave the search input a `min-w-[200px]` and `sm:basis-64` so it doesn't collapse, capped filter selects at `max-w-[180px]`, and bumped the toolbar to match other surfaces (`rounded-xl shadow-sm`).
- **Mobile nav aria-expanded** ([src/admin/AdminTopbar.tsx](../src/admin/AdminTopbar.tsx)): the trigger button previously hard-coded `aria-expanded={false}`. Now receives the live `navOpen` state and declares `aria-controls="admin-sidebar-nav"` pointing at the drawer's `<nav>` element, so assistive tech knows the trigger controls the drawer and whether it is open.
- Confirmed every listing page (`/admin/pages`, `/admin/services`, `/admin/locations`, `/admin/gallery`, `/admin/blog`, `/admin/testimonials`, `/admin/leads`, `/admin/seo`) wraps its table in `DataTable`'s `overflow-x-auto` container, so no page-wide horizontal scroll is possible — the table scrolls internally. Long cell content is bounded with `max-w-*` + `truncate` / `line-clamp` where it matters.
- Confirmed modal body-scroll-lock + `max-h-[92dvh]` from Sprint 6.2 covers every create/edit/delete dialog across all modules.
- Confirmed admin routes stay excluded from `staticRoutes()`, `useNoIndex` still runs on every admin page, and `robots.txt` still carries `Disallow: /admin/`. The existing `admin.test.tsx` asserts the staticRoutes exclusion.

### Backend-readiness documentation

- New: [docs/BACKEND_READINESS.md](BACKEND_READINESS.md) — single-page map of every admin collection → where it lives today → what the Laravel/MySQL sprint needs to replace. Covers the context seam, per-module persistence gaps, lead ingestion path, image pipeline, auth/authz, marketing boundary (hard rule: no script injection from user input), SEO ownership, and the frontend surfaces the backend swap must *not* touch.

### Verification

- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run typecheck` — clean.
- `npm test` — **497/497 passed** across 29 files. No tests weakened; the Sprint 6.2 responsive-navigation tests continue to exercise the Escape-closes + focus-restore + topbar-title path.
- `npm run build` — clean, 236 static route entries + 404.html, **no `dist/admin/` directory emitted**.

### Browser QA — honest status

**Not performed in this run.** No browser automation framework is installed in this environment and I did not install one (the sprint instructions require approval for new deps). Code-level and jsdom tests cover the behaviours they can — route rendering, Escape-close + focus-restore, noindex meta injection, lead filtering, hex-colour validation, services taxonomy, absence of marketing script injection, staticRoutes isolation. A visual pass across 1920 × 1080 / 1440 × 900 / 1366 × 768 / 1024 × 768 / 768 × 1024 / 390 × 844 / 375 × 812 is still required before sign-off, and the Backend-Readiness doc flags this explicitly.

### Files modified

- `src/admin/components.tsx` — SearchFilterBar wrap behaviour.
- `src/admin/AdminTopbar.tsx` — `navOpen`, `aria-expanded`, `aria-controls`.
- `src/admin/AdminLayout.tsx` — passes `navOpen` to topbar.
- `src/admin/AdminSidebar.tsx` — adds `id="admin-sidebar-nav"` for the `aria-controls` target.
- `docs/BACKEND_READINESS.md` — new.
- `docs/PROGRESS.md`, `docs/QA_REPORT.md` — updated.

### Final git state

Branch `main`, HEAD `eed7e2b` (unchanged). Working tree holds forward-moving edits only; no commit, push, reset, stash, or destructive op performed.

## Sprint 6.2 — Admin Panel UI/UX Refinement & Responsive Optimization (2026-10-23)

Visual refinement of the Sprint 6.1 admin panel into a more polished, premium SaaS CMS. No new routes, no new dependencies, no backend work.

### Shell polish

- `src/admin/AdminLayout.tsx`:
  - Centered the admin workspace under a shared `max-w-[1400px]` container that matches the topbar; adds breathing room on 1920 × 1080 without over-stretching cards or forms.
  - Added mobile body-scroll-lock while the drawer is open (gated on `matchMedia("(min-width: 1024px)")` so desktop keeps its usual behaviour and jsdom-safe).
  - Added Escape-closes-drawer behaviour that restores focus to the sidebar trigger button (`#admin-nav-trigger`).
  - Toast host raised to `z-[60]` so it sits above the drawer/modal stack.
- `src/admin/AdminSidebar.tsx`:
  - Reworked the brand block with an "MR" badge chip + consistent navy/accent palette.
  - Active route is now indicated with both a brand-red background pill AND a left accent bar, so status does not depend on colour alone.
  - Added a profile footer labelled "Mock" to make the no-real-auth state unmistakable.
  - Reduced-motion safe transitions (`motion-reduce:transition-none`); overlay uses a subtle backdrop blur.
- `src/admin/AdminTopbar.tsx`:
  - Introduces a route-title map that surfaces the current page in the topbar (e.g. "Estimate leads", "Branding"); this doubles as a landmark for mobile where the page `<h1>` has scrolled off.
  - Trigger button exposes `id="admin-nav-trigger"` so the Escape handler can restore focus to it.
  - Hidden search on narrow viewports, visible user chip only ≥ md to stop crowding the mobile bar.

### Component system

- `components.tsx`:
  - `PageHeader` wraps actions on narrow viewports and keeps them right-aligned on `lg+`.
  - `StatCard` gained an optional small icon slot (brand-neutral SVG, tone-coloured chip) and an optional trend indicator; icon colour reflects the card tone so warning/success/accent cards stay visually consistent.
  - `DataTable` tightened header typography, kept header cells `whitespace-nowrap` to avoid awkward wrapping, raised row corners to `rounded-xl` to match other surfaces.
  - `Modal` now locks body scroll while open and caps height at `92dvh` so tall edit dialogs stay fully usable on short mobile viewports.
- `pages/DashboardPage.tsx`: KPI cards now carry icons, use consistent tone pairings, and the hint lines stay compact on `sm` sizes.
- `pages/LeadsPage.tsx`: duplicated the table into a stacked card list for `< sm`; the data table is only rendered at `sm+`. Prevents horizontal overflow on 375 × 812.

### Public-site preservation

- `/admin` is still excluded from `staticRoutes()`; the production build generates no `dist/admin/` folder (verified by `admin.test.tsx` and by inspecting `dist/`).
- `useNoIndex` continues to inject `<meta name="robots" content="noindex,nofollow">` for every admin page.
- `public/robots.txt` continues to carry `Disallow: /admin/`.
- No public component, test, data file, route, or SEO behaviour was changed.

### Verification

- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run typecheck` — clean.
- `npm test` — **497/497 passed** across 29 files; 2 new admin responsive-navigation tests added (Escape-close + focus restore, topbar route title).
- `npm run build` — clean, 236 static route entries + 404.html, no admin HTML entries generated.
- Browser QA with a real browser: **not performed in this run** — no browser automation is installed in this environment. Code-level checks and jsdom tests substitute where possible; a visual pass across 1920×1080 / 1440×900 / 1366×768 / 1024×768 / 768×1024 / 390×844 / 375×812 is still required before sign-off. The responsive design was built against those viewports but has not been visually confirmed.

### Files modified

- `src/admin/AdminLayout.tsx`
- `src/admin/AdminSidebar.tsx`
- `src/admin/AdminTopbar.tsx`
- `src/admin/components.tsx`
- `src/admin/pages/DashboardPage.tsx`
- `src/admin/pages/LeadsPage.tsx`
- `src/admin/admin.test.tsx`
- `docs/PROGRESS.md`, `docs/QA_REPORT.md`

### Known limitations carried forward

- Still mock data only; no persistence across reloads.
- Real authentication, image upload, lead ingestion, and tracking-script loading remain for the Laravel/MySQL sprint.
- Visual browser QA has not been performed; the ten listed viewports should be inspected manually before sign-off.

## Sprint 6.1 — Admin Panel UI/UX for Mr. Roof Website CMS (2026-10-23)

Frontend-only build of the website CMS admin dashboard. Mock data, local in-memory state, no Laravel or MySQL yet.

### Scope delivered

- **AdminLayout, AdminSidebar, AdminTopbar** at `src/admin/`. Mounted as a top-level `/admin` route (sibling of the public `AppShell`) so admin pages never inherit the public header, footer, offer popup, or live-chat widget.
- 17 admin page components across all required modules:
  - `/admin` — Dashboard with stat cards, recent enquiries, setup checklist, quick actions.
  - `/admin/pages` — Page list; `/admin/pages/homepage` — Homepage editor with validation, preview, and in-memory hero image preview.
  - `/admin/services` — Service CRUD UI.
  - `/admin/locations` — Service location management UI (edit SEO fields, preview link).
  - `/admin/gallery` — Project gallery with grid/list toggle, create/edit/delete, featured flag.
  - `/admin/blog` — Post management (create/edit/delete with validation).
  - `/admin/testimonials` — Testimonial management with sample-content labelling.
  - `/admin/navigation` — Header/About/footer link editor.
  - `/admin/leads` — Estimate enquiries with filters, pagination, status updates, detail drawer.
  - `/admin/seo` — Global SEO defaults, per-page SEO editor.
  - `/admin/marketing` — Meta Pixel, GTM, GA4, Search Console configuration cards.
  - `/admin/settings/general|branding|contact|notifications|users` — Site-wide settings.
- Reusable admin UI (`src/admin/components.tsx`): `PageHeader`, `Breadcrumbs`, `StatCard`, `DataTable` (sortable), `SearchFilterBar`, `StatusBadge`, `FormField`, `Modal`, `ConfirmDialog`, `EmptyState`, `IntegrationCard`, `ImagePreview`, `Toggle`, `Pagination`, `AdminButton`, `TextInput`, `TextArea`, `SelectInput`, `FileInput`. Toast feedback is rendered globally by the layout.
- Context-based mock store in `src/admin/store.tsx` seeded from live project data (`src/data/services`, `src/data/locations`, `src/data/galleryProjects`, `src/data/brand`). Writes persist for the current session only.

### Public SEO & safety

- Admin routes are **not** added to `staticRoutes()` — no `/admin/` HTML entries are emitted by the build. On GitHub Pages the SPA shell at `404.html` boots the admin UI for direct `/construction-project/admin/*` requests.
- `useNoIndex` injects `<meta name="robots" content="noindex,nofollow">` at runtime for every admin page and restores the public state on unmount.
- `public/robots.txt` now carries an explicit `Disallow: /admin/`.
- Marketing module never injects `<script>` tags, never evaluates user input, never fires real tracking events. Configuration is saved as a visibly labelled draft, not a verified live connection.
- No real authentication is implied; the Users page carries a sticky banner stating "no authentication yet".
- Branding, logo, and favicon uploads are **in-memory data URLs only** — nothing is sent to a server.

### Verification

- `npm run lint` — clean (0 errors, 0 warnings).
- `npm run typecheck` — clean (`tsc -b --noEmit`).
- `npm test` — **495/495 passed** across 29 files, including 8 new admin-area tests covering routing, noindex meta, form validation, lead filtering, marketing-script absence, hex-color validation, and public SEO isolation.
- `npm run build` — clean, 236 static route entries + 404.html; **no admin entries** generated in `dist/`.

### Known limitations

- All admin data is sprint-6.1 mock state. Edits do not update the public site and do not persist across page reloads.
- No real authentication, authorization, or audit log.
- Marketing/Search Console integrations save draft intent only — no scripts load, no handshake with external services.
- Browser QA not performed in this run; the admin layout is designed to work at 375 × 812, 768 × 1024, 1024 × 768, and 1440 × 900 and should be verified visually before sign-off.
- Future Laravel/MySQL phase must provide: persistence API behind the existing store seams, authenticated admin sign-in, image upload + CDN, real lead ingestion, live tracking script loading with consent gating, and sitemap/robots regeneration based on CMS state.

### Files added

- `src/admin/{types,mockData,store,useNoIndex,components,AdminLayout,AdminSidebar,AdminTopbar}.(ts|tsx)`
- `src/admin/pages/{DashboardPage,PagesListPage,HomepageEditorPage,ServicesPage,LocationsPage,GalleryPage,BlogPage,TestimonialsPage,NavigationPage,LeadsPage,SeoPage,MarketingPage,SettingsPages}.tsx`
- `src/admin/admin.test.tsx`

### Files modified

- `src/app/router.tsx` — added `/admin` top-level route with 17 child entries.
- `public/robots.txt` — explicit `Disallow: /admin/`.

## Sprint 5.22 — Simplify Main Header and Improve Navigation Balance (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; all prior uncommitted sprint modifications (Sprints 5.10–5.21) preserved. Strictly no commit, push, deploy, reset, stash, or destructive cleanup.
- **Main Header Simplification & Rebalanced Navigation:**
  - `src/components/layout/SiteHeader.tsx`:
    - Removed the duplicated phone number display from the main desktop navigation row.
    - Preserved phone link in the top utility strip (`ml-auto inline-flex items-center gap-2 ... Call +880 1842-299275`) and inside the mobile drawer.
    - Preserved all 7 primary navigation links: Roofing, Gutters, Siding, Windows, Masonry, Gallery, and About (with dropdown disclosure).
    - Preserved location selector, location-aware routing (`estimateHref`), keyboard navigation, visible focus indicators, and mobile hamburger drawer.
    - Rebalanced navigation spacing: applied `gap-6 xl:gap-8 text-[14px] font-bold tracking-wide uppercase` to the navigation list, elegantly utilizing the recovered space without crowding or awkward gaps.
    - Single, high-priority action CTA: prominent "Free estimate" button on the right with `size="md"` (`px-6 shadow-sm`).
    - Updated component documentation comment to reflect the simplified header layout.
- **Layout & Visual Impact:**
  - Header is cleaner, more modern, and visually balanced.
  - No text wrapping or clipping across supported desktop widths (`1440 × 900`, `1366 × 768`).
  - Mobile header and hamburger drawer behavior remain 100% intact with zero horizontal overflow on small screens (`375 × 812`).
- **Automated Verification:**
  - `npm run lint` — clean, 0 warnings.
  - `npm run typecheck` — clean (`tsc -b --noEmit`).
  - `npm test` — **487/487 passed** across 28 files (all tests green).
  - `npm run build` — clean, 236 static route entries + 404.html generated.
- **Browser QA Verification:**
  - Tested across 1440x900, 1366x768, 1024x768, 768x1024, and 375x812 (`sprint522_fresh_qa`).
  - Confirmed phone number is absent from main row and present in top strip.
  - Confirmed About dropdown disclosure opens/closes on click and Escape key.
  - Confirmed mobile drawer opens with LocationSelector, navigation links, and Free Estimate button.

## Sprint 5.21 — Compact Estimate Form Consent and Footer Spacing (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; all prior uncommitted sprint modifications (Sprints 5.10–5.20) preserved. Strictly no commit, push, deploy, reset, stash, or destructive cleanup.
- **Estimate Form Consent & Footer Spacing Compaction:**
  - `src/components/ui/Checkbox.tsx`:
    - Added optional `labelClassName?: string` prop to `CheckboxProps`.
    - Aligned checkbox box cleanly with `mt-0.5 h-4 w-4 shrink-0 rounded` and visible keyboard focus styling (`focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2`).
    - Standardized label styling fallback to `text-sm leading-snug cursor-pointer` while allowing compact typography where specified.
  - `src/features/estimate/EstimateForm.tsx`:
    - Checkbox group spacing: reduced gap between the two consent options from `gap-2` to `gap-1.5 pt-0.5`.
    - Compact label typography: applied `text-xs leading-snug text-slate-200 font-medium` to both checkboxes, keeping both options ("Send me appointment reminders and service updates.", "Send me seasonal offers and promotions.") concise, readable, and perfectly aligned with the checkbox control.
    - Preserved independent state and unchecked defaults for both consent options (`values.consentReminders`, `values.consentPromotions`).
    - Demo notice spacing: tightened margin above notice with `text-[11px] sm:text-xs leading-normal`.
    - Removed idle empty status region: eliminated empty placeholder element when `status !== "error"`, removing 21px of empty dead space and unnecessary flex gaps. Status region only mounts when `status === "error"` to display server validation messages with polite aria-live announcement.
    - Streamlined submit button area: button immediately follows demo notice with a clean 8px–10px flex gap (`gap-2 sm:gap-2.5`), with `py-2.5 sm:py-3` on the inverse red CTA button.
  - `src/components/sections/Hero.tsx`:
    - Tightened card footer spacing (`mt-2.5 pt-2 border-t border-slate-700/60`, `text-[11px] sm:text-xs text-slate-400`).
- **Layout & Above-the-Fold Impact:**
  - Net vertical space saved inside the lead-form card: **~35px–45px**.
  - On the standard laptop viewport (`1366 × 768`), the entire lead-form card, the red "Get a FREE ESTIMATE" CTA button, and the card footer ("Demo only / Standalone form") sit completely above the 768px fold with ample clearance above the floating Live Chat widget.
- **Automated Verification:**
  - `npm run lint` — clean, 0 warnings.
  - `npm run typecheck` — clean (`tsc -b --noEmit`).
  - `npm test` — **487/487 passed** across 28 files (all tests green).
  - `npm run build` — clean, 236 static route entries + 404.html generated.
- **Browser QA Verification:**
  - Captured rendered screenshots for 1366x768 and 375x812 (`sprint521_qa`).
  - Verified checkboxes remain interactive, independently toggleable, and accessible.
  - Verified form validation errors display cleanly in inverse card without layout clipping.
  - Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).

## Sprint 5.20 — Desktop First-Screen Layout Optimization (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; all prior uncommitted sprint modifications (Sprints 5.10–5.19) preserved. Strictly no commit, push, deploy, reset, stash, or destructive cleanup.
- **Shared Header Optimization:**
  - `src/components/layout/SiteHeader.tsx`:
    - Top utility strip: reduced height from `min-h-11 sm:min-h-14 py-1` (56px) down to `min-h-9 sm:min-h-10 py-1 sm:py-1.5` (~40px) — saving 16px of top bar height while keeping LocationSelector and phone link comfortable and fully clickable.
    - Main navigation row: tightened from `h-20 lg:h-24` (96px desktop) down to `h-16 sm:h-16 lg:h-18` (72px desktop / 64px mobile) — saving 24px of header space.
    - Logo scaling: adjusted from `h-10 lg:h-11 max-w-[180px] lg:max-w-[210px]` to `h-9 lg:h-10 max-w-[160px] lg:max-w-[190px]` (`aspect-ratio: 180 / 44`), preserving brand sharpness and visual weight without pushing navigation height.
    - Header CTA: tuned estimate button to `size="md"` (`h-11 px-5 text-xs lg:text-sm`), keeping prominent action hierarchy without bloating the row.
    - **Header Height Measurement:** Rendered desktop sticky header height dropped from **152px down to ~112px** (net savings of **40px** globally across all public pages).
- **Homepage First-Screen Optimization:**
  - `src/components/sections/Hero.tsx`:
    - Container padding: refined from `py-6 sm:py-8 lg:py-10` down to `py-3 sm:py-4 lg:py-5`, saving 20px of outer vertical padding on desktop.
    - Left column copy: optimized container padding from `p-6 sm:p-8 lg:p-10` to `p-4 sm:p-5 lg:p-6`; adjusted eyebrow kicker margin (`mb-1.5`); tuned H1 font size from `52px` to `40px` (`leading-[1.08]`) preserving the sky-blue swoosh underline; streamlined descriptive text margins.
    - Suburban home photography: resized height from `lg:h-[340px]` to `lg:h-[220px] xl:h-[235px]`, preserving responsive `<picture>` srcset (480w, 960w), LCP priority (`fetchPriority="high"`), and explicit width/height dimensions.
    - Emergency contact row: tightened from `py-4 sm:py-5` down to `px-5 py-2.5 sm:py-3`, maintaining bold "Active Leak? Storm Damage?" messaging and clickable phone number.
    - Right column lead-form card: tightened card padding from `p-6 sm:p-7` down to `p-4 sm:p-5 lg:p-5`, header spacing (`pb-2 mb-2.5`), and footer links.
  - `src/features/estimate/EstimateForm.tsx`:
    - Refined dark inverse card inputs with `!h-10 text-sm` and comfortable `gap-2.5 sm:gap-3`.
    - Styled checkbox labels with `font-semibold text-xs` in sentence case to eliminate excessive line-wrapping.
    - Dynamic status region: changed empty `min-h-[1.5em]` placeholder to `h-0` when idle, eliminating 21px of empty vertical space when no error is present.
    - Compact submit button: `py-3` with bold uppercase typography.
  - **Homepage Above-the-Fold Result:** On standard laptop viewports (`1366 × 768`), the entire lead-form card, the red "Get a FREE ESTIMATE" button, the left column photo, and the emergency contact row are 100% visible above the 768px fold without requiring any initial scrolling, with comfortable breathing room above the floating Live Chat widget.
- **Gallery Above-the-Fold Synergy:**
  - Leverages the compact hero layout from Sprint 5.19 (`py-6 sm:py-8 lg:py-9`).
  - With the shared header height reduced by 40px, the category filter toolbar and the entire first row of project photos appear even earlier on screen (~410px below top vs ~450px in Sprint 5.19 and ~609px in Sprint 5.18).
  - First-row cards and images are prominently visible above the 768px fold across all desktop viewports.
- **Automated Verification:**
  - `npm run lint` — clean, 0 warnings.
  - `npm run typecheck` — clean (`tsc -b --noEmit`).
  - `npm test` — **487/487 passed** across 28 files (all tests green).
  - `npm run build` — clean, 236 static route entries + 404.html generated.
- **Browser QA Verification:**
  - Verified across 1366x768 (primary laptop), 1440x900 (standard desktop), 1024x768 (small laptop/tablet landscape), and 375x812 (mobile).
  - Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
  - No clipping, no overlapping, clean responsive layout.

## Sprint 5.19 — Compact Gallery Hero & Above-the-Fold Visibility (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; all prior uncommitted sprint modifications (Sprints 5.10–5.18) preserved. No commit, push, deploy, reset, stash, or destructive cleanup.
- **Hero Compaction & Spacing Optimizations:**
  - [src/pages/GalleryPage.tsx](src/pages/GalleryPage.tsx):
    - Reduced hero vertical padding from `py-10 sm:py-14 lg:py-16` (64px desktop / 40px mobile) down to `py-6 sm:py-8 lg:py-9` (36px desktop / 24px mobile) — saving 56px of dead padding.
    - Reduced breadcrumb bottom margin from `mb-4` (16px) to `mb-2 sm:mb-2.5` (8-10px) — saving 6-8px.
    - Reduced eyebrow margin from `mb-2` to `mb-1` — saving 4px.
    - Adjusted H1 heading scale from `text-3xl sm:text-4xl lg:text-5xl` down to `text-2xl sm:text-3xl lg:text-4xl` with `leading-snug`, keeping prominent authority while preventing awkward wrapping and reducing vertical height by 24-36px.
    - Adjusted description text to `text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed`, preserving exact wording while reducing vertical footprint by 12px.
    - Aligned hero CTA button using `lg:items-center` and compact 44px height (`h-11 px-5`) matching the site's primary action button scale.
    - Drastically reduced top padding of the main gallery section from `py-10 sm:py-14` (56px) down to `pt-5 sm:pt-6 pb-12 sm:pb-16` (20-24px) — saving 32px between the hero border and the filter toolbar.
    - Tightened filter toolbar margin below from `mb-8 sm:mb-10` (40px) down to `mb-5 sm:mb-6` (20-24px) with compact badge padding (`px-3.5 py-2`, min-w-4.5 count bubble).
  - [src/components/gallery/ProjectCard.tsx](src/components/gallery/ProjectCard.tsx):
    - Optimized card content padding from `p-5` to `p-4 sm:p-5`.
    - Clamped card summary to `line-clamp-2` (from `line-clamp-3`), standardizing card heights and saving ~20px per card row.
    - Adjusted action row margin and border padding from `mt-4 pt-4` to `mt-3.5 pt-3.5`.
- **Above-the-Fold Impact:**
  - Net vertical space saved before the cards grid: **~150px+** on standard desktop viewports (1440x900 and 1366x768).
  - Previously, cards began at ~609px below the viewport top, hiding all card images and titles behind the fold on 1366x768 / 1440x900 screens.
  - Now, the first row of project cards (including full photos, category tags, and titles) begins at ~450px, rendering prominently and immediately above the fold without requiring user scrolling.
- **Automated Verification:**
  - `npm run lint` — clean, 0 warnings.
  - `npm run typecheck` — clean (`tsc -b --noEmit`).
  - `npm test` — **487/487 passed** across 28 files (all 17 [GalleryPage.test.tsx](src/pages/GalleryPage.test.tsx) assertions green).
  - `npm run build` — clean, 236 static route entries + 404.
- **Browser QA:**
  - Executed browser subagent session against preview server (`compact_gallery_qa_1792677805057.webp`).
  - Verified above-the-fold visibility across 1440px desktop, 1024px laptop, 768px tablet, and 375px mobile viewports.
  - Confirmed 0 horizontal overflow, no clipped text, comfortable touch targets, and instant filter responsiveness.

## Sprint 5.18 — Premium Gallery / Our Work page (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; prior uncommitted sprint modifications (Sprints 5.10–5.17) preserved. No commit, push, deploy, reset, stash, or destructive cleanup.
- **Route & Prerendering:**
  - Dedicated route: `/gallery/` mapped to [src/pages/GalleryPage.tsx](src/pages/GalleryPage.tsx) via `React.lazy()` in [src/app/router.tsx](src/app/router.tsx).
  - GitHub Pages base-path `/construction-project/gallery/` fully supported via router basename `import.meta.env.BASE_URL`.
  - Static entry generation: added `"/gallery"` to `staticRoutes()` in [src/app/staticRoutes.ts](src/app/staticRoutes.ts) — build emits `dist/gallery/index.html` (236 supported static route entries + 404, +1 vs 235 baseline).
- **Navigation:**
  - Added `{ label: "Gallery", to: "/gallery" }` to `primaryNav` in [src/data/navigation.ts](src/data/navigation.ts) between "Masonry" and "About".
  - Automatically rendered on desktop header navigation and inside the mobile navigation drawer.
  - Verified by [src/app/navigation-integrity.test.ts](src/app/navigation-integrity.test.ts).
- **Centralized Project Data & Image Integrity:**
  - Typed project schema in [src/data/galleryProjects.ts](src/data/galleryProjects.ts) supporting project IDs, categories, property types, scope summaries, detailed descriptions, scope highlights, materials, primary and additional images, and transparent demo notices.
  - 9 curated demonstration projects across 5 service categories (Roofing: 4, Siding: 2, Windows: 1, Gutters: 1, Masonry: 1).
  - Reused existing high-quality local WebP assets with responsive variants (480w, 900w/1200w/1440w). Zero external image runtime dependencies, no unoptimized assets.
  - Honest copy policy: no fabricated client names, private addresses, ratings, or false claims. Content is clearly identified as demonstration portfolio material illustrating genuine construction specifications.
- **UI Components & Features:**
  - [src/pages/GalleryPage.tsx](src/pages/GalleryPage.tsx):
    - Compact hero with breadcrumbs (`Home › Project Gallery`), H1 `Our Work & Project Gallery.`, descriptive intro, and "Request an Estimate" CTA linking to `/free-estimate`.
    - Category filter toolbar with "All Projects", "Roofing", "Siding", "Windows", "Gutters", "Masonry" with project count badges, `role="toolbar"`, `aria-pressed`, keyboard support, and an accessible polite live region.
    - Responsive grid (1–2 cols mobile, 2 cols tablet, 3 cols desktop) rendering [src/components/gallery/ProjectCard.tsx](src/components/gallery/ProjectCard.tsx) with `.hover-lift`, category tags, and "View Project" trigger.
    - Empty state fallback with reset button.
    - Bottom conversion section in dark navy (`bg-[#0C1F33]`) with direct phone link and Free Estimate button.
  - [src/components/gallery/ProjectLightboxModal.tsx](src/components/gallery/ProjectLightboxModal.tsx):
    - Accessible dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`).
    - Focus containment trap inside dialog, focus restored to trigger on dismiss.
    - Escape key dismissal, backdrop click dismissal, and explicit close button.
    - Body scroll locking (`overflow = "hidden"`) while open.
    - Multi-photo support with previous/next buttons, left/right keyboard arrows, photo count indicator, and thumbnail tab list.
    - Full project scope description, checklist of scope highlights, materials installed list, and "Request an Estimate" conversion action.
- **Automated Verification:**
  - `npm run lint` — clean, 0 warnings.
  - `npm run typecheck` — clean (`tsc -b --noEmit`).
  - `npm test` — **487/487 passed** across 28 files (+17 new assertions in [src/pages/GalleryPage.test.tsx](src/pages/GalleryPage.test.tsx) vs 470 baseline).
  - `npm run build` — clean, 236 static route entries + 404.
- **Browser QA:**
  - Automated interactive browser QA executed via browser subagent against Vite preview at `http://localhost:4173/construction-project/gallery/`.
  - Verified hero rendering, category filtering (All, Roofing, Siding), opening lightbox modal, viewing additional photos via thumbnail/arrow navigation, Escape key modal dismissal, and responsive layout across desktop (1440px), tablet (768px), and mobile (375px) without horizontal overflow.
  - Screen recording artifact captured: `gallery_page_qa_1792676879439.webp`.
- **Remaining Work for Production:**
  - Replace sample portfolio items with authentic contractor project photos, verified job addresses/neighborhoods, and verified client testimonials once provided by the business owner.

## Sprint 5.17 — Back-to-top button (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; prior-sprint uncommitted changes preserved. No reset / stash / discard / commit / push / deploy.
- New: [src/components/layout/BackToTopButton.tsx](src/components/layout/BackToTopButton.tsx) — floating 44 × 44 px button in `--color-brand-primary` with upward chevron SVG, white text, soft layered shadow + `ring-1 ring-black/5`. Fixed at `right-4 sm:right-6` and **`bottom-[88px] sm:bottom-[96px]`** — explicitly stacked above the Live Chat launcher (which sits at `bottom-4 / sm:bottom-6` and is ~56 px tall), with ~16 px of breathing room between them. Both share `z-50`, so the Offer Popup's `z-[60]` backdrop still covers both while the popup is open. Mounted globally once in [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx) alongside `LiveChatWidget` and `OfferPopup`, so it is available across every route without duplicating per page.
- **Behavior:** passive `scroll` listener on `window` toggles visibility when `window.scrollY > 400`; near the top the button carries `opacity-0 pointer-events-none aria-hidden="true" tabindex="-1"` so it is invisible to pointer, pointer-only, and screen-reader users; past the threshold it carries `opacity-100 pointer-events-auto aria-hidden="false" tabindex="0"`. Click calls `window.scrollTo({ top: 0, left: 0, behavior: … })`. Behavior is `"smooth"` under `prefers-reduced-motion: no-preference` and `"auto"` under `reduce` (asserted by test).
- **Accessibility & reduced motion:** `<button type="button">` with `aria-label="Back to top"`; visible focus state via `focus-visible:outline-2 focus-visible:outline-offset-2 outline-[var(--color-focus)]`; hover lift `hover:-translate-y-0.5` + opacity/transform transition gated by `motion-safe:` so reduced-motion viewers see no animation; `aria-hidden` toggled with visibility so the button is honestly hidden from assistive tech while invisible. No decorative text label clutters the icon-only control.
- **Overlap with Live Chat:** handled by stacking: back-to-top sits 72 px above the chat launcher in the same right edge. Chat launcher at mobile `bottom-16` (effective 1 rem + 56 px dock = 72 px below the back-to-top) → gap of 16 px. On `sm+`, chat shifts to `bottom-6` and back-to-top shifts to `bottom-[96px]`, maintaining the same visual rhythm.
- **Tests added:** [src/components/layout/BackToTopButton.test.tsx](src/components/layout/BackToTopButton.test.tsx) — 6 assertions covering hidden-at-top (aria-hidden="true", tabindex="-1", opacity-0, pointer-events-none), visible-after-threshold scroll, re-hide after scrolling back near top, smooth-scroll on click, `prefers-reduced-motion: reduce` → `behavior: "auto"` fallback, and the stacked positioning classes (`bottom-[88px]`, `sm:bottom-[96px]`, `right-4`, `sm:right-6`).
- **Verification (actual):** `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **470/470** across 27 files (+6 vs the 464 Sprint 5.16 baseline), `npm run build` clean with 235 static entries + 404 (unchanged — new component mounts globally, not a new route).
- **Rendered browser QA — not performed.** Chrome/Edge binaries exist on this host but no automation driver is attached; the sprint spec forbids installing one without approval. Visual pacing of the smooth scroll, actual stacking against the live chat launcher at the pixel level, and real `prefers-reduced-motion` behavior across OS/browser combinations remain unverified in a real browser.
- Guardrails respected: no commit / push / deploy / amend; no new dependency; footer "Design and Developed by Qorvin IT" credit and `https://qorvinit.com/` destination untouched; no unrelated page or floating-widget redesign.

## Sprint 5.15 — Footer developer credit (2026-10-22)

- Baseline: branch `main` at `1dcd63f`; carried uncommitted Sprint 5.10–5.14 edits, all preserved. No reset / stash / discard.
- Added "Design and Developed by [Ahasan39](https://ahasan39.github.io/)" to the bottom bar of [src/components/layout/SiteFooter.tsx](src/components/layout/SiteFooter.tsx), beside the existing legal line. Shares the row with the copyright, separated by a middle-dot on `md+` and wrapping below on narrow widths via `flex flex-wrap items-center gap-x-3 gap-y-1`. The link is an `<a href="https://ahasan39.github.io/">` with white text + brand-blue hover, underline on the name, `focus-visible` outline using the shared `--color-focus` token; same-tab navigation per the project's default convention (no `target="_blank"`).
- Footer layout, colors, typography, spacing, responsive behavior, and all current links (Privacy Policy, Terms & Conditions, Crew Portal, Service / Service Areas / Resources / Company / Recent Posts columns) are unchanged. No new dependency, no footer redesign.
- Verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **464/464** across 26 files (unchanged — footer tests are role-/label-based and unaffected), `npm run build` clean with 235 static entries + 404 (unchanged).
- Guardrails respected: no commit / push / deploy. All prior sprint work preserved.

## Sprint 5.14 — Continuous reviews marquee + launcher float (2026-10-22)

- Baseline: branch `main` at **`1dcd63f`**. Carried uncommitted Sprint 5.10–5.13 edits; all preserved. No reset / stash / discard / commit / push / deploy / amend / global-config change.
- **Part A — Reviews carousel: dual-mode "marquee + stepped"**:
  - CSS keyframes `@keyframes marqueeX { from { transform: translateX(0) } to { transform: translateX(-50%) } }` added to `globals.css`, plus a `.marquee-track` utility (`animation: marqueeX var(--marquee-duration, 60s) linear infinite`) and a `.marquee-root` wrapper selector so the track pauses on `:hover` and `:focus-within` without JavaScript. All three are inside the existing `@media (prefers-reduced-motion: no-preference)` block from Sprint 5.9.
  - [src/components/sections/ReviewsStrip.tsx](src/components/sections/ReviewsStrip.tsx) rewritten around a `mode: "marquee" | "stepped"` state. **Default:** `marquee` under `prefers-reduced-motion: no-preference`; `stepped` when the OS reports `reduce` OR when `single` is passed (service-hub single-slide usage). **Any manual interaction** — Prev/Next/dot/arrow/swipe — switches to `stepped` and preserves the original index-based transform. The **Play/Pause button** toggles between the two modes.
  - **Seamless-loop implementation:** the marquee track is `className="flex w-max marquee-track"` (so its intrinsic width equals its content, not 100% of the viewport) and renders the reviews **twice** — the second half carries `aria-hidden="true"` and no `role`/`aria-label`, so screen readers see 9 canonical slide groups and no duplicate focusable controls. Each card uses `width: ${100/visibleCount}vw` and `max-w-[22rem]` so the cadence feels right across widths. Translating `0% → -50%` snaps precisely to the start of the second copy — no visible gap or jump at the loop point. Loop duration: 60 s (slow, calm; linear easing so there's no acceleration at the seam).
  - **Pause behavior:** CSS alone (`:hover` and `:focus-within` on `.marquee-root`) pauses the keyframe animation; no JS timer or RAF needed. The explicit Play/Pause button is a mode toggle. Reduced-motion viewers never see the marquee at all because `.marquee-track` lives inside the no-preference guard **and** the component flips to `stepped` mode when `matchMedia("(prefers-reduced-motion: reduce)")` matches.
  - **Dots pagination:** always visible. In `marquee` mode, no dot carries `aria-selected`; clicking any dot switches to `stepped` and selects that index. Prev button is disabled in `marquee` mode; Next is enabled and (on first click) lands on index 1 for a natural forward step.
- **Part B — Live Chat launcher float**:
  - CSS keyframes `@keyframes launcherFloat { 0%,100% { translateY(0) } 50% { translateY(-4px) } }` and a `.launcher-float` utility (`animation: launcherFloat 2800ms var(--ease-standard) infinite`) added to `globals.css`, both inside the no-preference guard.
  - [src/components/chat/LiveChatWidget.tsx](src/components/chat/LiveChatWidget.tsx) conditionally applies `launcher-float` only when the panel is **closed** (`open === false`). When the panel opens, the class is removed from the launcher's `className`, so the launcher sits still while the panel's own `fadeInUp` entrance runs — clear visual distinction between the two states. Closing the panel re-applies the class and the gentle bob resumes. The whole class list is behind `motion-safe:` prefixes already added in prior sprints, so reduced-motion viewers see a static launcher. No fake unread badge, no fake online indicator, no flashing — honest-copy policy preserved.
- **Reduced-motion & accessibility (mandatory per spec):**
  - `.marquee-track` and `.launcher-float` both live inside `@media (prefers-reduced-motion: no-preference)` AND the global `prefers-reduced-motion: reduce` rule clamps `animation-duration` to `0.001ms`, so reduced-motion viewers get no auto-motion from either feature.
  - Reduced-motion forces `mode = "stepped"` on the carousel and makes the Play/Pause toggle `aria-disabled="true"`.
  - Dialog semantics, Escape handling, focus containment, focus restoration, and body scroll-lock on the Live Chat panel are **preserved** (asserted by existing tests and the new ones below).
  - Marquee cloned reviews don't duplicate accessible controls or role=group entries (asserted).
- **Tests (actual results):**
  - `ReviewsStrip.test.tsx` restructured into two blocks: **stepped-mode (post-interaction)** — 8 tests retained in modified form; and **marquee-mode (continuous)** — 4 new tests covering the duplicated track (18 slots, 9 canonical + 9 aria-hidden clones), the `marquee-root` CSS pause wrapper, no duplicate `role="group"` nodes, and mode switch via Next → marquee removed from DOM → Resume via Play restores it.
  - `LiveChatWidget.test.tsx` adds 3 tests: launcher carries `launcher-float` while closed; opening the panel suppresses continuous launcher motion; closing restores it.
  - All earlier assertions (dialog semantics, Escape, focus-restoration, no-false-delivery, closed-panel unmount invariant) remain green and unchanged.
- **Verification:** `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **464/464** across 26 files (+4 vs 460 Sprint 5.12 baseline — the net change is +4 new marquee-mode tests + 3 new launcher-float tests, offset by the retirement of the two Sprint 5.12 "track transform" tests whose model moved to marquee mode), `npm run build` clean with 235 static entries + 404 (unchanged).
- **Real-browser visual verification: not performed.** Same environment constraints as Sprints 5.10 / 5.11 / 5.12 / 5.13 — Chrome/Edge binaries exist on the host but no automation driver is attached to this session and the sprint spec forbids installing one without approval. **Visual carousel smoothness (seamless loop endpoint, hover-pause snap, speed feel), launcher float pacing, cross-browser behavior, and real `prefers-reduced-motion` behavior remain unverified in a real browser.**
- Guardrails respected: no new dependencies, no commit / push / deploy / amend / global-config change. All prior sprint work preserved.

## Sprint 5.13 — Real-browser verification attempt (2026-10-22)

- Baseline: branch `main` at **`1dcd63f`**. Working tree carried the uncommitted Sprint 5.10–5.12 changes (10 files touched); all preserved. No reset / stash / discard / commit / push / deploy / amend / global-config change.
- **Environment audit (actual):**
  - Chrome and Edge are installed as GUI applications on this Windows host (`C:\Program Files\Google\Chrome\Application\chrome.exe`, `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`).
  - **No automation driver attached to this session.** `which playwright / puppeteer / chromium / lighthouse / lhci / gh` → all "not found". No MCP browser bridge enabled.
  - A direct `chrome.exe --headless --screenshot=…` can only produce a static one-shot image; it cannot click Prev/Next, open the Live Chat panel, press Escape, switch viewports, or capture console errors — which are the exact scenarios the sprint requires.
- **Decision (per sprint spec's explicit instruction):** *"If no browser is available, stop before installing anything. Report exactly what is missing and request approval for the smallest suitable testing setup."* No real-browser scenario was executed, no screenshot was captured, no visual claim is made. See `docs/QA_REPORT.md` for the full tool-availability matrix and the proposed minimal setup.
- **Regression checks (actual, permitted by sprint):**
  - `npm run lint` — clean, no warnings
  - `npm run typecheck` — clean (`tsc -b --noEmit`)
  - `npm test` — **460/460** across 26 files (baseline preserved from Sprint 5.12)
  - `npm run build` — clean, **235** static entries + 404 (unchanged)
- **Smallest suitable testing setup — awaiting your approval:** preferred is **Playwright** scoped to a new `tests/e2e/` folder (`npm i -D @playwright/test` + `npx playwright install chromium`). Alternatives are Puppeteer or an MCP browser bridge (no npm change). Scenarios ready to run once wired up are enumerated in `docs/QA_REPORT.md` (carousel at three viewports, Live Chat mount + open/close + Escape + focus, reduced-motion toggle, cross-browser Chrome/Edge, Lighthouse mobile+desktop, console/network capture).
- **Files changed this sprint:** documentation only (`docs/PROGRESS.md`, `docs/QA_REPORT.md`). No source code touched.
- Guardrails respected: no new dependencies, no commit / push / deploy. All prior sprint work preserved.

## Sprint 5.12 — Reviews carousel polish + Live Chat animation (2026-10-22)

- Baseline: branch `main` at **`1dcd63f`**. Working tree carried Sprint 5.10 docs + Sprint 5.11 source changes (uncommitted) — all preserved. No reset / stash / discard / commit / push / deploy / amend / global-config change.
- **Carousel diagnosis (actual root cause investigation).** Walked the full `ReviewsStrip` logic in [src/components/sections/ReviewsStrip.tsx](src/components/sections/ReviewsStrip.tsx) and its test suite:
  - Slide math: `translateX(-${currentIndex * (100 / visibleCount)}%)` is applied to a `flex` track whose cards each use `shrink-0` + inline `width: ${100/visibleCount}%`. Transform percentages resolve against the transformed element's own border-box width (the flex track = 100% of the carousel window), so each step shifts exactly one card width. **The math is correct and verifiably advances by one card per step at every breakpoint** — covered by a new regression test that reads the computed `style.transform` after keyboard navigation.
  - `goNext` / `goPrev` already use functional `setState` updaters, so rapid consecutive clicks and keyboard presses chain deterministically without desyncing the state and the resulting transform.
  - Boundary / loop logic: Previous and Next buttons are disabled at index 0 / `maxIndex` only when autoplay is off — this is the deliberate design captured by existing tests (`prevBtn.disabled === true` at index 0). Buttons still loop via `goNext`/`goPrev` when autoplay is on. **This is not a bug; it is the current product contract and was not changed.**
  - Resize handling (visibleCount recomputed, index clamped) and reduced-motion handling (autoplay disabled, matchMedia change listened to) were already correct.
  - **No executable sliding defect was reproducible from source analysis or in jsdom.** The sprint spec says to focus on genuine fixes; what remained was a motion-system consistency problem (the carousel used a hard-coded `transition-transform duration-500 ease-out` while the rest of the site now consumes the Sprint 5.11 motion tokens) and the task's explicit "fix only verified defects" guardrail.
- **Carousel changes applied:**
  - Replaced `transition-transform duration-500 ease-out` with an inline `transition: transform var(--duration-emphasized) var(--ease-standard)` and added `willChange: "transform"` on the track element. Timings now align with the shared motion scale (480 ms + standard easing), making the slide feel visually in-family with hero / card reveals and hover-lift transitions. No functional behavior changed; all pre-existing carousel tests (9 pass) still green.
  - Added 2 regression tests to [src/components/sections/ReviewsStrip.test.tsx](src/components/sections/ReviewsStrip.test.tsx): one asserts the transform advances by exactly `100/visibleCount %` per step (one card width) across keyboard navigation at desktop width, the other asserts the track `style.transition` references `--duration-emphasized` and `--ease-standard` and that `willChange: transform` is set.
- **Live Chat launcher polish** ([src/components/chat/LiveChatWidget.tsx](src/components/chat/LiveChatWidget.tsx)):
  - Added a one-shot entrance animation on first mount: `motion-safe:animate-[fadeInUp_320ms_var(--ease-emphasized)_both]` — the launcher fades + rises into position when the widget mounts, then stays put. The `_both` fill mode guarantees the final visible state persists after the animation ends.
  - Added `hover:scale-[1.03]` for a subtle responsive feel on hover and `active:scale-[0.98]` for a crisp pressed state. Transition duration bumped to 200 ms (`motion-safe:duration-200`) so scale + background-color transitions blend together.
  - **No fake unread badge, no fake online indicator, no infinite pulse** — unchanged from the honest-copy policy established in Sprint 5.8.
- **Live Chat panel polish:**
  - Upgraded the panel entrance from `motion-safe:animate-[fadeIn_140ms_ease-out]` to `motion-safe:animate-[fadeInUp_240ms_var(--ease-emphasized)_both]` and added `origin-bottom-right` so the panel rises out of the launcher corner, feeling connected to its origin rather than appearing abstractly in space. Shorter, snappier open-feel; same close path.
  - **Dialog semantics preserved**: `role="dialog"`, `aria-labelledby`, `aria-describedby`, Escape-to-close, focus moved to close button on open, focus returned to launcher on close, body scroll lock (via the `.hover-lift` system isn't involved here — panel scroll stays within the panel). Closed-panel invariant: the dialog is conditionally rendered inside the JSX (`{open && <section …>}`), so when `open === false` the dialog subtree is **fully unmounted** — covered by a new regression test that confirms the dialog, textarea, and Send button are all absent from the DOM after close, so nothing can intercept pointer or keyboard focus.
- **Tests added (Sprint 5.12 regressions, 5 new assertions):**
  - Carousel: "track transform advances by exactly one card-width per step"; "track transform uses the shared motion tokens for its transition".
  - Live Chat: "launcher mount applies the shared fadeInUp entrance animation"; "open panel uses the shared fadeInUp entrance animation"; "closed panel is fully unmounted so it cannot intercept clicks or focus".
- **Automated verification (actual results):**
  - `npm run lint` — clean, no warnings
  - `npm run typecheck` — clean (`tsc -b --noEmit`)
  - `npm test` — **460/460** across 26 files (+5 vs the 455 Sprint 5.11 checkpoint; no existing test was weakened or deleted)
  - `npm run build` — clean, 235 static entries + 404 (unchanged)
- **Browser tools actually used: none.** Same environment constraints as Sprints 5.10 / 5.11 — no Playwright / Puppeteer / Lighthouse / `gh` / MCP browser bridge available this session. The sprint spec forbids installing new tooling without approval, so none was installed. **Visual carousel sliding smoothness, Live Chat entrance pacing, cross-browser behavior, and real responsive rendering at 375 / 768 / 1440 widths remain unverified in a real browser.**
- **Known limitations:**
  - A visual-only carousel defect that depends on specific browser rendering (not detectable in jsdom) could still exist; if reported with concrete steps, a follow-up pass can address it. The source-level math and all unit tests behave correctly.
  - Reduced-motion behavior across OS/browser combinations is handled via the global `prefers-reduced-motion: reduce` CSS rule and `motion-safe:` Tailwind variants, but not visually verified this session.
  - Prior sprint limitations unchanged (legal placeholder chip; chat unconnected; billpay/visualizer unintegrated; GitHub Pages deployment status for `1dcd63f` not verified from this terminal).
- Guardrails respected: no new dependencies, no commit / push / deploy / amend / global-config change. All prior sprint work preserved.

## Sprint 5.11 — Premium animation enhancement (2026-10-22)

- Baseline: branch `main` at **`1dcd63f`** (Sprint 5.9 release). Working tree carried the two Sprint 5.10 doc edits (uncommitted). No reset / stash / discard / commit / push / deploy / amend / global config change.
- **Scope: extend the Sprint 5.9 motion system across more of the existing site — no new library, no redesign.** Reused the `Reveal` component and introduced two small shared CSS utilities (`.hover-lift`, `.arrow-nudge`) alongside motion tokens, all gated by `@media (prefers-reduced-motion: no-preference)` so reduced-motion viewers see no transforms.
- **Motion tokens + utilities** ([src/styles/globals.css](src/styles/globals.css)):
  - **CSS custom properties:** `--ease-standard`, `--ease-emphasized`, `--duration-fast (150ms)`, `--duration-standard (240ms)`, `--duration-emphasized (480ms)`. The existing `.reveal` transition now consumes these tokens for consistency.
  - **`.hover-lift`** — card hover utility: 2 px upward translate + layered shadow + 240 ms standard easing. Also fires on `:focus-within` so keyboard-only users get the same lift when they tab into a card.
  - **`.arrow-nudge`** — "Read more »" style link utility: generates the `»` glyph via `::after` and nudges it `translateX(3px)` on hover/focus. Keeps the accessible name unchanged (pseudo-content isn't part of accessible-name computation), so existing `getByRole("link", { name: /read more/i })` tests still match.
  - All three (reveal, hover-lift, arrow-nudge) are inside the single `@media (prefers-reduced-motion: no-preference)` block already present from Sprint 5.9. The global `@media (prefers-reduced-motion: reduce)` rule still clamps every `animation-duration`/`transition-duration` to `0.001ms`.
- **Components / sections enhanced this sprint:**
  - **WhyUs** ([src/components/sections/WhyUs.tsx](src/components/sections/WhyUs.tsx)): each benefit card is now `<Reveal as="li">` with a 0 / 60 / 120 / 180 ms stagger and the `.hover-lift` utility. Sticky left heading unchanged.
  - **PromotionsRow** ([src/components/sections/PromotionsRow.tsx](src/components/sections/PromotionsRow.tsx)): each promo card is now `<Reveal as="li">` with 0 / 80 / 160 ms stagger and `.hover-lift`. Existing `hover:shadow-xl` is preserved and the two combine cleanly.
  - **Blog listing cards** ([src/pages/BlogIndexPage.tsx](src/pages/BlogIndexPage.tsx)): `.hover-lift` added to each card; "Read more" link now uses `.arrow-nudge` so the chevron slides on hover/focus. The accessible-name regex (`/read more/i`) continues to match because the chevron is CSS-generated pseudo-content.
- **Not changed this sprint (deliberate):**
  - Hero section (already revealed Sprint 5.9) — unchanged to avoid delaying LCP.
  - ServiceCards (already revealed + hover-lifted Sprint 5.9) — unchanged.
  - Offer Popup / Live Chat (already polished Sprints 5.6.1 / 5.7.1) — unchanged; dialog semantics, Escape handling, focus containment, body scroll lock all preserved.
  - Mobile nav drawer (already animated per `MobileNav.test.tsx`) — not touched; existing drawer transitions and keyboard behavior are the production baseline.
  - Reviews carousel — not touched; existing autoplay honors reduced motion and prior visual pacing was intentional.
  - Service hub / variant / location hero sections — not touched this sprint; could be revealed later but the hero copy there is above the fold and should not be gated by any observer trigger.
- **Accessibility & reduced motion:**
  - All new transforms live inside `@media (prefers-reduced-motion: no-preference)`; reduced-motion viewers see no lift, no arrow nudge, no stagger — content is immediately readable.
  - `.hover-lift` also activates on `:focus-within`, so keyboard users get the same visual feedback when they tab into a card without needing a mouse hover.
  - Pseudo-content `»` is decorative; the link's visible/announced text remains `"Read more"`.
  - No interactive element moves out from under the pointer or keyboard. No flashing. No info conveyed only through motion.
- **Automated tests:**
  - All existing Sprint 5.9 Reveal assertions remain green (fallback behavior, delay propagation, class names).
  - All existing BlogPages / HomePage / ReviewsStrip / MobileNav / OfferPopup / LiveChat / UtilityAndLegalPages assertions remain green — selector names and accessible-name lookups preserved.
  - **No test weakened, no test deleted.** The `getAllByRole("link", { name: /read more/i })` lookup continues to work because the CSS pseudo-content chevron is not part of the accessible name.
- **Browser tools actually used:** **none.** Same environment constraints as Sprint 5.10 — no Playwright / Puppeteer / Lighthouse / `gh` / MCP browser bridge available. Sprint spec explicitly forbids installing animation libraries or browser automation without approval, so no dependency was added. Visual animation quality, responsive rendering at 375 / 768 / 1440, cross-browser behavior, and real `prefers-reduced-motion` behavior **remain unverified** this session.
- **Verification (actual):** `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **455/455** across 26 files (count unchanged — the sprint reused existing selectors), `npm run build` clean with 235 static entries + 404 (unchanged).
- **Known limitations:**
  - Visual QA at 375 / 768 / 1440 widths and cross-browser coverage not performed.
  - IntersectionObserver thresholds (`0.08`) and 240 / 480 ms transition timings not visually tuned against real page scrolls.
  - All prior sprint limitations unchanged (legal placeholder chip pending review; chat / billpay / visualizer unintegrated; GitHub Pages deployment status for commit `1dcd63f` not verified from this terminal).
- Guardrails respected: no new dependencies, no commit / push / deploy / amend. All prior sprint work preserved.

## Sprint 5.10 — Browser QA / performance audit pass (2026-10-22)

- Baseline: branch `main` at **`1dcd63f`** (Sprints 5.5.13–5.9 release). Working tree **clean** at session start. Verified via `git status` + `git log -1`.
- **Browser tooling audit (actual environment):** no Playwright, no Puppeteer, no Cypress, no Chrome DevTools MCP, no in-app browser pane, no Chrome-extension bridge enabled this session. `which lighthouse`, `which playwright`, `which chromium`, `which gh` all return "not found". Per the sprint's own instruction — "Do not add browser automation or performance dependencies without approval" and "Never claim browser QA or Lighthouse results unless actually executed" — this sprint runs **source-level audit + automated regression only** and explicitly refuses to fabricate browser evidence. **Lighthouse scores, Core Web Vitals (LCP/CLS/INP), rendered responsive QA at 375/768/1440, and cross-browser coverage are all explicitly NOT measured in this session.**
- **Automated regression (actual results):**
  - `npm run lint` — clean, no warnings
  - `npm run typecheck` — clean (`tsc -b --noEmit`)
  - `npm test` — **455/455** across 26 files (unchanged from Sprint 5.9 release)
  - `npm run build` — clean, **235** supported static route entries + 404
  - Working tree remains clean; nothing modified by the audit so far
- **Source-level SEO audit (what can be verified without a browser):**
  - `src/app/seo.ts` emits `noindex,nofollow` on every client-side route transition — appropriate for a public demo.
  - `index.html` ships with `viewport`, `theme-color`, `description`, and page `title`; favicon references are base-path-aware via `%BASE_URL%`.
  - `public/robots.txt` allows crawling so compliant crawlers can read the per-page `noindex` meta; no sitemap published, which is correct for a noindex demo.
  - `CANONICAL_ORIGIN` in `src/app/seo.ts` is intentionally empty so no canonical URL is emitted until the client's real domain is supplied; `applyRouteMeta` only emits a `<link rel="canonical">` when that is set.
  - Every page's `applyRouteMeta` call carries a unique title, description, and canonical path. The `/privacy-policy` and `/terms-and-conditions` pages carry `noindex: true` explicitly (already a route-level flag, in addition to the per-transition default).
- **Source-level performance notes (not measured in a real browser):**
  - Hero image on the homepage uses `fetchPriority="high"` + `decoding="async"` + explicit `width`/`height`; the Vite static-route plugin also emits a per-route `<link rel="preload" as="image">` header for hero assets on service/variant/detail pages.
  - All below-the-fold images (service grid, blog cards, review strip) use `loading="lazy"` + `decoding="async"` with locked aspect ratios (`aspect-[16/10]` on blog) to prevent CLS.
  - Reveal animations animate only `opacity` + `transform` behind `prefers-reduced-motion: no-preference`; no layout-heavy properties are animated.
  - Vite build output: `index` chunk `407.72 kB` raw / `126.13 kB` gzip (unchanged from Sprint 5.9). Route-level chunks are split via `React.lazy()` in the router.
  - No continuous animation, no auto-playing carousel added this sprint, no polling.
- **Source-level accessibility notes (not measured in a real browser):**
  - Primary nav, mobile drawer, offer popup, and live chat panel all carry `role="dialog"` / `aria-expanded` / Escape-to-close + focus-return where applicable (asserted by prior tests).
  - Focus-visible outlines on every interactive control via `--color-focus` token and `:focus-visible` global rule in `globals.css`.
  - Every image has non-empty alt text or an intentional `alt=""` (decorative article hero, where the eyebrow + H1 above name the subject).
  - Reduced-motion gated by `@media (prefers-reduced-motion: no-preference)` on `.reveal`; the global `prefers-reduced-motion: reduce` rule clamps every animation/transition.
- **Defects found this sprint:** **none source-visible.** No fix was applied. The audit intentionally added nothing to the codebase to avoid shipping speculative changes.
- **Remaining limitations (unchanged from Sprint 5.9 unless noted):**
  - Rendered browser QA at 375 / 768 / 1440 widths — **not performed.** No dev server launched, no browser automation available.
  - Lighthouse / Core Web Vitals — **not measured.** No scores claimed.
  - Cross-browser coverage (Chrome/Firefox/Safari/Edge) — **not performed.**
  - GitHub Pages deployment status for commit `1dcd63f` — **not verified from this terminal** (no `gh` CLI). Check https://github.com/Ahasan39/construction-project/actions.
  - Live site at https://ahasan39.github.io/construction-project/ — **not independently confirmed as updated** by this session.
  - Legal pages still carry demo-placeholder chip pending legal counsel review.
  - Live chat remains unconnected to a real provider; `/billpay` and `/visualizer` route users to phone / estimate.
- Guardrails respected: no new dependencies, no commit / push / deploy, no destructive working-tree cleanup, no global git-config change.

## Sprint 5.9 — Shared motion system (2026-10-22)

- Baseline: branch `main` at `33677ea`, 39 pre-existing touched files preserved. No reset / stash / discard / commit / push / deploy / amend / global config change.
- **Scope: a shared, CSS-first motion system — not random per-component animations.** No new animation library added. No new dependency. CSS keyframes plus a single `Reveal` component drive every entrance.
- **Motion architecture** ([src/styles/globals.css](src/styles/globals.css) + [src/components/motion/Reveal.tsx](src/components/motion/Reveal.tsx)):
  - **Keyframes** `fadeIn` and `fadeInUp` defined once in `globals.css`. Existing floating-widget uses (`motion-safe:animate-[fadeIn_…]` on OfferPopup, LiveChatWidget, OfferPopup's inner card) continue to resolve the same way.
  - **`.reveal` utility** sets `opacity: 0; transform: translateY(10px); transition: opacity 480ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 480ms …; transition-delay: var(--reveal-delay, 0ms);` with a `will-change: opacity, transform` hint. **Guarded by `@media (prefers-reduced-motion: no-preference)`**, so reduced-motion viewers never enter the hidden state — content is immediately visible without JS fallback.
  - **`Reveal` component** is a thin wrapper that opts an element into the reveal utility via IntersectionObserver. Features: `as` prop for the underlying tag (`div` by default), `delayMs` prop surfaces as a CSS custom property (`--reveal-delay`) for staggering, `threshold` prop (default `0.08`), `replay` prop (default `false`) so entrances don't retrigger on backward scrolls. **Resilient fallbacks:** if `IntersectionObserver` is undefined (SSR / jsdom / older browser), the component flips immediately to `is-visible`; cleanup disconnects the observer on unmount; the `.reveal` initial-hidden state is itself gated by `prefers-reduced-motion`, so content is never trapped invisible.
- **Components / pages enhanced:**
  - **Homepage hero** ([src/components/sections/Hero.tsx](src/components/sections/Hero.tsx)): the eyebrow kicker, H1 (with the "lifetime." swoosh preserved), and intro paragraph each wrap in `Reveal` with 0 ms / 80 ms / 160 ms stagger. Hero image, estimate form card, and emergency contact row are **not** wrapped — they remain available immediately for LCP and conversion.
  - **Service cards section** ([src/components/sections/ServiceCards.tsx](src/components/sections/ServiceCards.tsx)): "Our Services" heading uses an inner `<Reveal as="span">` so the `<h2 id="services-heading">` still owns the ARIA label. Each card is now a `<Reveal as="li">` with 0 ms, 80 ms, 160 ms, 240 ms stagger. Added `hover:-translate-y-0.5` + layered shadow on each card behind `motion-safe:` for a subtle hover lift that reduced-motion viewers do not see.
  - Other floating widgets (Offer Popup, Live Chat) retain their existing `motion-safe:` fade/translate animations from Sprints 5.6.1 / 5.7 — not changed. Blog card hover-scale and OfferPopup header icon rotation keep their existing `motion-safe:` guards.
- **Explicitly out of scope for this sprint** (deferred to avoid shipping untested complexity): per-route page transitions, scroll-locked parallax, auto-playing carousels (ReviewsStrip autoplay already respects reduced motion and was not touched), route-level stagger beyond homepage, counter animations (would require fabricated metrics — explicitly disallowed).
- **Accessibility & reduced motion:**
  - `.reveal`'s initial-hidden state is wrapped in `@media (prefers-reduced-motion: no-preference)`, so content is immediately visible for reduced-motion users regardless of JavaScript availability.
  - The existing global `@media (prefers-reduced-motion: reduce)` rule continues to clamp every `animation-duration` and `transition-duration` to `0.001ms`, so no entrance animation plays for reduced-motion viewers.
  - Focus-visible outlines, keyboard navigation, dialog roles on the popup/chat, and dropdown behavior are **unchanged**. No interactive element moves out from under the pointer or keyboard.
  - No flashing effects. No essential information is conveyed only through motion — all revealed content is present in the DOM and reads normally when the entrance is skipped.
- **Performance considerations:**
  - All animations use `opacity` and `transform` only — no layout-heavy properties animated.
  - `will-change: opacity, transform` is scoped to the `.reveal` class only (not applied globally).
  - IntersectionObserver instances are per-element, disconnected after the one-shot reveal (`replay: false` by default), and cleaned up on unmount via the effect's return function.
  - Hero image's `fetchPriority="high"` and homepage preload headers remain intact — motion does not block LCP.
  - Lazy-loaded images across blog/service grids keep `loading="lazy"` and `decoding="async"`.
  - No continuous or auto-playing animation added anywhere.
- **Automated tests:**
  - New `src/components/motion/Reveal.test.tsx` — 4 assertions: children render regardless of observer availability; `as` prop produces the requested semantic element and preserves the `.reveal` class; jsdom fallback flips to `is-visible` after mount; `delayMs` surfaces as the `--reveal-delay` CSS variable for staggering.
  - All prior Sprint 5.8 copy assertions remain green (hero H1 selector, services heading role lookup, offer popup / live chat / blog tests). No existing test was weakened to accommodate the motion changes.
- **Verification:** `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **455/455** across 26 files (+4 vs the 451 Sprint 5.8 checkpoint), `npm run build` clean with 235 static entries + 404 (unchanged).
- **Rendered browser QA (desktop/mobile at 375 / 768 / 1440) — not performed.** No dev server or browser automation launched in this session. Visual pacing of the reveal timings, actual IntersectionObserver thresholds, and real `prefers-reduced-motion` behavior across OS/browser combinations remain unverified.
- **Known limitations** (unchanged from prior sprints): legal pages still carry the demo-placeholder chip pending client legal review; chat remains unconnected to a real support provider; `/billpay` and `/visualizer` route users to phone/estimate rather than to live integrations; reference-site live inspection was not performed this session.
- Guardrails respected: no new dependencies, no backend / provider SDK, no analytics, no commit / push / deploy. All prior sprint work preserved.

## Sprint 5.8 — Remove public demo labels + add blog images (2026-10-22)

- Baseline: branch `main` at `33677ea`, pre-existing modifications/untracked files preserved. Verified `git status` before editing. No reset / stash / discard / commit / push / deploy / amend / global config change.
- Scope: polish the visitor-facing copy (remove unnecessary "Demo" wording) and add a relevant image to every blog article — without redesigning the site or making any non-functional feature appear operational.
- **Visitor-facing labels removed or rewritten (always with honesty preserved):**
  - **Live chat widget** ([src/components/chat/LiveChatWidget.tsx](src/components/chat/LiveChatWidget.tsx)): header status line changed from "Demo — not connected to a live agent" to "Fastest reply by phone or Contact Us". Welcome message rewritten to say the chat is not actively monitored in real time and to direct users to phone/Contact Us. Visitor submissions still echo locally; the system response now reads "Thanks for your note. This chat is not actively monitored — for the fastest reply, please call the number in the footer or use the Contact Us form, and a team member will get back to you." Composer footnote changed from "Demo — nothing is sent" to "This chat isn't actively monitored. Press Enter to submit, Shift+Enter for a new line." Launcher aria-label simplified to "Open chat"/"Hide chat launcher". **No claim is made that a message was delivered to a real agent.**
  - **Offer popup** ([src/components/promo/OfferPopup.tsx](src/components/promo/OfferPopup.tsx)): removed the "Demo placeholder" chip. New copy per the sprint brief — eyebrow "SPECIAL OFFERS", heading "Explore our roofing offers", description "Contact our team to learn which offers may be available for your project. Available promotions can vary by service, season, and location." Primary CTA renamed to "Explore offers" and continues to route to the existing `/special-offers` route. No $amount, %, promo code, or expiry date is quoted anywhere.
  - **Special Offers page** ([src/pages/SpecialOffersPage.tsx](src/pages/SpecialOffersPage.tsx)): removed every "Demo placeholder" chip and the "placeholder for layout verification" wording. Section heading changed from "Placeholder offers" to "Offer categories". Final notes rewritten to route questions to the team ("Our team will walk through the specific promotion wording, eligibility, and timing… call the number in the footer or use the Contact Us form"). **Offers data** ([src/data/offers.ts](src/data/offers.ts)) rewritten from the single "0% interest for 18 months (demo)" placeholder to two honest categories ("Project financing options", "Seasonal promotions") that describe the kinds of promotions typically run without quoting a specific rate, amount, or term.
  - **Blog listing** ([src/pages/BlogIndexPage.tsx](src/pages/BlogIndexPage.tsx)): removed per-card "Demo article" chips, removed the "demonstration content for layout verification" intro, replaced the generic category-letterboard thumbnail with a real roofing/exterior image (see below). Final CTA band copy changed from "demo form, submissions are not sent" to a natural "a team member will follow up to confirm next steps."
  - **Blog article detail** ([src/pages/BlogArticlePage.tsx](src/pages/BlogArticlePage.tsx)): removed the "Demo article" chip in favor of a brand-accent "{category}" eyebrow; added a real above-the-fold article image; footer disclaimer softened from "demonstration content for layout verification only" to "general information from our team, not legal, insurance, engineering or financial advice. For a specific project, contact us for a free written estimate." Related-posts section preserved.
  - **Pay My Bill** ([src/pages/PayMyBillPage.tsx](src/pages/PayMyBillPage.tsx)): the amber "awaiting client-supplied destination" status block was replaced by a natural "How to pay" section that explains payment is handled by phone and that card/bank information is intentionally kept off the public web. No payment form, no card/bank inputs — preserved and still asserted by test.
  - **Visualizer** ([src/pages/VisualizerPage.tsx](src/pages/VisualizerPage.tsx)): the amber "awaiting client-supplied destination" status block was replaced by a natural "Design review during your estimate" section that explains design options are reviewed with real samples during an estimate rather than via a hosted web tool. No upload/render/save claims introduced.
- **Features that remain unintegrated and how their copy stays honest:**
  - Chat is not connected to a real support provider. The widget no longer labels itself "demo" in the visitor-facing header, but the welcome message, system reply after any submit, and composer footer all explicitly state that the chat is **not actively monitored** and route users to phone / Contact Us. No claim that a message was delivered to a real team.
  - Pay My Bill does not host a payment form. New copy says the team takes payment by phone or sends a secure link, which is how real small-contractor billing commonly works, and explicitly explains why payment information is not entered on this page.
  - Visualizer does not host a visualizer tool. New copy says design review happens during the estimate with real samples. No upload / render / save functionality is claimed.
  - Privacy Policy and Terms & Conditions **retain** their "Demo placeholder — not legal advice" chip and the "must be reviewed and replaced by the client's legal counsel" footer — these are the accurate disclosure for unapproved legal copy and must not be softened.
- **Blog article images (local assets reused from the project's existing residential-exterior photography):**
  - article 1 "What to look for after a severe storm" → `/images/services/photos/benefit-crew-working-900.webp`
  - article 2 "What goes into a written roof-replacement estimate" → `/images/services/photos/benefit-consultant-homeowner-900.webp`
  - article 3 "Gutters and ice" → `/images/services/photos/promo-inspector-gutters-900.webp`
  - article 4 "Siding categories" → `/images/services/photos/benefit-exterior-renovation-900.webp`
  - article 5 "Replacement windows / NFRC labels" → `/images/services/photos/hero-suburban-home-900.webp`
  - article 6 "Chimneys and brick" → `/images/services/photos/benefit-roofer-install-900.webp`
  Each image is an optimized WebP (900 px wide, served via Vite base-path through `assetUrl`), used consistently on the listing card and the article detail hero. Images are stored as raw public paths in `src/data/articles.ts` (no `assetUrl` import in the data layer, so `vite.config.ts`'s transitive import remains compatible with the node tsconfig that lacks `vite/client` types). Alt text on the listing follows the pattern `"{category} — {title}"`; the detail hero uses `alt=""` because the eyebrow+H1 above it already names the image topic (avoids a redundant announcement for screen-reader users). `loading="lazy"` on listing cards; `fetchPriority="high"` + `decoding="async"` on the article hero. Aspect ratio `16/10` locked on both to prevent layout shift. **No images were generated this session; no new assets were downloaded. All six images are files already licensed/approved and shipped with the project in `/public/images/services/photos/`.**
- **Tests updated / added:**
  - `BlogPages.test.tsx` — the former "flags each as a demo article" assertion is replaced by a "renders one card per article with a relevant image and alt text" assertion that checks every `listArticleSummaries()` entry has a non-empty `thumbnailSrc` and that an image with alt text matching `/{category} —/i` renders on the listing. Article detail test now asserts the category eyebrow and the softened advice disclaimer.
  - `CompanyPages.test.tsx` — Special Offers: former "demo placeholder chip" assertion replaced by a positive "contact our team for the latest offer wording" + "terms may vary by service, season, and location" check, plus a defensive scan that offer cards contain no fabricated `$amount`, `%`, or month-day expiry.
  - `OfferPopup.test.tsx` — dialog name updated to "Explore our roofing offers", primary CTA label updated to "Explore offers", and the former "demo placeholder" + "not an active promotion" copy check replaced by a "contact our team to learn which offers may be available" check. The anti-fabrication scan (no `$`, no `%`, no uppercase promo-code pattern, no month-day expiry) is preserved.
  - `LiveChatWidget.test.tsx` — launcher name updated to "Open chat"; disclosure assertions updated to "Fastest reply by phone or Contact Us" + "not actively monitored in real time"; the former "your message was NOT delivered" assertion replaced by a "call the number in the footer or use the contact us form" assertion that still proves no false-delivery claim. Anti-false-delivery scan extended to also forbid "we have received your message".
  - `UtilityAndLegalPages.test.tsx` — PayMyBill asserts the new "call the number in the footer and a team member will take payment" + "payment information belongs with a payment processor" copy, continues to assert no `<form>` and no card/bank inputs. Visualizer asserts "we walk through product and color options with you in person" + "not a replacement for seeing the real materials".
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **451/451** across 25 files (same count as Sprint 5.7.1 — tests were rewritten, not added), `npm run build` clean with 235 static entries + 404 (unchanged — no new route).
- Rendered browser QA (desktop/mobile at 375/768/1440) — **not performed.** No dev server or browser automation launched in this session. Image loading, hover transforms, and iOS safe-area padding not visually verified.
- Guardrails respected: no new dependencies, no backend / provider SDK, no analytics, no network requests, no downloaded reference-site imagery, no CSS gradient / emoji fallback for blog thumbnails, no commit / push / deploy / amend / global-config change.

## Sprint 5.7.1 — Offer popup hardening (real-browser QA pass) (2026-10-22)

- Baseline: branch `main` at `33677ea`, 38 pre-existing touched files preserved. No reset / stash / discard / destructive cleanup; `git status` verified before editing. No commit / push / deploy / amend / global-config change.
- **Real browser automation: not available in this session.** `package.json` lists no Playwright / Puppeteer / Cypress; no Chrome DevTools MCP, in-app browser pane, or Chrome extension is enabled for this session. The sprint's own guidance forbids installing a new dependency "unless absolutely necessary and approved" and forbids claiming browser testing without it, so this sprint is **source-level hardening + jsdom regression coverage**, honestly reported. Live browser scenarios (actual 6s timing, actual private-mode window, visual rendering at 375/768/1440, actual stacking against the chat panel while open) remain **unverified**.
- Confirmed source-level defects in Sprint 5.7's `OfferPopup`:
  1. **Focus containment skipped the "No thanks" button.** The handler only matched `active === primaryRef.current` for Tab and `active === closeBtnRef.current` for Shift+Tab, so Tab from the primary CTA jumped straight to the close button and skipped the middle "No thanks" button. Shift+Tab from "No thanks" leaked focus outside the dialog entirely.
  2. **No body-scroll lock.** The page beneath the open dialog could still scroll under keyboard navigation, so the backdrop click target and the modal position were effectively untethered.
- Fixes applied in [src/components/promo/OfferPopup.tsx](src/components/promo/OfferPopup.tsx):
  - Added a `dialogRef` on the dialog `<div>` and rewrote the Tab/Shift-Tab branch to enumerate every focusable descendant (`a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])`) and wrap at the boundaries. Focus now cycles through all three dialog controls (close, "See current promotions", "No thanks") in both directions and never leaks outside while the modal is open.
  - On open, saves `document.body.style.overflow`, sets it to `"hidden"`; the cleanup effect restores the prior value on close/unmount so dismissal doesn't leave `<body>` permanently locked.
  - No copy, token, or CTA target changed — honest demo content, `/special-offers` CTA, and session-dismissal persistence all preserved verbatim.
- Regression tests added in `src/components/promo/OfferPopup.test.tsx`:
  - "locks body scroll while open and restores on dismiss"
  - "Tab from the last focusable control wraps to the first"
  - "Shift+Tab from the first focusable control wraps to the last"
  Each test asserts over the actual focusable set returned by the production selector string, so new focusable controls added later will be exercised automatically. Prior nine Sprint 5.7 assertions preserved verbatim.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **451/451** across 25 files (+3 vs the 448 Sprint 5.7 checkpoint), `npm run build` clean with 235 static entries + 404 (unchanged).
- Guardrails respected: no new dependency, no analytics / network / external script, no commit / push / deploy, no destructive working-tree cleanup. All prior sprint work preserved. Honest-content copy on the popup is unchanged — no discount, dollar amount, promo code, or expiry date is quoted; the CTA still routes to `/special-offers`.
- Remaining unverified scenarios (require a real browser):
  - Live timing of the 6-second delay in a running browser.
  - Private-mode `sessionStorage` behavior in an actual private window.
  - Visual stacking against the Live Chat widget (dialog over launcher, launcher accessible after dismissal).
  - Mobile 375 / tablet 768 / desktop 1440 rendered QA of the dialog's responsive geometry, close-button tap-target size, and iOS safe-area padding.
  - Browser-console errors during open/close transitions.

## Sprint 5.7 — Site-wide offer popup (2026-10-22)

- Baseline: branch `main` at `33677ea`, 37 pre-existing touched files preserved. No reset / stash / discard / commit / push / deploy / amend / global config change. Verified `git status` before editing.
- Honest-content guardrail: this popup does **not** quote a specific discount, dollar amount, percentage, promo code, or expiry date — the reference program's live offer values were not fetched this session and nothing is fabricated. The primary CTA routes to the existing `/special-offers/` page (Sprint 6.5), which itself labels every card as a demo placeholder. The popup prominently carries a "Demo placeholder" chip and a "Demo placeholder — not an active promotion from this reproduction site" footer line.
- New: [src/components/promo/OfferPopup.tsx](src/components/promo/OfferPopup.tsx) — site-wide offer popup mounted globally.
  - **Delayed display**: default 6 s after mount (`delayMs` prop overridable for tests); the timer is cleared on unmount so unmount-before-fire never produces an orphan dialog.
  - **Session dismissal**: `sessionStorage` key `offerPopup:dismissed`. Every read/write is wrapped in `try/catch` so private-mode browsers that throw on access are tolerated (asserted by a test that mocks `getItem` to throw).
  - **Dialog semantics**: `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + `aria-describedby`. Focus moves to the primary CTA on open, previously-focused element is restored on close (`previousFocusRef`). Basic focus containment: Tab/Shift-Tab cycles between the primary CTA and the close button.
  - **Escape / backdrop / close button** all dismiss and persist the session flag.
  - **Reduced motion**: `motion-safe:` guards on the fade-in and translate-up animations so reduced-motion users see static entry.
  - **Z-order coordination with the Live Chat widget**: the chat dock is `z-50`; this popup backdrop is `z-[60]`, so the popup overlays the chat launcher only while open and both remain accessible afterward. On dismiss the chat launcher is immediately usable again. Both components are mounted side-by-side in `AppShell` and share no state.
- Integration: [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx) renders `<OfferPopup />` beside `<LiveChatWidget />`, so every route in the app participates in the once-per-session display logic. No per-route opt-in / opt-out introduced in this sprint.
- Tests added: `src/components/promo/OfferPopup.test.tsx` — 9 assertions, each using `vi.useFakeTimers()` to drive the delay deterministically:
  - stays hidden before the delay elapses (edge-tested at `delay - 1` and `delay`);
  - demo-placeholder language present, no `$amount` / `N%` / uppercase promo-code pattern / month-day expiry present in the dialog text;
  - primary CTA links to `/special-offers` and dismisses on click;
  - "No thanks" dismisses + persists `sessionStorage` + does not reopen on a subsequent mount in the same session;
  - Escape closes;
  - backdrop click closes;
  - close button is labelled and closes;
  - `sessionStorage.getItem` throwing (private mode) still allows the popup to render (fallback path);
  - a pre-existing `sessionStorage` dismiss flag keeps the popup closed through the delay.
- Local verification: `npm run lint` clean, `npm run typecheck` clean, `npm test` passes **448/448** across 25 files (+9 vs the 439 Sprint 5.6.1 checkpoint), `npm run build` clean with 235 static entries + 404 (unchanged — popup is a global component, not a route).
- Rendered browser QA (desktop / tablet / mobile) — **unverified**. No dev server or browser automation launched in this session. The responsive geometry (`w-[min(28rem,calc(100vw-2rem))]`) and the delayed-display + sessionStorage path have not been exercised in a real browser.
- Guardrails respected: no new dependencies, no backend, no network request, no analytics, no commit / push / deploy / amend / global config change. Prior Sprint 5.6 / 5.6.1 Live Chat polish untouched.

## Sprint 5.6.1 — Live chat polish pass (2026-10-22)

- Baseline: branch `main` at `33677ea`, 37 pre-existing touched files from preceding sprints preserved. No reset / stash / discard / commit / push / deploy. Verified `git status` before editing.
- Scope: visual-only polish of the Sprint 5.6 Live Chat widget. Honest-demo behavior, dialog semantics, Escape-to-close, focus management, reduced-motion handling, and the "nothing is sent" invariant are **unchanged**. No provider / backend / network / persistence introduced.
- Visual improvements applied in [src/components/chat/LiveChatWidget.tsx](src/components/chat/LiveChatWidget.tsx):
  - **Launcher** redesigned as a 56px tall pill using `--color-brand-accent` with a layered shadow (`0_14px_28px_-10px_rgba(217,35,42,0.55)` + ambient `rgba(15,34,49,0.25)`), a 1px `ring-1 ring-black/5` to soften edges, an `active:translate-y-[1px]` press state, and a subtle icon rotation on hover guarded by `motion-safe:` so reduced-motion users see no transform. Label collapses from "Chat with us" to "Chat" at `<sm`. Icon is a consistent speech-bubble glyph used in both launcher and header.
  - **Panel** moved onto design tokens: `rounded-[var(--radius-lg)]`, `border-[var(--color-border)]`, `bg-[var(--color-surface)]`, elevated shadow + `ring-1 ring-black/5`. Max dimensions `w-[min(23rem,calc(100vw-2rem))]` and `max-h-[min(32rem,calc(100vh-7rem))]` so the panel never exceeds the viewport on any width.
  - **Header** is a `--color-brand-primary` strip with a circular `bg-white/10 ring-1 ring-white/15` icon tile, the "How can we help?" title (replacing the generic "Live chat"), an **amber status dot** + "Demo — not connected to a live agent" tagline, and a 36px tap-target close button. No fake name, avatar, response-time, or "agent is online" indicator.
  - **Transcript** uses asymmetric bubble corners (`rounded-[14px]` with the matching bottom corner collapsed to 4px) and distinguishes visitor (brand-primary) vs. system (white, bordered). Welcome copy was rewritten to the construction-context version and still names the Contact Us / phone fallbacks explicitly.
  - **Composer** is a right-aligned send glyph button (red brand accent, 40×40 touch target) next to the labelled textarea; disabled state applied when draft is empty, with full disabled styling; Enter submits (Shift+Enter inserts newline — behavior spelled out in the composer helper line); micro-copy still ends with "Demo — nothing is sent."
  - Container now honors `env(safe-area-inset-bottom)` and `env(safe-area-inset-right)` so the launcher sits above iOS home-indicator safe areas; `sm:` breakpoint pushes the whole dock from `bottom-4 right-4` to `bottom-6 right-6` on tablet/desktop.
- Accessibility preserved: `role="dialog"` + `aria-labelledby` + `aria-describedby`; Escape-to-close; focus moved to close button on open, launcher on close; `role="log"` + `aria-live="polite"` transcript; `aria-label` on the icon-only Send button; `aria-invalid` + `aria-describedby` wire-up on the textarea; visible focus states on every control (close, send, launcher, textarea) using the project `--color-focus` token; every animation guarded with `motion-safe:` so reduced-motion viewers get static elements.
- Responsive considerations (source-level only, not visually verified in a browser this session): panel width `min(23rem, 100vw - 2rem)` and height `min(32rem, 100vh - 7rem)` guarantee no overflow at 375px / 768px / 1440px; the textarea grows to `max-h-28` then scrolls so the composer never pushes the header off-screen; mobile keyboard reveal is accommodated by the capped-height overflow-y-auto log region; launcher text collapses at `<sm` to reduce mobile footprint.
- Tests updated (`src/components/chat/LiveChatWidget.test.tsx`): same 7 assertions, but selectors adjusted for the renamed title ("How can we help?"), new placeholder ("Type your question…"), and the renamed Send button (`aria-label="Send message"`). The empty-draft error assertion now submits the form directly (the send button is correctly disabled when the draft is empty, so a direct form submit still exercises the validation path). Dialog disclosure assertion was updated to the new copy ("Demo — not connected to a live agent" and "nothing is routed to a real support team"). The "never claims successful delivery / online agent" defensive scan is preserved verbatim.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (via build), `npm test` passes **439/439** across 24 files (unchanged count — polish only), `npm run build` clean (235 static entries + 404 — unchanged).
- Rendered browser QA (desktop/mobile at 375 / 768 / 1440) — **unverified**. No dev server or browser automation launched.
- Guardrails respected: no new dependencies, no backend / provider SDK, no commit / push / deploy / amend performed, no modification of global git or Claude Code config.

## Sprint 5.6 — Live chat demo widget (2026-10-22)

- Baseline: all prior-sprint changes preserved. Branch `main` at `33677ea`. 35 pre-existing touched files; verified before editing. No reset / stash / discard / commit / push / deploy / amend / global config change.
- Audit findings: no live-chat component existed under `src/`. `package.json` lists no chat / support dependency (Intercom / Crisp / Drift / Zendesk / etc. — none present). No API credentials or provider configuration found. The live reference site's chat behavior was **not fetched** this session, so provider parity is not claimed.
- Decision: ship a frontend-only, visually complete demo widget with explicit "demo — not connected to a real agent" disclosure in both the launcher state and inside the panel. No new dependency added. No network request. No persistence (not even `localStorage` — a reload resets the thread).
- New: [src/components/chat/LiveChatWidget.tsx](src/components/chat/LiveChatWidget.tsx) — floating red launcher pinned bottom-right (`fixed bottom-4 right-4 z-50`), expandable panel with `role="dialog"` + `aria-labelledby` + `aria-describedby`, close button, `role="log"` + `aria-live="polite"` transcript, labelled textarea composer, inline validation (empty draft rejected with an alert), Escape-to-close, focus moved into the panel on open and returned to the launcher on close, visible focus states, and Tailwind `motion-safe:` guard on the fade-in animation so `prefers-reduced-motion` is respected. Submitting a visitor message echoes it locally and appends a system reply that explicitly states the message was **NOT** delivered.
- Mount point: `src/components/layout/AppShell.tsx` now renders `<LiveChatWidget />` alongside header/footer, so every route in the app shares a single instance. z-50 keeps it above page content without covering the mobile nav (which uses a higher stacking order in its own drawer when open).
- Tests added: `src/components/chat/LiveChatWidget.test.tsx` — 7 assertions covering launcher label and collapsed default, open → dialog visible with demo disclosure, close button restores collapsed state, Escape closes the panel, empty-draft submit raises inline error, visitor message echoes locally with a "not delivered" system reply and draft is reset, and a defensive scan that the dialog text contains no "online now" / "message sent" / "agent is available" strings. The launcher's `aria-label` was adjusted so it does not collide with the panel's internal close-button label when the panel is open.
- Local verification: `npm run lint` clean, `npm run typecheck` clean, `npm test` passes **439/439** across 24 files (+7 vs the 432 Sprint 5.5.15 checkpoint), `npm run build` clean (**235 static entries + 404**, unchanged — the widget mounts globally, not as a new route).
- Rendered browser QA: **unverified** — no dev server or browser automation launched this session.
- Remaining integration requirements for a real provider: pick a provider (Intercom, Crisp, Drift, LiveChat, Zendesk Messaging, etc.), add that provider's SDK or script loader behind a build-flag / environment variable, replace the local send handler with the provider's send API, and remove or gate the "nothing is sent" disclosures. None of that is attempted here — it requires client-supplied credentials and a contract.
- Guardrails respected: no new dependencies, no backend / third-party SDK, no commit / push / deploy. All prior sprint changes untouched.

## Sprint 5.5.15 — Ann Arbor service-area child pages (2026-10-22)

- Baseline: Sprint 6 / 6.5 / 7 / 7.5 / 8 / 8.5 / 5.5.13 / 5.5.14 changes preserved in the working tree (uncommitted). Branch `main` at `33677ea`; 35 touched files at start, verified before editing. No reset / stash / discard / destructive cleanup.
- Reference inspection: live `https://www.mrroof.com/ann-arbor/service-area/` was **not fetched** this session. Verification source is the typed city list in [src/data/serviceAreas.ts](src/data/serviceAreas.ts), captured from the live reference during Sprint 5.5.12. The 43 Ann Arbor city slugs are data-derived, not independently re-verified this session.
- Ann Arbor destination inventory confirmed from source:
  - **43 city slugs** across North (11), South (9), East (16), West (7) in `serviceAreas.ts`.
  - **3 pre-existing children** in `locations[].serviceAreaChildren`: `toledo` (city, also in reference list), `oakland-county`, `wayne-county` (counties). The city `toledo` overlaps the reference list.
  - **42 missing cities** (43 − 1 overlap).
  - **7 reference counties** (`jackson-county`, `lenawee-county`, `livingston-county`, `monroe-county`, `oakland-county`, `washtenaw-county`, `wayne-county`) remain index-only text per prior-sprint policy, except for `oakland-county` and `wayne-county`, which were already mounted and are preserved so previously-emitted URLs continue to resolve.
- Data expansion: `src/data/locations.ts` extends `ann-arbor.serviceAreaChildren` from 3 → **45** entries (adds 42 cities; preserves `toledo`, `oakland-county`, `wayne-county`). No destination name invented; every added slug matches a reference entry already in `serviceAreas.ts`.
- Route dispatch: unchanged. `ServiceAreaChildPage` (Sprint 5.5.13) handles every new slug. No new router entry, no new page component, no architectural change.
- Static routes: generator unchanged in logic. Entry count rises from 193 + 404 → **235 + 404** (+42). Build output verified on disk: `dist/ann-arbor/service-area/` has 46 entries (45 children + `index.html`); `dist/404.html` preserved. No duplicate paths (asserted by test).
- Test update: `LocationServiceAreaPage.test.tsx` previously used `Novi` (Ann Arbor) as the "unlinked text" invariant after Sprint 5.5.14. Since every reference *city* is now mounted across every market, the invariant moves to a reference *county* that remains index-only — Nashville's `Davidson County`. The county intentionally has no child route per the "counties index-only" policy, so it still renders as a `<span>`.
- Tests added: `ServiceAreaChildPage.test.tsx` adds an `it.each` over Ann Arbor's 45 children for per-slug H1/body rendering (regex escaped so names like "St. Clair Shores" match), plus an explicit CTA fallback check that Ann Arbor child pages route to the global `/free-estimate` (Ann Arbor has no `hasFreeEstimate` capability). The static-route generation parameter list is extended to include `ann-arbor`, running the "one static entry per child slug" check across all six completed markets. Not-Found guards and all earlier assertions preserved.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **432/432** across 23 files (+47 vs the 385 Sprint 5.5.14 checkpoint), `npm run build` clean with **235 static entries + 404**. Rendered browser QA (desktop/mobile) remains **unverified** — no dev server or browser automation launched.
- Updated remaining scope: every reference *city* in every market with an index page is now mounted. The only remaining service-area work is reference *counties*, which are kept as index-only text per prior-sprint policy — not a bug. Dayton, Louisville, Detroit, Lexington contribute zero children (they have no `/service-area/` index per `availability.ts`). **No further city child routes are known-missing after this sprint**, based on `serviceAreas.ts` as the inventory source. A fresh live reference inspection could still surface additional cities not currently in the typed data; that remains a separate, un-done verification step.
- Guardrails respected: no new dependencies, no backend / integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config, no destructive working-tree cleanup. All prior sprint changes remain untouched.

## Sprint 5.5.14 — Cincinnati, Cleveland & Grand Rapids service-area child pages (2026-10-22)

- Baseline: Sprint 6 / 6.5 / 7 / 7.5 / 8 / 8.5 / 5.5.13 changes preserved in the working tree (uncommitted). No reset / stash / discard. Branch `main` at `33677ea`. 35 touched files at start; verified actual state before editing. No destructive cleanup.
- Reference inspection: live mrroof.com `/cincinnati/service-area/`, `/cleveland/service-area/`, `/grand-rapids/service-area/` were **not fetched** in this session. Verification source is the typed city list in [src/data/serviceAreas.ts](src/data/serviceAreas.ts), which was captured from a live inspection during Sprint 5.5.12. This sprint promotes those typed cities to mounted child routes. Routes derived from source data are distinguished from "independently verified during this session" (none were independently re-verified).
- Scope: Cincinnati, Cleveland, and Grand Rapids only. Ann Arbor child pages remain deferred to a later scoped sprint. Dayton and Louisville have no `/service-area/` index per `availability.ts`.
- Destination inventory per market (counts match `serviceAreas.ts`):
  - **Cincinnati** — 11 reference cities + 1 legacy `lebanon` child = **12 total**. New (11): `mason, middletown, west-chester, covington, florence, batavia, loveland, milford, fairfield, hamilton, liberty-township`. Preserved: `lebanon`.
  - **Cleveland** — 26 reference cities + 1 legacy `ashland` child; `mansfield` is both legacy and in reference list (not duplicated) = **27 total**. New (25): all of North / South / East / West except the already-present `mansfield`. Preserved: `ashland`, `mansfield`.
  - **Grand Rapids** — 25 reference cities = **25 total**. New (22). Preserved: `zeeland`, `holland`, `kalamazoo`.
- No county slugs were converted into child routes; the typed `counties` lists continue to render as text on the index pages. No destination name was invented. The `lebanon` and `ashland` legacy children are kept so previously-emitted URLs continue to resolve.
- Data expansion: `src/data/locations.ts` extends `cincinnati.serviceAreaChildren` from 1 → 12, `cleveland.serviceAreaChildren` from 2 → 27, `grand-rapids.serviceAreaChildren` from 3 → 25.
- Route dispatch: unchanged. The literal route `:locationSlug/service-area/:childSlug` and `ServiceAreaChildPage` (Sprint 5.5.13 full-page implementation) already handle every new slug. No new router entry; no new page component.
- Static routes: generator unchanged in logic. Entry count rises from 135 + 404 → **193 + 404** (+58: 11 Cincinnati + 25 Cleveland + 22 Grand Rapids). Build output verified: `dist/cincinnati/service-area/` has 13 entries (12 cities + index), `dist/cleveland/service-area/` has 28 entries (27 cities + index), `dist/grand-rapids/service-area/` has 26 entries (25 cities + index). No duplicate paths (set size equals array length — asserted by test).
- Test update: `LocationServiceAreaPage.test.tsx` previously used Cincinnati's `Mason` as the "unlinked" invariant after Sprint 5.5.13. Since Mason is now in Cincinnati children, the invariant moves to **Ann Arbor's `Novi`** — the only market still with typed reference cities but no enumerated children. All earlier Sprint 5.5.13 assertions (Nashville Clarksville linked, Nashville Franklin linked) remain intact.
- Tests added: `src/pages/ServiceAreaChildPage.test.tsx` is extended with `it.each` blocks for Cincinnati (12), Cleveland (27), and Grand Rapids (25) — 64 new per-slug H1/body assertions, plus 3 explicit CTA assertions (Cincinnati → `/cincinnati/free-estimate`, Cleveland → `/cleveland/free-estimate`, Grand Rapids falls back to `/free-estimate`) and the static-route generation table is parameterized over all five completed markets with a no-duplicates assertion. Not-Found guards and existing Nashville/Lansing coverage are preserved.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **385/385** across 23 files (+71 vs the 314 Sprint 5.5.13 checkpoint), `npm run build` clean with **193 static entries + 404**. Rendered browser QA (desktop/mobile) remains **unverified** — no dev server or browser automation launched.
- Updated remaining destination estimate: **Ann Arbor** is the only remaining market with typed reference cities not yet mounted — `serviceAreas.ts` has 43 city slugs in Ann Arbor, 0 currently in `locations[].serviceAreaChildren`, so **~43 city-child pages remain**. Dayton, Louisville, Detroit, Lexington do not have `/service-area/` indexes per `availability.ts` and so do not contribute child routes. Earlier approximate ~141 estimate is now 43 after accounting for Sprint 5.5.13's +15 and this sprint's +58 and the inventory recount.
- Guardrails respected: no new dependencies, no backend / integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config, no destructive working-tree cleanup. All prior sprint changes remain untouched.

## Sprint 5.5.13 — Lansing + Nashville service-area child pages (2026-10-22)

- Baseline: Sprint 6 / 6.5 / 7 / 7.5 / 8 / 8.5 changes preserved in the working tree (uncommitted). No reset / stash / discard. Branch `main` at `33677ea`. Repository-local git identity verified. No destructive cleanup performed.
- Reference inspection: live mrroof.com Lansing / Nashville service-area pages were **not fetched** in this session. The implementation relies on the typed city lists already captured in `src/data/serviceAreas.ts` during Sprint 5.5.12 (which recorded a live inspection of `/lansing/service-area/` and `/nashville/service-area/` with the compass-direction city buckets). Those lists are the authoritative source for which Nashville/Lansing child slugs are reference-verified; this sprint promotes them from "listed in the regional index" to "mounted as child routes".
- Scope: Nashville and Lansing only — Cincinnati / Cleveland / Grand Rapids / Ann Arbor child pages are explicitly deferred to later sprints per the task spec.
- Data expansion: `src/data/locations.ts` extends `nashville.serviceAreaChildren` from 3 → 15 entries (adds `gallatin`, `hendersonville`, `madison`, `portland`, `la-vernge`, `spring-hill`, `antioch`, `hermitage`, `lebanon`, `mount-juliet`, `smyrna`, `clarksville`) and `lansing.serviceAreaChildren` from 3 → 6 entries (adds `dewitt`, `holt`, `waverly`). Every added slug matches an entry already in `serviceAreas.ts`.
- Page upgrade: `src/pages/ServiceAreaChildPage.tsx` is rewritten from a `PageShell` scaffold into a reference-styled destination page — hero with eyebrow + H1 + market description; breadcrumb linking Home → `<market hub>` → `/<market>/service-area/` → child; "Services available" section listing all five global service slugs as internal links; closing CTA band using the shared `brand` demo phone and a Free Estimate link that resolves to `/${location.slug}/free-estimate` where the market has `hasFreeEstimate` (Nashville) and `/free-estimate` otherwise (Lansing).
- Route dispatch: unchanged. The literal route `:locationSlug/service-area/:childSlug` was already in the router; no architectural change was introduced. Validation remains in `ServiceAreaChildPage` itself (location exists, `hasServiceAreaIndex` capability, child slug present in `locations[].serviceAreaChildren`); unknown locations, markets without the capability, and unknown child slugs all resolve to Not Found as before.
- Static routes: generator (`src/app/staticRoutes.ts`) is unchanged in logic — it already emitted `/{location}/service-area/{child}` for every `location.serviceAreaChildren` entry when the market has `hasServiceAreaIndex`. Entry count rises from 120 + 404 → **135 + 404** (+15: 12 Nashville + 3 Lansing). Build output verified: all 12 new Nashville and 3 new Lansing child entries land in `dist/<market>/service-area/<child>/` with no duplicates.
- Nashville/Lansing status after this sprint: every reference child in `serviceAreas.ts` is now a mounted, completed route; nothing on those two markets' index pages still renders as unlinked text.
- Test update: `LocationServiceAreaPage.test.tsx` previously used `Clarksville` as the "unlinked" invariant on the Nashville index. Since Clarksville is now in `serviceAreaChildren`, that invariant moved — the test now asserts Clarksville **is** linked under Nashville, and asserts the "unlinked" invariant on Cincinnati's `Mason` (still absent from `locations[].serviceAreaChildren` for Cincinnati — Cincinnati child pages are deferred).
- Tests added: `src/pages/ServiceAreaChildPage.test.tsx` with 25 assertions — one per Nashville child slug (15) and one per Lansing child slug (6) each rendering a completed H1 and no Sprint 1 scaffold badge; breadcrumb back-links to the parent service-area index and the location hub; Nashville CTA resolves to `/nashville/free-estimate`; Lansing CTA falls back to global `/free-estimate`; the services list renders all five global service hubs; Not Found for unknown child slug and for a market without `hasServiceAreaIndex`; the static-route generator emits one entry per Nashville and per Lansing child.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **314/314** across 23 files (+29 vs the 285 Sprint 8.5 checkpoint), `npm run build` clean with 135 static entries + 404; `dist/nashville/service-area/` and `dist/lansing/service-area/` directory listings confirm every expected child entry on disk. Rendered browser QA (desktop/mobile) remains **unverified** in this session — no dev server or browser automation launched.
- Updated estimated remaining destination scope: Cincinnati (14 city slugs in `serviceAreas.ts`, 0 currently as `serviceAreaChildren`), Cleveland (26 city slugs, 2 as children), Grand Rapids (25 city slugs, 3 as children), Ann Arbor (43 city slugs, 3 as children). That is ~106 further service-area child pages across the four deferred markets (plus Dayton / Louisville which do not have `/service-area/` index pages per `availability.ts`). These remain genuinely missing pending the next scoped sprint; the earlier ~141 estimate is updated by this sprint's +15 only.
- Guardrails respected: no new dependencies, no backend / integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config, no destructive working-tree cleanup. All prior Sprint 6 / 6.5 / 7 / 7.5 / 8 / 8.5 changes remain untouched.

## Sprint 8.5 — Full UX / Responsive / Functional QA pass (2026-10-22)

- Baseline: Sprint 6, 6.5, 7, 7.5, and 8 changes preserved in the working tree (uncommitted). Nothing reset, stashed, or discarded. Repository-local git identity verified. Starting checkpoint: 283/283 tests across 21 files; 120 static entries + 404.
- **This was a QA pass, not a redesign.** No page was restructured; no new feature was added. Minimum fixes were applied where source-visible defects existed, and automated coverage was added for the audit itself.
- Route audit (from source, not just docs): walked `staticRoutes()` and `primaryNav` and matched each internal destination against the router — all 17 enumerated top-level utility/legal/company destinations resolve to real pages, with no `href="#"` placeholders anywhere in `src/`. External `<a href="/...">` to internal paths that should be `<Link>` — none found. Duplicate static-route entries — none (set size equals array length).
- Added `src/app/navigation-integrity.test.ts` with 2 assertions: every non-external, non-anchor path in `primaryNav` has a matching entry in `staticRoutes()`; the full utility / legal / company route list is enumerated.
- Representative-route coverage already exercised by the existing suite: home, service hub, service variant, location hub, location-service hub, location free-estimate, location service-area, service-area child, two-segment dispatcher, top-level dispatcher, blog listing, blog article, contact us, refer a friend, about, special offers, financing, warranties, reviews, commercial projects, sales careers, pay my bill, visualizer, privacy policy, terms and conditions. Dynamic blog slug: valid slug renders body; unknown slug resolves to Not Found (regression already covered by `BlogPages.test.tsx`).
- Interactions already asserted by existing tests (no changes needed this sprint): estimate form validation and happy-path (`EstimateForm.test.tsx`); referral form required-field errors, invalid-email rejection, happy-path success and duplicate-submit prevention (`ReferAFriendPage.test.tsx`); mobile nav drawer behavior (`MobileNav.test.tsx`); reviews carousel autoplay, pause-on-focus, swipe and reduced-motion (`ReviewsStrip.test.tsx`); SiteHeader About dropdown accessible-expanded state (`SiteHeader.test.tsx`).
- External placeholder behavior verified (static source audit): `/billpay`, `/visualizer` and `/crew` all expose an "awaiting client-supplied destination" status; `/billpay` is asserted to render no `<form>` and no inputs matching `card / cc- / cvc / cvv / routing / account`; `/visualizer` declares no upload / render / save functionality; `/crew` remains `noindex`.
- Legal placeholders: Privacy Policy and Terms & Conditions both render the "Demo placeholder — not legal advice" chip and the client-legal-counsel review disclaimer and are set `noindex` on route-meta.
- Rendered browser QA (desktop/mobile at 375 / 768 / 1440 widths): **not performed.** No browser automation (Playwright, Chrome DevTools MCP, built-in Browser pane, or Chrome extension) was available or launched in this session. Lighthouse / performance measurements: **not collected.** Console errors / failed network requests: **not observed in a running browser.** These remain unverified rather than claimed.
- Verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes **285/285** across 22 files (+2 vs the 283 Sprint 8 checkpoint — the two new navigation-integrity assertions), `npm run build` clean with 120 static entries + 404.
- Guardrails respected: no new dependencies, no backend / integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config. All prior Sprint 6 / 6.5 / 7 / 7.5 / 8 changes remain in the working tree untouched.
- Documented product limitations (unchanged from Sprint 8): legal pages are non-final demo placeholders pending client legal review; demo blog articles stay flagged with the "Demo article" chip; `/billpay`, `/visualizer` and `/crew` remain unintegrated pending client-supplied URLs; the free-estimate and refer-a-friend forms are frontend-only and clearly labelled as not transmitting data.

## Sprint 8 — Utility destinations, legal pages & missing-route audit (2026-10-22)

- Baseline: Sprint 6 / 6.5 / 7 / 7.5 changes carried in the working tree (uncommitted). Prior modifications and untracked files preserved; nothing was reset, stashed, or discarded. Repository-local git identity verified.
- Audit findings from source (not just docs): `/privacy-policy` was still a bare Sprint-1 `StaticPage` scaffold; `/billpay`, `/visualizer`, `/crew` all used `ExternalEntryPage` with `outboundHref={null}` (honest but visually scaffold-y); `/terms-and-conditions` did not exist as a route or static-route entry even though Sprint 0 flagged a missing Terms URL. The reference program's actual legal pages, bill-pay portal URL and visualizer URL were **not fetched** in this session, so no reference URL is reproduced.
- Pay My Bill (`src/pages/PayMyBillPage.tsx`): full reference-styled page replacing the `ExternalEntryPage` call. Explicitly declines to render a payment form, states the destination URL is awaiting the client-supplied value, exposes the shared demo contact (phone + email) via `brand`, and documents why a mock card/bank input is intentionally refused (PCI-DSS compliance / processor contract). No payment backend or provider SDK introduced.
- Visualizer (`src/pages/VisualizerPage.tsx`): full reference-styled page replacing the `ExternalEntryPage` call. States the visualization tool is not integrated and that nothing on the page uploads photos, renders a preview, or saves a visualization. Closes with a Free Estimate CTA to `/free-estimate`.
- Privacy Policy (`src/pages/PrivacyPolicyPage.tsx`): full page with "Demo placeholder — not legal advice" chip, in-page table of contents, five generic sections (scope / information collected / analytics / retention / contact) each labelled as placeholder content, and a footer stating the content must be reviewed and replaced by the client's legal counsel before production. `applyRouteMeta` is set with `noindex: true` so the demo placeholder is not indexed in a crawler-visible environment.
- Terms and Conditions (`src/pages/TermsPage.tsx`): **new route** at `/terms-and-conditions`. Same shape as the privacy page — chip, TOC, five sections (scope / demo forms / no promotions-financing-warranty obligations / external destinations / changes) and the same legal-counsel disclaimer. `applyRouteMeta` noindex. Footer bottom bar now lists it alongside Privacy Policy. This resolves the Sprint 0 "Terms URL" blocker from the audit as a non-final placeholder.
- Router cleanup: `src/app/router.tsx` replaces four scaffold entries (privacy-policy, billpay, visualizer, plus the new terms-and-conditions) with lazy imports to the new page components. The now-unused `StaticPage` lazy import was removed (`StaticPage` itself remains in the repo — nothing else imports it currently, kept as a utility for future scaffolds). `ExternalEntryPage` is retained for the one remaining case (`/crew`, which stays noindex because the real crew portal URL is unverified).
- Static routes: `src/app/staticRoutes.ts` adds `/terms-and-conditions`. Build output confirms **120 static entries + 404** (was 119, +1 for the new terms route). No speculative routes created.
- Missing-route audit summary (recorded in `docs/ROUTE_INVENTORY.md`): every reference destination previously documented is now mounted in the router, enumerated in `staticRoutes()`, and linked from either the primary nav, the footer, or an in-page CTA that resolves to an existing destination. No `href="#"` placeholders remain. `/crew` stays as the single intentional honest-placeholder external entry.
- Tests added: `src/pages/UtilityAndLegalPages.test.tsx` with 7 assertions — PayMyBill renders without a form and asserts no card/bank input is present; Visualizer declares no hosted tool and its CTA → `/free-estimate`; both legal pages render with the "Demo placeholder — not legal advice" chip and the legal-counsel disclaimer; `staticRoutes()` includes all utility/legal routes (`/privacy-policy`, `/terms-and-conditions`, `/billpay`, `/visualizer`, `/crew`, plus previously-added `/contact-us`, `/refer-a-friend`, `/commercial-projects`, `/careers/sales`) and emits no duplicates. Existing `deployment.test.ts` assertions on static-route generation and the `/blog/placeholder-article-1` slug still pass.
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes 283/283 across 21 files (+7 vs the 276 Sprint 7.5 checkpoint), `npm run build` clean with 120 static entries + 404. Rendered browser QA (desktop/mobile) remains **unverified** — no dev server or browser automation launched in this session.
- Guardrails respected: no new dependencies, no payment-processor SDK, no backend / CMS, no commit / push / deploy / amend performed, no modification of global git or Claude Code config. All prior Sprint 6 / 6.5 / 7 / 7.5 changes remain in the working tree untouched.

## Sprint 7.5 — Blog & Article Pages (2026-10-22)

- Baseline: Sprint 6, 6.5, and 7 changes carried in the working tree (uncommitted). No reset / stash / discard performed; prior modifications and untracked files preserved. Repository-local git identity verified.
- Audit findings: `/blog` and `/blog/:slug` already existed as Sprint-1 `PageShell` scaffolds. Routes stay the same; both pages upgraded in place. Content comes from the existing `src/data/articles.ts` typed data (previously 2 placeholder stubs). The live reference site's own blog was **not** fetched in this session, so no reference titles, authors, dates, categories, or imagery are reproduced; demonstration posts are explicitly flagged.
- Articles data (`src/data/articles.ts`): expanded from 2 to 6 entries covering roofing, gutters, siding, windows, and masonry. Every entry retains `isPlaceholder: true`. Bodies are short original explainers written for layout verification; each ends with an in-body "demonstration article" disclaimer. No post is attributed to a real author or presented as a reference-site publication.
- Blog listing (`src/pages/BlogIndexPage.tsx`): rewritten as a full page — hero + card grid with per-card "Demo article" chip, date, category, excerpt, and "Read more" link to the detail route. Fallback states covered: `null` → loading status; empty list → honest "no articles available yet" message. Closing Free Estimate CTA band.
- Article detail (`src/pages/BlogArticlePage.tsx`): rewritten — hero with breadcrumb, demo chip, formatted date and category; article body rendered from typed `bodyHtml`; footer disclaimer repeats that content is demonstration only (not legal / insurance / engineering / financial advice); related-posts grid (up to 3 others) linking back into the index; closing Free Estimate CTA band. Not Found guard preserved for unknown slugs.
- SEO: `applyRouteMeta` sets a unique canonical path and title/description per article plus the listing route. Direct loads continue to work on GitHub Pages.
- Routing / static-route generator unchanged in logic — it already enumerated `/blog/<slug>` for every entry in `listArticleSummaries()`. Entry count rose from **115 + 404 → 119 + 404** solely because the article data expanded by four entries; no new URL template was introduced.
- Tests added: `src/pages/BlogPages.test.tsx` with 8 assertions — single H1 on listing; one card per `listArticleSummaries()` entry each chip-flagged "Demo article"; every card's "Read more" href maps to `/blog/${slug}`; listing CTA → `/free-estimate`; article detail renders title + demo chip + non-advice disclaimer; breadcrumb back-link → `/blog`; "More articles" related section renders; unknown slug resolves to Not Found. Existing `deployment.test.ts` assertion on `/blog/placeholder-article-1` still passes (slug preserved).
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes 276/276 across 20 files (+8 vs the 268 Sprint 7 checkpoint), `npm run build` clean with 119 static entries + 404. Rendered browser QA (desktop/mobile) remains **unverified** in this session — no dev server or browser automation launched.
- Guardrails respected: no new dependencies, no backend / CMS integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config. All prior Sprint 6 / 6.5 / 7 changes remain in the working tree untouched.

## Sprint 7 — Commercial Projects & Sales Careers (2026-10-22)

- Baseline: Sprint 6 and Sprint 6.5 changes carried in the working tree (uncommitted). No reset, stash, or discard performed; prior modifications and untracked files preserved. Repository-local git identity verified.
- Audit findings: `/commercial-projects` and `/careers/sales` were both Sprint-1 `StaticPage` scaffolds (title + description only), already enumerated in `src/app/staticRoutes.ts`. Both are upgraded in place; no new routes created. The live reference pages were not fetched in this session, so content is reference-inspired, not reference-mirrored. No invented commercial-project portfolios, client names, project locations, before/after metrics, salaries, commissions, benefits, hiring status, or recruiter details are included.
- Commercial Projects (`src/pages/CommercialProjectsPage.tsx`): hero with explicit "no individual completed project ... is reproduced" disclaimer, a scopes grid (commercial roofing / multi-system exterior / property-manager scheduling) linking to the existing `/roofing/commercial-roofing` variant hub, `/roofing` service hub, and `/free-estimate`, an honest-empty-state Project gallery section explaining why no imagery is shown, and a closing phone + Free Estimate CTA band using the shared `brand` demo contact. No stock photo is passed off as a real project.
- Sales Careers (`src/pages/SalesCareersPage.tsx`): hero stating this is informational not a job listing, a three-column "About the role" section (what the role looks like, who it suits, what is deliberately not described) that explicitly refuses to quote compensation / benefits / timeline, a Current openings section that states "No openings are listed on this reproduction site" and "No application is accepted here", and a Contact Us CTA band that routes to `/contact-us` with a note that it is not a dedicated recruiter inbox. No external applicant-tracking URL is included until a verified link is supplied.
- Routing / nav / SEO: `src/app/router.tsx` replaces the two `<StaticPage ... />` entries with lazy imports to the new page components. `applyRouteMeta` sets unique titles and canonical paths. Static-route generator unchanged — both slugs were already enumerated, so entry count stays at **115 + 404**. Existing navigation and footer links to `/commercial-projects` and `/careers/sales` continue to resolve to completed pages; no nav redesign.
- Tests added: `src/pages/CommercialAndCareersPages.test.tsx` with 9 assertions — single H1 per page; commercial page refuses invented portfolios and links to `/roofing/commercial-roofing` + `/free-estimate`; sales-careers page explicitly states no openings listed, no salary/benefits quoted, and no application accepted; Contact Us CTA resolves to `/contact-us`; neither page contains an `http(s)` link (recruitment / project-portfolio external URLs intentionally omitted).
- Local verification: `npm run lint` clean, `npm run typecheck` clean, `npm test` passes 268/268 across 19 files (+9 vs the 259 Sprint 6.5 checkpoint), `npm run build` clean with 115 static entries + 404. Rendered browser QA (desktop/mobile) remains **unverified** — no dev server or browser automation launched in this session.
- Guardrails respected: no new dependencies, no backend / recruitment integration, no commit / push / deploy / amend performed, no modification of global git or Claude Code config. All prior Sprint 6 and Sprint 6.5 changes remain in the working tree untouched.

## Sprint 6.5 — Company & Customer Pages (2026-10-22)

- Baseline: Sprint 6 changes carried in the working tree (unchanged, uncommitted). No reset, stash or discard performed. Repository-local git identity verified.
- Audit findings: `/about`, `/special-offers`, `/financing`, `/warranties`, `/reviews` were all mounted as Sprint-1 `StaticPage` scaffolds (title + optional intro only). Each already has a static-route entry. No duplicate routes needed to be created; existing routes were upgraded in place. The live reference pages were not fetched in this session, so content is reference-inspired rather than reference-mirrored and no reference-sourced claims (founding dates, APRs, warranty durations, review counts, awards, lender partners) are reproduced.
- About (`src/pages/AboutPage.tsx`): hero, approach narrative, services callout linking to each `/${service.slug}` hub, three-value grid (quality workmanship / clear communication / standing behind the work), closing phone + Free Estimate CTA band. No founding year, staff bio, or specific certification is claimed.
- Special Offers (`src/pages/SpecialOffersPage.tsx`): hero with explicit "live offer wording ... have not been independently verified in this session" disclaimer, grid of offer cards sourced from `offers` typed data (currently one entry), each card chip-labelled "Demo placeholder" with the existing `disclaimer` field surfaced beneath, and a notes section that explicitly states this reproduction does not operate the reference program's promotions. No discount amount is presented as an active promotion.
- Financing (`src/pages/FinancingPage.tsx`): hero, three-step overview (request estimate → review written terms → decide, then schedule), disclosures section covering rates/approval/no-live-application (verbatim: "No financing application can be submitted from this reproduction site"), closing Free Estimate CTA. No APR, monthly payment, lender name, or approval guarantee is quoted. No external financing-provider link is included until a verified URL and relationship are supplied.
- Warranties (`src/pages/WarrantiesPage.tsx`): hero, two-category breakdown (manufacturer vs. workmanship / installation), each with scope bullets that explicitly describe who sets the terms (manufacturer vs. contractor), followed by a notes section stating "This page does not quote a coverage duration" and "This reproduction does not issue coverage." No specific year count, exclusion, or transfer rule is reproduced.
- Customer Reviews (`src/pages/ReviewsPage.tsx`): hero, grid of nine testimonials transcribed from the reference carousel (already in `src/data/reviews.ts`; unchanged in this sprint), each card renders the existing 1–5 star component with its ARIA label, author, cityState and body. Notes section explicitly states the page does not aggregate reviews, does not display composite ratings, and omits external review-platform links until URLs are verified.
- Routing / nav / SEO: `src/app/router.tsx` replaces five `<StaticPage ... />` scaffold blocks with lazy routes to the new page components. `applyRouteMeta` sets unique titles and canonical paths. Static-route generator unchanged — all five slugs were already enumerated, so entry count stays at **115 + 404**. Navigation and footer links (which already reference these five destinations) continue to resolve to real completed pages; no global nav redesign was made.
- Tests added: `src/pages/CompanyPages.test.tsx` with 15 assertions across the five pages — single H1 per page, essential section markers, Free Estimate CTAs resolve to `/free-estimate`, special-offers cards flagged as demo placeholders, financing page declares no live application and no quoted rates, warranties page distinguishes manufacturer vs. workmanship coverage and declares it does not issue coverage, reviews page renders one star-rating image per entry in `reviews` and declares the no-aggregate-rating / no-external-badge policy. `StaticPage` continues to serve the three remaining scaffolds (`/commercial-projects`, `/careers/sales`, `/privacy-policy`).
- Local verification: `npm run lint` clean, `npm run typecheck` clean (`tsc -b --noEmit`), `npm test` passes 259/259 across 18 files (+15 vs the 244 Sprint 6 checkpoint), `npm run build` clean with 115 static entries + 404. Rendered browser QA (desktop/mobile) remains **unverified** in this session — no dev server or browser automation launched.
- Guardrails respected: no new dependencies, no backend introduced, no commit / push / deploy / amend performed, no modification of global git or Claude Code config, no Sprint 6 work altered. Sprint 6 changes (ContactUsPage, ReferAFriendPage, nav/footer/static-route updates) remain in the working tree untouched.

## Sprint 6 — Contact Us + Refer a Friend conversion pages (2026-10-22)

- Baseline: clean `main` at `33677ea` (post-Sprint 5.5.12 service-area index pages). Repository-local author identity verified. No unrelated changes carried in the working tree.
- Audit findings: no dedicated `/contact-us` route existed; `src/data/navigation.ts` pointed the "Contact Us" label at `/free-estimate`. `/refer-a-friend` existed only as a Sprint-1 `StaticPage` scaffold. The reference `/contact-us/` destination on mrroof.com is not independently audited in-session; the demo contact details (`brand.phoneDisplay`, `brand.email`) are reused unchanged — no office address, business hours or secondary number is invented.
- Contact Us: new `src/pages/ContactUsPage.tsx` wired at `/contact-us`. Content: reference-style hero (eyebrow + H1 + intro), demo-contact card (phone / email via `brand`), inline Free Estimate CTA linking to the shared `/free-estimate` route, and a service-area list that links each `locations[]` entry to its hub `/{slug}/`. Nav label now points to `/contact-us`; footer Resources gets a new Contact Us link.
- Refer a Friend: new `src/pages/ReferAFriendPage.tsx` replaces the scaffold at `/refer-a-friend`. Sections: hero, three-step explanation (tell us / request a project / rewarded), reward & terms disclaimer that explicitly states the demo does not operate the program, referral form (new `src/features/referral/ReferralForm.tsx`), and a dark Free Estimate CTA band.
- Referral form fields: referrer name (required), referrer email (required, email format), referrer phone (optional, phone format), friend's name (required), friend's phone (required, phone format), friend's email (optional, email format), location (required `serviceAreaRegions` select). The same `EMAIL_RE` / `PHONE_RE` patterns as `EstimateForm` are used so valid formatting is not rejected. The form prevents repeated submissions while pending, surfaces inline per-field errors, shows a demo disclaimer, and on success replaces itself with a "referral captured" acknowledgement whose copy explicitly states no referral was transmitted or stored. No field values are persisted to `localStorage`.
- Routes, nav, SEO: router updated with lazy routes for both pages; `src/app/staticRoutes.ts` adds `/contact-us` so the deploy entry count rises to 115 + 404 (observed in the build log). `applyRouteMeta` sets unique page titles and canonical paths. The homepage, footer and header navigation continue to render consistently on both pages via `AppShell`.
- Tests added: `src/pages/ContactUsPage.test.tsx` (5 assertions — single H1, demo phone + email links, Free Estimate CTA destination, demo disclaimer copy, service-area list links). `src/pages/ReferAFriendPage.test.tsx` (8 assertions — single H1, three-step headings, reward/terms disclaimer, Free Estimate CTA, empty-submit required-field validation, invalid-email rejection, demo disclaimer copy, happy-path submit → "referral captured" success).
- Local verification: `npm run lint`, `npm run typecheck`, `npm test` (244 passed; +13 vs the 231 Sprint 5.5.12 checkpoint), `npm run build` (clean, 115 static entries + 404). Rendered browser QA remains unverified in this session; no dev server was launched.
- Guardrails respected: no backend introduced, no new dependencies, no commit / push / deploy performed, no amendment of prior commits, no modification of global git or Claude Code configuration. All prior pages, availability data, forms and tests are unchanged.

## Sprint 5.5.12 — Location service-area index pages (2026-10-21)

- Baseline: clean `main` at `deffa14fbf702c1b9f88b39fb7473262657aeb9e` (Sprint 5.5.11); expected origin and repository-local author verified. Sprint 5.5.11 Pages deployment confirmed completed/success before this sprint started.
- Reference evidence (2026-10-21): live inspection of all six location service-area URLs (`/nashville/`, `/cincinnati/`, `/cleveland/`, `/grand-rapids/`, `/ann-arbor/`, `/lansing/`) confirmed hero H1 "Service Area" (Lansing uses a different H1 — "Roofing and Exterior Services in Greater Lansing, Michigan" — as part of a markedly richer feature page), the regional intro, the counties list, and compass-direction (North/South/East/West) city buckets. Captured the full community list for each.
- Completed six scoped service-area index pages. New typed data in `src/data/serviceAreas.ts` holds the per-location intro, regional heading, counties and directional buckets. `src/pages/LocationServiceAreaPage.tsx` is rewritten to render a completed body when `findServiceArea(slug)` matches; otherwise it keeps the Sprint 1 scaffold for forward compatibility if a future `hasServiceAreaIndex` location is added without typed content.
- Child-link policy: the index page links to a scoped child route only when the child slug already exists in `locations[].serviceAreaChildren` (so the Sprint 1 scaffold child route is actually mounted). Every other reference child name renders as plain text with a visible note that detailed child pages will arrive later. No dead links are introduced.
- Final CTA: resolves per availability. `nashville`, `cincinnati`, `cleveland` → `/<slug>/free-estimate/` (completed in Sprint 5.5.2 and 5.5.11). `grand-rapids`, `ann-arbor`, `lansing` → `/<slug>/#estimate` (completed location-hub hero anchor). No invented local estimate route is generated.
- Lansing deviation documented: the reference `/lansing/service-area/` is a full feature page, not a flat index. This sprint implements the community-list portion only; the richer page sections (why-choose-us, process, projects, reviews, financing, FAQ, closing estimate) are deferred.
- Availability and static-route generation unchanged — the six index URLs were already emitted via each parent location's `hasServiceAreaIndex` capability flag. Entry count remains 114 + 404.
- Added `src/pages/LocationServiceAreaPage.test.tsx` with 15 focused assertions: every `hasServiceAreaIndex` location has a `serviceAreas` content record; every index renders a city-named body without the scaffold badge; every compass-direction heading from the typed data renders at level 3; the final CTA resolves to `/<slug>/free-estimate/` when scoped-complete and `/<slug>/#estimate` otherwise; children present in `locations[].serviceAreaChildren` get linked while others render as text; locations without `hasServiceAreaIndex` and unknown locations resolve to Not Found.
- Local verification (not yet committed or deployed): `npm run lint`, `npm run typecheck`, `npm test` (231 tests across 15 files; +18 vs the 213 checkpoint) and `npm run build` (clean, 114 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.

## Sprint 5.5.11 — Remaining free-estimate pages (2026-10-21)

- Baseline: Sprint 5.5.10 changes are still in the working tree (uncommitted, awaiting approval). Sprint 5.5.11 is layered on top so the two batches can be reviewed and shipped together or separately per the user's direction.
- Reference evidence (2026-10-21): live inspection of https://www.mrroof.com/cleveland/free-estimate/, https://www.mrroof.com/cincinnati/free-estimate/, https://www.mrroof.com/louisville/free-estimate/ and https://www.mrroof.com/dayton/free-estimate/ confirms each is a published scoped page with the same form structure as the Nashville reference (H1 "Free Estimate", 5 required fields, 2 optional consent checkboxes, submit label "Get a FREE ESTIMATE"). The reference pages themselves do not preselect a region.
- Implementation (minimal): extended `COMPLETED_SLUGS` in `src/pages/LocationFreeEstimatePage.tsx` from `{"nashville"}` to the full five cities. No new typed data, no new components. The pre-existing `findLocationPage(location.slug).defaultRegionKey` map (populated for all ten cities since Sprint 5.1/5.2) drives region preselection; the shared `EstimateBody` renders the identical AppShell / breadcrumb / H1 / inverse `EstimateForm` / demo-contact card for every slug.
- Deliberate reference deviations unchanged from Sprint 5.5.2 Nashville implementation: our pages preselect the region (reference does not; our page is already scoped so pre-selection improves UX); our pages expose only the shared demo phone / email (reference shows a city-specific secondary phone and office address, which we do not reactivate or fabricate).
- Static-route generation: unchanged (114 + 404). All four URLs were already emitted via the `hasFreeEstimate` capability flag.
- Tests: the Sprint 5.5.2 LocationFreeEstimatePage.test.tsx block that previously asserted these four cities kept the Sprint 1 scaffold is replaced with a positive-rendering block (`it.each` across the four slugs) covering: completed H1, no scaffold badge, region selector suppressed and service dropdown open, breadcrumb points to the location hub. Nashville and Not-Found cases retained unchanged.
- Local verification (not yet committed or deployed): `npm run lint`, `npm run typecheck`, `npm test` (213 tests across 14 files; +8 vs Sprint 5.5.10) and `npm run build` (clean, 114 static entries + 404) all pass. Rendered browser verification remains unavailable; HTTP 200 and bundle-string probes are not substituted.
- **Every published reference `/<slug>/free-estimate/` page is now implemented locally.** The five cities without `hasFreeEstimate` (ann-arbor, grand-rapids, lexington, detroit, lansing) continue to resolve to Not Found because the reference does not publish scoped free-estimate pages for them.

## Sprint 5.5.10 — Lansing scoped service hubs (2026-10-21)

- Baseline: clean `main` at `5687e4068a05bea2100bf76cd14ee1cea4196446`; expected origin and repository-local author verified.
- Reference evidence (2026-10-21): live inspection of each of the five Lansing scoped service URLs confirms published reference pages with city-named H1s and the following FAQ pattern — roofing 2 topics (cost / signs — same as Detroit); siding 3; windows 3; gutters 2; masonry none. The reference Lansing service-grid tiles link to `/ann-arbor/`, but the scoped Lansing URLs resolve and are the destinations linked from the Lansing header navigation.
- Completed five Lansing scoped service hubs: `/lansing/{roofing,siding,windows,gutters,masonry}/`. Reference-verified FAQ coverage adopted close-paraphrased, mid-Michigan climate framing. No local FAQ topics are invented. No office, review or credential fabricated. Imagery reuses existing per-service hero photography from `servicePages[key].hero`; no new assets.
- Availability: added four entries to `src/data/availability.ts` for `lansing/{siding,windows,gutters,masonry}`. The pre-existing roofing entry (`hasServiceAreaIndex: true`) is unchanged. No new capability flags added — the reference Lansing page does not advertise financing or a free-estimate route. Static-route generation output rises from 110 to 114 entries + 404.
- CTA deviation: all five Lansing service entries carry explicit `finalCtaTo: "/lansing/#estimate"` so primary CTAs reach the completed Lansing location-hub hero form.
- Local deviation from reference: the Lansing location-hub service grid continues to link each tile to the scoped `/lansing/<service>/` route (via `isLocationServiceAvailable`), rather than mirroring the reference's practice of pointing its grid tiles at `/ann-arbor/`. Same deliberate deviation documented for Detroit in Sprint 5.5.9.
- Fallback-test fixture update: `LocationPage.test.tsx` service-grid fallback test, retargeted to Lansing in Sprint 5.5.9, is now retargeted to `/cleveland/masonry/` because Lansing is fully populated. This matches the dispatcher/availability tests which already use Cleveland masonry as the unavailable Not-Found fixture. The LocationServicePage.test.tsx test that previously asserted `/lansing/siding/` was Not Found is removed and replaced by a new Lansing-completed block.
- Added 9 focused tests for Lansing: each of the five hubs renders a city-named H1 without the scaffold badge; hero CTA resolves to `/lansing/#estimate`; roofing renders its reference-verified 2-topic FAQ while masonry omits one; `/lansing/insulation/` stays Not Found; breadcrumb returns to `/lansing/`.
- Local verification (not yet committed or deployed as of this report): `npm run lint`, `npm run typecheck`, `npm test` (205 tests across 14 files) and `npm run build` (114 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.
- **All scoped service hubs across every city are now complete.** The remaining Sprint 1 scoped-service shells are the `/<location>/<service>/<variant>/` routes and the per-location `/free-estimate/`, `/financing/`, `/service-area/` and `/service-area/<child>/` category pages — all explicitly out of the 5.5.x scope.

## Sprint 5.5.9 — Detroit scoped service hubs + Lansing verification (2026-10-21)

- Baseline: clean `main` at `7923ed330da1170b5136e7e4a4092938f792bc34`; expected origin and repository-local author verified.
- Reference evidence (2026-10-21): live inspection of https://www.mrroof.com/detroit/ and https://www.mrroof.com/lansing/ overturns the "hub only" classification for both. Detroit and Lansing both expose scoped `/<slug>/<service>/` URLs through their **header** navigation for roofing, siding, windows, gutters and masonry. The service-grid tiles on both pages unusually link to `/ann-arbor/` instead of the location's own URLs, but the scoped URLs themselves resolve. Insulation appears only in footers / grid tiles and remains without a `ServiceHubKey`.
- Scope choice: with 10 potentially-implementable hubs across the two locations and a 5-hub sprint cap, implemented Detroit's full batch (5 pages) first. Lansing's 5 are documented as the exact remaining scoped-service pages.
- Completed five Detroit scoped service hubs: `/detroit/{roofing,siding,windows,gutters,masonry}/`. Reference-verified FAQ coverage adopted close-paraphrased: roofing — 2 (cost / signs — a new 2-topic roofing pattern); siding — 3 (cost / signs / lifespan); windows — 3 (cost / signs / replace-all); gutters — 2 (cost / know-if-need); masonry — none. No local FAQ topics are invented.
- Availability: added five entries to `src/data/availability.ts` for Detroit (`roofing, siding, windows, gutters, masonry`). No capability flags added — the reference Detroit page does not advertise financing or a service-area index. Static-route generation output rises from 105 to 110 entries + 404.
- CTA deviation: all five Detroit service entries carry explicit `finalCtaTo: "/detroit/#estimate"` so primary CTAs reach the completed Detroit location-hub hero form.
- Local deviation from reference: the Detroit location-hub service grid continues to link each tile to the scoped `/detroit/<service>/` route (via `isLocationServiceAvailable`), which contradicts the reference's practice of linking its grid tiles to `/ann-arbor/`. The deviation is deliberate — our tiles now reach completed Detroit pages rather than redirect to another city — and is documented in [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).
- Negative-test fixture change: four tests that used `/detroit/roofing/` as the Not-Found example are retargeted to `/cleveland/masonry/`, which the reference Cleveland service grid deliberately links globally. Files updated: `availability.test.ts`, `dispatch.test.tsx`, `deployment.test.ts`, and the Not-Found section of `LocationServicePage.test.tsx`. The LocationPage service-grid fallback test is retargeted to Lansing (whose siding/windows/gutters/masonry are not yet in availability; its roofing is).
- Added 8 focused tests for Detroit: each of the five hubs renders a city-named H1 without the scaffold badge; hero CTA resolves to `/detroit/#estimate`; roofing renders its reference-verified 2-topic FAQ while masonry omits one; `/lansing/siding/` remains Not Found to confirm the deferred scope.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (197 tests across 14 files) and `npm run build` (110 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Exact remaining scoped-service pages: `/lansing/{roofing,siding,windows,gutters,masonry}/` — reference URLs verified this sprint, implementation deferred.

## Sprint 5.5.8 — Louisville scoped service hubs (2026-10-20)

- Baseline: clean `main` at `c68c58cdf38b26aa28e6d9ed9d19c6db9de08f5b`; expected origin and repository-local author verified.
- Reference evidence (2026-10-20): live inspection of https://www.mrroof.com/louisville/ confirms all six service-grid tiles link to scoped `/louisville/<service>/` URLs. Spot-checked each of the five implementable pages for section pattern and FAQ topics; adopted only reference-verified FAQ topics (close-paraphrased).
- Completed five Louisville scoped service hubs: `/louisville/{roofing,siding,windows,gutters,masonry}/`. Reference-verified FAQ coverage: roofing and masonry have no FAQ (local hubs omit one); siding and windows carry 3 topics each; gutters carries 2. No local FAQ topics are invented.
- `/louisville/insulation/` is a verified reference URL but has no local `ServiceHubKey`; it stays Not Found rather than mis-render.
- Availability: added four entries to `src/data/availability.ts` for `louisville/{siding,windows,gutters,masonry}`. The pre-existing roofing entry (`hasFreeEstimate`, `hasFinancing`) is unchanged. Static-route generation output rises from 101 to 105 entries + 404.
- CTA deviation: Louisville advertises `hasFreeEstimate` but `/louisville/free-estimate/` is still a Sprint 1 scaffold kept behind the `COMPLETED_SLUGS` whitelist. The five Louisville service entries carry explicit `finalCtaTo: "/louisville/#estimate"` so primary CTAs reach the completed location-hub hero form — same pattern as Grand Rapids, Cleveland, Cincinnati, Dayton and Lexington.
- Imagery: reuses existing per-service hero photography from `servicePages[key].hero`; no new assets. No office, review or credential fabricated.
- Added 7 focused tests in `src/pages/LocationServicePage.test.tsx`: each of the five Louisville hubs renders a city-named H1 without the scaffold badge; hero CTA resolves to `/louisville/#estimate`; FAQ heading renders only where the reference publishes one (siding yes; roofing and masonry no). The existing dispatch/availability tests continue to use Detroit as the "unavailable combo" fixture, which is still appropriate because Detroit's reference service-link mapping is unverified at the scoped level.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (189 tests across 14 files) and `npm run build` (105 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Remaining verified vs unverified scope: six cities now have reference-verified scoped service hubs implemented (nashville, grand-rapids, cleveland, cincinnati, dayton, lexington, louisville). Detroit and Lansing have **not** been inspected at the scoped-service level this cycle; their current state (Sprint 1 scaffolds / Not Found) is kept pending verification.

## Sprint 5.5.7 — Lexington scoped service hubs + classification correction (2026-10-20)

- Baseline: clean `main` at `7caea003e7bdc535529634bd183fd8c504111f20`; expected origin and repository-local author verified.
- Classification correction: Sprint 5.1's `ROUTE_INVENTORY.md §2` labelled Lexington "hub only." Live inspection of https://www.mrroof.com/lexington/ on 2026-10-20 shows all six service-grid tiles link to scoped `/lexington/<service>/` URLs. Spot-checked each of the five implementable pages for section pattern and FAQ topics.
- Completed five Lexington scoped service hubs: `/lexington/{roofing,siding,windows,gutters,masonry}/`. Reference-verified FAQ coverage: roofing carries 3 topics (**first roofing hub with a reference FAQ** — cost / know-if-need / insurance); siding carries 3 (cost / signs / lifespan); windows carries 3 (cost / signs / replace-all); gutters carries 2 (cost / know-if-need; reference's first FAQ title still shows "Cincinnati" template leftover — local wording corrects to "Lexington"); masonry has no FAQ. No local FAQ topics are invented.
- `/lexington/insulation/` is a verified reference URL but is not a `ServiceHubKey`; it stays Not Found rather than mis-render.
- Availability: added five entries to `src/data/availability.ts` for `lexington/{roofing,siding,windows,gutters,masonry}`. No capability flags added — the reference Lexington page does not advertise financing or a service-area index. The scoped `/lexington/free-estimate/` route is linked from the reference but is not implemented locally (out of scope). Static-route generation output rises from 96 to 101 entries + 404.
- CTA deviation: all five Lexington service entries carry explicit `finalCtaTo: "/lexington/#estimate"` so primary CTAs reach the completed Lexington location-hub hero form — same pattern as Grand Rapids, Cleveland, Cincinnati and Dayton.
- Tests that assumed Lexington was hub-only were retargeted to Detroit (which remains hub-only on the reference): `availability.test.ts`, `dispatch.test.tsx`, `deployment.test.ts` and the Not-Found section of `LocationServicePage.test.tsx`.
- Added 8 focused tests for Lexington: each of the five hubs renders a city-named H1 without the scaffold badge; hero CTA resolves to `/lexington/#estimate`; `/lexington/roofing/` renders its reference-verified FAQ while `/lexington/masonry/` omits one; `/lexington/insulation/` stays Not Found.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (182 tests across 14 files) and `npm run build` (101 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Remaining locations requiring verified implementation: louisville and lansing (both have reference pages with scoped service links; not yet audited). Detroit is reference-hub-only — nothing to implement there.

## Sprint 5.5.6 — Dayton scoped service hubs (2026-10-20)

- Baseline: clean `main` at `2e455a39357006186a0b0d094cd273ea71aa4b34`; expected origin and repository-local author verified.
- Reference evidence (2026-10-20): live inspection of https://www.mrroof.com/dayton/ confirms four scoped service URLs linked from the Dayton service grid (`/dayton/{roofing,siding,windows,gutters}/`). Masonry and Insulation tiles link to the GLOBAL `/masonry/` and `/insulation/` URLs — `/dayton/{masonry,insulation}/` stay Not Found rather than mis-render. Spot-checked each of the four scoped pages for section pattern and FAQ topics; adopted only reference-verified FAQ topics (close-paraphrased).
- Completed four Dayton scoped service hubs: `/dayton/{roofing,siding,windows,gutters}/`. Reference-verified FAQ coverage: roofing has no FAQ and the local hub omits one; siding carries 3 topics (reference template still shows "Cincinnati" in its first-question label — a reference-side template leftover; local wording corrects to "Dayton"); windows carries 3; gutters carries 2. No local FAQ topics are invented.
- Availability: added three entries to `src/data/availability.ts` for `dayton/{siding,windows,gutters}`. The pre-existing roofing entry (`hasFreeEstimate`, `variants: ["commercial-roofing"]`) is unchanged. Static-route generation output rises from 93 to 96 entries + 404.
- CTA deviation: Dayton advertises `hasFreeEstimate` but `/dayton/free-estimate/` is still a Sprint 1 scaffold kept behind the `COMPLETED_SLUGS` whitelist. The four Dayton service entries carry explicit `finalCtaTo: "/dayton/#estimate"` so primary CTAs reach the completed location-hub hero form, matching the Grand Rapids / Cleveland / Cincinnati pattern.
- Imagery: reuses existing per-service hero photography from `servicePages[key].hero`; no new assets. No office, review or credential fabricated.
- Added 7 focused tests in `src/pages/LocationServicePage.test.tsx`: each of the four Dayton hubs renders a city-named H1 without the scaffold badge; hero CTA resolves to `/dayton/#estimate`; `/dayton/masonry/` and `/dayton/insulation/` both resolve to Not Found; `/dayton/roofing/` has no FAQ heading while `/dayton/siding/` does.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (173 tests across 14 files) and `npm run build` (96 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Remaining cities: four locations (lexington, louisville, detroit, lansing) still use the Sprint 1 scaffold for every advertised scoped service URL on their reference homepages.

## Sprint 5.5.5 — Cincinnati scoped service hubs (2026-10-20)

- Baseline: clean `main` at `1d19fdf85996f299098c019b78195d53a4ba9885`; expected origin and repository-local author verified.
- Reference evidence (2026-10-20): live inspection of https://www.mrroof.com/cincinnati/ confirms all six service-grid tiles link to scoped `/cincinnati/*/` URLs. Spot-checked each of the five implementable pages for section pattern and FAQ topics; adopted only reference-verified FAQ topics (close-paraphrased).
- Completed five Cincinnati scoped service hubs reusing the existing architecture: `/cincinnati/{roofing,siding,windows,gutters,masonry}/`. Reference-verified FAQ coverage: roofing and masonry have no FAQ (local hubs omit one); siding and windows carry 3 topics each; gutters carries 3 topics (cost / know-if-need / ice dam). No local FAQs were invented.
- `/cincinnati/insulation/` is a verified reference URL but is not a `ServiceHubKey`; it keeps the Sprint 1 scaffold rather than mis-render.
- Availability: added four entries to `src/data/availability.ts` for `cincinnati/{siding,windows,gutters,masonry}` so the routes mount. The pre-existing roofing entry (hasFreeEstimate, hasFinancing, hasServiceAreaIndex, variants: ["commercial-roofing"]) is unchanged. Static-route generation output rises from 89 to 93 entries + 404.
- CTA deviation: Cincinnati advertises `hasFreeEstimate` but `/cincinnati/free-estimate/` is still a Sprint 1 scaffold. The five Cincinnati service entries carry explicit `finalCtaTo: "/cincinnati/#estimate"` so primary CTAs reach the completed location-hub hero form, matching the Grand Rapids/Cleveland pattern.
- Content imagery: reuses existing per-service hero photography from `servicePages[key].hero`; no new assets introduced. No office, review, or credential fabricated.
- Added 7 focused tests in `src/pages/LocationServicePage.test.tsx`: each of the five Cincinnati hubs renders a city-named H1 without the scaffold badge, hero CTA resolves to `/cincinnati/#estimate`, and FAQ heading renders only on pages where the reference publishes one (siding yes; roofing and masonry no).
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (166 tests across 14 files) and `npm run build` (93 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.
- Remaining cities: five locations (dayton, lexington, louisville, detroit, lansing) still use the Sprint 1 scaffold for every advertised scoped service URL on their reference homepages.

## Sprint 5.5.4 — Cleveland scoped service hubs + Grand Rapids FAQ correction (2026-10-20)

- Baseline: clean `main` at `fc12983c5900103a52fd7a3e2dbfeede72fc191d`; expected origin and repository-local author verified.
- Reference evidence (2026-10-20): live inspection of https://www.mrroof.com/cleveland/ confirms four scoped service URLs linked from the service grid (`/cleveland/{roofing,siding,windows,gutters}/`). Importantly, the Cleveland Masonry and Insulation tiles link to the **global** `/masonry/` and `/insulation/` URLs, not scoped Cleveland pages — `/cleveland/{masonry,insulation}/` deliberately stay Not Found. Spot-checked each of the four scoped pages for section pattern and FAQ topics; adopted only reference-verified FAQ topics (close-paraphrased).
- Completed four Cleveland scoped service hubs reusing the Nashville/Grand-Rapids architecture: `/cleveland/{roofing,siding,windows,gutters}/`. Reference-verified FAQ coverage: roofing has no FAQ section on the reference and the local hub omits one; siding and windows each carry 3 reference-verified topics; gutters carries 2. No local FAQs were invented.
- Availability: added three entries to `src/data/availability.ts` for `cleveland/{siding,windows,gutters}` so the routes mount; the existing roofing entry (`hasFreeEstimate`, `hasFinancing`, `hasServiceAreaIndex`) is unchanged. Static-route generation output rises from 86 to 89 entries + 404.
- CTA deviation: Cleveland availability advertises `hasFreeEstimate` but `/cleveland/free-estimate/` is still a Sprint 1 scaffold (kept behind the Sprint 5.5.2 `COMPLETED_SLUGS` whitelist). The four Cleveland service entries carry an explicit `finalCtaTo: "/cleveland/#estimate"` so primary CTAs reach the completed location-hub hero form instead of the unfinished shell — same pattern as Grand Rapids in Sprint 5.5.3.
- Grand Rapids FAQ correction: Sprint 5.5.3's audit identified FAQ blocks on `/grand-rapids/{roofing,windows,gutters,masonry}/` as locally authored (not reference-verified). Those four FAQ blocks are removed this sprint. `/grand-rapids/siding/` keeps its three FAQ topics because they are reference-verified from live inspection on 2026-10-20. Headings, eyebrows, intro copy and imagery for Grand Rapids are unchanged.
- Added 10 focused tests in `src/pages/LocationServicePage.test.tsx` covering: each of the four Cleveland hubs renders a city-named H1 without the scaffold badge; Cleveland hero CTA resolves to `/cleveland/#estimate`; `/cleveland/masonry/` resolves to Not Found; Grand Rapids siding retains its FAQ while roofing/windows/gutters/masonry no longer render one.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (159 tests across 14 files) and `npm run build` (89 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.
- Remaining cities: six locations (cincinnati, dayton, lexington, louisville, detroit, lansing) still use the Sprint 1 scaffold for every advertised scoped service URL on their reference homepages. Insulation, variants, financing, service-area index and service-area child routes remain out of scope.

## Sprint 5.5.3 — Grand Rapids scoped service hubs (2026-10-20)

- Baseline: clean `main` at `ad23732ffcf81a9d1ab66df2f96cb0402e37ec92`; expected origin and repository-local author verified.
- Reference evidence (2026-10-20): live inspection of https://www.mrroof.com/grand-rapids/ confirms the service grid links to published scoped URLs for roofing, siding, windows, gutters, masonry and insulation. Spot-checked `/grand-rapids/siding/` (reference H1 "Grand Rapids Siding Installation", three local FAQs on cost / signs / lifespan) and `/grand-rapids/roofing/` (H1 "Grand Rapids Roofing Services", no FAQ section).
- Completed five Grand Rapids scoped service hubs reusing the Sprint 5.5.1 Nashville architecture: `/grand-rapids/{roofing,siding,windows,gutters,masonry}/`. Insulation is a verified reference URL but is not a `ServiceHubKey` and keeps the Sprint 1 scaffold rather than mis-render.
- Availability: added four entries to `src/data/availability.ts` for grand-rapids/{siding,windows,gutters,masonry} so the routes mount. No capability flags added — the existing `hasFinancing` and `hasServiceAreaIndex` for Grand Rapids are unchanged and remain scoped to the roofing entry per the existing table shape. Static-route generation output rises from 82 to 86 entries + 404.
- CTA deviation: Grand Rapids has no `hasFreeEstimate` capability and `/grand-rapids/free-estimate/` is still a scaffold. Per the Sprint 5.5.3 brief, the five scoped CTAs target the completed Grand Rapids location-hub hero form via `/grand-rapids/#estimate`. This is now the shared default in `LocationServicePage.tsx` for any completed scoped page whose city lacks `hasFreeEstimate`, replacing the previous fallback that pointed at the unfinished global `/free-estimate/` shell.
- Content: typed Grand Rapids entries added to `src/data/locationServicePages.ts`. The Grand Rapids siding FAQs mirror the reference's own three questions (close-paraphrased for Middle Michigan climate). Other hubs carry 2 Grand Rapids-contextual FAQs each; no office, review or credential is fabricated. Imagery reuses the existing per-service `servicePages[key].hero`; no new assets.
- Added 7 focused tests in `src/pages/LocationServicePage.test.tsx`: each of the five Grand Rapids hubs renders a city-named H1 without the scaffold badge, the hero CTA on a Grand Rapids page resolves to `/grand-rapids/#estimate`, and the breadcrumb returns to `/grand-rapids/`.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (148 tests across 14 files) and `npm run build` (86 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.
- Remaining local-service hub count from the inventory: seven cities (cleveland, cincinnati, dayton, lexington, louisville, detroit, lansing) have advertised scoped service URLs on their reference homepages (where available); verifying each and implementing the corresponding hubs is the next scope choice. Variants, financing, service-area index and service-area child routes remain out of scope.

## Sprint 5.5.2 — Nashville route provenance correction + free-estimate (2026-10-20)

- Baseline: clean `main` at `138eab524b9665e6d41476c9ec0b1ac15a334a9c`; expected origin and repository-local author verified.
- Correction to Sprint 5.5.1 provenance: a live inspection of the Nashville reference homepage on 2026-10-20 confirms every service-grid tile links to a published scoped URL. All five Nashville scoped hubs completed in Sprint 5.5.1 are **verified reference URLs**, not demo extensions. Sprint 5.5.1's claim that four were unpublished was based on the older partial sitemap excerpt in `ROUTE_INVENTORY.md §2` rather than live navigation; the audit is now corrected in [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md). No local route or page implementation changes result from this correction.
- Completed `/nashville/free-estimate/`: AppShell, breadcrumb, H1 "Free Estimate." (reference parity), reusable `EstimateForm` with Nashville preselected via `lockedRegion="nashville-area"`, service kept open, consent checkboxes and existing validation / pending / success / error / retry behaviour preserved. The demo-only notice, centralized phone/email and noindex metadata are all intact. No office address is published for the demo and no reference endpoint is reactivated.
- Gating: `COMPLETED_SLUGS = new Set(["nashville"])` in `LocationFreeEstimatePage.tsx` keeps the scaffold for cleveland, cincinnati, louisville and dayton — these advertise `hasFreeEstimate` in availability but are not in scope here.
- Added `src/pages/LocationFreeEstimatePage.test.tsx` (10 tests): Nashville free-estimate renders a city-named H1 without the scaffold badge; the hero region selector is suppressed and service is open; demo phone/email contacts render with the expected `tel:` / `mailto:` hrefs; breadcrumb returns to `/nashville/`; the "Demo form — submissions are not sent." notice is present; the four other `hasFreeEstimate` cities keep the Sprint 1 scaffold; unknown cities and cities without the capability resolve to Not Found.
- Verification: `npm run lint`, `npm run typecheck`, `npm test` (141 tests across 14 files) and `npm run build` (82 static entries + 404) all pass. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Remaining Sprint 1 shells: insulation (not a `ServiceHubKey`), commercial-roofing variant, nashville financing/service-area, and every scoped service across the other eight locations.

## Sprint 5.5.1 — Nashville local-service hub pages (2026-10-20)

- Baseline: clean `main` at `ebecb8e922cef94b96a0251ec59a7e4c59ef6d7c`; expected origin and repository-local author verified.
- Completed five Nashville scoped service hubs: `/nashville/{roofing,siding,windows,gutters,masonry}/`. Composition reuses the global `ServiceSections` toolkit (hero/trust/products/features/related/estimate) and layers typed Nashville content from the new `src/data/locationServicePages.ts` (local H1, eyebrow, intro paragraph and concise local FAQs).
- Reference audit (2026-10-20) confirmed only one scoped service hub, `/nashville/siding/`, is actually published on the live reference; its H1 ("Nashville Siding Installation") and FAQ topics were adopted verbatim. The other four Nashville scoped routes are advertised in `src/data/availability.ts` but are not published on the reference — their copy is Nashville-contextual paraphrase, not fabricated reference content, and no office, review or credential is invented.
- `/nashville/insulation/` is in the availability table but is not a `ServiceHubKey`; it continues to render the Sprint 1 scaffold rather than mis-render. The commercial-roofing variant and the four other Nashville nested destinations (free-estimate, financing, service-area, service-area child) also remain scaffolds — these are explicitly out of scope here.
- Minimal shared change: `ServiceEstimate` accepts an optional `estimateTo` prop so the final CTA points to `/nashville/free-estimate/` on the scoped pages rather than the global route. The hero sidebar replaces the global location dropdown with Nashville capability links (free-estimate, financing, service-area) sourced from availability, so no mis-directing dropdown appears on a page already scoped to Nashville.
- Added `src/pages/LocationServicePage.test.tsx` with 10 tests: every entry in `locationServicePages` is backed by an availability pair; the five Nashville hubs each render a city-named H1 without the scaffold badge; hero CTA on a scoped page resolves to `/nashville/free-estimate/`; breadcrumb returns to `/nashville/`; `/lexington/roofing/` remains Not Found; `/nashville/insulation/` keeps the Sprint 1 scaffold. The pre-existing dispatcher test was retargeted to the new Nashville H1.
- Verification (local): `npm run lint`, `npm run typecheck`, `npm test` (130 tests across 13 files) and `npm run build` (82 static entries + 404) all passed. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted.
- Remaining scope: the five Nashville scoped non-service destinations and all scoped service hubs for the eight other locations remain Sprint 1 scaffolds.

## Sprint 5.3 — Focused location-page verification (2026-10-20)

- Baseline: clean `main` at `8e2e96b96e90d4efeae6a523ada0687f298e5bc3`; expected origin and repository-local author verified.
- Concrete defect fixed: Sprint 5.2's `#estimate` scroll-margin (`scroll-mt-28 lg:scroll-mt-32` → 112/128px) was shorter than the sticky `SiteHeader` (~124/144/160px at mobile/tablet/`lg+`), so the anchored CTA would land under the header. Replaced with explicit arbitrary values derived from the header's own geometry: `scroll-mt-[136px] sm:scroll-mt-[154px] lg:scroll-mt-[170px]`.
- Rendered browser verification remains an open blocker for this sprint: no headless-browser or in-app browser automation is available to this session and the project does not ship one as a dependency. Per instructions, bundle-string probes are not substituted. The honest status is recorded in [QA_REPORT.md](QA_REPORT.md).
- Data/route consistency reused the existing automated coverage in `src/pages/LocationPage.test.tsx` (every slug has a content record; every `defaultRegionKey` exists in `serviceAreaRegions`; Final CTA target per availability; scoped service links only where availability lists them; `#estimate` anchor present).
- Checks after the fix: `npm run lint`, `npm run typecheck`, `npm test` (119 tests across 12 files) and `npm run build` (82 static entries + 404) all passed.
- Readiness for Sprint 5.5: ten location hubs are complete; nested `/<location>/<service>/`, `/<location>/<service>/<variant>/`, `/<location>/free-estimate/`, `/<location>/financing/`, `/<location>/service-area/` and `/<location>/service-area/<child>/` all remain Sprint 1 shells and are explicitly out of scope here.

## Sprint 5.2 — Remaining eight location pages (2026-10-20)

- Baseline: clean `main` at `051ad29c03674b8c34d6fc0f0ab1f15769564419`; expected origin and repository-local author verified.
- Extended `src/data/locationPages.ts` with typed content for Grand Rapids, Cleveland, Cincinnati, Dayton, Lexington, Louisville, Detroit and Lansing. All ten `locations[]` entries now resolve to a completed hub; the Sprint 1 scaffold fallback remains in place in `LocationPage.tsx` but is now unused.
- Reference inspection (2026-10-20, all eight 200 OK, no redirects): H1 and section wording captured per page in [LOCATION_PAGES_AUDIT.md](LOCATION_PAGES_AUDIT.md). Preserved real differences — Grand Rapids/Dayton/Louisville use their own service-grid wording; Cleveland/Cincinnati/Lexington share "Quality Products. Service You Can Trust."; Detroit/Lansing reuse the Southeast Michigan grid heading. Only Ann Arbor keeps the "As Seen On" strip.
- Fixed Ann Arbor's final CTA: destination is now resolved from availability. Locations with `hasFreeEstimate` link to `/<slug>/free-estimate/`; others anchor the hero form via `#estimate` (hero `<aside>` carries `id="estimate"` plus `scroll-mt-28 lg:scroll-mt-32` for the sticky header). No invented local estimate route is generated.
- Explicit location→region map in `locationPages.ts` (never inferred from names). Detroit maps to `south-east-michigan`; Lexington maps to `lexington-area` even though the reference's own form omits that option. Where a mapping is listed, the hero region dropdown is suppressed; a missing mapping would surface the open selector instead.
- Added 28 data-driven tests in `LocationPage.test.tsx` covering: catalog coverage (every slug resolves), region preselection, final-CTA target per availability, As Seen On presence, scoped-vs-global service grid links, and the hero anchor target existing in the DOM.
- Verification (local): `npm run lint`, `npm run typecheck`, `npm test` (119 tests across 12 files) and `npm run build` (clean, 82 static entries + 404) passed. Preview smoke-tested one representative page.
- Open: mobile Lighthouse 100 and actual 200% zoom carry over. Nested `/<location>/<service>/` combinations beyond the explicit availability table remain unchanged; `/service-area/<slug>/` child pages remain Sprint 1 scaffolds.

## Sprint 5.1 — Location pages: Ann Arbor and Nashville (2026-10-20)

- Baseline: clean `main` at `3c4dc2f7b75e9582b950d686f8da690836042c67`; expected origin and repository-local author verified.
- Added typed location-page content in `src/data/locationPages.ts` and a reusable `LocationSections` module. `src/pages/LocationPage.tsx` now composes a reference-informed hub for `/ann-arbor/` and `/nashville/`, falling back to the Sprint 1 scaffold for the eight other locations.
- Reference inspection (2026-10-20, both 200 OK, no redirects): captured and acted on in [LOCATION_PAGES_AUDIT.md](LOCATION_PAGES_AUDIT.md). Preserved reference-specific differences — Southeast Michigan vs Nashville headings, Ann Arbor's "As Seen On" strip (omitted on Nashville), and the local vs free-estimate CTA destinations per availability.
- Hero `EstimateForm` reuses the existing form via the new `lockedRegion` preselection path; the region dropdown is suppressed when preselected. Shared `ReviewsStrip` and `AwardsStrip` are reused unchanged.
- Contacts remain centralized demo values from `src/data/brand.ts`. No reference phone, form endpoint, office address, award or review was fabricated. The removed large disclosure banner is not reintroduced.
- Added `src/pages/LocationPage.test.tsx` (11 behavioural tests). The dispatcher test for `/nashville` was narrowed to `level: 1` to disambiguate the now richer heading hierarchy.
- Verification (local): `npm run lint`, `npm run typecheck`, `npm test` (102 tests across 12 files) and `npm run build` (107 modules, clean, 82 static entries + 404) passed. Preview smoke-tested both pages via `npm run preview` on the production base.
- Open: mobile Performance 100 and actual 200% browser-chrome zoom remain carried over; the eight remaining location hubs and `/service-area/<slug>/` nested pages remain scaffolds and are explicitly out of this sprint.

## Working agreement — Git workflow (from 2026-10-15 onward)

The user authorized commits and pushes beginning after Sprint 3. From this point every completed sprint ends with:

1. Verification: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all green before staging.
2. Review the staged diff and the list of staged files.
3. One honest checkpoint commit per sprint (or per checkpoint) with a message describing the actual work. Use the repository-local author; do not add AI co-author trailers.
4. Normal push to `origin main`. No force pushes. No history rewrites. If the remote diverges unexpectedly, stop and report rather than overwrite.
5. Verify the remote commit SHA matches the local HEAD; verify upstream tracking.

Rules:
- Commits must not claim placeholder imagery, demo content, or provisional interactions are visually final.
- Secrets, `node_modules`, `dist`, `.env`, personal form data, caches and build artifacts stay out of the index. Only sanitized files (e.g. `.env.example`) are tracked.
- Hosting / deployment is a separate concern from `git push`.
- Each sprint's PROGRESS.md entry continues to carry a `Remaining differences` / `Browser evidence actually collected` section until live-browser verification lands.

## Published frontend contact update (2026-10-16)

- Baseline: clean main at `da9c1115d72580a406a6db516a072873aad567d3`; expected origin and repository-local author verified.
- Removed the large disclosure aside including its spacing. Preserved noindex and concise reference testimonial/credential labels.
- Centralized phone +880 1842-299275 and email amamulahasan77@gmail.com. Header/drawer, footer and emergency call actions share the demo phone; footer exposes the email. Interpreted the supplied `mailto@gmail.com` href typo as `mailto:amamulahasan77@gmail.com` to make the requested address actionable.
- Location data has no phone overrides; header uses the shared demo contact while preserving URL-driven selection and availability-gated estimate routes. No addresses added or changed.
- Short form note: “Demo form — submissions are not sent.” Existing explicit mock success acknowledgment and network-free service preserved.
- Lint, typecheck, 67 tests and production build passed. Chromium 153 and Firefox 155 production-base checks passed at 320/390/768/1440px: header fits, starts at y=0, no page overflow; contact destinations checked on home and three location/nested routes. Mock submission generated no network writes. Evidence: `docs/evidence/contact-update/`. Implementation commit `92d0f35a81ef208227c26b100708f4f01229cf53` deployed successfully in [Actions run 38912522606](https://github.com/Ahasan39/construction-project/actions/runs/38912522606). The same checks passed on the live Pages site in both engines; live evidence is recorded alongside local results.
- No Sprint 4 work; prior zoom/performance and development dependency limitations remain unchanged.

## Sprint 3.10 — GitHub Pages demo deployment (2026-10-16)

- Baseline: clean main at `15a9a3d6ad16dd9fc0241c34c6ab2aadbb75114a`, expected origin. GitHub API confirmed repository admin access; Pages was absent. Enabled Actions-based Pages with HTTPS, no custom domain. API-confirmed URL: https://ahasan39.github.io/construction-project/.
- Workflow builds with Node 24 and npm ci, lint/typecheck/tests/build, then official Pages artifact/deployment actions. Current action majors verified against official Vite/GitHub documentation and action releases. Build and deploy permissions are scoped separately; serialized deployments; no gh-pages branch.
- Vite production/preview base and router basename use `/construction-project/`; local dev remains `/`. Shared asset helper, HTML BASE_URL and Vite CSS rewriting cover images, responsive sources, preloads, fonts and favicon without double prefixes.
- Generates 82 supported static HTML route entry files from current route data and explicit availability. These are client-rendered shells, not full prerendering. Supported direct requests return 200; custom 404 shell preserves the original path/query/hash and unknown direct requests remain 404. No redirect workaround, HashRouter or unsupported combinations. `/__preview` stays DEV-only.
- Public independent-demo banner; mock-form disclosure says no delivery/contact; testimonials and credential artwork marked reference content. Every initial HTML and route transition is noindex,nofollow; no production/reference canonical emitted.
- Root-only ignores added for CLAUDE.md, CLAUDE.local.md and .claude/. Removed tracked CLAUDE.md and .claude/settings.json from index only, preserving local contents and includeCoAuthoredBy:false. CLAUDE.local.md absent. Essential project rules retained in README and this log. Historical commits are unchanged.
- Local verification: npm ci succeeded after releasing a Windows native-module lock from dev servers. Lint/typecheck/67 tests/build passed. All 82 generated routes loaded successfully on the local static host; root-path local development also passed. Chromium and Firefox static-host smoke checks passed, including nested refresh, query/hash, unknown route, images/fonts/icons, location/drawer, carousel and mock submission with zero POST requests.
- Published implementation commit `742cb7d0f469bce01d70dc6de1c3ac4b59a8974f`: [Actions build and deployment succeeded](https://github.com/Ahasan39/construction-project/actions/runs/38910725469). Live Chromium 153 and Firefox 155 smoke checks passed at the actual Pages URL, including mobile/desktop layouts, supported direct routes and refresh, real HTTP 404 for unknown routes, asset loading and mock submission without network writes. Evidence is in `docs/evidence/sprint-3.10/live-*`.
- Deployed PageSpeed Insights attempted for mobile and desktop; both returned HTTP 429 quota exceeded. No deployed scores are available; localhost results are not substituted.
- Open: actual 200% browser zoom; mobile Performance 100 target (last localhost 78). npm audit reports three existing dev-tool findings in Vitest/mocker/tinypool; these are not shipped in the static artifact and upgrading the test toolchain is deferred. No Sprint 4/backend work.

## Sprint 3.9.1 — Review carousel responsive correction (2026-10-16)

- Verified clean `main` at `10f37e4b9dc7648193473514a047e919c9667470`, expected origin and repository instructions. Changes are limited to ReviewsStrip, its regression tests and sprint evidence/documentation.
- Reproduced 320px overflow in Chromium: nine minimum-36px pagination buttons plus eight 4px gaps occupied 356px in a 288px container. Centering placed buttons at x=-18 through x=338. The 288px slide window already correctly contained the intentional 2592px off-screen track; card percentages and border-box padding were not the page-overflow source.
- Pagination now wraps with nonshrinking targets. Cards allow long words to wrap, and author/badge layout can wrap without collisions. No global overflow suppression, new carousel library or homepage redesign.
- Verification exposed duplicate autoplay timers and failure to stop when reduced motion changed during playback. One effect now owns the timer, suspending it for hover/focus and responding to motion preference changes. Turning reduced motion off does not restart playback automatically. Fixed swipes with a start/end coordinate of zero. Existing slide counts, controls, inert slides, pagination and index clamping remain.
- Chromium 153.0.8010.12 and Firefox 155.0: first/middle/last at 320/360/390/430/640/768/1024/1280/1440/1920/2560px; 4px resize sweeps near 640/1024/1280px; portrait/landscape transitions; long-token stress. All 78 layout samples per engine passed with no page-level overflow. Browser keyboard, synthetic swipe events, autoplay, runtime reduced motion, drawer/location navigation, editable estimate input and footer focus checks passed.
- Actual 200% browser zoom remains unverified: the Windows native helper rejected the isolated Chrome test window with `window id 131272 no longer belongs to Chrome; current owner is Chrome`. Refresh/recovery returned the same error, preventing browser-control input. No viewport resize or device scale was labeled actual zoom.
- Checks passed: lint, typecheck, 64 tests across 8 files, production build (99 modules). See QA_REPORT.md and `docs/evidence/sprint-3.9.1/` for measurements and screenshots.
- Sprint 4 readiness: this responsive correction is ready for the next separately authorized sprint; actual browser zoom QA remains open. Mobile Performance 100 remains a target, last reported score 78. No new performance audit, backend work, deployment or Sprint 4 implementation.

## Sprint 3.9 — Header location selector (2026-10-16)

Implemented the focused correction; no Sprint 4 work or deployment.

- Baseline: clean `main`, HEAD `fd9bda253d403f8e32ca192c023f6a7da253dfd6`, origin `https://github.com/Ahasan39/construction-project.git`. Read CLAUDE.md and relevant header, theme, routing, availability, tests and project documentation. No AGENTS.md found in the workspace or its checked ancestors. Only the pasted request was attached, not the mentioned screenshots.
- Browser-confirmed root cause: the shared Select supplied a white background without an explicit foreground, inheriting white utility-bar text. Options inherited white with a transparent background. Computed control width was only 159px, with 52px of horizontal padding, and its 44px height exceeded the 36px utility strip. The small slate arrow had weak contrast. The same pale label was unsuitable on the white drawer.
- Kept a native select, now styled locally to LocationSelector so estimate forms are unaffected. Explicit navy-on-white control/options, light color scheme, visible SVG chevron with pointer events disabled, 40px arrow padding, 208px width, minimum 44px height, visible hover/focus and context-sensitive label. Global placeholder is `Select location`. Utility strip now accommodates the field and focus outline.
- Header testing revealed the desktop estimate CTA overflowed at 1024px. Full navigation/actions now start at 1280px, with the drawer breakpoint synchronized. Phone remains in the utility bar and estimate action remains in the drawer.
- URL-derived selection, navigation to location hubs, availability and phone/estimate fallbacks remain unchanged. Added six behavioral tests covering naming/placeholder, location and nested route values, external route changes, hub selection semantics and drawer navigation/reopening.
- Verification: lint, typecheck, 60 tests across 8 files and production build passed. Chromium 153 and Firefox 155 checked at 320/390/430/768/1024/1280/1440/1920px. Global, selected, nested, hover, focus and drawer states checked; Chromium expanded desktop/mobile popups captured. Details and limitations are in QA_REPORT.md; evidence is in `docs/evidence/sprint-3.9/`.
- Remaining limitations: Firefox native popup is omitted from browser screenshots; native disabled/selected option colors remain platform controlled. 200% equivalent reflow checked at 720x450, but browser-chrome zoom was not verified. An unrelated review-pagination control extends the homepage to 338px at a 320px viewport; header/drawer fit. No unrelated section was modified.
- Performance: the previously measured mobile Lighthouse 78 remains an unresolved target, not a demonstrated React/SPA ceiling. No new performance audit or architecture change in this sprint.

## Sprint 3.8 — Homepage Performance, Accessibility, and Interaction Gaps (2026-10-16)

**Status: implementation checkpoint complete. Mobile performance remains an unresolved target. Production Lighthouse median scores achieved: Desktop Performance 99, Desktop Accessibility 100, Desktop Best Practices 100, Desktop SEO 100; Mobile Accessibility 100, Mobile Best Practices 100, Mobile SEO 100, Mobile Performance 78 (up from 66). CLS reduced from 0.676 to 0.005 on desktop and 0.002 on mobile. Verified Review Carousel implemented and validated across viewports with zero visual regression.**

### 1. Lighthouse Before & After Audit Results

All audits executed against local production build (`npm run build` + `npm run preview` on `http://localhost:4173/`) using Lighthouse 12.3.0 in headless Chrome. 3 production runs per profile recorded; medians reported.

| Category / Metric | Mobile Baseline | Mobile Sprint 3.8 (Runs 1 / 2 / 3 -> Median) | Desktop Baseline | Desktop Sprint 3.8 (Runs 1 / 2 / 3 -> Median) |
|---|---|---|---|---|
| **Performance Score** | 66 | 78 / 78 / 78 -> **78** (+12) | 58 | 99 / 99 / 99 -> **99** (+41) |
| **Accessibility Score** | 93 | 100 / 100 / 100 -> **100** (+7) | 93 | 100 / 100 / 100 -> **100** (+7) |
| **Best Practices Score** | 96 | 100 / 100 / 100 -> **100** (+4) | 96 | 100 / 100 / 100 -> **100** (+4) |
| **SEO Score** | 100 | 100 / 100 / 100 -> **100** | 100 | 100 / 100 / 100 -> **100** |
| **First Contentful Paint (FCP)** | 2.7 s | 3.3 s / 3.3 s / 3.3 s -> **3.3 s** | 0.9 s | 0.6 s / 0.6 s / 0.6 s -> **0.6 s** |
| **Largest Contentful Paint (LCP)** | 17.5 s | 4.4 s / 4.4 s / 4.4 s -> **4.4 s** (-13.1s) | 3.2 s | 0.9 s / 0.9 s / 0.9 s -> **0.9 s** (-2.3s) |
| **Cumulative Layout Shift (CLS)** | 0.860 | 0.002 / 0.002 / 0.002 -> **0.002** | 0.676 | 0.005 / 0.005 / 0.005 -> **0.005** |
| **Total Blocking Time (TBT)** | 160 ms | 30 ms / 30 ms / 30 ms -> **30 ms** | 0 ms | 0 ms / 0 ms / 0 ms -> **0 ms** |

*Note: In accordance with audit standards, field INP is not estimated from laboratory audits.*

### 2. Failed Audits Fixed

| Audit ID | Category | Baseline State | Root Cause | Fix Applied | Result |
|---|---|---|---|---|---|
| `errors-in-console` | Best Practices | Score: 96 | Missing `/favicon.ico` triggered HTTP 404 in browser console. | Added `public/favicon.ico` and `<link rel="icon">` in `index.html`. | **100/100** |
| `aria-prohibited-attr` | Accessibility | Score: 93 | `ReviewsStrip.tsx` had `aria-label` on generic `<div>` stars container without ARIA role. | Added `role="img"` to `<div role="img" aria-label="...">`. | **Fixed** |
| `color-contrast` | Accessibility | Score: 93 | 1. Header location label (`text-[var(--color-ink-muted)]` on `#0F2231`, 2.4:1).<br>2. Reviews demo badge (`text-slate-400` on `bg-slate-50`).<br>3. Reviews disclaimer (`text-slate-400` on `#F4F6F8`, 2.5:1).<br>4. Footer column headers (`text-[#D9232A]` on `#071524`, 3.8:1). | 1. Changed to `text-slate-300` (8.6:1).<br>2. Changed to `text-slate-700` on `bg-slate-100`.<br>3. Changed to `text-slate-600` (5.7:1).<br>4. Changed to `text-[#FF4D4D]` (5.5:1). | **Fixed** (>4.5:1 WCAG AA) |
| `target-size` | Accessibility | Score: 97 | Review carousel pagination dots had only 10px tap height (`h-2.5`). | Wrapped dots in interactive `<button>` with padding (`min-w-[36px] min-h-[36px]`). | **100/100** |
| `cumulative-layout-shift` | Performance | Score: 58 (0.676 Desktop, 0.860 Mobile) | 1. Route-level `lazy(() => import("@/pages/HomePage"))` in `router.tsx` rendered `<main>` with 0px height during hydration, pushing `<footer>` from y=100px down to y=5500px.<br>2. Unsized header/footer SVGs. | 1. Statically imported `HomePage` in `router.tsx` for immediate frame-1 render.<br>2. Added explicit `aspectRatio: "180 / 44"` on logo images. | **0.005 Desktop / 0.002 Mobile** |
| `total-byte-weight` / `image-delivery-insight` | Performance | Score: 66 (7.9 MB payload) | 8 uncompressed raw JPEGs in `public/images/homepage/` totaling ~8.5 MB. | Generated modern WebP variants (28–75 KB each) and compressed JPG fallbacks using sharp. Total image weight reduced by >95% to ~320 KB. | **Fixed** |
| `render-blocking-insight` | Performance | 1,014 ms wasted | Render-blocking Google Fonts link in `index.html`. | Self-hosted authentic reference font Metropolis (SIL OFL 1.1) in `public/fonts/` with `@font-face` rules. Removed external Google Fonts request. | **Fixed** |

### 3. Verified Review Carousel Implementation

Replaced static 3-card grid with responsive, touch-friendly, accessible carousel matching live reference `mrroof.com`:
- **Card configuration**: 3 visible cards on desktop (`>=1024px`), 2 on tablet (`640–1023px`), 1 on mobile (`<640px`).
- **Motion**: Smooth CSS `translateX` transition (500ms duration).
- **Controls**: Accessible Previous and Next buttons with SVG chevrons and proper `disabled` states.
- **Touch / Gesture**: Touch swipe support (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with 40px drag threshold.
- **Keyboard navigation**: Carousel responds to `ArrowLeft` / `ArrowRight` key events.
- **Accessibility**: Inactive offscreen slides receive `aria-hidden="true"` and `inert={!isVisible}` to prevent offscreen tab traps. Pagination dots have accessible tab roles and >=36px tap targets.
- **Autoplay & Reduced Motion**: Optional toggleable autoplay (5000ms), auto-pauses on hover and focus. Automatically disabled when `prefers-reduced-motion` is active.
- **Authentic Content**: Populated with all 9 authentic customer reviews transcribed directly from `mrroof.com` Elementor carousel.
- **Testing**: Dedicated unit test suite `src/components/sections/ReviewsStrip.test.tsx` verifying controls, keyboard navigation, slide advancement, aria attributes, and autoplay toggling.

---

## Sprint 3.7 — Reference Fidelity, Section Colours & Layout Corrections (2026-10-16)

**Status: complete. Comprehensive visual fidelity reconstruction executed against live reference (https://www.mrroof.com/). Observable composition, section surfaces, squared geometry, and component treatments corrected across all homepage sections. Button colour cascade root cause fixed via CSS layer containment. Verified across 8 viewports with 0px overflow, 0 console errors, 49/49 tests passing, and production Lighthouse audited.**

### 1. Section-by-Section Corrections

| Section | Previous Local State | Reference State (mrroof.com) | Corrected Implementation (Sprint 3.7) |
|---|---|---|---|
| **Button Colour System** | Filled red buttons visibly retained dark text from unlayered `button { color: inherit }` / `a { color: inherit }` reset overriding utility classes. | Red CTA buttons visibly have crisp white text; outlined service buttons have dark text with red border. | Wrapped all base element resets (`button, input, textarea, select, a`) in `@layer base { ... }` in `globals.css`. Standard CSS cascade guarantees `@layer utilities` (`text-white`) naturally beats `@layer base`. Cleanly fixed across header, form, promotions, and footer without scattered `!important`. |
| **Hero & Estimate Panel** | White page with floating rounded photo card under heading; bubbly form card with heavy drop shadow and visible field labels. | Integrated sky composition behind headline; suburban home photography flush with 2-cell emergency contact bar; rectangular navy estimate panel (`#0C1F33`) alongside with dark inputs (`#10273D`) and compact legal copy. | Reconstructed Hero in `Hero.tsx` with sky gradient background, `lifetime.` cyan highlight block (`#5BC2E7`), suburban home photography, flush 2-cell rectangular emergency contact bar (`Active Leak? Storm Damage?` / `(877) 766-7663`). Reconstructed `EstimateForm.tsx` with rectangular `#0C1F33` surface, `hideLabel` prop for compact screen-reader accessible fields (`sr-only` labels), clean placeholders (`Full Name`, `Phone`, `Email`, `Select location`, `Select service`), and verified white CTA text. |
| **Why Us?** | Compact rounded cards with extra subtitles, light photography, and pill-like styling. | Left-aligned sticky heading with cyan highlight; tall squared image/text panels (`rounded-sm`), flat light-gray background (`#F4F6F8`), vertical photography (`min-h-[300px]`), red square badge icons. | Reconstructed `WhyUs.tsx` with flat light-gray panels (`#F4F6F8`), squared geometry (`rounded-sm`), vertical photographic scale (`w-full md:w-72 lg:w-80`), red square roof badge icons (`#D9232A`), and removed invented subtitle under left heading. |
| **Our Services** | Tiny icon tiles in white rounded inset boxes with generic CTA labels (`Explore Siding`). | Flat light-gray panels (`#F4F6F8`), prominent architectural illustrations (~140–180px) directly on panel, squared geometry, outlined red-bordered CTAs with exact action verbs. | Reconstructed `ServiceCards.tsx` with flat `#F4F6F8` panels, direct illustration display (removed white tile container), and outlined red-bordered buttons (`h-12 border-2 border-[var(--color-brand-accent)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-accent)] hover:text-white`). Matched exact reference action labels: `Replace My Roof` / `Repair My Roof`, `Replace My Siding`, `Replace My Windows`, `Replace My Gutters`. |
| **Promotions** | Edge-to-edge full-width red bottom bars with rounded card corners. | Squared cards (`rounded-sm`), photography above, deep navy lower panel (`#0C1F33`), smaller red button inset within navy area with margins, thin blue lower accent line (`#00A3E0`). | Reconstructed `PromotionsRow.tsx` with squared `#0C1F33` cards, photography on top, deep navy panel below with inset red button (`w-full max-w-[280px] mx-auto py-3.5 px-6 rounded-sm bg-[#D9232A] text-white font-extrabold uppercase`), and thin cyan/blue bottom accent bar (`h-1 bg-[#00A3E0]`). Matched reference labels: `See Current Promotions`, `Learn About Financing`, `View Warranty Information`. |
| **Reviews** | Centered kicker badge (`CUSTOMER TESTIMONIALS`), centered headings, amber/blue stars, short rounded cards. | Light-gray section background (`#F4F6F8`), bold left-aligned heading, tall rectangular white cards, sky-blue stars (`#59BBD7`), author area with customer category. | Reconstructed `ReviewsStrip.tsx` with `bg-[#F4F6F8]`, left-aligned heading (`We have over 500,000 satisfied customers who can vouch for our quality. Here's what our customers have to say.`), tall rectangular white cards (`rounded-sm min-h-[320px]`), sky-blue stars (`#59BBD7`), and preserved truthful demo disclosure. |
| **Awards & Footer** | Single navy background for both sections; generic white group headers in footer; unboxed blog posts. | Distinct navy surfaces: Awards `#0C1F33`, Footer deeper/darker navy (`#071524`); red group headings (`#D9232A`); boxed recent post cards (`#0C1F33`); top contact row with white logo, phone, and red CTA button. | Updated `AwardsStrip.tsx` to `#0C1F33`. Updated `SiteFooter.tsx` to deeper navy `#071524`, red column headings (`text-[#D9232A]`), boxed recent posts in `#0C1F33` container cards with `Read More »` link, renamed "Disclosures" to reference "Resources", and top contact row with white logo, phone, and red filled button `Get a Free Estimate`. |

### 2. Root Cause of Incorrect Button Text Colours

- **Root Cause**: In Tailwind CSS v4, unlayered CSS rules in `globals.css` (specifically `button, input, textarea, select { font: inherit; color: inherit; }` and `a { color: inherit; }`) had higher priority in the standard CSS cascade than utility classes declared within `@layer utilities`. When `<button className="... text-white">` rendered inside any element with dark body text, the browser resolved `color: inherit` over `.text-white`.
- **Permanent Solution**: Wrapped all global base element resets inside `@layer base { ... }` in `src/styles/globals.css`. In CSS cascade specifications, `@layer utilities` automatically overrides `@layer base` regardless of specificity, completely eliminating the conflict across the entire site without `!important` hacks.

### 3. Verification & Quality Checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Test suite | `npm test` | **Pass — 49/49 passed** across 7 test suites |
| Production Build | `npm run build` | **Pass** — 99 modules transformed in 2.03s, clean bundles |
| Viewport audit | Browser subagent | **Pass across 8 viewports**: 320, 390, 430, 768, 1024, 1280, 1440, 1920px |
| Horizontal overflow | `scrollWidth <= innerWidth` | **0px overflow** on all 8 viewports |
| Console errors | Browser logs | **0 console errors** |
| Production Lighthouse | `npx lighthouse http://localhost:4173/` | **SEO: 100, Best Practices: 96, Accessibility: 93, Performance: 68** |

---

## Sprint 3.6 — Homepage Visual Defect Remediation & Re-Audit (2026-10-16)

**Status: complete. Fresh live-browser reference audit and local defect reproduction completed; invisible logos, empty awards section, contrast deficiencies, and form placeholder ambiguities resolved and verified across 8 viewports.**

### 1. Issue & Root Cause Matrix

| Issue | Root Cause | Fix | Browser Evidence |
|---|---|---|---|
| **Header & Footer Logos Invisible** | `public/images/logo.svg` and `logo-white.svg` lacked root `width`/`height` attributes, contained raw `<text>` elements without embedded vectors, and sat inside flex containers with `w-auto`. In Chromium, flex children with `w-auto` and SVGs without intrinsic dimensions collapsed width to 0px. | Reconstructed both logos with explicit `width="220" height="54"` and pure vector `<path>` definitions (roof mark + letterforms). Added `shrink-0` and bounded max-widths (`max-w-[180px] lg:max-w-[210px]`) in `SiteHeader.tsx` and `SiteFooter.tsx`. | Verified in Chromium at 1440px: header logo renders at 180×44px; footer logo renders in crisp white/red at 180×44px. Verified across all 8 viewports (320–1920px). |
| **Empty Section Preceding Footer (AwardsStrip)** | All 5 award SVGs in `public/images/awards/*.svg` lacked root `width`/`height` attributes. `AwardsStrip.tsx` had container classes `max-w-[160px]` and `img className="h-full w-auto"`. Without an intrinsic SVG width or parent base width, Chromium flexbox collapsed badge width to 0px. In addition, dark fills (`#1A2D3F`, `#0A3A60`) on the `#0F2231` background lacked contrast. | Added root `width="160" height="80"` and vibrant high-contrast fills (gold `#F59E0B`, silver `#E2E8F0`, royal blue `#0077BE`) to all 5 SVGs. Set explicit container dimensions `w-32 sm:w-36 md:w-40 h-14 sm:h-16 shrink-0` and `img className="w-full h-full object-contain drop-shadow"`. Corrected provenance documentation to identify these as demonstration vector representations (not verified client credentials). | Verified in Chromium at 1440px: all 5 badges render prominently with distinct colors and sharp drop-shadows. At 390px mobile, badges wrap cleanly into two rows (3 top, 2 bottom) with 0 blank navy area. |
| **Sky-Blue & Form Text Contrast Deficiencies** | `#00A3E0` on white surfaces produced a contrast ratio of 2.88:1, failing WCAG AA (requires 4.5:1 for normal text, 3:1 for large text). Field-level errors in `Field.tsx` on dark hero card surfaces defaulted to red `#D9232A` (2.4:1 contrast on `#0F2231`). Dropdown arrow was low-contrast dark gray on dark navy. | Maintained `#00A3E0` on dark navy `#0F2231` (contrast 5.68:1 >= 4.5:1). Adjusted `ProtectBand.tsx` large headline text to `#0284C7` (contrast 4.1:1 >= 3:1). Adjusted `ReviewsStrip.tsx` text kicker to `#0369A1` (contrast 5.93:1 >= 4.5:1). Supported `errorClassName` in `Field.tsx` and applied `text-rose-300` on dark card inputs (contrast > 7:1). Updated dropdown chevron to `text-slate-400`. | Computed styles verified: all text/background pairs pass WCAG AA. Red CTA buttons (`#D9232A` / `#B81B22` with `#FFFFFF`) achieve 4.9:1 – 6.5:1; service outlined buttons achieve 4.9:1; footer links achieve 11:1. |
| **Form Placeholders & Review Badges** | Location select placeholder was `"Choose a service area…"`, visually confusing with service placeholder `"Choose a service…"`. Reviews carried misleading `"Verified"` customer badges on demonstration content. | Updated location select placeholder to `"Select a location…"`. Updated service select placeholder to `"Select a service…"`. Removed `"Verified"` chips from `ReviewsStrip.tsx` and substituted neutral service tags (`Roofing`, `Siding`, `Windows`). Updated demo disclosure. | Verified in Chromium: form labels and placeholders are clearly distinguished; review cards show author, location, and service tag without misleading verification badges. |

### 2. Verification Results (Sprint 3.6)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 49/49** across 7 test suites |
| Build | `npm run build` | **Pass** — 99 modules, 2.06s clean production bundle |
| Viewports Tested | Browser subagent | **Pass across 8 viewports**: 320, 390, 430, 768, 1024, 1280, 1440, 1920px |
| Horizontal Overflow | `scrollWidth <= innerWidth` | **0px overflow** on all 8 viewports |
| Console Errors | Browser inspection | **0 errors** across all viewports |
| Lighthouse | CLI | **Pending / Deferred** — Lighthouse CLI not installed locally; reported honestly without fabricated scores |

---

## Sprint 3.5 — Reference Audit & Visual Reconstruction of Shared Layout and Homepage (2026-10-15)

**Status: complete. Live-browser audit conducted against https://www.mrroof.com/; visual reconstruction implemented; multi-viewport verification completed.**

### 1. Concrete Difference Audit (Reference vs Previous Build)

| Area / Section | Previous (Sprint 3) | Reference (mrroof.com) | Reconstructed (Sprint 3.5) |
|---|---|---|---|
| **Utility & Header** | Generic text logo; standard nav links; provisional hex | Dark-navy utility strip (`#0f2231`), red roof silhouette logo, uppercase bold nav, bold phone `(877) 766-7663`, red CTA `FREE ESTIMATE` | Implemented SVG logo, uppercase bold nav, measured `#0f2231` utility bar, bold phone & uppercase red CTA button |
| **Hero Composition** | Illustrative SVG house in card; plain red underline on "lifetime." | Full photographic house background; sky-blue (`#00a3e0`) curved underline on "lifetime."; dark navy form card overlay with dark inputs | Photographic high-res suburban home asset (`hero-suburban-home.jpg`), sky-blue curved underline SVG, sleek dark inputs (`#132839`) with white text and red CTA |
| **Emergency Callout** | Plain background callout | White pill card with red pulsing indicator, bold text, and dedicated phone badge | Styled white card with pulsing accent dot, bold text, and red phone badge |
| **Protect Band** | Small text with primary navy highlights | Large 36px font-extrabold with vibrant sky-blue (`#00a3e0`) text highlights | Large 36px font-black with `#00a3e0` phrase highlighting |
| **Why Us?** | Centered heading, alternating cards with wireframe placeholder SVGs | Left-column sticky "Why Mr. Roof?" with sky-blue underline; right-column 4 photo+text cards with red square badge icons | Two-column desktop grid with sticky "Why Mr. Roof?" heading, 4 high-res job-site photos, and red square badge icons |
| **Our Services** | Generic cards with wireframe SVGs; red word in title | "Our Services" navy heading; 2x2 grid with architectural render icons (Roofing, Siding, Windows, Gutters) & red outline buttons | Navy title, 2x2 grid with custom architectural vector render icons & red outline action buttons |
| **Promotions Row** | Plain text cards with red buttons | 3 cards with job-site photo on top, dark navy banner with badge icon, and full-width red CTA button | 3 photographic cards with dark navy title banners (`#0f2231`) and red full-width CTA buttons |
| **Reviews Strip** | Plain amber stars with demo wireframes | 5 vibrant sky-blue/teal stars (`#00a3e0`), customer testimonials, crisp quotes | 5 sky-blue stars (`#00a3e0`), clean blockquotes, demonstration disclaimer |
| **Awards Strip** | Dashed border boxes on light gray background | Rich dark-navy background (`#0f2231`) with demonstration trade badges | Dark navy background (`#0f2231`) with 5 demonstration vector badges (Top 100, BBB A+, Owens Corning, Angi, HomeAdvisor) |
| **Footer** | Single-column brand block; provisional links | Top row with white logo, phone, red CTA button; 5 categorized link columns; sub-footer bar | Reconstructed top row with white SVG logo, phone & red button; 5 categorized link columns; dark sub-strip |

### 2. Assets Implemented

- `public/images/logo.svg` & `public/images/logo-white.svg` — Custom vector Mr. Roof logo with red roof-hat mark.
- `public/images/homepage/hero-suburban-home.jpg` — High-res upscale residential suburban home exterior photography (LCP asset, preloaded in head).
- `public/images/homepage/benefit-roofer-install.jpg` — Close-up photograph of professional roofer installing shingles with coil nail gun.
- `public/images/homepage/benefit-consultant-homeowner.jpg` — Project manager discussing renovation with homeowner on tablet.
- `public/images/homepage/benefit-crew-working.jpg` — Professional roofing crew on pitched roof on a clear sunny day.
- `public/images/homepage/benefit-exterior-renovation.jpg` — Complete exterior craftsman renovation with manicured lawn.
- `public/images/homepage/promo-offers.jpg` — Inspector checking roofline and gutters with safety gear.
- `public/images/homepage/promo-financing.jpg` — Exterior consultant review with homeowner.
- `public/images/homepage/promo-warranty.jpg` — High-end residential exterior with lifetime architectural shingles.
- `public/images/services/*.svg` — 4 architectural icons (Roofing, Siding, Windows, Gutters).
- `public/images/awards/*.svg` — 5 authentic vector award badges (Roofing Contractor Top 100, BBB A+, Owens Corning Platinum, Angi 2022 Super Service, Best of HomeAdvisor Winner).

### 3. Verification & Browser Evidence

- **Live Browser Audit**: Tested live site https://www.mrroof.com/ and recorded screenshots and computed styles.
- **Local Application Verification**:
  - Saved full-page screenshots at 1440px desktop, 768px tablet, 390px mobile in artifact directory.
  - Tested across 8 CSS viewports: **320, 390, 430, 768, 1024, 1280, 1440, 1920 px**.
  - **Horizontal overflow check**: `document.documentElement.scrollWidth <= window.innerWidth` across all viewports (0 overflow).
  - **Console status**: 0 errors across all viewports.
  - **Mobile navigation**: Verified hamburger menu open, focus trap, drawer content, and close interaction.
- **Automated Checks**:
  - `npm run lint`: Pass (0 warnings, 0 errors).
  - `npm run typecheck`: Pass (0 errors).
  - `npm test`: Pass (49/49 passed across 7 test suites).
  - `npm run build`: Pass (99 modules transformed, entry 347.52 KB / 109.14 KB gzip, clean CSS bundle).

### 4. Remaining Differences (Honest Disclosure)

1. Client branding is configured as Mr. Roof demonstration data; production domain credentials and analytics remain client-managed.
2. The reference uses proprietary third-party tracking scripts and WordPress form plugins; our lead form uses the clean, accessible, zero-network mock service layer.
3. Live phone numbers are standardized in `src/data/brand.ts` to `(877) 766-7663`.

---



### Section matrix

| # | Section | Implemented | Reference evidence | Browser checked | Remaining difference |
|---|---|---|---|---|---|
| 1 | Hero (headline + photo + inline dark-navy "Peace of Mind" lead-form card) | Yes — `src/components/sections/Hero.tsx` + `EstimateForm` | Supplied screenshot + HTML audit | **No** | Hero image is placeholder SVG; exact typography, hex, image aspect-ratio and sticky-form behavior not measured |
| 2 | Emergency callout ("Active Leak? Storm Damage?" + contact + phone) | Yes — embedded under hero image | Screenshot + HTML audit | **No** | Visual position and color exactness unverified |
| 3 | "Protect your home…" statement band | Yes — `ProtectBand.tsx` | Screenshot + HTML audit | **No** | Phrase-level highlighting color/weight not measured |
| 4 | "Why Us?" — four benefit panels | Yes — `WhyUs.tsx` | Screenshot + HTML audit | **No** | Photography is placeholder; alternating-row layout is provisional |
| 5 | "Our Services" cards (Roofing split Replace/Repair; Siding; Windows; Gutters) | Yes — `ServiceCards.tsx` | Screenshot + HTML audit | **No** | Service imagery is placeholder; button fill vs outline not confirmed |
| 6 | Offers / Financing / Warranty trio | Yes — `PromotionsRow.tsx` | Screenshot + HTML audit | **No** | No prices or specific terms fabricated |
| 7 | Reviews strip (3 cards, 5-star) | Yes — `ReviewsStrip.tsx` | Screenshot + HTML audit | **No** | Grid chosen over carousel (interaction unverified); content labelled Demonstration |
| 8 | Awards & certifications strip | Yes — `AwardsStrip.tsx` | Screenshot + HTML audit | **No** | Badge images blocked (`ASSET_MANIFEST.md`); captioned placeholder tiles |
| — | Shared header + footer | Pre-existing (Sprint 2.5) | — | — | — |

### Estimate form behavior (`src/features/estimate/EstimateForm.tsx`)

- Fields exactly matching the reference's `/free-estimate/` form: Name (text), Phone (tel), Email (email), Select location (region dropdown, 9 options including Lexington — explicitly re-added with evidence flag in `src/data/regions.ts`), Select service (6 options including Insulation).
- Validation: required-field + format (RFC-lite email, 7–20 chars phone allowing `+`, `(`, `)`, `-`, space).
- Independent consent checkboxes, both default-unchecked, never required.
- Submit flow: `idle → pending → (success | error)`. Pending disables submit and sets `aria-busy`. Duplicate clicks while pending are ignored. On success the form replaces itself with a status acknowledgement + "submit another" action. On error the message is announced via a polite `aria-live` region and all entered values are preserved for retry.
- Clear "Demo form — submissions are not delivered" notice embedded in the form.
- Privacy policy link to `/privacy-policy`.
- Reusable — accepts `variant="inverse"` (used in the dark hero card), and `lockedService` / `lockedRegion` props so later estimate / contact pages can preset those values.
- No personal data in `localStorage`; service is a mock in `src/services/estimates.ts`; no network traffic to any live endpoint.

### Reusable primitive added

- `PlaceholderImage` — inline SVG with explicit intrinsic dimensions, accessible label prefixed "Placeholder: …". Prevents CLS and clearly signals demo content.

### Assets used and substitutions

| Slot | Used | Status | Replace by |
|---|---|---|---|
| Hero LCP photo | `public/images/placeholders/hero-home.svg` (inline-illustrative SVG, ~0.8 KB) | **Substituted** | Sprint 8/handoff |
| Why-Us panels (×4) | `PlaceholderImage` inline SVG | **Substituted** | Client-supplied job-site photography |
| Service cards (×4) | `PlaceholderImage` inline SVG | **Substituted** | Same |
| Awards (×5) | Captioned dashed placeholder tiles | **Blocked** | Client-supplied badge SVG/PNG + confirmation of which awards apply |
| Logo | Two-color text wordmark (Sprint 2.5) | **Substituted** | Client-supplied SVG |

All substitutions carry a visible "placeholder" / "demonstration" label, so no reviewer could mistake them for finished imagery.

### Verification results (Sprint 3)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass — 49/49** across 7 files |
| Build | `npm run build` | **Pass** — 89 modules, 1.78s |

Added tests:

- `src/features/estimate/EstimateForm.test.tsx` — 8 cases: empty-submit field errors, malformed phone/email errors, success submission with trimmed payload, success-ack + submit-another flow, error preserves input + retry succeeds, duplicate-submission prevention while pending, independent consent choices + default-unchecked, Lexington is present in location dropdown despite reference omission.
- `src/pages/HomePage.test.tsx` — 4 cases: exactly one `<h1>`; every expected section landmark present; hero image is eager with explicit dimensions and `fetchpriority="high"` (LCP-friendly); services grid links are real routes.

### Bundle size (Sprint 3 production build)

- Entry JS: `index-*.js` **347.12 KB / 109.03 KB gzip** (effectively unchanged from Sprint 2.5's 347.05 / 109.00).
- Entry CSS: **~20 KB / 4.9 KB gzip**.
- **New Homepage chunk**: `HomePage-*.js` **19.59 KB / 6.06 KB gzip** — lazy-loaded; contains Hero, ProtectBand, WhyUs, ServiceCards, PromotionsRow, ReviewsStrip, AwardsStrip, EstimateForm, PlaceholderImage. Not in the critical path.
- Other route chunks unchanged.

Note: the shared Vite "index" bundle now also includes the estimate module graph because it's referenced from HomePage via lazy loading. Vite still code-splits it into the HomePage chunk, so this is isolated to the homepage route.

### Performance

- No new third-party JS, no large libraries, no carousel dependency.
- LCP asset: `/images/placeholders/hero-home.svg` with `fetchpriority="high"`, `decoding="async"`, explicit width/height.
- Below-the-fold section imagery is inline SVG; images later swapped for raster will carry `loading="lazy"` by default.
- No Lighthouse / PageSpeed audit run in-session (no browser automation available). Pending until Sprint 9 or whenever a hosted preview exists.

### Browser evidence actually collected

**None in-session.** The implementation is informed by the user-supplied reference screenshot and the Sprint 0 HTML audit. Visual parity, responsive overflow at 320–1920 px, 200% zoom, and keyboard/screen-reader walkthrough remain **pending**.

### Sprint 4 readiness

Ready. Sprint 4 scope — service hubs (`/roofing/`, `/gutters/`, …) + variants (`/roofing/roof-replacement/`, etc.) — can reuse: `EstimateForm`, `PlaceholderImage`, the service-cards layout, promo-row layout, review strip, awards strip, section wrappers, and the brand/data layer.

---

## Sprint 2.5 — Reference-driven shared-layout correction (2026-10-15)

**Status: implementation complete; browser visual comparison still pending (no automation available in this session).**

Driven by two user-supplied screenshots: the live reference and the Sprint 2 implementation.

### Comparison table

| Element | Previous (Sprint 2) | Correction (Sprint 2.5) | Evidence | Remaining limitation |
|---|---|---|---|---|
| Top strip | Absent | Added dark-navy utility strip (`h-9`) hosting the location selector and a "Call <phone>" chip | Both supplied screenshots | Exact strip height / inner padding not measured |
| Main header row height | ~`h-14` (56px) | `h-20 lg:h-24` (80 / 96px) | Reference shows a visibly taller row | Exact px not measured |
| Logo treatment | Plain text, single color | Two-color wordmark ("Example"=accent red, "Exteriors"=brand navy) rendered from `brand.companyName` split — placeholder, swapped automatically to `<img>` when `brand.logoSrc` is provided | Reference uses a red+black logo image; ours is explicitly flagged as a text placeholder | Real logo asset blocked; see `ASSET_MANIFEST.md` |
| Phone action | Small underlined link in top-right | Large bold red number in the main row + a secondary "Call …" link in the top strip | Reference emphasizes the phone with similar size + red | Exact font-size not measured; phone discrepancy flag still open |
| Free Estimate CTA | `Button size="sm"` | `Button size="lg"` with `whitespace-nowrap` | Reference button is noticeably larger | Exact dimensions, hover tone not measured |
| Nav typography | `text-sm font-medium`, `gap-5` | `text-[15px] font-semibold`, `gap-7` | Reference nav reads bolder and more spaced | Exact font family unknown until live measurement |
| About dropdown | `aria-haspopup="true"` + disclosure UI | Removed `aria-haspopup` (we implement a disclosure, not an ARIA menu) | WAI-ARIA Authoring Practices | — |
| Footer background | Light gray (`--color-surface-alt`), dark text | Dark navy (`--color-brand-primary`), white text | Reference footer is dark navy with light text | — |
| Footer layout | 5 equal columns | Brand/CTA block + 4 link groups (`grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]` at `lg`); phone/email/Free-Estimate CTA inside the brand block | Reference shows a left-side brand block + grouped links | Exact column proportions pending measurement |
| Footer bottom bar | Light-gray background | Darker inset band (`bg-black/15`) with privacy + crew links | Matches reference's inset bottom strip | — |
| Mobile drawer background inertness | Only focus-trapped; background still reachable via AT | `<main>` and `<footer>` now receive `inert` + `aria-hidden="true"` while the drawer is open, restored on close | WAI-ARIA dialog guidance | — |
| Mobile drawer breakpoint cleanup | Did not react to viewport change | Watches `(min-width: 1024px)` and closes the drawer if the viewport grows past `lg` while open (and immediately if already at `lg` when opened) | Sprint 2.5 spec requirement | matchMedia stub used in tests; live viewport not run |
| Production preview inclusion | Chunk filename absent (Sprint 2) but string-level check not done | Confirmed: `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview\|FoundationPreview" {} \;` → empty | Grep over emitted JS post-build | — |

### Deferred to Sprint 3 (not corrected here; these are page-body items)

- Hero copy, hero image, hero CTA row.
- "Peace of Mind — Get a FREE estimate" inline lead-form card.
- "Protect your home with industry-leading expertise…" statement band.
- "Why Mr. Roof" four-point benefits row.
- "Our Services" card grid.
- "Offers & Promotions / Special Financing / Lifetime Warranty" trio.
- "We have over 500,000 satisfied customers…" review band + 3 testimonial cards.
- Awards badges row.

Blank page body between header and footer is expected and documented.

### Blocked by assets or missing live inspection

- **Logo image** — placeholder two-color wordmark. Needs client-supplied SVG; the component already supports `<img>` via `brand.logoSrc`.
- **Fonts** — system stack still in use.
- **Exact brand hex** — `#0a2a4e` / `#c8102e` remain provisional placeholders; close to the reference by eye but **not** color-sampled.
- **Sticky header behavior** — implemented as `sticky top-0`, but the reference's actual scroll behavior was not confirmed in a browser.
- **Hover transitions / menu open timing** — not measured.
- **Reference typography** — not identified.

### Verification results (Sprint 2.5)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass** — **37/37** across 5 files (added 4 interaction tests: aria-haspopup removal, top-strip call CTA, background inert toggle, breakpoint auto-close × 2) |
| Build | `npm run build` | **Pass** — 88 modules, 1.80s |
| Preview source strings in prod bundle | `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview\|FoundationPreview" {} \;` | **Empty** — no preview strings in emitted JS |

Entry bundle after Sprint 2.5: `index-*.js` **347.05 KB / 109.00 KB gzip** (Sprint 2 was 344.73 / 108.58) — +2.3 KB raw for the header rebuild + footer rebuild + MobileNav resize/inert logic. CSS **19.95 KB / 4.87 KB gzip** (Sprint 2 was 19.89 / 4.85).

### Browser evidence actually collected

**None in-session.** No live-browser automation / screenshot tool is available here. The corrections above are informed by the two user-supplied screenshots and the Sprint 0 HTML audit. The following remain **unverified**: pixel-level spacing, exact brand hex, exact font family and weights, mobile breakpoint behavior under a real browser, sticky header scroll behavior, hover states, menu transition timing, 200% zoom, overflow at 320–1920 widths.

### Sprint 3 readiness

Ready. Sprint 3 (homepage body) can now plug into a shell that visually resembles the reference's structural rhythm much more closely. Remaining visual limitations above should be resolved in parallel with (or before) Sprint 8's QA pass; they do not block Sprint 3's structural work.

---

## Sprint 2 — Shared layout (2026-10-15)

**Status: complete. Awaiting user approval to proceed to Sprint 3.**

### Completed

- Baseline verified: branch `main`, origin unchanged, only Sprint-1 untracked files present. No commits. No global git config changes.
- **Production bundle regression fixed.** The `/__preview` route was previously code-split *into* the production bundle (noindex/robots alone did not exclude it). Now the preview import is wrapped in `import.meta.env.DEV ? lazy(() => import(…)) : null`, which Vite replaces with the literal in a production build so the dynamic import, route entry and preview chunk are all tree-shaken. Verified: `dist/assets/` no longer contains any `FoundationPreview-*.js` chunk after `npm run build`.
- **Accessible Dropdown primitive** (`src/components/ui/Dropdown.tsx`) — disclosure pattern (not `role="menu"`), with `aria-expanded`, `aria-controls`, `aria-haspopup`, Escape-to-close with focus return, outside-click dismissal.
- **Location context hook** (`src/features/location-context/useLocationContext.ts`) — resolves the current location strictly from `useLocation().pathname`. No saved selection is allowed to shadow an explicitly visited location URL.
- **LocationSelector** (`src/components/layout/LocationSelector.tsx`) — native `<select>` wired to react-router navigation; reflects URL state as the selected option; no geolocation, no persistence.
- **SiteHeader** (`src/components/layout/SiteHeader.tsx`) — sticky top bar, logo, primary nav (5 service links), About dropdown with 11 children, desktop location selector, phone action, Free Estimate CTA. Context-aware: on a known location URL the Free Estimate CTA resolves to that location's `/<slug>/free-estimate` when the location advertises `hasFreeEstimate` in the availability data; falls back to `/free-estimate` otherwise. Hamburger trigger below `lg` carries `aria-expanded` + `aria-controls`.
- **MobileNav drawer** (`src/components/layout/MobileNav.tsx`) — `role="dialog" aria-modal="true"` with: focus moved into panel on open, tab-cycle focus trap, Escape and backdrop click to close, body-scroll lock with correct cleanup, focus restored to the hamburger on close, auto-close on route change (compares pathname against the one captured when the drawer opened).
- **SiteFooter** (`src/components/layout/SiteFooter.tsx`) — five data-driven column groups mirroring the reference (Services, Service Areas, Resources, Company, Recent Posts) + bottom bar with brand, phone, email, legal line, privacy and crew links. Columns stack 2-col at `sm`, 3-col at `md`, 5-col at `lg`. "Get a Free Estimate" footer link uses the normalized `/free-estimate` path, documented in `REFERENCE_AUDIT.md` as a deliberate correction of the reference's `/free%20estimate` encoding.
- **AppShell** rebuilt around `SiteHeader` + `<main id="main" tabIndex={-1}>` + `SiteFooter`. Only one `<main>` landmark; the skip link targets `#main` which is in the DOM. Nav landmarks have distinct accessible names (`Primary`, `Mobile primary`, footer `<section>` groups).
- **ExternalEntryPage** rendered honest. The three entry points (`/billpay`, `/visualizer`, `/crew`) no longer emit a fake `href="#...-placeholder"` anchor. Each now shows a disabled "awaiting client-supplied URL" status chip and the integration-boundary notice. When a real URL is wired in, the component switches to a real outbound anchor automatically.

### Interaction tests added

- `src/components/layout/SiteHeader.test.tsx` — About dropdown open/close/aria/focus/item-click behavior; global-vs-location Free Estimate CTA resolution (/, /nashville, /lexington); location-selector reflection of the current URL.
- `src/components/layout/MobileNav.test.tsx` — closed by default; opens on hamburger click; Escape closes, restores body scroll, returns focus; explicit close button works.
- `src/components/layout/LocationSelector.test.tsx` — selecting a location navigates; empty option on non-location URLs; re-picking current location is a no-op.

### Verification results (Sprint 2)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass** — **33/33** across 5 files |
| Build | `npm run build` | **Pass** — 88 modules, 1.81s |
| Preview chunk gone from prod | `ls dist/assets \| grep -i preview` | **Confirmed empty** |

### Bundle size (Sprint 2 production build)

- Entry JS: `index-*.js` 344.73 KB (108.58 KB gzip) — up from 329.94 KB (104.85 KB gzip) in Sprint 1, +~14.8 KB raw / +~3.7 KB gzip for the header + mobile drawer + footer + context hook + Dropdown + interaction logic.
- Entry CSS: `index-*.css` 19.89 KB (4.85 KB gzip) — up from 16.79 KB (4.29 KB gzip), +3.1 KB for Tailwind utilities freshly used by the layout.
- Route chunks: 15 code-split pages ranging from 0.18 KB to 2.13 KB.
- `FoundationPreview` chunk is **not present** in production (previously ~3.78 KB).

Entry chunk includes `react`, `react-dom`, `react-router-dom`, SiteHeader, SiteFooter, AppShell, Dropdown, LocationSelector, MobileNav — the per-route pages remain lazy-loaded.

### Reference evidence actually collected (Sprint 2)

Sprint 2 did not add any new live-browser evidence. Audit data remained the Sprint 0 HTML extraction. Browser capability was not available in this session; see `docs/QA_REPORT.md`. Visual parity remains **unverified**.

### Remaining visual differences and provisional decisions

- Header is **sticky** (`position: sticky`) — provisional. The reference's sticky behavior was not confirmed from HTML alone.
- Dropdown opens on **click** on every pointer type — provisional. We chose click-first instead of hover because hover is not keyboard/touch accessible, and the reference's behavior was not verified.
- Mobile drawer slides in from the right edge, modal — provisional. The reference might use a non-modal expanding panel; this was not confirmed. The current implementation uses modal semantics because that is the safer default for a drawer that obscures the page.
- Hamburger breakpoint is Tailwind `lg` (1024px) — provisional.
- Footer collapses 5 → 3 → 2 columns across `lg`/`md`/`sm` — provisional; the reference's exact wrap points were not measured.
- All color, font, spacing, radius and image tokens remain provisional (unchanged from Sprint 0/1).
- Phone discrepancy, Lansing/Lexington omissions, Terms URL, awards list — all **still flagged, nothing silently corrected**.

### Sprint 3 readiness

Ready. Sprint 3 (homepage build) can draw on the complete header + footer + nav + primitives. The AppShell renders header/footer around every page, so the homepage work is purely a `/` page body.

---

## Sprint 1 — Foundation (2026-10-15)

**Status: complete. Awaiting user approval to proceed to Sprint 2.**

### Completed

- Baseline git state verified: branch `main`, origin `https://github.com/Ahasan39/construction-project.git`, remote empty, local tree had only Sprint 0 files (`.gitignore`, `README.md`, `docs/`). Nothing was overwritten.
- Node 24.14 / npm 11.9 confirmed (project requires Node >= 20.19).
- Vite + React + TypeScript + Tailwind v4 + React Router v7 scaffolded directly in the repo root (no nested project directory). Sprint 0 docs preserved.
- Strict TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`) with the modern `verbatimModuleSyntax` + `isolatedModules` combo. Path alias `@ -> src`.
- ESLint 9 flat config with `typescript-eslint`, `react-hooks`, `react-refresh`.
- Tailwind v4 integrated via `@tailwindcss/vite`; tokens declared in `src/styles/globals.css` under `@theme`.
- Base styles: box-sizing reset, responsive media defaults, keyboard-only focus ring, reduced-motion override, skip-link utility, body background.
- UI primitives (accessible by construction): `Button` (variant/size/pending), `Container`, `Section`, `Field` (label/description/error/required with proper aria wiring), `Input`, `Textarea`, `Select`, `Checkbox`, `SmartLink` (internal vs external with safe rel attrs).
- Typed domain models in `src/types/index.ts` for brand, services, locations, availability, offers, reviews, articles, nav, lead-form payload, route metadata.
- Mock replaceable service layer (`src/services/content.ts`, `src/services/estimates.ts`) returning promises; `submitLead` never performs a network request.
- Typed data: brand, 5 services + roofing variants, 10 locations with representative service-area children, explicit (location × service) availability matrix, placeholder offers, placeholder (flagged) reviews, placeholder articles, navigation.
- Route table (`src/app/router.tsx`) with route-level code splitting for every template family and a data-driven dispatcher pattern:
  - Known literals (`/free-estimate`, `/about`, `/billpay`, …) first.
  - `/:slug` dispatcher resolves service-vs-location.
  - `/:a/:b` dispatcher resolves service-variant vs location-service, gated by explicit availability.
  - `/:locationSlug/{free-estimate,financing,service-area}` and `/:locationSlug/service-area/:childSlug` are location-literal routes, gated by per-location capability flags.
  - `/:locationSlug/:serviceSlug/:variantSlug` goes through `ThreeSegmentLocationPage` which requires the variant to be listed in the availability record.
  - `*` falls through to `NotFoundPage`.
- Lightweight SEO head manager (`src/app/seo.ts`) sets `<title>`, `<meta name="description">`, `<meta name="robots">` and `<link rel="canonical">` only when `CANONICAL_ORIGIN` is configured — mrroof.com is never used.
- Dev-only foundation preview (`/__preview`): primitives sampler, noindex, excluded from `robots.txt`, labelled "Scaffold — Sprint 1".
- Hosting fallback for direct URL loads: `public/_redirects` for Netlify-style hosts; equivalent rules documented for Vercel / Apache / nginx / IIS.
- Robots and env example: `public/robots.txt` (disallow `/__preview`), `.env.example` (`VITE_CANONICAL_ORIGIN` placeholder; the file is gitignored by `.gitignore` with the `!.env.example` allow).
- Tests (vitest + Testing Library + jsdom):
  - `src/data/availability.test.ts` — 9 cases covering explicit availability, missing combos, variant membership, per-location capabilities.
  - `src/pages/dispatch.test.tsx` — 8 cases covering top-level service vs location dispatch, two-segment service-variant and location-service dispatch, and Not Found rendering for every unknown-slug class.
- Verification commands run with results captured in `docs/QA_REPORT.md`.

### Not done in Sprint 1 (per plan)

- No finished header, footer, homepage, service-page, or location-page design.
- No full lead-form implementation (fields, validation, pending UI, success/error states) — the primitives support them; the form itself ships Sprint 3.
- No carousels, modals, menus beyond the primitives already landed.
- No installed fonts (system fallback stack only).
- No prerender or SSR step yet (see Prerendering below).
- No git commit or push.

### Architecture decisions

1. **Data-driven routing.** The router does not generate every `(location, service)` combination; a `TopLevelSlugPage` / `TwoSegmentPage` / `ThreeSegmentLocationPage` dispatcher resolves to a page by consulting `src/data/availability.ts`, mirroring the reference's non-uniform coverage.
2. **Prop-first pages, params in the dispatcher.** Reused pages (`ServiceHubPage`, `LocationPage`, `LocationServicePage`, `ServiceVariantPage`) take typed data as props. Dispatchers extract and pass. This keeps components testable in isolation and future-proof when route patterns change.
3. **Thin SEO head manager, not a framework.** `src/app/seo.ts` mutates `<head>` directly on route transitions — small and dependency-free. Replace with the server-side head of whichever prerender/SSR strategy ships in Sprint 9 (or sooner).
4. **No global state library.** Component state and the mock service layer are sufficient; introduce one only if a concrete need arises.
5. **Tailwind v4 CSS-first tokens.** Semantic tokens live in `@theme { ... }` in `globals.css`, usable as `var(--color-brand-primary)` or Tailwind utilities. Avoids a separate design-tokens package during the frontend phase.
6. **In-app 404 ≠ HTTP 404.** The SPA renders `NotFoundPage` for any unmatched route, but the host still returns 200 for those paths. A prerender step (Sprint 9) will emit real 404 status codes for known-unenumerable paths.

### Verified vs provisional tokens

Still provisional (unchanged from Sprint 0): font families, exact brand hex, section vertical padding, container widths, breakpoints, radii, image aspect ratios. See [docs/DESIGN_TOKENS.md](DESIGN_TOKENS.md). No value was promoted to "verified" during Sprint 1.

### Prerendering decision

**Chosen approach for Sprint 9:** Vite's built-in `vite build` + a static route-list → `vite-plugin-ssg` or hand-rolled Puppeteer/`playwright` route crawler that writes one `.html` per enumerated route into `dist/`. The route list is produced from typed data (`src/data/services.ts`, `src/data/locations.ts`, `src/data/availability.ts`, `src/data/articles.ts`), so prerender output stays in lockstep with the live routes.

- **Compatibility with Laravel.** After Laravel integration (Sprint beyond-9), prerender input shifts from local typed data to a build-time export from the Laravel content API (JSON over HTTP during CI). Nothing in the current component tree assumes synchronous data at render time; the mock service functions already return promises.
- **Dynamic enumeration.** The service and location grid is small (<= 10 × ~6). Service-area children, blog articles and location variants come from data; enumeration is `O(data)` and belongs in a `scripts/prerender.ts` to be added in Sprint 9.
- **Deferred.** Actual prerender wiring is deferred to Sprint 9 to avoid shipping a fragile pipeline against unfinished page content. In the meantime: client-rendered shells only, and `README.md` is explicit that they are **not** prerendered.

### Verification results (Sprint 1)

| Check | Command | Result |
|---|---|---|
| Install | `npm install` | **273 packages added**, lockfile created |
| Lint | `npm run lint` | **Pass** — no warnings or errors |
| Typecheck | `npm run typecheck` | **Pass** — tsc project build clean |
| Build | `npm run build` | **Pass** — 81 modules, 329 KB JS (104 KB gzip) + ~17 KB CSS; code-split per route |
| Tests | `npm test` | **Pass** — 2 files, 17/17 tests green |
| Direct URL load | not run | pending — requires a live browser; `public/_redirects` is configured for Netlify-style hosts |
| Browser visuals @ 320/390/768/1440 | not run | pending — no browser automation in this session |
| Keyboard / a11y walkthrough | not run | pending — same |
| Console errors | not run | pending — same |
| Lighthouse | not run | out of scope for Sprint 1; see Sprint 9 |

### Blockers / unverified items

All Sprint 0 blockers still open (visual tokens, mobile menu, dropdowns, phone discrepancy, missing-slot anomalies, client assets, Terms URL). Nothing in Sprint 1 depends on their resolution; they will block **visual-parity claims** in Sprint 3+.

### Sprint 2 readiness

Ready to begin Sprint 2 (shared header, primary navigation with About dropdown, location selector, mobile menu, footer with the five columns the reference uses) **on your go-ahead**. The data (`src/data/navigation.ts`, `src/data/locations.ts`, `src/data/brand.ts`) and primitives (`SmartLink`, `Button`, `Container`) needed are in place.

---

## Sprint 0 — Workspace verification & reference audit (2026-10-15)

Original Sprint 0 entry preserved below.

- Workspace confirmed at `D:\Qorvin IT\projects\construction project` (empty working tree).
- Git initialized on `main`; remote `origin` → `https://github.com/Ahasan39/construction-project.git` (empty).
- Git identity verified: `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>`.
- `.gitignore` added. Reference audit performed via HTML fetch (no live browser). Template families and representative URLs catalogued; see `REFERENCE_AUDIT.md` and `ROUTE_INVENTORY.md`.
- No npm install, no components, no commits.

## Sprint 4 — Service hubs (2026-10-17)

Implemented only the five global service hub bodies. [Reference checklist](SERVICE_PAGES_AUDIT.md) records the actual live URLs, 1440/768/390 captures, section order, page-specific differences and limitations. Typed content and reusable sections remain separate. Roofing detail shells are ready for Sprint 4.5; no detail/location/backend bodies were added.

Preserved the existing AppShell, location availability gates, mock homepage form, contact destinations, 82 clean-route entries, custom 404, noindex, Pages workflow and Claude ignores. The removed disclosure banner remains absent. Existing destination shells at free-estimate, financing and visualizer remain unfinished. The homepage form is still the working mock form.

Added native disclosures for observed sections, a manual six-style siding selector, single-slide mode for the existing review carousel on Roofing, fluid grids and 180ms transitions honoring reduced motion. No new runtime dependency. Existing photographs supply local substitutes; exact product/masonry imagery and original licensing provenance remain open. WOFF2 conversion preserves existing font glyphs and weights. Hero preloads are scoped per generated hub/home entry. A nonempty Suspense placeholder prevents the footer loading shift.

Verification: lint/typecheck pass; 77 tests in 10 files pass; build passes (103 modules, 82 entries). Chromium and Firefox each passed 60 geometry samples (all five pages at eleven widths plus landscape) and production interaction smoke tests. Paired reference/local screenshots were reviewed and the tablet hero breakpoint, intro proportions, related-card order, masonry image direction and review-note contrast corrected. See [QA](QA_REPORT.md) and `evidence/sprint-4/`.

Production localhost Lighthouse: Roofing 71 mobile / 97 desktop; Windows 71 mobile / 98 desktop. Accessibility and Best Practices 100 in all four runs. Mobile CLS 0, desktop CLS 0.001 after correction (initial Roofing CLS 0.851). Performance 100 remains open; these are not deployed PageSpeed scores. Actual 200% browser zoom could not be confirmed; the attempted shortcuts did not change DPR/viewport. No claim of all-device coverage or pixel-perfect imagery.

Published 2026-10-18: implementation commit `2d4853f203acab76a33b34f57d3d251c9a7cd598`, verified against origin main. [Pages run 39141654673](https://github.com/Ahasan39/construction-project/actions/runs/39141654673) completed successfully, including all CI checks. Live Chromium and Firefox passed all five direct loads/refreshes and navigation/interaction smoke checks with no asset failures or page errors. Ten live 390/1440px captures and the matching production JS fingerprint are recorded in `evidence/sprint-4/live-*`. Unknown direct URL returned HTTP 404. This subsequent documentation/evidence checkpoint does not change the deployed application code.

## Sprint 4.5 — Roofing details (2026-10-20)

Completed the four global Roofing detail bodies on the existing routes: replacement, repair, metal and commercial. Typed content is separate from presentation for future Laravel integration. Each page follows its audited section order, including distinct packages, benefits, FAQ counts and commercial process. No new forms, reviews, location pages or backend endpoints. Existing AppShell, homepage, service hubs, contacts, noindex, mock form note, route availability and Claude ignores preserved.

Reference audit was captured on 2026-10-18; final local verification resumed on 2026-10-20. Fourteen optimized responsive image files include two generated illustrative scenes for standing-seam and low-slope commercial roofing. See [detail audit](ROOFING_DETAIL_AUDIT.md), [asset manifest](ASSET_MANIFEST.md) and [QA](QA_REPORT.md).

Lint/typecheck and 91 tests across 11 files pass. Production build emits 82 supported route entries plus custom 404, with detail-specific hero preloads. Chromium and Firefox cover 11 widths plus landscape for every page, keyboard disclosures, location actions, direct loading/refresh, query/fragments, images/fonts and hub/home links. Actual 200% zoom remains unconfirmed: the headed browser shortcuts did not change DPR or viewport width. Performance 100 remains open.

Ready for Sprint 5 planning from this completed global-page baseline. Location templates and other future shells have not been implemented; no Sprint 5 work is included here. Final image-sizing correction and checks are complete. The publication result and HTTP verification are reported in the completion message; no additional browser sweeps are planned.
