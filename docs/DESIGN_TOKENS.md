# Design Tokens

**Status:** Scaffold only. All numeric values below are **provisional placeholders** until the live reference is measured in a real browser (Sprint 0 follow-up or Sprint 1 start). This file describes the **shape** of the token system we will adopt in Tailwind config and CSS variables; it does **not** yet constitute verified visual parity.

> **Blocker:** This session has no live-browser screenshot or DOM-measurement tool. Fonts, color hex values, exact spacing, container widths, breakpoints, radii, image aspect ratios, and shadow depths must be measured from https://www.mrroof.com/ before Sprint 3 ships homepage visuals.

## 1. Typography (unverified placeholders)

| Token | Placeholder value | Verified? |
|---|---|---|
| `font.sans` | TBD — needs probe of `font-family` on `body` | No |
| `font.display` | TBD — hero/heading face if different from body | No |
| `weight.regular` | 400 | No |
| `weight.medium` | 500 | No |
| `weight.semibold` | 600 | No |
| `weight.bold` | 700 | No |
| `size.h1` | 2.5–3.5rem (clamp) | No |
| `size.h2` | 2–2.5rem | No |
| `size.h3` | 1.5rem | No |
| `size.body` | 1rem | No |
| `size.small` | 0.875rem | No |
| `leading.heading` | 1.1–1.2 | No |
| `leading.body` | 1.5–1.6 | No |

Approach: subset self-hosted fonts (`.woff2`) with `font-display: swap`; preload LCP heading face.

## 2. Color (unverified placeholders)

Mr. Roof's palette appears centered on a dark navy / red brand pairing based on logo cues, but **this must be verified**. Placeholders:

| Token | Placeholder | Role |
|---|---|---|
| `color.brand.primary` | `#0A2A4E` (navy, provisional) | Header strip, headings, buttons |
| `color.brand.accent` | `#C8102E` (red, provisional) | CTA, emphasis, promo band |
| `color.ink` | `#111827` | Body copy |
| `color.ink.muted` | `#4B5563` | Secondary copy |
| `color.surface` | `#FFFFFF` | Page background |
| `color.surface.alt` | `#F5F7FA` | Section alt background |
| `color.border` | `#E5E7EB` | Dividers, card borders |
| `color.success` | `#15803D` | Form success states |
| `color.danger` | `#B91C1C` | Form error states |
| `color.focus` | `#2563EB` | Keyboard focus ring (WCAG) |

Contrast rule: every text/background pair in the implementation must pass WCAG AA (4.5:1 for body, 3:1 for large text).

## 3. Spacing scale

Use Tailwind's default 4px scale. Section vertical rhythm placeholder: `py-16 md:py-20 lg:py-24`. Verify against the reference.

## 4. Container widths (placeholders)

| Token | Placeholder |
|---|---|
| `container.sm` | 640px |
| `container.md` | 768px |
| `container.lg` | 1024px |
| `container.xl` | 1200px (page content) |
| `container.2xl` | 1440px (hero full-bleed) |

## 5. Breakpoints

Verification viewports (per spec): 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920. Tailwind defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`) are the starting point; adjust after live measurement.

## 6. Radii

| Token | Placeholder |
|---|---|
| `radius.sm` | 4px |
| `radius.md` | 8px |
| `radius.lg` | 12px |
| `radius.pill` | 9999px |

## 7. Elevation / shadows

| Token | Placeholder |
|---|---|
| `shadow.card` | `0 1px 2px rgb(0 0 0 / 0.06), 0 4px 12px rgb(0 0 0 / 0.08)` |
| `shadow.sticky` | `0 2px 8px rgb(0 0 0 / 0.08)` |

## 8. Image aspect ratios (placeholders)

| Usage | Placeholder |
|---|---|
| Hero (desktop) | 16:9 or 21:9 — unverified |
| Service card | 4:3 — unverified |
| Blog thumbnail | 3:2 — unverified |
| Testimonial avatar | 1:1 |

All content images will be served responsive AVIF/WebP + fallback, with explicit `width`/`height` to prevent CLS.

## 9. Motion

- Default transition: `150–200ms ease-out` for hover/focus; `250–300ms` for menu/accordion open.
- Respect `prefers-reduced-motion`.

## 10. Sprint 1 implementation

Tokens are declared as CSS custom properties in [`src/styles/globals.css`](../src/styles/globals.css) inside a `@theme { … }` block, picked up by Tailwind v4's `@import "tailwindcss";`. Components reference them via `var(--token)` for color / radius / shadow, or Tailwind utilities for spacing and layout. **Every value remains provisional**; nothing in that CSS file has been promoted from "placeholder" to "verified reference measurement."

Breakpoints currently use Tailwind defaults (sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536). The 9 verification viewports (320/360/390/430/768/1024/1280/1440/1920) are a QA responsibility; adjust the Tailwind `screens` theme after live measurement if a reference breakpoint falls between defaults.

## 11. Shared-layout interaction choices (Sprint 2 → 2.5)

All **provisional** until the live reference is verified. Values informed by the user-supplied screenshots; exact pixels not measured.

- **Header** — Two-row header: dark-navy top strip (`h-9`) + white main row (`h-20 lg:h-24`). Sticky at the top of the viewport.
- **Logo** — Rendered as a two-color wordmark (`accent` red for the first word, `brand-primary` navy for the rest) until `brand.logoSrc` is populated, at which point an `<img>` is used instead.
- **Phone CTA** — Dual-placed: short "Call …" chip in the top strip; large bold accent-red display in the main row.
- **Free Estimate CTA** — `Button size="lg"` in the main row and in the mobile drawer footer.
- **About dropdown** — Disclosure pattern. Opens on click; closes on outside pointerdown, Escape, or item activation. `aria-expanded` + `aria-controls`; no `aria-haspopup` (the popup is a plain link list, not an ARIA menu).
- **Hamburger** — Appears below Tailwind `lg` (1024px).
- **Mobile nav** — Modal drawer from the right edge. Focus moved in on open; focus trapped on Tab/Shift-Tab; body-scroll locked; `<main>` and `<footer>` set `inert` + `aria-hidden`; backdrop, Escape, close-button and route-change all dismiss; auto-dismiss when viewport reaches `(min-width: 1024px)`.
- **Footer** — Dark-navy palette (`--color-brand-primary`), white text. Grid at `lg`: brand/CTA block (1.4fr) + 4 column groups (Services, Service Areas, Company, Recent Posts). Stacks on narrower widths.
- **Location picker** — Native `<select>`. No geolocation prompt. No persisted selection. URL is the source of truth.

## 12. Sprint 3 homepage decisions (provisional)

Choices made for the homepage body in the absence of live-browser verification:

- Hero: 2-column at `lg` (headline + photo left, dark-navy lead-form card right); 1-column stack below. Form card is `lg:sticky lg:top-28` so it stays visible as the user reads the hero.
- Service cards: `sm:grid-cols-2`. Reference shows four cards; our implementation preserves that count without inferring a 4-across row.
- Reviews: static 3-up grid at `md`, 1-up below. Carousel not implemented until confirmed.
- Awards: 2 → 3 → 5 columns across `sm` / `lg`. Badge content blocked by assets.
- EstimateForm variants: `default` for the standalone estimate page, `inverse` for the dark hero card.
- Phone / email / privacy wording in the form matches the reference's observed copy; specific demo notice ("Demo form — submissions are not delivered.") is clearly marked.

## 13. Follow-up actions before Sprint 4

1. Open mrroof.com in a browser and read computed styles for header, hero headings, body paragraphs, buttons, section backgrounds, and promo band.
2. Capture exact hex of brand primary and accent from the logo mark and the "0% Interest" red strip.
3. Measure container max-widths and section vertical padding at 1440 and 1920 viewports.
4. Record breakpoints at which the header collapses to the hamburger and at which the service card grid rewraps.
5. Update this file; mark each row Verified or Replaced-with-measured-value.
