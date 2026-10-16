import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { primaryNav } from "@/data/navigation";
import { brand } from "@/data/brand";
import { hasLocationCapability } from "@/data/availability";
import {
  Button,
  Container,
  Dropdown,
  SmartLink,
} from "@/components/ui";
import { useLocationContext } from "@/features/location-context/useLocationContext";
import { LocationSelector } from "./LocationSelector";
import { MobileNav } from "./MobileNav";

const topLevelItems = primaryNav.filter((i) => !i.children);
const aboutItem = primaryNav.find((i) => i.children);

/**
 * Shared public header, informed by the supplied reference screenshot:
 *
 *   ┌─ Top strip (dark navy, h-9): Location selector · phone CTA ────────┐
 *   │ Logo │  Primary nav · About ▾         │ Phone │ Free Estimate (lg) │ ← main row
 *   └────────────────────────────────────────────────────────────────────┘
 *
 * The main row is intentionally taller than Sprint 2's generic 56px — the
 * reference emphasizes the phone and estimate CTA at hero-adjacent size.
 * Exact px numbers remain provisional until live measurement.
 */
export function SiteHeader() {
  const activeLocation = useLocationContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const estimateHref =
    activeLocation && hasLocationCapability(activeLocation.slug, "hasFreeEstimate")
      ? `/${activeLocation.slug}/free-estimate`
      : "/free-estimate";

  const localPhone =
    activeLocation?.phoneDisplay && activeLocation?.phoneHref
      ? { display: activeLocation.phoneDisplay, href: activeLocation.phoneHref }
      : null;

  const phoneDisplay = localPhone?.display ?? brand.phoneDisplay;
  const phoneHref = localPhone?.href ?? brand.phoneHref;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-border)]">
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>

      {/* Top utility strip */}
      <div className="bg-[var(--color-brand-primary)] text-white text-sm">
        <Container width="wide">
          <div className="flex items-center justify-between h-9">
            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <LocationSelector idPrefix="top" />
            </div>
            <SmartLink
              to={phoneHref}
              external
              className="ml-auto inline-flex items-center gap-2 text-[13px] font-medium hover:underline"
            >
              <span aria-hidden="true">📞</span>
              <span>Call {phoneDisplay}</span>
            </SmartLink>
          </div>
        </Container>
      </div>

      {/* Main row */}
      <Container width="wide">
        <div className="flex items-center justify-between gap-6 h-20 lg:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 inline-flex items-center gap-2"
            aria-label={`${brand.companyName} — Home`}
          >
            {brand.logoSrc ? (
              <img
                src={brand.logoSrc}
                alt={`${brand.companyName} Logo`}
                height={44}
                width={180}
                style={{ aspectRatio: "180 / 44" }}
                className="h-10 lg:h-11 w-auto max-w-[180px] lg:max-w-[210px] shrink-0 object-contain"
              />
            ) : (
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-[var(--color-brand-accent)]">
                  {brand.companyName.split(" ")[0]}
                </span>
                <span className="text-[var(--color-brand-primary)]">
                  {brand.companyName.split(" ").slice(1).join(" ")
                    ? " " + brand.companyName.split(" ").slice(1).join(" ")
                    : ""}
                </span>
              </span>
            )}
          </Link>

          {/* Desktop primary nav */}
          <nav aria-label="Primary" className="hidden lg:block flex-1">
            <ul className="flex items-center justify-center gap-7 text-[14px] font-bold tracking-wide uppercase">
              {topLevelItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="py-2 text-[var(--color-ink)] hover:text-[var(--color-brand-accent)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {aboutItem && (
                <li>
                  <Dropdown
                    label={
                      <span className="inline-flex items-center gap-1">
                        {aboutItem.label}
                        <span aria-hidden="true" className="text-xs">▾</span>
                      </span>
                    }
                    panelLabel={`${aboutItem.label} menu`}
                    triggerClassName="py-2 inline-flex items-center font-bold tracking-wide uppercase text-[14px] text-[var(--color-ink)] hover:text-[var(--color-brand-accent)] transition-colors"
                    align="right"
                  >
                    {({ close }) => (
                      <ul className="flex flex-col min-w-56 text-sm font-semibold normal-case">
                        {aboutItem.children!.map((child) => (
                          <li key={child.to}>
                            {child.external ? (
                              <SmartLink
                                to={child.to}
                                external
                                className="block px-3 py-2 text-sm rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)]"
                                onClick={close}
                              >
                                {child.label}
                              </SmartLink>
                            ) : (
                              <Link
                                to={child.to}
                                className="block px-3 py-2 text-sm rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)]"
                                onClick={close}
                              >
                                {child.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Dropdown>
                </li>
              )}
            </ul>
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <SmartLink
              to={phoneHref}
              external
              className="text-xl font-black text-[var(--color-brand-primary)] whitespace-nowrap hover:text-[var(--color-brand-accent)] transition-colors"
            >
              {phoneDisplay}
            </SmartLink>
            <Link to={estimateHref}>
              <Button size="lg" className="whitespace-nowrap uppercase tracking-wider font-extrabold text-sm px-6">
                Free estimate
              </Button>
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            ref={hamburgerRef}
            type="button"
            className="lg:hidden h-11 w-11 inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(true)}
          >
            <span aria-hidden="true" className="text-xl leading-none">☰</span>
          </button>
        </div>
      </Container>

      <div id="mobile-nav">
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          returnFocusRef={hamburgerRef}
          estimateHref={estimateHref}
          localPhone={{ display: phoneDisplay, href: phoneHref }}
        />
      </div>
    </header>
  );
}
