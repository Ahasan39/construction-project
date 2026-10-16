import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * Top-level public shell. One `<main>` landmark for the whole app; nav
 * landmarks (primary, mobile primary, footer sections) carry distinct
 * accessible names so screen-reader rotor lists don't collide.
 */
export function AppShell() {
  return (
    <>
      <aside aria-label="Demo disclosure" className="bg-amber-50 text-slate-900 border-b border-amber-200 px-4 py-3 text-sm text-center">
        <strong>Independent frontend demo — not the official Mr. Roof website.</strong>{" "}
        Estimates are not delivered. No payment, email or SMS integrations. Branding, testimonials and credentials are reference content, not claims about this demo's operator. Please use fictional details when testing.
      </aside>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
