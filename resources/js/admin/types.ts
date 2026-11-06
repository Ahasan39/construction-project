/**
 * Admin domain types. All data flowing through the admin UI is sprint-6.1 mock
 * state only; shapes map cleanly to future Laravel resources so a later
 * backend wiring sprint can swap mockStore for an API client at one seam.
 */

export type PublishStatus = "draft" | "published" | "scheduled";
export type IntegrationStatus = "not_configured" | "draft" | "configured";
export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface AdminPageRow {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: PublishStatus;
  updatedAt: string;
}

export interface HomepageContent {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  emergencyBanner: string;
  estimateHeading: string;
  showServices: boolean;
  showGallery: boolean;
  showTestimonials: boolean;
}

export interface AdminServiceRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  active: boolean;
  order: number;
}

export interface AdminLocationRow {
  id: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  published: boolean;
  seoTitle: string;
  seoSummary: string;
}

export interface AdminProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  propertyType: string;
  thumbnail: string;
  summary: string;
  description: string;
  published: boolean;
  featured: boolean;
  order: number;
}

export interface AdminBlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  status: PublishStatus;
  publishedAt: string;
}

export interface AdminTestimonialRow {
  id: string;
  author: string;
  location: string;
  rating: number;
  quote: string;
  sampleContent: boolean;
}

export interface NavItemRow {
  id: string;
  label: string;
  to: string;
  group: "primary" | "about" | "footer-services" | "footer-service-areas" | "footer-resources" | "footer-company";
}

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
  status: LeadStatus;
  submittedAt: string;
}

export interface SeoPageEntry {
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
}

export interface GlobalSeo {
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  robots: string;
  sitemapUrl: string;
}

export interface GeneralSettings {
  companyName: string;
  shortDescription: string;
  locale: string;
  timezone: string;
  websiteUrl: string;
  defaultCta: string;
  businessHours: string;
}

export interface BrandingSettings {
  logoPreview: string;
  faviconPreview: string;
  primaryColor: string;
  accentColor: string;
}

export interface ContactSettings {
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  address: string;
  emergencyLabel: string;
  estimateDestination: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

export interface IntegrationState {
  pixel: {
    id: string;
    enabled: boolean;
    trackPageView: boolean;
    trackLeads: boolean;
    requireConsent: boolean;
    status: IntegrationStatus;
    savedAt: string | null;
  };
  gtm: {
    containerId: string;
    enabled: boolean;
    status: IntegrationStatus;
    savedAt: string | null;
  };
  ga4: {
    measurementId: string;
    enabled: boolean;
    trackPageView: boolean;
    trackEstimateConversion: boolean;
    status: IntegrationStatus;
    savedAt: string | null;
  };
  searchConsole: {
    siteUrl: string;
    verificationMethod: "meta-tag" | "dns" | "html-file";
    status: IntegrationStatus;
    savedAt: string | null;
  };
}
