# QA Report

A living record of every verification performed. Checks are not marked passed unless they were actually run.

## Sprint 3 (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** (one unused-import fixed on the way) |
| Build | `npm run build` | **Pass** — 89 modules, 1.78s |

### Tests (vitest + jsdom + Testing Library)

**49/49** passed across 7 files. New files this sprint:

- `src/features/estimate/EstimateForm.test.tsx` (8 cases) — see Sprint 3 PROGRESS.md for list.
- `src/pages/HomePage.test.tsx` (4 cases) — single `<h1>`, section landmarks, LCP-friendly hero image, real service hrefs.

### Build output

- Entry JS 347.12 KB / 109.03 KB gzip; entry CSS 19.95 KB / 4.87 KB gzip.
- Homepage chunk `HomePage-*.js` 19.59 KB / 6.06 KB gzip, lazy.
- No preview strings in emitted JS (`find dist -name '*.js' -not -name '*.map' …` empty).

### Not run (recorded as pending)

- Live browser inspection of the homepage at 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px — no browser automation in session.
- Visual match against the live reference homepage.
- Keyboard walkthrough of the full form in a real browser.
- Screen-reader announcement of the `role="status"` region on submission.
- 200% zoom.
- Reduced-motion end-to-end.
- Lighthouse / PageSpeed audits.

Interaction tests cover field-level errors, pending/busy state, duplicate-submission prevention, success-ack lifecycle, error-preserves-input retry, and independent consent choices under jsdom. They do **not** prove responsive layout, visual spacing, real-browser form UX, or Lighthouse scores.

## Sprint 2.5 (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Build | `npm run build` | **Pass** — 88 modules, 1.80s |

### Tests (vitest + jsdom + Testing Library)

**37/37** passed across 5 files (up from 33). New / updated cases:

- `SiteHeader.test.tsx` — gained: *About trigger carries no aria-haspopup* (disclosure, not menu); *top strip renders a Call <phone> link*.
- `MobileNav.test.tsx` — gained: *inerts `<main>` and `<footer>` on open and restores on close*; *auto-closes when the viewport is already at desktop at open time*; *auto-closes when a resize crosses the lg breakpoint while open*. matchMedia is stubbed with a controllable "matches" + a captured handler so the resize edge can be driven synchronously.

### Build-output verification

- `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview|FoundationPreview" {} \;` → **empty**. The DEV-only gating removes both the chunk and the identifier from emitted JS; source-map strings are inherently irrelevant for production serving.
- Entry sizes: `index-*.js` 347.05 KB / 109.00 KB gzip; `index-*.css` 19.95 KB / 4.87 KB gzip.

### Not run (recorded as pending)

- Live browser inspection at 320 / 390 / 768 / 1024 / 1440 px — no automation available.
- Visual match against the live reference at matching viewport sizes.
- 200% zoom.
- Keyboard-only walkthrough.
- Screen-reader output.
- Console error check in a running browser.
- Sticky header scroll behavior.
- Hover transitions.
- Lighthouse / PageSpeed (Sprint 9).

The two user-supplied screenshots informed the structural corrections (top strip, taller main row, bigger phone, bigger CTA, dark-navy footer). Static images cannot verify sticky, hover, menu transitions, or responsive breakpoint behavior; those remain pending.

## Sprint 2 (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors after fixing a `react-hooks/exhaustive-deps` ref-capture warning in `MobileNav.tsx` |
| Typecheck | `npm run typecheck` | **Pass** |
| Build | `npm run build` | **Pass** — 88 modules, 1.81s |

### Tests (vitest + jsdom + Testing Library)

33/33 across 5 files:

- `src/data/availability.test.ts` — 9 cases (unchanged)
- `src/pages/dispatch.test.tsx` — 8 cases (unchanged)
- `src/components/layout/SiteHeader.test.tsx` — 9 cases: About dropdown aria + open/close/Escape/focus/outside-item-click; global vs location Free Estimate CTA (/, /nashville, /lexington); location-selector URL reflection.
- `src/components/layout/MobileNav.test.tsx` — 4 cases: closed by default; opens on hamburger click + body-scroll lock; Escape closes + restores scroll + focuses trigger; explicit close button.
- `src/components/layout/LocationSelector.test.tsx` — 3 cases: navigate on change; URL as source of truth on re-pick; empty option on non-location URL.

### Build-output verification

- `dist/assets/` enumerated after `npm run build`: no `FoundationPreview-*.js` chunk present (previously 3.78 KB). Confirms `/__preview` is tree-shaken from production.
- Bundle sizes (production): entry `index-*.js` 344.73 KB / 108.58 KB gzip; CSS `index-*.css` 19.89 KB / 4.85 KB gzip; 15 route-split page chunks (0.18–2.13 KB each).

### Not run (recorded as pending)

| Check | Reason |
|---|---|
| Browser smoke @ 320/360/390/430/768/1024/1280/1440/1920 | No live browser automation / screenshot tool in session |
| Visual match against reference | Same |
| Real keyboard / screen-reader walkthrough | Same |
| Browser console errors | Same |
| Dev-server smoke | Same |
| 200% zoom | Same |
| Reduced-motion end-to-end | Same |
| Lighthouse / PageSpeed | Out of scope until Sprint 9 |

Interaction tests cover ARIA attributes, focus restoration, body-scroll lock, and route-driven state in jsdom; they do **not** prove responsive layout, visual spacing, or real screen-reader output. These remain pending.

## Sprint 1 (2026-10-15)

### Baseline / Git

| Check | Tool | Result |
|---|---|---|
| Working directory | PowerShell `Get-Location` | `D:\Qorvin IT\projects\construction project` — confirmed |
| Branch | `git branch --show-current` | `main` |
| Remote | `git remote -v` | origin → `https://github.com/Ahasan39/construction-project.git` |
| Remote branches | `git ls-remote --heads origin` | empty — no history to preserve |
| Working tree before Sprint 1 | `git status --short` | three untracked entries from Sprint 0 only: `.gitignore`, `README.md`, `docs/` |
| Identity | `git config user.{name,email}` | `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>` |
| Global config changes | — | None performed |

### Install

| Check | Command | Result |
|---|---|---|
| Dependencies | `npm install --no-audit --no-fund` | **273 packages added** in ~1 min, lockfile created |
| Node | `node --version` | `v24.14.0` (project requires >= 20.19) |
| npm | `npm --version` | `11.9.0` |

Resolved versions of top-level packages (from `package-lock.json`):

- react@19.3.1
- react-dom@19.3.1
- react-router-dom@7.18.4
- vite@6.4.4
- @vitejs/plugin-react@4.7.0
- tailwindcss@4.3.3
- @tailwindcss/vite@4.3.3
- typescript@5.9.3
- typescript-eslint@8.71.2
- eslint@9.39.5
- vitest@3.2.7

### Static checks

| Check | Command | Result |
|---|---|---|
| ESLint | `npm run lint` | **Pass** — 0 warnings, 0 errors (after fixing one triple-slash reference and one `react-refresh/only-export-components` warning in `router.tsx`) |
| TypeScript | `npm run typecheck` | **Pass** — strict project build clean (after switching `vite.config.ts` to `defineConfig` from `vitest/config` for the `test` field) |
| Production build | `npm run build` | **Pass** — 81 modules transformed, built in 1.66s. Route-split chunks per template; main bundle 329.94 KB JS (104.85 KB gzip) + 16.79 KB CSS (4.29 KB gzip). |

### Tests

| Check | Command | Result |
|---|---|---|
| Vitest | `npm test` | **Pass** — 2 files, **17/17 tests** green in ~1.4s |

Covered:

- `src/data/availability.test.ts` — 9 cases: explicit availability (`nashville/siding`, `nashville/windows`), unavailable combos (`ann-arbor/siding`, `lexington/*`), variant membership (`nashville/roofing/commercial-roofing` vs `nashville/roofing/metal-roofing`), per-location capability flags, undefined lookup, dataset not empty.
- `src/pages/dispatch.test.tsx` — 8 cases: top-level slug dispatch (service hub, location hub, unknown), two-segment dispatch (service variant OK, unknown variant → 404, unavailable location/service → 404, available location/service, unknown first segment → 404).

### Not run (recorded as pending)

| Check | Reason |
|---|---|
| Dev server smoke test (`npm run dev`) | No live browser in this session |
| Direct URL load / refresh on `_redirects` fallback | Requires a hosted preview |
| Keyboard navigation / screen reader walk | No live browser |
| Browser console errors | No live browser |
| Visual inspection at 320/390/768/1440 | No live browser |
| Lighthouse / PageSpeed | Deferred to Sprint 9 |

### Preserved Sprint 0 observations (unchanged)

1. Phone discrepancy on reference: displayed `(800) 884-9760` vs. tel-link `844-611-4995`.
2. Lansing absent from reference footer; Lexington absent from reference lead-form dropdown.
3. Footer `/free%20estimate` likely 404s.
4. `/nashville/roofing/commercial-roofing/` exists in sitemap but Nashville nav uses `/nashville/commercial/`.
