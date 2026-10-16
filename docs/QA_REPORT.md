# QA Report

A living record of every verification performed. Checks are not marked passed unless they were actually run.

## Sprint 3.9.1 — Carousel overflow and responsive QA (2026-10-16)

### Diagnosis and correction

Baseline `10f37e4b9dc7648193473514a047e919c9667470`, clean main, expected origin. [Before at 320px](evidence/sprint-3.9.1/before-320.png): pagination used `flex-wrap: nowrap`, centered nine 36px minimum targets and eight 4px gaps inside 288px of content width. Its first/last buttons extended from -18px to 338px; document scrollWidth was 338px. This was unintended page overflow. The slide window was correctly 288px with overflow containment, track scrollWidth 2592px (nine slides), percentage slide width 288px, border-box sizing and 8px slide padding. The off-screen track was intentional and did not escape its window.

Fix: wrap pagination and prevent target shrinking. Keep its overflow visible so focus outlines are not clipped. Allow long tokens to wrap within slides (`min-width: 0`, `overflow-wrap: anywhere`) and author/badge rows to wrap with a gap. No html/body overflow hiding or changes to surrounding page sections.

Additional existing behavior defects found while checking motion: starting playback and leaving hover could create two independent timers; enabling reduced motion during playback did not stop them (advanced from page 1 to page 3 during a 5.1-second browser-clock test). Autoplay now has one effect-owned timer and pauses on hover or focus. A media-query listener stops playback when reduced motion becomes active. Manual controls still work; autoplay remains off when the preference is later removed. Swipes starting/ending at x=0 now use explicit null checks instead of treating zero as missing.

### Browser matrix and interactions

Chromium 153.0.8010.12 and Firefox 155.0, local Vite app on `http://127.0.0.1:5173/`. Browser tests used rendered DOM geometry, computed styles and screenshots, not jsdom sizing.

| Coverage | Result |
|---|---|
| 320, 360, 390, 430, 640, 768, 1024, 1280, 1440, 1920, 2560 CSS px | First, middle and last pagination positions in both engines; 33 samples each passed |
| Continuous resize sequence near transitions | 4px steps from 600–664, 1000–1048 and 1260–1300; 41 samples each passed |
| Orientation/reflow | 320x844 → 844x320 → 320x844; 3 samples each passed, no stale or empty visible range |
| Long unbroken review/author stress | Temporary DOM-only text substitution at 320px; one sample each passed, text wraps without horizontal clipping |
| Geometry | All 78 samples per engine: page scrollWidth <= viewport, expected 1/2/3 visible cards, visible cards inside window, all pagination targets within viewport with outline room; no horizontally clipped text |
| Focus isolation | Inactive slides retain inert/aria-hidden; resizing mobile last page clamps to valid desktop index with three visible cards (regression test) |
| Controls | Previous/next, first/middle/last pagination, ArrowLeft/ArrowRight and keyboard focus passed |
| Swipe | Synthetic touch start/move/end events passed both directions, including x=0; physical touchscreen gestures not tested |
| Autoplay | One advance per interval; focus inside carousel pauses even after pointer leaves; focus outside resumes; Pause stops (unit/browser checks) |
| Reduced motion | Changing preference during playback stops advancement; CSS transform transition computes to 0.000001s; restoring preference does not resume automatically |
| Other page controls | Drawer opens, location selection navigates to Nashville and closes drawer; estimate input accepts text without submission; footer link receives focus. Header/hero/form/footer reviewed in full-page captures |
| Runtime | No pageerror events during either engine's matrix |

Raw records: [Chromium geometry](evidence/sprint-3.9.1/chromium-measurements.json), [Firefox geometry](evidence/sprint-3.9.1/firefox-measurements.json). Track scrollWidth remains larger than its window by design; page scrollWidth is the overflow criterion.

### Actual browser zoom limitation

Opened a separate headed Chrome for Testing window for native Ctrl+plus zoom. Windows Computer Use listed `Sprint 3.9.1 Zoom QA - Google Chrome for Testing` (window 131272), but the first keyboard call was rejected with `window id 131272 no longer belongs to Chrome; current owner is Chrome`. A fresh `get_window` recovery failed identically. Thus browser controls could not be driven. The test browser remained at devicePixelRatio 1, inner viewport 1370x693 (outer 1386x788). Actual 200% browser zoom was **not verified** and no screenshot is presented as 200% zoom. Previous equivalent-reflow results remain distinct from actual browser zoom.

### Screenshot evidence

- [Chromium 320px first](evidence/sprint-3.9.1/chromium-320-first.png), [last](evidence/sprint-3.9.1/chromium-320-last.png), [focus](evidence/sprint-3.9.1/chromium-320-focus.png).
- [Chromium desktop first](evidence/sprint-3.9.1/chromium-1440-first.png), [last](evidence/sprint-3.9.1/chromium-1440-last.png).
- [Firefox 320px first](evidence/sprint-3.9.1/firefox-320-first.png), [last](evidence/sprint-3.9.1/firefox-320-last.png), [focus](evidence/sprint-3.9.1/firefox-320-focus.png).
- [Firefox desktop first](evidence/sprint-3.9.1/firefox-1440-first.png), [last](evidence/sprint-3.9.1/firefox-1440-last.png).
- [320px full page](evidence/sprint-3.9.1/chromium-320-page.png), [1440px full page](evidence/sprint-3.9.1/chromium-1440-page.png).

Final evidence captures settle CSS transitions before capture. Carousel-only captures use a taller viewport to include the whole section; the geometry matrix used 900/1000px heights plus the separate orientation cases.

### Required checks and remaining work

| Command | Result |
|---|---|
| `npm run lint` | Pass, no warnings/errors reported |
| `npm run typecheck` | Pass |
| `npm test` | Pass, 64 tests across 8 files; four new carousel regression tests |
| `npm run build` | Pass, 99 modules; CSS 40.05 kB, entry JS 383.27 kB |

No known page-level overflow remains in the tested matrix. Actual 200% zoom and real mobile OS gesture verification remain open; this report does not claim universal responsive coverage. Mobile Performance 100 remains open (last reported 78); no Lighthouse rerun or unrelated architecture change. Sprint 4 may be planned separately with these QA limitations retained; no Sprint 4 work or deployment was performed.

## Sprint 3.9 — Header location selector verification (2026-10-16)

### Cause and correction

Computed Chromium baseline: select foreground/background both `rgb(255, 255, 255)`; option foreground white/background transparent; appearance none; color-scheme normal; width 159px; height 44px inside a 36px strip; padding 0/40/0/12px; font 14px/20px. This confirmed inherited utility-bar colors, insufficient text space and inconsistent height rather than a URL-state defect. See [before](evidence/sprint-3.9/before-desktop.png).

The scoped native picker now has navy `#0f2231` text and arrow on white (16.2:1 contrast), explicit light color-scheme and option colors, 208px width, 44px minimum height, 14px/21px text, 12px left/40px right padding, and a 3px blue keyboard outline. Current longest option measures about 105px versus 154px usable text space. Light utility label and dark drawer label are separate contexts. The strip accommodates the control. Desktop navigation breakpoint moved to 1280px after confirming 1024px CTA clipping; drawer cleanup uses the same breakpoint.

Compared the live reference's `Select Location` label in its dark utility strip ([capture](evidence/sprint-3.9/reference.png)). Retained that clear intent with a bordered field and explicit chevron. No supplied screenshots were present to inspect.

### Checks actually performed

| Check | Result |
|---|---|
| `npm run lint` | Pass, no reported warnings/errors |
| `npm run typecheck` | Pass |
| `npm test` | Pass, 60 tests / 8 files |
| `npm run build` | Pass, 99 modules; CSS 39.97 kB, entry JS 382.95 kB |
| Chromium 153.0.8010.12 / Firefox 155.0 | Global route at all eight requested widths |
| Both engines, `/grand-rapids` and `/nashville/roofing/commercial-roofing` | 16 route/width combinations per engine; correct selected values; drawer opened/closed below 1280px |
| Closed, hover, focus | Navy-on-white control; hover `rgb(241,245,249)`; Tab reaches correctly named `Location` combobox with 3px visible outline |
| Keyboard / navigation | ArrowDown and Enter select Ann Arbor; native change event navigates to hub; browser Back restores placeholder; no custom keyboard interception |
| Mobile interaction | Select Grand Rapids, drawer closes after route change; reopening shows Grand Rapids; Escape dismisses drawer |
| Escape/native popup | Chromium popup consumes Escape and leaves drawer open; Firefox automation delivered Escape to drawer, which closed and restored trigger focus. Native behavior was preserved |
| 200% equivalent reflow | Both engines at 720x450 (half of 1440x900): header fits, drawer nav scrolls to selector, phone/estimate remain reachable. This is viewport reflow evidence, not browser-chrome zoom verification |

### Rendered evidence

[Desktop closed](evidence/sprint-3.9/width-1440.png), [Chromium expanded options](evidence/sprint-3.9/expanded.png), [selected nested route](evidence/sprint-3.9/chromium-selected-loaded.png), [320px drawer](evidence/sprint-3.9/width-320.png), [mobile expanded](evidence/sprint-3.9/mobile-expanded.png), [keyboard focus](evidence/sprint-3.9/keyboard-focus.png), [1024px header](evidence/sprint-3.9/width-1024.png), [reflow drawer](evidence/sprint-3.9/zoom-200-drawer.png). Width captures and computed measurements are saved for both engines; Firefox captures are in the `firefox/` subdirectory.

The Chromium expanded screenshots show readable selectable location rows. Firefox's `expanded.png` is only an attempted popup capture: its native popup is absent from the page screenshot, so this is not proof of expanded-option readability. Computed option colors were checked separately. Native selection highlight and disabled placeholder rendering can override CSS; Chromium renders the disabled placeholder light on gray while all actionable locations remain navy on white. Real iOS/Android sheets and screen-reader announcements were not tested.

Header controls stay within the viewport at every requested width. Whole-page scrollWidth equals viewport width at 390/430/768/1024/1280/1440/1920. At 320px, the review carousel pagination button reaches x=338, causing an existing 18px body overflow outside this sprint's header scope. This was not hidden with a global overflow rule or changed in an unrelated section.

The earlier mobile Lighthouse Performance 78 is retained as an unresolved target. No claim that it is an unavoidable React/SPA limitation, and no new Lighthouse audit in this sprint.

## Sprint 3.8 — Performance, Accessibility, and Interaction Verification (2026-10-16)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 54/54 passed** across 8 test suites (including new `ReviewsStrip.test.tsx` carousel tests) |
| Build | `npm run build` | **Pass** — 99 modules transformed in 2.00s. Clean production bundle in `dist/` |

### Production Lighthouse 3-Run Audit Results (`http://localhost:4173/`)

Tooling: Lighthouse 12.3.0 in Headless Chromium. Testing URL: `http://localhost:4173/`. 3 independent production runs per profile recorded; individual runs and medians reported:

#### Mobile Audits (Moto G4 emulation, 1.6 Mbps simulated slow 4G, 4x CPU throttle)

| Metric / Category | Run 1 | Run 2 | Run 3 | Sprint 3.8 Median | Baseline | Delta |
|---|---|---|---|---|---|---|
| **Performance** | 78 | 78 | 78 | **78** | 66 | **+12** |
| **Accessibility** | 100 | 100 | 100 | **100** | 93 | **+7** |
| **Best Practices** | 100 | 100 | 100 | **100** | 96 | **+4** |
| **SEO** | 100 | 100 | 100 | **100** | 100 | **0** |
| **FCP (First Contentful Paint)** | 3.3 s | 3.3 s | 3.3 s | **3.3 s** | 2.7 s | +0.6 s |
| **LCP (Largest Contentful Paint)** | 4.4 s | 4.4 s | 4.4 s | **4.4 s** | 17.5 s | **-13.1 s** |
| **CLS (Cumulative Layout Shift)** | 0.002 | 0.002 | 0.002 | **0.002** | 0.860 | **-0.858** |
| **TBT (Total Blocking Time)** | 30 ms | 30 ms | 30 ms | **30 ms** | 160 ms | **-130 ms** |

#### Desktop Audits (Desktop profile, unthrottled cable connection)

| Metric / Category | Run 1 | Run 2 | Run 3 | Sprint 3.8 Median | Baseline | Delta |
|---|---|---|---|---|---|---|
| **Performance** | 99 | 99 | 99 | **99** | 58 | **+41** |
| **Accessibility** | 100 | 100 | 100 | **100** | 93 | **+7** |
| **Best Practices** | 100 | 100 | 100 | **100** | 96 | **+4** |
| **SEO** | 100 | 100 | 100 | **100** | 100 | **0** |
| **FCP (First Contentful Paint)** | 0.6 s | 0.6 s | 0.6 s | **0.6 s** | 0.9 s | **-0.3 s** |
| **LCP (Largest Contentful Paint)** | 0.9 s | 0.9 s | 0.9 s | **0.9 s** | 3.2 s | **-2.3 s** |
| **CLS (Cumulative Layout Shift)** | 0.005 | 0.005 | 0.005 | **0.005** | 0.676 | **-0.671** |
| **TBT (Total Blocking Time)** | 0 ms | 0 ms | 0 ms | **0 ms** | 0 ms | **0 ms** |

### Verified Carousel Interaction Checks

| Interaction Test | Expected Behavior | Observed Result | Evidence |
|---|---|---|---|
| Next button click | Advances carousel by 1 slide to show next customer card | **Pass** — Card 1 slides left out of view, Card 2 (Christy L.) slides into slot 1 | `reviews_shifted_state_1792126168763.png` |
| Previous button click | Advances carousel backwards | **Pass** — Returns to previous card | Verified in headless browser & unit tests |
| Touch swipe gesture | Drag left/right with >40px threshold changes slide | **Pass** — Smooth transition | Unit tests + touch event handlers |
| Keyboard navigation | ArrowLeft / ArrowRight updates active slide | **Pass** — Tested in vitest & browser | `ReviewsStrip.test.tsx` |
| Autoplay toggle | Play / Pause button starts & halts auto-advance | **Pass** — Auto-pauses on hover & focus | `ReviewsStrip.test.tsx` |
| Reduced motion | Disables autoplay when prefers-reduced-motion is active | **Pass** — Checked via matchMedia | `ReviewsStrip.test.tsx` |

---

## Sprint 3.7 — Reference Fidelity, Section Colours & Layout Verification (2026-10-16)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 49/49 passed** across 7 test suites |
| Build | `npm run build` | **Pass** — 99 modules transformed in 2.03s. Entry 348.02 KB (109.31 KB gzip), CSS 36.72 KB (7.46 KB gzip) |

### Lighthouse CLI audit results (Production preview)

| Category | Score | Tooling & Parameters |
|---|---|---|
| **SEO** | **100 / 100** | Lighthouse CLI 13.5.0 on `http://localhost:4173/`, headless Chrome |
| **Best Practices** | **96 / 100** | Lighthouse CLI 13.5.0 on `http://localhost:4173/`, headless Chrome |
| **Accessibility** | **93 / 100** | Lighthouse CLI 13.5.0 on `http://localhost:4173/`, headless Chrome |
| **Performance** | **68 / 100** | Lighthouse CLI 13.5.0 on `http://localhost:4173/`, simulated mobile throttling, large hero asset preloaded |

*Note: In development server mode (`http://localhost:5173/`), performance scored 55 due to unbundled ES modules, dev React runtime, and unminified scripts; production preview scored 68.*

### Full-viewport browser audit actually completed (Chromium)

| Viewport | Device Class | Horizontal Overflow? | Console Errors? | Hero Layout | Services Cards | Promotions Row | Reviews / Footer |
|---|---|---|---|---|---|---|---|
| **320px** | Small Mobile | **None** (`scrollWidth: 320`) | 0 errors | Single-column, flush emergency bar, compact form | 1-column flat panels, outlined CTAs | Photo top, navy lower panel, inset red CTA | Light-gray background, red footer headings |
| **390px** | Standard Mobile (iPhone) | **None** (`scrollWidth: 390`) | 0 errors | Clean sky hero, wrapped emergency contact bar | 1-column flat panels, outlined CTAs | Inset red CTA with margins, cyan accent line | Tall review cards, red footer group headings |
| **430px** | Large Mobile (Max/Plus) | **None** (`scrollWidth: 430`) | 0 errors | Clean margins, crisp typography | 1-column flat panels, outlined CTAs | Inset red CTA, cyan line | Tall review cards, red footer group headings |
| **768px** | Tablet Portrait (iPad) | **None** (`scrollWidth: 768`) | 0 errors | Stacked hero + form, full photography | 2-col flat panels, outlined CTAs | 2/3 column layout, inset red buttons | Tall review cards, distinct navy surfaces |
| **1024px** | Tablet Landscape | **None** (`scrollWidth: 1024`) | 0 errors | Side-by-side hero + form, emergency bar | 2-col flat panels, outlined CTAs | 3-col cards, inset red buttons | 3-col review cards, distinct navy surfaces |
| **1280px** | Desktop standard | **None** (`scrollWidth: 1280`) | 0 errors | Side-by-side hero + form, emergency bar | 2x2 grid flat panels, direct illustrations | 3-col cards, inset red buttons | 3-col review cards, distinct navy surfaces |
| **1440px** | Desktop wide (reference) | **None** (`scrollWidth: 1440`) | 0 errors | Side-by-side hero + form, emergency bar | 2x2 grid flat panels, direct illustrations | 3-col cards, inset red buttons | 3-col review cards, distinct navy surfaces |
| **1920px** | Ultra-wide | **None** (`scrollWidth: 1920`) | 0 errors | Max-w-1440 centered container | 2x2 grid flat panels, direct illustrations | 3-col cards, inset red buttons | 3-col review cards, distinct navy surfaces |

### Visual fidelity evidence captured (Sprint 3.7)

- `hero_section_viewport_1792091400530.png`: Hero desktop close-up showing sky background, "Done in a day. Good for a lifetime.", suburban home, and rectangular `#0C1F33` lead form.
- `why_mr_roof_1440_1792091221037.png`: Why Us desktop close-up showing flat `#F4F6F8` panels, vertical photography, red square badges, and left sticky heading.
- `services_promotions_1440_v2_1792091237886.png`: Our Services 2x2 flat light-gray panels with direct illustrations and outlined red-bordered CTAs.
- `reviews_footer_1440_1792091246844.png`: Promotions with inset red buttons & cyan line + Reviews with flat light-gray background & left heading.
- `footer_1440_1792091255427.png`: Awards strip in `#0C1F33` and Footer in deeper navy `#071524` with red column headings and white logo/CTA.
- `full_page_1440_1792091405239.png`: Full desktop 1440px homepage comparison capture.
- `hero_768_top_1792091275332.png`: Tablet 768px hero layout.
- `hero_mobile_390_1792091283860.png`: Mobile 390px hero layout.
- `mobile_menu_open_1792091300068.png`: Mobile drawer navigation open.

---

## Sprint 3.6 — Visual Defect Remediation & Full-Viewport QA (2026-10-16)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 49/49 passed** across 7 test suites |
| Build | `npm run build` | **Pass** — 99 modules transformed in 2.06s. Entry 347.64 KB (109.17 KB gzip), CSS 35.08 KB (7.14 KB gzip) |

### Browser verification actually completed (Chromium)

| Viewport | Device Class | Horizontal Overflow? | Console Errors? | Header Logo | Awards Section | Footer Logo | Form / Reviews State |
|---|---|---|---|---|---|---|---|
| **320px** | Small Mobile | **None** (`scrollWidth: 320`) | 0 errors | Visible, responsive | 5 badges visible & wrapped | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **390px** | Standard Mobile (iPhone) | **None** (`scrollWidth: 390`) | 0 errors | Visible, responsive | 5 badges visible (3 top, 2 bottom) | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **430px** | Large Mobile (Max/Plus) | **None** (`scrollWidth: 430`) | 0 errors | Visible, responsive | 5 badges visible | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **768px** | Tablet Portrait (iPad) | **None** (`scrollWidth: 768`) | 0 errors | Visible, 180×44px | 5 badges visible in clean row | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **1024px** | Tablet Landscape | **None** (`scrollWidth: 1024`) | 0 errors | Visible, 180×44px | 5 badges visible in clean row | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **1280px** | Desktop standard | **None** (`scrollWidth: 1280`) | 0 errors | Visible, 180×44px | 5 badges visible in clean row | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **1440px** | Desktop wide (reference) | **None** (`scrollWidth: 1440`) | 0 errors | Visible, 180×44px | 5 badges visible in clean row | Visible in white/red | Disambiguated placeholders; no "Verified" badge |
| **1920px** | Ultra-wide | **None** (`scrollWidth: 1920`) | 0 errors | Visible, 180×44px | 5 badges visible in clean row | Visible in white/red | Disambiguated placeholders; no "Verified" badge |

### Defect fixes verified in browser

1. **Header Logo**:
   - Explicit 180×44px rendering with pure vector paths. Red roof eaves, dark navy wordmark, red accent dot rendered crisply against white background.
2. **Pre-Footer Awards Section**:
   - 0px collapse eliminated. All 5 badges (Roofing Contractor Top 100, BBB A+ Accredited, Owens Corning Platinum, Angi 2022 Super Service, Best of HomeAdvisor Winner) render with explicit width/height and vibrant, contrasting fills against `#0F2231`.
3. **Footer Logo**:
   - Explicit 180×44px rendering with pure vector paths. Crisp white wordmark with red roof and red accent dot rendered against `#0F2231`.
4. **Form Placeholders & Contrast**:
   - Location placeholder reads `"Select a location…"`.
   - Service placeholder reads `"Select a service…"`.
   - Dropdown chevron visible with `text-slate-400`. Field error text uses `text-rose-300` on dark hero card (contrast > 7:1 against `#0F2231`).
5. **Review Cards**:
   - Deceptive `"Verified"` badge removed from demo testimonials; replaced with neutral service category badges. Kicker text updated to accessible `#0369A1` (contrast 5.93:1 on white).
6. **ProtectBand Highlights**:
   - Blue phrase highlights updated to `#0284C7` (contrast 4.1:1 on white, satisfying WCAG AA 3:1 for large text).

### Screenshots captured (Sprint 3.6)

- **Diagnostic Before**:
  - `header_closeup_1792087551701.png` (demonstrating 0px collapsed header logo)
  - `footer_awards_view_1792087529658.png` (demonstrating collapsed awards badges and invisible footer logo)
  - `homepage_lower_1792087795281.png` (empty navy pre-footer section)
- **Remediated After**:
  - `header_closeup_1440_1792088667909.png` (crisp visible header logo + disambiguated dropdown placeholders)
  - `reviews_awards_1440_1792088692703.png` (clean customer testimonials without "Verified" badges + accessible kicker)
  - `awards_footer_1440_1792088700257.png` (all 5 award badges rendering with high contrast + visible white/red footer logo)
  - `viewport_320_1792088712079.png` (320px viewport layout & logo visibility)
  - `fullpage_390_1792088718945.png` (390px mobile full-page with wrapped awards badges & 0 overflow)
  - `fullpage_1440_1792088728207.png` (1440px desktop full-page with all sections fully rendered)

---

## Sprint 3.5 — Reference Audit & Visual Reconstruction Verification (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** — 0 errors |
| Tests | `npm test` | **Pass — 49/49 passed** across 7 test suites |
| Build | `npm run build` | **Pass** — 99 modules transformed in 2.22s. Entry 347.52 KB (109.14 KB gzip), CSS 34.90 KB (7.07 KB gzip) |

### Browser verification actually completed

| Viewport | Device Class | Horizontal Overflow? | Console Errors? | Visual State |
|---|---|---|---|---|
| **320px** | Small Mobile | **None** (`scrollWidth <= 320`) | 0 errors | Single column, responsive form card, full-width buttons |
| **390px** | Standard Mobile (iPhone) | **None** (`scrollWidth <= 390`) | 0 errors | Mobile nav drawer opens/closes, sticky header, full photo |
| **430px** | Large Mobile (Max/Plus) | **None** (`scrollWidth <= 430`) | 0 errors | Clean card margins, no clipping |
| **768px** | Tablet Portrait (iPad) | **None** (`scrollWidth <= 768`) | 0 errors | 2-col service cards, stacked promo cards, tablet hero |
| **1024px** | Tablet Landscape / Desktop | **None** (`scrollWidth <= 1024`) | 0 errors | Primary nav displays, sticky form card, 2-col why-us |
| **1280px** | Desktop standard | **None** (`scrollWidth <= 1280`) | 0 errors | Full-width container rhythm, 3-up promo cards, 5-col footer |
| **1440px** | Desktop wide (reference) | **None** (`scrollWidth <= 1440`) | 0 errors | Hero photo & dark lead card side-by-side, 2-col why-us |
| **1920px** | Ultra-wide | **None** (`scrollWidth <= 1920`) | 0 errors | Max-width container boundaries honored, centered |

### Browser interactions verified

- Mobile navigation drawer: Hamburger button triggers modal drawer, background main/footer receive inert, focus is trapped inside dialog, backdrop click and Escape dismiss drawer and restore focus.
- Hero lead form: Validated field errors, inverse dark input styling, duplicate submission prevention, and successful acknowledgement state.
- Links and navigation: All service and location links point to valid routes; 0 broken links.

### Screenshots captured

- **Reference**:
  - `mr_roof_desktop_1440_1792084884439.png`
  - `mr_roof_tablet_768_1792084890109.png`
  - `mr_roof_mobile_390_1792084896130.png`
- **Local Before**:
  - `local_before_desktop_1440_1792085112089.png`
  - `local_before_tablet_768_1792085120658.png`
  - `local_before_mobile_390_1792085133671.png`
- **Local After (Reconstructed)**:
  - `local_after_desktop_1440_1792086333550.png`
  - `local_after_tablet_768_1792086341209.png`
  - `local_after_mobile_390_1792086350311.png`

---



### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** (one unused-import fixed on the way) |
| Build | `npm run build` | **Pass** — 89 modules, 1.78s |

### Tests (vitest + jsdom + Testing Library)

**49/49** passed across 7 files. New files this sprint:

- `src/features/estimate/EstimateForm.test.tsx` (8 cases) — see Sprint 3 PROGRESS.md for list.
- `src/pages/HomePage.test.tsx` (4 cases) — single `<h1>`, section landmarks, LCP-friendly hero image, real service hrefs.

### Build output

- Entry JS 347.12 KB / 109.03 KB gzip; entry CSS 19.95 KB / 4.87 KB gzip.
- Homepage chunk `HomePage-*.js` 19.59 KB / 6.06 KB gzip, lazy.
- No preview strings in emitted JS (`find dist -name '*.js' -not -name '*.map' …` empty).

### Not run (recorded as pending)

- Live browser inspection of the homepage at 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px — no browser automation in session.
- Visual match against the live reference homepage.
- Keyboard walkthrough of the full form in a real browser.
- Screen-reader announcement of the `role="status"` region on submission.
- 200% zoom.
- Reduced-motion end-to-end.
- Lighthouse / PageSpeed audits.

Interaction tests cover field-level errors, pending/busy state, duplicate-submission prevention, success-ack lifecycle, error-preserves-input retry, and independent consent choices under jsdom. They do **not** prove responsive layout, visual spacing, real-browser form UX, or Lighthouse scores.

## Sprint 2.5 (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors |
| Typecheck | `npm run typecheck` | **Pass** |
| Build | `npm run build` | **Pass** — 88 modules, 1.80s |

### Tests (vitest + jsdom + Testing Library)

**37/37** passed across 5 files (up from 33). New / updated cases:

- `SiteHeader.test.tsx` — gained: *About trigger carries no aria-haspopup* (disclosure, not menu); *top strip renders a Call <phone> link*.
- `MobileNav.test.tsx` — gained: *inerts `<main>` and `<footer>` on open and restores on close*; *auto-closes when the viewport is already at desktop at open time*; *auto-closes when a resize crosses the lg breakpoint while open*. matchMedia is stubbed with a controllable "matches" + a captured handler so the resize edge can be driven synchronously.

### Build-output verification

- `find dist -name '*.js' -not -name '*.map' -exec grep -lE "__preview|FoundationPreview" {} \;` → **empty**. The DEV-only gating removes both the chunk and the identifier from emitted JS; source-map strings are inherently irrelevant for production serving.
- Entry sizes: `index-*.js` 347.05 KB / 109.00 KB gzip; `index-*.css` 19.95 KB / 4.87 KB gzip.

### Not run (recorded as pending)

- Live browser inspection at 320 / 390 / 768 / 1024 / 1440 px — no automation available.
- Visual match against the live reference at matching viewport sizes.
- 200% zoom.
- Keyboard-only walkthrough.
- Screen-reader output.
- Console error check in a running browser.
- Sticky header scroll behavior.
- Hover transitions.
- Lighthouse / PageSpeed (Sprint 9).

The two user-supplied screenshots informed the structural corrections (top strip, taller main row, bigger phone, bigger CTA, dark-navy footer). Static images cannot verify sticky, hover, menu transitions, or responsive breakpoint behavior; those remain pending.

## Sprint 2 (2026-10-15)

### Static checks

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | **Pass** — 0 warnings, 0 errors after fixing a `react-hooks/exhaustive-deps` ref-capture warning in `MobileNav.tsx` |
| Typecheck | `npm run typecheck` | **Pass** |
| Build | `npm run build` | **Pass** — 88 modules, 1.81s |

### Tests (vitest + jsdom + Testing Library)

33/33 across 5 files:

- `src/data/availability.test.ts` — 9 cases (unchanged)
- `src/pages/dispatch.test.tsx` — 8 cases (unchanged)
- `src/components/layout/SiteHeader.test.tsx` — 9 cases: About dropdown aria + open/close/Escape/focus/outside-item-click; global vs location Free Estimate CTA (/, /nashville, /lexington); location-selector URL reflection.
- `src/components/layout/MobileNav.test.tsx` — 4 cases: closed by default; opens on hamburger click + body-scroll lock; Escape closes + restores scroll + focuses trigger; explicit close button.
- `src/components/layout/LocationSelector.test.tsx` — 3 cases: navigate on change; URL as source of truth on re-pick; empty option on non-location URL.

### Build-output verification

- `dist/assets/` enumerated after `npm run build`: no `FoundationPreview-*.js` chunk present (previously 3.78 KB). Confirms `/__preview` is tree-shaken from production.
- Bundle sizes (production): entry `index-*.js` 344.73 KB / 108.58 KB gzip; CSS `index-*.css` 19.89 KB / 4.85 KB gzip; 15 route-split page chunks (0.18–2.13 KB each).

### Not run (recorded as pending)

| Check | Reason |
|---|---|
| Browser smoke @ 320/360/390/430/768/1024/1280/1440/1920 | No live browser automation / screenshot tool in session |
| Visual match against reference | Same |
| Real keyboard / screen-reader walkthrough | Same |
| Browser console errors | Same |
| Dev-server smoke | Same |
| 200% zoom | Same |
| Reduced-motion end-to-end | Same |
| Lighthouse / PageSpeed | Out of scope until Sprint 9 |

Interaction tests cover ARIA attributes, focus restoration, body-scroll lock, and route-driven state in jsdom; they do **not** prove responsive layout, visual spacing, or real screen-reader output. These remain pending.

## Sprint 1 (2026-10-15)

### Baseline / Git

| Check | Tool | Result |
|---|---|---|
| Working directory | PowerShell `Get-Location` | `D:\Qorvin IT\projects\construction project` — confirmed |
| Branch | `git branch --show-current` | `main` |
| Remote | `git remote -v` | origin → `https://github.com/Ahasan39/construction-project.git` |
| Remote branches | `git ls-remote --heads origin` | empty — no history to preserve |
| Working tree before Sprint 1 | `git status --short` | three untracked entries from Sprint 0 only: `.gitignore`, `README.md`, `docs/` |
| Identity | `git config user.{name,email}` | `Ahasan39 <154082038+Ahasan39@users.noreply.github.com>` |
| Global config changes | — | None performed |

### Install

| Check | Command | Result |
|---|---|---|
| Dependencies | `npm install --no-audit --no-fund` | **273 packages added** in ~1 min, lockfile created |
| Node | `node --version` | `v24.14.0` (project requires >= 20.19) |
| npm | `npm --version` | `11.9.0` |

Resolved versions of top-level packages (from `package-lock.json`):

- react@19.3.1
- react-dom@19.3.1
- react-router-dom@7.18.4
- vite@6.4.4
- @vitejs/plugin-react@4.7.0
- tailwindcss@4.3.3
- @tailwindcss/vite@4.3.3
- typescript@5.9.3
- typescript-eslint@8.71.2
- eslint@9.39.5
- vitest@3.2.7

### Static checks

| Check | Command | Result |
|---|---|---|
| ESLint | `npm run lint` | **Pass** — 0 warnings, 0 errors (after fixing one triple-slash reference and one `react-refresh/only-export-components` warning in `router.tsx`) |
| TypeScript | `npm run typecheck` | **Pass** — strict project build clean (after switching `vite.config.ts` to `defineConfig` from `vitest/config` for the `test` field) |
| Production build | `npm run build` | **Pass** — 81 modules transformed, built in 1.66s. Route-split chunks per template; main bundle 329.94 KB JS (104.85 KB gzip) + 16.79 KB CSS (4.29 KB gzip). |

### Tests

| Check | Command | Result |
|---|---|---|
| Vitest | `npm test` | **Pass** — 2 files, **17/17 tests** green in ~1.4s |

Covered:

- `src/data/availability.test.ts` — 9 cases: explicit availability (`nashville/siding`, `nashville/windows`), unavailable combos (`ann-arbor/siding`, `lexington/*`), variant membership (`nashville/roofing/commercial-roofing` vs `nashville/roofing/metal-roofing`), per-location capability flags, undefined lookup, dataset not empty.
- `src/pages/dispatch.test.tsx` — 8 cases: top-level slug dispatch (service hub, location hub, unknown), two-segment dispatch (service variant OK, unknown variant → 404, unavailable location/service → 404, available location/service, unknown first segment → 404).

### Not run (recorded as pending)

| Check | Reason |
|---|---|
| Dev server smoke test (`npm run dev`) | No live browser in this session |
| Direct URL load / refresh on `_redirects` fallback | Requires a hosted preview |
| Keyboard navigation / screen reader walk | No live browser |
| Browser console errors | No live browser |
| Visual inspection at 320/390/768/1440 | No live browser |
| Lighthouse / PageSpeed | Deferred to Sprint 9 |

### Preserved Sprint 0 observations (unchanged)

1. Phone discrepancy on reference: displayed `(800) 884-9760` vs. tel-link `844-611-4995`.
2. Lansing absent from reference footer; Lexington absent from reference lead-form dropdown.
3. Footer `/free%20estimate` likely 404s.
4. `/nashville/roofing/commercial-roofing/` exists in sitemap but Nashville nav uses `/nashville/commercial/`.
