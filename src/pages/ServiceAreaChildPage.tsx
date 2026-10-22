import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import { services } from "@/data/services";
import { brand } from "@/data/brand";
import NotFoundPage from "./NotFoundPage";

export default function ServiceAreaChildPage() {
  const { locationSlug, childSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  const child = location?.serviceAreaChildren.find((c) => c.slug === childSlug);

  useEffect(() => {
    if (!location || !child) return;
    applyRouteMeta({
      title: `${child.name} — ${location.city} service area`,
      description: `Residential exterior services serving ${child.name} near ${location.city}, ${location.state}. Demonstration page — contact routes are demo only.`,
      canonicalPath: `/${location.slug}/service-area/${child.slug}/`,
    });
  }, [location, child]);

  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasServiceAreaIndex"))
    return <NotFoundPage />;
  if (!child) return <NotFoundPage />;

  return (
    <>
      <section
        aria-labelledby="child-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <Link to={`/${location.slug}/`} className="hover:underline">
              {location.city}, {location.state}
            </Link>
            <span aria-hidden="true"> › </span>
            <Link
              to={`/${location.slug}/service-area/`}
              className="hover:underline"
            >
              Service Area
            </Link>
            <span aria-hidden="true"> › </span>
            <span>{child.name}</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {location.city} service area
          </p>
          <h1
            id="child-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            {child.name}.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            {child.name} is part of the {location.city}, {location.state}{" "}
            service area for residential exterior work — roofing, siding,
            windows, gutters and masonry. This is a demonstration page; the
            contact routes below are demo only and no estimate is dispatched.
          </p>
        </Container>
      </section>

      <section aria-labelledby="services-title" className="bg-white">
        <Container width="wide" className="py-12 sm:py-16">
          <h2
            id="services-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Services available
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-prose">
            Service pages are organized at the market level. Follow the links
            below to see the {location.city}-area service details that apply
            to {child.name}.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/${s.slug}`}
                  className="block rounded-sm border border-slate-200 bg-[#F4F6F8] hover:bg-white hover:border-slate-300 px-4 py-3 transition-colors"
                >
                  <span className="font-semibold text-[var(--color-brand-primary)]">
                    {s.title}
                  </span>
                  <span className="block text-sm text-slate-600 mt-1">
                    {s.tagline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="area-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="area-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Starting a project in {child.name}?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free written estimate for {child.name}. Demo form —
              submissions are not sent.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={brand.phoneHref}
              className="text-lg font-black text-white hover:text-[var(--color-brand-accent)] transition-colors"
            >
              {brand.phoneDisplay}
            </a>
            <Link
              to={
                hasLocationCapability(location.slug, "hasFreeEstimate")
                  ? `/${location.slug}/free-estimate`
                  : "/free-estimate"
              }
              className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
            >
              Get a FREE Estimate
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
