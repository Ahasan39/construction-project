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

## Sprint 5.5.6 — Dayton scoped service hubs

Live inspection of https://www.mrroof.com/dayton/ on 2026-10-20 confirms
four scoped service URLs linked from the Dayton service grid. Dayton
Masonry and Insulation tiles link to the GLOBAL `/masonry/` and
`/insulation/` URLs, so `/dayton/{masonry,insulation}/` stay Not Found.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/dayton/roofing/` | same | `/dayton/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/dayton/siding/` | same | `/dayton/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/dayton/windows/` | same | `/dayton/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/dayton/gutters/` | same | `/dayton/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/masonry/` (global) | same | Not Found at `/dayton/masonry/` | reference service-grid |
| Insulation | `https://www.mrroof.com/insulation/` (global) | same | Not Found at `/dayton/insulation/` | reference service-grid |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/dayton/roofing/` | Dayton Roofing Services | Reference H1 verbatim | None (reference has no FAQ) | `/dayton/#estimate` |
| `/dayton/siding/` | Dayton Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted. Note: the live reference page's first question itself still says "Cincinnati" (apparent template leftover on reference); local wording corrects to "Dayton". | 3 | `/dayton/#estimate` |
| `/dayton/windows/` | Dayton Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/dayton/#estimate` |
| `/dayton/gutters/` | Dayton Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted | 2 | `/dayton/#estimate` |

### CTA deviation (Dayton)

Dayton advertises `hasFreeEstimate` in availability but
`/dayton/free-estimate/` is still a Sprint 1 scaffold (kept behind the
`COMPLETED_SLUGS` whitelist). The four Dayton service entries set an
explicit `finalCtaTo: "/dayton/#estimate"`, same pattern as Grand Rapids,
Cleveland and Cincinnati.

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets.

## Sprint 5.5.7 — Lexington scoped service hubs (correction + implementation)

Correction: Sprint 5.1's `ROUTE_INVENTORY.md §2` labelled Lexington "hub only
(no additional location-scoped pages)." Live inspection of
https://www.mrroof.com/lexington/ on 2026-10-20 shows all six service-grid
tiles link to scoped `/lexington/<service>/` URLs. Five are implemented
locally; `/lexington/insulation/` is a verified reference URL but has no
local `ServiceHubKey` and stays Not Found rather than mis-render.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/lexington/roofing/` | same | `/lexington/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/lexington/siding/` | same | `/lexington/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/lexington/windows/` | same | `/lexington/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/lexington/gutters/` | same | `/lexington/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/lexington/masonry/` | same | `/lexington/masonry/` | reference service-grid and header nav |
| Insulation | `https://www.mrroof.com/lexington/insulation/` | same | Not Found (no `ServiceHubKey`) | reference service-grid |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/lexington/roofing/` | Lexington Roofing Services | Reference H1 verbatim; **first roofing hub with a reference FAQ** — 3 topics (cost / know-if-need / insurance) adopted | 3 | `/lexington/#estimate` |
| `/lexington/siding/` | Lexington Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/lexington/#estimate` |
| `/lexington/windows/` | Lexington Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/lexington/#estimate` |
| `/lexington/gutters/` | Lexington Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted. Note: reference's first FAQ title still shows "Cincinnati" (template leftover); local wording corrects to "Lexington". | 2 | `/lexington/#estimate` |
| `/lexington/masonry/` | Lexington Masonry Services | Reference H1 verbatim | None (reference has no FAQ) | `/lexington/#estimate` |

### Availability correction

Five new entries were added to `src/data/availability.ts` for
`lexington/{roofing,siding,windows,gutters,masonry}`, replacing the
"hub only" classification. No capability flags are added — the reference
Lexington page does not advertise financing or a service-area index. A
`/lexington/free-estimate/` URL is linked from the reference service pages
but is not represented as a local capability; its scoped implementation is
out of scope for this sprint.

Tests that depended on the former hub-only classification were retargeted
to Detroit (which remains hub-only on the reference):
`availability.test.ts`, `dispatch.test.tsx`, `deployment.test.ts` and
`LocationServicePage.test.tsx` all updated accordingly.

### CTA deviation (Lexington)

Lexington has no `hasFreeEstimate` capability in local availability (the
Sprint 1 scaffold is not even mounted at `/lexington/free-estimate/`). All
five Lexington service entries set an explicit
`finalCtaTo: "/lexington/#estimate"` so primary CTAs reach the completed
Lexington location-hub hero form — same pattern as Grand Rapids, Cleveland,
Cincinnati and Dayton.

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets.

## Sprint 5.5.8 — Louisville scoped service hubs

Live inspection of https://www.mrroof.com/louisville/ on 2026-10-20 confirms
all six service-grid tiles link to scoped `/louisville/<service>/` URLs.
Five are implemented locally; `/louisville/insulation/` is a verified
reference URL but has no local `ServiceHubKey` and stays Not Found.

| Local service | Reference href | Final URL (no redirect) | Local destination | Evidence |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/louisville/roofing/` | same | `/louisville/roofing/` | reference service-grid and header nav |
| Siding | `https://www.mrroof.com/louisville/siding/` | same | `/louisville/siding/` | reference service-grid and header nav |
| Windows | `https://www.mrroof.com/louisville/windows/` | same | `/louisville/windows/` | reference service-grid and header nav |
| Gutters | `https://www.mrroof.com/louisville/gutters/` | same | `/louisville/gutters/` | reference service-grid and header nav |
| Masonry | `https://www.mrroof.com/louisville/masonry/` | same | `/louisville/masonry/` | reference service-grid and header nav |
| Insulation | `https://www.mrroof.com/louisville/insulation/` | same | Not Found (no `ServiceHubKey`) | reference service-grid, footer only |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/louisville/roofing/` | Louisville Roofing Services | Reference H1 verbatim | None (reference has no FAQ) | `/louisville/#estimate` |
| `/louisville/siding/` | Louisville Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/louisville/#estimate` |
| `/louisville/windows/` | Louisville Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/louisville/#estimate` |
| `/louisville/gutters/` | Louisville Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted | 2 | `/louisville/#estimate` |
| `/louisville/masonry/` | Louisville Masonry Services | Reference H1 verbatim | None (reference has no FAQ) | `/louisville/#estimate` |

### CTA deviation (Louisville)

Louisville availability advertises `hasFreeEstimate`, but
`/louisville/free-estimate/` is still a Sprint 1 scaffold (kept behind the
`COMPLETED_SLUGS` whitelist in `LocationFreeEstimatePage.tsx`). The five
scoped service pages set an explicit `finalCtaTo: "/louisville/#estimate"`
so primary CTAs reach the completed location-hub hero form — same pattern
as Grand Rapids, Cleveland, Cincinnati, Dayton and Lexington.

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets.

## Sprint 5.5.9 — Detroit scoped service hubs + Lansing verification

Live inspection on 2026-10-21 produced evidence that overturns the earlier
"hub only" classification for both Detroit and Lansing.

### Detroit — actual reference mapping

| Service | Original href (source) | Scope | Final URL | Local destination |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/detroit/roofing/` (header nav) | Scoped `/detroit/` | same | `/detroit/roofing/` |
| Siding | `https://www.mrroof.com/detroit/siding/` (header nav) | Scoped `/detroit/` | same | `/detroit/siding/` |
| Windows | `https://www.mrroof.com/detroit/windows/` (header nav) | Scoped `/detroit/` | same | `/detroit/windows/` |
| Gutters | `https://www.mrroof.com/detroit/gutters/` (header nav) | Scoped `/detroit/` | same | `/detroit/gutters/` |
| Masonry | `https://www.mrroof.com/detroit/masonry/` (header nav) | Scoped `/detroit/` | same | `/detroit/masonry/` |
| Insulation | `https://www.mrroof.com/detroit/insulation/` (footer only) | Scoped `/detroit/` | same | Not Found (no `ServiceHubKey`) |

The six service-grid **tiles** on the reference Detroit homepage link to
`/ann-arbor/<service>/` rather than to Detroit's own scoped URLs — an
unusual pattern that preserves access to the scoped URLs through the header
and footer. Our local Detroit location-hub keeps its service-grid tiles
pointed at the scoped Detroit URLs (now that they are implemented); this
is a deliberate deviation from the reference's grid-tile oddity and is
documented here rather than copied blindly.

### Detroit — implementation

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/detroit/roofing/` | Detroit Roofing Services | Reference H1 verbatim; 2 reference-verified FAQ topics (cost / signs) adopted | 2 | `/detroit/#estimate` |
| `/detroit/siding/` | Detroit Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/detroit/#estimate` |
| `/detroit/windows/` | Detroit Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/detroit/#estimate` |
| `/detroit/gutters/` | Detroit Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted | 2 | `/detroit/#estimate` |
| `/detroit/masonry/` | Detroit Masonry Services | Reference H1 verbatim | None (reference has no FAQ) | `/detroit/#estimate` |

Five new availability entries added for Detroit. No capability flags added
(the reference Detroit page does not advertise financing or a service-area
index). Static entries rise 105 → 110.

### Lansing — actual reference mapping (verified, not implemented this sprint)

| Service | Original href (source) | Scope | Final URL | Local destination |
|---|---|---|---|---|
| Roofing | `https://www.mrroof.com/lansing/roofing/` (header nav) | Scoped `/lansing/` | same | **Sprint 1 scaffold** |
| Siding | `https://www.mrroof.com/lansing/siding/` (header nav) | Scoped `/lansing/` | same | Not Found (not in availability yet) |
| Windows | `https://www.mrroof.com/lansing/windows/` (header nav) | Scoped `/lansing/` | same | Not Found |
| Gutters | `https://www.mrroof.com/lansing/gutters/` (header nav) | Scoped `/lansing/` | same | Not Found |
| Masonry | `https://www.mrroof.com/lansing/masonry/` (header nav) | Scoped `/lansing/` | same | Not Found |
| Insulation | None in header; grid tile links to `/ann-arbor/insulation/` | — | — | — |

As with Detroit, the Lansing service-grid tiles link to `/ann-arbor/` even
though scoped Lansing URLs exist and are reachable through the header.
Lansing's five scoped hubs are the exact remaining scope from this sprint;
their local availability entries and typed content are deferred to a later
sprint.

### Negative-test fixture change

Four previous tests used `/detroit/roofing/` as the "unavailable combo"
Not-Found fixture — that is no longer unavailable. All four are retargeted
to `/cleveland/masonry/`, which the reference Cleveland service grid
deliberately links to the global `/masonry/` URL (so the scoped Cleveland
masonry URL is not published). Files updated: `availability.test.ts`,
`dispatch.test.tsx`, `deployment.test.ts`, and the Not-Found section of
`LocationServicePage.test.tsx`. The `LocationPage.test.tsx` fallback test
is retargeted to Lansing (whose siding/windows/gutters/masonry are not yet
in availability).

### CTA deviation (Detroit)

Detroit has no `hasFreeEstimate` capability in local availability. The five
service entries carry an explicit `finalCtaTo: "/detroit/#estimate"` so
primary CTAs reach the completed Detroit location-hub hero form — same
pattern as every prior scoped-service batch.

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets.

## Sprint 5.5.10 — Lansing scoped service hubs

Live inspection of the five Lansing scoped service URLs on 2026-10-21
confirms each is a published reference page. The reference Lansing
service-grid tiles unusually link to `/ann-arbor/<service>/` (same
pattern noted for Detroit in Sprint 5.5.9), but the scoped Lansing
URLs themselves resolve and are the destinations linked from the
reference Lansing header navigation.

| Local service | Original href (source) | Final URL | Local destination |
|---|---|---|---|
| Roofing | `https://www.mrroof.com/lansing/roofing/` (header nav) | same | `/lansing/roofing/` |
| Siding | `https://www.mrroof.com/lansing/siding/` (header nav) | same | `/lansing/siding/` |
| Windows | `https://www.mrroof.com/lansing/windows/` (header nav) | same | `/lansing/windows/` |
| Gutters | `https://www.mrroof.com/lansing/gutters/` (header nav) | same | `/lansing/gutters/` |
| Masonry | `https://www.mrroof.com/lansing/masonry/` (header nav) | same | `/lansing/masonry/` |

| Route | Hero H1 | Reference parity | Local FAQ | Final CTA |
|---|---|---|---|---|
| `/lansing/roofing/` | Lansing Roofing Services | Reference H1 verbatim; 2 reference-verified FAQ topics (cost / signs — same pattern observed on Detroit) adopted | 2 | `/lansing/#estimate` |
| `/lansing/siding/` | Lansing Siding Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / lifespan) adopted | 3 | `/lansing/#estimate` |
| `/lansing/windows/` | Lansing Window Installation | Reference H1 verbatim; 3 reference-verified FAQ topics (cost / signs / replace all) adopted | 3 | `/lansing/#estimate` |
| `/lansing/gutters/` | Lansing Gutters & Downspouts | Reference H1 verbatim; 2 reference-verified FAQ topics adopted | 2 | `/lansing/#estimate` |
| `/lansing/masonry/` | Lansing Masonry Services | Reference H1 verbatim | None (reference has no FAQ) | `/lansing/#estimate` |

Four new availability entries added for Lansing
(`siding, windows, gutters, masonry`). The pre-existing roofing entry
(`hasServiceAreaIndex: true`) is unchanged. No new capability flags added
— the reference Lansing page does not advertise financing or a
free-estimate route. Static entries rise 110 → 114.

### Fallback-test fixture change

Sprint 5.5.9 had retargeted the LocationPage service-grid fallback test
to Lansing because Lansing's non-roofing services were unavailable.
Lansing is now fully populated, so the fallback test is retargeted again
— this time to Cleveland masonry (the reference Cleveland service grid
deliberately links masonry globally), which also matches the Not-Found
fixture used in the dispatcher/availability tests.

### CTA deviation (Lansing)

Lansing has no `hasFreeEstimate` capability in local availability. The
five service entries carry an explicit `finalCtaTo: "/lansing/#estimate"`
so primary CTAs reach the completed Lansing location-hub hero form —
same pattern as every prior scoped-service batch.

### Local deviation from reference

Our local Lansing location-hub service grid continues to link each tile
to the scoped `/lansing/<service>/` route (via `isLocationServiceAvailable`),
rather than mirroring the reference's practice of pointing its grid
tiles at `/ann-arbor/`. Same deliberate deviation as Detroit — our tiles
now reach completed Lansing pages rather than redirect to another city.

### Imagery

Reuses existing per-service hero photography from `servicePages[key].hero`;
no new assets.

## Not completed (still Sprint 1 shells)

- `/nashville/insulation/`, `/grand-rapids/insulation/`,
  `/cincinnati/insulation/`, `/lexington/insulation/`,
  `/louisville/insulation/` — verified reference URLs but have no local
  `ServiceHubKey` entry; stay Not Found rather than mis-render.
- `/cleveland/masonry/`, `/cleveland/insulation/`, `/dayton/masonry/`,
  `/dayton/insulation/` — resolve to Not Found because the reference does
  **not** publish scoped URLs for those services (the tiles link to the
  global `/masonry/` and `/insulation/`).
- `/nashville/roofing/commercial-roofing/` — service-variant page; variants
  remain scaffolded here. The global `/roofing/commercial-roofing/` detail
  page completed in Sprint 4.5 is unaffected.
- `/nashville/financing/`, `/grand-rapids/financing/`,
  `/cleveland/financing/`, `/cincinnati/financing/`,
  `/louisville/financing/` — Sprint 1 scaffolds.
- Every `/<location>/service-area/<child>/` route — Sprint 1 scaffolds. The
  six `/<location>/service-area/` index pages are complete as of Sprint
  5.5.12 (see `docs/ROUTE_INVENTORY.md`); the child destinations remain
  the next scope.
- `/<other-city>/free-estimate/` — all four previously-scaffold cities
  (cleveland, cincinnati, louisville, dayton) are now completed in Sprint
  5.5.11; see the Sprint 5.5.11 section below.
- `/detroit/insulation/` — verified reference URL (footer only) but has no
  local `ServiceHubKey`; stays Not Found.
- `/lansing/insulation/` — footer-level reference URL but no local
  `ServiceHubKey`; stays Not Found.
- All scoped service hubs across every city are now implemented. The only
  remaining scoped-service shells are the `/<location>/<service>/<variant>/`
  routes (variants), which are explicitly out of scope for the 5.5.x
  sequence.

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

## Sprint 5.5.11 — Remaining free-estimate pages

Live inspection on 2026-10-21 confirms every `hasFreeEstimate` city has a
published scoped `/<slug>/free-estimate/` reference page with identical
structure to Nashville (H1 "Free Estimate", 5 required fields, 2 optional
consent checkboxes, submit label "Get a FREE ESTIMATE").

| Route | Reference href | Preselected region | Local status (before 5.5.11) | Status (after 5.5.11) |
|---|---|---|---|---|
| `/cleveland/free-estimate/` | `https://www.mrroof.com/cleveland/free-estimate/` | `cleveland-area` | Scaffold | Complete |
| `/cincinnati/free-estimate/` | `https://www.mrroof.com/cincinnati/free-estimate/` | `cincinnati-area` | Scaffold | Complete |
| `/louisville/free-estimate/` | `https://www.mrroof.com/louisville/free-estimate/` | `louisville-area` | Scaffold | Complete |
| `/dayton/free-estimate/` | `https://www.mrroof.com/dayton/free-estimate/` | `dayton-area` | Scaffold | Complete |
| `/nashville/free-estimate/` | same pattern | `nashville-area` | Complete since 5.5.2 | Complete |

Implementation: no new typed data, no new components. The sole code change
is extending `COMPLETED_SLUGS` in `src/pages/LocationFreeEstimatePage.tsx`
from `{"nashville"}` to the full five. The pre-existing
`findLocationPage(location.slug).defaultRegionKey` map (populated for all
ten cities since Sprint 5.1/5.2) now drives region preselection for the
four new pages; the shared `EstimateBody` renders the identical AppShell /
breadcrumb / hero H1 / inverse `EstimateForm` / demo-contact card.

Deliberate deviations from the reference:
- Reference pages do not preselect a region on their open dropdown; our
  implementation preselects via `lockedRegion` because the page is already
  scoped to a city — the same choice already in effect for Nashville.
- Reference pages display a city-specific secondary phone number and a
  physical office address (e.g. Cleveland shows (216) 777-5874 and a
  Valley View address). Our implementation exposes **only** the shared
  demo phone and email (`+880 1842-299275` /
  `amamulahasan77@gmail.com`); no office address is published. Per project
  policy no reference phone or address is reactivated or invented.

Static-route generation: unchanged. All four URLs were already emitted
because the parent cities already advertised `hasFreeEstimate` in
availability. Entry count remains 114 + 404.

**Every published reference `/<slug>/free-estimate/` page is now
implemented locally.** Remaining `/free-estimate/` routes for cities
without `hasFreeEstimate` capability continue to resolve to Not Found
by design.
