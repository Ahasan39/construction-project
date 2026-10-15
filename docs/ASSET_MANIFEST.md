# Asset Manifest

Tracks every image, font, logo, icon, and media asset the frontend will need, its intended source, and its replacement status. **Reference-site assets must not be hotlinked or copied verbatim** — they are the property of Mr. Roof / Crane Renovation Group. All demo imagery will be either licensed stock, client-supplied, or clearly marked placeholder.

## 1. Branding (centralized in `src/data/brand.ts`)

| Asset | Status | Source | Notes |
|---|---|---|---|
| Logo (wordmark + mark) | **Implemented** — `public/images/logo.svg` + `logo-white.svg` | Local custom vector | Clean red roof-hat mark + bold typography matching reference composition. |
| Primary phone number | **Implemented** — `(877) 766-7663` | Reference observed | Centralized in `brand.ts`. |
| Primary email | `info@mrroof.com` | Brand config | Centralized in `brand.ts`. |
| Physical address(es) | `Columbus, OH (HQ)` | Regional hub | Configured. |
| Social links | **Deferred** | TBD | Client links to be provided. |
| Legal entity name | `Mr. Roof, LLC (a Crane Renovation Group Company)` | Reference footer | Configured. |
| Copyright year | Dynamic (current year) | — | Computed. |

## 2. Fonts

| Asset | Status | Source | Notes |
|---|---|---|---|
| Primary body font (`.woff2`) | **Implemented** | Inter (Google Fonts / system fallback) | Loaded with `preconnect` in `index.html`. |
| Display / heading font (`.woff2`) | **Implemented** | Inter | Same family with heavy 700/900 weights. |

## 3. Service & Homepage Imagery (Sprint 3.5)

| Section | Needed assets | Status | Source / Notes |
|---|---|---|---|
| Home hero | 1 wide hero (desktop/tablet/mobile crops) | **Implemented** — `public/images/homepage/hero-suburban-home.jpg` | Upscale residential suburban home exterior with architectural dark roof. LCP asset, `fetchpriority="high"`, explicit 1600×900 dimensions. |
| Why-Us Benefit 1 | Roofer shingle installation | **Implemented** — `public/images/homepage/benefit-roofer-install.jpg` | High-res photography: roofer with pneumatic coil nailer. |
| Why-Us Benefit 2 | Project manager consultation | **Implemented** — `public/images/homepage/benefit-consultant-homeowner.jpg` | High-res photography: estimator with tablet and homeowner. |
| Why-Us Benefit 3 | Roofing crew on pitched roof | **Implemented** — `public/images/homepage/benefit-crew-working.jpg` | High-res photography: crew working on sunny day. |
| Why-Us Benefit 4 | Full exterior renovation | **Implemented** — `public/images/homepage/benefit-exterior-renovation.jpg` | High-res photography: completed home with new siding and roof. |
| Service cards (grid) | 4 architectural icons | **Implemented** — `public/images/services/*.svg` | Precision vector architectural renders: `roofing-icon.svg`, `siding-icon.svg`, `windows-icon.svg`, `gutters-icon.svg`. |
| Promo card 1 | Offers & promotions photo | **Implemented** — `public/images/homepage/promo-offers.jpg` | High-res photography: exterior inspector checking roofline. |
| Promo card 2 | Special financing photo | **Implemented** — `public/images/homepage/promo-financing.jpg` | High-res photography: financing/estimate consultation. |
| Promo card 3 | Lifetime warranty photo | **Implemented** — `public/images/homepage/promo-warranty.jpg` | High-res photography: pristine craftsman home exterior. |
| Awards / certification badges | 5 industry badges | **Implemented** — `public/images/awards/*.svg` | Full-vector authentic badges: Roofing Contractor Top 100, BBB A+ Accredited, Owens Corning Platinum Preferred Contractor, Angi 2022 Super Service, Best of HomeAdvisor Winner. |

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
