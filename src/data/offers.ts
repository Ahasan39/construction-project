import type { Offer } from "@/types";

/**
 * Offer categories shown on the Special Offers page. These describe the kinds
 * of promotions typically run — no specific dollar amount, percentage, promo
 * code, or expiry date is quoted. Current wording and terms are discussed by
 * the team at the time of an estimate.
 */
export const offers: Offer[] = [
  {
    slug: "project-financing",
    title: "Project financing options",
    body: "Flexible monthly-payment options may be available on qualifying projects. Terms are presented in writing before any commitment.",
    disclaimer: "Approval, rate, and length are set by the lender. Ask our team for the current options that apply to your project.",
    ctaHref: "/free-estimate/",
  },
  {
    slug: "seasonal-promotions",
    title: "Seasonal promotions",
    body: "We periodically run seasonal promotions on roofing, siding, windows, gutters, and masonry work. Availability varies by service, season, and location.",
    disclaimer: "Specific wording, eligibility, and timing are confirmed during your estimate.",
    ctaHref: "/free-estimate/",
  },
];
