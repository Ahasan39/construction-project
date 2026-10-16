# Asset Manifest

Tracks every image, font, logo, icon, and media asset the frontend will need, its intended source, and its replacement status. **Reference-site assets must not be hotlinked or copied verbatim** — they are the property of Mr. Roof / Crane Renovation Group. All demo imagery will be either licensed stock, client-supplied, or clearly marked placeholder.

## 1. Branding (centralized in `src/data/brand.ts`)

| Asset | Status | Source | Notes |
|---|---|---|---|
| Logo (wordmark + mark) | **Implemented (Demonstration Recreation)** — `public/images/logo.svg` + `logo-white.svg` | Local custom vector paths | Demonstration pure-vector recreation with explicit dimensions (220×54) and vector letterforms (`fill="#0F2231"` / `fill="#FFFFFF"`, red accent `#D9232A`), avoiding font dependencies. Not official client source assets; substituted for layout testing. |
| Favicon | **Implemented** — `public/favicon.ico` + SVG | Generated from logo mark | Multi-resolution 16×16, 32×32, 48×48 `.ico` and vector SVG icon linked in `index.html`. Resolves Lighthouse PWA/best practices checks. |
| Primary phone number | **Implemented** — `(877) 766-7663` | Reference observed | Centralized in `brand.ts`. |
| Primary email | `info@mrroof.com` | Brand config | Centralized in `brand.ts`. |
| Physical address(es) | `Columbus, OH (HQ)` | Regional hub | Configured. |
| Social links | **Deferred** | TBD | Client links to be provided. |
| Legal entity name | `Mr. Roof, LLC (a Crane Renovation Group Company)` | Reference footer | Configured. |
| Copyright year | Dynamic (current year) | — | Computed. |

## 2. Fonts

| Asset | Status | Source | Notes |
|---|---|---|---|
| Primary body & heading font | **Implemented (Self-Hosted)** — `public/fonts/metropolis-*.ttf` | Metropolis by Chris Simpson (SIL Open Font License 1.1) | 4 weights self-hosted (Regular 400, Medium 500, SemiBold 600, Bold 700) matching reference typography. Loaded via `@font-face` with `font-display: swap` in `src/styles/globals.css`. Replaces render-blocking external Google Fonts link, eliminating ~1,014ms render delay. |

## 3. Service & Homepage Imagery (Sprint 3.5 – 3.8)

| Section | Needed assets | Status | Source / Notes |
|---|---|---|---|
| Home hero | 1 wide hero (desktop/tablet/mobile crops) | **Implemented** — `public/images/homepage/hero-suburban-home.webp` (+ responsive `hero-suburban-home-mobile.webp` and JPEG fallback) | Upscale residential suburban home exterior with architectural dark roof. LCP asset, `fetchpriority="high"`, explicit dimensions. Responsive WebP `<picture>` implementation with preloaded srcset in `index.html`. Compressed to ~75 KB WebP. |
| Why-Us Benefit 1 | Roofer shingle installation | **Implemented** — `public/images/homepage/benefit-roofer-install.webp` (+ JPEG) | High-res photography: roofer with pneumatic coil nailer. Rendered with tall vertical proportions (`min-h-[300px]`). Compressed to ~35 KB WebP. |
| Why-Us Benefit 2 | Project manager consultation | **Implemented** — `public/images/homepage/benefit-consultant-homeowner.webp` (+ JPEG) | High-res photography: estimator with tablet and homeowner. Compressed to ~42 KB WebP. |
| Why-Us Benefit 3 | Roofing crew on pitched roof | **Implemented** — `public/images/homepage/benefit-crew-working.webp` (+ JPEG) | High-res photography: crew working on sunny day. Compressed to ~39 KB WebP. |
| Why-Us Benefit 4 | Full exterior renovation | **Implemented** — `public/images/homepage/benefit-exterior-renovation.webp` (+ JPEG) | High-res photography: completed home with new siding and roof. Compressed to ~38 KB WebP. |
| Service cards (grid) | 4 architectural icons | **Implemented** — `public/images/services/*.svg` | Precision vector architectural renders: `roofing-icon.svg`, `siding-icon.svg`, `windows-icon.svg`, `gutters-icon.svg`. Displayed directly at prominent scale (~140–180px) on `#F4F6F8` flat panels in Sprint 3.7. |
| Promo card 1 | Offers & promotions photo | **Implemented** — `public/images/homepage/promo-offers.webp` (+ JPEG) | High-res photography: exterior inspector checking roofline. Compressed to ~31 KB WebP. |
| Promo card 2 | Special financing photo | **Implemented** — `public/images/homepage/promo-financing.webp` (+ JPEG) | High-res photography: financing/estimate consultation. Compressed to ~33 KB WebP. |
| Promo card 3 | Lifetime warranty photo | **Implemented** — `public/images/homepage/promo-warranty.webp` (+ JPEG) | High-res photography: pristine craftsman home exterior. Compressed to ~28 KB WebP. |
| Awards / certification badges | 5 industry badges | **Implemented (Demonstration Vectors)** — `public/images/awards/*.svg` | Demonstration vector approximations for layout testing: Roofing Contractor Top 100, BBB A+ Accredited, Owens Corning Platinum Preferred Contractor, Angi 2022 Super Service, Best of HomeAdvisor Winner. Each badge has explicit 160×80 dimensions and high-contrast fills against `#0C1F33`. Not verified client credentials or official third-party seals; to be substituted with verified client licenses before production launch. |

## 4. Icons

Use Lucide or Heroicons (MIT-licensed) via tree-shakeable imports. No icon-font. No Font Awesome unless the client requires it.

## 5. Replacement rules

1. Every placeholder image file has its filename prefixed `placeholder-` and lives under `public/images/placeholders/`.
2. Each placeholder is listed in this manifest with a `Replace by` sprint target.
3. When a real asset arrives, update this manifest row from **Deferred/Placeholder** to **Implemented** with the licensing source.
4. No reference asset (any file served from `mrroof.com` or its CDN) may be committed. If a visual match requires copying structure (e.g. an awards badge layout), it must be redrawn, not re-encoded.

## 6. Legal and attribution

- All third-party icons / fonts / stock images used in the demo must be MIT, CC0, CC-BY (with attribution recorded here), or purchased with a license certificate stored outside the repo.
- Reference testimonials, awards, and company statistics (e.g. "500,000+ customers", "60+ years") visible on mrroof.com are **not transferable** to our build and will be replaced with clearly placeholder content.
