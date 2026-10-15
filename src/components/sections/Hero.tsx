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
      className="bg-slate-50/60 lg:bg-white border-b border-[var(--color-border)] relative overflow-hidden"
    >
      <Container width="wide" className="py-8 sm:py-10 lg:py-14">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.4fr_1fr] items-start">
          {/* Left column — copy + hero photo */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Roofing · Siding · Gutters · Windows
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-[var(--color-brand-primary)]">
                Done in a day.
                <br />
                Good for a{" "}
                <span className="relative inline-block text-[var(--color-brand-primary)]">
                  lifetime.
                  <svg
                    className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-3.5 text-[#00a3e0]"
                    viewBox="0 0 160 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9.5C35 3 115 1.5 157 7.5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            <p className="text-slate-600 text-base sm:text-lg max-w-prose leading-relaxed">
              Giving homeowners peace of mind with quality craftsmanship, industry-leading
              warranties, and a streamlined process backed by 60+ years of local expertise.
            </p>

            {/* Hero image — LCP asset. Explicit dimensions prevent CLS. */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200/70 bg-slate-100">
              <img
                src="/images/homepage/hero-suburban-home.jpg"
                alt="Upscale residential suburban home exterior with dark architectural shingle roof, blue siding and stone facade"
                width={1600}
                height={900}
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-cover max-h-[460px]"
              />
            </div>

            {/* Emergency callout embedded under the hero image */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white border border-slate-200 p-3 sm:px-4 sm:py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-brand-accent)] animate-pulse" />
                <span className="text-sm font-extrabold text-[var(--color-brand-primary)]">
                  Active Leak? Storm Damage?
                </span>
                <Link
                  to="/free-estimate"
                  className="text-sm font-semibold text-slate-600 hover:text-[var(--color-brand-accent)] underline underline-offset-2 ml-1"
                >
                  Contact us
                </Link>
              </div>

              <SmartLink
                to={brand.phoneHref}
                external
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-[var(--color-brand-accent)] text-sm font-black hover:bg-red-100 transition-colors"
              >
                <span aria-hidden="true">📞</span>
                <span>{brand.phoneDisplay}</span>
              </SmartLink>
            </div>
          </div>

          {/* Right column — lead-form card */}
          <aside
            aria-label="Request a free estimate"
            className="rounded-2xl bg-[var(--color-brand-primary)] text-white p-6 sm:p-7 shadow-2xl border border-slate-700/60 lg:sticky lg:top-28"
          >
            <div className="border-b border-slate-700/60 pb-3 mb-4">
              <h2 className="text-2xl font-black tracking-tight text-white">
                Peace of Mind Starts Here.
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                Get a free, no-obligation estimate.
              </p>
            </div>

            <EstimateForm variant="inverse" submitLabel="Get a FREE estimate" />

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
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
