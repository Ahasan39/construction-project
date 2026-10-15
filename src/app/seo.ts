import type { RouteMeta } from "@/types";

/**
 * Canonical origin for the production site. Must be set to the client's real
 * domain before launch; left intentionally empty so links are relative-only
 * until it is known. Mr. Roof's domain is NEVER used as our canonical.
 */
export const CANONICAL_ORIGIN = ""; // e.g. "https://www.client-site.example"

/**
 * Apply route metadata to the document on client transitions. This is a
 * lightweight stand-in until a build-time prerender or framework-level head
 * manager is added. See docs/PROGRESS.md §Prerendering.
 */
export function applyRouteMeta(meta: RouteMeta): void {
  if (typeof document === "undefined") return;

  document.title = meta.title;

  ensureMeta("name", "description", meta.description);

  // Canonical: only emit when a canonical origin is configured.
  const canonicalHref = CANONICAL_ORIGIN
    ? `${CANONICAL_ORIGIN}${meta.canonicalPath}`
    : null;
  ensureLink("canonical", canonicalHref);

  // Robots: honor noindex flag.
  ensureMeta("name", "robots", meta.noindex ? "noindex,nofollow" : "index,follow");
}

function ensureMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function ensureLink(rel: string, href: string | null) {
  const existing = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`
  );
  if (href === null) {
    existing?.remove();
    return;
  }
  if (existing) {
    existing.setAttribute("href", href);
    return;
  }
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  document.head.appendChild(el);
}
