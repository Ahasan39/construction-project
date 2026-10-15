import { Container } from "@/components/ui";

interface Benefit {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  icon: "home" | "clipboard" | "shield" | "upgrade";
}

const benefits: Benefit[] = [
  {
    title: "60+ Years, 500,000+ Installs, 1,500+ Five-Star Reviews.",
    body: "Headquartered in Columbus with a footprint across the Midwest, we've spent over six decades perfecting the art of roof and exterior renovation.",
    imageSrc: "/images/homepage/benefit-roofer-install.jpg",
    imageAlt: "Roofer installing architectural shingles with a coil nail gun",
    icon: "home",
  },
  {
    title: "Direct Answers. Decisive Action.",
    body: "We inspect thoroughly and tell you what we find straight. No sales tactics, no delays. When storm damage or age strikes, you get an honest assessment and an action plan in hours.",
    imageSrc: "/images/homepage/benefit-consultant-homeowner.jpg",
    imageAlt: "Contractor discussing roof inspection on a tablet with homeowner",
    icon: "clipboard",
  },
  {
    title: "Lifetime Protection. High-Speed Service.",
    body: "Most roofs completed in a single day, backed by our non-prorated lifetime warranty. Premium materials, flawless cleanup, and a warranty that stays with the house if you move.",
    imageSrc: "/images/homepage/benefit-crew-working.jpg",
    imageAlt: "Roofing crew actively working on residential roof",
    icon: "shield",
  },
  {
    title: "More Than a Roof. It's an Exterior Upgrade.",
    body: "From seamless gutters and insulated siding to energy-efficient windows, we protect and elevate your entire exterior with one accountable contractor.",
    imageSrc: "/images/homepage/benefit-exterior-renovation.jpg",
    imageAlt: "Beautiful completed residential home with new siding, roof and windows",
    icon: "upgrade",
  },
];

function BenefitIcon({ icon }: { icon: Benefit["icon"] }) {
  switch (icon) {
    case "home":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "upgrade":
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
  }
}

/**
 * "Why Mr. Roof?" section — faithfully reconstructed to mirror the reference layout:
 * - Two-column desktop grid: Left column features a sticky "Why Mr. Roof?" heading
 *   with sky-blue underline accent.
 * - Right column features four stacked benefit cards, each displaying high-resolution
 *   on-site photography on the left, and a red square badge icon, bold headline,
 *   and descriptive copy on the right.
 */
export function WhyUs() {
  return (
    <section
      aria-labelledby="why-us-heading"
      className="bg-slate-50/70 border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.5fr] items-start">
          {/* Left sticky heading */}
          <div className="lg:sticky lg:top-28">
            <h2
              id="why-us-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)]"
            >
              Why{" "}
              <span className="relative inline-block text-[var(--color-brand-primary)]">
                Mr. Roof?
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#00a3e0]"
                  viewBox="0 0 120 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7.5C30 2.5 90 2.5 118 7.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed hidden lg:block">
              Proven craftsmanship, transparent communication, and industry-leading warranties
              that give you complete confidence.
            </p>
          </div>

          {/* Right vertical cards list */}
          <ol className="flex flex-col gap-6 sm:gap-8">
            {benefits.map((b) => (
              <li
                key={b.title}
                className="flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Real photo on left */}
                <div className="w-full sm:w-56 md:w-64 h-48 sm:h-44 shrink-0 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={b.imageSrc}
                    alt={b.imageAlt}
                    width={500}
                    height={380}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Content on right */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--color-brand-accent)] text-white shadow-sm"
                    >
                      <BenefitIcon icon={b.icon} />
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-brand-primary)] leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
