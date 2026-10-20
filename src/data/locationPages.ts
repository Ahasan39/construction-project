import type { ServiceAreaRegionKey, ServiceKey, Slug } from "@/types";

/**
 * Typed content for a completed location hub. Only locations with an entry
 * here render the full landing page composition; the rest keep the existing
 * scaffold. Section-level opt-outs preserve meaningful reference differences
 * (e.g. Ann Arbor has an extra "As Seen On" strip; Nashville does not).
 */

export interface LocationCta { label: string; to: string }
export interface LocationBullet { title?: string; body: string }
export interface LocationReasonList { heading: string; items: LocationBullet[] }
export interface LocationOverview { heading: string; paragraphs: string[] }

export interface LocationPageContent {
  /** The location slug this content belongs to. */
  locationSlug: Slug;
  /** Preselected region in the hero estimate form. */
  defaultRegionKey: ServiceAreaRegionKey;
  /** Hero copy. */
  hero: {
    eyebrow: string;
    heading: string;
    headingHighlight?: string;
    description: string;
    emergencyPrompt: string;
  };
  /** Which top services to show in the local service grid. */
  serviceGrid: {
    heading: string;
    intro?: string;
    services: ServiceKey[];
  };
  /** Freeform regional/company overview section. */
  overview: LocationOverview;
  /** Bulleted "reasons to choose" list. */
  reasons: LocationReasonList;
  /** "As Seen On" media logos strip (reference-ornament). Omit to skip. */
  showAsSeenOnStrip?: boolean;
  /** Final CTA banner copy. */
  finalCta: {
    heading: string;
    body: string;
    primary: LocationCta;
  };
}

const locationPages: Record<Slug, LocationPageContent> = {
  "ann-arbor": {
    locationSlug: "ann-arbor",
    defaultRegionKey: "south-east-michigan",
    hero: {
      eyebrow: "Roofing & Home Exterior Experts",
      heading: "Southeast Michigan's Top Choice for Residential",
      headingHighlight: "Roofing.",
      description:
        "Serving the Ann Arbor, Michigan area with roofing, siding, windows and gutters. Fast local scheduling, honest inspections and installations backed by a lifetime warranty.",
      emergencyPrompt: "Active Leak? Storm Damage?",
    },
    serviceGrid: {
      heading: "Mr. Roof: Quality, Value, and Cost Effective Prices",
      intro:
        "Explore the full exterior remodeling line for homes across Southeast Michigan.",
      services: ["roofing", "siding", "windows", "gutters", "masonry", "insulation"],
    },
    overview: {
      heading: "Done in a day. Good for a lifetime.",
      paragraphs: [
        "The reference company has served homeowners across Southeast Michigan for over 60 years, pairing careful workmanship with practical scheduling so projects move without drama.",
        "Each exterior project is quoted in writing, with materials, warranty terms and timing explained before any work begins. There is no pressure to sign on the spot.",
        "Roofs are typically installed in a single day, and the home is left clean. Our crews treat your property the same way they would their own neighbor's.",
        "If something is wrong, it is made right. One company, one point of contact, and one honest answer.",
      ],
    },
    reasons: {
      heading: "Great Reasons to Choose Mr. Roof in Southeast Michigan",
      items: [
        { title: "Done in a day.", body: "Most roof replacements are completed in a single working day." },
        { title: "Transferable lifetime warranty.", body: "Non-prorated coverage that stays with the home if you sell." },
        { title: "Owens Corning Platinum.", body: "Reference designation highlighted on the live site; demo credential." },
        { title: "3D exterior visualizer.", body: "Compare materials and colors before you commit." },
        { title: "Clean, respectful crews.", body: "Property protection and thorough cleanup after every project." },
        { title: "Direct, no-pressure quotes.", body: "A written estimate with real numbers, not a sales pitch." },
      ],
    },
    showAsSeenOnStrip: true,
    finalCta: {
      heading: "0% Interest for 18 Months on Full Exterior Projects",
      body:
        "Reference financing promotion for roofing, siding, windows and gutter projects — additional terms may apply. This demo does not accept or process credit applications.",
      primary: { label: "Get a Free Estimate", to: "/ann-arbor/" },
    },
  },

  nashville: {
    locationSlug: "nashville",
    defaultRegionKey: "nashville-area",
    hero: {
      eyebrow: "Roofing & Home Exterior Experts",
      heading: "Your Experienced Nashville Roofing",
      headingHighlight: "Contractor.",
      description:
        "A Nashville roofing contractor for roof replacements, repairs, siding, windows and gutters. Fast scheduling across Middle Tennessee, written quotes and a lifetime warranty.",
      emergencyPrompt: "Active Leak? Storm Damage?",
    },
    serviceGrid: {
      heading: "The Leading Exterior Remodeler in Nashville",
      intro:
        "Compare the full set of exterior services available to Nashville homeowners.",
      services: ["roofing", "siding", "windows", "gutters", "masonry", "insulation"],
    },
    overview: {
      heading: "Done in a day. Good for a lifetime.",
      paragraphs: [
        "Nashville homes face hot summers, Tennessee storms and long humid shoulder seasons. Choosing an exterior contractor who understands that climate matters as much as the materials themselves.",
        "The reference company serves Davidson County and surrounding Middle Tennessee communities, with written estimates, product warranties and transparent timelines explained before work begins.",
        "Most roofs are installed in a single day and the site is left clean. Repairs and smaller projects are scheduled around your calendar.",
        "One accountable contractor, from the first inspection to the final walkthrough.",
      ],
    },
    reasons: {
      heading: "Great Reasons to Choose Mr. Roof Nashville",
      items: [
        { title: "Done in a day.", body: "Full roof replacements typically completed in a single visit." },
        { title: "Lifetime warranty.", body: "Non-prorated, transferable warranty terms in writing." },
        { title: "Serving all of Middle Tennessee.", body: "Nashville, Franklin, Murfreesboro, Brentwood and nearby communities." },
        { title: "Owens Corning Platinum.", body: "Reference manufacturer designation highlighted on the live site; demo credential." },
        { title: "Honest, written quotes.", body: "Materials, labor and timing laid out before anything begins." },
        { title: "Clean, respectful crews.", body: "Property protection and thorough cleanup, every project." },
      ],
    },
    showAsSeenOnStrip: false,
    finalCta: {
      heading: "0% Interest for 18 Months on Full Exterior Projects",
      body:
        "Reference financing promotion for roofing, siding, windows and gutter projects — additional terms may apply. This demo does not accept or process credit applications.",
      primary: { label: "Get a Free Estimate", to: "/nashville/free-estimate/" },
    },
  },
};

export function findLocationPage(slug: Slug): LocationPageContent | undefined {
  return locationPages[slug];
}

export function hasLocationPage(slug: Slug): boolean {
  return slug in locationPages;
}

export const completedLocationSlugs: Slug[] = Object.keys(locationPages);
