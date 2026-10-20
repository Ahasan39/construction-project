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

## Sprint 5.5.3 — Grand Rapids scoped service hubs

Live inspection of https://www.mrroof.com/grand-rapids/ on 2026-10-20
confirms every service-grid tile links to a published scoped URL
(`/grand-rapids/{roofing,siding,windows,gutters,masonry,insulation}/`).
Five hubs implemented locally; `insulation` keeps the scaffold.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/grand-rapids/roofing/` | same | `/grand-rapids/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/grand-rapids/siding/` | same | `/grand-rapids/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/grand-rapids/windows/` | same | `/grand-rapids/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/grand-rapids/gutters/` | same | `/grand-rapids/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/grand-rapids/masonry/` | same | `/grand-rapids/masonry/` | reference service-grid and header nav |

| Route | Hero H1 | Reference parity | Final CTA |
|---|---|---|---|
| `/grand-rapids/roofing/` | Grand Rapids Roofing Services | Reference H1 verbatim; 2 Grand Rapids FAQs | `/grand-rapids/#estimate` |
| `/grand-rapids/siding/` | Grand Rapids Siding Installation | Reference H1 verbatim; three local FAQs (cost / signs / lifespan) adopted from the reference wording | `/grand-rapids/#estimate` |
| `/grand-rapids/windows/` | Grand Rapids Replacement Windows | Local eyebrow + 2 Grand Rapids FAQs | `/grand-rapids/#estimate` |
| `/grand-rapids/gutters/` | Grand Rapids Gutters & Downspouts | Local eyebrow + 2 Grand Rapids FAQs | `/grand-rapids/#estimate` |
| `/grand-rapids/masonry/` | Grand Rapids Masonry & Chimney Services | Local eyebrow + 2 Grand Rapids FAQs | `/grand-rapids/#estimate` |

Four new availability entries were added to `src/data/availability.ts` so the
`/grand-rapids/{siding,windows,gutters,masonry}/` routes mount. The entries
carry only the `serviceKey`; no new capability flags are introduced because
`hasFreeEstimate`, `hasFinancing` and `hasServiceAreaIndex` are
service-independent for Grand Rapids on the reference. Previous ability for
`roofing` to mount is unchanged.

### CTA deviation documented

Grand Rapids availability does not advertise `hasFreeEstimate` and
`/grand-rapids/free-estimate/` remains a Sprint 1 scaffold. Per the Sprint
5.5.3 brief, the five scoped hubs' primary CTAs point at the completed Grand
Rapids location homepage's hero form via the `#estimate` anchor
(`/grand-rapids/#estimate`), not at the unfinished `/free-estimate/` shell.
The fallback was added as a code-level default in
`src/pages/LocationServicePage.tsx` so future locations with no scoped
estimate route inherit the same behaviour instead of pointing at the global
page.

## Sprint 5.5.4 — Cleveland scoped service hubs

Live inspection of https://www.mrroof.com/cleveland/ on 2026-10-20 confirms
four scoped service URLs are linked from the Cleveland service grid.
Masonry and Insulation tiles on the Cleveland homepage link to the GLOBAL
`/masonry/` and `/insulation/` routes, so **no scoped `/cleveland/masonry/`
or `/cleveland/insulation/` is published**; the local routes stay Not Found.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/cleveland/roofing/` | same | `/cleveland/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/cleveland/siding/` | same | `/cleveland/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/cleveland/windows/` | same | `/cleveland/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/cleveland/gutters/` | same | `/cleveland/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/masonry/` (global) | same | Not Found at `/cleveland/masonry/` | reference service-grid |
| Insulation | `https://www.mrroof.com/insulation/` (global) | same | Not Found at `/cleveland/insulation/` | reference service-grid |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/cleveland/roofing/` | Cleveland Roofing Services | Reference H1 verbatim; Award-Winning Roofing Contractors eyebrow | None (reference has no FAQ) | `/cleveland/#estimate` |
| `/cleveland/siding/` | Cleveland Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/cleveland/#estimate` |
| `/cleveland/windows/` | Cleveland Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/cleveland/#estimate` |
| `/cleveland/gutters/` | Cleveland Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted | 2 | `/cleveland/#estimate` |

### CTA deviation (Cleveland)

Cleveland availability advertises `hasFreeEstimate`, but
`/cleveland/free-estimate/` is still a Sprint 1 scaffold (kept behind the
`COMPLETED_SLUGS` whitelist in `LocationFreeEstimatePage.tsx`). The four
scoped service pages set an explicit `finalCtaTo: "/cleveland/#estimate"`
so the primary CTA reaches the completed location-hub hero form instead of
the unfinished shell. This is per the Sprint 5.5.4 brief and uses the same
`#estimate` anchor pattern established for Grand Rapids in Sprint 5.5.3.

## Sprint 5.5.4 — Grand Rapids FAQ provenance correction

Four of the Grand Rapids scoped hubs completed in Sprint 5.5.3 previously
carried FAQ sections documented as "Grand Rapids-contextual" (locally
authored, not reference-verified). The audit explicitly flagged those as
invented, so this sprint removes them:

- `/grand-rapids/roofing/`, `/grand-rapids/windows/`, `/grand-rapids/gutters/`,
  `/grand-rapids/masonry/` — FAQ blocks removed; no FAQ section is rendered.
- `/grand-rapids/siding/` — FAQ block **kept**, because its three topics
  (cost / signs / lifespan) are reference-verified from live inspection of
  `/grand-rapids/siding/` on 2026-10-20.

Imagery, headings, eyebrows and intro paragraphs are unchanged.

## Sprint 5.5.5 — Cincinnati scoped service hubs

Live inspection of https://www.mrroof.com/cincinnati/ on 2026-10-20 confirms
all six service-grid tiles link to scoped URLs under `/cincinnati/`. Five
are implemented locally; `/cincinnati/insulation/` is a verified reference
URL but has no local `ServiceHubKey` and keeps the scaffold.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/cincinnati/roofing/` | same | `/cincinnati/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/cincinnati/siding/` | same | `/cincinnati/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/cincinnati/windows/` | same | `/cincinnati/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/cincinnati/gutters/` | same | `/cincinnati/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/cincinnati/masonry/` | same | `/cincinnati/masonry/` | reference service-grid and header nav |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/cincinnati/roofing/` | Cincinnati Roofing Services | Reference H1 verbatim | None (reference has no FAQ) | `/cincinnati/#estimate` |
| `/cincinnati/siding/` | Cincinnati Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/cincinnati/#estimate` |
| `/cincinnati/windows/` | Cincinnati Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/cincinnati/#estimate` |
| `/cincinnati/gutters/` | Cincinnati Gutters | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / know-if-need / ice dam) adopted | 3 | `/cincinnati/#estimate` |
| `/cincinnati/masonry/` | Cincinnati Masonry Services | Reference H1 verbatim | None (reference has no FAQ) | `/cincinnati/#estimate` |

### CTA deviation (Cincinnati)

Cincinnati availability advertises `hasFreeEstimate`, but
`/cincinnati/free-estimate/` is still a Sprint 1 scaffold (kept behind the
`COMPLETED_SLUGS` whitelist in `LocationFreeEstimatePage.tsx`). The five
scoped service pages set an explicit `finalCtaTo: "/cincinnati/#estimate"`
so the primary CTA reaches the completed location-hub hero form instead of
the unfinished shell, matching the pattern established for Grand Rapids
(5.5.3) and Cleveland (5.5.4).

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets. No substitutions beyond the shared pattern from Sprint 5.5.1.

## Not completed (still Sprint 1 shells)

- `/nashville/insulation/`, `/grand-rapids/insulation/`,
  `/cincinnati/insulation/` — verified reference URLs but have no local
  `ServiceHubKey` entry; keep the scaffold rather than mis-render.
- `/cleveland/masonry/` and `/cleveland/insulation/` — resolve to Not Found
  because the reference does **not** publish scoped Cleveland URLs for those
  services (the tiles link to the global `/masonry/` and `/insulation/`).
- `/nashville/roofing/commercial-roofing/` — service-variant page; variants
  remain scaffolded here. The global `/roofing/commercial-roofing/` detail
  page completed in Sprint 4.5 is unaffected.
- `/nashville/financing/`, `/nashville/service-area/`,
  `/grand-rapids/financing/`, `/grand-rapids/service-area/`,
  `/cleveland/financing/`, `/cleveland/service-area/` and every
  `/<location>/service-area/<child>/` — Sprint 1 scaffolds.
- `/<other-city>/free-estimate/` for cities whose availability advertises it
  (cleveland, cincinnati, louisville, dayton) — Sprint 1 scaffolds, kept by
  an explicit `COMPLETED_SLUGS` whitelist in `LocationFreeEstimatePage.tsx`.
- The five remaining locations (dayton, lexington, louisville, detroit,
  lansing) continue to use the Sprint 1 scaffold for every one of their
  advertised scoped services.

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
