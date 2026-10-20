import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui";
import { findLocation } from "@/data/locations";
import { findLocationPage } from "@/data/locationPages";
import { hasLocationCapability } from "@/data/availability";
import { brand } from "@/data/brand";
import { EstimateForm } from "@/features/estimate/EstimateForm";
import type { Location } from "@/types";
import NotFoundPage from "./NotFoundPage";

/**
 * Locations whose /free-estimate/ route is a complete demo page in this
 * sprint. Other locations with `hasFreeEstimate` in availability keep the
 * Sprint 1 scaffold until their own sprint lands them.
 */
const COMPLETED_SLUGS = new Set<string>(["nashville"]);

export default function LocationFreeEstimatePage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasFreeEstimate"))
    return <NotFoundPage />;

  if (COMPLETED_SLUGS.has(location.slug)) {
    return <EstimateBody location={location} />;
  }

  return (
    <PageShell
      meta={{
        title: `Free estimate — ${location.city} — scaffold`,
        description: `Request a free estimate for ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/free-estimate/`,
      }}
      title={`Free estimate — ${location.city}`}
      intro="Lead form will be built in a later sprint."
    />
  );
}

function EstimateBody({ location }: { location: Location }) {
  const content = findLocationPage(location.slug);
  const defaultRegion = content?.defaultRegionKey;
  const canonicalPath = `/${location.slug}/free-estimate/`;

  useEffect(() => {
    applyRouteMeta({
      title: `Free estimate — ${location.city}, ${location.state}`,
      description: `Request a free, no-obligation estimate for ${location.city}, ${location.state}. Demo form — submissions are not sent.`,
      canonicalPath,
    });
  }, [location.city, location.state, canonicalPath]);

  return (
    <section
      aria-labelledby="free-estimate-title"
      className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          <span aria-hidden="true"> › </span>
          <Link to={`/${location.slug}/`} className="hover:underline">
            {location.city}, {location.state}
          </Link>
          <span aria-hidden="true"> › </span>
          <span>Free Estimate</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {location.city}, {location.state}
            </p>
            <h1
              id="free-estimate-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight [overflow-wrap:anywhere]"
            >
              Free Estimate.
            </h1>
            <p className="text-slate-700 text-base leading-relaxed max-w-prose">
              Fill out the form and we will contact you to confirm the next
              step. Your details only reach this demo — no reference-company
              endpoint is called.
            </p>

            <div className="mt-2 rounded-sm bg-white border border-slate-200/80 p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-[var(--color-brand-primary)]">
                Prefer to talk?
              </p>
              <p className="text-sm text-slate-700">
                Call{" "}
                <a
                  href={brand.phoneHref}
                  className="font-bold text-[var(--color-brand-accent)] hover:underline"
                >
                  {brand.phoneDisplay}
                </a>{" "}
                or email{" "}
                <a
                  href={brand.emailHref}
                  className="font-semibold text-[var(--color-brand-primary)] hover:underline"
                >
                  {brand.email}
                </a>
                .
              </p>
              <p className="text-xs text-slate-500">
                Demo contact routes — no office address is published for this
                demo.
              </p>
            </div>
          </div>

          <aside
            aria-label={`Estimate form — ${location.city}`}
            className="rounded-sm bg-[#0C1F33] text-white p-6 sm:p-7 shadow-md border border-slate-800"
          >
            <div className="pb-3 mb-4 border-b border-slate-700/60">
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Request a Free Estimate
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Preselected for the {location.city} area. Service remains open.
              </p>
            </div>

            <EstimateForm
              variant="inverse"
              submitLabel="Get a FREE ESTIMATE"
              {...(defaultRegion ? { lockedRegion: defaultRegion } : {})}
            />
          </aside>
        </div>
      </Container>
    </section>
  );
}
