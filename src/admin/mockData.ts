/**
 * Sprint 6.1 demo-only seed data for the admin UI. Nothing here is sourced
 * from a real backend; everything is clearly labelled as sample content so
 * the UI can be reviewed before Laravel/MySQL wiring begins.
 */
import { brand } from "@/data/brand";
import { services } from "@/data/services";
import { locations } from "@/data/locations";
import { galleryProjects } from "@/data/galleryProjects";
import type {
  AdminBlogRow,
  AdminLead,
  AdminLocationRow,
  AdminPageRow,
  AdminProjectRow,
  AdminServiceRow,
  AdminTestimonialRow,
  BrandingSettings,
  ContactSettings,
  GeneralSettings,
  GlobalSeo,
  HomepageContent,
  IntegrationState,
  NavItemRow,
  SeoPageEntry,
} from "./types";

export const initialHomepage: HomepageContent = {
  heroEyebrow: "Trusted exterior construction",
  heroHeading: "Roofing, siding, windows, gutters & masonry — done right.",
  heroDescription:
    "Mr. Roof provides exterior construction services across Ohio, Michigan, Indiana, and Tennessee. Request a free, no-pressure estimate.",
  heroImage: "/images/homepage/hero-suburban-home.webp",
  primaryCtaLabel: "Request a Free Estimate",
  primaryCtaHref: "/free-estimate",
  emergencyBanner: "Storm damage? Call our emergency line 24/7.",
  estimateHeading: "Get a free, honest estimate",
  showServices: true,
  showGallery: true,
  showTestimonials: true,
};

export const initialPages: AdminPageRow[] = [
  { id: "p-home", title: "Homepage", slug: "/", type: "Landing", status: "published", updatedAt: "2026-10-18" },
  { id: "p-about", title: "About", slug: "/about", type: "Standard", status: "published", updatedAt: "2026-10-12" },
  { id: "p-financing", title: "Financing", slug: "/financing", type: "Standard", status: "published", updatedAt: "2026-10-14" },
  { id: "p-warranties", title: "Warranties", slug: "/warranties", type: "Standard", status: "published", updatedAt: "2026-10-14" },
  { id: "p-reviews", title: "Reviews", slug: "/reviews", type: "Standard", status: "published", updatedAt: "2026-10-10" },
  { id: "p-gallery", title: "Gallery", slug: "/gallery", type: "Index", status: "published", updatedAt: "2026-10-20" },
  { id: "p-contact", title: "Contact Us", slug: "/contact-us", type: "Standard", status: "published", updatedAt: "2026-10-11" },
  { id: "p-careers", title: "Sales Careers", slug: "/careers/sales", type: "Standard", status: "published", updatedAt: "2026-09-28" },
  { id: "p-privacy", title: "Privacy Policy", slug: "/privacy-policy", type: "Legal", status: "published", updatedAt: "2026-09-28" },
  { id: "p-terms", title: "Terms & Conditions", slug: "/terms-and-conditions", type: "Legal", status: "published", updatedAt: "2026-09-28" },
  { id: "p-blog", title: "Blog", slug: "/blog", type: "Index", status: "published", updatedAt: "2026-10-19" },
  { id: "p-offers", title: "Special Offers", slug: "/special-offers", type: "Standard", status: "draft", updatedAt: "2026-10-21" },
];

export const initialServices: AdminServiceRow[] = services.map((s, i) => ({
  id: `svc-${s.key}`,
  name: s.title,
  slug: s.slug,
  description: s.tagline,
  thumbnail: `/images/services/photos/${s.slug}-900.webp`,
  active: true,
  order: i + 1,
}));

export const initialLocations: AdminLocationRow[] = locations.map((l) => ({
  id: `loc-${l.slug}`,
  name: l.city,
  slug: l.slug,
  state: l.state,
  region: l.region,
  published: true,
  seoTitle: `${l.city}, ${l.state} roofing & exterior construction — Mr. Roof`,
  seoSummary: `Exterior construction services in ${l.city}, ${l.state}. Roofing, siding, windows, gutters, and masonry.`,
}));

export const initialProjects: AdminProjectRow[] = galleryProjects.map((p, i) => ({
  id: p.id,
  title: p.title,
  slug: p.id,
  category: p.category,
  propertyType: p.propertyType,
  thumbnail: p.primaryImage.src,
  summary: p.summary,
  description: p.description,
  published: true,
  featured: i < 3,
  order: i + 1,
}));

export const initialBlogPosts: AdminBlogRow[] = [
  { id: "b-1", title: "How to inspect your roof after a storm", slug: "inspect-roof-after-storm", excerpt: "Sample article summary. Walk the exterior perimeter, look for granules and bent flashings.", author: "Mr. Roof Team", status: "published", publishedAt: "2026-09-14" },
  { id: "b-2", title: "Choosing seamless aluminum gutters", slug: "choosing-seamless-aluminum-gutters", excerpt: "Sample article summary. Gauge, color-coat durability, and expansion joints.", author: "Mr. Roof Team", status: "published", publishedAt: "2026-08-30" },
  { id: "b-3", title: "Energy-efficient replacement windows checklist", slug: "replacement-windows-checklist", excerpt: "Sample draft. U-factor, SHGC, and installation flashing details.", author: "Mr. Roof Team", status: "draft", publishedAt: "" },
];

export const initialTestimonials: AdminTestimonialRow[] = [
  { id: "t-1", author: "Sample Homeowner A", location: "Columbus, OH", rating: 5, quote: "Sample content — crew showed up on time and finished the tear-off and reroof in two days.", sampleContent: true },
  { id: "t-2", author: "Sample Homeowner B", location: "Ann Arbor, MI", rating: 5, quote: "Sample content — gutters and downspouts installed cleanly.", sampleContent: true },
  { id: "t-3", author: "Sample Homeowner C", location: "Lansing, MI", rating: 4, quote: "Sample content — pricing was fair and the quote was itemized.", sampleContent: true },
];

export const initialNav: NavItemRow[] = [
  { id: "n-1", label: "Roofing", to: "/roofing", group: "primary" },
  { id: "n-2", label: "Gutters", to: "/gutters", group: "primary" },
  { id: "n-3", label: "Siding", to: "/siding", group: "primary" },
  { id: "n-4", label: "Windows", to: "/windows", group: "primary" },
  { id: "n-5", label: "Masonry", to: "/masonry", group: "primary" },
  { id: "n-6", label: "Gallery", to: "/gallery", group: "primary" },
  { id: "n-7", label: "About", to: "/about", group: "primary" },
  { id: "a-1", label: "Special Offers", to: "/special-offers", group: "about" },
  { id: "a-2", label: "Pay My Bill", to: "/billpay", group: "about" },
  { id: "a-3", label: "Financing", to: "/financing", group: "about" },
  { id: "a-4", label: "Warranties", to: "/warranties", group: "about" },
  { id: "a-5", label: "Visualizer", to: "/visualizer", group: "about" },
  { id: "a-6", label: "Refer a Friend", to: "/refer-a-friend", group: "about" },
  { id: "a-7", label: "Customer Reviews", to: "/reviews", group: "about" },
  { id: "a-8", label: "Sales Careers", to: "/careers/sales", group: "about" },
  { id: "a-9", label: "Blog", to: "/blog", group: "about" },
  { id: "a-10", label: "Contact Us", to: "/contact-us", group: "about" },
  { id: "a-11", label: "Commercial Projects", to: "/commercial-projects", group: "about" },
  { id: "fs-1", label: "Roofing", to: "/roofing", group: "footer-services" },
  { id: "fs-2", label: "Gutters", to: "/gutters", group: "footer-services" },
  { id: "fs-3", label: "Siding", to: "/siding", group: "footer-services" },
  { id: "fs-4", label: "Windows", to: "/windows", group: "footer-services" },
  { id: "fs-5", label: "Masonry", to: "/masonry", group: "footer-services" },
];

export const initialLeads: AdminLead[] = [
  { id: "l-001", name: "Sample Lead 001", phone: "+1 555-0100", email: "sample.lead.001@example.com", service: "Roofing", location: "Columbus, OH", message: "DEMO ENQUIRY — Interested in roof replacement, approx 2200 sqft home.", status: "new", submittedAt: "2026-10-22 09:14" },
  { id: "l-002", name: "Sample Lead 002", phone: "+1 555-0101", email: "sample.lead.002@example.com", service: "Gutters", location: "Ann Arbor, MI", message: "DEMO ENQUIRY — Need gutters replaced after a windstorm.", status: "contacted", submittedAt: "2026-10-21 16:03" },
  { id: "l-003", name: "Sample Lead 003", phone: "+1 555-0102", email: "sample.lead.003@example.com", service: "Siding", location: "Lansing, MI", message: "DEMO ENQUIRY — Looking at fiber-cement siding, want a quote.", status: "quoted", submittedAt: "2026-10-20 10:47" },
  { id: "l-004", name: "Sample Lead 004", phone: "+1 555-0103", email: "sample.lead.004@example.com", service: "Windows", location: "Nashville, TN", message: "DEMO ENQUIRY — 12 double-hung replacement windows.", status: "won", submittedAt: "2026-10-18 14:12" },
  { id: "l-005", name: "Sample Lead 005", phone: "+1 555-0104", email: "sample.lead.005@example.com", service: "Masonry", location: "Dayton, OH", message: "DEMO ENQUIRY — Chimney re-point and crown repair.", status: "new", submittedAt: "2026-10-17 11:30" },
  { id: "l-006", name: "Sample Lead 006", phone: "+1 555-0105", email: "sample.lead.006@example.com", service: "Roofing", location: "Toledo, OH", message: "DEMO ENQUIRY — Leak repair above garage.", status: "lost", submittedAt: "2026-10-15 08:55" },
  { id: "l-007", name: "Sample Lead 007", phone: "+1 555-0106", email: "sample.lead.007@example.com", service: "Roofing", location: "Indianapolis, IN", message: "DEMO ENQUIRY — Hail damage inspection.", status: "new", submittedAt: "2026-10-23 07:22" },
];

export const initialSeoPages: SeoPageEntry[] = [
  { path: "/", title: "Mr. Roof — Roofing, Gutters, Siding, Windows, Masonry", description: "Trusted exterior construction across OH, MI, IN, TN. Free estimates.", canonical: "https://ahasan39.github.io/construction-project/", noindex: false },
  { path: "/roofing", title: "Roofing — Mr. Roof", description: "Roof replacement, repair, metal, and commercial roofing.", canonical: "https://ahasan39.github.io/construction-project/roofing/", noindex: false },
  { path: "/gutters", title: "Gutters — Mr. Roof", description: "Seamless aluminum gutters and guards.", canonical: "https://ahasan39.github.io/construction-project/gutters/", noindex: false },
  { path: "/siding", title: "Siding — Mr. Roof", description: "Vinyl and fiber-cement exterior cladding.", canonical: "https://ahasan39.github.io/construction-project/siding/", noindex: false },
  { path: "/windows", title: "Windows — Mr. Roof", description: "Energy-efficient replacement windows.", canonical: "https://ahasan39.github.io/construction-project/windows/", noindex: false },
  { path: "/masonry", title: "Masonry — Mr. Roof", description: "Chimney, brick, and stone work.", canonical: "https://ahasan39.github.io/construction-project/masonry/", noindex: false },
  { path: "/gallery", title: "Project Gallery — Mr. Roof", description: "Representative exterior construction projects.", canonical: "https://ahasan39.github.io/construction-project/gallery/", noindex: false },
  { path: "/free-estimate", title: "Free Estimate — Mr. Roof", description: "Request a free, no-pressure exterior construction estimate.", canonical: "https://ahasan39.github.io/construction-project/free-estimate/", noindex: false },
];

export const initialGlobalSeo: GlobalSeo = {
  defaultTitle: "Mr. Roof — Exterior Construction",
  defaultDescription: "Roofing, gutters, siding, windows, and masonry across Ohio, Michigan, Indiana, and Tennessee.",
  defaultOgImage: "/images/homepage/hero-suburban-home.webp",
  robots: "index,follow",
  sitemapUrl: "https://ahasan39.github.io/construction-project/sitemap.xml",
};

export const initialGeneralSettings: GeneralSettings = {
  companyName: brand.companyName,
  shortDescription: "Exterior construction across OH, MI, IN, TN.",
  locale: "en-US",
  timezone: "America/New_York",
  websiteUrl: "https://ahasan39.github.io/construction-project/",
  defaultCta: "Request a Free Estimate",
  businessHours: "Mon–Fri 8:00 AM – 6:00 PM, Sat 9:00 AM – 2:00 PM",
};

export const initialBranding: BrandingSettings = {
  logoPreview: brand.logoSrc ?? "",
  faviconPreview: "/favicon.ico",
  primaryColor: "#0f2231",
  accentColor: "#d9232a",
};

export const initialContact: ContactSettings = {
  primaryPhone: brand.phoneDisplay,
  secondaryPhone: "",
  email: brand.email,
  address: brand.addressLines.join(", "),
  emergencyLabel: "Storm damage? Call our emergency line 24/7.",
  estimateDestination: "/free-estimate",
  social: {
    facebook: brand.social.facebook ?? "",
    instagram: brand.social.instagram ?? "",
    linkedin: brand.social.linkedin ?? "",
    youtube: brand.social.youtube ?? "",
  },
};

export const initialIntegrations: IntegrationState = {
  pixel: { id: "", enabled: false, trackPageView: true, trackLeads: true, requireConsent: true, status: "not_configured", savedAt: null },
  gtm: { containerId: "", enabled: false, status: "not_configured", savedAt: null },
  ga4: { measurementId: "", enabled: false, trackPageView: true, trackEstimateConversion: true, status: "not_configured", savedAt: null },
  searchConsole: { siteUrl: "https://ahasan39.github.io/construction-project/", verificationMethod: "meta-tag", status: "not_configured", savedAt: null },
};
