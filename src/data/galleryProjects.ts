export type GalleryCategoryKey =
  | "all"
  | "roofing"
  | "siding"
  | "windows"
  | "gutters"
  | "masonry";

export interface GalleryProjectImage {
  src: string;
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface GalleryProject {
  id: string;
  title: string;
  category: "Roofing" | "Siding" | "Windows" | "Gutters" | "Masonry";
  categoryKey: Exclude<GalleryCategoryKey, "all">;
  propertyType: string;
  summary: string;
  description: string;
  scopeHighlights: string[];
  materials?: string[];
  primaryImage: GalleryProjectImage;
  additionalImages?: GalleryProjectImage[];
  demoNotice?: string;
}

export interface GalleryCategoryOption {
  key: GalleryCategoryKey;
  label: string;
}

export const galleryCategories: GalleryCategoryOption[] = [
  { key: "all", label: "All Projects" },
  { key: "roofing", label: "Roofing" },
  { key: "siding", label: "Siding" },
  { key: "windows", label: "Windows" },
  { key: "gutters", label: "Gutters" },
  { key: "masonry", label: "Masonry" },
];

/**
 * Curated demonstration portfolio projects showing representative exterior
 * construction scopes, systems, and craftsmanship.
 *
 * NOTE: Images reuse local WebP demonstration assets. No client names,
 * private addresses, or fabricated metrics are claimed.
 */
export const galleryProjects: GalleryProject[] = [
  {
    id: "architectural-shingle-replacement",
    title: "Architectural Shingle Roof Replacement",
    category: "Roofing",
    categoryKey: "roofing",
    propertyType: "Residential Home",
    summary:
      "Complete roof tear-off and replacement featuring dimensional architectural shingles with heavy-duty wind and impact resistance.",
    description:
      "A comprehensive residential roof replacement engineered for long-term weather protection. The project involved complete removal of deteriorated existing shingles, thorough inspection and re-nailing of the plywood roof deck, and installation of a multi-layer protective roofing system including ice and water barriers along all vulnerable rooflines.",
    scopeHighlights: [
      "Full tear-off down to structural plywood decking",
      "Self-adhering ice & water shield at eaves, valleys, and wall flashings",
      "Breathable synthetic underlayment covering all deck surfaces",
      "Continuous baffled ridge vent system for balanced attic ventilation",
      "Matching hip and ridge cap shingles for finished architectural appeal",
    ],
    materials: [
      "Dimensional Architectural Shingles (Lifetime Limited Warranty)",
      "High-Performance Synthetic Roof Deck Underlayment",
      "Corrosion-Resistant Aluminum Drip Edge",
      "Self-Sealing Ice & Water Barrier",
    ],
    primaryImage: {
      src: "/images/roofing-details/replacement-1200.webp",
      srcSet:
        "/images/roofing-details/replacement-480.webp 480w, /images/roofing-details/replacement-1200.webp 1200w",
      alt: "Residential home with high-definition architectural shingle roof replacement",
      width: 1200,
      height: 800,
      caption: "Completed architectural shingle roof installation with clean ridge lines.",
    },
    additionalImages: [
      {
        src: "/images/services/photos/benefit-roofer-install-900.webp",
        srcSet:
          "/images/services/photos/benefit-roofer-install-480.webp 480w, /images/services/photos/benefit-roofer-install-900.webp 900w",
        alt: "Professional roofer fastening dimensional shingles with pneumatic nailer",
        width: 900,
        height: 600,
        caption: "Precision mechanical fastening ensuring maximum wind-lift rating.",
      },
    ],
    demoNotice:
      "Sample portfolio scope representing typical residential architectural shingle replacement specifications.",
  },
  {
    id: "standing-seam-metal-roof",
    title: "Standing Seam Metal Roofing",
    category: "Roofing",
    categoryKey: "roofing",
    propertyType: "Architectural Residence",
    summary:
      "Custom-fabricated standing seam metal roofing system featuring concealed fasteners and exceptional high-wind protection.",
    description:
      "A modern exterior upgrade utilizing heavy-gauge standing seam metal panels with concealed clips. The continuous vertical rib profile provides a clean, contemporary aesthetic while delivering superior shedding of rain, snow, and debris without exposed screw penetrations.",
    scopeHighlights: [
      "Concealed clip fastening system eliminating through-panel penetrations",
      "Factory-applied high-performance fluoropolymer protective finish",
      "Precision-formed custom ridge, valley, and transition flashings",
      "Class A fire rating and high wind-uplift resistance",
    ],
    materials: [
      "24-Gauge Galvalume-Coated Steel Panels",
      "High-Temperature Self-Adhering Metal Underlayment",
      "Concealed Stainless Steel Expansion Clips",
    ],
    primaryImage: {
      src: "/images/roofing-details/metal-1440.webp",
      srcSet:
        "/images/roofing-details/metal-480.webp 480w, /images/roofing-details/metal-1440.webp 1440w",
      alt: "Modern standing seam metal roof installed on a residential structure",
      width: 1440,
      height: 960,
      caption: "Sleek standing seam metal panels with concealed fastener system.",
    },
    demoNotice:
      "Sample portfolio scope representing architectural standing-seam metal roofing specifications.",
  },
  {
    id: "commercial-flat-roof-membrane",
    title: "Commercial Low-Slope Membrane Roofing",
    category: "Roofing",
    categoryKey: "roofing",
    propertyType: "Commercial Building",
    summary:
      "Single-ply commercial roofing system with tapered polyiso insulation boards and heat-welded watertight seam details.",
    description:
      "A commercial low-slope roof installation engineered for commercial durability and energy efficiency. Designed with high-density polyisocyanurate insulation arranged in a tapered layout to direct stormwater toward primary roof drains and scuppers, eliminating standing ponding water.",
    scopeHighlights: [
      "Tapered rigid insulation layout eliminating standing water",
      "Heat-welded thermoplastic membrane seams creating monolithic waterproofing",
      "Heavy-duty parapet wall coping and mechanical curb flashings",
      "Energy Star reflective cool-roof surface reducing building cooling loads",
    ],
    materials: [
      "Reinforced Single-Ply Membrane (60-mil)",
      "Tapered Polyisocyanurate (Polyiso) Roof Insulation",
      "Heavy-Gauge Prefinished Aluminum Parapet Coping",
    ],
    primaryImage: {
      src: "/images/roofing-details/commercial-1440.webp",
      srcSet:
        "/images/roofing-details/commercial-480.webp 480w, /images/roofing-details/commercial-1440.webp 1440w",
      alt: "Commercial flat roof single-ply membrane installation",
      width: 1440,
      height: 960,
      caption: "Low-slope membrane roofing with positive drainage engineering.",
    },
    additionalImages: [
      {
        src: "/images/services/photos/benefit-crew-working-900.webp",
        srcSet:
          "/images/services/photos/benefit-crew-working-480.webp 480w, /images/services/photos/benefit-crew-working-900.webp 900w",
        alt: "Commercial roofing crew working on commercial building rooftop",
        width: 900,
        height: 600,
        caption: "Certified crew executing precision membrane installation.",
      },
    ],
    demoNotice:
      "Sample portfolio scope representing commercial low-slope membrane roofing specifications.",
  },
  {
    id: "precision-roof-repair-flashing",
    title: "Precision Roof Repair & Flashing Restoration",
    category: "Roofing",
    categoryKey: "roofing",
    propertyType: "Residential Home",
    summary:
      "Targeted leak diagnostic, storm-damaged shingle replacement, and complete chimney step and counter-flashing rebuild.",
    description:
      "A targeted exterior restoration focused on vulnerable roof transitions. After comprehensive water-intrusion diagnosis, compromised shingles and deteriorated masonry flashing were removed down to the decking. New step flashings were woven into the shingle courses and sealed with custom-bent counter-flashing let into the chimney mortar joints.",
    scopeHighlights: [
      "Digital moisture inspection identifying exact leak pathways",
      "New custom-bent aluminum step and counter-flashing at chimney joints",
      "Replacement of cracked and wind-damaged asphalt shingle tabs",
      "Resealed plumbing vent pipe boots and valley transitions",
    ],
    materials: [
      "Color-Matched Replacement Architectural Shingles",
      "0.024-Gauge Aluminum Flashing Coil",
      "Polyurethane High-Performance Exterior Joint Sealant",
    ],
    primaryImage: {
      src: "/images/roofing-details/repair-640.webp",
      srcSet:
        "/images/roofing-details/repair-480.webp 480w, /images/roofing-details/repair-640.webp 640w",
      alt: "Roof repair with newly installed valley and chimney flashing",
      width: 640,
      height: 427,
      caption: "Rebuilt flashing and shingle transitions preventing water infiltration.",
    },
    demoNotice:
      "Sample portfolio scope representing precision roof repair and flashing restoration.",
  },
  {
    id: "insulated-vinyl-siding-renovation",
    title: "Insulated Vinyl Siding & Gable Accents",
    category: "Siding",
    categoryKey: "siding",
    propertyType: "Suburban Home",
    summary:
      "Complete home exterior upgrade with contoured insulated vinyl siding, vented soffits, and custom window mantel trim.",
    description:
      "A whole-house siding renovation designed to elevate curb appeal and energy performance. Features premium insulated vinyl siding with contoured EPS foam backing that straightens wall irregularities and cushions against impact. Vented soffits ensure continuous attic ventilation while low-maintenance aluminum coil wraps protect exposed wood fascias.",
    scopeHighlights: [
      "Removal of failing siding and weather-resistive housewrap inspection",
      "Contoured EPS rigid foam backing enhancing thermal R-value",
      "Vented soffit panels promoting healthy intake airflow",
      "Custom aluminum window and door casing wraps for a clean finish",
    ],
    materials: [
      "Insulated Vinyl Horizontal Lap Siding",
      "Vented Soffit and Fascia Trim System",
      "Vapor-Permeable Weather-Resistive Barrier",
    ],
    primaryImage: {
      src: "/images/services/photos/benefit-exterior-renovation-900.webp",
      srcSet:
        "/images/services/photos/benefit-exterior-renovation-480.webp 480w, /images/services/photos/benefit-exterior-renovation-900.webp 900w",
      alt: "Renovated suburban home exterior with crisp siding, shutters, and finished roofline",
      width: 900,
      height: 600,
      caption: "Full exterior facade transformation with insulated siding and trim.",
    },
    additionalImages: [
      {
        src: "/images/roofing-details/exterior-640.webp",
        srcSet:
          "/images/roofing-details/exterior-480.webp 480w, /images/roofing-details/exterior-640.webp 640w",
        alt: "Detail view of architectural lap siding and clean corner posts",
        width: 640,
        height: 427,
        caption: "Precision interlocking panels and custom corner posts.",
      },
    ],
    demoNotice:
      "Sample portfolio scope representing insulated vinyl siding and exterior trim replacement.",
  },
  {
    id: "craftsman-lap-siding-trim",
    title: "Modern Craftsman Lap Siding & Trim Package",
    category: "Siding",
    categoryKey: "siding",
    propertyType: "Single-Family Residence",
    summary:
      "Architectural horizontal lap siding installation with crisp corner posts, frieze boards, and transition trim details.",
    description:
      "A crafted exterior envelope transformation bringing distinct character to the facade. Durable lap siding planks with natural woodgrain texture provide clean horizontal shadow lines. Heavy-duty corner posts, drip caps, and trim accents establish architectural definition around entryways and gables.",
    scopeHighlights: [
      "Deep shadow-line lap profile creating rich architectural texture",
      "Integrated drainage plane behind siding panels preventing moisture buildup",
      "Color-coordinated corner posts and window drip caps",
      "Rot-proof synthetic composite trim transitions at masonry foundation",
    ],
    materials: [
      "Engineered Composite Lap Siding Planks",
      "PVC Moisture-Proof Exterior Trim Boards",
      "Corrosion-Proof Stainless Steel Fasteners",
    ],
    primaryImage: {
      src: "/images/roofing-details/exterior-640.webp",
      srcSet:
        "/images/roofing-details/exterior-480.webp 480w, /images/roofing-details/exterior-640.webp 640w",
      alt: "Close-up of craftsman lap siding with crisp trim and corner posts",
      width: 640,
      height: 427,
      caption: "Architectural lap siding with custom trim details.",
    },
    demoNotice:
      "Sample portfolio scope representing architectural lap siding installation.",
  },
  {
    id: "high-efficiency-replacement-windows",
    title: "Custom High-Efficiency Replacement Windows",
    category: "Windows",
    categoryKey: "windows",
    propertyType: "Residential Home",
    summary:
      "Precision-measured double-hung vinyl windows featuring multi-chamber frames, low-E argon-filled glass, and exterior capping.",
    description:
      "A multi-unit window replacement project replacing drafty single-pane units with custom-sized energy-efficient windows. Every window opening was measured to 1/8-inch tolerances, shimmed square, insulated with low-expansion foam, and sealed with custom-formed aluminum exterior brickmold wraps.",
    scopeHighlights: [
      "Custom laser-measured manufacturing ensuring airtight sash fit",
      "Double-pane Low-E glass package with argon insulating gas fill",
      "Multi-chamber fusion-welded vinyl frame preventing thermal bridging",
      "Low-expansion closed-cell foam insulation around entire rough opening",
      "Tilt-in sashes for effortless indoor cleaning of exterior glass",
    ],
    materials: [
      "Custom Multi-Chamber Vinyl Window Frames",
      "Low-E Coated Insulated Glass Units with Warm-Edge Spacers",
      "Heavy-Duty Aluminum Trim Capping Coil",
    ],
    primaryImage: {
      src: "/images/services/photos/hero-suburban-home-900.webp",
      srcSet:
        "/images/services/photos/hero-suburban-home-480.webp 480w, /images/services/photos/hero-suburban-home-900.webp 900w",
      alt: "Suburban home exterior showcasing custom energy-efficient replacement windows",
      width: 900,
      height: 600,
      caption: "Energy-efficient replacement windows enhancing interior comfort and exterior style.",
    },
    demoNotice:
      "Sample portfolio scope representing custom high-efficiency replacement window installation.",
  },
  {
    id: "seamless-gutters-leaf-protection",
    title: "Seamless Aluminum Gutters & Leaf Protection",
    category: "Gutters",
    categoryKey: "gutters",
    propertyType: "Residential Home",
    summary:
      "Custom continuous-run seamless aluminum gutters fabricated on-site with oversized downspouts and micro-mesh gutter guards.",
    description:
      "A complete rainwater management overhaul engineered to protect the home's roof edge, siding, and foundation. Continuous heavy-gauge seamless aluminum gutters were roll-formed on-site to exact roofline dimensions, eliminating leak-prone seams. Installed with hidden screw hangers into rafter tails and capped with stainless steel micro-mesh guards.",
    scopeHighlights: [
      "On-site custom continuous extrusion eliminating joint leaks",
      "Engineered pitch gradient promoting rapid drainage toward downspouts",
      "Heavy-duty internal screw hangers anchored every 24 inches",
      "High-capacity 3x4-inch downspouts handling severe storm deluge",
      "Micro-mesh stainless steel leaf guards blocking pine needles and debris",
    ],
    materials: [
      "0.032-Gauge Heavy-Duty Aluminum Seamless Gutter Coil",
      "Stainless Steel Micro-Mesh Gutter Guards",
      "Zinc-Coated Heavy-Duty Internal Screw Hangers",
    ],
    primaryImage: {
      src: "/images/services/photos/promo-inspector-gutters-900.webp",
      srcSet:
        "/images/services/photos/promo-inspector-gutters-480.webp 480w, /images/services/photos/promo-inspector-gutters-900.webp 900w",
      alt: "Newly installed seamless aluminum gutter system and downspout inspection",
      width: 900,
      height: 600,
      caption: "Seamless gutter system with micro-mesh leaf protection.",
    },
    demoNotice:
      "Sample portfolio scope representing seamless aluminum gutter and leaf protection installation.",
  },
  {
    id: "masonry-chimney-stone-restoration",
    title: "Chimney Restoration & Architectural Stone Accents",
    category: "Masonry",
    categoryKey: "masonry",
    propertyType: "Craftsman Residence",
    summary:
      "Historic chimney brick tuckpointing, poured concrete wash crown replacement, and protective masonry sealer application.",
    description:
      "A comprehensive masonry restoration safeguarding the chimney structure against freeze-thaw spalling and water intrusion. Damaged mortar was raked out to 3/4-inch depth and repointed with breathable hydraulic lime-blend mortar. A new overhang concrete crown was poured to shed water clear of the chimney faces, complemented by stone facade accent rejuvenation.",
    scopeHighlights: [
      "Precision diamond-blade raking of deteriorated mortar joints",
      "Type N mortar tuckpointing matching original color and tooling profile",
      "Poured-in-place reinforced concrete crown with drip edge kerf",
      "Stainless steel chimney flue cap preventing spark escape and animal entry",
      "Deep-penetrating siloxane water-repellent sealer application",
    ],
    materials: [
      "High-Strength Type N Masonry Mortar",
      "Fiber-Reinforced Concrete Crown Mix",
      "Siloxane Breathable Masonry Water Repellent",
    ],
    primaryImage: {
      src: "/images/services/photos/promo-warranty-900.webp",
      srcSet:
        "/images/services/photos/promo-warranty-480.webp 480w, /images/services/photos/promo-warranty-900.webp 900w",
      alt: "Craftsman residential exterior with restored brick chimney and decorative stone accents",
      width: 900,
      height: 600,
      caption: "Restored brick chimney masonry and architectural stone accents.",
    },
    demoNotice:
      "Sample portfolio scope representing chimney tuckpointing and masonry accent restoration.",
  },
];

export function getProjectsByCategory(
  categoryKey: GalleryCategoryKey
): GalleryProject[] {
  if (categoryKey === "all") {
    return galleryProjects;
  }
  return galleryProjects.filter((p) => p.categoryKey === categoryKey);
}

export function getProjectById(id: string): GalleryProject | undefined {
  return galleryProjects.find((p) => p.id === id);
}

export function getCategoryProjectCount(categoryKey: GalleryCategoryKey): number {
  if (categoryKey === "all") {
    return galleryProjects.length;
  }
  return galleryProjects.filter((p) => p.categoryKey === categoryKey).length;
}
