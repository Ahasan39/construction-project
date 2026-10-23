import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminStoreProvider, useAdminStore } from "./store";
import { useNoIndex } from "./useNoIndex";

function ToastHost() {
  const { toasts, dismissToast } = useAdminStore();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex min-w-[280px] max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            t.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : t.tone === "error"
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-sky-200 bg-sky-50 text-sky-900"
          }`}
        >
          <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          <p className="flex-1">{t.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
            className="text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

function LayoutInner() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  useNoIndex();

  /** Close the drawer whenever the route changes. */
  useEffect(() => { setNavOpen(false); }, [pathname]);

  /** Body scroll lock while the mobile drawer is open. Mobile-only lanes:
   *  Tailwind's `lg:` breakpoint is 1024px — above that the sidebar is
   *  persistent and the lock would be a layout bug. */
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!navOpen) return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(min-width: 1024px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [navOpen]);

  /** Escape closes the drawer and restores focus to the trigger. */
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        document.getElementById("admin-nav-trigger")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <div className="admin-root min-h-screen bg-[var(--admin-bg,theme(colors.slate.50))] font-sans text-slate-800">
      <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onOpenNav={() => setNavOpen(true)} navOpen={navOpen} />
        <main
          id="admin-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8"
        >
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}

export function AdminLayout() {
  return (
    <AdminStoreProvider>
      <LayoutInner />
    </AdminStoreProvider>
  );
}

export default AdminLayout;
