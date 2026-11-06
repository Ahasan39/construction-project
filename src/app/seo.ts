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

  const fullTitle = `${meta.title} | Frontend demo`;
  document.title = fullTitle;

  ensureMeta("name", "description", meta.description);

  // Canonical: only emit when a canonical origin is configured.
  const canonicalHref = CANONICAL_ORIGIN
    ? `${CANONICAL_ORIGIN}${meta.canonicalPath}`
    : null;
  ensureLink("canonical", canonicalHref);

  // Every route belongs to a public demo, including client-side transitions.
  ensureMeta("name", "robots", "noindex,nofollow");

  // Open Graph
  ensureMeta("property", "og:title", fullTitle);
  ensureMeta("property", "og:description", meta.description);
  ensureMeta(
    "property",
    "og:type",
    meta.ogType ??
      (meta.canonicalPath.startsWith("/blog/") &&
      meta.canonicalPath !== "/blog/"
        ? "article"
        : "website")
  );
  ensureMeta(
    "property",
    "og:url",
    `https://ahasan39.github.io/construction-project${meta.canonicalPath === "/" ? "" : meta.canonicalPath}`
  );
  const ogImage =
    meta.ogImage ??
    "/construction-project/images/homepage/hero-suburban-home.webp";
  ensureMeta(
    "property",
    "og:image",
    ogImage.startsWith("http")
      ? ogImage
      : `https://ahasan39.github.io${ogImage}`
  );

  // Twitter Card
  ensureMeta("name", "twitter:card", "summary_large_image");
  ensureMeta("name", "twitter:title", fullTitle);
  ensureMeta("name", "twitter:description", meta.description);
  ensureMeta(
    "name",
    "twitter:image",
    ogImage.startsWith("http")
      ? ogImage
      : `https://ahasan39.github.io${ogImage}`
  );

  // Structured Data (JSON-LD)
  ensureJsonLd(meta.jsonLd);
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

function ensureJsonLd(
  data: Record<string, unknown> | Array<Record<string, unknown>> | undefined
) {
  const existing = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  );
  if (!data) {
    existing?.remove();
    return;
  }
  const content = JSON.stringify(data);
  if (existing) {
    existing.textContent = content;
    return;
  }
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.textContent = content;
  document.head.appendChild(el);
}
