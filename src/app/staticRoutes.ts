import { services } from "../data/services";
import { locations } from "../data/locations";
import { locationServiceAvailability, hasLocationCapability } from "../data/availability";
import { listArticleSummaries } from "../data/articles";

/** Static entry files, not prerendered page content. Match the router's data gates. */
export function staticRoutes(): string[] {
  const routes = new Set([
    "/", "/free-estimate", "/about", "/special-offers", "/financing",
    "/warranties", "/refer-a-friend", "/reviews", "/commercial-projects",
    "/careers/sales", "/privacy-policy", "/billpay", "/visualizer", "/crew", "/blog",
  ]);
  for (const service of services) {
    routes.add(`/${service.slug}`);
    for (const variant of service.variants) routes.add(`/${service.slug}/${variant.slug}`);
  }
  for (const location of locations) {
    routes.add(`/${location.slug}`);
    for (const [capability, path] of [
      ["hasFreeEstimate", "free-estimate"],
      ["hasFinancing", "financing"],
      ["hasServiceAreaIndex", "service-area"],
    ] as const) {
      if (hasLocationCapability(location.slug, capability)) routes.add(`/${location.slug}/${path}`);
    }
    if (hasLocationCapability(location.slug, "hasServiceAreaIndex")) {
      for (const child of location.serviceAreaChildren) routes.add(`/${location.slug}/service-area/${child.slug}`);
    }
    for (const entry of locationServiceAvailability.filter((a) => a.locationSlug === location.slug)) {
      const service = services.find((s) => s.key === entry.serviceKey);
      if (!service) continue;
      routes.add(`/${location.slug}/${service.slug}`);
      for (const variant of service.variants) {
        if (entry.variants?.includes(variant.slug)) routes.add(`/${location.slug}/${service.slug}/${variant.slug}`);
      }
    }
  }
  for (const article of listArticleSummaries()) routes.add(`/blog/${article.slug}`);
  return [...routes].sort();
}
