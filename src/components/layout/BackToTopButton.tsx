import { useEffect, useState } from "react";

const SHOW_THRESHOLD_PX = 400;

/**
 * Floating "Back to top" control.
 *
 * - Appears after the viewport scrolls past ~400 px, hides when near the top.
 * - Smooth scroll under `prefers-reduced-motion: no-preference`; instant
 *   `behavior: "auto"` jump when the user has requested reduced motion.
 * - Stacked above the Live Chat launcher at the same right edge so the two
 *   floating controls don't overlap. Both share `z-50`, so the Offer Popup
 *   backdrop (`z-[60]`) continues to cover both while it's open.
 * - Passive scroll listener; cleanup on unmount; no polling, no RAF.
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  function handleClick() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 sm:right-6 bottom-[88px] sm:bottom-[96px] z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white shadow-[0_10px_20px_-10px_rgba(15,34,49,0.5),0_4px_8px_-4px_rgba(15,34,49,0.2)] ring-1 ring-black/5 hover:bg-[var(--color-brand-primary-600)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] motion-safe:transition-[opacity,transform,background-color] motion-safe:duration-200 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          d="M12 19V5M6 11l6-6 6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
