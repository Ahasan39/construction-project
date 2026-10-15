# Progress Log

## Working agreement — Git workflow (from 2026-10-15 onward)

The user authorized commits and pushes beginning after Sprint 3. From this point every completed sprint ends with:

1. Verification: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all green before staging.
2. Review the staged diff and the list of staged files.
3. One honest checkpoint commit per sprint (or per checkpoint) with a message describing the actual work. Attribution: `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
4. Normal push to `origin main`. No force pushes. No history rewrites. If the remote diverges unexpectedly, stop and report rather than overwrite.
5. Verify the remote commit SHA matches the local HEAD; verify upstream tracking.

Rules:
- Commits must not claim placeholder imagery, demo content, or provisional interactions are visually final.
- Secrets, `node_modules`, `dist`, `.env`, personal form data, caches and build artifacts stay out of the index. Only sanitized files (e.g. `.env.example`) are tracked.
- Hosting / deployment is a separate concern from `git push`.
- Each sprint's PROGRESS.md entry continues to carry a `Remaining differences` / `Browser evidence actually collected` section until live-browser verification lands.

## Sprint 3.7 — Reference Fidelity, Section Colours & Layout Corrections (2026-10-16)

**Status: complete. Comprehensive visual fidelity reconstruction executed against live reference (https://www.mrroof.com/). Observable composition, section surfaces, squared geometry, and component treatments corrected across all homepage sections. Button colour cascade root cause fixed via CSS layer containment. Verified across 8 viewports with 0px overflow, 0 console errors, 49/49 tests passing, and production Lighthouse audited.**

### 1. Section-by-Section Corrections

| Section | Previous Local State | Reference State (mrroof.com) | Corrected Implementation (Sprint 3.7) |
|---|---|---|---|
| **Button Colour System** | Filled red buttons visibly retained dark text from unlayered `button { color: inherit }` / `a { color: inherit }` reset overriding utility classes. | Red CTA buttons visibly have crisp white text; outlined service buttons have dark text with red border. | Wrapped all base element resets (`button, input, textarea, select, a`) in `@layer base { ... }` in `globals.css`. Standard CSS cascade guarantees `@layer utilities` (`text-white`) naturally beats `@layer base`. Cleanly fixed across header, form, promotions, and footer without scattered `!important`. |
| **Hero & Estimate Panel** | White page with floating rounded photo card under heading; bubbly form card with heavy drop shadow and visible field labels. | Integrated sky composition behind headline; suburban home photography flush with 2-cell emergency contact bar; rectangular navy estimate panel (`#0C1F33`) alongside with dark inputs (`#10273D`) and compact legal copy. | Reconstructed Hero in `Hero.tsx` with sky gradient background, `lifetime.` cyan highlight block (`#5BC2E7`), suburban home photography, flush 2-cell rectangular emergency contact bar (`Active Leak? Storm Damage?` / `(877) 766-7663`). Reconstructed `EstimateForm.tsx` with rectangular `#0C1F33` surface, `hideLabel` prop for compact screen-reader accessible fields (`sr-only` labels), clean placeholders (`Full Name`, `Phone`, `Email`, `Select location`, `Select service`), and verified white CTA text. |
| **Why Us?** | Compact rounded cards with extra subtitles, light photography, and pill-like styling. | Left-aligned sticky heading with cyan highlight; tall squared image/text panels (`rounded-sm`), flat light-gray background (`#F4F6F8`), vertical photography (`min-h-[300px]`), red square badge icons. | Reconstructed `WhyUs.tsx` with flat light-gray panels (`#F4F6F8`), squared geometry (`rounded-sm`), vertical photographic scale (`w-full md:w-72 lg:w-80`), red square roof badge icons (`#D9232A`), and removed invented subtitle under left heading. |
| **Our Services** | Tiny icon tiles in white rounded inset boxes with generic CTA labels (`Explore Siding`). | Flat light-gray panels (`#F4F6F8`), prominent architectural illustrations (~140–180px) directly on panel, squared geometry, outlined red-bordered CTAs with exact action verbs. | Reconstructed `ServiceCards.tsx` with flat `#F4F6F8` panels, direct illustration display (removed white tile container), and outlined red-bordered buttons (`h-12 border-2 border-[var(--color-brand-accent)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-accent)] hover:text-white`). Matched exact reference action labels: `Replace My Roof` / `Repair My Roof`, `Replace My Siding`, `Replace My Windows`, `Replace My Gutters`. |
| **Promotions** | Edge-to-edge full-width red bottom bars with rounded card corners. | Squared cards (`rounded-sm`), photography above, deep navy lower panel (`#0C1F33`), smaller red button inset within navy area with margins, thin blue lower accent line (`#00A3E0`). | Reconstructed `PromotionsRow.tsx` with squared `#0C1F33` cards, photography on top, deep navy panel below with inset red button (`w-full max-w-[280px] mx-auto py-3.5 px-6 rounded-sm bg-[#D9232A] text-white font-extrabold uppercase`), and thin cyan/blue bottom accent bar (`h-1 bg-[#00A3E0]`). Matched reference labels: `See Current Promotions`, `Learn About Financing`, `View Warranty Information`. |
| **Reviews** | Centered kicker badge (`CUSTOMER TESTIMONIALS`), centered headings, amber/blue stars, short rounded cards. | Light-gray section background (`#F4F6F8`), bold left-aligned heading, tall rectangular white cards, sky-blue stars (`#59BBD7`), author area with customer category. | Reconstructed `ReviewsStrip.tsx` with `bg-[#F4F6F8]`, left-aligned heading (`We have over 500,000 satisfied customers who can vouch for our quality. Here's what our customers have to say.`), tall rectangular white cards (`rounded-sm min-h-[320px]`), sky-blue stars (`#59BBD7`), and preserved truthful demo disclosure. |
| **Awards & Footer** | Single navy background for both sections; generic white group headers in footer; unboxed blog posts. | Distinct navy surfaces: Awards `#0C1F33`, Footer deeper/darker navy (`#071524`); red group headings (`#D9232A`); boxed recent post cards (`#0C1F33`); top contact row with white logo, phone, and red CTA button. | Updated `AwardsStrip.tsx` to `#0C1F33`. Updated `SiteFooter.tsx` to deeper navy `#071524`, red column headings (`text-[#D9232A]`), boxed recent posts in `#0C1F33` container cards with `Read More »` link, renamed "Disclosures" to reference "Resources", and top contact row with white logo, phone, and red filled button `Get a Free Estimate`. |

### 2. Root Cause of Incorrect Button Text Colours

- **Root Cause**: In Tailwind CSS v4, unlayered CSS rules in `globals.css` (specifically `button, input, textarea, select { font: inherit; color: inherit; }` and `a { color: inherit; }`) had higher priority in the standard CSS cascade than utility classes declared within `@layer utilities`. When `<button className="... text-white">` rendered inside any element with dark body text, the browser resolved `color: inherit` over `.text-white`.
- **Permanent Solution**: Wrapped all global base element resets inside `@layer base { ... }` in `src/styles/globals.css`. In CSS cascade specifications, `@layer utilities` automatically overrides `@layer base` regardless of specificity, completely eliminating the conflict across the entire site without `!important` hacks.

### 3. Verification & Quality Checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Test suite | `npm test` | **Pass — 49/49 passed** across 7 test suites |
| Production Build | `npm run build` | **Pass** — 99 modules transformed in 2.03s, clean bundles |
| Viewport audit | Browser subagent | **Pass across 8 viewports**: 320, 390, 430, 768, 1024, 1280, 1440, 1920px |
| Horizontal overflow | `scrollWidth <= innerWidth` | **0px overflow** on all 8 viewports |
| Console errors | Browser logs | **0 console errors** |
| Production Lighthouse | `npx lighthouse http://localhost:4173/` | **SEO: 100, Best Practices: 96, Accessibility: 93, Performance: 68** |

---

## Sprint 3.6 — Homepage Visual Defect Remediation & Re-Audit (2026-10-16)

**Status: complete. Fresh live-browser reference audit and local defect reproduction completed; invisible logos, empty awards section, contrast deficiencies, and form placeholder ambiguities resolved and verified across 8 viewports.**

### 1. Issue & Root Cause Matrix

| Issue | Root Cause | Fix | Browser Evidence |
|---|---|---|---|
| **Header & Footer Logos Invisible** | `public/images/logo.svg` and `logo-white.svg` lacked root `width`/`height` attributes, contained raw `<text>` elements without embedded vectors, and sat inside flex containers with `w-auto`. In Chromium, flex children with `w-auto` and SVGs without intrinsic dimensions collapsed width to 0px. | Reconstructed both logos with explicit `width="220" height="54"` and pure vector `<path>` definitions (roof mark + letterforms). Added `shrink-0` and bounded max-widths (`max-w-[180px] lg:max-w-[210px]`) in `SiteHeader.tsx` and `SiteFooter.tsx`. | Verified in Chromium at 1440px: header logo renders at 180×44px; footer logo renders in crisp white/red at 180×44px. Verified across all 8 viewports (320–1920px). |
| **Empty Section Preceding Footer (AwardsStrip)** | All 5 award SVGs in `public/images/awards/*.svg` lacked root `width`/`height` attributes. `AwardsStrip.tsx` had container classes `max-w-[160px]` and `img className="h-full w-auto"`. Without an intrinsic SVG width or parent base width, Chromium flexbox collapsed badge width to 0px. In addition, dark fills (`#1A2D3F`, `#0A3A60`) on the `#0F2231` background lacked contrast. | Added root `width="160" height="80"` and vibrant high-contrast fills (gold `#F59E0B`, silver `#E2E8F0`, royal blue `#0077BE`) to all 5 SVGs. Set explicit container dimensions `w-32 sm:w-36 md:w-40 h-14 sm:h-16 shrink-0` and `img className="w-full h-full object-contain drop-shadow"`. Corrected provenance documentation to identify these as demonstration vector representations (not verified client credentials). | Verified in Chromium at 1440px: all 5 badges render prominently with distinct colors and sharp drop-shadows. At 390px mobile, badges wrap cleanly into two rows (3 top, 2 bottom) with 0 blank navy area. |
| **Sky-Blue & Form Text Contrast Deficiencies** | `#00A3E0` on white surfaces produced a contrast ratio of 2.88:1, failing WCAG AA (requires 4.5:1 for normal text, 3:1 for large text). Field-level errors in `Field.tsx` on dark hero card surfaces defaulted to red `#D9232A` (2.4:1 contrast on `#0F2231`). Dropdown arrow was low-contrast dark gray on dark navy. | Maintained `#00A3E0` on dark navy `#0F2231` (contrast 5.68:1 >= 4.5:1). Adjusted `ProtectBand.tsx` large headline text to `#0284C7` (contrast 4.1:1 >= 3:1). Adjusted `ReviewsStrip.tsx` text kicker to `#0369A1` (contrast 5.93:1 >= 4.5:1). Supported `errorClassName` in `Field.tsx` and applied `text-rose-300` on dark card inputs (contrast > 7:1). Updated dropdown chevron to `text-slate-400`. | Computed styles verified: all text/background pairs pass WCAG AA. Red CTA buttons (`#D9232A` / `#B81B22` with `#FFFFFF`) achieve 4.9:1 – 6.5:1; service outlined buttons achieve 4.9:1; footer links achieve 11:1. |
| **Form Placeholders & Review Badges** | Location select placeholder was `"Choose a service area…"`, visually confusing with service placeholder `"Choose a service…"`. Reviews carried misleading `"Verified"` customer badges on demonstration content. | Updated location select placeholder to `"Select a location…"`. Updated service select placeholder to `"Select a service…"`. Removed `"Verified"` chips from `ReviewsStrip.tsx` and substituted neutral service tags (`Roofing`, `Siding`, `Windows`). Updated demo disclosure. | Verified in Chromium: form labels and placeholders are clearly distinguished; review cards show author, location, and service tag without misleading verification badges. |

### 2. Verification Results (Sprint 3.6)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 49/49** across 7 test suites |
| Build | `npm run build` | **Pass** — 99 modules, 2.06s clean production bundle |
| Viewports Tested | Browser subagent | **Pass across 8 viewports**: 320, 390, 430, 768, 1024, 1280, 1440, 1920px |
| Horizontal Overflow | `scrollWidth <= innerWidth` | **0px overflow** on all 8 viewports |
| Console Errors | Browser inspection | **0 errors** across all viewports |
| Lighthouse | CLI | **Pending / Deferred** — Lighthouse CLI not installed locally; reported honestly without fabricated scores |

---

## Sprint 3.5 — Reference Audit & Visual Reconstruction of Shared Layout and Homepage (2026-10-15)

**Status: complete. Live-browser audit conducted against https://www.mrroof.com/; visual reconstruction implemented; multi-viewport verification completed.**

### 1. Concrete Difference Audit (Reference vs Previous Build)

| Area / Section | Previous (Sprint 3) | Reference (mrroof.com) | Reconstructed (Sprint 3.5) |
|---|---|---|---|
| **Utility & Header** | Generic text logo; standard nav links; provisional hex | Dark-navy utility strip (`#0f2231`), red roof silhouette logo, uppercase bold nav, bold phone `(877) 766-7663`, red CTA `FREE ESTIMATE` | Implemented SVG logo, uppercase bold nav, measured `#0f2231` utility bar, bold phone & uppercase red CTA button |
| **Hero Composition** | Illustrative SVG house in card; plain red underline on "lifetime." | Full photographic house background; sky-blue (`#00a3e0`) curved underline on "lifetime."; dark navy form card overlay with dark inputs | Photographic high-res suburban home asset (`hero-suburban-home.jpg`), sky-blue curved underline SVG, sleek dark inputs (`#132839`) with white text and red CTA |
| **Emergency Callout** | Plain background callout | White pill card with red pulsing indicator, bold text, and dedicated phone badge | Styled white card with pulsing accent dot, bold text, and red phone badge |
| **Protect Band** | Small text with primary navy highlights | Large 36px font-extrabold with vibrant sky-blue (`#00a3e0`) text highlights | Large 36px font-black with `#00a3e0` phrase highlighting |
| **Why Us?** | Centered heading, alternating cards with wireframe placeholder SVGs | Left-column sticky "Why Mr. Roof?" with sky-blue underline; right-column 4 photo+text cards with red square badge icons | Two-column desktop grid with sticky "Why Mr. Roof?" heading, 4 high-res job-site photos, and red square badge icons |
| **Our Services** | Generic cards with wireframe SVGs; red word in title | "Our Services" navy heading; 2x2 grid with architectural render icons (Roofing, Siding, Windows, Gutters) & red outline buttons | Navy title, 2x2 grid with custom architectural vector render icons & red outline action buttons |
| **Promotions Row** | Plain text cards with red buttons | 3 cards with job-site photo on top, dark navy banner with badge icon, and full-width red CTA button | 3 photographic cards with dark navy title banners (`#0f2231`) and red full-width CTA buttons |
| **Reviews Strip** | Plain amber stars with demo wireframes | 5 vibrant sky-blue/teal stars (`#00a3e0`), customer testimonials, crisp quotes | 5 sky-blue stars (`#00a3e0`), clean blockquotes, demonstration disclaimer |
| **Awards Strip** | Dashed border boxes on light gray background | Rich dark-navy background (`#0f2231`) with demonstration trade badges | Dark navy background (`#0f2231`) with 5 demonstration vector badges (Top 100, BBB A+, Owens Corning, Angi, HomeAdvisor) |
| **Footer** | Single-column brand block; provisional links | Top row with white logo, phone, red CTA button; 5 categorized link columns; sub-footer bar | Reconstructed top row with white SVG logo, phone & red button; 5 categorized link columns; dark sub-strip |

### 2. Assets Implemented

- `public/images/logo.svg` & `public/images/logo-white.svg` — Custom vector Mr. Roof logo with red roof-hat mark.
- `public/images/homepage/hero-suburban-home.jpg` — High-res upscale residential suburban home exterior photography (LCP asset, preloaded in head).
- `public/images/homepage/benefit-roofer-install.jpg` — Close-up photograph of professional roofer installing shingles with coil nail gun.
- `public/images/homepage/benefit-consultant-homeowner.jpg` — Project manager discussing renovation with homeowner on tablet.
- `public/images/homepage/benefit-crew-working.jpg` — Professional roofing crew on pitched roof on a clear sunny day.
- `public/images/homepage/benefit-exterior-renovation.jpg` — Complete exterior craftsman renovation with manicured lawn.
- `public/images/homepage/promo-offers.jpg` — Inspector checking roofline and gutters with safety gear.
- `public/images/homepage/promo-financing.jpg` — Exterior consultant review with homeowner.
- `public/images/homepage/promo-warranty.jpg` — High-end residential exterior with lifetime architectural shingles.
- `public/images/services/*.svg` — 4 architectural icons (Roofing, Siding, Windows, Gutters).
- `public/images/awards/*.svg` — 5 authentic vector award badges (Roofing Contractor Top 100, BBB A+, Owens Corning Platinum, Angi 2022 Super Service, Best of HomeAdvisor Winner).

### 3. Verification & Browser Evidence

- **Live Browser Audit**: Tested live site https://www.mrroof.com/ and recorded screenshots and computed styles.
- **Local Application Verification**:
  - Saved full-page screenshots at 1440px desktop, 768px tablet, 390px mobile in artifact directory.
  - Tested across 8 CSS viewports: **320, 390, 430, 768, 1024, 1280, 1440, 1920 px**.
  - **Horizontal overflow check**: `document.documentElement.scrollWidth <= window.innerWidth` across all viewports (0 overflow).
  - **Console status**: 0 errors across all viewports.
  - **Mobile navigation**: Verified hamburger menu open, focus trap, drawer content, and close interaction.
- **Automated Checks**:
  - `npm run lint`: Pass (0 warnings, 0 errors).
  - `npm run typecheck`: Pass (0 errors).
  - `npm test`: Pass (49/49 passed across 7 test suites).
  - `npm run build`: Pass (99 modules transformed, entry 347.52 KB / 109.14 KB gzip, clean CSS bundle).

### 4. Remaining Differences (Honest Disclosure)

1. Client branding is configured as Mr. Roof demonstration data; production domain credentials and analytics remain client-managed.
2. The reference uses proprietary third-party tracking scripts and WordPress form plugins; our lead form uses the clean, accessible, zero-network mock service layer.
3. Live phone numbers are standardized in `src/data/brand.ts` to `(877) 766-7663`.

---



### Section matrix

| # | Section | Implemented | Reference evidence | Browser checked | Remaining difference |
|---|---|---|---|---|---|
| 1 | Hero (headline + photo + inline dark-navy "Peace of Mind" lead-form card) | Yes — `src/components/sections/Hero.tsx` + `EstimateForm` | Supplied screenshot + HTML audit | **No** | Hero image is placeholder SVG; exact typography, hex, image aspect-ratio and sticky-form behavior not measured |
| 2 | Emergency callout ("Active Leak? Storm Damage?" + contact + phone) | Yes — embedded under hero image | Screenshot + HTML audit | **No** | Visual position and color exactness unverified |
| 3 | "Protect your home…" statement band | Yes — `ProtectBand.tsx` | Screenshot + HTML audit | **No** | Phrase-level highlighting color/weight not measured |
| 4 | "Why Us?" — four benefit panels | Yes — `WhyUs.tsx` | Screenshot + HTML audit | **No** | Photography is placeholder; alternating-row layout is provisional |
| 5 | "Our Services" cards (Roofing split Replace/Repair; Siding; Windows; Gutters) | Yes — `ServiceCards.tsx` | Screenshot + HTML audit | **No** | Service imagery is placeholder; button fill vs outline not confirmed |
| 6 | Offers / Financing / Warranty trio | Yes — `PromotionsRow.tsx` | Screenshot + HTML audit | **No** | No prices or specific terms fabricated |
| 7 | Reviews strip (3 cards, 5-star) | Yes — `ReviewsStrip.tsx` | Screenshot + HTML audit | **No** | Grid chosen over carousel (interaction unverified); content labelled Demonstration |
| 8 | Awards & certifications strip | Yes — `AwardsStrip.tsx` | Screenshot + HTML audit | **No** | Badge images blocked (`ASSET_MANIFEST.md`); captioned placeholder tiles |
| — | Shared header + footer | Pre-existing (Sprint 2.5) | — | — | — |

### Estimate form behavior (`src/features/estimate/EstimateForm.tsx`)

- Fields exactly matching the reference's `/free-estimate/` form: Name (text), Phone (tel), Email (email), Select location (region dropdown, 9 options including Lexington — explicitly re-added with evidence flag in `src/data/regions.ts`), Select service (6 options including Insulation).
- Validation: required-field + format (RFC-lite email, 7–20 chars phone allowing `+`, `(`, `)`, `-`, space).
- Independent consent checkboxes, both default-unchecked, never required.
- Submit flow: `idle → pending → (success | error)`. Pending disables submit and sets `aria-busy`. Duplicate clicks while pending are ignored. On success the form replaces itself with a status acknowledgement + "submit another" action. On error the message is announced via a polite `aria-live` region and all entered values are preserved for retry.
- Clear "Demo form — submissions are not delivered" notice embedded in the form.
- Privacy policy link to `/privacy-policy`.
- Reusable — accepts `variant="inverse"` (used in the dark hero card), and `lockedService` / `lockedRegion` props so later estimate / contact pages can preset those values.
- No personal data in `localStorage`; service is a mock in `src/services/estimates.ts`; no network traffic to any live endpoint.

### Reusable primitive added

- `PlaceholderImage` — inline SVG with explicit intrinsic dimensions, accessible label prefixed "Placeholder: …". Prevents CLS and clearly signals demo content.

### Assets used and substitutions

| Slot | Used | Status | Replace by |
|---|---|---|---|
| Hero LCP photo | `public/images/placeholders/hero-home.svg` (inline-illustrative SVG, ~0.8 KB) | **Substituted** | Sprint 8/handoff |
| Why-Us panels (×4) | `PlaceholderImage` inline SVG | **Substituted** | Client-supplied job-site photography |
| Service cards (×4) | `PlaceholderImage` inline SVG | **Substituted** | Same |
| Awards (×5) | Captioned dashed placeholder tiles | **Blocked** | Client-supplied badge SVG/PNG + confirmation of which awards apply |
| Logo | Two-color text wordmark (Sprint 2.5) | **Substituted** | Client-supplied SVG |

All substitutions carry a visible "placeholder" / "demonstration" label, so no reviewer could mistake them for finished imagery.

### Verification results (Sprint 3)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass — 49/49** across 7 files |
| Build | `npm run build` | **Pass** — 89 modules, 1.78s |

Added tests:

- `src/features/estimate/EstimateForm.test.tsx` — 8 cases: empty-submit field errors, malformed phone/email errors, success submission with trimmed payload, success-ack + submit-another flow, error preserves input + retry succeeds, duplicate-submission prevention while pending, independent consent choices + default-unchecked, Lexington is present in location dropdown despite reference omission.
- `src/pages/HomePage.test.tsx` — 4 cases: exactly one `<h1>`; every expected section landmark present; hero image is eager with explicit dimensions and `fetchpriority="high"` (LCP-friendly); services grid links are real routes.

### Bundle size (Sprint 3 production build)

- Entry JS: `index-*.js` **347.12 KB / 109.03 KB gzip** (effectively unchanged from Sprint 2.5's 347.05 / 109.00).
- Entry CSS: **~20 KB / 4.9 KB gzip**.
- **New Homepage chunk**: `HomePage-*.js` **19.59 KB / 6.06 KB gzip** — lazy-loaded; contains Hero, ProtectBand, WhyUs, ServiceCards, PromotionsRow, ReviewsStrip, AwardsStrip, EstimateForm, PlaceholderImage. Not in the critical path.
- Other route chunks unchanged.

Note: the shared Vite "index" bundle now also includes the estimate module graph because it's referenced from HomePage via lazy loading. Vite still code-splits it into the HomePage chunk, so this is isolated to the homepage route.

### Performance

- No new third-party JS, no large libraries, no carousel dependency.
- LCP asset: `/images/placeholders/hero-home.svg` with `fetchpriority="high"`, `decoding="async"`, explicit width/height.
- Below-the-fold section imagery is inline SVG; images later swapped for raster will carry `loading="lazy"` by default.
- No Lighthouse / PageSpeed audit run in-session (no browser automation available). Pending until Sprint 9 or whenever a hosted preview exists.

### Browser evidence actually collected

**None in-session.** The implementation is informed by the user-supplied reference screenshot and the Sprint 0 HTML audit. Visual parity, responsive overflow at 320–1920 px, 200% zoom, and keyboard/screen-reader walkthrough remain **pending**.

### Sprint 4 readiness

Ready. Sprint 4 scope — service hubs (`/roofing/`, `/gutters/`, …) + variants (`/roofing/roof-replacement/`, etc.) — can reuse: `EstimateForm`, `PlaceholderImage`, the service-cards layout, promo-row layout, review strip, awards strip, section wrappers, and the brand/data layer.

---

## Sprint 2.5 — Reference-driven shared-layout correction (2026-10-15)

**Status: implementation complete; browser visual comparison still pending (no automation available in this session).**

Driven by two user-supplied screenshots: the live reference and the Sprint 2 implementation.

### Comparison table

| Element | Previous (Sprint 2) | Correction (Sprint 2.5) | Evidence | Remaining limitation |
|---|---|---|---|---|
| Top strip | Absent | Added dark-navy utility strip (`h-9`) hosting the location selector and a "Call <phone>" chip | Both supplied screenshots | Exact strip height / inner padding not measured |
| Main header row height | ~`h-14` (56px) | `h-20 lg:h-24` (80 / 96px) | Reference shows a visibly taller row | Exact px not measured |
| Logo treatment | Plain text, single color | Two-color wordmark ("Example"=accent red, "Exteriors"=brand navy) rendered from `brand.companyName` split — placeholder, swapped automatically to `<img>` when `brand.logoSrc` is provided | Reference uses a red+black logo image; ours is explicitly flagged as a text placeholder | Real logo asset blocked; see `ASSET_MANIFEST.md` |
| Phone action | Small underlined link in top-right | Large bold red number in the main row + a secondary "Call …" link in the top strip | Reference emphasizes the phone with similar size + red | Exact font-size not measured; phone discrepancy flag still open |
| Free Estimate CTA | `Button size="sm"` | `Button size="lg"` with `whitespace-nowrap` | Reference button is noticeably larger | Exact dimensions, hover tone not measured |
| Nav typography | `text-sm font-medium`, `gap-5` | `text-[15px] font-semibold`, `gap-7` | Reference nav reads bolder and more spaced | Exact font family unknown until live measurement |
| About dropdown | `aria-haspopup="true"` + disclosure UI | Removed `aria-haspopup` (we implement a disclosure, not an ARIA menu) | WAI-ARIA Authoring Practices | — |
| Footer background | Light gray (`--color-surface-alt`), dark text | Dark navy (`--color-brand-primary`), white text | Reference footer is dark navy with light text | — |
| Footer layout | 5 equal columns | Brand/CTA block + 4 link groups (`grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]` at `lg`); phone/email/Free-Estimate CTA inside the brand block | Reference shows a left-side brand block + grouped links | Exact column proportions pending measurement |
| Footer bottom bar | Light-gray background | Darker inset band (`bg-black/15`) with privacy + crew links | Matches reference's inset bottom strip | — |
| Mobile drawer background inertness | Only focus-trapped; background still reachable via AT | `<main>` and `<footer>` now receive `inert` + `aria-hidden="true"` while the drawer is open, restored on close | WAI-ARIA dialog guidance | — |
| Mobile drawer breakpoint cleanup | Did not react to viewport change | Watches `(min-width: 1024px)` and closes the drawer if the viewport grows past `lg` while open (and immediately if already at `lg` when opened) | Sprint 2.5 spec requirement | matchMedia stub used in tests; live viewport not run |
| Production preview inclusion | Chunk filename absent (Sprint 2) but string-level check not done | Confirmed: `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview\|FoundationPreview" {} \;` → empty | Grep over emitted JS post-build | — |

### Deferred to Sprint 3 (not corrected here; these are page-body items)

- Hero copy, hero image, hero CTA row.
- "Peace of Mind — Get a FREE estimate" inline lead-form card.
- "Protect your home with industry-leading expertise…" statement band.
- "Why Mr. Roof" four-point benefits row.
- "Our Services" card grid.
- "Offers & Promotions / Special Financing / Lifetime Warranty" trio.
- "We have over 500,000 satisfied customers…" review band + 3 testimonial cards.
- Awards badges row.

Blank page body between header and footer is expected and documented.

### Blocked by assets or missing live inspection

- **Logo image** — placeholder two-color wordmark. Needs client-supplied SVG; the component already supports `<img>` via `brand.logoSrc`.
- **Fonts** — system stack still in use.
- **Exact brand hex** — `#0a2a4e` / `#c8102e` remain provisional placeholders; close to the reference by eye but **not** color-sampled.
- **Sticky header behavior** — implemented as `sticky top-0`, but the reference's actual scroll behavior was not confirmed in a browser.
- **Hover transitions / menu open timing** — not measured.
- **Reference typography** — not identified.

### Verification results (Sprint 2.5)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass** — **37/37** across 5 files (added 4 interaction tests: aria-haspopup removal, top-strip call CTA, background inert toggle, breakpoint auto-close × 2) |
| Build | `npm run build` | **Pass** — 88 modules, 1.80s |
| Preview source strings in prod bundle | `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview\|FoundationPreview" {} \;` | **Empty** — no preview strings in emitted JS |

Entry bundle after Sprint 2.5: `index-*.js` **347.05 KB / 109.00 KB gzip** (Sprint 2 was 344.73 / 108.58) — +2.3 KB raw for the header rebuild + footer rebuild + MobileNav resize/inert logic. CSS **19.95 KB / 4.87 KB gzip** (Sprint 2 was 19.89 / 4.85).

### Browser evidence actually collected

**None in-session.** No live-browser automation / screenshot tool is available here. The corrections above are informed by the two user-supplied screenshots and the Sprint 0 HTML audit. The following remain **unverified**: pixel-level spacing, exact brand hex, exact font family and weights, mobile breakpoint behavior under a real browser, sticky header scroll behavior, hover states, menu transition timing, 200% zoom, overflow at 320–1920 widths.

### Sprint 3 readiness

Ready. Sprint 3 (homepage body) can now plug into a shell that visually resembles the reference's structural rhythm much more closely. Remaining visual limitations above should be resolved in parallel with (or before) Sprint 8's QA pass; they do not block Sprint 3's structural work.

---

## Sprint 2 — Shared layout (2026-10-15)

**Status: complete. Awaiting user approval to proceed to Sprint 3.**

### Completed

- Baseline verified: branch `main`, origin unchanged, only Sprint-1 untracked files present. No commits. No global git config changes.
- **Production bundle regression fixed.** The `/__preview` route was previously code-split *into* the production bundle (noindex/robots alone did not exclude it). Now the preview import is wrapped in `import.meta.env.DEV ? lazy(() => import(…)) : null`, which Vite replaces with the literal in a production build so the dynamic import, route entry and preview chunk are all tree-shaken. Verified: `dist/assets/` no longer contains any `FoundationPreview-*.js` chunk after `npm run build`.
- **Accessible Dropdown primitive** (`src/components/ui/Dropdown.tsx`) — disclosure pattern (not `role="menu"`), with `aria-expanded`, `aria-controls`, `aria-haspopup`, Escape-to-close with focus return, outside-click dismissal.
- **Location context hook** (`src/features/location-context/useLocationContext.ts`) — resolves the current location strictly from `useLocation().pathname`. No saved selection is allowed to shadow an explicitly visited location URL.
- **LocationSelector** (`src/components/layout/LocationSelector.tsx`) — native `<select>` wired to react-router navigation; reflects URL state as the selected option; no geolocation, no persistence.
- **SiteHeader** (`src/components/layout/SiteHeader.tsx`) — sticky top bar, logo, primary nav (5 service links), About dropdown with 11 children, desktop location selector, phone action, Free Estimate CTA. Context-aware: on a known location URL the Free Estimate CTA resolves to that location's `/<slug>/free-estimate` when the location advertises `hasFreeEstimate` in the availability data; falls back to `/free-estimate` otherwise. Hamburger trigger below `lg` carries `aria-expanded` + `aria-controls`.
- **MobileNav drawer** (`src/components/layout/MobileNav.tsx`) — `role="dialog" aria-modal="true"` with: focus moved into panel on open, tab-cycle focus trap, Escape and backdrop click to close, body-scroll lock with correct cleanup, focus restored to the hamburger on close, auto-close on route change (compares pathname against the one captured when the drawer opened).
- **SiteFooter** (`src/components/layout/SiteFooter.tsx`) — five data-driven column groups mirroring the reference (Services, Service Areas, Resources, Company, Recent Posts) + bottom bar with brand, phone, email, legal line, privacy and crew links. Columns stack 2-col at `sm`, 3-col at `md`, 5-col at `lg`. "Get a Free Estimate" footer link uses the normalized `/free-estimate` path, documented in `REFERENCE_AUDIT.md` as a deliberate correction of the reference's `/free%20estimate` encoding.
- **AppShell** rebuilt around `SiteHeader` + `<main id="main" tabIndex={-1}>` + `SiteFooter`. Only one `<main>` landmark; the skip link targets `#main` which is in the DOM. Nav landmarks have distinct accessible names (`Primary`, `Mobile primary`, footer `<section>` groups).
- **ExternalEntryPage** rendered honest. The three entry points (`/billpay`, `/visualizer`, `/crew`) no longer emit a fake `href="#...-placeholder"` anchor. Each now shows a disabled "awaiting client-supplied URL" status chip and the integration-boundary notice. When a real URL is wired in, the component switches to a real outbound anchor automatically.

### Interaction tests added

- `src/components/layout/SiteHeader.test.tsx` — About dropdown open/close/aria/focus/item-click behavior; global-vs-location Free Estimate CTA resolution (/, /nashville, /lexington); location-selector reflection of the current URL.
- `src/components/layout/MobileNav.test.tsx` — closed by default; opens on hamburger click; Escape closes, restores body scroll, returns focus; explicit close button works.
- `src/components/layout/LocationSelector.test.tsx` — selecting a location navigates; empty option on non-location URLs; re-picking current location is a no-op.

### Verification results (Sprint 2)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Tests | `npm test` | **Pass** — **33/33** across 5 files |
| Build | `npm run build` | **Pass** — 88 modules, 1.81s |
| Preview chunk gone from prod | `ls dist/assets \| grep -i preview` | **Confirmed empty** |

### Bundle size (Sprint 2 production build)

- Entry JS: `index-*.js` 344.73 KB (108.58 KB gzip) — up from 329.94 KB (104.85 KB gzip) in Sprint 1, +~14.8 KB raw / +~3.7 KB gzip for the header + mobile drawer + footer + context hook + Dropdown + interaction logic.
- Entry CSS: `index-*.css` 19.89 KB (4.85 KB gzip) — up from 16.79 KB (4.29 KB gzip), +3.1 KB for Tailwind utilities freshly used by the layout.
- Route chunks: 15 code-split pages ranging from 0.18 KB to 2.13 KB.
- `FoundationPreview` chunk is **not present** in production (previously ~3.78 KB).

Entry chunk includes `react`, `react-dom`, `react-router-dom`, SiteHeader, SiteFooter, AppShell, Dropdown, LocationSelector, MobileNav — the per-route pages remain lazy-loaded.

### Reference evidence actually collected (Sprint 2)

Sprint 2 did not add any new live-browser evidence. Audit data remained the Sprint 0 HTML extraction. Browser capability was not available in this session; see `docs/QA_REPORT.md`. Visual parity remains **unverified**.

### Remaining visual differences and provisional decisions

- Header is **sticky** (`position: sticky`) — provisional. The reference's sticky behavior was not confirmed from HTML alone.
- Dropdown opens on **click** on every pointer type — provisional. We chose click-first instead of hover because hover is not keyboard/touch accessible, and the reference's behavior was not verified.
- Mobile drawer slides in from the right edge, modal — provisional. The reference might use a non-modal expanding panel; this was not confirmed. The current implementation uses modal semantics because that is the safer default for a drawer that obscures the page.
- Hamburger breakpoint is Tailwind `lg` (1024px) — provisional.
- Footer collapses 5 → 3 → 2 columns across `lg`/`md`/`sm` — provisional; the reference's exact wrap points were not measured.
- All color, font, spacing, radius and image tokens remain provisional (unchanged from Sprint 0/1).
- Phone discrepancy, Lansing/Lexington omissions, Terms URL, awards list — all **still flagged, nothing silently corrected**.

### Sprint 3 readiness

Ready. Sprint 3 (homepage build) can draw on the complete header + footer + nav + primitives. The AppShell renders header/footer around every page, so the homepage work is purely a `/` page body.

---

## Sprint 1 — Foundation (2026-10-15)

**Status: complete. Awaiting user approval to proceed to Sprint 2.**

### Completed

- Baseline git state verified: branch `main`, origin `https://github.com/Ahasan39/construction-project.git`, remote empty, local tree had only Sprint 0 files (`.gitignore`, `README.md`, `docs/`). Nothing was overwritten.
- Node 24.14 / npm 11.9 confirmed (project requires Node >= 20.19).
- Vite + React + TypeScript + Tailwind v4 + React Router v7 scaffolded directly in the repo root (no nested project directory). Sprint 0 docs preserved.
- Strict TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`) with the modern `verbatimModuleSyntax` + `isolatedModules` combo. Path alias `@ -> src`.
- ESLint 9 flat config with `typescript-eslint`, `react-hooks`, `react-refresh`.
- Tailwind v4 integrated via `@tailwindcss/vite`; tokens declared in `src/styles/globals.css` under `@theme`.
- Base styles: box-sizing reset, responsive media defaults, keyboard-only focus ring, reduced-motion override, skip-link utility, body background.
- UI primitives (accessible by construction): `Button` (variant/size/pending), `Container`, `Section`, `Field` (label/description/error/required with proper aria wiring), `Input`, `Textarea`, `Select`, `Checkbox`, `SmartLink` (internal vs external with safe rel attrs).
- Typed domain models in `src/types/index.ts` for brand, services, locations, availability, offers, reviews, articles, nav, lead-form payload, route metadata.
- Mock replaceable service layer (`src/services/content.ts`, `src/services/estimates.ts`) returning promises; `submitLead` never performs a network request.
- Typed data: brand, 5 services + roofing variants, 10 locations with representative service-area children, explicit (location × service) availability matrix, placeholder offers, placeholder (flagged) reviews, placeholder articles, navigation.
- Route table (`src/app/router.tsx`) with route-level code splitting for every template family and a data-driven dispatcher pattern:
  - Known literals (`/free-estimate`, `/about`, `/billpay`, …) first.
  - `/:slug` dispatcher resolves service-vs-location.
  - `/:a/:b` dispatcher resolves service-variant vs location-service, gated by explicit availability.
  - `/:locationSlug/{free-estimate,financing,service-area}` and `/:locationSlug/service-area/:childSlug` are location-literal routes, gated by per-location capability flags.
  - `/:locationSlug/:serviceSlug/:variantSlug` goes through `ThreeSegmentLocationPage` which requires the variant to be listed in the availability record.
  - `*` falls through to `NotFoundPage`.
- Lightweight SEO head manager (`src/app/seo.ts`) sets `<title>`, `<meta name="description">`, `<meta name="robots">` and `<link rel="canonical">` only when `CANONICAL_ORIGIN` is configured — mrroof.com is never used.
- Dev-only foundation preview (`/__preview`): primitives sampler, noindex, excluded from `robots.txt`, labelled "Scaffold — Sprint 1".
- Hosting fallback for direct URL loads: `public/_redirects` for Netlify-style hosts; equivalent rules documented for Vercel / Apache / nginx / IIS.
- Robots and env example: `public/robots.txt` (disallow `/__preview`), `.env.example` (`VITE_CANONICAL_ORIGIN` placeholder; the file is gitignored by `.gitignore` with the `!.env.example` allow).
- Tests (vitest + Testing Library + jsdom):
  - `src/data/availability.test.ts` — 9 cases covering explicit availability, missing combos, variant membership, per-location capabilities.
  - `src/pages/dispatch.test.tsx` — 8 cases covering top-level service vs location dispatch, two-segment service-variant and location-service dispatch, and Not Found rendering for every unknown-slug class.
- Verification commands run with results captured in `docs/QA_REPORT.md`.

### Not done in Sprint 1 (per plan)

- No finished header, footer, homepage, service-page, or location-page design.
- No full lead-form implementation (fields, validation, pending UI, success/error states) — the primitives support them; the form itself ships Sprint 3.
- No carousels, modals, menus beyond the primitives already landed.
- No installed fonts (system fallback stack only).
- No prerender or SSR step yet (see Prerendering below).
- No git commit or push.

### Architecture decisions

1. **Data-driven routing.** The router does not generate every `(location, service)` combination; a `TopLevelSlugPage` / `TwoSegmentPage` / `ThreeSegmentLocationPage` dispatcher resolves to a page by consulting `src/data/availability.ts`, mirroring the reference's non-uniform coverage.
2. **Prop-first pages, params in the dispatcher.** Reused pages (`ServiceHubPage`, `LocationPage`, `LocationServicePage`, `ServiceVariantPage`) take typed data as props. Dispatchers extract and pass. This keeps components testable in isolation and future-proof when route patterns change.
3. **Thin SEO head manager, not a framework.** `src/app/seo.ts` mutates `<head>` directly on route transitions — small and dependency-free. Replace with the server-side head of whichever prerender/SSR strategy ships in Sprint 9 (or sooner).
4. **No global state library.** Component state and the mock service layer are sufficient; introduce one only if a concrete need arises.
5. **Tailwind v4 CSS-first tokens.** Semantic tokens live in `@theme { ... }` in `globals.css`, usable as `var(--color-brand-primary)` or Tailwind utilities. Avoids a separate design-tokens package during the frontend phase.
6. **In-app 404 ≠ HTTP 404.** The SPA renders `NotFoundPage` for any unmatched route, but the host still returns 200 for those paths. A prerender step (Sprint 9) will emit real 404 status codes for known-unenumerable paths.

### Verified vs provisional tokens

Still provisional (unchanged from Sprint 0): font families, exact brand hex, section vertical padding, container widths, breakpoints, radii, image aspect ratios. See [docs/DESIGN_TOKENS.md](DESIGN_TOKENS.md). No value was promoted to "verified" during Sprint 1.

### Prerendering decision

**Chosen approach for Sprint 9:** Vite's built-in `vite build` + a static route-list → `vite-plugin-ssg` or hand-rolled Puppeteer/`playwright` route crawler that writes one `.html` per enumerated route into `dist/`. The route list is produced from typed data (`src/data/services.ts`, `src/data/locations.ts`, `src/data/availability.ts`, `src/data/articles.ts`), so prerender output stays in lockstep with the live routes.

- **Compatibility with Laravel.** After Laravel integration (Sprint beyond-9), prerender input shifts from local typed data to a build-time export from the Laravel content API (JSON over HTTP during CI). Nothing in the current component tree assumes synchronous data at render time; the mock service functions already return promises.
- **Dynamic enumeration.** The service and location grid is small (<= 10 × ~6). Service-area children, blog articles and location variants come from data; enumeration is `O(data)` and belongs in a `scripts/prerender.ts` to be added in Sprint 9.
- **Deferred.** Actual prerender wiring is deferred to Sprint 9 to avoid shipping a fragile pipeline against unfinished page content. In the meantime: client-rendered shells only, and `README.md` is explicit that they are **not** prerendered.

### Verification results (Sprint 1)

| Check | Command | Result |
|---|---|---|
| Install | `npm install` | **273 packages added**, lockfile created |
| Lint | `npm run lint` | **Pass** — no warnings or errors |
| Typecheck | `npm run typecheck` | **Pass** — tsc project build clean |
| Build | `npm run build` | **Pass** — 81 modules, 329 KB JS (104 KB gzip) + ~17 KB CSS; code-split per route |
| Tests | `npm test` | **Pass** — 2 files, 17/17 tests green |
| Direct URL load | not run | pending — requires a live browser; `public/_redirects` is configured for Netlify-style hosts |
| Browser visuals @ 320/390/768/1440 | not run | pending — no browser automation in this session |
| Keyboard / a11y walkthrough | not run | pending — same |
| Console errors | not run | pending — same |
| Lighthouse | not run | out of scope for Sprint 1; see Sprint 9 |

### Blockers / unverified items

All Sprint 0 blockers still open (visual tokens, mobile menu, dropdowns, phone discrepancy, missing-slot anomalies, client assets, Terms URL). Nothing in Sprint 1 depends on their resolution; they will block **visual-parity claims** in Sprint 3+.

### Sprint 2 readiness

Ready to begin Sprint 2 (shared header, primary navigation with About dropdown, location selector, mobile menu, footer with the five columns the reference uses) **on your go-ahead**. The data (`src/data/navigation.ts`, `src/data/locations.ts`, `src/data/brand.ts`) and primitives (`SmartLink`, `Button`, `Container`) needed are in place.

---

## Sprint 0 — Workspace verification & reference audit (2026-10-15)

Original Sprint 0 entry preserved below.

- Workspace confirmed at `D:\Qorvin IT\projects\construction project` (empty working tree).
- Git initialized on `main`; remote `origin` → `https://github.com/Ahasan39/construction-project.git` (empty).
- Git identity verified: `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>`.
- `.gitignore` added. Reference audit performed via HTML fetch (no live browser). Template families and representative URLs catalogued; see `REFERENCE_AUDIT.md` and `ROUTE_INVENTORY.md`.
- No npm install, no components, no commits.
