import { Link } from "react-router-dom";
import { Container } from "@/components/ui";

interface Promo {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
}

/**
 * Three wide cards from the reference: Offers & Promotions, Special Financing,
 * Lifetime Warranty. CTAs link to the real resource routes implemented in
 * Sprint 1. No specific numbers (prices, APRs, year counts) are fabricated.
 */
const promos: Promo[] = [
  {
    title: "Offers & Promotions",
    body: "See current promotional pricing for roofing, siding, windows and gutters.",
    ctaLabel: "See current promotions",
    ctaTo: "/special-offers",
  },
  {
    title: "Special Financing",
    body: "Apply for financing that fits your project — details on the financing page.",
    ctaLabel: "Learn about financing",
    ctaTo: "/financing",
  },
  {
    title: "Lifetime Warranty",
    body: "Review our warranty coverage and what qualifies for lifetime protection.",
    ctaLabel: "View warranty information",
    ctaTo: "/warranties",
  },
];

export function PromotionsRow() {
  return (
    <section
      aria-label="Offers, financing and warranty"
      className="bg-[var(--color-surface-alt)]"
    >
      <Container width="wide" className="py-14 md:py-20">
        <ul className="grid gap-6 md:grid-cols-3">
          {promos.map((p) => (
            <li
              key={p.title}
              className="flex flex-col rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-xl font-bold text-[var(--color-brand-primary)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)] flex-1">
                {p.body}
              </p>
              <div className="mt-4">
                <Link
                  to={p.ctaTo}
                  className="inline-flex items-center h-11 px-5 rounded-[var(--radius-md)] bg-[var(--color-brand-accent)] text-white font-semibold hover:bg-[var(--color-brand-accent-600)]"
                >
                  {p.ctaLabel}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
