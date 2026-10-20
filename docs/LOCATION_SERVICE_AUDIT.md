# Location-Service Pages Audit — Sprint 5.5.1 (2026-10-20)

Scope: Nashville's advertised scoped service hubs. The explicit availability
table in [`src/data/availability.ts`](../src/data/availability.ts) lists six
Nashville scoped services (roofing, siding, windows, gutters, masonry,
insulation). Five of them have a `ServiceHubKey` entry in
[`src/data/servicePages.ts`](../src/data/servicePages.ts) and are completed
this sprint; `insulation` is not a `ServiceHubKey` and remains a scaffold.

## Completed routes

| Route | Hero H1 | Reference parity | Final CTA |
|---|---|---|---|
| `/nashville/roofing/` | Nashville Roofing | Local eyebrow + 3 Nashville FAQs; shared roof-system content from global data | `/nashville/free-estimate/` |
| `/nashville/siding/` | Nashville Siding Installation | Reference H1 verbatim; three "cost / signs / lifespan" FAQs localised | `/nashville/free-estimate/` |
| `/nashville/windows/` | Nashville Replacement Windows | ProVia product line reused from global data; 2 Nashville FAQs | `/nashville/free-estimate/` |
| `/nashville/gutters/` | Nashville Gutters & Downspouts | Seamless gutter benefits reused; 2 Nashville FAQs | `/nashville/free-estimate/` |
| `/nashville/masonry/` | Nashville Masonry & Chimney Services | Masonry products reused; 2 Nashville FAQs | `/nashville/free-estimate/` |

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

- `/nashville/insulation/` — advertised in availability but has no
  `ServiceHubKey` entry; keeps the scaffold rather than mis-render.
- `/nashville/roofing/commercial-roofing/` — service-variant page; variants
  remain scaffolded here. The global `/roofing/commercial-roofing/` detail
  page completed in Sprint 4.5 is unaffected.
- `/nashville/free-estimate/`, `/nashville/financing/`, `/nashville/service-area/`
  and `/nashville/service-area/<child>/` — all remain Sprint 1 scaffolds.
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
