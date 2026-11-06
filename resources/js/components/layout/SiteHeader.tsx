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
 * Shared public header:
 *
 *   ┌─ Top utility strip (dark navy): Location selector · Phone CTA ───────┐
 *   │ Logo │  Primary nav (Roofing · Gutters · … · About ▾) │ Free Estimate │ ← main row
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 * The phone number is cleanly accessible in the top utility strip, leaving
 * the main navigation row spacious, balanced, and focused on the primary
 * navigation links and prominent Free Estimate CTA.
 */
export function SiteHeader() {
  const activeLocation = useLocationContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const estimateHref =
    activeLocation && hasLocationCapability(activeLocation.slug, "hasFreeEstimate")
      ? `/${activeLocation.slug}/free-estimate`
      : "/free-estimate";

  // Public demo contact is shared across locations; routing remains location-aware.
  const phoneDisplay = brand.phoneDisplay;
  const phoneHref = brand.phoneHref;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-border)]">
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>

      {/* Top utility strip */}
      <div className="bg-[var(--color-brand-primary)] text-white text-sm">
        <Container width="wide">
          <div className="flex items-center justify-between gap-4 min-h-9 sm:min-h-10 py-1 sm:py-1.5">
            <div className="hidden sm:flex items-center shrink-0 text-[13px]">
              <LocationSelector idPrefix="top" inverse />
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
        <div className="flex items-center justify-between gap-6 h-16 sm:h-16 lg:h-18">
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
                height={40}
                width={170}
                style={{ aspectRatio: "180 / 44" }}
                className="h-9 lg:h-10 w-auto max-w-[160px] lg:max-w-[190px] shrink-0 object-contain"
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
          <nav aria-label="Primary" className="hidden xl:block flex-1">
            <ul className="flex items-center justify-center gap-6 xl:gap-8 text-[14px] font-bold tracking-wide uppercase">
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

          {/* Desktop action CTA */}
          <div className="hidden xl:flex items-center shrink-0">
            <Link to={estimateHref}>
              <Button size="md" className="whitespace-nowrap uppercase tracking-wider font-extrabold text-xs lg:text-sm px-6 shadow-sm">
                Free estimate
              </Button>
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            ref={hamburgerRef}
            type="button"
            className="xl:hidden h-11 w-11 inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
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
