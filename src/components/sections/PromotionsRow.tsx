import { Link } from "react-router-dom";
import { Container } from "@/components/ui";

interface Promo {
  title: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
  ctaTo: string;
  icon: "tag" | "card" | "shield";
}

const promos: Promo[] = [
  {
    title: "Offers & Promotions",
    imageSrc: "/images/homepage/promo-offers.jpg",
    imageAlt: "Inspector checking roofline and gutters with safety gear",
    ctaLabel: "Get Special Promotions",
    ctaTo: "/special-offers",
    icon: "tag",
  },
  {
    title: "Special Financing",
    imageSrc: "/images/homepage/promo-financing.jpg",
    imageAlt: "Consultant showing project estimate on tablet to homeowner",
    ctaLabel: "Learn About Financing",
    ctaTo: "/financing",
    icon: "card",
  },
  {
    title: "Lifetime Warranty",
    imageSrc: "/images/homepage/promo-warranty.jpg",
    imageAlt: "Pronged residential exterior with premium architectural shingles",
    ctaLabel: "View Warranty Protection",
    ctaTo: "/warranties",
    icon: "shield",
  },
];

function PromoIcon({ icon }: { icon: Promo["icon"] }) {
  switch (icon) {
    case "tag":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "card":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
  }
}

/**
 * Reconstructed PromotionsRow matching the reference's 3-card photo + navy banner + red CTA:
 * - High-resolution job-site photography on top.
 * - Integrated dark navy banner with badge icon and promotion title.
 * - Full-width bright red call-to-action button pinned at the bottom.
 */
export function PromotionsRow() {
  return (
    <section
      aria-label="Offers, financing and warranty"
      className="bg-slate-50/70 border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {promos.map((p) => (
            <li
              key={p.title}
              className="flex flex-col rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200/80 group hover:shadow-xl transition-all duration-300"
            >
              {/* Photo top */}
              <div className="h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Dark navy title banner */}
              <div className="bg-[var(--color-brand-primary)] text-white py-3.5 px-4 flex items-center justify-center gap-2.5 font-black text-base sm:text-lg tracking-tight">
                <span className="text-[#00a3e0]" aria-hidden="true">
                  <PromoIcon icon={p.icon} />
                </span>
                <span>{p.title}</span>
              </div>

              {/* Bright red button */}
              <Link
                to={p.ctaTo}
                className="block w-full py-3.5 px-4 bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-600)] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center transition-colors shadow-inner"
              >
                {p.ctaLabel}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
