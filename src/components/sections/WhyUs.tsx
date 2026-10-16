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
    imageSrc: "/images/homepage/benefit-roofer-install.webp",
    imageAlt: "Roofer installing architectural shingles with a coil nail gun",
    icon: "home",
  },
  {
    title: "Direct Answers. Decisive Action.",
    body: "We inspect thoroughly and tell you what we find straight. No sales tactics, no delays. When storm damage or age strikes, you get an honest assessment and an action plan in hours.",
    imageSrc: "/images/homepage/benefit-consultant-homeowner.webp",
    imageAlt: "Contractor discussing roof inspection on a tablet with homeowner",
    icon: "clipboard",
  },
  {
    title: "Lifetime Protection. High-Speed Service.",
    body: "Most roofs completed in a single day, backed by our non-prorated lifetime warranty. Premium materials, flawless cleanup, and a warranty that stays with the house if you move.",
    imageSrc: "/images/homepage/benefit-crew-working.webp",
    imageAlt: "Roofing crew actively working on residential roof",
    icon: "shield",
  },
  {
    title: "More Than a Roof. It's an Exterior Upgrade.",
    body: "From seamless gutters and insulated siding to energy-efficient windows, we protect and elevate your entire exterior with one accountable contractor.",
    imageSrc: "/images/homepage/benefit-exterior-renovation.webp",
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
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.5fr] items-start">
          {/* Left sticky heading */}
          <div className="lg:sticky lg:top-28">
            <h2
              id="why-us-heading"
              className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
            >
              Why{" "}
              <span className="inline-block bg-[#5BC2E7]/40 text-[var(--color-brand-primary)] px-2 py-0.5 rounded-sm">
                Mr. Roof?
              </span>
            </h2>
          </div>

          {/* Right vertical cards list */}
          <ol className="flex flex-col gap-8 sm:gap-10">
            {benefits.map((b) => (
              <li
                key={b.title}
                className="flex flex-col md:flex-row rounded-sm overflow-hidden bg-[#F4F6F8] border border-slate-200/50"
              >
                {/* Taller vertical/squared photo on left */}
                <div className="w-full md:w-72 lg:w-80 min-h-[260px] md:min-h-[300px] shrink-0 bg-slate-200">
                  <img
                    src={b.imageSrc}
                    alt={b.imageAlt}
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content on right with generous padding */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center flex-1">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-[var(--color-brand-accent)] text-white shadow-sm mb-4"
                  >
                    <BenefitIcon icon={b.icon} />
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)] leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
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
