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
  phoneDisplay: "+880 1842-299275",
  phoneHref: "tel:+8801842299275",
  email: "amamulahasan77@gmail.com",
  emailHref: "mailto:amamulahasan77@gmail.com",
  addressLines: ["Columbus, OH (HQ)"],
  social: {},
  legalLine: `© ${new Date().getFullYear()} Mr. Roof, LLC (a Crane Renovation Group Company)`,
};
