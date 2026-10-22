import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";
import { OfferPopup } from "@/components/promo/OfferPopup";

/**
 * Top-level public shell. One `<main>` landmark for the whole app; nav
 * landmarks (primary, mobile primary, footer sections) carry distinct
 * accessible names so screen-reader rotor lists don't collide.
 */
export function AppShell() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <LiveChatWidget />
      <OfferPopup />
    </>
  );
}
