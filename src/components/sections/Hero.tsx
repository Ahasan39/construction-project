import { Link } from "react-router-dom";
import { Container, SmartLink } from "@/components/ui";
import { brand } from "@/data/brand";
import { EstimateForm } from "@/features/estimate/EstimateForm";

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
      <Container width="wide" className="py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.45fr_1fr] items-stretch">
          {/* Left column — sky background with copy, photo across bottom, and flush emergency bar */}
          <div className="flex flex-col justify-between rounded-sm overflow-hidden border border-slate-200/90 bg-gradient-to-b from-[#EBF3FA] via-[#E2EEF8] to-[#D5E6F5] shadow-sm">
            {/* Top copy section on sky gradient */}
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Roofing &amp; Home Exterior Experts
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black leading-[1.08] tracking-tight text-[var(--color-brand-primary)]">
                Done in a day.
                <br />
                Good for a{" "}
                <span className="inline-block bg-[#5BC2E7]/40 text-[var(--color-brand-primary)] px-2 py-0.5 rounded-sm">
                  lifetime.
                </span>
              </h1>
              <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed max-w-xl">
                Roofing, siding, windows, and gutters installed in a single day, backed with a
                lifetime warranty, and guided by direct, honest answers: no pressure or fluff,
                just thoughtful care, fast action, and permanent peace of mind.
              </p>
            </div>

            {/* Suburban home photography stretching across the lower hero */}
            <div className="w-full overflow-hidden bg-slate-200">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/homepage/hero-suburban-home-mobile.webp 480w, /images/homepage/hero-suburban-home.webp 960w"
                  sizes="(max-width: 768px) 100vw, 680px"
                />
                <img
                  src="/images/homepage/hero-suburban-home.webp"
                  srcSet="/images/homepage/hero-suburban-home-mobile.webp 480w, /images/homepage/hero-suburban-home.webp 960w"
                  sizes="(max-width: 768px) 100vw, 680px"
                  alt="Upscale residential suburban home exterior with dark architectural shingle roof, blue siding and stone facade"
                  width={1200}
                  height={670}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover"
                />
              </picture>
            </div>

            {/* Emergency contact row flush beneath the hero photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-slate-200">
              <div className="bg-[#EEF2F6] px-6 py-4 sm:py-5 flex flex-col justify-center">
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
              <div className="bg-[#DEE4EB] px-6 py-4 sm:py-5 flex items-center justify-start gap-3">
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
            className="rounded-sm bg-[#0C1F33] text-white p-6 sm:p-7 shadow-md border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="pb-3 mb-4">
                <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-white leading-tight">
                  Peace of Mind Starts Here.
                </h2>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  Get a FREE estimate
                </p>
              </div>

              <EstimateForm variant="inverse" submitLabel="Get a FREE ESTIMATE" />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Fast 24-hr response</span>
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
