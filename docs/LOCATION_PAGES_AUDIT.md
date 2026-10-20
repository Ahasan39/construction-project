# Location Pages Audit — Sprints 5.1 and 5.2 (2026-10-20)

Scope: all ten location hubs. Sprint 5.1 completed Ann Arbor and Nashville;
Sprint 5.2 added Grand Rapids, Cleveland, Cincinnati, Dayton, Lexington,
Louisville, Detroit and Lansing. Reference pages inspected via WebFetch on
2026-10-20; all returned 200 with no redirects.

## Shared section composition

Order observed on both reference pages, implemented locally:

1. Local hero (navy "Peace of Mind" lead form + sky hero copy + emergency contact row)
2. Trust badges (4 reference stat tiles, clearly disclaimed as reference data)
3. Current offers / financing / warranty (3 card row)
4. 6-up local service grid (Roofing, Siding, Windows, Gutters, Masonry, Insulation)
5. Freeform regional overview ("Done in a day. Good for a lifetime.")
6. Reasons-to-choose bullet list
7. Reviews carousel (shared `ReviewsStrip`)
8. Awards strip (shared `AwardsStrip`, reference credential disclaimer)
9. Final CTA banner (0% / 18-month financing promotion disclaimer + CTA)

The hero `EstimateForm` is reused with `lockedRegion` so the region dropdown is
preselected and hidden; service selection remains open.

## Meaningful differences preserved per page

| Area | Ann Arbor | Nashville |
|---|---|---|
| Hero H1 | "Southeast Michigan's Top Choice for Residential Roofing." (regional phrasing matches reference) | "Your Experienced Nashville Roofing Contractor." (city phrasing matches reference) |
| Default region | `south-east-michigan` | `nashville-area` |
| Reasons heading | "Great Reasons to Choose Mr. Roof in Southeast Michigan" | "Great Reasons to Choose Mr. Roof Nashville" |
| Overview body | 4 paragraphs framed around Southeast Michigan coverage | 4 paragraphs framed around Davidson County / Middle Tennessee |
| "As Seen On" media strip | **Present** (reference includes a media logo strip before reviews) | **Omitted** (not shown on the reference nashville page) |
| Final CTA destination | `/ann-arbor/` (free-estimate not an available capability for Ann Arbor) | `/nashville/free-estimate/` (free-estimate is available for Nashville) |
| Service grid links | `/ann-arbor/` for every service (Ann Arbor availability has no scoped service pages) | `/nashville/<service>/` for each service in the availability table |

## Reference content clearly labelled as such

- Trust tiles carry "Reference company statistics — not claims about this demo."
- Offer card bodies name the reference promotion and add a line clarifying the
  demo does not sell, bill or redeem offers.
- Awards strip retains the shared "Reference credential artwork — illustrative
  only" caption.
- "As Seen On" strip explicitly labels the entries as reference placements.
- The CTA banner body states the 0%/18-month promotion is a reference offer
  and that no credit applications are processed by this demo.
- The large reference disclosure banner removed in the 2026-10-16 contact
  update is **not** reintroduced.

## Contacts, assets and demo behaviour

- Hero phone and footer phone resolve to the shared demo phone/email in
  `src/data/brand.ts` (`+880 1842-299275` / `amamulahasan77@gmail.com`). No
  reference phone number is reactivated.
- No client office or address is invented. Reference office addresses observed
  during the audit are intentionally **not** displayed; where a reference
  office line would otherwise appear, the demo omits it rather than inventing
  substitutes.
- Images reuse existing homepage assets:
  - `hero-suburban-home.webp` for both page heroes (and the roofing tile).
  - `benefit-exterior-renovation.webp` for siding and masonry tiles.
  - `promo-warranty.webp` for windows tile and warranty promo.
  - `promo-inspector-gutters.webp` for gutters tile.
  - `benefit-consultant-homeowner.webp` for insulation tile.
  - `promo-offers.webp` / `promo-financing.webp` / `promo-warranty.webp` for
    the three offer cards.
- No new photography, awards or review content fabricated.
- The hero `EstimateForm` remains a mock submission with the standing
  "Demo form — submissions are not sent." note.

## Composition / data

- Section components live in
  [`src/components/sections/LocationSections.tsx`](../src/components/sections/LocationSections.tsx).
- Per-location typed copy lives in
  [`src/data/locationPages.ts`](../src/data/locationPages.ts).
- `src/pages/LocationPage.tsx` dispatches to the composition when a page has
  typed content, otherwise it renders the pre-existing Sprint 1 scaffold so
  the eight other locations continue to behave as documented.

## Browser evidence

- `npm run preview` served both `/construction-project/ann-arbor/` and
  `/construction-project/nashville/` with HTTP 200.
- Full-browser verification at 320/390/768/1440 was not re-captured as a
  screenshot gallery (per sprint instructions). The reused section layouts
  share the viewport-tested rules from the homepage sprint; new wrappers use
  only fluid grids, `overflow-wrap: anywhere` on long headings and the shared
  focus-visible outline.

## Sprint 5.2 per-page observations

Reference H1 and section wording captured for every page; implemented verbatim
or close-paraphrased in `src/data/locationPages.ts`.

| Slug | Hero H1 (reference) | Service-grid heading | Default region | Scoped services |
|---|---|---|---|---|
| ann-arbor | "Southeast Michigan's Top Choice for Residential Roofing." | "Mr. Roof: Quality, Value, and Cost Effective Prices" | south-east-michigan | roofing (service-area index only) |
| nashville | "Your Experienced Nashville Roofing Contractor." | "The Leading Exterior Remodeler in Nashville" | nashville-area | roofing (+ commercial variant), siding, windows, gutters, masonry, insulation |
| grand-rapids | "Grand Rapids' Go-To Roofing Company Since 1962" | "Full-Service Exterior Remodeling in Grand Rapids" | grand-rapids-area | roofing (financing + service-area index) |
| cleveland | "Cleveland Residential Roofing Contractors You Can Trust" | "Quality Products. Service You Can Trust." | cleveland-area | roofing (free-estimate, financing, service-area index) |
| cincinnati | "Best Roofers in Cincinnati, OH" | "Quality Products. Service You Can Trust." | cincinnati-area | roofing (+ commercial variant, free-estimate, financing, service-area index) |
| dayton | "Dayton's Trusted Roofing Company" | "Your First Choice For Exterior Renovation in Dayton" | dayton-area | roofing (+ commercial variant, free-estimate) |
| lexington | "Lexington, Kentucky's Most Trusted Roofing Contractors" | "Quality Products. Service You Can Trust." | lexington-area | hub only |
| louisville | "#1 Residential Roofing Company in Louisville, Kentucky" | "Trusted Exterior Renovation Contractors in Louisville" | louisville-area | roofing (free-estimate, financing) |
| detroit | "Detroit's #1 Choice for Residential Roofing" | "Mr. Roof: Quality, Value, and Cost Effective Prices" | south-east-michigan | hub only |
| lansing | "Lansing's #1 Choice for Residential Roofing" | "Mr. Roof: Quality, Value, and Cost Effective Prices" | lansing-area | roofing (service-area index only) |

The "As Seen On" media strip is only present on Ann Arbor's reference page; the
other nine omit it. The Lexington reference form does not list Lexington as a
region; we keep Lexington Area in our local dropdown and preselect it.

## Final CTA — Ann Arbor correction (Sprint 5.2)

Sprint 5.1 pointed Ann Arbor's final CTA back at `/ann-arbor/` (a reload). The
final CTA destination is now computed from availability:

- If `hasFreeEstimate` is advertised for the location, the CTA goes to
  `/<slug>/free-estimate/`.
- Otherwise it anchors the hero form via `#estimate` (resolved against the
  current path by React Router). The hero `<aside>` carries `id="estimate"`
  and `scroll-mt-28 lg:scroll-mt-32` so the sticky header does not cover the
  scroll target.

No nonexistent `/<slug>/free-estimate/` route is ever generated.

## Open limitations

- Mobile Lighthouse Performance 100 and actual 200% browser-chrome zoom remain
  open from earlier sprints. Not pursued in this sprint.
- Service-area child pages (`/ann-arbor/service-area/...` etc.) remain shells.
- The 8 other locations keep the Sprint 1 scaffold.
