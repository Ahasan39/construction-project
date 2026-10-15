# Construction Project — Mr. Roof Reference Reproduction

A high-fidelity frontend reproduction of the public website at https://www.mrroof.com/, built with React + TypeScript + Vite + Tailwind CSS. A later phase integrates Laravel + MySQL for dynamic content and real form submissions.

## Status

**Sprint 1 complete — foundation.** Route shells, UI primitives, typed data, mock services and tests are in place. Finished page designs (header, footer, homepage, service pages) are intentionally still placeholders; those arrive in Sprint 2+. See [docs/PROGRESS.md](docs/PROGRESS.md).

## Requirements

- **Node.js** >= 20.19 (tested on 24.14).
- **npm** >= 10 (tested on 11.9).

## Stack

| Area | Package | Installed |
|---|---|---|
| UI runtime | `react`, `react-dom` | 19.3.1 |
| Routing | `react-router-dom` | 7.18.4 |
| Bundler | `vite` | 6.4.4 |
| React plugin | `@vitejs/plugin-react` | 4.7.0 |
| CSS | `tailwindcss` + `@tailwindcss/vite` | 4.3.3 |
| Language | `typescript` | 5.9.3 |
| Lint | `eslint` + `typescript-eslint` | 9.39.5 / 8.71.2 |
| Test | `vitest`, `@testing-library/react`, `jsdom` | 3.2.7 |

Exact resolved versions are pinned in `package-lock.json`.

## Install & run

```powershell
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # typecheck + production bundle to ./dist
npm run preview    # serve the production bundle at http://localhost:4173
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit project build
npm test           # vitest run (CI-friendly, non-watching)
npm run test:watch # vitest watch mode
```

## Repository

- Local: `D:\Qorvin IT\projects\construction project`
- Remote (origin): https://github.com/Ahasan39/construction-project.git (empty remote)

Nothing has been committed, pushed, or deployed.

## Project structure

```
src/
  app/              # router, SEO head manager
  components/
    ui/             # Button, Container, Section, Field, Input, Textarea, Select, Checkbox, SmartLink
    layout/         # AppShell, PageShell
  pages/            # one component per template family + dispatchers + _preview
  data/             # typed mock data (brand, services, locations, availability, offers, reviews, articles, navigation)
  services/         # mock replaceable service layer (content, estimates)
  types/            # shared TypeScript types
  styles/           # globals.css (tokens + base reset + reduced-motion)
  test/             # vitest setup
public/
  _redirects        # Netlify-style SPA fallback (see Hosting below)
  robots.txt
docs/               # audit, design tokens, routes, assets, progress, QA
```

## Routes

Route table is driven by typed data in `src/data/*`. Known family coverage:

- `/` — homepage shell
- `/free-estimate` — standalone lead form shell
- `/about`, `/special-offers`, `/financing`, `/warranties`, `/refer-a-friend`, `/reviews`, `/commercial-projects`, `/careers/sales`, `/privacy-policy` — static resource shells
- `/billpay`, `/visualizer`, `/crew` — external integration entry points (outbound links only)
- `/blog`, `/blog/:slug` — blog listing and article shells
- `/:slug` — resolves to service hub or location hub based on data (unknown → 404)
- `/:a/:b` — resolves to service variant or location-service page based on data and explicit availability
- `/:locationSlug/free-estimate|financing|service-area` — location-literal pages (gated by capability)
- `/:locationSlug/service-area/:childSlug` — service-area sub-city
- `/:locationSlug/:serviceSlug/:variantSlug` — only when the variant is in the availability record

Dev-only preview of UI primitives: **`/__preview`** (noindex, excluded from `robots.txt`).

## Hosting

The SPA uses a browser router. For direct URL loads and refreshes to work in production, the host must rewrite all unknown paths to `/index.html`:

- Netlify / Cloudflare Pages: `public/_redirects` already includes `/* /index.html 200`.
- Vercel: a `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }` has the same effect — add when deploying.
- Apache / nginx / IIS: equivalent rewrite rule needed; see [docs/PROGRESS.md](docs/PROGRESS.md) §Prerendering.

An "in-app Not Found" screen renders for unknown routes; it does **not** emit an HTTP 404 by itself. True 404 status codes will be issued by a future prerender step for known-unenumerable slugs.

## Documentation

- [docs/REFERENCE_AUDIT.md](docs/REFERENCE_AUDIT.md) — audit of mrroof.com
- [docs/ROUTE_INVENTORY.md](docs/ROUTE_INVENTORY.md) — discovered routes classified
- [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) — typography, color, spacing, container, radii
- [docs/ASSET_MANIFEST.md](docs/ASSET_MANIFEST.md) — asset sources and replacement status
- [docs/PROGRESS.md](docs/PROGRESS.md) — sprint progress log
- [docs/QA_REPORT.md](docs/QA_REPORT.md) — verification results

## Non-goals (frontend phase)

- No Laravel, MySQL, authentication, or admin dashboard.
- No real form submission, email, SMS, or payment handling.
- No requests to Mr. Roof's production endpoints.
- No invention of client awards, reviews, addresses, or statistics.
