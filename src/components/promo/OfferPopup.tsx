import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

const DISMISS_KEY = "offerPopup:dismissed";
const DEFAULT_DELAY_MS = 6000;

/**
 * Safe `sessionStorage` reader/writer. Private-mode browsers can throw on
 * access, so every call is wrapped. Returns `false` on failure rather than
 * fabricating a dismissed state.
 */
function isDismissedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // Silent — users in private mode simply see the popup once per load.
  }
}

export interface OfferPopupProps {
  /** Delay before the first display attempt. Default 6000 ms. */
  delayMs?: number;
}

/**
 * Site-wide promotional popup — honest placeholder content.
 *
 * No specific discount, dollar amount, promo code or expiry date is quoted;
 * the primary CTA routes to the existing `/special-offers/` page (which is
 * itself labelled as containing non-active demo placeholders in Sprint 6.5).
 *
 * Behavior:
 * - Delayed display (default 6s after mount).
 * - Shown at most once per browser *session* (sessionStorage, with try/catch).
 * - Escape or the explicit "No thanks" / close buttons dismiss it for the session.
 * - Dialog semantics: role=dialog, aria-modal, labelledby, describedby.
 * - Focus moves to the primary CTA on open; prior active element restored on close.
 * - Reduced-motion handled via `motion-safe:` guards.
 * - Mounted alongside the Live Chat widget (bottom-right, z-50). This popup
 *   centers over the page at z-60, so the chat launcher stays visible beneath
 *   the backdrop and is not covered when the popup is dismissed.
 */
export function OfferPopup({ delayMs = DEFAULT_DELAY_MS }: OfferPopupProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();
  const primaryRef = useRef<HTMLAnchorElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Schedule the first display. Respect prior session dismissal.
  useEffect(() => {
    if (isDismissedThisSession()) return;
    const timer = window.setTimeout(() => {
      if (!isDismissedThisSession()) setOpen(true);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  // Escape closes; focus containment and body scroll-lock while open.
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement;

    // Scroll-lock the underlying page while the modal is open so the
    // backdrop click target stays stable and the page beneath does not
    // scroll under keyboard navigation.
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;
      // Contain Tab inside the dialog by enumerating every focusable
      // descendant and wrapping at the boundaries.
      const container = dialogRef.current;
      if (!container) return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!e.shiftKey && (active === last || !container.contains(active))) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || !container.contains(active))) {
        e.preventDefault();
        last.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    primaryRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  function dismiss() {
    markDismissed();
    setOpen(false);
    const prev = previousFocusRef.current;
    if (prev && prev instanceof HTMLElement) {
      prev.focus({ preventScroll: true });
    }
  }

  if (!open) return null;

  return (
    <div
      // Backdrop. Clicking the backdrop also dismisses.
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 motion-safe:animate-[fadeIn_140ms_ease-out] px-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-[min(28rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_30px_60px_-20px_rgba(15,34,49,0.45)] ring-1 ring-black/5 overflow-hidden motion-safe:animate-[fadeInUp_180ms_ease-out]"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={dismiss}
          aria-label="Close promotional popup"
          className="absolute top-2 right-2 h-9 w-9 inline-flex items-center justify-center rounded-[var(--radius-md)] text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] transition-colors"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="bg-[var(--color-brand-primary)] px-6 py-5 text-white">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-blue)]">
            Special offers
          </span>
          <h2
            id={titleId}
            className="mt-2 text-xl sm:text-2xl font-black tracking-tight leading-tight"
          >
            Explore our roofing offers
          </h2>
        </div>

        <div className="px-6 py-5">
          <p id={descId} className="text-sm text-[var(--color-ink)] leading-relaxed">
            Contact our team to learn which offers may be available for your
            project. Available promotions can vary by service, season, and
            location.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckDot />
              <span>Roofing, siding, windows, gutters, and masonry.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckDot />
              <span>Request a free written estimate at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckDot />
              <span>We won't show this again during your visit.</span>
            </li>
          </ul>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:items-center">
            <Link
              ref={primaryRef}
              to="/special-offers"
              onClick={dismiss}
              className="inline-flex items-center justify-center h-11 rounded-[var(--radius-md)] bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-600)] text-white text-xs font-extrabold uppercase tracking-wider px-6 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] transition-colors"
            >
              Explore offers
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center justify-center h-11 rounded-[var(--radius-md)] bg-transparent text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider px-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckDot() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
