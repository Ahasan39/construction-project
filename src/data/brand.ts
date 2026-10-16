import { assetUrl } from "@/app/assets";
import type { BrandContact } from "@/types";

/**
 * Centralized brand/contact information. All values here are DEMONSTRATION
 * placeholders and must be replaced with client-supplied values before launch.
 * See docs/ASSET_MANIFEST.md.
 */
export const brand: BrandContact = {
  companyName: "Mr. Roof",
  logoSrc: assetUrl("/images/logo.svg"),
  phoneDisplay: "(877) 766-7663",
  phoneHref: "tel:+18777667663",
  email: "info@mrroof.com",
  addressLines: ["Columbus, OH (HQ)"],
  social: {},
  legalLine: `© ${new Date().getFullYear()} Mr. Roof, LLC (a Crane Renovation Group Company)`,
};
