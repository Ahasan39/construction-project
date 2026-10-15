import { Link } from "react-router-dom";
import { Container, SmartLink } from "@/components/ui";
import { brand } from "@/data/brand";
import { EstimateForm } from "@/features/estimate/EstimateForm";

/**
 * Homepage hero — mirrors the reference's two-column composition: headline +
 * photo on the left; dark-navy "Peace of Mind Starts Here" lead-form card on
 * the right. The hero image is the designated LCP asset: loaded eagerly, with
 * explicit intrinsic dimensions to prevent CLS.
 */
export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Left column — copy + hero photo */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[var(--color-brand-primary)]">
              Done in a day.
              <br />
              Good for a{" "}
              <span className="text-[var(--color-brand-accent)]">lifetime.</span>
            </h1>
            <p className="text-[var(--color-ink-muted)] text-lg max-w-prose">
              Roofing, siding, windows and gutters installed in a single day,
              backed by a lifetime warranty — guided by direct, honest answers
              and expert workmanship.
            </p>

            {/* Hero image — LCP asset. Explicit dimensions prevent CLS. */}
            <img
              src="/images/placeholders/hero-home.svg"
              alt="Residential home exterior — placeholder image, client photo pending"
              width={1600}
              height={1000}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]"
            />

            {/* Emergency callout embedded under the hero image on desktop. */}
            <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] px-4 py-3">
              <span className="text-sm font-semibold text-[var(--color-brand-accent)]">
                Active Leak? Storm Damage?
              </span>
              <Link to="/free-estimate" className="text-sm underline">
                Contact us
              </Link>
              <span aria-hidden="true" className="text-[var(--color-ink-muted)]">
                ·
              </span>
              <SmartLink
                to={brand.phoneHref}
                external
                className="text-sm font-bold text-[var(--color-brand-accent)]"
              >
                {brand.phoneDisplay}
              </SmartLink>
            </div>
          </div>

          {/* Right column — lead-form card */}
          <aside
            aria-label="Request a free estimate"
            className="rounded-[var(--radius-lg)] bg-[var(--color-brand-primary)] text-white p-5 md:p-6 lg:self-start lg:sticky lg:top-28"
          >
            <h2 className="text-xl font-extrabold">Peace of Mind Starts Here.</h2>
            <p className="text-sm text-white/80 mt-1">Get a free estimate.</p>
            <div className="mt-4">
              <EstimateForm variant="inverse" />
            </div>
            <p className="mt-4 text-right">
              <Link to="/free-estimate" className="text-xs text-white/80 underline">
                Open the full estimate page →
              </Link>
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
