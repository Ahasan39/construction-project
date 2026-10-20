import type { ServiceAreaRegionKey, ServiceKey, Slug } from "@/types";

/**
 * Typed content for a completed location hub. Only locations with an entry
 * here render the full landing page composition; the rest keep the existing
 * scaffold. Section-level opt-outs preserve meaningful reference differences
 * (e.g. Ann Arbor has an "As Seen On" strip; the other reference pages do
 * not).
 *
 * `defaultRegionKey` is an explicit location-to-region map used to preselect
 * the hero estimate form. Mappings are never inferred from names; a missing
 * entry here means the form falls back to its open dropdown.
 */

export interface LocationCta { label: string; to: string }
export interface LocationBullet { title?: string; body: string }
export interface LocationReasonList { heading: string; items: LocationBullet[] }
export interface LocationOverview { heading: string; paragraphs: string[] }

export interface LocationPageContent {
  locationSlug: Slug;
  defaultRegionKey: ServiceAreaRegionKey;
  hero: {
    eyebrow: string;
    heading: string;
    headingHighlight?: string;
    description: string;
    emergencyPrompt: string;
  };
  serviceGrid: {
    heading: string;
    intro?: string;
    services: ServiceKey[];
  };
  overview: LocationOverview;
  reasons: LocationReasonList;
  /** "As Seen On" media logos strip — only on the reference variant that shows it. */
  showAsSeenOnStrip?: boolean;
  /** Final CTA label + body. The destination is resolved by the page from
   *  availability so a nonexistent local estimate route is never generated. */
  finalCta: {
    heading: string;
    body: string;
    primary: { label: string };
  };
}

const EYEBROW = "Roofing & Home Exterior Experts";
const EMERGENCY = "Active Leak? Storm Damage?";
const ALL_SERVICES: ServiceKey[] = [
  "roofing",
  "siding",
  "windows",
  "gutters",
  "masonry",
  "insulation",
];
const SHARED_OVERVIEW_HEADING = "Done in a day. Good for a lifetime.";
const SHARED_FINAL_CTA = {
  heading: "0% Interest for 18 Months on Full Exterior Projects",
  body:
    "Reference financing promotion for roofing, siding, windows and gutter projects — additional terms may apply. This demo does not accept or process credit applications.",
  primary: { label: "Get a Free Estimate" },
};

function reasons(cityOrRegion: string): LocationPageContent["reasons"] {
  return {
    heading: `Great Reasons to Choose Mr. Roof ${cityOrRegion}`,
    items: [
      { title: "Done in a day.", body: "Most roof replacements are completed in a single working day." },
      { title: "Transferable lifetime warranty.", body: "Non-prorated coverage that stays with the home if you sell." },
      { title: "Owens Corning Platinum.", body: "Reference manufacturer designation highlighted on the live site; demo credential." },
      { title: "3D exterior visualizer.", body: "Compare materials and colors before you commit." },
      { title: "Clean, respectful crews.", body: "Property protection and thorough cleanup after every project." },
      { title: "Direct, no-pressure quotes.", body: "A written estimate with real numbers, not a sales pitch." },
    ],
  };
}

const locationPages: Record<Slug, LocationPageContent> = {
  "ann-arbor": {
    locationSlug: "ann-arbor",
    defaultRegionKey: "south-east-michigan",
    hero: {
      eyebrow: EYEBROW,
      heading: "Southeast Michigan's Top Choice for Residential",
      headingHighlight: "Roofing.",
      description:
        "Serving the Ann Arbor, Michigan area with roofing, siding, windows and gutters. Fast local scheduling, honest inspections and installations backed by a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Mr. Roof: Quality, Value, and Cost Effective Prices",
      intro: "Explore the full exterior remodeling line for homes across Southeast Michigan.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "The reference company has served homeowners across Southeast Michigan for over 60 years, pairing careful workmanship with practical scheduling so projects move without drama.",
        "Each exterior project is quoted in writing, with materials, warranty terms and timing explained before any work begins. There is no pressure to sign on the spot.",
        "Roofs are typically installed in a single day, and the home is left clean. Our crews treat your property the same way they would their own neighbor's.",
        "If something is wrong, it is made right. One company, one point of contact, and one honest answer.",
      ],
    },
    reasons: reasons("in Southeast Michigan"),
    showAsSeenOnStrip: true,
    finalCta: SHARED_FINAL_CTA,
  },

  nashville: {
    locationSlug: "nashville",
    defaultRegionKey: "nashville-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Your Experienced Nashville Roofing",
      headingHighlight: "Contractor.",
      description:
        "A Nashville roofing contractor for roof replacements, repairs, siding, windows and gutters. Fast scheduling across Middle Tennessee, written quotes and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "The Leading Exterior Remodeler in Nashville",
      intro: "Compare the full set of exterior services available to Nashville homeowners.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Nashville homes face hot summers, Tennessee storms and long humid shoulder seasons. Choosing an exterior contractor who understands that climate matters as much as the materials themselves.",
        "The reference company serves Davidson County and surrounding Middle Tennessee communities, with written estimates, product warranties and transparent timelines explained before work begins.",
        "Most roofs are installed in a single day and the site is left clean. Repairs and smaller projects are scheduled around your calendar.",
        "One accountable contractor, from the first inspection to the final walkthrough.",
      ],
    },
    reasons: reasons("Nashville"),
    finalCta: SHARED_FINAL_CTA,
  },

  "grand-rapids": {
    locationSlug: "grand-rapids",
    defaultRegionKey: "grand-rapids-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Grand Rapids' Go-To Roofing Company",
      headingHighlight: "Since 1962.",
      description:
        "Full-service exterior remodeling for Grand Rapids and West Michigan — roofing, siding, windows and gutters with transparent quotes and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Full-Service Exterior Remodeling in Grand Rapids",
      intro: "Compare roofing, siding, windows and more for West Michigan homes.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Grand Rapids weather tests exterior finishes year-round. The reference company designs each project around the materials, flashing and ventilation details that make a difference across West Michigan seasons.",
        "Every project is quoted in writing, with transparent timing and warranty terms discussed before anything begins. No high-pressure sales.",
        "Most residential roofs are installed in a single day with careful property protection and cleanup afterward.",
      ],
    },
    reasons: reasons("Grand Rapids"),
    finalCta: SHARED_FINAL_CTA,
  },

  cleveland: {
    locationSlug: "cleveland",
    defaultRegionKey: "cleveland-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Cleveland Residential Roofing Contractors",
      headingHighlight: "You Can Trust.",
      description:
        "Roofing, siding, windows and gutters for Cleveland and Northeast Ohio homes. Written estimates, respectful crews and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Quality Products. Service You Can Trust.",
      intro: "Compare the full set of exterior services available in Northeast Ohio.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Cleveland winters are hard on roofs and gutters. The reference company inspects the full exterior envelope so a repair or replacement is informed by what's actually happening at the roofline.",
        "Each quote is written down. Materials, labor, warranty terms and scheduling are explained before anything begins.",
        "Clean work, clear communication, one accountable contractor from inspection through final walkthrough.",
      ],
    },
    reasons: reasons("Cleveland"),
    finalCta: SHARED_FINAL_CTA,
  },

  cincinnati: {
    locationSlug: "cincinnati",
    defaultRegionKey: "cincinnati-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Best Roofers in",
      headingHighlight: "Cincinnati, OH.",
      description:
        "Residential roofing, siding, windows and gutters for Cincinnati and the surrounding Tri-State area. Honest inspections and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Quality Products. Service You Can Trust.",
      intro: "Compare roofing and exterior services available across the Cincinnati area.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Cincinnati homes range from century-old brick to modern vinyl-clad exteriors. The reference company tailors material choices and installation details to the way each home is built.",
        "Written quotes with transparent timing, warranty terms and scope. No pressure to sign on the spot.",
        "Most residential roofs are installed in a single day with careful cleanup afterward.",
      ],
    },
    reasons: reasons("Cincinnati"),
    finalCta: SHARED_FINAL_CTA,
  },

  dayton: {
    locationSlug: "dayton",
    defaultRegionKey: "dayton-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Dayton's Trusted",
      headingHighlight: "Roofing Company.",
      description:
        "Roof replacements, repairs and the full exterior envelope — siding, windows and gutters — for homes across the Dayton area.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Your First Choice For Exterior Renovation in Dayton",
      intro: "Compare the exterior services available for Dayton-area homes.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "The reference company serves Montgomery and Clark counties with written estimates and clear timing. Projects start on the day you choose and move without surprise.",
        "Materials, warranty terms and scope are agreed in writing. No high-pressure sales tactics.",
        "Most residential roofs are installed in a single day; the home is left clean.",
      ],
    },
    reasons: reasons("Dayton"),
    finalCta: SHARED_FINAL_CTA,
  },

  lexington: {
    locationSlug: "lexington",
    // The reference's own form omits Lexington from its region list; we keep
    // Lexington Area explicit in the local dropdown and preselect it here.
    defaultRegionKey: "lexington-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Lexington, Kentucky's Most Trusted",
      headingHighlight: "Roofing Contractors.",
      description:
        "Residential roofing, siding, windows and gutters for Lexington and the surrounding Bluegrass region. Written estimates and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Quality Products. Service You Can Trust.",
      intro: "Explore roofing and exterior services available to Lexington homes via the regional hubs.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Lexington's mix of historic and new-build homes rewards an exterior contractor who looks at the whole system — roof, flashing, gutters and ventilation — before quoting a job.",
        "Written estimates, honest timelines and a transferable lifetime warranty on qualifying systems.",
        "Most residential roofs are installed in a single working day.",
      ],
    },
    reasons: reasons("Lexington"),
    finalCta: SHARED_FINAL_CTA,
  },

  louisville: {
    locationSlug: "louisville",
    defaultRegionKey: "louisville-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "#1 Residential Roofing Company in",
      headingHighlight: "Louisville, Kentucky.",
      description:
        "Roofing, siding, windows and gutters for Louisville and the surrounding Jefferson County communities. Written quotes and a lifetime warranty.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Trusted Exterior Renovation Contractors in Louisville",
      intro: "Compare roofing and exterior services available for Louisville-area homes.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Louisville summers and winters wear on exterior finishes. The reference company works through the full roof system — underlayment, flashing, ventilation and shingles — rather than only the visible surface.",
        "Each project is quoted in writing, with real numbers and clear timing.",
        "Most residential roofs are installed in a single day with careful cleanup afterward.",
      ],
    },
    reasons: reasons("Louisville"),
    finalCta: SHARED_FINAL_CTA,
  },

  detroit: {
    locationSlug: "detroit",
    // Detroit shares the Southeast Michigan region with Ann Arbor on the reference.
    defaultRegionKey: "south-east-michigan",
    hero: {
      eyebrow: EYEBROW,
      heading: "Detroit's #1 Choice for Residential",
      headingHighlight: "Roofing.",
      description:
        "Residential roofing, siding, windows and gutters for Detroit and the broader Southeast Michigan metro.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Mr. Roof: Quality, Value, and Cost Effective Prices",
      intro: "Compare roofing and exterior services available for Detroit-area homes via the Southeast Michigan hubs.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Detroit neighborhoods include homes of every era, each with its own roofline details. The reference company inspects the exterior envelope and quotes work in writing before anything begins.",
        "Clean, respectful crews, transparent materials and warranty terms, and a single accountable contractor.",
        "Most residential roofs are installed in a single working day.",
      ],
    },
    reasons: reasons("Detroit"),
    finalCta: SHARED_FINAL_CTA,
  },

  lansing: {
    locationSlug: "lansing",
    defaultRegionKey: "lansing-area",
    hero: {
      eyebrow: EYEBROW,
      heading: "Lansing's #1 Choice for Residential",
      headingHighlight: "Roofing.",
      description:
        "Roofing, siding, windows and gutters for Lansing and the surrounding mid-Michigan communities.",
      emergencyPrompt: EMERGENCY,
    },
    serviceGrid: {
      heading: "Mr. Roof: Quality, Value, and Cost Effective Prices",
      intro: "Compare the exterior services available for Lansing-area homes.",
      services: ALL_SERVICES,
    },
    overview: {
      heading: SHARED_OVERVIEW_HEADING,
      paragraphs: [
        "Lansing-area homes see every kind of Michigan weather. The reference company plans each project around flashing, ventilation and material choices that stand up to the full seasonal cycle.",
        "Written estimates, honest timing and a transferable lifetime warranty on qualifying systems.",
        "Most residential roofs are installed in a single working day with careful property protection.",
      ],
    },
    reasons: reasons("Lansing"),
    finalCta: SHARED_FINAL_CTA,
  },
};

export function findLocationPage(slug: Slug): LocationPageContent | undefined {
  return locationPages[slug];
}

export function hasLocationPage(slug: Slug): boolean {
  return slug in locationPages;
}

export const completedLocationSlugs: Slug[] = Object.keys(locationPages);
