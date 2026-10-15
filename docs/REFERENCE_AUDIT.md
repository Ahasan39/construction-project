# Reference Audit — mrroof.com

**Reference URL:** https://www.mrroof.com/
**Audit date:** 2026-10-15
**Audit method:** Server-side HTML fetched and parsed via `WebFetch` (markdown conversion). No live browser automation or screenshot tooling was available in this session.

> **Limitation notice.** This audit extracts page structure, nav, copy, forms, and link graphs from rendered HTML. **Visual measurements** (exact fonts, colors, spacing, radii, image crops, breakpoints), **interaction states** (hover, dropdown open/close, mobile menu transitions, sticky behavior), and **client-side JS behavior** are **unverified** here. They must be confirmed in Sprint 0 follow-up (or Sprint 8 QA) via a real browser inspection before implementation claims visual parity.

---

## 1. Confirmed page families (template clusters)

| Family | Template signature | Representative URLs |
|---|---|---|
| Home | Global landing with lead form | `/` |
| Service hub | Full-service landing with subservice cards, trust row, reviews | `/roofing/`, `/gutters/`, `/siding/`, `/windows/`, `/masonry/` |
| Service variant / subservice | Narrower topic page beneath a hub | `/roofing/roof-replacement/`, `/roofing/roof-repair/`, `/roofing/metal-roofing/`, `/roofing/commercial-roofing/` |
| Location hub | City-level landing with lead form, local services, reviews | `/nashville/`, `/louisville/`, `/cleveland/`, `/cincinnati/`, `/dayton/`, `/ann-arbor/`, `/grand-rapids/`, `/detroit/`, `/lansing/`, `/lexington/` |
| Location-scoped service | Service page beneath a location | `/nashville/siding/`, `/nashville/roofing/commercial-roofing/`, `/dayton/roofing/commercial-roofing/`, `/cincinnati/roofing/commercial-roofing/`, `/nashville/financing/`, `/louisville/financing/`, etc. |
| Location service-area index | Lists sub-cities covered by a region | `/nashville/service-area/`, `/ann-arbor/service-area/`, `/cleveland/service-area/`, `/grand-rapids/service-area/`, `/cincinnati/service-area/`, `/lansing/service-area/` |
| Service-area city/county page | Sub-city under a region | `/ann-arbor/service-area/toledo/`, `/nashville/service-area/franklin/`, `/louisville/service-area/jeffersonville/`, etc. |
| Lead form | Standalone estimate form | `/free-estimate/`, `/<city>/free-estimate/` |
| Resource / company | Static informational page | `/about/`, `/special-offers/`, `/financing/`, `/warranties/`, `/refer-a-friend/`, `/commercial-projects/`, `/careers/sales/`, `/billpay/`, `/visualizer/`, `/reviews/` |
| Blog index | Paginated listing with sidebar | `/blog/` (5 pages) |
| Blog article | Single post with sidebar | `/blog/<slug>/` |
| Legal | Plain prose | `/privacy-policy/` |
| External entry point | Links out to third-party portals | `/crew/` (portal), `/billpay/`, `/visualizer/` |

Full URL inventory is captured in `ROUTE_INVENTORY.md`.

## 2. Global chrome

### Header (verified from HTML)
- Logo (left).
- Primary nav: **Roofing · Gutters · Siding · Windows · Masonry**.
- **About** dropdown containing: Special Offers, Pay My Bill, Financing, Warranties, Visualizer, Refer a Friend, Customer Reviews, Sales Careers, Blog, Contact Us, Commercial Projects.
- **Select Location** dropdown with 10 cities: Ann Arbor MI, Grand Rapids MI, Cleveland OH, Cincinnati OH, Dayton OH, Lexington KY, Louisville KY, Nashville TN, Detroit MI, Lansing MI.
- Phone displayed in top strip: `(800) 884-9760`. **Note:** on the home hero, the "Call" button uses `tel:8446114995`, which differs from the displayed number — this discrepancy should be flagged to the client; our implementation will centralize phone numbers in branding config.
- Buttons: `Free Estimate` → `/free-estimate/`, `Call`, `Schedule` → `/free-estimate/`.
- Skip-to-content link present (accessibility signal).

### Footer (verified from HTML)
Columns:
1. **Services** — Roofing, Gutters, Siding, Windows, Masonry.
2. **Service Areas** — Ann Arbor, Grand Rapids, Cleveland, Cincinnati, Dayton, Lexington, Louisville, Nashville, Detroit (9 cities; **Lansing is missing** in footer though present in header).
3. **Resources** — Special Offers, Pay My Bill, Financing, Warranties, Refer a Friend, Commercial Projects.
4. **Company** — About, Customer Reviews, Sales Careers, Blog.
5. **Recent Posts** — two latest blog previews.

Bottom bar: © 2025 Mr. Roof, LLC (a Crane Renovation Group Company) · Privacy Policy · Crew Portal · social icons (Facebook, Instagram, LinkedIn).

Promo band pinned near the footer: **"0% Interest for 18 Months on Full Roofing, Siding, Windows & Gutter Projects. Additional terms may apply."** with a Free Estimate CTA.

### Social links
- Facebook: https://www.facebook.com/profile.php?id=61572847645466
- Instagram: https://www.instagram.com/official_mrroof/?hl=en
- LinkedIn: https://www.linkedin.com/company/mr.-roof/

## 3. Homepage section order & verified layout (Live-browser verified in Sprint 3.7)

1. **Header / top strip / nav**: Dark navy utility strip (`#0F2231`), location dropdown, phone number; main row with white logo, uppercase bold nav, phone number and red `FREE ESTIMATE` CTA button with verified white text.
2. **Hero**: Sky background (`#EBF3FA` gradient), headline "Done in a day. Good for a lifetime." with cyan highlight `#5BC2E7` on `lifetime.`, supporting paragraph, full-width residential suburban home photography, and flush 2-cell emergency contact bar directly beneath (`Active Leak? Storm Damage? Contact Us` / `(877) 766-7663`).
3. **Free Estimate Panel**: Rectangular navy panel (`#0C1F33`), "Peace of Mind Starts Here.", "Get a FREE estimate", compact fields with `sr-only` labels and clean placeholders (`Full Name`, `Phone`, `Email`, `Select location`, `Select service`), two consent checkboxes, compact legal disclaimer, and filled red CTA `GET A FREE ESTIMATE` with verified white text.
4. **Value Statement**: Centered headline "Protect your home with industry-leading expertise and comprehensive home exterior services backed by a superior warranty." with blue bold keywords.
5. **Why Mr. Roof**: Left-column sticky "Why Mr. Roof?" with cyan underline; right column 4 squared panels (`rounded-sm`, `#F4F6F8`), vertical photography (`min-h-[300px]`), red square badge icons (`#D9232A`), title and copy.
6. **Our Services**: Flat light-gray panels (`#F4F6F8`), direct architectural illustrations (no white inset container), squared geometry, and outlined red-bordered CTAs with reference action labels (`Replace My Roof`, `Repair My Roof`, `Replace My Siding`, `Replace My Windows`, `Replace My Gutters`).
7. **Promotions Row**: 3 squared cards with photography on top, deep navy panel below (`#0C1F33`), white icon + title, smaller red button inset within the navy panel with margins (`See Current Promotions`, `Learn About Financing`, `View Warranty Information`), and thin cyan/blue bottom accent line (`#00A3E0`).
8. **Customer Reviews**: Flat light-gray background (`#F4F6F8`), bold left-aligned heading "We have over 500,000 satisfied customers who can vouch for our quality. Here's what our customers have to say.", tall rectangular white cards (`rounded-sm`), sky-blue stars (`#59BBD7`), author, customer category, and truthful demonstration disclosure.
9. **Awards & Certifications Strip**: Rich dark navy background (`#0C1F33`), 5 demonstration vector trade badges with high-contrast fills.
10. **Footer**: Distinct deeper dark navy background (`#071524`), top contact row with white logo, phone number, and filled red CTA button `Get a Free Estimate`, 5 column categories with red group headings (`#D9232A` — Services, Service Areas, Resources, Company, Recent Posts), boxed recent post container cards (`#0C1F33`), and bottom copyright bar (`#050E18`).

## 4. Service hub template (`/roofing/`)

1. Header.
2. Hero banner with service title + value prop + Free Estimate CTA.
3. "Current Specials" city picker linking to the 10 location pages.
4. Trust indicator row — Consumer Choice #1, BBB A+, 500k+ customers, 60+ years.
5. Service variant card grid — Replacement, Repair, Metal, Commercial.
6. Award / certification logos row.
7. Company history paragraph ("Making Customers Smile Since 1962").
8. Three-point benefits — Transferable Lifetime Warranty, Financing, 100% Accountability.
9. Review strip (7 testimonials, 5-star rating glyph).
10. Bundle & Save cross-sell cards (Siding, Windows, Gutters, Masonry, Attic Insulation).
11. Primary CTA — "Schedule a Free No-Obligation Estimate Today" + button.
12. Promo banner + Footer.

## 5. Location hub template (`/nashville/`)

1. Header.
2. Hero + inline lead form (same fields as `/free-estimate/`).
3. Emergency "Active Leak?" line within hero.
4. Trust/promo row — 20-year consumer choice, BBB A+, 500k+ customers, 60+ yrs; $1,000 off a new roof; special financing; lifetime warranty.
5. "The Leading Exterior Remodeler in <City>" — service card grid (Roofing, Siding, Windows, Gutters, Masonry, Insulation).
6. "Done in a day. Good for a lifetime." — brand paragraph.
7. "Great Reasons to Choose Mr. Roof <City>" — bulleted differentiators (one-day install, upfront pricing, lifetime warranty, 3D visualization tool, Owens Corning Platinum Preferred Contractor).
8. Review strip (9 local testimonials).
9. Awards row.
10. Promo banner.
11. Footer with local address + phone + service/resource/company columns.

Linked location-scoped subpages (observed under `/nashville/`): `/nashville/roofing/`, `/nashville/siding/`, `/nashville/windows/`, `/nashville/gutters/`, `/nashville/masonry/`, `/nashville/insulation/`, `/nashville/commercial/`, `/nashville/financing/`, `/nashville/service-area/`, `/nashville/free-estimate/`.

**Not every location mirrors every subpath** — e.g. `/nashville/roofing/commercial-roofing/` exists in the sitemap but is not surfaced in the Nashville location nav, which uses `/nashville/commercial/` instead. Our route resolver must treat location-scoped service pages as **optional per location**, driven by data, not generated for every (location × service) combination.

## 6. Blog listing (`/blog/`)

- Heading: "News & Resources".
- Single-column stack of article cards: thumbnail + headline + excerpt + "Read More".
- Sidebar: Search, Categories (Home Improvement, Roofing, Windows, Siding, Gutters, Masonry, Insulation, Regional, Seasonal, Community, News), Regional Blogs (7 city taxonomies), Recent Posts.
- Pagination: numbered pages (1–5) + Previous/Next; 12 posts per page.
- Promo banner + Footer.

## 7. Free estimate page (`/free-estimate/`)

### Form fields (verified)
- Name * (text)
- Phone * (tel)
- Email * (email)
- Select Location * — one of 8 regions: South East Michigan, Grand Rapids Area, Nashville Area, Cincinnati Area, Cleveland Area, Dayton Area, Louisville Area, Lansing Area.  **Observation:** Lexington is **not** in the form dropdown even though it is in the header location picker — flag to client.
- Select Service * — Roofing, Siding, Windows, Gutters, Masonry, Insulation.
- SMS consent checkbox #1 — appointment reminders & service updates.
- SMS consent checkbox #2 — offers, discounts, seasonal/membership promotions.
- Disclaimer paragraph with links to Terms & Conditions and Privacy Policy.

Submit button: **"Get a FREE ESTIMATE!"**

### Side rail
- Contact Us block with phone, location dropdown, service area + service links.
- 0% / 18-month financing promo panel.
- Recent blog posts sidebar.

## 8. Interactions (unverified — require browser inspection in Sprint 8)

The following behaviors are **inferred from markup only**:

- Header "About" dropdown (expected hover + keyboard open on desktop; click toggle on mobile).
- Header "Select Location" dropdown (expected click toggle).
- Mobile menu (hamburger) — present in nav markup; actual breakpoint and transition unverified.
- Lead form client-side validation — unverified; the reference likely uses a WordPress forms plugin.
- Review strip — may be a static grid or a carousel; **not implied by extracted text alone**.
- Sticky header on scroll — not confirmed.
- Any accordions, modals, cookie banners, popups — not confirmed from text.
- Pagination behavior on `/blog/` is numeric links, not infinite scroll.

**Rule reminder:** per spec, do **not** infer carousels, animations, popups or sticky headers from extracted text. All of the above must be revisited with a real browser in Sprint 8 QA (or earlier if a browser capability is added to the environment).

## 9. Visual tokens (unverified)

- Fonts, exact color hex values, section padding, container widths, button heights, border radii, image aspect ratios — **not available from text extraction.** `DESIGN_TOKENS.md` captures the shape of the token system with provisional placeholder values; actual values must be measured from the live site before Sprint 3 begins.

## 10. External integrations observed

- `/crew/` — crew portal (external auth).
- `/billpay/` — bill-pay (external payment processor).
- `/visualizer/` — 3D visualizer (likely third-party tool, e.g. Owens Corning Design EyeQ or similar).
- `/careers/sales/` — careers application (may embed external ATS; unverified).
- Lead form backend — WordPress-plugin-driven (likely Gravity Forms / Formidable / HubSpot); we will **not** post to it. Our reproduction will stub submissions via the service layer.
- SMS consent is a legal/compliance signal, suggesting Twilio-class integration server-side.

## 11. Unresolved and flagged items

1. **Phone number discrepancy** — displayed `(800) 884-9760` vs `tel:` link `844-611-4995`. Needs client confirmation.
2. **Lansing missing from footer**; **Lexington missing from form dropdown**. Needs client confirmation whether these are intentional omissions.
3. **Footer broken-looking URL** — one footer "Get a Free Estimate" uses `/free%20estimate` (with an encoded space) which likely 404s. We will normalize to `/free-estimate/`.
4. **Visual measurements** — fonts, color palette, spacing, breakpoints, grid, image crops — all unverified; see Sprint 0 blockers in `PROGRESS.md`.
5. **Interaction states** — menus, mobile menu, form validation, scroll behavior — all unverified.
6. **Asset licensing** — reference images are production assets of mrroof.com and must **not** be hotlinked or copied. Placeholder assets will be used; see `ASSET_MANIFEST.md`.
7. **Reference testimonials, awards and company statistics** will be presented as placeholder sample content only, never as verified claims about the client's business.

## 12. Deliberate corrections (Sprint 2)

- The reference footer "Get a Free Estimate" link uses `/free%20estimate` (an encoded space, likely a 404). Our implementation normalizes this to `/free-estimate`. Original anomaly is documented in §11 point 3 above; this is a deliberate correction, not a silent change.

## 14. Lexington presence in Sprint 3 lead-form dropdown

The reference's `/free-estimate/` form omits Lexington from its "Select Location" options even though Lexington is a top-level location on the reference's own header and route graph. Our implementation **includes Lexington** in the dropdown — this is a deliberate correction to the reference's apparent inconsistency. The source of truth is `src/data/regions.ts`, where each entry carries an `observedOnReference: boolean` flag so the discrepancy is explicit in code, not silent. Verified by test (`EstimateForm.test.tsx` → *includes Lexington in the location dropdown even though absent on the reference*).

## 15. Sprint 3.5 Live-Browser Visual Measurement & Parity Audit

On 2026-10-15, live-browser automated inspection was conducted directly against https://www.mrroof.com/ at 1440px desktop, 768px tablet, and 390px mobile viewports. Key computed measurements and visual determinations:

1. **Header & Utility Strip**:
   - Utility strip background: `#0F2231` (RGB 15, 34, 49), height 36px. Contains location indicator and phone action.
   - Main row: white background (`#FFFFFF`), height 80px (sticky on scroll). Logo width ~160px with red roof silhouette. Primary nav is uppercase, bold 700/800 font, tracking-wide. Prominent phone number displayed in header. Free estimate button is bright red `#D9232A` (hover `#B81B22`), uppercase, white text, 4px rounded corners.

2. **Hero Composition**:
   - Background photography: High-end suburban American home exterior with dark architectural shingle roof, blue siding, stone accents, sunny sky.
   - Typography: "Done in a day." line 1, "Good for a lifetime." line 2. "lifetime." features a bright sky-blue (`#00A3E0`) curved accent underline stroke.
   - Emergency callout: White card with active status dot, bold text, and highlighted phone pill.
   - Lead form card: Deep dark navy overlay `#0F2231` with sleek dark input fields (`#132839`), white field labels, light placeholders, and a full-width red button (`#D9232A`) labeled "GET A FREE ESTIMATE".

3. **Value Statement Band**:
   - Centered large typography with phrases "industry-leading expertise" and "comprehensive home exterior services" emphasized in vibrant sky-blue (`#00A3E0`).

4. **"Why Mr. Roof?" Section**:
   - Desktop layout is a 2-column rhythm: left column has a sticky "Why Mr. Roof?" heading with sky-blue underline; right column features 4 vertically stacked benefit cards.
   - Each benefit card has a real job-site photo on the left, and a red square badge icon, bold title, and description copy on the right.

5. **"Our Services" Grid**:
   - 2x2 grid of modern architectural service cards (Roofing, Siding, Windows, Gutters) with custom vector architectural render illustrations on the left, clear descriptions, and bold red outlined CTA buttons.

6. **Promotions Row**:
   - 3 cards side-by-side: top photograph + integrated dark navy title banner with badge icon + full-width red CTA button.

7. **Reviews Strip**:
   - 5 bright cyan/sky-blue review stars (`#00A3E0`), verified customer status, and clean blockquote card styling.

8. **Awards & Certifications Bar**:
   - Dark navy background (`#0F2231`) featuring 5 demonstration industry award badges: Roofing Contractor Top 100, BBB A+ Accredited, Owens Corning Platinum Preferred Contractor, Angi 2022 Super Service, and Best of HomeAdvisor Winner.

9. **Footer**:
   - Deep dark navy background (`#0F2231`). Top row features white logo, phone, and red estimate button. 5 categorized link columns (Services, Service Areas, Disclosures, Company, Recent Posts), with inset dark sub-footer bar.

## 16. Sprint 3.6 Visual Defect Remediation & Re-Audit

On 2026-10-16, a fresh live-browser reference audit and local defect reproduction were conducted to resolve visible defects identified after Sprint 3.5:

1. **Header & Footer Logo Invisibility**:
   - *Root cause*: `public/images/logo.svg` and `logo-white.svg` lacked root `width` and `height` attributes (only specified `viewBox="0 0 220 54"`), used raw `<text>` elements without embedded fonts, and were wrapped in flex containers with `w-auto`. In Chromium, flex children with `w-auto` and SVGs without intrinsic dimensions collapsed width to `0px`.
   - *Remediation*: Reconstructed both `logo.svg` and `logo-white.svg` with explicit `width="220" height="54"` and pure vector `<path>` definitions (roof silhouette mark + letterforms), eliminating font dependencies. Updated `SiteHeader.tsx` and `SiteFooter.tsx` containers with `shrink-0` and bounded max-widths (`max-w-[180px] lg:max-w-[210px]`).
   - *Browser Verification*: Header logo renders at 180×44px; footer logo renders at 180×44px with clear, legible branding at all 8 tested viewports.

2. **Empty Awards Section Preceding Footer**:
   - *Root cause*: All 5 award SVGs in `public/images/awards/*.svg` lacked root `width` and `height` attributes, and `AwardsStrip.tsx` had container classes `h-16 sm:h-20 max-w-[160px]` with `img className="h-full w-auto"`. In flexbox, lacking an intrinsic SVG width or parent base width caused the container and image to collapse to `0px` width, leaving only the navy section padding. Furthermore, dark navy fills (`#1A2D3F`, `#0A3A60`) on the dark navy `#0F2231` background lacked visual distinction.
   - *Remediation*: Added root `width="160" height="80"` and high-contrast fills (vibrant gold `#F59E0B`, silver border `#E2E8F0`, bright royal blue `#0077BE`) to all 5 SVGs. Updated `AwardsStrip.tsx` to set explicit container dimensions (`w-32 sm:w-36 md:w-40 h-14 sm:h-16 shrink-0`) and `img className="w-full h-full object-contain drop-shadow"`. Corrected documentation to identify these as demonstration vector approximations rather than "authentic" client credentials.
   - *Browser Verification*: All 5 badges render prominently with sharp contrast across desktop, tablet, and mobile (wrapping cleanly to 3 top / 2 bottom on 390px).

3. **Button & Text Color Accessibility Audit**:
   - *Root cause*: Sky-blue `#00A3E0` on white surfaces produced a contrast ratio of 2.88:1, failing WCAG AA (requires 4.5:1 for normal text, 3:1 for large text). Field-level errors in `Field.tsx` on dark hero card surfaces defaulted to red `#D9232A` (2.4:1 contrast on `#0F2231`).
   - *Remediation*:
     - Retained `#00A3E0` on dark navy `#0F2231` where contrast is 5.68:1 (exceeds WCAG AA 4.5:1).
     - Adjusted `ProtectBand.tsx` large headline highlights to `#0284C7` (4.1:1 contrast, exceeding the 3:1 large-text requirement).
     - Adjusted `ReviewsStrip.tsx` text kicker to `#0369A1` (5.93:1 contrast, exceeding the 4.5:1 normal text requirement).
     - Added `errorClassName` to `Field.tsx` and used `text-rose-300` on dark hero card inputs (contrast > 7:1 against `#0F2231`).
     - Verified all buttons: Red CTAs (`#D9232A` / `#B81B22` with `#FFFFFF` text) achieve 4.9:1 – 6.5:1 contrast; service outlined buttons achieve 4.9:1 normal and 4.9:1 hover; footer links (`#CBD5E1` on `#0F2231`) achieve 11:1.

4. **Form & Review Content Corrections**:
   - *Root cause*: Location select placeholder was `"Choose a service area…"`, which was easily confused with service placeholder `"Choose a service…"`. Reviews carried misleading `"Verified"` customer badges on demonstration content.
   - *Remediation*:
     - Updated location select placeholder to `"Select a location…"`.
     - Updated service select placeholder to `"Select a service…"`.
     - Removed misleading `"Verified"` customer chips and checkmark SVGs from `ReviewsStrip.tsx`. Substituted neutral service category tags (e.g. `Roofing`, `Siding`, `Windows`).
     - Updated demo disclosure to concisely state that reviews are demonstration placeholders to be replaced before launch.
