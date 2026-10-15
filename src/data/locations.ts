import type { Location } from "@/types";

/**
 * Locations. Slugs and city names mirror those discovered on the reference
 * site; see docs/ROUTE_INVENTORY.md §2–§3. Service-area children are a
 * REPRESENTATIVE SAMPLE for template verification — the full enumeration is
 * deferred until data is handed over by the backend / content phase.
 */
export const locations: Location[] = [
  {
    slug: "ann-arbor",
    city: "Ann Arbor",
    state: "MI",
    region: "south-east-michigan",
    serviceAreaChildren: [
      { slug: "toledo", name: "Toledo" },
      { slug: "oakland-county", name: "Oakland County" },
      { slug: "wayne-county", name: "Wayne County" },
    ],
  },
  {
    slug: "grand-rapids",
    city: "Grand Rapids",
    state: "MI",
    region: "grand-rapids-area",
    serviceAreaChildren: [
      { slug: "zeeland", name: "Zeeland" },
      { slug: "holland", name: "Holland" },
      { slug: "kalamazoo", name: "Kalamazoo" },
    ],
  },
  {
    slug: "cleveland",
    city: "Cleveland",
    state: "OH",
    region: "cleveland-area",
    serviceAreaChildren: [
      { slug: "ashland", name: "Ashland" },
      { slug: "mansfield", name: "Mansfield" },
    ],
  },
  {
    slug: "cincinnati",
    city: "Cincinnati",
    state: "OH",
    region: "cincinnati-area",
    serviceAreaChildren: [{ slug: "lebanon", name: "Lebanon" }],
  },
  {
    slug: "dayton",
    city: "Dayton",
    state: "OH",
    region: "dayton-area",
    serviceAreaChildren: [
      { slug: "montgomery-county", name: "Montgomery County" },
      { slug: "clark-county", name: "Clark County" },
    ],
  },
  {
    slug: "lexington",
    city: "Lexington",
    state: "KY",
    region: "lexington-area",
    serviceAreaChildren: [],
  },
  {
    slug: "louisville",
    city: "Louisville",
    state: "KY",
    region: "louisville-area",
    serviceAreaChildren: [
      { slug: "jeffersonville", name: "Jeffersonville" },
      { slug: "frankfort", name: "Frankfort" },
      { slug: "elizabethtown", name: "Elizabethtown" },
    ],
  },
  {
    slug: "nashville",
    city: "Nashville",
    state: "TN",
    region: "nashville-area",
    serviceAreaChildren: [
      { slug: "franklin", name: "Franklin" },
      { slug: "murfreesboro", name: "Murfreesboro" },
      { slug: "brentwood", name: "Brentwood" },
    ],
  },
  {
    slug: "detroit",
    city: "Detroit",
    state: "MI",
    region: "south-east-michigan",
    serviceAreaChildren: [],
  },
  {
    slug: "lansing",
    city: "Lansing",
    state: "MI",
    region: "lansing-area",
    serviceAreaChildren: [
      { slug: "haslett", name: "Haslett" },
      { slug: "okemos", name: "Okemos" },
      { slug: "east-lansing", name: "East Lansing" },
    ],
  },
];

export function findLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
