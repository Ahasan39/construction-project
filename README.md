# Construction Project — Public Frontend Demo

React + TypeScript + Vite + Tailwind CSS + React Router reproduction inspired by Mr. Roof. This is an independent demonstration, not the official company site. Laravel/MySQL integration is not implemented.

Live demo: https://ahasan39.github.io/construction-project/ (deployed through GitHub Actions; verified in Chromium and Firefox). See [QA results](docs/QA_REPORT.md) for live evidence and limitations.

## Local development and checks

Node 24 LTS is used in CI. Install the locked dependencies with `npm ci`.

```powershell
npm run dev        # root-path development at http://localhost:5173/
npm run lint
npm run typecheck
npm test
npm run build      # production base: /construction-project/
npm run preview    # http://localhost:4173/construction-project/
```

Do not treat Vite preview's SPA fallback as evidence of GitHub Pages behavior. The live site and a static server must also be tested.

## Deployment

`.github/workflows/pages.yml` runs on main pushes and manual workflow_dispatch. It uses Node 24, npm ci, lint, typecheck, tests and build, then the official configure-pages, upload-pages-artifact and deploy-pages actions. Only dist is uploaded. The deployment job has pages:write and id-token:write; build has contents:read and pages:read. One Pages deployment runs at a time without canceling an active deployment. No gh-pages branch or custom domain is used.

The current official [Vite Pages guide](https://vite.dev/guide/static-deploy.html) and [GitHub workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) informed this configuration. Action major versions were checked against their official releases on 2026-10-16: checkout/setup-node v7, configure-pages v6, upload-pages-artifact/deploy-pages v5.

## Base path and clean routes

Vite uses `/` during development and `/construction-project/` for build/preview. React Router uses `import.meta.env.BASE_URL` as its basename. Route Links and navigate calls remain app-relative; do not manually prefix them. Public images use `assetUrl`, HTML assets/preloads use `%BASE_URL%`, and Vite rewrites CSS font URLs. There is no canonical domain configured for this noindex demo.

The build plugin writes an `index.html` entry file under each supported route directory using `src/app/staticRoutes.ts`. It derives location/service combinations, variants and capability routes from the existing data gates, plus the router's literal resource pages. Update the literal manifest if adding a resource route. These are client-rendered HTML shells, **not prerendered page content**. Direct supported URLs and refreshes return HTTP 200 (Pages may normalize to a trailing slash). Query strings and fragments are retained; no redirect script encodes or rewrites them.

A custom `404.html` loads the same application at the original URL. Unknown direct requests remain HTTP 404 and display the app's Not Found page; unknown client-side navigation has no new document response. JavaScript is required for page content. Full SSR/prerendered SEO is not provided or claimed. `public/_redirects` is for hosts that support it and has no effect on GitHub Pages. No unsupported combinations or `/__preview` entry are generated; Vite removes the DEV-only preview import from production.

## Demo safeguards

Every HTML entry includes `noindex,nofollow`, retained by the client metadata manager on all route transitions. Robots.txt alone does not guarantee exclusion. No production canonical or Mr. Roof canonical is emitted.

A visible disclosure identifies the independent demo and states that estimates are not delivered. Use fictional form values. Submission only calls an in-memory mock: no network request, personal-data storage, email, SMS or payment integration. Testimonials and credential artwork are visibly marked reference material, not verified claims about this demo's operator. Contact/branding and marketing content remain illustrative reference material; this is not a production contractor website.

## Repository workflow and local tooling

Repository-local Git author: `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>`. Do not change global Git identity. Do not add AI Co-Authored-By trailers.

Before committing, run lint, typecheck, tests and build. Review the diff and stage only the sprint's changes. Commit honest checkpoints, push normally to origin main, and verify remote SHA and deployment status. Preserve unrelated work. Do not reset/amend published history, force push or perform destructive Git operations. Keep node_modules, dist, secrets, caches, personal form data and tsbuildinfo out of Git.

Root-only ignore rules exclude `/CLAUDE.md`, `/CLAUDE.local.md` and `/.claude/`. Tracked CLAUDE.md and .claude/settings.json were removed from the index only; existing local copies and the no-AI-attribution preference are preserved. CLAUDE.local.md was not present. Ignore rules do not remove these files from previous commits; historical Git content has not been rewritten. Tool-independent rules remain here and in docs/PROGRESS.md.

## Status and limitations

See [progress](docs/PROGRESS.md), [QA report](docs/QA_REPORT.md), [route inventory](docs/ROUTE_INVENTORY.md) and [asset manifest](docs/ASSET_MANIFEST.md).

Sprint 3.10 covers hosting and demo safeguards only. Actual 200% browser zoom remains unverified. Mobile Performance 100 remains an open target; the last reported localhost score was 78. Deployed mobile/desktop PageSpeed Insights requests returned HTTP 429 quota exceeded, so live scores remain pending. No Sprint 4, Laravel or MySQL work is included.
