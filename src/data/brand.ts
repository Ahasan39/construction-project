import type { BrandContact } from "@/types";

/**
 * Centralized brand/contact information. All values here are DEMONSTRATION
 * placeholders and must be replaced with client-supplied values before launch.
 * See docs/ASSET_MANIFEST.md.
 */
export const brand: BrandContact = {
  companyName: "Example Exteriors",
  logoSrc: null,
  phoneDisplay: "(555) 010-0100",
  phoneHref: "tel:+15550100100",
  email: "info@example.com",
  addressLines: ["Address pending client confirmation"],
  social: {},
  legalLine: `© ${new Date().getFullYear()} Example Exteriors — placeholder entity`,
};
