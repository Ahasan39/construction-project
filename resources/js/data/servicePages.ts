import type { ServiceKey } from "@/types";
import { locations } from "./locations";
import { isLocationServiceAvailable } from "./availability";

export type ServiceHubKey = Exclude<ServiceKey, "insulation">;
export interface ServicePhoto { file: string; alt: string }
export interface ServiceFeature {
  title: string;
  paragraphs: string[];
  photo: ServicePhoto;
  bullets?: string[];
  action?: { label: string; to: string };
}
export interface Disclosure { title: string; body: string }
export interface ServiceProduct { title: string; body: string; photo: ServicePhoto; to?: string; action?: string }
export interface ServicePageContent {
  title: string;
  eyebrow?: string;
  intro: string;
  hero: ServicePhoto;
  products?: ServiceProduct[];
  features: ServiceFeature[];
  faqs?: Disclosure[];
}

// Existing local demonstration photography, not photographs of reference projects.
const home = { file: "hero-suburban-home", alt: "Demonstration home with a shingle roof, siding and stone accents" };
const exterior = { file: "benefit-exterior-renovation", alt: "Illustrative renovated home exterior" };
const craftsman = { file: "promo-warranty", alt: "Illustrative craftsman home exterior" };
const consultant = { file: "benefit-consultant-homeowner", alt: "Illustrative homeowner consultation" };
const roofer = { file: "benefit-roofer-install", alt: "Illustrative roofer installing shingles" };
const crew = { file: "benefit-crew-working", alt: "Illustrative crew working on a pitched roof" };
const gutters = { file: "promo-inspector-gutters", alt: "Illustrative inspection of a home's gutter line" };

export const servicePages: Record<ServiceHubKey, ServicePageContent> = {
  roofing: {
    title: "Roofing Services", hero: home,
    intro: "From a persistent leak to a complete replacement, explore roofing options for your home. Compare materials, installation and warranty coverage with a clear estimate. The reference service includes replacement, repair, metal and commercial roofing, with an emphasis on efficient installation and long-term protection.",
    products: [
      { title: "Roof Replacement", body: "Plan a complete roofing system with materials, ventilation and warranty coverage considered together.", photo: home, to: "/roofing/roof-replacement/" },
      { title: "Roof Repair", body: "Identify leaks and storm damage, then discuss repairs suited to the condition of the roof.", photo: roofer, to: "/roofing/roof-repair/" },
      { title: "Metal Roofing", body: "Explore standing-seam systems, their distinctive appearance and the details of custom installation.", photo: exterior, to: "/roofing/metal-roofing/" },
      { title: "Commercial Roofing", body: "Discuss flat and sloped roofing systems, maintenance needs and the scope of your building project.", photo: crew, to: "/roofing/commercial-roofing/" },
    ],
    features: [{ title: "Making Customers Smile Since 1962", photo: consultant, paragraphs: ["A home holds the everyday moments that matter. Choosing someone to work on its roof means looking beyond the materials to the people, process and support behind the installation.", "The reference company describes a history beginning in 1962, growing from a family business into a regional exterior contractor. Its service story emphasizes workmanship, customer care and responsibility for the finished project. This history belongs to the reference company; it is not a claim about this demo."] }],
  },
  siding: {
    title: "Total Exterior Protection with Industry-Leading Siding Solutions", eyebrow: "Siding Installation and Repair Services", hero: exterior,
    intro: "Give your exterior a fresh look while planning for weather, maintenance and everyday wear. Explore vinyl, fiber cement and engineered wood, with details that bring the roof, walls and trim together.",
    products: [
      { title: "CraneBoard® Insulated Vinyl Siding", body: "An insulated vinyl option combining exterior style with a low-maintenance finish.", photo: exterior, action: "Discuss Vinyl Siding" },
      { title: "Market Square® Vinyl Siding", body: "Traditional profiles with cedar-inspired texture and a choice of exterior colors.", photo: craftsman, action: "Get a Free Estimate" },
      { title: "James Hardie® Fiber Cement", body: "A fiber cement option for homeowners comparing durability, texture and curb appeal.", photo: home, action: "Discuss Fiber Cement" },
      { title: "LP® SmartSide® Engineered Wood", body: "Wood-inspired profiles for a coordinated exterior, from lap siding to accent panels.", photo: exterior, action: "Discuss Engineered Wood" },
    ],
    features: [
      { title: "Elevate Your Curb Appeal with Premium Siding Styles", photo: exterior, paragraphs: ["The profile changes the character of a home as much as the color. Compare horizontal lines, vertical accents and textured finishes to find a combination that complements your architecture."] },
      { title: "Precision Siding Repair & Professional Restoration", photo: roofer, paragraphs: ["A damaged area does not always require a full replacement. An inspection can help distinguish isolated wear from moisture problems behind the panels and identify a practical repair plan."], bullets: ["Color matching — compare available materials with the existing finish.", "Storm assessment — document visible wind and hail damage.", "Exterior inspection — check loose panels, joints and vulnerable edges."], action: { label: "Schedule Siding Repair Inspection", to: "/free-estimate/" } },
      { title: "Complete Your Exterior with Premium Accents and Trim", photo: craftsman, paragraphs: ["Siding works with the details around it. Coordinate decorative accents with ventilation and protective trim for a consistent exterior, paying attention to transitions at windows, roof edges and foundations."], bullets: ["Stone veneer adds texture to entries, columns and foundations.", "Shutters frame windows and complement the home's proportions.", "Soffit and ventilation support airflow at the roof edge.", "Fascia and trim give edges a clean, finished appearance."] },
      { title: "Expert Exterior Color Consultation & Custom Siding Design", photo: consultant, paragraphs: ["Compare siding colors in the context of your roof, landscaping and masonry. Natural light and the size of a wall can change how a sample looks, so consider the whole exterior before choosing a finish."], action: { label: "Discuss Siding Colors", to: "/free-estimate/" } },
      { title: "Siding Color Visualizer", photo: exterior, paragraphs: ["A digital preview can help bring siding, trim and accent choices into one view. Use the reference visualizer entry to understand the design process before finalizing a project."], bullets: ["Compare the appearance of coordinated exterior materials.", "Discuss the design alongside your estimate.", "Keep a shared visual reference during planning."], action: { label: "Explore Visualizer", to: "/visualizer/" } },
    ],
    faqs: [
      { title: "How do I know if I need new siding?", body: "Loose or cracked panels, persistent fading and signs of moisture are reasons to arrange an inspection. The condition behind the siding helps determine whether repair or replacement is appropriate." },
      { title: "What siding materials do you install?", body: "The reference selection includes vinyl, fiber cement and engineered wood. Compare the appearance, upkeep and installation requirements of each material." },
      { title: "How long does a siding installation take?", body: "Timing depends on the home, material and preparation required. The project estimate should describe the expected schedule and any repairs needed before installation." },
      { title: "How much does new siding cost?", body: "Wall area, material selection, trim and underlying repairs affect the total. A measured estimate is more useful than a single price for every home." },
      { title: "Do you offer financing?", body: "The reference advertises financing subject to approval and terms. This frontend demo does not accept applications or provide financing." },
      { title: "Do you offer a warranty?", body: "Coverage varies by product and installation. Ask for written terms, exclusions and transfer requirements. No warranty is issued by this demo." },
    ],
  },
  windows: {
    title: "Window Installation by Mr. Roof", hero: home,
    intro: "Explore custom replacement windows and a coordinated installation plan. The reference features ProVia products, with options for different styles, frame designs and glazing needs. Compare comfort, appearance and maintenance before choosing windows for your home.",
    features: [
      { title: "Why Homeowners Choose Mr. Roof for Replacement Windows", photo: home, paragraphs: ["A successful installation starts with measuring each opening and ends with checking fit and operation. Consider the complete system, including the frame, glass, insulation and finishing details."], bullets: ["Custom sizing for each window opening.", "Installation experience and a clear project plan.", "Written material and labor warranty terms.", "Checks for smooth operation, insulation and security."] },
      { title: "Window Installation in Your Area", photo: craftsman, paragraphs: ["Explore regional information and discuss a project in your area. The links below use the available local service pages, or the regional hub where a window route has not yet been confirmed."] },
      { title: "The Windows We Install: ProVia", photo: exterior, paragraphs: ["The reference range includes Endure, Aeris and Aspect. Compare the frame construction, available finishes and glass packages across these product families.", "Window performance depends on the selected configuration and installation. Review the product specifications and written warranty with your estimate."], action: { label: "Discuss ProVia Window Options", to: "/free-estimate/" } },
    ],
    faqs: [
      { title: "What should I consider when choosing new windows?", body: "Consider your climate, the opening size, ventilation, appearance and maintenance. Compare the rated performance of the specific glass and frame combination." },
      { title: "Why choose professional installation?", body: "Accurate measurement, flashing, sealing and insulation all affect the finished result. A professional can assess the opening and address existing damage during installation." },
      { title: "How long does window installation take?", body: "The number of windows, opening condition and installation method determine the schedule. Ask for a project-specific timeline before work starts." },
      { title: "What is the difference between argon and krypton fills?", body: "Both gases can be used between panes to improve insulating performance. The appropriate choice depends on the glazing design, pane spacing and budget; compare whole-window ratings." },
      { title: "Why consider energy-efficient windows?", body: "Well-specified windows can reduce drafts and heat transfer and improve indoor comfort. Actual savings depend on the home, climate, installation and existing windows." },
    ],
  },
  gutters: {
    title: "Gutters & Downspouts", hero: gutters,
    intro: "Plan a drainage system that suits your roofline and directs rainwater away from the home. Compare seamless gutters, downspout placement and color options, then discuss the installation with a clear, no-obligation estimate.",
    features: [
      { title: "Affordable Gutter Installation", photo: consultant, paragraphs: ["Good drainage depends on both the product and the installation. Consider the roof area, gutter slope and discharge points alongside the appearance of the finished system."], bullets: ["Local guidance for your home and roofline.", "Experience with exterior installation details.", "A review of the finished work and drainage.", "A written scope to help compare project costs."] },
      { title: "Benefits of New Seamless Gutters", photo: exterior, paragraphs: ["Long, continuous gutter runs reduce the number of joints compared with sectional systems. Match the dimensions and finish to your roof and plan downspouts around the way water leaves the property."], bullets: ["Durable materials selected for exterior exposure.", "Colors that complement the existing exterior.", "Appropriate capacity for high-flow areas.", "Optional guards to help manage leaves and debris."] },
      { title: "Gutter Guards", photo: gutters, paragraphs: ["Guards help keep larger debris out of gutters while allowing water to enter. Compare the guard design with nearby trees, roof conditions and maintenance access. Periodic checks are still part of caring for a drainage system."], bullets: ["Reduce the buildup of leaves and twigs.", "Make routine gutter maintenance easier.", "Help discourage debris-related blockages.", "Protect drainage performance through regular inspection."] },
    ],
  },
  masonry: {
    title: "Masonry & Chimney Services", hero: craftsman,
    intro: "Explore repairs and exterior accents with attention to the existing structure. Chimneys, mortar and stone finishes need an assessment of their condition and the appropriate materials. Discuss the scope with a qualified contractor familiar with local requirements.",
    products: [
      { title: "Chimney Repair", body: "Assess damaged brickwork and discuss localized repairs or rebuilding where necessary.", photo: craftsman },
      { title: "Chimney Reline", body: "Review the condition of the liner and the requirements of a suitable replacement system.", photo: home },
      { title: "Tuckpointing", body: "Replace deteriorated mortar to restore joints and the appearance of existing masonry.", photo: exterior },
      { title: "Stone Veneer", body: "Plan a textured accent that complements the siding, entry and architectural details.", photo: craftsman },
    ],
    features: [
      { title: "Professional Masonry and Chimney Repair", photo: consultant, paragraphs: ["Masonry combines appearance with structural and weather protection details. An inspection helps identify deteriorated mortar, damaged sections and the best approach for the existing construction.", "The reference separates specialist chimney and masonry work from its other exterior services. Discuss the repair method, finish and project sequence before work begins."], bullets: ["Local guidance for the project and materials.", "Experienced assessment of existing masonry.", "Review the workmanship and finished details.", "Chimney cleaning is not included in the reference service."] },
      { title: "Stone Veneer Siding", photo: craftsman, paragraphs: ["Stone veneer can change the character of an entry, foundation or accent wall. Coordinate the texture and color with other exterior materials and plan the installation details to suit the home."] },
      { title: "3D Home Exterior Visualizer", photo: exterior, paragraphs: ["See how masonry accents could work alongside roofing, siding and windows. A visual model gives the project team a shared starting point for discussing color, texture and proportion."], bullets: ["Compare coordinated exterior material options.", "Use a visual reference when reviewing an estimate.", "Discuss changes before committing to the final design."] },
    ],
  },
};

export const roofingBenefits: Disclosure[] = [
  { title: "Transferable Lifetime Warranty", body: "The reference highlights transferable coverage for selected roofing systems. Review the written terms for eligible materials, labor, exclusions and transfer requirements. This demonstration does not issue a warranty." },
  { title: "Convenient Financing Options", body: "The reference offers payment options subject to credit approval. Review the current terms and total cost before choosing a plan. This demonstration does not provide credit or collect applications." },
  { title: "100% Accountability", body: "The reference emphasizes one point of responsibility for the roofing project. A clear scope, installation plan and final review help establish expectations from the outset." },
];

export const sidingStyles: Disclosure[] = [
  { title: "Dutchlap", body: "Horizontal lines and a shaped edge give this traditional profile its distinctive shadow." },
  { title: "Board & Batten", body: "Vertical panels and narrow battens create height and definition on walls and accents." },
  { title: "Clapboard", body: "Overlapping horizontal boards create a familiar, clean-lined exterior." },
  { title: "Shingle & Shake", body: "Textured smaller profiles add character to gables and feature walls." },
  { title: "Engineered Wood", body: "A wood-inspired finish with engineered construction for exterior applications." },
  { title: "Fiber Cement", body: "A composite siding option available in several profiles and painted finishes." },
];

/** Never invent a location × service route. Hub fallback remains explicit. */
export function serviceLocationLinks(service: ServiceKey) {
  return locations.map(location => ({
    label: `${location.city}, ${location.state}`,
    to: isLocationServiceAvailable(location.slug, service) ? `/${location.slug}/${service}/` : `/${location.slug}/`,
    isService: isLocationServiceAvailable(location.slug, service),
  }));
}
