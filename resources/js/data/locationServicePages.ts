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
  // Reference /grand-rapids/roofing/ has no FAQ section; the local hub omits
  // one rather than inventing questions.
  roofing: {
    title: "Grand Rapids Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Grand Rapids and West Michigan. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
  },
  // Reference-verified FAQ topics (close-paraphrased).
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
  // Reference pages for windows/gutters/masonry were not confirmed to carry
  // FAQ sections; the local hubs omit FAQs rather than invent questions.
  windows: {
    title: "Grand Rapids Replacement Windows",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Grand Rapids homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
  },
  gutters: {
    title: "Grand Rapids Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Grand Rapids homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
  },
  masonry: {
    title: "Grand Rapids Masonry & Chimney Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Grand Rapids homes. Each project is quoted in writing, with scope and materials described before work begins.",
  },
};

const CLEVELAND_FINAL_CTA = "/cleveland/#estimate";

const clevelandServices: LocationServiceMap = {
  // Reference /cleveland/roofing/ has an "Award-Winning Roofing Contractors
  // in Cleveland, Ohio" benefits block and no FAQ section; the local hub
  // mirrors that density.
  roofing: {
    title: "Cleveland Roofing Services",
    eyebrow: "Award-Winning Roofing Contractors in Cleveland, Ohio",
    intro:
      "Residential roofing for Cleveland and Northeast Ohio — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    finalCtaTo: CLEVELAND_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Cleveland Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Cleveland homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Cleveland?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding in Cleveland?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection. Northeast Ohio winters can accelerate these issues on older vinyl and wood siding." },
      { title: "How long does vinyl siding last in Cleveland?", body: "Well-installed vinyl commonly lasts 20–40 years in a Northeast Ohio climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: CLEVELAND_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Cleveland Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Cleveland homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Cleveland?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows in Cleveland?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across Northeast Ohio." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: CLEVELAND_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Cleveland Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Cleveland homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Cleveland?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Northeast Ohio winters." },
    ],
    finalCtaTo: CLEVELAND_FINAL_CTA,
  },
};

const CINCINNATI_FINAL_CTA = "/cincinnati/#estimate";

const cincinnatiServices: LocationServiceMap = {
  // Reference /cincinnati/roofing/ has no FAQ section; the local hub omits
  // one rather than inventing questions.
  roofing: {
    title: "Cincinnati Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Cincinnati and the Tri-State area — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    finalCtaTo: CINCINNATI_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Cincinnati Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Cincinnati homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Cincinnati?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding in Cincinnati?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection. Humid Ohio summers can accelerate these issues on older vinyl and wood siding." },
      { title: "How long does vinyl siding last in Cincinnati?", body: "Well-installed vinyl commonly lasts 20–40 years in a Southwest Ohio climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: CINCINNATI_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Cincinnati Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Cincinnati homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Cincinnati?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows in Cincinnati?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames in Ohio's humid climate." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: CINCINNATI_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Cincinnati Gutters",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Cincinnati homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Cincinnati?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Ohio winters." },
      { title: "What is an ice dam?", body: "An ice dam is a ridge of ice that forms along the roof edge when melted snow refreezes, blocking further melt-water from draining through the gutters. Insulation, ventilation and clear gutters all reduce the risk." },
    ],
    finalCtaTo: CINCINNATI_FINAL_CTA,
  },
  // Reference /cincinnati/masonry/ has no FAQ section; the local hub omits
  // one rather than inventing questions.
  masonry: {
    title: "Cincinnati Masonry Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Cincinnati homes. Each project is quoted in writing, with scope and materials described before work begins.",
    finalCtaTo: CINCINNATI_FINAL_CTA,
  },
};

const DAYTON_FINAL_CTA = "/dayton/#estimate";

const daytonServices: LocationServiceMap = {
  // Reference /dayton/roofing/ has no FAQ section; the local hub omits one.
  roofing: {
    title: "Dayton Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Dayton and the Miami Valley — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    finalCtaTo: DAYTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased); the live reference
  // page's first FAQ question has a Cincinnati placeholder from the
  // reference's own template, so our local wording keeps the three
  // reference-verified topics (cost / signs / lifespan) with correct
  // Dayton naming.
  siding: {
    title: "Dayton Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Dayton homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Dayton?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection. Southwest Ohio seasonal shifts can accelerate these issues on older vinyl and wood siding." },
      { title: "How long does vinyl siding last?", body: "Well-installed vinyl commonly lasts 20–40 years in a Miami Valley climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: DAYTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Dayton Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Dayton homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Dayton?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across the Miami Valley." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: DAYTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Dayton Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Dayton homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Dayton?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Ohio winters." },
    ],
    finalCtaTo: DAYTON_FINAL_CTA,
  },
};

const LEXINGTON_FINAL_CTA = "/lexington/#estimate";

const lexingtonServices: LocationServiceMap = {
  // Reference-verified FAQ topics (close-paraphrased). This is the first
  // roofing hub where the reference publishes an FAQ section.
  roofing: {
    title: "Lexington Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Lexington and the Bluegrass region — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    faqs: [
      { title: "How much does a new roof cost in Lexington?", body: "Pitch, square footage, chosen shingle package and any decking or flashing repair affect the total. The written estimate itemises materials and labor rather than offering a single price for every home." },
      { title: "How do I know if I need a new roof?", body: "Curling or missing shingles, granule loss filling gutters, visible light in the attic and persistent leaks are reasons to request an inspection. Repairs can extend an aging roof when the deck is still sound." },
      { title: "Will insurance cover the cost of my new roof?", body: "Coverage depends on the policy and the cause of damage. Storm or hail claims may be covered; aging-related replacement generally is not. The reference service helps document damage; the final decision rests with the insurer." },
    ],
    finalCtaTo: LEXINGTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Lexington Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Lexington homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Lexington?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection — common on older vinyl and wood siding in the Bluegrass region." },
      { title: "How long does vinyl siding last?", body: "Well-installed vinyl commonly lasts 20–40 years in a Kentucky climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: LEXINGTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Lexington Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Lexington homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Lexington?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across central Kentucky." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: LEXINGTON_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased). Reference's first
  // question still shows a Cincinnati template leftover; local wording
  // corrects to Lexington.
  gutters: {
    title: "Lexington Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Lexington homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Lexington?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Kentucky winters." },
    ],
    finalCtaTo: LEXINGTON_FINAL_CTA,
  },
  // Reference /lexington/masonry/ has no FAQ section.
  masonry: {
    title: "Lexington Masonry Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Lexington homes. Each project is quoted in writing, with scope and materials described before work begins.",
    finalCtaTo: LEXINGTON_FINAL_CTA,
  },
};

const LOUISVILLE_FINAL_CTA = "/louisville/#estimate";

const louisvilleServices: LocationServiceMap = {
  // Reference /louisville/roofing/ has no FAQ section.
  roofing: {
    title: "Louisville Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Louisville and the surrounding Jefferson County communities — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    finalCtaTo: LOUISVILLE_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Louisville Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Louisville homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Louisville?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection — common on older vinyl and wood siding in the Kentuckiana climate." },
      { title: "How long does vinyl siding last?", body: "Well-installed vinyl commonly lasts 20–40 years in a Louisville climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: LOUISVILLE_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Louisville Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Louisville homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Louisville?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across Jefferson County." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: LOUISVILLE_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Louisville Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Louisville homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Louisville?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Louisville winters." },
    ],
    finalCtaTo: LOUISVILLE_FINAL_CTA,
  },
  // Reference /louisville/masonry/ has no FAQ section.
  masonry: {
    title: "Louisville Masonry Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Louisville homes. Each project is quoted in writing, with scope and materials described before work begins.",
    finalCtaTo: LOUISVILLE_FINAL_CTA,
  },
};

const DETROIT_FINAL_CTA = "/detroit/#estimate";

const detroitServices: LocationServiceMap = {
  // Reference-verified FAQ topics (close-paraphrased).
  roofing: {
    title: "Detroit Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Detroit and the surrounding Southeast Michigan metro — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    faqs: [
      { title: "Roof replacement cost in Detroit?", body: "Pitch, square footage, chosen shingle package and any decking or flashing repair affect the total. The written estimate itemises materials and labor rather than offering a single price for every home." },
      { title: "What are signs I need a new roof?", body: "Curling or missing shingles, granule loss filling gutters, visible light in the attic and persistent leaks are reasons to request an inspection. Repairs can extend an aging roof when the deck is still sound." },
    ],
    finalCtaTo: DETROIT_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Detroit Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Detroit homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Detroit?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection — common on older vinyl and wood siding across Southeast Michigan." },
      { title: "How long does vinyl siding last?", body: "Well-installed vinyl commonly lasts 20–40 years in a Southeast Michigan climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: DETROIT_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Detroit Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Detroit homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Detroit?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across the metro Detroit area." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: DETROIT_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Detroit Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Detroit homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Detroit?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after Southeast Michigan winters." },
    ],
    finalCtaTo: DETROIT_FINAL_CTA,
  },
  // Reference /detroit/masonry/ has no FAQ section.
  masonry: {
    title: "Detroit Masonry Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Detroit homes. Each project is quoted in writing, with scope and materials described before work begins.",
    finalCtaTo: DETROIT_FINAL_CTA,
  },
};

const LANSING_FINAL_CTA = "/lansing/#estimate";

const lansingServices: LocationServiceMap = {
  // Reference-verified FAQ topics (close-paraphrased). The reference
  // Lansing roofing page uses the same 2-topic pattern (cost / signs)
  // observed on Detroit.
  roofing: {
    title: "Lansing Roofing Services",
    eyebrow: "Residential Roof Replacement and Repair",
    intro:
      "Residential roofing for Lansing and mid-Michigan — replacement, repair and inspection. Written estimates, workmanship warranties and a transferable lifetime warranty on qualifying systems.",
    faqs: [
      { title: "Roof replacement cost in Lansing?", body: "Pitch, square footage, chosen shingle package and any decking or flashing repair affect the total. The written estimate itemises materials and labor rather than offering a single price for every home." },
      { title: "What are signs I need a new roof?", body: "Curling or missing shingles, granule loss filling gutters, visible light in the attic and persistent leaks are reasons to request an inspection. Repairs can extend an aging roof when the deck is still sound." },
    ],
    finalCtaTo: LANSING_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  siding: {
    title: "Lansing Siding Installation",
    eyebrow: "Vinyl, Fiber Cement and Engineered Wood",
    intro:
      "Siding projects for Lansing homes. Compare vinyl, fiber cement and engineered wood profiles, colors and warranty terms with a written estimate — no high-pressure sales.",
    faqs: [
      { title: "Siding replacement cost in Lansing?", body: "Wall area, chosen material, trim details and any underlying repairs affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "What are signs I need new siding?", body: "Repeated paint failure, soft or warped panels, visible water staining behind the siding or persistent pest intrusion are reasons to request an inspection — common on older vinyl and wood siding across mid-Michigan." },
      { title: "How long does vinyl siding last?", body: "Well-installed vinyl commonly lasts 20–40 years in a mid-Michigan climate; fiber cement systems are rated longer. Actual lifespan depends on exposure, maintenance and the specific product." },
    ],
    finalCtaTo: LANSING_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  windows: {
    title: "Lansing Window Installation",
    eyebrow: "ProVia Endure, Aeris and Aspect",
    intro:
      "Replacement windows for Lansing homes with ProVia products. Compare frames, glass packages and installation details with a written estimate.",
    faqs: [
      { title: "Window replacement cost in Lansing?", body: "Opening count, chosen frame and glass package, and any trim or sill repair affect the total. The written estimate lists each opening and its selected configuration." },
      { title: "What are signs I need new windows?", body: "Persistent drafts, condensation between panes, difficulty operating sashes and visible frame rot are reasons to request an inspection — common on older wood frames across the Lansing area." },
      { title: "Should I replace all the house windows at once?", body: "Replacing the full set in one project usually keeps installation costs lower per opening and gives a consistent exterior. Phased replacement is possible when budget or weather calls for it; the written plan explains both options." },
    ],
    finalCtaTo: LANSING_FINAL_CTA,
  },
  // Reference-verified FAQ topics (close-paraphrased).
  gutters: {
    title: "Lansing Gutters & Downspouts",
    eyebrow: "Seamless Aluminum Gutters and Guards",
    intro:
      "Seamless aluminum gutter installations for Lansing homes. Compare profiles, colors and downspout placement so rainwater is directed away from the foundation.",
    faqs: [
      { title: "How much do new gutters cost in Lansing?", body: "Linear footage, chosen gauge and profile, downspout count and any fascia repair affect the total. A measured, written estimate is more useful than a single price point for every home." },
      { title: "How do I know if I need new gutters?", body: "Sagging sections, visible rust or splits, repeated overflow during rainfall, or pulled-away fascia are reasons to request an inspection — especially after mid-Michigan winters." },
    ],
    finalCtaTo: LANSING_FINAL_CTA,
  },
  // Reference /lansing/masonry/ has no FAQ section.
  masonry: {
    title: "Lansing Masonry Services",
    eyebrow: "Chimney Repair, Tuckpointing and Stone Veneer",
    intro:
      "Masonry repair, tuckpointing and chimney work for Lansing homes. Each project is quoted in writing, with scope and materials described before work begins.",
    finalCtaTo: LANSING_FINAL_CTA,
  },
};

export const locationServicePages: Record<Slug, LocationServiceMap> = {
  nashville: nashvilleServices,
  "grand-rapids": grandRapidsServices,
  cleveland: clevelandServices,
  cincinnati: cincinnatiServices,
  dayton: daytonServices,
  lexington: lexingtonServices,
  louisville: louisvilleServices,
  detroit: detroitServices,
  lansing: lansingServices,
};

export function findLocationServiceContent(
  locationSlug: Slug,
  serviceKey: ServiceHubKey
): LocationServiceContent | undefined {
  return locationServicePages[locationSlug]?.[serviceKey];
}
