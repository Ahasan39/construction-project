# Sprint 4 — Service pages reference audit

Audited 2026-10-17 (Asia/Dhaka). Baseline: clean `main`, local and origin `66e90f515523fe6b2106f1065877785a4df137b3`. README, reference audit, route inventory, design tokens, asset manifest, progress, QA, router, availability, shared components, build and Pages workflow inspected. No applicable AGENTS.md found in repository or parent directories.

All five live URLs returned **200**, stayed on the requested HTTPS trailing-slash URL, and were opened in Chromium at **1440×900, 768×900 and 390×900**. Screenshots: `evidence/sprint-4/reference-{service}-{width}.webp`. Structured DOM/image geometry: `reference-audit.json`. Disclosures: `reference-interactions.json`. Screenshots were visually reviewed against local captures at the same viewport sizes.

## Shared observed composition

The reference has a 320px panoramic photograph below its header at desktop/tablet; mobile uses a shorter approximately 200px photo. The desktop introduction overlaps the photograph by approximately 100px, has a thin cyan top border, white copy panel and pale gray Current Specials/location panel with a small home photo. The 1380px content area has 30px outer gutters at 1440px. Intro copy has about 80px inset; H1 is 56px, H2 40px, body approximately 16px. At 768px the introduction and specials stack, the specials photo disappears, and features become image-first stacks. At 390px the introduction is full-width, H1 around 36px, with smaller section padding. Cards collapse from four across to two at tablet and one on mobile. Related cards go from five across to stacked cards. Trust indicators wrap to two at tablet and one at mobile.

No service page has the homepage estimate form. Retain one existing AppShell header/footer. No additional financing footer strip was visible during these service-page captures; the dark final estimate panel overlaps the footer surface. The existing demo header/footer differs from the reference and was intentionally preserved.

Some reference lower-page lazy images remained 1×1 data placeholders even after scrolling; captures document that limitation. Other images loaded on mobile after the same page was resized. Image box proportions and accessible labels were available; the implementation uses visible local photo substitutes rather than reproducing empty boxes. No claim of exact photography or pixel parity.

## Roofing — https://www.mrroof.com/roofing/

- [x] Panoramic roof photo; breadcrumb, Roofing Services introduction; Current Specials/location panel.
- [x] Four reference trust indicators.
- [x] Four photo cards: replacement, repair, metal and commercial roofing, navy bodies/red actions/cyan lower rule.
- [x] Awards heading and explanatory text; credential row (existing labeled demo artwork substituted).
- [x] Two-column history/consultation composition; three collapsed benefits: warranty, financing, accountability.
- [x] Navy review area with a single visible testimonial; review navigation. Existing accessible carousel reused in single-slide mode.
- [x] Five related-service cards (Siding, Windows, Gutters, Masonry, Insulation).
- [x] Final estimate panel.

Reference benefits expose `aria-expanded=false` initially. Local native details provide keyboard toggling. The reference review widget showed one white review panel; local previous/next, dots and explicit play/pause are accessible enhancements inherited from the existing carousel. No automatic motion is enabled by default.

## Siding — https://www.mrroof.com/siding/

- [x] Photo, breadcrumb, service eyebrow and longer protection headline; specials/location panel.
- [x] Trust row, then four photo/product cards: CraneBoard, Market Square, James Hardie, LP SmartSide.
- [x] Siding-style carousel at left, premium-style explanation at right. Six observed profiles retained; local photos are illustrative, not product swatches.
- [x] Repair/restoration copy and checklist at left, photo at right.
- [x] Accents/trim photo at left and copy/checklist at right, gray surface.
- [x] Color consultation at left and photo at right.
- [x] Visualizer photo at left, description/checklist/action at right.
- [x] Six collapsed FAQs, gray surface; first reference FAQ clicked and expanded successfully.
- [x] Related services and final estimate panel.

No review strip/award band added. Product/color actions whose destination is not an existing route lead to the demo estimate instead of inventing detail routes. The existing visualizer shell remains unfinished. Local carousel is manual, wraps in both directions, and announces the current profile; reference swipe/autoplay timing was not established.

## Windows — https://www.mrroof.com/windows/

- [x] Panorama, window-installation headline, intro and specials panel.
- [x] Why-choose image/text composition and checklist, followed by trust row.
- [x] Local installation list beside photo on gray surface (nine regional entries).
- [x] ProVia product overview opposite image.
- [x] Navy centered visualizer/estimate callout.
- [x] Related services as a text list and image, not the five-card strip.
- [x] Centered pale financing section.
- [x] Navy no-obligation estimate section.
- [x] Five collapsed replacement-window FAQs.
- [x] Final Ready to get started panel with estimate and centralized demo telephone.

No reviews or award band observed or added. Local links preserve explicit availability: Nashville window service; other cities use their existing regional hubs. No fabricated city/window routes. ProVia detail CTA is adapted to an estimate because its reference destination is not implemented in this repository.

## Gutters — https://www.mrroof.com/gutters/

- [x] Gutter panorama; Gutters & Downspouts introduction and specials.
- [x] Installation explanation/checklist at left, consultation image at right.
- [x] Trust indicators.
- [x] Seamless-gutter benefits: photo left, explanation/checklist right, gray background.
- [x] Gutter guards: copy/checklist left, image right.
- [x] Related services and final estimate panel.

No FAQs, product grid, reviews or awards were observed or added.

## Masonry — https://www.mrroof.com/masonry/

- [x] Home panorama, masonry/chimney introduction and specials.
- [x] Four bordered white service cards: chimney repair, reline, tuckpointing, stone veneer. Reference cyan illustrations replaced by restrained numbered markers, not invented credentials.
- [x] Professional repair explanation/checklist at left and consultation photo at right. Chimney cleaning exclusion retained.
- [x] Trust indicators after the explanation.
- [x] Stone veneer: image left, text right on gray.
- [x] 3D exterior visualizer: image left, text/checklist right on white.
- [x] Related services and final estimate panel.

No FAQs, reviews or awards were observed or added.

## Implementation and deliberate differences

Typed content is in `src/data/servicePages.ts`; focused sections in `ServiceSections.tsx`; page-specific composition in `ServiceHubPage.tsx`. The existing top-level dispatcher chunk includes the service bodies and route CSS. Its loading placeholder reserves a viewport so the footer does not flash at the top before the route chunk loads. This is still client rendering, not prerendering.

Local prose is original and more concise than reference marketing copy. It avoids claiming reference credentials for this demo. Existing reference statistics/testimonials/credential artwork are explicitly labeled. No new ratings, logos or certifications. Substituted photos are reused across some sections; product-specific and masonry photography remain a visual difference. Related services use local photo thumbnails instead of the reference illustrations. No new reference image downloads/hotlinks.

Small motion enhancements: 180ms color/border transitions, 180ms disclosure plus rotation. Native disclosures reveal immediately without height animation. Existing review movement remains transform-based; reduced-motion disables transitions and autoplay. Siding selector is manual and does not hide content pending an observer. No new animation library, entrance opacity gate, parallax or scroll hijacking.

Insulation has no supported global route, so its card uses an estimate action. Four roofing detail links intentionally retain their existing Sprint 4.5 shells. Location pages, financing and visualizer remain future-sprint shells; this sprint does not claim them complete.
