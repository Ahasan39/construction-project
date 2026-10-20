# Route Inventory

Classification of every public route discovered on https://www.mrroof.com/ via header, footer, contextual links, and sitemaps (`/sitemap.xml` → `page-sitemap1.xml`, `page-sitemap2.xml`, `post-sitemap1.xml`, `local-sitemap.xml`).

The full sitemap listing was partially truncated by the fetch tool (`page-sitemap1.xml` has ~321 KB of XML, `page-sitemap2.xml` ~152 KB; the parsed excerpt captured ~130 unique URLs across them). Enough was captured to classify every **template family**. Individual sub-city pages (e.g. all ~80 service-area children per region) are template instances and will be rendered from one shared template driven by data.

## Legend

- **Classification:** `internal` · `template-instance` · `external` · `download` · `blocked/unverified`
- **Impl status (Sprint 0):** `pending` for all; implementation starts Sprint 1.

---

## 1. Internal pages (distinct templates)

| Path | Template family | Classification | Notes |
|---|---|---|---|
| `/` | Home | internal | Lead form + full homepage |
| `/roofing/` | Service hub | internal | Links to 4 subservices |
| `/roofing/roof-replacement/` | Service variant | internal | |
| `/roofing/roof-repair/` | Service variant | internal | |
| `/roofing/metal-roofing/` | Service variant | internal | |
| `/roofing/commercial-roofing/` | Service variant | internal | |
| `/gutters/` | Service hub | internal | |
| `/siding/` | Service hub | internal | |
| `/windows/` | Service hub | internal | |
| `/masonry/` | Service hub | internal | |
| `/about/` | Company | internal | |
| `/special-offers/` | Company / offers | internal | |
| `/financing/` | Company / financing | internal | |
| `/warranties/` | Company / warranties | internal | |
| `/refer-a-friend/` | Company | internal | |
| `/reviews/` | Company / reviews | internal | |
| `/careers/sales/` | Careers | internal | May embed external ATS; verify |
| `/commercial-projects/` | Company | internal | |
| `/free-estimate/` | Lead form | internal | |
| `/blog/` | Blog index | internal | 5 pages, 12/page |
| `/blog/<slug>/` | Blog article | template-instance | ~55+ posts observed |
| `/privacy-policy/` | Legal | internal | |
| `/provia-windows-installed-by-mr-roof/` | Content page | internal | Vendor product landing |
| `/cleveland-roof-replacement-cost/` | Content page | internal | Non-standard SEO landing (not under `/cleveland/`) |

## 2. Location family (10 regions)

Each location has its own hub, estimate form, service-area index, and selectively its own service subpages.

| Region | Hub | Lead form | Service area index | Observed location-scoped service pages |
|---|---|---|---|---|
| Ann Arbor, MI | `/ann-arbor/` | — | `/ann-arbor/service-area/` | — |
| Grand Rapids, MI | `/grand-rapids/` | — | `/grand-rapids/service-area/` | `/grand-rapids/financing/` |
| Cleveland, OH | `/cleveland/` | `/cleveland/free-estimate/` | `/cleveland/service-area/` | `/cleveland/financing/` |
| Cincinnati, OH | `/cincinnati/` | `/cincinnati/free-estimate/` | `/cincinnati/service-area/` | `/cincinnati/financing/`, `/cincinnati/roofing/commercial-roofing/` |
| Dayton, OH | `/dayton/` | `/dayton/free-estimate/` | (via Montgomery / Clark county children) | `/dayton/roofing/commercial-roofing/` |
| Lexington, KY | `/lexington/` | — | — | — |
| Louisville, KY | `/louisville/` | `/louisville/free-estimate/` | (via children) | `/louisville/financing/` |
| Nashville, TN | `/nashville/` | `/nashville/free-estimate/` | `/nashville/service-area/` | `/nashville/siding/`, `/nashville/financing/`, `/nashville/roofing/commercial-roofing/` |
| Detroit, MI | `/detroit/` | — | — | — |
| Lansing, MI | `/lansing/` | — | `/lansing/service-area/` | — |

**Design implication:** route resolver must treat `/{location}/{service}/` and `/{location}/{service}/{variant}/` as optional and data-driven, not generated for every combination. A location that has `/nashville/siding/` does not imply every location has a siding sub-page.

## 3. Service-area template-instances (sub-cities / counties under a region)

Represented by `/{region}/service-area/{slug}/`. A sample from the sitemap (not exhaustive):

- Ann Arbor region: `toledo`, `oakland-county`, `wayne-county`, `washtenaw-county`, `monroe-county`, `livingston-county`, `lenawee-county`, `jackson-county`, `milford`, `brighton`, `westland`, `taylor`, `st-clair-shores`, `saline`, `belleville`, `adrian`, `roseville`, `redford`, `plymouth`, `beverly-hills`, `troy`, `sterling-heights`, `inkster`, `detroit`, `rochester-hills`, `dearborn`, `pontiac`, `novi`, `macomb`, `farmington-hills`, `canton`.
- Grand Rapids region: `zeeland`, `lowell`, `wyoming`, `wayland`, `spring-lake`, `ottawa-county`, `kentwood`, `kent-county`, `kalamazoo`, `hudsonville`, `holland`, `grandville` (plus more below the fetch cutoff).
- Cleveland region: `ashland`, `mansfield`.
- Cincinnati region: `lebanon`.
- Dayton region: `montgomery-county`, `clark-county`.
- Louisville region: `taylorsville`, `shepherdsville`, `shelbyville`, `shelby-county`, `madison`, `la-grange`, `jeffersonville`, `jefferson-county`, `jeffersontown`, `frankfort`, `georgetown`, `nicholasville`, `new-albany`, `spencer-county`, `elizabethtown`, `crestwood`, `clark-county-indiana`, `bullitt-county`.
- Nashville region: `murfreesboro`, `gallatin`, `williamson-county`, `spring-hill`, `smyrna`, `portland`, `mount-juliet`, `madison`, `lebanon`, `la-vernge`, `hermitage`, `hendersonville`, `franklin`, `davidson-county`, `clarksville`, `cheatham-county`, `brentwood`, `antioch`.
- Lansing region: `haslett`, `holt`, `waverly`, `dewitt`, `okemos`, `east-lansing`.

**Odd one out:** `/louisville/bardstown/` exists outside the usual `/service-area/` subpath — likely a legacy structure; we will treat it as a redirect/alias in data.

## 4. External entry points

| Path | Classification | Target |
|---|---|---|
| `/crew/` | external | Employee / crew portal (auth required). Entry point only — frontend links out. |
| `/billpay/` | external | Bill payment (likely third-party payment processor). Entry point only. |
| `/visualizer/` | external | 3D exterior design visualizer (likely Owens Corning Design EyeQ or similar). Entry point only. |

For each: reproduce the on-site landing/entry card and expose the outbound link, but **do not** stand up our own payment or visualizer backend during the frontend phase.

## 5. Blog articles (template-instance)

A representative sample (first 50 captured):

- `/blog/mr-roof-ranked-36-on-roofing-contractor-magazines-2026-top-100-list/`
- `/blog/roof-repair-vs-roof-replacement-which-is-right-for-you/`
- `/blog/understanding-roof-installation-costs-and-financing-choices/`
- `/blog/how-much-does-a-new-roof-cost-in-{nashville|cleveland|cincinnati|louisville|dayton|lansing|detroit|grand-rapids|ann-arbor}-<state>/` (9 city variants)
- `/blog/does-a-new-roof-add-value-to-your-home/`
- `/blog/how-to-finance-a-new-roof-with-mr-roof-financing-options-for-homeowners/`
- `/blog/shingle-color-nashville-home/`
- `/blog/owens-corning-color-2024/`, `/blog/owens-corning-cleveland-homes/`
- `/blog/choose-the-right-cleveland-roofing-company-expert-guide/`
- `/blog/maximizing-your-curb-appeal/`
- `/blog/importance-choosing-roof-color/`
- `/blog/the-most-popular-home-improvement-projects-in-nashville/`
- `/blog/why-is-my-roof-leaking/`
- `/blog/choosing-the-right-shingles-for-your-roof/`
- …plus ~40+ more (total 5 pages × 12 posts ≈ 60 posts).

Taxonomies (from sidebar): Home Improvement, Roofing, Windows, Siding, Gutters, Masonry, Insulation, Regional, Seasonal, Community, News. Regional sub-taxonomies: Ann Arbor, Grand Rapids, Cincinnati, Cleveland, Louisville, Nashville, Dayton.

## 6. Downloads / non-HTML

| Path | Type | Notes |
|---|---|---|
| `/locations.kml` | KML geo file | Referenced from `local-sitemap.xml`. Not a public page; used by maps consumers. We will not reproduce. |

## 7. Implementation status (Sprint 1)

| Template family | Implemented? | Component |
|---|---|---|
| Home | Shell only | `src/pages/HomePage.tsx` |
| Service hub | Shell only (data-driven) | `src/pages/ServiceHubPage.tsx` via `TopLevelSlugPage` |
| Service variant | Shell only (data-driven) | `src/pages/ServiceVariantPage.tsx` via `TwoSegmentPage` |
| Location hub | Shell only (data-driven) | `src/pages/LocationPage.tsx` via `TopLevelSlugPage` |
| Location-scoped service | Shell only (gated by availability) | `src/pages/LocationServicePage.tsx` via `TwoSegmentPage` / `ThreeSegmentLocationPage` |
| Location free-estimate | Shell only (gated) | `src/pages/LocationFreeEstimatePage.tsx` |
| Location financing | Shell only (gated) | `src/pages/LocationFinancingPage.tsx` |
| Location service-area index | Shell only (gated) | `src/pages/LocationServiceAreaPage.tsx` |
| Service-area child | Shell only | `src/pages/ServiceAreaChildPage.tsx` |
| Standalone free estimate | Shell only | `src/pages/FreeEstimatePage.tsx` |
| About / Offers / Financing / Warranties / Refer / Reviews / Commercial Projects / Careers / Privacy | Shell only (StaticPage) | `src/pages/StaticPage.tsx` wired from the router |
| Blog index | Shell only (reads mock service) | `src/pages/BlogIndexPage.tsx` |
| Blog article | Shell only (reads mock service) | `src/pages/BlogArticlePage.tsx` |
| External: `/billpay`, `/visualizer`, `/crew` | Entry-point pages with honest pending-URL state (no fake href) | `src/pages/ExternalEntryPage.tsx` |
| Not Found | Implemented (in-app) | `src/pages/NotFoundPage.tsx` |

Explicit location-service availability is the single source of truth in [`src/data/availability.ts`](../src/data/availability.ts); combinations not listed there resolve to Not Found. See `src/data/availability.test.ts` and `src/pages/dispatch.test.tsx` for verification.

**Not yet enumerated:**
- Service-area children: 3 sample slugs per location in `src/data/locations.ts`. Full enumeration deferred until content delivery.
- Blog articles: 2 placeholders in `src/data/articles.ts`.

## 8. Blocked / unverified

- Exhaustive list of every `/service-area/<slug>/` child — truncated by fetch tool size limits; we have the pattern and ~90 slugs sampled, which is sufficient to drive a data-driven template. Full enumeration can be re-fetched later if the client provides a slug list.
- Any gated / member / crew-only URLs behind `/crew/`.
- Any URLs we have not yet discovered (e.g. legal pages beyond `/privacy-policy/`, such as a terms & conditions page referenced by the free-estimate disclaimer). The reference links "Terms & Conditions" from the lead-form disclaimer — URL target not captured; **TODO: fetch and confirm.**

## Sprint 4 route status (2026-10-17)

| Routes | Current status |
|---|---|
| `/roofing/`, `/siding/`, `/windows/`, `/gutters/`, `/masonry/` | Complete service hub bodies; reference-informed compositions, local demo asset substitutions. See SERVICE_PAGES_AUDIT.md for differences. |
| `/roofing/roof-replacement/`, `/roofing/roof-repair/`, `/roofing/metal-roofing/`, `/roofing/commercial-roofing/` | Existing route shells only; unfinished Sprint 4.5 destinations. |
| Location hubs and location-service routes | Existing shells retained. `serviceLocationLinks` uses explicit availability and regional-hub fallback; no combinations added. |
| `/free-estimate/`, `/financing/`, `/visualizer/` | Existing future-sprint destination shells, not newly completed pages. The working mock estimate form remains on the homepage. |
| Global insulation / new product detail routes | Not added. Insulation and unimplemented product detail actions use the existing estimate destination. |

All 82 generated clean-route entries, custom 404, Pages base and noindex are retained. No service-detail, location or other future-sprint body implemented.

## Sprint 5.5.4 route status — 2026-10-20

Four Cleveland scoped service hubs now render completed bodies:
`/cleveland/{roofing,siding,windows,gutters}/`. Live inspection of
https://www.mrroof.com/cleveland/ on 2026-10-20 confirms each is a published
reference URL. Three new availability entries added for Cleveland so the
routes mount (`roofing` was already listed). Static entries rise 86 → 89.

Cleveland's reference service grid intentionally links Masonry and
Insulation tiles to the **global** `/masonry/` and `/insulation/` URLs, not
scoped Cleveland pages — `/cleveland/masonry/` and `/cleveland/insulation/`
remain Not Found rather than mis-render.

Primary estimate CTAs on the Cleveland scoped pages explicitly target
`/cleveland/#estimate` via `finalCtaTo` in `locationServicePages.ts` because
`/cleveland/free-estimate/` is still a Sprint 1 scaffold. Grand Rapids FAQs
documented as locally authored in Sprint 5.5.3 are removed from
`/grand-rapids/{roofing,windows,gutters,masonry}/`; the reference-verified
Siding FAQ block is retained.

Still Sprint 1 scaffolds: insulation (not a `ServiceHubKey`),
commercial-roofing variant, every `/<location>/financing/` and
`/<location>/service-area/` for the three completed cities, and every
scoped service for the six remaining cities (cincinnati, dayton, lexington,
louisville, detroit, lansing).

## Sprint 5.5.3 route status — 2026-10-20

Five Grand Rapids scoped service hubs now render completed bodies:
`/grand-rapids/{roofing,siding,windows,gutters,masonry}/`. Live inspection
of https://www.mrroof.com/grand-rapids/ on 2026-10-20 confirms each is a
published reference URL. Availability for `grand-rapids/{siding,windows,
gutters,masonry}` was added so the routes mount; `roofing` was already
listed. The static-route generator now emits 86 entries + 404 (was 82) —
the four new availability entries become new SPA entry files.

Primary estimate CTAs on the Grand Rapids scoped service pages target the
Grand Rapids location-hub hero form via `#estimate` because the city's
`/free-estimate/` route is still a Sprint 1 scaffold. This fallback is now
the shared default in `LocationServicePage.tsx` for any completed scoped
service page whose city lacks `hasFreeEstimate`.

Still Sprint 1 scaffolds for Grand Rapids: `/grand-rapids/insulation/` (not
a `ServiceHubKey`), `/grand-rapids/financing/`, `/grand-rapids/service-area/`
and `/grand-rapids/service-area/<child>/`. The seven other cities
(cleveland, cincinnati, dayton, lexington, louisville, detroit, lansing)
still use the Sprint 1 scaffold for every advertised scoped service.

## Sprint 5.5.2 route status — 2026-10-20

Corrects Sprint 5.5.1's provenance claim and completes `/nashville/free-estimate/`.
Live inspection of the reference Nashville homepage on 2026-10-20 confirms
every service-grid tile links to a published scoped URL
(`/nashville/{roofing,siding,windows,gutters,masonry,insulation}/`), so the
five scoped service hubs completed in Sprint 5.5.1 are **verified reference
URLs** — not demo extensions.

`/nashville/free-estimate/` now renders a completed body: AppShell, breadcrumb,
"Free Estimate." H1 (reference parity), reusable `EstimateForm` with the
Nashville region preselected and service left open, demo phone/email, and the
standing "Demo form — submissions are not sent." notice. The route is gated
behind `COMPLETED_SLUGS = {"nashville"}` in `LocationFreeEstimatePage.tsx`;
other advertised cities (cleveland, cincinnati, louisville, dayton) keep the
scaffold until their own sprints.

Still Sprint 1 scaffolds: `/nashville/insulation/`,
`/nashville/roofing/commercial-roofing/`, `/nashville/financing/`,
`/nashville/service-area/`, `/nashville/service-area/<child>/`, every
advertised scoped service for the other eight locations, and the four other
cities' `/free-estimate/` routes. Static-route generation, 404 and
clean-entry counts are unchanged (82 + 404).

## Sprint 5.5.1 route status — 2026-10-20

## Sprint 5.2 route status — 2026-10-20

All ten location hubs (`/ann-arbor/`, `/cincinnati/`, `/cleveland/`,
`/dayton/`, `/detroit/`, `/grand-rapids/`, `/lansing/`, `/lexington/`,
`/louisville/`, `/nashville/`) now render completed, reference-informed
compositions. See [LOCATION_PAGES_AUDIT.md](LOCATION_PAGES_AUDIT.md).

Location-scoped service, free-estimate, financing and service-area routes
remain gated by `src/data/availability.ts` and are unchanged. Static route
generation and clean entry counts are unchanged (82 entries + 404). Nested
`/<location>/service-area/<child>/` pages remain Sprint 1 scaffolds.

## Sprint 5.1 route status — 2026-10-20

`/ann-arbor/` and `/nashville/` now render completed location hubs informed by
the live reference pages; see [LOCATION_PAGES_AUDIT.md](LOCATION_PAGES_AUDIT.md).
The eight other location hubs continue to render the Sprint 1 scaffold.
Location-scoped service, free-estimate, financing and service-area routes
remain gated by `src/data/availability.ts` and are unchanged. Static route
generation and clean entry counts are unchanged (82 entries + 404).

## Sprint 4.5 route status — 2026-10-20 (supersedes detail-shell status above)

The four global detail routes `/roofing/roof-replacement/`, `/roofing/roof-repair/`, `/roofing/metal-roofing/` and `/roofing/commercial-roofing/` now have complete reference-informed bodies. Actual reference destinations match these nested paths; all returned 200 without redirects in the 2026-10-18 audit. See [detail audit](ROOFING_DETAIL_AUDIT.md).

Only those four global shells are replaced. Location hubs and location-service/variant routes, `/free-estimate/`, `/financing/` and `/visualizer/` remain future shells. The native detail selector routes to an explicitly supported location variant or the regional hub; no availability combinations were invented. Homepage repair/replacement links and all four Roofing hub cards resolve to completed detail pages. Unknown details remain Not Found. The 82 clean entries and custom 404 are unchanged in count; only global detail hero preloads are added.
