import { assetUrl } from "@/app/assets";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

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
    imageSrc: assetUrl("/images/homepage/promo-offers.webp"),
    imageAlt: "Inspector checking roofline and gutters with safety gear",
    ctaLabel: "See Current Promotions",
    ctaTo: "/special-offers",
    icon: "tag",
  },
  {
    title: "Special Financing",
    imageSrc: assetUrl("/images/homepage/promo-financing.webp"),
    imageAlt: "Consultant showing project estimate on tablet to homeowner",
    ctaLabel: "Learn About Financing",
    ctaTo: "/financing",
    icon: "card",
  },
  {
    title: "Lifetime Warranty",
    imageSrc: assetUrl("/images/homepage/promo-warranty.webp"),
    imageAlt: "Pronged residential exterior with premium architectural shingles",
    ctaLabel: "View Warranty Information",
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
 * Reconstructed PromotionsRow matching the reference:
 * - 3-card photo + navy panel + inset red button + cyan bottom accent:
 * - Photography above.
 * - Deep navy title & action area (#0C1F33).
 * - Smaller red button inset within the navy area (not edge-to-edge).
 * - Thin blue lower accent line (#00A3E0).
 */
export function PromotionsRow() {
  return (
    <section
      aria-label="Offers, financing and warranty"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {promos.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delayMs={80 * i}
              className="flex flex-col rounded-sm overflow-hidden bg-[#0C1F33] border border-slate-700/40 shadow-md group hover:shadow-xl hover-lift"
            >
              {/* Photo top */}
              <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-800">
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

              {/* Deep navy lower panel with inset CTA */}
              <div className="p-6 sm:p-7 flex flex-col justify-between items-center flex-1 text-white">
                <div className="flex items-center justify-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-white mb-6">
                  <span className="text-[#00A3E0]" aria-hidden="true">
                    <PromoIcon icon={p.icon} />
                  </span>
                  <span>{p.title}</span>
                </div>

                {/* Smaller red button inset within navy area */}
                <Link
                  to={p.ctaTo}
                  className="w-full max-w-[280px] py-3.5 px-6 rounded-sm bg-[#D9232A] hover:bg-[#B81B22] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center transition-colors shadow-sm"
                >
                  {p.ctaLabel}
                </Link>
              </div>

              {/* Thin cyan/blue lower accent line */}
              <div className="h-1 bg-[#00A3E0] w-full" aria-hidden="true" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

