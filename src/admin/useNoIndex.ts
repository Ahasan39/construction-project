import { useEffect } from "react";

/**
 * Admin pages must never be indexed. Injects/updates a <meta name="robots"
 * content="noindex,nofollow"> tag for the duration of the admin section and
 * removes it on unmount. Admin paths are also excluded from staticRoutes(),
 * so no HTML entry exists for crawlers to find to begin with.
 */
export function useNoIndex(pageTitle?: string): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prevTitle = document.title;
    if (pageTitle) document.title = `${pageTitle} · Mr. Roof Admin`;
    const existing = document.querySelector('meta[name="robots"]');
    const created = !existing;
    const meta = existing ?? document.createElement("meta");
    meta.setAttribute("name", "robots");
    const prev = meta.getAttribute("content");
    meta.setAttribute("content", "noindex,nofollow");
    if (created) document.head.appendChild(meta);
    return () => {
      if (created) meta.remove();
      else if (prev) meta.setAttribute("content", prev);
      document.title = prevTitle;
    };
  }, [pageTitle]);
}
