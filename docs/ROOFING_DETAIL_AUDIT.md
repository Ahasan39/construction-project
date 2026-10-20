# Roofing detail audit — Sprint 4.5

Audited 2026-10-18, complete pages in Chromium at 390, 768 and 1440px (900px viewport height). Destinations discovered from the live Roofing hub. All four returned HTTP 200 with no redirect. Matching full-page reference captures and heading/geometry metadata are in `evidence/sprint-4.5/`.

| Page | Reference URL | Local route |
|---|---|---|
| Replacement | https://www.mrroof.com/roofing/roof-replacement/ | /roofing/roof-replacement/ |
| Repair | https://www.mrroof.com/roofing/roof-repair/ | /roofing/roof-repair/ |
| Metal | https://www.mrroof.com/roofing/metal-roofing/ | /roofing/metal-roofing/ |
| Commercial | https://www.mrroof.com/roofing/commercial-roofing/ | /roofing/commercial-roofing/ |

## Observed and implemented section checklists

All pages use a photographic panorama, overlapping white introduction and gray Current Specials/location panel, Home/Roofing breadcrumbs, a final navy estimate CTA and the shared footer. No estimate form or review carousel appears in these four page bodies.

### Replacement
- [x] Roof Replacement introduction and specials.
- [x] Contractor selection feature and five benefits.
- [x] Four reference trust indicators.
- [x] Gray image-first replacement benefits, five points.
- [x] Shingle Packages / Roofing Systems introduction.
- [x] Three tiers: RoofGuard / RoofGuard+ / ThunderGuard; product names, coverage labels and estimate actions.
- [x] Protection Above. And Beyond. feature.
- [x] Roof Color Visualizer feature; local text link to the pending visualizer destination.
- [x] Three FAQs, including repair comparison and insurance question.
- [x] Five related services and final estimate panel.

### Repair
- [x] Roof Repair introduction and specials.
- [x] Local Roof Repair Specialist feature and three benefits.
- [x] Trust indicators.
- [x] Gray emergency service feature and three benefits.
- [x] Protection feature with financing and accountability disclosures.
- [x] Three FAQs: pricing, repair/replacement, same-day work.
- [x] Final estimate panel. No related-service section observed or added.

### Metal
- [x] Metal Roofing introduction and specials.
- [x] Metal Roofing Pros feature and four benefits.
- [x] Trust indicators.
- [x] Gray standing-seam benefits feature and six points.
- [x] Modern Look feature and financing disclosure.
- [x] Metal Roof Color Visualizer feature.
- [x] Related services and estimate panel. No FAQ observed or added.

### Commercial
- [x] Commercial Roofing Contractors introduction, bold subtitle and specials.
- [x] Occupied-building feature, partnership subtitle, three benefits.
- [x] Commercial-specific trust values: #1, A+, 100k+, 25+.
- [x] Gray services feature with five system/service types.
- [x] Four photo cards: TPO, EPDM, metal, shingle/steep-slope.
- [x] Three-step process with navy/red/cyan headings and consultation CTA.
- [x] Ten FAQs, including multifamily, overlay/removal, timing, systems, maintenance and repair/replacement.
- [x] Final estimate panel. No related-service section observed or added.

## Composition and interaction

Desktop uses approximately 320px panorama, 100px intro overlap, 2:1 intro/sidebar, 56px title, 40px section titles and generous 80–100px section spacing. Alternating two-column features and gray surfaces preserve the observed sequence. Tablet introductions stack; feature photography leads copy. Mobile removes the overlap and small specials image, stacks cards and trust indicators, and uses 36px page titles. The reference commercial introduction is longer than the residential headings and wraps naturally.

FAQs and benefit disclosures are independent, keyboard-operable details/summary controls. The native location selector routes only to explicit supported location variants, falling back to a regional hub. Buttons, focus and disclosure indicators use existing restrained transitions and reduced-motion rules. Hero content never waits for animation. No scroll effects or new dependencies.

## Deliberate differences

Original explanatory prose preserves topic density but does not reproduce reference marketing verbatim. No fabricated demo warranty, accreditation, partnership or emergency dispatch promise. Reference statistics and package coverage are labeled. Product logos are represented by text labels. Existing local illustrations substitute for reference residential photography; generated standing-seam and low-slope commercial scenes provide appropriate distinct imagery. The commercial reference panorama shows multifamily housing; the substitute shows a commercial membrane roof. The same generic membrane scene appears in TPO/EPDM cards and is not a product identification photograph. Visualizers link to the existing future shell; no functioning design tool is claimed. Financing and free-estimate destinations remain future shells. Insulation links to the confirmed estimate destination. No reference contact or submission endpoints are activated.

Browser/comparison results, exact performance measurements and deployment evidence are recorded in QA_REPORT.md after verification.

## Final comparison matrix — 2026-10-20

| Page | Reference sections | Implemented sections | Browser checked | Remaining differences |
|---|---|---|---|---|
| Replacement | Intro/specials; contractor feature; trust; benefits; 3 packages; protection; visualizer; 3 FAQs; 5 related services; estimate | All listed, same order | Chromium 153 and Firefox 155; 11 widths plus landscape | Original prose changes wrapping/heights; text product labels; residential photo substitutes; photo rather than 3D visualizer; text trust values rather than icons |
| Repair | Intro/specials; specialist; trust; emergency; protection with 2 disclosures; 3 FAQs; estimate | All listed, same order | Both engines, same width set | Exterior consultation instead of indoor reference; illustrative emergency crew; shorter protection text; no claimed emergency dispatch |
| Metal | Intro/specials; pros; trust; standing-seam benefits; modern look/financing; visualizer; related; estimate | All listed, same order; no added FAQ | Both engines, same width set | One generated standing-seam scene reused within this page; photo rather than 3D preview; original prose and explicit illustration captions |
| Commercial | Intro/subtitle/specials; occupied-building feature; commercial trust; services; 4 systems; 3 process steps; 10 FAQs; estimate | All listed, same order; no added reviews/related strip | Both engines, same width set | Low-slope generated roof replaces multifamily reference hero; generic membrane image for TPO/EPDM; text stats; shorter process copy; links use confirmed local destinations |

Reference captures contained some blank lazy-image regions even after scrolling; these are documented rendering failures, not a reason to omit the corresponding local media. Shared header/footer remain the prior implementation, including existing mobile navigation differences from the reference. Detailed screenshots are reference-informed comparisons, not a pixel-perfect equivalence claim. Desktop intro padding, 18px feature copy, mobile 18px intro copy/insets, teal package headers and solid package/product actions were corrected after visual comparison. Commercial FAQ surface is white, unlike the residential gray FAQs. Reference-related icons remain inherited photo substitutes.
