import { locations } from "./locations";
import { hasVariantForLocationService } from "./availability";

export const roofingDetailSlugs = ["roof-replacement", "roof-repair", "metal-roofing", "commercial-roofing"] as const;
export type RoofingDetailSlug = typeof roofingDetailSlugs[number];
export interface DetailPhoto { name: string; width: number; alt: string; generated?: boolean }
export interface DetailDisclosure { title: string; body: string; link?: { label: string; to: string } }
export interface DetailFeature {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bullets?: string[];
  photo: DetailPhoto;
  disclosures?: DetailDisclosure[];
}
export interface RoofingDetail {
  slug: RoofingDetailSlug;
  title: string;
  subtitle?: string;
  intro: string;
  hero: DetailPhoto;
  features: DetailFeature[];
  faqs?: DetailDisclosure[];
}

export const detailPhotos = {
  replacement: { name: "replacement", width: 1200, alt: "Illustrative home with a complete architectural-shingle roof" },
  repair: { name: "repair", width: 640, alt: "Illustrative roofer working on asphalt shingles" },
  consultation: { name: "consultation", width: 640, alt: "Illustrative consultation outside a home" },
  crew: { name: "crew", width: 640, alt: "Illustrative roofing crew at work" },
  exterior: { name: "exterior", width: 640, alt: "Illustrative finished home exterior" },
  metal: { name: "metal", width: 1440, alt: "AI-generated illustration of a charcoal standing-seam metal roof", generated: true },
  commercial: { name: "commercial", width: 1440, alt: "AI-generated illustration of a low-slope commercial membrane roof with rooftop equipment", generated: true },
} satisfies Record<string, DetailPhoto>;

const financing: DetailDisclosure = { title: "Financing Options That Are Convenient", body: "The reference offers financing subject to eligibility and approval. Review the current payment schedule, interest and total cost with the provider. This demo does not provide credit or collect financing applications.", link: { label: "Explore financing", to: "/financing/" } };
const accountability: DetailDisclosure = { title: "100% Accountability", body: "A clear scope establishes who is responsible for the work, how questions are handled and what happens at the final inspection. Keep the written proposal and warranty terms with the project records." };
const visualizerBullets = ["Compare roof colors with siding, windows and exterior accents.", "Discuss a shared visual reference alongside the estimate.", "Review the overall design before making final material selections."];

export const roofingDetails: RoofingDetail[] = [
  {
    slug: "roof-replacement", title: "Roof Replacement", hero: detailPhotos.replacement,
    intro: "Replacing a roof is a chance to address the whole system, from the condition of the deck to the shingles, ventilation and finishing details. Start with an inspection and a written plan that explains the materials, installation sequence and warranty terms. The reference emphasizes efficient installation and a choice of roofing packages. Compare those options with the needs of your home, including appearance, weather exposure and budget. A measured estimate helps you understand what is included before choosing a new roof, and gives you a clear basis for discussing the schedule and final cleanup.",
    features: [
      { title: "Trust the Nation’s Largest Roofer", photo: detailPhotos.consultation, paragraphs: ["Reference company positioning — not a claim about this demo.", "Choosing a contractor involves more than comparing the price of shingles. Look at the proposed system, how the work is organized and what support is available afterward. A detailed proposal can help you compare the preparation, installation and finishing work included in each option."], bullets: ["Quality products — understand the materials specified for every part of the roof.", "Experience — discuss installation methods and the team responsible for the work.", "Warranty terms — review written coverage, exclusions and transfer requirements.", "Cleanup — agree how debris and loose fasteners will be collected.", "Clear pricing — compare the full scope, including any necessary deck repairs."] },
      { title: "Benefits of Roof Replacement", photo: detailPhotos.exterior, paragraphs: ["A new roof can refresh the appearance of a home while addressing aging materials and weather protection. It also gives the project team an opportunity to inspect the underlying structure, assess ventilation and coordinate the roof with gutters and other exterior details.", "Performance varies with the selected system, installation and local conditions. Compare product ratings and written coverage rather than assuming every shingle package provides the same protection."], bullets: ["Compare fastening and wind-resistance specifications.", "Review the selected system’s wind warranty.", "Consider available algae-resistance protection.", "Understand material and installation coverage.", "Plan for maintenance throughout the roof’s service life."] },
      { title: "Protection Above. And Beyond.", photo: detailPhotos.crew, paragraphs: ["A roofing project should leave you with a clear understanding of what is being installed and why. Discuss the condition of the existing roof, the recommended materials and any work needed at edges, penetrations and ventilation points.", "Planning also includes the practical details: access to the property, protection for landscaping, delivery arrangements and the sequence of the work. A shared schedule and a point of contact make it easier to raise questions as the project progresses.", "After installation, review the completed work and keep the product information and warranty documents. If you are considering financing, compare the written terms before making a commitment. The reference emphasizes communication and workmanship throughout this process; this frontend demo does not deliver roofing services or issue coverage."] },
      { title: "Roof Color Visualizer", photo: detailPhotos.replacement, paragraphs: ["An exterior preview can help you compare roofing colors and styles with the rest of your home. Consider the siding, trim, masonry and landscaping together so the roof works with the whole design. A digital image is a starting point; review physical samples and the final product specification before ordering."], bullets: visualizerBullets },
    ],
    faqs: [
      { title: "How much does a new roof cost?", body: "The roof area, pitch, access, selected system and condition of the deck affect the project price. Ask for an itemized estimate that distinguishes the planned installation from any additional repair allowances." },
      { title: "How do I know if I need a new roof?", body: "Widespread wear, recurring leaks and damaged or missing shingles are reasons to arrange an inspection. The extent and cause of the damage help determine whether targeted repairs or a full replacement make sense.", link: { label: "Explore roof repair", to: "/roofing/roof-repair/" } },
      { title: "Will insurance cover the cost of my new roof?", body: "Coverage depends on the policy, cause of damage and insurer’s assessment. Document the condition and contact your insurer for a coverage decision; an estimate is not a promise that a claim will be paid." },
    ],
  },
  {
    slug: "roof-repair", title: "Roof Repair", hero: detailPhotos.repair,
    intro: "A leak, missing shingles or storm damage needs an assessment of the cause, not just the visible symptom. Explore repair options for the affected area and ask how the work will connect with the existing roof. The reference describes inspections, upfront pricing and repair coverage as part of its service. A written scope should explain the proposed repair, the materials and any limitations related to the condition of the surrounding roof. Whether the problem is small or more extensive, understanding those details helps you decide on the next step with confidence.",
    features: [
      { title: "Local Roof Repair Specialist", photo: detailPhotos.consultation, paragraphs: ["Roof repairs begin with understanding how water is entering and which materials have been affected. Shingles, flashing, roof penetrations and surrounding details may all need inspection before the repair is planned.", "Discuss the findings and the proposed work before installation begins. A practical repair plan should identify the area being addressed, the materials to be used and the condition of the remaining roof."], bullets: ["Quality materials — select products compatible with the existing roof.", "Experience — look for a careful diagnosis of the source of the problem.", "Repair coverage — ask for the written terms and any limitations."] },
      { title: "24/7 Emergency Roofing Service", photo: detailPhotos.crew, paragraphs: ["The reference advertises emergency roofing assistance for sudden damage. An assessment can document the affected areas and identify temporary protection and follow-up repairs. Photographs and a written description can help you discuss the findings with your insurer.", "This demonstration does not dispatch emergency crews. Its contact links use the centralized demo contact, and no estimate request is sent from this site."], bullets: ["Temporary tarping and protection are part of the reference service.", "Storm inspections document visible damage and affected materials.", "Discuss permanent repairs after the immediate problem is assessed."] },
      { title: "Protection Above. And Beyond.", photo: detailPhotos.exterior, paragraphs: ["A repair should be explained in the context of the entire roof. The age of the materials, condition of nearby areas and history of leaks can all influence the recommendation. Ask what the proposed work addresses and what may still require attention.", "Clear communication helps avoid surprises. Review the scope and price, agree on access and cleanup, and retain the completed work description. The reference emphasizes a personal approach and responsibility for the project from inspection through follow-up."], disclosures: [financing, accountability] },
    ],
    faqs: [
      { title: "How much does roof repair cost?", body: "Cost depends on the location, extent and cause of the damage, along with access and material requirements. An inspection and written scope provide a better basis for comparison than a single flat price." },
      { title: "Should I repair or replace my roof?", body: "A localized problem in an otherwise sound roof may suit a repair. Widespread deterioration or repeated failures may warrant discussing replacement. An inspection should explain the evidence supporting either option.", link: { label: "Compare roof replacement", to: "/roofing/roof-replacement/" } },
      { title: "Are you able to make same day roof repairs?", body: "The reference discusses prompt repair service, but timing depends on weather, access, materials and the scope of the damage. Confirm scheduling directly with the provider. This demo does not book or dispatch repairs." },
    ],
  },
  {
    slug: "metal-roofing", title: "Metal Roofing", hero: detailPhotos.metal,
    intro: "Standing-seam roofing combines long metal panels with raised seams for a distinctive, clean-lined exterior. A successful installation depends on the roof shape, panel system and the details at ridges, edges and penetrations. Compare finishes, fastening methods and maintenance needs with an experienced installer before selecting a system. The reference presents metal roofing as a long-term option with a choice of colors and styles. Review the specific product and installation terms to understand how that choice fits your home.",
    features: [
      { title: "The Metal Roofing Pros", photo: detailPhotos.metal, paragraphs: ["Metal roofing brings together the appearance of the panels and the engineering of the complete system. Coatings, seams, fasteners and flashings all contribute to how the finished roof performs.", "An installer can explain which panel designs suit the roof’s slope and shape, how movement is accommodated and what details are needed around chimneys and other penetrations. Compare physical color samples with the exterior before settling on a finish."], bullets: ["Products — review coating, corrosion-resistance and finish specifications.", "Experience — discuss the installation details for your roof shape.", "Warranties — check separate material, finish and workmanship terms.", "Local guidance — consider weather exposure and installation requirements."] },
      { title: "Benefits of Standing Seam Metal Roofing", photo: detailPhotos.metal, paragraphs: ["Standing-seam systems offer a continuous panel appearance with raised seams running along the slope. Their durability and maintenance needs depend on the material, finish, installation and environment.", "When comparing options, consider the roof’s exposure, drainage and surrounding trees as well as its appearance. Some finishes are designed to reflect more solar energy; evaluate the product rating and the wider building envelope rather than assuming a particular energy saving.", "A clear specification helps turn these benefits into a choice suited to the home."], bullets: ["Fire-resistance characteristics", "Maintenance requirements", "Energy-performance options", "Color and finish choices", "Weather protection details", "Durability and expected service life"] },
      { title: "A Modern Look That Lasts a Lifetime", photo: detailPhotos.metal, paragraphs: ["Reference design theme; actual lifespan and coverage depend on the selected system.", "The strong lines of raised seams can suit both traditional homes and more contemporary architecture. Think about the spacing of the panels, the roof pitch and how the finish relates to siding, windows and masonry.", "Good installation details are as important as the visible surface. Ask how the design handles thermal movement, water runoff and transitions between roof areas. Review maintenance guidance and written coverage as part of the final selection."], disclosures: [financing] },
      { title: "Metal Roof Color Visualizer", photo: detailPhotos.metal, paragraphs: ["Use an exterior preview to compare a metal roof with different siding, window and trim combinations. A digital view can help explain the design during an estimate, while physical samples show how the actual finish responds to daylight."], bullets: visualizerBullets },
    ],
  },
  {
    slug: "commercial-roofing", title: "Commercial Roofing Contractors", subtitle: "Protect Your Business. Protect Your Investment.", hero: detailPhotos.commercial,
    intro: "A commercial roof protects the people, equipment and activities inside the building. Plan installation, repair and maintenance around the property’s use, access needs and operating schedule. The reference covers low-slope membrane systems, metal and steep-slope roofs, with an emphasis on clear coordination and limiting disruption. Begin with an assessment of the existing roof and a proposal that explains the options, scope and sequence of the work.",
    features: [
      { title: "Roofing for Buildings That Can’t Afford Downtime", subtitle: "Commercial Roofing Across the Midwest in Partnership with Contractors Inc.", photo: detailPhotos.commercial, paragraphs: ["Reference partnership description — no affiliation is claimed by this demo.", "Occupied apartments, offices and active businesses need a roofing plan that accounts for the people using the property. Discuss access, deliveries, protection of sensitive areas and communication with building occupants before work begins.", "The reference describes commercial membrane, metal and steep-slope expertise. A project-specific assessment should identify the existing assembly, drainage, rooftop equipment and the details needed for the selected system."], bullets: ["Quality products — specify the roof assembly and compatible accessories.", "Experience — coordinate the work around occupied commercial buildings.", "Written coverage — review the material and labor terms for the project."] },
      { title: "Commercial Roofing Services", subtitle: "Built to Last, Not Just Installed Fast.", photo: detailPhotos.commercial, paragraphs: ["The right system depends on the building, roof slope and condition of the existing assembly. A thorough assessment considers drainage, penetrations, insulation and access for future maintenance.", "Discuss the practical requirements as well as the materials: working hours, delivery space, occupant communication and the final inspection. A detailed scope helps the roof become a manageable part of the property’s maintenance plan."], bullets: ["EPDM & TPO low-slope roofing", "Metal roofing", "Shingle & steep-slope roofing", "Masonry repair & replacement", "Gutter repair & replacement"] },
    ],
    faqs: [
      { title: "Do you do multifamily roofing?", body: "The reference includes apartments and other occupied multifamily properties. A project plan should address resident communication, access, safety and the sequence of work across buildings." },
      { title: "Can I re-roof, or must the existing roof be removed?", body: "The condition of the existing assembly, moisture, number of layers and applicable requirements all affect that decision. A qualified assessment should explain whether an overlay is suitable or removal is needed." },
      { title: "How do I know if my business needs a new roof?", body: "Recurring leaks, damaged materials, moisture within the assembly and widespread deterioration are reasons to arrange an inspection. The findings help distinguish isolated repairs from a larger replacement project." },
      { title: "How long does commercial roof installation take?", body: "The area, system, access, weather and operating constraints affect the schedule. Ask for a sequence of work that identifies dependencies and how changes will be communicated." },
      { title: "What commercial roofing systems do you install?", body: "The reference lists TPO, EPDM, metal, shingle and other steep-slope systems. The specification should suit the building’s slope, drainage, insulation and use." },
      { title: "How often should roof inspections be scheduled?", body: "Follow the roof manufacturer’s maintenance guidance and the property’s inspection plan. Review the roof after significant weather events or work involving rooftop equipment, and keep records of findings and repairs." },
      { title: "Do you offer guarantees on commercial projects?", body: "The reference describes project-specific warranties. Request the written material and workmanship terms, exclusions and maintenance obligations. This demonstration does not issue guarantees." },
      { title: "What is considered commercial roofing?", body: "It covers roofing for properties such as businesses, offices, warehouses and multifamily buildings. Commercial projects can include both low-slope and steep-slope assemblies." },
      { title: "What is the most common commercial roofing type?", body: "Low-slope membranes are widely used on commercial buildings; TPO and EPDM are among the options shown by the reference. The appropriate choice depends on the building and project requirements." },
      { title: "Do I need repairs or a full replacement?", body: "Compare the extent of damage, moisture findings, remaining service life and long-term maintenance needs. A condition report should explain the reasons for the recommendation instead of relying on age alone." },
    ],
  },
];

export const roofingPackages = [
  { title: "RoofGuard", tier: "Good", product: "Oakridge®", body: "The reference’s entry package emphasizes everyday weather protection and a cost-conscious specification.", protection: "Everyday weather protection", warranty: "5-year reference warranty" },
  { title: "RoofGuard+", tier: "Better", product: "Duration®", body: "The middle reference package adds reinforced weather protection for a more demanding specification.", protection: "Reinforced weather protection", warranty: "20-year reference warranty" },
  { title: "ThunderGuard", tier: "Best", product: "Duration FLEX®", body: "The premium reference package emphasizes protection in harsher conditions and extended coverage.", protection: "Extreme weather protection", warranty: "Lifetime reference warranty" },
];
export const commercialProducts = [
  { title: "TPO Roofing", photo: detailPhotos.commercial, body: "Compare thermoplastic membrane systems for low-slope roofs, including insulation, seams and flashing details.", to: "/free-estimate/", action: "Discuss TPO Roofing" },
  { title: "EPDM Roofing", photo: detailPhotos.commercial, body: "Explore synthetic-rubber membrane assemblies and the details needed at edges and penetrations.", to: "/free-estimate/", action: "Discuss EPDM Roofing" },
  { title: "Metal Roofing", photo: detailPhotos.metal, body: "Consider panel profiles and finishes alongside the building’s roof shape and architectural character.", to: "/roofing/metal-roofing/", action: "Explore Metal Roofing" },
  { title: "Shingle & Steep Slope", photo: detailPhotos.replacement, body: "Review shingle systems for sloped roof areas and coordinate materials across the property.", to: "/roofing/roof-replacement/", action: "Explore Roof Replacement" },
];
export const commercialProcess = [
  { title: "Request a Bid & Walk the Job", body: "Begin with an on-site review of the building and its operating needs. Record measurements, visible conditions and access constraints. Use those findings to compare a written proposal describing the options, scope and assumptions." },
  { title: "Completing Your Job", body: "Coordinate materials, scheduling and site access before installation starts. Keep occupants informed, maintain a clear point of contact and document changes. Review the completed work together at the final walkthrough." },
  { title: "Post Installation Support", body: "Keep the system information, warranty documents and maintenance guidance with the property records. Arrange inspections and address issues promptly so the roof remains part of a planned maintenance program." },
];

export function findRoofingDetail(slug: string | undefined) {
  return roofingDetails.find(detail => detail.slug === slug);
}
export function roofingDetailLocationLinks(slug: RoofingDetailSlug) {
  return locations.map(location => ({ label: `${location.city}, ${location.state}`, to: hasVariantForLocationService(location.slug, "roofing", slug) ? `/${location.slug}/roofing/${slug}/` : `/${location.slug}/` }));
}
