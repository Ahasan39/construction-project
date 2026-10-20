import type { Disclosure, ServiceHubKey } from "./servicePages";
import type { Slug } from "@/types";

/**
 * Typed local-service hub content keyed by location slug and ServiceHubKey.
 * Only pairs listed here render a completed body; combinations missing a
 * record fall back to the Sprint 1 scaffold. The explicit availability table
 * in `src/data/availability.ts` still gates whether the route is mounted at
 * all; `locationServicePages` is a presentation overlay on top of availability.
 */

export interface LocationServiceContent {
  /** Localised H1, e.g. "Nashville Roofing". */
  title: string;
  /** Short line under the breadcrumb (reference-style eyebrow). */
  eyebrow?: string;
  /** Opening paragraph with local context. */
  intro: string;
  /** Local service-specific FAQs; keep concise. */
  faqs?: Disclosure[];
  /** Explicit final-CTA target; omit to use the location free-estimate route. */
  finalCtaTo?: string;
}

type LocationServiceMap = Partial<Record<ServiceHubKey, LocationServiceContent>>;

const nashvilleServices: LocationServiceMap = {
  roofing: {
    title: "Nashville Roofing",
    eyebrow: "Residential Roof Replacement, Repair and Commercial Systems",
    intro:
      "Serving Nashville and Davidson County with residential roof replacements, repairs and commercial systems. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    faqs: [
      { title: "How long does a roof replacement take in Nashville?", body: "Most residential roofs are installed in a single working day. Larger homes, steep pitches or complex detailing may take an additional day. The project timeline is confirmed in the written estimate." },
      { title: "Do you repair storm damage in Middle Tennessee?", body: "Yes. The reference service covers wind, hail and water damage inspection and documentation across Nashville, Franklin, Murfreesboro and surrounding communities. Insurance claim support is available separately through the written claim process." },
      { title: "What roofing systems do you install in Nashville?", body: "Asphalt architectural shingles are the most common installation; standing-seam metal and commercial flat systems are available for suitable homes and buildings. The written estimate lists the exact materials, warranty terms and installation details." },
    ],
  },
  siding: {
    title: "Nashville Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Nashville homes, from vinyl replacements to fiber cement upgrades. Compare profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Nashville?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding in Nashville?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection. Nashville's humid summers can accelerate these issues on older vinyl and wood siding." },
      { title: "How long does vinyl siding last in Nashville?", body: "Well-installed vinyl commonly lasts 20–40 years in a Middle Tennessee climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
  },
  windows: {
    title: "Nashville Replacement Windows",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Nashville homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "What windows are suited to Nashville's climate?", body: "Low-E glass with argon fill is a common choice for the Nashville summer load. Compare the whole-window U-factor and SHGC ratings for the specific configuration before deciding." },
      { title: "How many windows can be installed in a day?", body: "Typical residential installations complete 8–12 openings per day, depending on the home. Larger projects are scheduled across two or more days with a clear plan for weather and interior protection." },
    ],
  },
  gutters: {
    title: "Nashville Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Nashville homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "What gutter size do I need for a Nashville home?", body: "Standard 5-inch K-style gutters serve most residential rooflines. Larger roofs, long valleys and heavy spring rains may call for 6-inch gutters and additional downspouts; a written estimate specifies both." },
      { title: "Do gutter guards eliminate maintenance?", body: "Guards reduce debris that reaches the gutter channel, but do not eliminate periodic inspection and cleaning — especially in Nashville's leaf-heavy fall." },
    ],
  },
  masonry: {
    title: "Nashville Masonry & Chimney Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Nashville homes. Each project is quoted in writing, with scope and materials described before work begins.",
    faqs: [
      { title: "When should I schedule chimney work in Nashville?", body: "Early fall, before fireplace season, is a common time to inspect flashings, caps and crown condition. Freeze-thaw damage can continue through the Middle Tennessee winter." },
      { title: "Can tuckpointing match older brick?", body: "In most cases a careful color match is possible by sampling the existing mortar. New mortar never looks identical on day one; weathering closes the gap over time." },
    ],
  },
};

const grandRapidsServices: LocationServiceMap = {
  roofing: {
    title: "Grand Rapids Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Grand Rapids and West Michigan. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    faqs: [
      { title: "How long does a roof replacement take in Grand Rapids?", body: "Most residential roofs are installed in a single working day. Steep pitches, complex detailing or larger homes may extend the schedule into a second day; the written estimate confirms the plan." },
      { title: "Do you handle storm damage inspections in West Michigan?", body: "Yes. The reference service documents wind, hail and water damage across Kent and Ottawa counties and the surrounding communities." },
    ],
  },
  siding: {
    title: "Grand Rapids Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Grand Rapids homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Grand Rapids?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding in Grand Rapids?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection. Lake-effect winters can accelerate these issues on older vinyl and wood siding." },
      { title: "How long does vinyl siding last in Grand Rapids?", body: "Well-installed vinyl commonly lasts 20–40 years in a West Michigan climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
  },
  windows: {
    title: "Grand Rapids Replacement Windows",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Grand Rapids homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "What windows suit a West Michigan climate?", body: "Low-E glass with argon fill is a common choice for the heating-dominated Grand Rapids load. Compare whole-window U-factor and SHGC ratings for the specific configuration before deciding." },
      { title: "How many windows can be installed in a day?", body: "Typical residential installations complete 8–12 openings per day, depending on the home. Larger projects are scheduled across two or more days with a plan for weather and interior protection." },
    ],
  },
  gutters: {
    title: "Grand Rapids Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Grand Rapids homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "What gutter size do I need for a Grand Rapids home?", body: "Standard 5-inch K-style gutters serve most residential rooflines. Larger roofs, long valleys and heavy spring rains may call for 6-inch gutters and additional downspouts; a written estimate specifies both." },
      { title: "Do gutter guards eliminate maintenance?", body: "Guards reduce debris that reaches the gutter channel, but do not eliminate periodic inspection and cleaning — especially in Grand Rapids's leaf-heavy fall." },
    ],
  },
  masonry: {
    title: "Grand Rapids Masonry & Chimney Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Grand Rapids homes. Each project is quoted in writing, with scope and materials described before work begins.",
    faqs: [
      { title: "When should I schedule chimney work in Grand Rapids?", body: "Early fall, before fireplace season, is a common time to inspect flashings, caps and crown condition. West Michigan freeze-thaw cycles continue through winter." },
      { title: "Can tuckpointing match older brick?", body: "In most cases a careful color match is possible by sampling the existing mortar. New mortar never looks identical on day one; weathering closes the gap over time." },
    ],
  },
};

export const locationServicePages: Record<Slug, LocationServiceMap> = {
  nashville: nashvilleServices,
  "grand-rapids": grandRapidsServices,
};

export function findLocationServiceContent(
  locationSlug: Slug,
  serviceKey: ServiceHubKey
): LocationServiceContent | undefined {
  return locationServicePages[locationSlug]?.[serviceKey];
}
