import { Link } from "react-router-dom";
import { Container } from "@/components/ui";

interface ServiceCard {
  title: string;
  body: string;
  iconSrc: string;
  iconAlt: string;
  actions: { label: string; to: string }[];
}

const cards: ServiceCard[] = [
  {
    title: "Roofing",
    body: "We treat your emergency like our own — dispatching a local expert within 24 hours and standing behind the work for life.",
    iconSrc: "/images/services/roofing-icon.svg",
    iconAlt: "Roofing architectural illustration",
    actions: [
      { label: "Replace my roof", to: "/roofing/roof-replacement" },
      { label: "Repair my roof", to: "/roofing/roof-repair" },
    ],
  },
  {
    title: "Siding",
    body: "Pair performance siding with a neighborly design consult that makes choosing the right look for your home easy.",
    iconSrc: "/images/services/siding-icon.svg",
    iconAlt: "Siding architectural panel illustration",
    actions: [{ label: "Explore Siding", to: "/siding" }],
  },
  {
    title: "Windows",
    body: "We evaluate your home envelope specifically for high-performance windows that slash energy bills.",
    iconSrc: "/images/services/windows-icon.svg",
    iconAlt: "Window architectural illustration",
    actions: [{ label: "Explore Windows", to: "/windows" }],
  },
  {
    title: "Gutters",
    body: "Install new gutters and downspouts that keep the rain where it belongs — away from your home.",
    iconSrc: "/images/services/gutters-icon.svg",
    iconAlt: "Seamless gutter and downspout illustration",
    actions: [{ label: "Explore Gutters", to: "/gutters" }],
  },
];

/**
 * Reconstructed "Our Services" section matching the reference:
 * - 2x2 grid of modern architectural service cards.
 * - Each card displays a crisp architectural service render on the left,
 *   with title, description, and red outlined CTA buttons.
 */
export function ServiceCards() {
  return (
    <section
      aria-labelledby="services-heading"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <h2
          id="services-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-center text-[var(--color-brand-primary)] tracking-tight mb-12"
        >
          Our Services
        </h2>

        <ul className="grid gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <li
              key={c.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Architectural icon render */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-white border border-slate-200/80 p-3 shadow-inner flex items-center justify-center">
                  <img
                    src={c.iconSrc}
                    alt={c.iconAlt}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-brand-primary)]">
                    {c.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-5 border-t border-slate-200/70 flex flex-wrap gap-3">
                {c.actions.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-md border-2 border-[var(--color-brand-accent)] bg-white text-[var(--color-brand-accent)] text-xs sm:text-sm font-extrabold uppercase tracking-wide hover:bg-[var(--color-brand-accent)] hover:text-white transition-all shadow-sm"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
