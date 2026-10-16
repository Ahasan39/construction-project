/**
 * Core domain types. Shaped to map cleanly to a later Laravel REST / Resource
 * layer; shape is intentionally simple and JSON-serializable.
 */

export type Slug = string;

/* -------------------------------------------------------------------------
 * Brand / contact
 * ------------------------------------------------------------------------- */

export interface BrandContact {
  companyName: string;
  logoSrc: string | null;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  addressLines: string[];
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };
  legalLine: string;
}

/* -------------------------------------------------------------------------
 * Services / subservices
 * ------------------------------------------------------------------------- */

export type ServiceKey =
  | "roofing"
  | "gutters"
  | "siding"
  | "windows"
  | "masonry"
  | "insulation";

export interface Service {
  key: ServiceKey;
  slug: Slug;
  title: string;
  tagline: string;
  variants: ServiceVariant[];
}

export interface ServiceVariant {
  slug: Slug;
  title: string;
  summary: string;
}

/* -------------------------------------------------------------------------
 * Locations
 * ------------------------------------------------------------------------- */

export interface Location {
  slug: Slug;
  city: string;
  state: string;
  region: string;
  phoneDisplay?: string;
  phoneHref?: string;
  serviceAreaChildren: ServiceAreaChild[];
}

export interface ServiceAreaChild {
  slug: Slug;
  name: string;
}

/**
 * Explicit (location × service) availability. Only entries listed here produce
 * a mounted route; combinations absent from this list render as 404.
 */
export interface LocationServiceAvailability {
  locationSlug: Slug;
  serviceKey: ServiceKey;
  /** Optional service-variant slugs for this (location, service). */
  variants?: Slug[];
  /** Whether this location has its own /free-estimate/ page. */
  hasFreeEstimate?: boolean;
  /** Whether this location has its own /financing/ page. */
  hasFinancing?: boolean;
  /** Whether this location has a /service-area/ index page. */
  hasServiceAreaIndex?: boolean;
}

/* -------------------------------------------------------------------------
 * Offers / financing / warranty
 * ------------------------------------------------------------------------- */

export interface Offer {
  slug: Slug;
  title: string;
  body: string;
  disclaimer: string;
  ctaHref: string;
}

/* -------------------------------------------------------------------------
 * Reviews
 * ------------------------------------------------------------------------- */

export interface Review {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: string;
  cityState?: string;
  serviceKey?: ServiceKey;
  body: string;
  isPlaceholder?: boolean;
}

/* -------------------------------------------------------------------------
 * Blog
 * ------------------------------------------------------------------------- */

export interface ArticleSummary {
  slug: Slug;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  thumbnailSrc: string | null;
}

export interface Article extends ArticleSummary {
  bodyHtml: string;
  isPlaceholder: true;
}

/* -------------------------------------------------------------------------
 * Navigation
 * ------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  to: string;
  external?: boolean;
  children?: NavItem[];
}

/* -------------------------------------------------------------------------
 * Lead form
 * ------------------------------------------------------------------------- */

export type ServiceAreaRegionKey =
  | "south-east-michigan"
  | "grand-rapids-area"
  | "nashville-area"
  | "cincinnati-area"
  | "cleveland-area"
  | "dayton-area"
  | "louisville-area"
  | "lansing-area"
  | "lexington-area";

export interface LeadFormPayload {
  name: string;
  phone: string;
  email: string;
  regionKey: ServiceAreaRegionKey;
  serviceKey: ServiceKey;
  consentReminders: boolean;
  consentPromotions: boolean;
}

export type LeadFormResult =
  | { status: "success"; demo: true; message: string }
  | { status: "error"; message: string };

/* -------------------------------------------------------------------------
 * Route metadata (SEO)
 * ------------------------------------------------------------------------- */

export interface RouteMeta {
  title: string;
  description: string;
  /** Path component appended to the canonical origin; starts with "/". */
  canonicalPath: string;
  noindex?: boolean;
}
