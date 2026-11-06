import type {
  LocationServiceAvailability,
  ServiceKey,
  Slug,
} from "@/types";

export type LocationCapability =
  | "hasFreeEstimate"
  | "hasFinancing"
  | "hasServiceAreaIndex";

/**
 * Location-level capability flags for routes such as /:locationSlug/free-estimate/,
 * /:locationSlug/financing/, and /:locationSlug/service-area/. Keeping this
 * decoupled from `locationServiceAvailability` allows hubs like Ann Arbor to
 * expose `/ann-arbor/service-area/` without mounting an unintended
 * `/ann-arbor/roofing/` scaffold.
 */
const locationCapabilities: Partial<
  Record<Slug, Partial<Record<LocationCapability, boolean>>>
> = {
  nashville: {
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  dayton: {
    hasFreeEstimate: true,
  },
  cincinnati: {
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  louisville: {
    hasFreeEstimate: true,
    hasFinancing: true,
  },
  cleveland: {
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  "grand-rapids": {
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  "ann-arbor": {
    hasServiceAreaIndex: true,
  },
  lansing: {
    hasServiceAreaIndex: true,
  },
};

/**
 * Explicit (location × service) availability, mirroring the subset of pages
 * observed on the reference site. The reference does NOT publish every
 * combination; see docs/ROUTE_INVENTORY.md §2.
 *
 * Treat this as the single source of truth for route generation and link
 * rendering. Combinations not present here must resolve to Not Found.
 */
export const locationServiceAvailability: LocationServiceAvailability[] = [
  // Nashville — richest coverage on the reference.
  {
    locationSlug: "nashville",
    serviceKey: "roofing",
    variants: ["commercial-roofing"],
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  { locationSlug: "nashville", serviceKey: "siding" },
  { locationSlug: "nashville", serviceKey: "windows" },
  { locationSlug: "nashville", serviceKey: "gutters" },
  { locationSlug: "nashville", serviceKey: "masonry" },

  // Dayton — commercial roofing + estimate observed; also four scoped
  // service hubs linked from the reference Dayton homepage (verified
  // 2026-10-20). Masonry and Insulation tiles on the reference Dayton page
  // link to the GLOBAL /masonry/ route, so they are intentionally absent here.
  {
    locationSlug: "dayton",
    serviceKey: "roofing",
    variants: ["commercial-roofing"],
    hasFreeEstimate: true,
  },
  { locationSlug: "dayton", serviceKey: "siding" },
  { locationSlug: "dayton", serviceKey: "windows" },
  { locationSlug: "dayton", serviceKey: "gutters" },

  // Cincinnati — commercial roofing + estimate + financing + service-area
  // index. The reference Cincinnati homepage also links scoped service hubs
  // for siding, windows, gutters and masonry (verified 2026-10-20).
  {
    locationSlug: "cincinnati",
    serviceKey: "roofing",
    variants: ["commercial-roofing"],
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  { locationSlug: "cincinnati", serviceKey: "siding" },
  { locationSlug: "cincinnati", serviceKey: "windows" },
  { locationSlug: "cincinnati", serviceKey: "gutters" },
  { locationSlug: "cincinnati", serviceKey: "masonry" },

  // Louisville — estimate + financing observed, plus five scoped service
  // hubs linked from the reference Louisville homepage (verified 2026-10-20).
  {
    locationSlug: "louisville",
    serviceKey: "roofing",
    hasFreeEstimate: true,
    hasFinancing: true,
  },
  { locationSlug: "louisville", serviceKey: "siding" },
  { locationSlug: "louisville", serviceKey: "windows" },
  { locationSlug: "louisville", serviceKey: "gutters" },
  { locationSlug: "louisville", serviceKey: "masonry" },

  // Cleveland — estimate + financing + service-area index observed on the
  // reference roofing hub, plus the four scoped service hubs linked from the
  // reference Cleveland homepage (verified 2026-10-20). Masonry tile on the
  // reference Cleveland page links to the GLOBAL /masonry/ route, not a
  // scoped Cleveland URL, so it is intentionally absent here.
  {
    locationSlug: "cleveland",
    serviceKey: "roofing",
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  { locationSlug: "cleveland", serviceKey: "siding" },
  { locationSlug: "cleveland", serviceKey: "windows" },
  { locationSlug: "cleveland", serviceKey: "gutters" },

  // Grand Rapids — financing + service-area index, plus the five scoped
  // service hubs linked from the reference Grand Rapids homepage
  // (verified 2026-10-20).
  {
    locationSlug: "grand-rapids",
    serviceKey: "roofing",
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },
  { locationSlug: "grand-rapids", serviceKey: "siding" },
  { locationSlug: "grand-rapids", serviceKey: "windows" },
  { locationSlug: "grand-rapids", serviceKey: "gutters" },
  { locationSlug: "grand-rapids", serviceKey: "masonry" },

  // Ann Arbor — no scoped local service sub-routes on the reference site;
  // all service tiles route to the global service hubs while
  // `/ann-arbor/service-area/` is enabled via `locationCapabilities`.

  // Lansing — service-area index on roofing, plus five scoped service hubs
  // linked from the reference Lansing header navigation (verified
  // 2026-10-21).
  {
    locationSlug: "lansing",
    serviceKey: "roofing",
    hasServiceAreaIndex: true,
  },
  { locationSlug: "lansing", serviceKey: "siding" },
  { locationSlug: "lansing", serviceKey: "windows" },
  { locationSlug: "lansing", serviceKey: "gutters" },
  { locationSlug: "lansing", serviceKey: "masonry" },

  // Lexington — five scoped ServiceHubKey routes.
  { locationSlug: "lexington", serviceKey: "roofing" },
  { locationSlug: "lexington", serviceKey: "siding" },
  { locationSlug: "lexington", serviceKey: "windows" },
  { locationSlug: "lexington", serviceKey: "gutters" },
  { locationSlug: "lexington", serviceKey: "masonry" },

  // Detroit — five scoped ServiceHubKey routes.
  { locationSlug: "detroit", serviceKey: "roofing" },
  { locationSlug: "detroit", serviceKey: "siding" },
  { locationSlug: "detroit", serviceKey: "windows" },
  { locationSlug: "detroit", serviceKey: "gutters" },
  { locationSlug: "detroit", serviceKey: "masonry" },
];

export function isLocationServiceAvailable(
  locationSlug: Slug,
  serviceKey: ServiceKey
): boolean {
  return locationServiceAvailability.some(
    (a) => a.locationSlug === locationSlug && a.serviceKey === serviceKey
  );
}

export function getLocationServiceAvailability(
  locationSlug: Slug,
  serviceKey: ServiceKey
): LocationServiceAvailability | undefined {
  return locationServiceAvailability.find(
    (a) => a.locationSlug === locationSlug && a.serviceKey === serviceKey
  );
}

export function hasLocationCapability(
  locationSlug: Slug,
  capability: LocationCapability
): boolean {
  if (locationCapabilities[locationSlug]?.[capability] === true) {
    return true;
  }
  return locationServiceAvailability.some(
    (a) => a.locationSlug === locationSlug && a[capability] === true
  );
}

export function hasVariantForLocationService(
  locationSlug: Slug,
  serviceKey: ServiceKey,
  variantSlug: Slug
): boolean {
  const entry = getLocationServiceAvailability(locationSlug, serviceKey);
  return !!entry?.variants?.includes(variantSlug);
}
