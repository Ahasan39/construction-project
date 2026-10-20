import { Link } from "react-router-dom";
import { assetUrl } from "@/app/assets";
import { Container, SmartLink } from "@/components/ui";
import { brand } from "@/data/brand";
import { services } from "@/data/services";
import { EstimateForm } from "@/features/estimate/EstimateForm";
import type { LocationPageContent, LocationReasonList, LocationOverview } from "@/data/locationPages";
import type { Location, ServiceKey } from "@/types";

const serviceImages: Record<ServiceKey, { file: string; alt: string }> = {
  roofing: { file: "hero-suburban-home", alt: "Residential home with new architectural shingle roof" },
  siding: { file: "benefit-exterior-renovation", alt: "Home exterior with new siding and trim" },
  windows: { file: "promo-warranty", alt: "Residential home with replacement windows" },
  gutters: { file: "promo-inspector-gutters", alt: "Gutter line and downspouts along a residential roof" },
  masonry: { file: "benefit-exterior-renovation", alt: "Masonry accents on a home exterior" },
  insulation: { file: "benefit-consultant-homeowner", alt: "Consultant discussing insulation options with a homeowner" },
};

/** Hero with local heading, demo contact row and preselected estimate form. */
export function LocationHero({ content, location }: { content: LocationPageContent; location: Location }) {
  return (
    <section
      aria-label={`${location.city} hero`}
      className="bg-white border-b border-[var(--color-border)] relative overflow-hidden"
    >
      <Container width="wide" className="py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.45fr_1fr] items-stretch">
          <div className="flex flex-col justify-between rounded-sm overflow-hidden border border-slate-200/90 bg-gradient-to-b from-[#EBF3FA] via-[#E2EEF8] to-[#D5E6F5] shadow-sm">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                {content.hero.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-black leading-[1.1] tracking-tight text-[var(--color-brand-primary)] [overflow-wrap:anywhere]">
                {content.hero.heading}
                {content.hero.headingHighlight && (
                  <>
                    {" "}
                    <span className="inline-block bg-[#5BC2E7]/40 text-[var(--color-brand-primary)] px-2 py-0.5 rounded-sm">
                      {content.hero.headingHighlight}
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed max-w-xl">
                {content.hero.description}
              </p>
            </div>

            <div className="w-full overflow-hidden bg-slate-200">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${assetUrl("/images/homepage/hero-suburban-home-mobile.webp")} 480w, ${assetUrl("/images/homepage/hero-suburban-home.webp")} 960w`}
                  sizes="(max-width: 768px) 100vw, 680px"
                />
                <img
                  src={assetUrl("/images/homepage/hero-suburban-home.webp")}
                  alt={`Representative demonstration home for ${location.city}, ${location.state}`}
                  width={1200}
                  height={670}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover"
                />
              </picture>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-slate-200">
              <div className="bg-[#EEF2F6] px-6 py-4 sm:py-5 flex flex-col justify-center">
                <span className="text-base sm:text-lg font-black text-[var(--color-brand-primary)] leading-tight [overflow-wrap:anywhere]">
                  {content.hero.emergencyPrompt}
                </span>
                <Link
                  to="/free-estimate"
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[var(--color-brand-accent)] transition-colors mt-0.5 inline-block focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                >
                  Contact Us
                </Link>
              </div>
              <div className="bg-[#DEE4EB] px-6 py-4 sm:py-5 flex items-center justify-start gap-3">
                <span className="text-[var(--color-brand-accent)] text-xl" aria-hidden="true">📞</span>
                <SmartLink
                  to={brand.phoneHref}
                  external
                  className="text-lg sm:text-xl font-black text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)] transition-colors"
                >
                  {brand.phoneDisplay}
                </SmartLink>
              </div>
            </div>
          </div>

          <aside
            id="estimate"
            aria-label={`Request a free estimate — ${location.city}`}
            className="rounded-sm bg-[#0C1F33] text-white p-6 sm:p-7 shadow-md border border-slate-800 flex flex-col justify-between scroll-mt-28 lg:scroll-mt-32"
          >
            <div>
              <div className="pb-3 mb-4">
                <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-white leading-tight">
                  Peace of Mind Starts Here.
                </h2>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  Request a free estimate for {location.city}, {location.state}.
                </p>
              </div>
              <EstimateForm
                variant="inverse"
                submitLabel="Get a FREE ESTIMATE"
                lockedRegion={content.defaultRegionKey}
              />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Demo only — no response sent</span>
              <Link
                to="/free-estimate"
                className="text-slate-300 hover:text-white underline underline-offset-2 font-medium"
              >
                Standalone form →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/** Four stat tiles with the reference statement clearly disclaimed. */
export function LocationTrust() {
  const items = [
    { v: "#1", l: "Consumer Choice (reference, 20+ years running)" },
    { v: "A+", l: "BBB rating (reference credential)" },
    { v: "500k+", l: "Satisfied customers (reference figure)" },
    { v: "60+", l: "Years in business (reference figure)" },
  ];
  return (
    <section
      aria-label="Reference company indicators"
      className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-10 sm:py-12">
        <p className="text-xs text-slate-600 text-center mb-6">
          Reference company statistics — not claims about this demo.
        </p>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {items.map((i) => (
            <li key={i.v} className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-[var(--color-brand-accent)] leading-none">{i.v}</span>
              <span className="mt-2 text-xs sm:text-sm text-slate-700 font-semibold max-w-[14ch] mx-auto">{i.l}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Local offers / financing / warranty — thin wrapper over the homepage look. */
export function LocationOffers({ location }: { location: Location }) {
  const promos = [
    {
      title: "$1,000 Off a New Roof",
      body: "Reference promotion highlighted on the live site. This demo does not sell, bill or redeem offers.",
      cta: "See Current Promotions",
      to: "/special-offers",
      img: "promo-offers",
    },
    {
      title: "Special Financing",
      body: "0% interest for 18 months on qualifying projects (reference promotion). Subject to approved credit.",
      cta: "Learn About Financing",
      to: "/financing",
      img: "promo-financing",
    },
    {
      title: "Lifetime Warranty",
      body: "Non-prorated, transferable coverage described by the reference. No warranty is issued by this demo.",
      cta: "View Warranty Information",
      to: "/warranties",
      img: "promo-warranty",
    },
  ];
  return (
    <section
      aria-label={`Current ${location.city} offers`}
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[var(--color-brand-primary)] tracking-tight mb-8">
          Current {location.city} Offers
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {promos.map((p) => (
            <li key={p.title} className="flex flex-col rounded-sm overflow-hidden bg-[#0C1F33] border border-slate-700/40 shadow-md">
              <div className="h-48 sm:h-56 w-full overflow-hidden bg-slate-800">
                <img
                  src={assetUrl(`/images/homepage/${p.img}.webp`)}
                  alt={p.title}
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1 text-white">
                <h3 className="font-black text-lg text-white">{p.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed flex-1 [overflow-wrap:anywhere]">{p.body}</p>
                <Link
                  to={p.to}
                  className="w-full max-w-[280px] mx-auto py-3 px-6 rounded-sm bg-[#D9232A] hover:bg-[#B81B22] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {p.cta}
                </Link>
              </div>
              <div className="h-1 bg-[#00A3E0] w-full" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Local 6-up service grid. Links use availability-aware service routes. */
export function LocationServiceGrid({
  content,
  location,
  isServiceAvailable,
}: {
  content: LocationPageContent;
  location: Location;
  isServiceAvailable: (service: ServiceKey) => boolean;
}) {
  return (
    <section
      aria-label={`${location.city} services`}
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-center text-[var(--color-brand-primary)] tracking-tight max-w-3xl mx-auto">
          {content.serviceGrid.heading}
        </h2>
        {content.serviceGrid.intro && (
          <p className="mt-4 text-center text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {content.serviceGrid.intro}
          </p>
        )}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.serviceGrid.services.map((key) => {
            const service = services.find((s) => s.key === key);
            const title = service?.title ?? key;
            const image = serviceImages[key];
            const to = isServiceAvailable(key)
              ? `/${location.slug}/${key}/`
              : `/${key}/`;
            const scoped = isServiceAvailable(key);
            return (
              <li
                key={key}
                className="flex flex-col rounded-sm bg-[#F4F6F8] border border-slate-200/60 overflow-hidden hover:border-slate-300 transition-colors"
              >
                <div className="h-40 bg-slate-200 overflow-hidden">
                  <img
                    src={assetUrl(`/images/homepage/${image.file}.webp`)}
                    alt={image.alt}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-xl font-black text-[var(--color-brand-primary)] tracking-tight">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 [overflow-wrap:anywhere]">
                    {scoped
                      ? `${title} services for ${location.city} and surrounding communities.`
                      : `Explore ${title} services from the regional hub.`}
                  </p>
                  <Link
                    to={to}
                    className="w-full inline-flex items-center justify-center h-11 px-4 rounded-sm border-2 border-[var(--color-brand-accent)] bg-transparent text-[var(--color-brand-primary)] text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:bg-[var(--color-brand-accent)] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                  >
                    {scoped ? `Explore ${title}` : `Visit ${title} hub`}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/** Freeform overview — multiple paragraphs under a heading. */
export function LocationOverviewSection({ overview }: { overview: LocationOverview }) {
  return (
    <section aria-label="Local overview" className="bg-[#F4F6F8] border-b border-[var(--color-border)]">
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] items-start">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[var(--color-brand-primary)] leading-tight [overflow-wrap:anywhere]">
            {overview.heading}
          </h2>
          <div className="flex flex-col gap-4 text-slate-700 text-base leading-relaxed">
            {overview.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Reasons-to-choose bullet list. */
export function LocationReasons({ reasons }: { reasons: LocationReasonList }) {
  return (
    <section aria-label="Reasons to choose this contractor" className="bg-white border-b border-[var(--color-border)]">
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[var(--color-brand-primary)] tracking-tight mb-10 max-w-3xl [overflow-wrap:anywhere]">
          {reasons.heading}
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.items.map((item) => (
            <li key={item.body} className="flex flex-col gap-2 p-5 rounded-sm bg-[#F4F6F8] border border-slate-200/60">
              {item.title && (
                <span className="font-extrabold text-[var(--color-brand-primary)] text-base">{item.title}</span>
              )}
              <span className="text-sm text-slate-600 leading-relaxed [overflow-wrap:anywhere]">{item.body}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** "As Seen On" placeholder strip — only rendered when the reference page shows it. */
export function LocationAsSeenOn() {
  const labels = ["Local News 4", "WDIV", "Click On Detroit", "FOX 2", "WJBK", "ABC 7"];
  return (
    <section aria-label="As seen on" className="bg-white border-b border-[var(--color-border)]">
      <Container width="wide" className="py-10 sm:py-12">
        <p className="text-xs uppercase tracking-wider font-bold text-slate-500 text-center mb-5">
          As seen on (reference placements — illustrative labels, not endorsements of this demo)
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-500 text-sm font-black uppercase tracking-wide">
          {labels.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </Container>
    </section>
  );
}

/** Final CTA banner. Caller supplies the resolved destination so the page can
 *  prefer a scoped `/<slug>/free-estimate/` route and fall back to an in-page
 *  anchor on the hero form rather than inventing a nonexistent local route. */
export function LocationFinalCta({
  content,
  ctaTo,
}: {
  content: LocationPageContent;
  ctaTo: string;
}) {
  return (
    <section aria-label="Final call to action" className="bg-[#0C1F33] text-white">
      <Container width="wide" className="py-12 sm:py-16 flex flex-col items-center text-center gap-5">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight max-w-3xl [overflow-wrap:anywhere]">
          {content.finalCta.heading}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {content.finalCta.body}
        </p>
        <Link
          to={ctaTo}
          className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-sm bg-[#D9232A] hover:bg-[#B81B22] text-white text-sm font-extrabold uppercase tracking-wider transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
        >
          {content.finalCta.primary.label}
        </Link>
      </Container>
    </section>
  );
}
