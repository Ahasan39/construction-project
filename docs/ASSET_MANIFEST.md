# Asset Manifest

Tracks every image, font, logo, icon, and media asset the frontend will need, its intended source, and its replacement status. **Reference-site assets must not be hotlinked or copied verbatim** — they are the property of Mr. Roof / Crane Renovation Group. All demo imagery will be either licensed stock, client-supplied, or clearly marked placeholder.

## 1. Branding (centralized in `src/data/branding.ts`)

| Asset | Status | Source | Notes |
|---|---|---|---|
| Logo (wordmark + mark) | **Deferred — awaiting client** | TBD | Currently rendered as the company name text in `SiteHeader`. Swap to an SVG logo (and update `brand.logoSrc`) when the client supplies it. |
| Primary phone number | **Pending client confirmation** | TBD | Reference shows two numbers; see `REFERENCE_AUDIT.md §2`. |
| Primary email | Placeholder: `info@example.com` | TBD | Client to confirm. |
| Physical address(es) | **Blocked** | TBD | Reference does not display an address on homepage; client to supply. |
| Social links | **Deferred** | TBD | Reference uses mrroof.com's own; we will use blank/client links. |
| Legal entity name | Placeholder: client's company name | TBD | Replace in branding constants. |
| Copyright year | Dynamic (current year) | — | Computed. |

## 2. Fonts

| Asset | Status | Source | Notes |
|---|---|---|---|
| Primary body font (`.woff2`) | **Blocked/unverified** | TBD after live measurement | Must be licensed for self-hosting; subset to Latin basic + used glyphs. |
| Display / heading font (`.woff2`) | **Blocked/unverified** | TBD | Same subsetting rule. |

Open-license fallback plan: if client cannot license the reference's exact face, use closest open match (Inter / Source Sans / Mulish for sans; Playfair / Fraunces for serif if needed) and document the substitution in `QA_REPORT.md`.

## 3. Service imagery

Each service hub + variant and each location hub expects at minimum one hero image and one or more supporting photos.

| Section | Needed assets | Status |
|---|---|---|
| Home hero | 1 wide hero (desktop/tablet/mobile crops) | **Substituted** — `public/images/placeholders/hero-home.svg` (illustrative SVG). Marked LCP, `fetchpriority="high"`, explicit 1600×1000 intrinsic dimensions. |
| Service hubs (Roofing, Gutters, Siding, Windows, Masonry) × 5 | 1 hero each | **Deferred — placeholder** |
| Service variants (Replacement, Repair, Metal, Commercial) × 4 | 1 hero each + optional gallery | **Deferred — placeholder** |
| Location hubs × 10 | 1 hero each (ideally local skyline) | **Deferred — placeholder** |
| Service cards (grid) | 1 thumbnail per service | **Substituted** — `PlaceholderImage` component (inline SVG, labelled "Placeholder: …") |
| Testimonial avatars | 1 per testimonial (or initial glyph) | **Deferred — generated initials by default** |
| Awards / certification badges | SVG icons for Consumer Choice, BBB A+, Owens Corning Platinum, GAF Master Elite (if applicable) | **Blocked — awaiting client confirmation of which awards apply** |
| Promo banner background | 1 image + solid-color fallback | **Deferred — placeholder** |
| Blog thumbnails | 1 per article | **Deferred — placeholder stock** |

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
