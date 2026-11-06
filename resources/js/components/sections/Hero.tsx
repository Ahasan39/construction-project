import { assetUrl } from "@/app/assets";
import { Link } from "react-router-dom";
import { Container, SmartLink } from "@/components/ui";
import { brand } from "@/data/brand";
import { EstimateForm } from "@/features/estimate/EstimateForm";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Homepage hero — faithfully reconstructs the reference's two-column composition:
 * - Left column: uppercase category kicker, large bold headline with the characteristic
 *   sky-blue swoosh underline on "lifetime.", descriptive subtext, high-resolution
 *   suburban home photography (LCP asset with explicit dimensions), and emergency
 *   service callout badge.
 * - Right column: dark navy "Peace of Mind Starts Here." lead-form card overlay
 *   with dark inputs, white labels, and prominent full-width red CTA button.
 */
export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="bg-white border-b border-[var(--color-border)] relative overflow-hidden"
    >
      <Container width="wide" className="py-3 sm:py-4 lg:py-5">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.45fr_1fr] items-stretch">
          {/* Left column — sky background with copy, photo across bottom, and flush emergency bar */}
          <div className="flex flex-col justify-between rounded-sm overflow-hidden border border-slate-200/90 bg-gradient-to-b from-[#EBF3FA] via-[#E2EEF8] to-[#D5E6F5] shadow-sm">
            {/* Top copy section on sky gradient */}
            <div className="p-4 sm:p-5 lg:p-6">
              <Reveal as="p" className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Roofing &amp; Home Exterior Experts
              </Reveal>
              <Reveal as="h1" delayMs={80} className="text-2xl sm:text-4xl lg:text-[40px] font-black leading-[1.08] tracking-tight text-[var(--color-brand-primary)]">
                Done in a day.
                <br />
                Good for a{" "}
                <span className="inline-block bg-[#5BC2E7]/40 text-[var(--color-brand-primary)] px-2 py-0.5 rounded-sm">
                  lifetime.
                </span>
              </Reveal>
              <Reveal as="p" delayMs={160} className="mt-2 text-slate-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Roofing, siding, windows, and gutters installed in a single day, backed with a
                lifetime warranty, and guided by direct, honest answers: no pressure or fluff,
                just thoughtful care, fast action, and permanent peace of mind.
              </Reveal>
            </div>

            {/* Suburban home photography stretching across the lower hero */}
            <div className="w-full overflow-hidden bg-slate-200">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${assetUrl("/images/homepage/hero-suburban-home-mobile.webp")} 480w, ${assetUrl("/images/homepage/hero-suburban-home.webp")} 960w`}
                  sizes="(max-width: 768px) 100vw, 680px"
                />
                <img
                  src={assetUrl("/images/homepage/hero-suburban-home.webp")}
                  srcSet={`${assetUrl("/images/homepage/hero-suburban-home-mobile.webp")} 480w, ${assetUrl("/images/homepage/hero-suburban-home.webp")} 960w`}
                  sizes="(max-width: 768px) 100vw, 680px"
                  alt="Upscale residential suburban home exterior with dark architectural shingle roof, blue siding and stone facade"
                  width={1200}
                  height={670}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-48 sm:h-56 md:h-60 lg:h-[220px] xl:h-[235px] object-cover"
                />
              </picture>
            </div>

            {/* Emergency contact row flush beneath the hero photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-slate-200">
              <div className="bg-[#EEF2F6] px-5 py-2.5 sm:py-3 flex flex-col justify-center">
                <span className="text-base sm:text-lg font-black text-[var(--color-brand-primary)] leading-tight">
                  Active Leak? Storm Damage?
                </span>
                <Link
                  to="/free-estimate"
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[var(--color-brand-accent)] transition-colors mt-0.5 inline-block"
                >
                  Contact Us
                </Link>
              </div>
              <div className="bg-[#DEE4EB] px-5 py-2.5 sm:py-3 flex items-center justify-start gap-3">
                <span className="text-[var(--color-brand-accent)] text-xl" aria-hidden="true">
                  📞
                </span>
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

          {/* Right column — rectangular navy lead-form panel */}
          <aside
            aria-label="Request a free estimate"
            className="rounded-sm bg-[#0C1F33] text-white p-4 sm:p-5 lg:p-5 shadow-md border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="pb-2 mb-2.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Peace of Mind Starts Here.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  Get a FREE estimate
                </p>
              </div>

              <EstimateForm variant="inverse" submitLabel="Get a FREE ESTIMATE" />
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
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
