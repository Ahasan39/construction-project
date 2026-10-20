# Location Pages Audit — Sprint 5.1 (2026-10-20)

Scope: `/ann-arbor/` and `/nashville/`. Reference pages inspected via WebFetch
on 2026-10-20; both returned 200 with no redirects.

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

## Open limitations

- Mobile Lighthouse Performance 100 and actual 200% browser-chrome zoom remain
  open from earlier sprints. Not pursued in this sprint.
- Service-area child pages (`/ann-arbor/service-area/...` etc.) remain shells.
- The 8 other locations keep the Sprint 1 scaffold.
