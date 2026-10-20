# Location-Service Pages Audit — Sprint 5.5.1 (2026-10-20)

Scope: Nashville's advertised scoped service hubs. The explicit availability
table in [`src/data/availability.ts`](../src/data/availability.ts) lists six
Nashville scoped services (roofing, siding, windows, gutters, masonry,
insulation). Five of them have a `ServiceHubKey` entry in
[`src/data/servicePages.ts`](../src/data/servicePages.ts) and are completed
this sprint; `insulation` is not a `ServiceHubKey` and remains a scaffold.

## Route provenance correction (Sprint 5.5.2)

A follow-up live inspection of the reference Nashville homepage on 2026-10-20
confirmed that every service-grid tile links to a published scoped URL:

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/nashville/roofing/` | same | `/nashville/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/nashville/siding/` | same | `/nashville/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/nashville/windows/` | same | `/nashville/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/nashville/gutters/` | same | `/nashville/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/nashville/masonry/` | same | `/nashville/masonry/` | reference service-grid and header nav |
| Insulation | `https://www.mrroof.com/nashville/insulation/` | same | **scaffold** (not a `ServiceHubKey`) | reference service-grid |

Correction: Sprint 5.5.1 described four of these as "advertised in availability
but not published on the reference." That statement was incorrect; it was
based on an older partial sitemap excerpt in `docs/ROUTE_INVENTORY.md §2`
rather than a live navigation inspection. All five completed Nashville
scoped hubs are **verified reference URLs**, not demo extensions. No local
route or page implementation changes from this correction — only the audit
and progress log.

The reference's final homepage CTA button points to the **global**
`/free-estimate/` rather than `/nashville/free-estimate/`; the service-grid
"Schedule" / "Free Estimate" buttons point to the scoped Nashville estimate
route. Our implementation keeps the final CTA pointed at the scoped Nashville
estimate route, which is now a completed page (see below).

## Completed routes

| Route | Hero H1 | Reference parity | Final CTA |
|---|---|---|---|
| `/nashville/roofing/` | Nashville Roofing | Verified reference URL; local 3-FAQ overlay; shared roof-system content from global data | `/nashville/free-estimate/` |
| `/nashville/siding/` | Nashville Siding Installation | Verified reference URL; H1 verbatim; three "cost / signs / lifespan" FAQs localised | `/nashville/free-estimate/` |
| `/nashville/windows/` | Nashville Replacement Windows | Verified reference URL; ProVia product line reused; 2 Nashville FAQs | `/nashville/free-estimate/` |
| `/nashville/gutters/` | Nashville Gutters & Downspouts | Verified reference URL; seamless gutter benefits reused; 2 Nashville FAQs | `/nashville/free-estimate/` |
| `/nashville/masonry/` | Nashville Masonry & Chimney Services | Verified reference URL; masonry products reused; 2 Nashville FAQs | `/nashville/free-estimate/` |
| `/nashville/free-estimate/` | Free Estimate | Verified reference URL; H1 "Free Estimate." parity; Nashville region preselected; shared mock form, demo-only notice | — (self) |

## Composition

- `src/pages/LocationServicePage.tsx` now renders a complete body when a
  `(location, hubKey)` pair has typed content in
  `src/data/locationServicePages.ts`; otherwise it keeps the Sprint 1
  scaffold so unfinished combinations continue to read as unfinished.
- The page reuses `ServiceImage`, `ServiceFeatureSection`, `ServiceProducts`,
  `ServiceTrust`, `ServiceFaq`, `ServiceRelated`, `ServiceEstimate` and
  `ServiceAction` from `ServiceSections.tsx`. `ServiceEstimate` gained an
  optional `estimateTo` prop so the final CTA uses the scoped route when
  present.
- The hero sidebar replaces the global "Current Specials" location-dropdown
  with a Nashville-contextual list that links to capabilities actually
  advertised in `availability.ts` (`/nashville/free-estimate/`,
  `/nashville/financing/`, `/nashville/service-area/`), avoiding the
  mis-direction a global dropdown would introduce on a page already scoped
  to Nashville.

## Reference / demo honesty

- Local FAQ copy is close-paraphrased from the reference's own Nashville
  questions, kept concise and tied to Middle Tennessee context without
  inventing numbers.
- Reference-company statistics on `ServiceTrust` carry the pre-existing
  "Reference company statistics — not claims about this demo." disclaimer.
- No reference-company phone or form endpoint is reactivated; `/free-estimate`
  destinations continue to use the shared mock form from Sprint 3. Centralised
  demo phone/email in `src/data/brand.ts` are unchanged.
- No new imagery was generated. The hero uses the existing per-service hero
  photo from `servicePages[key].hero`.

## Not completed (still Sprint 1 shells)

- `/nashville/insulation/` — verified reference URL but has no local
  `ServiceHubKey` entry; keeps the scaffold rather than mis-render.
- `/nashville/roofing/commercial-roofing/` — service-variant page; variants
  remain scaffolded here. The global `/roofing/commercial-roofing/` detail
  page completed in Sprint 4.5 is unaffected.
- `/nashville/financing/`, `/nashville/service-area/` and
  `/nashville/service-area/<child>/` — Sprint 1 scaffolds.
- `/<other-city>/free-estimate/` for cities whose availability advertises it
  (cleveland, cincinnati, louisville, dayton) — Sprint 1 scaffolds, kept by
  an explicit `COMPLETED_SLUGS` whitelist in `LocationFreeEstimatePage.tsx`.
- The eight other locations continue to use the Sprint 1 scaffold for every
  one of their advertised scoped services.

## Automated checks

Covered by [`src/pages/LocationServicePage.test.tsx`](../src/pages/LocationServicePage.test.tsx):

- Every `locationServicePages` entry is backed by an availability-table pair.
- All five Nashville hubs render a city-named H1 and no scaffold badge.
- Hero CTA on a scoped page resolves to the location free-estimate route.
- Breadcrumb returns to the Nashville location hub.
- `/lexington/roofing/` continues to resolve to Not Found.
- `/nashville/insulation/` still shows the Sprint 1 scaffold.

## Browser verification

No headless browser or in-app browser automation is available to this session;
rendered verification of the five live pages at viewport widths is **not**
performed. Per sprint guidance, HTTP 200 and bundle-string probes are not
substituted for rendered verification. Rendered verification remains open and
is explicitly out of scope for this sprint if browser tooling is unavailable.
