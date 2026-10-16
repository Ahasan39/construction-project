import { assetUrl } from "@/app/assets";
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
    body: "We treat your emergency like our own—dispatching a local expert within 24 hours and standing behind the work for life, so your family stays protected without the stress.",
    iconSrc: assetUrl("/images/services/roofing-icon.svg"),
    iconAlt: "Roofing architectural illustration",
    actions: [
      { label: "Replace My Roof", to: "/roofing/roof-replacement" },
      { label: "Repair My Roof", to: "/roofing/roof-repair" },
    ],
  },
  {
    title: "Siding",
    body: "We pair performance siding with a neighborly design consult that makes choosing the appearance of your home easy, so you’ll love pulling into your driveway again.",
    iconSrc: assetUrl("/images/services/siding-icon.svg"),
    iconAlt: "Siding architectural panel illustration",
    actions: [{ label: "Replace My Siding", to: "/siding" }],
  },
  {
    title: "Windows",
    body: "We evaluate your home exterior envelope to specify high-performance windows that slash energy bills, so you see savings in the first season.",
    iconSrc: assetUrl("/images/services/windows-icon.svg"),
    iconAlt: "Window architectural illustration",
    actions: [{ label: "Replace My Windows", to: "/windows" }],
  },
  {
    title: "Gutters",
    body: "We install new gutters and downspouts that will keep the rain where it’s supposed to be and your basement dry.",
    iconSrc: assetUrl("/images/services/gutters-icon.svg"),
    iconAlt: "Seamless gutter and downspout illustration",
    actions: [{ label: "Replace My Gutters", to: "/gutters" }],
  },
];

/**
 * Reconstructed "Our Services" section matching the reference:
 * - 2x2 grid of flat light-gray architectural panels (#F4F6F8).
 * - Direct prominent architectural illustration (no rounded white inset container).
 * - Squared geometry (rounded-sm) matching mrroof.com design language.
 * - Outlined CTA buttons with red border and dark navy text (hover: red/white).
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
          className="text-3xl sm:text-4xl lg:text-[42px] font-black text-center text-[var(--color-brand-primary)] tracking-tight mb-10 sm:mb-14"
        >
          Our Services
        </h2>

        <ul className="grid gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <li
              key={c.title}
              className="flex flex-col justify-between rounded-sm bg-[#F4F6F8] border border-slate-200/60 p-6 sm:p-8 lg:p-10 shadow-none hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                {/* Architectural illustration rendered directly on panel */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
                  <img
                    src={c.iconSrc}
                    alt={c.iconAlt}
                    width={144}
                    height={144}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="text-2xl sm:text-[26px] font-black text-[var(--color-brand-primary)] tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>

              {/* Action buttons matching reference: outlined with red border */}
              <div className="mt-8 pt-6 border-t border-slate-200/80">
                <div className={`grid gap-3 ${c.actions.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {c.actions.map((a) => (
                    <Link
                      key={a.to}
                      to={a.to}
                      className="w-full inline-flex items-center justify-center h-11 sm:h-12 px-4 rounded-sm border-2 border-[var(--color-brand-accent)] bg-transparent text-[var(--color-brand-primary)] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:bg-[var(--color-brand-accent)] hover:text-white transition-colors text-center"
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

