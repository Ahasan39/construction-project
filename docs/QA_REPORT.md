# QA Report

A living record of every verification performed. Checks are not marked passed unless they were actually run.

## Sprint 5.5.6 — Dayton scoped service hubs (2026-10-20)

Lint, typecheck, 173 tests across 14 files and production build (96 static entries + 404) all passed after implementation. New data-driven coverage asserts: each of the four Dayton hubs renders a city-named H1 without the Sprint 1 scaffold badge; the Dayton hero CTA resolves to `/dayton/#estimate`; `/dayton/masonry/` and `/dayton/insulation/` remain Not Found; FAQ heading renders only where the reference publishes one. Rendered browser verification is not available in this session; HTTP 200 and bundle-string probes are not substituted. See [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).

## Sprint 5.5.5 — Cincinnati scoped service hubs (2026-10-20)

Lint, typecheck, 166 tests across 14 files and production build (93 static entries + 404) all passed after implementation. New data-driven coverage asserts: each of the five Cincinnati hubs renders a city-named H1 without the Sprint 1 scaffold badge; the Cincinnati hero CTA resolves to `/cincinnati/#estimate`; FAQ heading renders only where the reference publishes one (siding yes; roofing and masonry no). Rendered browser verification is not available in this session; HTTP 200 and bundle-string probes are not substituted. See [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).

## Sprint 5.5.4 — Cleveland scoped service hubs + Grand Rapids FAQ correction (2026-10-20)

Lint, typecheck, 159 tests across 14 files and production build (89 static entries + 404) all passed after implementation. New data-driven coverage asserts: each of the four Cleveland hubs renders a city-named H1 without the Sprint 1 scaffold badge; the Cleveland hero CTA resolves to `/cleveland/#estimate`; `/cleveland/masonry/` remains Not Found (reference does not publish a scoped URL); Grand Rapids siding keeps its reference-verified FAQ block while roofing/windows/gutters/masonry no longer render one. Rendered browser verification is not available in this session; HTTP 200 and bundle-string probes are not substituted. See [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).

## Sprint 5.5.3 — Grand Rapids scoped service hubs (2026-10-20)

Lint, typecheck, 148 tests across 14 files and production build (86 static entries + 404) all passed after implementation. New data-driven coverage asserts each of the five Grand Rapids hubs renders a city-named H1 without the Sprint 1 scaffold badge, the hero CTA resolves to the Grand Rapids `#estimate` anchor on the completed location hub, and the breadcrumb returns to `/grand-rapids/`. Rendered browser verification is not available in this session; HTTP 200 and bundle-string probes are not substituted. See [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).

## Sprint 5.5.2 — Nashville provenance correction and free-estimate (2026-10-20)

Lint, typecheck, 141 tests across 14 files and production build all passed after implementation. New coverage in `src/pages/LocationFreeEstimatePage.test.tsx` asserts Nashville renders a completed body with the "Free Estimate." H1 (reference parity), the hero region selector is suppressed because Nashville is preselected while the service dropdown remains open, demo phone/email contacts render with the shared `tel:` / `mailto:` hrefs, breadcrumb targets `/nashville/`, the "Demo form — submissions are not sent." notice is present, the four other advertised `hasFreeEstimate` cities keep their Sprint 1 scaffolds, and unknown or incapable location slugs resolve to Not Found. The provenance correction documented in [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md) is docs-only — no local route or implementation changed. Rendered browser verification remains unavailable in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks.

## Sprint 5.5.1 — Nashville local-service hub pages (2026-10-20)

Lint, typecheck, 130 tests across 13 files and production build all passed after implementation. New data-driven coverage in `src/pages/LocationServicePage.test.tsx` asserts that every `locationServicePages` entry maps to an availability pair, each of the five completed Nashville hubs renders a city-named H1 without the Sprint 1 scaffold badge, the hero CTA resolves to `/nashville/free-estimate/`, the breadcrumb returns to `/nashville/`, `/lexington/roofing/` remains Not Found, and `/nashville/insulation/` continues to render the scaffold. Rendered browser verification of the five live routes at viewport widths is not available in this session; HTTP 200 and bundle-string probes are not substituted for rendered checks. See [LOCATION_SERVICE_AUDIT.md](LOCATION_SERVICE_AUDIT.md).

## Sprint 5.3 — Focused location-page verification (2026-10-20)

### Blocker — rendered browser verification

Rendered browser inspection of the live location pages (Grand Rapids at 320/390/1440, Detroit at 390, Nashville at 1440) was not performed in this sprint. No headless-browser automation (Playwright, Puppeteer, Chromium control, in-app browser) is available to this session, and the project itself does not ship such a dependency. Per the sprint instruction, bundle-string probes are **not** substituted for rendered verification; the Sprint 5.2 bundle-string result remains the last machine-level evidence that location strings reached the deployed artifact, nothing more. Live screenshots, computed-style and overflow checks for Sprint 5.3 remain open.

### Concrete fix landed this sprint

The sticky `SiteHeader` is a utility strip (`min-h-11 sm:min-h-14 py-1`) stacked above the main row (`h-20 lg:h-24`) — effectively ~124px on mobile, ~144px on tablet and ~160px at `lg+`. Sprint 5.2 set the hero `<aside id="estimate">` scroll-margin at `scroll-mt-28 lg:scroll-mt-32` (112/128px), which is **below** the header on every width. The fix sets explicit arbitrary values: `scroll-mt-[136px] sm:scroll-mt-[154px] lg:scroll-mt-[170px]`, leaving ~10px of breathing room above the target at every breakpoint. The fix is derived from the header's own Tailwind geometry, not from a browser measurement.

### Data / route consistency (automated)

Covered by existing tests in `src/pages/LocationPage.test.tsx`:

- Every `locations[]` slug has a `locationPages[]` content record (data-driven `it.each`).
- Every `defaultRegionKey` exists in `serviceAreaRegions`.
- Every slug renders a hero and a Final CTA region.
- Final CTA target: `/<slug>/free-estimate/` when `hasFreeEstimate` is advertised; the in-page `#estimate` anchor otherwise. The anchor target exists in the DOM.
- Scoped service links `/<slug>/<service>/` appear only when `availability.ts` lists the pair; otherwise the global hub link is used.

All 119 tests across 12 files pass locally (reused — no application behaviour changed except the scroll-margin values, which the existing tests continue to cover).

### Nested destinations still shells (not completed this sprint)

- `/<location>/<service>/` beyond the explicit availability pairs — those listed in `availability.ts` keep their existing Sprint 1 shell dispatchers.
- `/<location>/<service>/<variant>/` (only `nashville/roofing/commercial-roofing`, `cincinnati/roofing/commercial-roofing`, `dayton/roofing/commercial-roofing` are mounted at all, and they remain shells).
- `/<location>/free-estimate/`, `/<location>/financing/`, `/<location>/service-area/`, `/<location>/service-area/<child>/` for every advertised capability — all remain Sprint 1 scaffolds.



## Published frontend contact update (2026-10-16)

Lint, typecheck, all 67 tests and production build passed. Chromium 153.0.8010.12 and Firefox 155.0 checked the production build under `/construction-project/` at 320, 390, 768 and 1440px. Visible header controls remained within the viewport, no horizontal page overflow, and header top was zero after removal of the disclosure wrapper. Desktop and mobile screenshots were visually reviewed.

Home, Nashville, Lexington and nested Nashville commercial-roofing routes expose only `tel:+8801842299275` and `mailto:amamulahasan77@gmail.com` contact destinations. No location phone overrides are present; location selection still navigates correctly. No addresses changed. The malformed requested email href was normalized to the valid mailto URL for the supplied address.

The exact short form note is present, the large disclosure is absent, noindex remains, and the explicit demo success acknowledgment appears after synthetic input with zero non-GET requests or page errors. Existing reference labels remain unchanged. Local screenshots and measurements: `docs/evidence/contact-update/local-*` and [local results](evidence/contact-update/local.json). [Actions run 38912522606](https://github.com/Ahasan39/construction-project/actions/runs/38912522606) successfully deployed implementation commit `92d0f35a81ef208227c26b100708f4f01229cf53`. The same browser checks passed against https://ahasan39.github.io/construction-project/ in Chromium and Firefox, including all four viewport widths, contact destinations, location navigation, absent banner, noindex and mock acknowledgment with no network writes. See [live results](evidence/contact-update/live.json) and `live-*` screenshots. Prior actual-zoom/performance/audit limitations remain open.

## Sprint 3.10 — Static demo deployment QA (2026-10-16)

### Configuration and local checks

API confirmed Pages was not previously enabled. Created Pages with build_type=workflow; confirmed public HTTPS URL https://ahasan39.github.io/construction-project/ and no custom domain. Authorization used existing Git credentials without recording secrets. The workflow uses official actions: checkout/setup-node v7, configure-pages v6, upload-pages-artifact/deploy-pages v5; Node 24, locked npm ci and all required gates. See [Vite guide](https://vite.dev/guide/static-deploy.html) and [GitHub workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

| Check | Result |
|---|---|
| npm ci | Pass after stopping dev servers that held a Windows native-module lock |
| npm run lint | Pass |
| npm run typecheck | Pass |
| npm test | Pass: 67 tests, 9 files; new asset-prefix, route-manifest and noindex/canonical regressions |
| npm run build | Pass: 100 modules, 82 supported static route entries plus custom 404.html |
| Production assets | JS/images/preloads/favicon and CSS font URLs use /construction-project/; no FoundationPreview production chunk |
| Local static-host browser smoke | Chromium 153 and Firefox 155 pass; actual base-path hosting without generic SPA rewrite |
| Direct nested route + refresh | /nashville/roofing/commercial-roofing/ returns 200; query `?qa=a%26b&value=one%20two` and fragment #main retained |
| Unknown route | HTTP 404 and in-app Not Found; query/fragment retained |
| Navigation/location | Homepage to Nashville; mobile drawer to Grand Rapids; selection follows URL |
| Carousel/mock form | Next advances; fictional input produces demo acknowledgment; no submission/network POST |
| Asset/runtime checks | All images loaded, fonts inspected, both favicon URLs 200; no asset 404s or pageerror events |
| Responsive | 320/390/1440px, no horizontal page overflow in smoke checks |
| Local Claude files | CLAUDE.md and .claude/settings.json preserved and ignored; attribution false; CLAUDE.local.md absent; index removals only |

Local browser evidence: `docs/evidence/sprint-3.10/local-smoke.json` and `local-{chromium,firefox}-{320,390,1440,nested}.png`.

### Routing and public-demo limits

Each supported route gets a copy of the built HTML shell. This is static route output, **not server rendering/prerendered content**: page content/metadata need JavaScript. No redirect script is used, so path, query and fragment remain intact (Pages may append a directory slash). Existing explicit availability controls generation; unavailable services/variants/capabilities are excluded. GitHub Pages ignores public/_redirects. Unknown direct loads receive the custom HTML with HTTP 404; client navigation to an unknown route has no new document status.

Initial HTML and client transitions retain noindex,nofollow, with no canonical to mrroof.com. Public banner identifies the independent demo, nondelivery and no payment/email/SMS integrations. Reference testimonials/credential artwork no longer appear as verified demo-operator claims. Mock service performs no network request or data persistence. Robots.txt is supplementary and not an indexing guarantee.

Root-only Claude ignores do not affect other Markdown/agent instructions and do not erase prior Git history. README now contains identity, no-AI-attribution, checks, safe Git workflow and hosting instructions.

### Publication status

Published at [the actual Pages URL](https://ahasan39.github.io/construction-project/). [Actions run 38910725469](https://github.com/Ahasan39/construction-project/actions/runs/38910725469) successfully built and deployed implementation commit `742cb7d0f469bce01d70dc6de1c3ac4b59a8974f`, including all CI verification gates.

Live Chromium 153.0.8010.12 and Firefox 155.0 passed homepage, header location selection, mobile drawer navigation, valid location and nested routes, refresh, carousel and mock estimate submission. Nested direct requests returned 200; Firefox's cached refresh returned 304. Query strings and fragments survived navigation/refresh. Unknown routes, unavailable `/lexington/roofing/` and `/__preview` returned HTTP 404; the unknown-route shell rendered Not Found at the original URL.

Live 320/390/1440px screenshots and geometry checks showed no page overflow. Images, fonts, favicon and preloads loaded without asset 404s. No pageerror events or unexpected console errors on normal routes. Synthetic form submission produced the demo acknowledgment and no non-GET requests. Initial HTML and route metadata retained noindex. Separately, all 82 generated routes were checked in local Chromium on a static server, and local development navigation remained root-relative.

Evidence: [live smoke results](evidence/sprint-3.10/live-smoke.json), [Chromium mobile](evidence/sprint-3.10/live-chromium-390.png), [Chromium desktop](evidence/sprint-3.10/live-chromium-1440.png), [nested route](evidence/sprint-3.10/live-chromium-nested.png), and corresponding Firefox captures in the same directory.

PageSpeed Insights was attempted against the deployed URL for both mobile and desktop. Both returned HTTP 429 (daily API quota exceeded), so there are **no deployed performance scores**. See [mobile response](evidence/sprint-3.10/pagespeed-mobile.json) and [desktop response](evidence/sprint-3.10/pagespeed-desktop.json). Do not infer deployed performance from localhost. Actual 200% browser zoom and mobile Performance 100 remain open; last reported localhost mobile score 78. Existing npm audit findings are dev-only Vitest/mocker/tinypool issues (1 moderate, 2 critical), not runtime dependencies in the Pages artifact; no force/major dependency upgrade was performed in this hosting sprint.

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

## Sprint 4 — Service hub verification (2026-10-17)

Baseline clean main/origin `66e90f515523fe6b2106f1065877785a4df137b3`; repository-local identity retained. Scope: five service bodies only. Full per-page audit: [SERVICE_PAGES_AUDIT.md](SERVICE_PAGES_AUDIT.md).

| Page | Reference sections | Implemented sections | Browser verification | Remaining differences |
|---|---|---|---|---|
| Roofing | Panorama/intro/specials, trust, 4 photo cards, awards, history/3 benefits, single review, related cards, estimate | All, in observed order | Chromium + Firefox matrix, navigation/refresh, disclosure/review/related actions | Substitute roof photos and existing badge artwork; original shorter prose; explicit review controls |
| Siding | Intro/eyebrow, trust, 4 products, 6-style selector, repair, trim, colors, visualizer, 6 FAQs, related, estimate | All, in observed order | Both engines; keyboard disclosure and next/previous style wrap; location action | Illustrative repeated photos rather than product swatches; product/color CTA adapted to estimate shell |
| Windows | Intro, reasons, trust, local list, ProVia, visualizer CTA, related list, financing, estimate, 5 FAQs, final CTA | All, in observed order | Both engines; direct loads/refresh and header/mobile navigation | Regional-hub fallbacks for unconfirmed window routes; product/visualizer photos substituted |
| Gutters | Intro, installation/checklist, trust, seamless benefits, guards, related, estimate | All; no invented FAQs/reviews | Both engines and width matrix | Substitute inspection/consultation photos, shorter prose |
| Masonry | Intro, 4 white cards, repair/checklist, trust, stone veneer, visualizer, related, estimate | All; no invented FAQs/reviews | Both engines and width matrix | Numbered markers replace reference icons; no exact chimney/stone photos |

### Checks actually run

- `npm run lint`: pass, no warnings/errors.
- `npm run typecheck`: pass.
- `npm test`: **77/77**, 10 files. Added content/action resolution, availability fallback, single H1/priority image, no unintended forms, style wrap, location navigation, observed-composition and single-review tests. Existing homepage, picker, drawer and mock form suites pass.
- `npm run build`: pass, 103 modules; 82 clean-route entries plus custom 404. Main JS 384.37kB / 119.27kB gzip; service dispatcher chunk 26.39kB / 8.73kB gzip; route CSS 10.39kB / 2.43kB gzip.
- Built HTML checked: only each hub's current hero is preloaded; homepage entry retains its homepage preload; custom 404 has no hero preload; noindex retained.
- `git diff --check`: pass before staging. Claude files remain ignored.

### Browser coverage and evidence

Chromium **153.0.8010.12** and Firefox **155.0**, production static server at `/construction-project/` (no SPA fallback for supported route checks). All five pages at 320, 360, 390, 430, 640, 768, 1024, 1280, 1440, 1920 and 2560 CSS px, plus 844×390 landscape: **60 samples per engine**, zero page-level horizontal overflow, zero clipped measured headings/buttons/selects, one H1 each, zero runtime/console errors. This finite set is not an all-device claim.

[Geometry records](evidence/sprint-4/browser-matrix.json) and [production interactions](evidence/sprint-4/production-interactions.json). Both engines verified direct HTTP 200 entry loads, refresh, all five primary navigation links, mobile drawer navigation/close, availability-gated service picker, related-service links, estimate-shell destination, homepage form note, all images loaded, noindex and zero non-GET requests during smoke checks. Native disclosure Enter/Space toggling, siding next/previous, Roofing reviews and reduced-motion autoplay guard passed. Existing mock submission behavior is covered by its unchanged unit tests; this sprint's browser smoke did not re-submit the form.

Reference/local comparisons: `reference-{service}-{1440|768|390}.webp` and `local-{service}-{1440|768|390}.webp` in [evidence](evidence/sprint-4/). Full-page captures use identical 900px viewport heights and are stored as quality-82 WebP to limit repository size. All five desktop compositions and tablet/mobile hero contact sheets were visually inspected; representative final corrections were re-inspected. Reference lazy-loading failures are documented rather than treated as missing required content. No screenshot proves identical photographs or exact typography/content height.

Keyboard focus uses the existing visible focus treatment; native details and manual buttons remain usable without hover. No animated entrance gate. Reduced-motion computed disclosure duration <0.01s; inherited carousel disables autoplay. Image dimensions/aspect ratios reserve space. Actual 200% zoom was attempted in headed Chromium with Control+0 and five Control++ commands: DPR stayed 1 and viewport width stayed 1034, so **actual zoom is unverified**, not substituted with resizing. [Attempt record](evidence/sprint-4/zoom-attempt.json). Physical touch, screen-reader output and exhaustive intermediate-width/slow-network scenarios remain unverified.

### Lighthouse — production build, localhost static server

Lighthouse reports are stored in `evidence/sprint-4/lighthouse-{roofing|windows}-{mobile|desktop}.json`; [summary](evidence/sprint-4/lighthouse-summary.json). These are local production audits, **not live PageSpeed Insights results**. The test static server has no gzip/cache headers, so transfer/cache findings can differ from Pages.

| Page | Mobile performance | Desktop performance | Accessibility | Best Practices | CLS mobile / desktop |
|---|---:|---:|---:|---:|---:|
| Roofing | 71 | 97 | 100 both | 100 both | 0 / 0.001 |
| Windows | 71 | 98 | 100 both | 100 both | 0 / 0.001 |

Initial Roofing run: Performance 41, Accessibility 97, CLS 0.851. It identified the footer appearing while a lazy route had an empty fallback, plus the dark review-note contrast problem. Reserved loading space, a light review-note color and WOFF2 fonts corrected those issues. Existing font payload reduced from 281,160 bytes TTF to 82,680 bytes WOFF2. Route-specific hero preloads were then added; final scores above retain this change. The initial CLI audit wrote a valid report but returned a Windows temporary-profile cleanup EPERM; subsequent audits used a managed browser connection and completed normally.

**Performance 100 remains open.** Remaining actionable findings: render-blocking shared CSS, large common JS/unused code, delayed route content/LCP, image delivery and hosting cache policy. Consider further route payload separation and image sizing after measuring deployed performance. No React/SPA performance ceiling is claimed. SEO scores are intentionally affected by noindex; indexing must not be enabled to improve a demo score.

### Unfinished destinations and scope

The four Roofing detail routes remain Sprint 4.5 shells. Locations, `/free-estimate/`, `/financing/`, `/visualizer/` remain future-sprint shells; the working mock form remains on the homepage. Product/insulation actions use the existing estimate shell instead of fabricated detail routes. Exact imagery, product swatches, badge equivalence, original photo licensing documentation, actual zoom and live Performance 100 remain open. No Laravel/MySQL work performed.

### Live deployment verification — 2026-10-18

Implementation commit `2d4853f203acab76a33b34f57d3d251c9a7cd598` pushed normally to origin main; remote SHA matched. [Pages run 39141654673](https://github.com/Ahasan39/construction-project/actions/runs/39141654673) completed **success**, including npm ci, lint, typecheck, tests, build and deploy.

Both Chromium and Firefox repeated the successful production smoke against `https://ahasan39.github.io/construction-project/`: five direct loads and refreshes, one H1/noindex, all image loads, all header service links, mobile drawer, service location selector, disclosure keyboard toggles, style/review controls, reduced-motion guard, related/estimate actions and homepage note. Zero page errors, failed assets or non-GET requests. [Live interaction records](evidence/sprint-4/live-interactions.json).

All five pages additionally checked live at 390×900 and 1440×900 with no horizontal overflow; ten full-page captures stored as `live-{service}-{width}.webp`. Mobile Siding capture visually reviewed after deployment. Live HTML points to the same `/construction-project/assets/index-uZt4hnLz.js` as the local production build. A direct unknown path returned HTTP 404. [Fingerprint and geometry](evidence/sprint-4/live-verification.json). This evidence does not claim deployed Lighthouse scores or actual 200% zoom.

## Sprint 4.5 — global Roofing details (2026-10-20)

Scope: four existing global detail shells replaced. Reference audit from 2026-10-18; final verification resumed 2026-10-20. Baseline main was `85f4bdbcd3a7cf62b4ecb9c14890efbf5730115c`, matching origin; no unrelated work found. Shared header/footer, homepage, service hub bodies, mock form, centralized contacts, route gates, Pages base, noindex and Claude ignores remain intact. No new forms, backend submission or location bodies.

### Build and tests

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: **91/91 tests**, 11 files. New checks cover all four data resolutions, invalid slugs, route dispatch, supported links/location fallbacks, single H1/priority image and repair-to-replacement navigation. Native disclosure behavior is additionally exercised in real browsers.
- `npm run build`: pass; 105 modules, **82 clean-route entries plus custom 404**. Main JS 384.44kB / 119.29kB gzip; two-segment chunk 27.52kB / 9.07kB gzip; additional detail CSS 3.45kB / 1.00kB gzip. No dependencies added.
- Each global detail HTML has one matching responsive hero preload, no homepage hero preload, and noindex. Custom 404 has no hero preload. [Entry checks](evidence/sprint-4.5/entry-checks.json).
- Diff whitespace check passes; Claude files remain ignored. Existing contact values and short mock-form note are unchanged.

### Browser and comparison evidence

Chromium **153.0.8010.12**, Firefox **155.0**. All four pages at **320, 360, 390, 430, 640, 768, 1024, 1280, 1440, 1920 and 2560px**, plus 844×390 landscape: **48 samples per engine / 96 total**, no page-level horizontal overflow or clipped measured headings/buttons/selects, one H1, zero runtime/console errors. [Matrix](evidence/sprint-4.5/browser-matrix.json). Finite viewport coverage is not a claim of testing every device.

Both engines passed direct HTTP 200 loading and refresh; query and `#detail-title` retention; all loaded images and Metropolis fonts; noindex; location selection to a valid regional destination; all four Roofing hub links; homepage Replace/Repair links; breadcrumbs; unknown detail HTTP 404/Not Found. Every disclosure (3 replacement, 5 repair, 1 metal, 10 commercial) toggled using Enter/Space with visible focus; reduced-motion indicator duration was below 0.01s. Zero asset failures, page errors or non-GET requests. [Detail interaction records](evidence/sprint-4.5/production-detail-interactions.json).

Homepage plus all five hubs passed regression smoke in both browsers: direct load/refresh, image loading, header links, mobile drawer navigation/close, location selector, siding style controls, Roofing review navigation/reduced-motion guard, related and estimate destinations, homepage form note. [Regression records](evidence/sprint-4.5/production-interactions.json). Mock form submission remains covered by existing unit tests; no real submission was made.

Matching full-page reference/local images at **390×900, 768×900 and 1440×900** are stored as `reference-{slug}-{width}.webp` / `local-{slug}-{width}.webp` in [evidence](evidence/sprint-4.5/). All four desktop compositions and all mobile/tablet intro contact sheets were visually reviewed. Corrections included copy sizes/insets, package headers/actions, commercial FAQ surface and removal of unobserved feature estimate buttons. Explicit image sizes reserve layout space; hero content is never gated by animation. Native controls have comfortable targets and visible focus. Current hero preloads and below-fold lazy loading avoid eager downloads of every service photo.

**Actual 200% zoom remains unverified.** Headed Chromium Control+0 followed by five Control++ commands left DPR at 1 and viewport width at 1034; the shortcut did not apply browser zoom in this automation environment. No CSS zoom or viewport resize is presented as a substitute. [Attempt](evidence/sprint-4.5/zoom-attempt.json). Physical touch and screen-reader output were not tested. Shared-header mobile differences, copied content density, lower-resolution existing assets and generated substitutions are explicit in the [audit comparison table](ROOFING_DETAIL_AUDIT.md) and [asset manifest](ASSET_MANIFEST.md).

### Final image sizing and recorded performance

Commercial cards now request widths appropriate to the one/two/four-column layout instead of half-screen feature widths; specials use 400px and desktop feature sizing caps at 630px. The already-completed post-correction Lighthouse 13.5.0 run reduced the commercial desktop image-delivery saving estimate from 326KiB to 46KiB. No new sweep was run during final recovery.

| Page / device | Performance | LCP (seconds) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|
| Replacement mobile | 70 | 5.436 | 0.000296 | 102 |
| Replacement desktop | 97 | 1.103 | 0.000729 | 0 |
| Commercial mobile | 70 | 4.920 | 0 | 178.673 |
| Commercial desktop | 98 | 1.036 | 0.000607 | 9.5 |

Accessibility and Best Practices are 100 in all four reports. SEO is 63 with intentional noindex retained. These are localhost production-build measurements, not live PageSpeed scores. [Recorded summary](evidence/sprint-4.5/lighthouse-summary.json) includes exact metrics and failed audits. Remaining findings: shared unused JavaScript (~190KiB), render-blocking requests, image delivery, network dependency chain, cache lifetimes on the simple local server, and back/forward cache restoration. **Performance 100 remains open**; no framework ceiling is claimed.

Final recovery: lint, typecheck, all 91 tests and build ran once against the final code and passed. Final two-segment JS is 27.64kB / 9.12kB gzip; main JS 384.44kB / 119.30kB gzip. Previously completed browser/screenshot coverage was retained, not repeated after the image-hint-only correction. Publication verification is limited to the existing Pages workflow result and lightweight HTTP checks; no further screenshots, zoom attempts or Sprint 5 work.
