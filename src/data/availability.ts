import type {
  LocationServiceAvailability,
  ServiceKey,
  Slug,
} from "@/types";

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
  { locationSlug: "nashville", serviceKey: "insulation" },

  // Dayton — commercial roofing + estimate observed.
  {
    locationSlug: "dayton",
    serviceKey: "roofing",
    variants: ["commercial-roofing"],
    hasFreeEstimate: true,
  },

  // Cincinnati — commercial roofing + estimate + financing.
  {
    locationSlug: "cincinnati",
    serviceKey: "roofing",
    variants: ["commercial-roofing"],
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },

  // Louisville — estimate + financing observed.
  {
    locationSlug: "louisville",
    serviceKey: "roofing",
    hasFreeEstimate: true,
    hasFinancing: true,
  },

  // Cleveland — estimate + financing + service-area index observed.
  {
    locationSlug: "cleveland",
    serviceKey: "roofing",
    hasFreeEstimate: true,
    hasFinancing: true,
    hasServiceAreaIndex: true,
  },

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

  // Ann Arbor — service-area index only.
  {
    locationSlug: "ann-arbor",
    serviceKey: "roofing",
    hasServiceAreaIndex: true,
  },

  // Lansing — service-area index only.
  {
    locationSlug: "lansing",
    serviceKey: "roofing",
    hasServiceAreaIndex: true,
  },

  // Lexington, Detroit — hub only (no additional location-scoped pages).
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
  capability: "hasFreeEstimate" | "hasFinancing" | "hasServiceAreaIndex"
): boolean {
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
