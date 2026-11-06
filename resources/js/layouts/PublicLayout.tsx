import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, MemoryRouter, useInRouterContext, useLocation } from "react-router-dom";
import { router as inertiaRouter } from "@inertiajs/react";
import { AppShell } from "@/components/layout/AppShell";

function NavigationSync() {
  const location = useLocation();
  const [initialPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname + window.location.search : ""
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const current = location.pathname + location.search;
    if (current && current !== initialPath) {
      inertiaRouter.visit(current, { preserveScroll: false });
    }
  }, [location.pathname, location.search, mounted, initialPath]);

  return null;
}

function PublicShellInner({ children }: { children?: ReactNode }) {
  return (
    <>
      <NavigationSync />
      <AppShell>{children}</AppShell>
    </>
  );
}

export function PublicLayout({ children }: { children?: ReactNode }) {
  const inRouter = useInRouterContext();

  if (inRouter) {
    return <PublicShellInner>{children}</PublicShellInner>;
  }

  if (typeof window === "undefined") {
    return (
      <MemoryRouter>
        <PublicShellInner>{children}</PublicShellInner>
      </MemoryRouter>
    );
  }

  return (
    <BrowserRouter>
      <PublicShellInner>{children}</PublicShellInner>
    </BrowserRouter>
  );
}

export default PublicLayout;
