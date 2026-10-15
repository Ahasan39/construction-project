import { useEffect, useId, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { primaryNav } from "@/data/navigation";
import { brand } from "@/data/brand";
import { Button, SmartLink } from "@/components/ui";
import { LocationSelector } from "./LocationSelector";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  /** The element to return focus to after close. */
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
  /** Resolved estimate URL for this header context. */
  estimateHref: string;
  /** Phone to show in the drawer (local override already applied). */
  localPhone: { display: string; href: string };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled])';

/**
 * Modal drawer. Pattern: `role="dialog"` + `aria-modal="true"`, focus moved
 * on open, focus trapped while open, background scroll locked, Escape and
 * backdrop click close it, focus is restored to the trigger on close.
 *
 * Automatically closes on route change (via useLocation).
 */
export function MobileNav({
  open,
  onClose,
  returnFocusRef,
  estimateHref,
  localPhone,
}: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const location = useLocation();
  const openedAtRef = useRef<string | null>(null);

  // Close on route change (ignore the pathname captured at open time).
  useEffect(() => {
    if (!open) {
      openedAtRef.current = null;
      return;
    }
    if (openedAtRef.current === null) {
      openedAtRef.current = location.pathname;
      return;
    }
    if (openedAtRef.current !== location.pathname) {
      onClose();
    }
  }, [open, location.pathname, onClose]);

  // Focus trap, Escape, scroll lock, background inertness, breakpoint cleanup.
  useEffect(() => {
    if (!open) return;

    // Snapshot the trigger element at open-time so the cleanup restores focus
    // to the node that actually opened the drawer, even if the ref later
    // repoints (e.g. during HMR or re-renders).
    const triggerAtOpen = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Make background content inert while the drawer is modal. We inert the
    // document's <main> and <footer> landmarks. The focus trap below keeps
    // keyboard focus inside the dialog, so the header (which hosts the drawer
    // itself) stays operable for the close button.
    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer")
    );
    for (const el of inertTargets) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    }

    // Auto-close when the viewport grows past the hamburger breakpoint
    // (Tailwind `lg` = 1024). Keeps the drawer and the desktop nav from both
    // claiming the viewport if the user rotates / resizes a tablet.
    const mql = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent | MediaQueryList) => {
      if ("matches" in e && e.matches) onClose();
    };
    if (mql.matches) {
      // Already at desktop by the time the drawer opened — close immediately.
      onClose();
    }
    mql.addEventListener("change", onBreakpoint);

    // Move focus into the panel.
    const panel = panelRef.current;
    const firstFocusable =
      panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
    firstFocusable?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const nodes = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((n) => !n.hasAttribute("disabled"));
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = previousOverflow;
      for (const el of inertTargets) {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
      triggerAtOpen?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-50 w-[min(100vw,22rem)] bg-white shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 h-14">
          <h2 id={titleId} className="font-semibold text-sm">
            {brand.companyName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="h-9 w-9 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-alt)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </button>
        </div>

        <nav
          aria-label="Mobile primary"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.to}>
                {item.external ? (
                  <SmartLink to={item.to} external className="block py-2">
                    {item.label}
                  </SmartLink>
                ) : (
                  <Link to={item.to} className="block py-2">
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <ul className="ml-4 border-l border-[var(--color-border)] pl-3">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        {child.external ? (
                          <SmartLink
                            to={child.to}
                            external
                            className="block py-1.5 text-sm"
                          >
                            {child.label}
                          </SmartLink>
                        ) : (
                          <Link
                            to={child.to}
                            className="block py-1.5 text-sm"
                          >
                            {child.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <LocationSelector idPrefix="mobile" />
          </div>
        </nav>

        <div className="border-t border-[var(--color-border)] p-4 flex flex-col gap-2">
          <SmartLink
            to={localPhone.href}
            external
            className="block text-center font-semibold text-[var(--color-brand-accent)] underline"
          >
            Call {localPhone.display}
          </SmartLink>
          <Link to={estimateHref} onClick={onClose} className="block">
            <Button className="w-full">Free estimate</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
