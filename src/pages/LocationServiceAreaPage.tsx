import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import { findServiceArea, type ServiceAreaContent } from "@/data/serviceAreas";
import type { Location } from "@/types";
import NotFoundPage from "./NotFoundPage";

export default function LocationServiceAreaPage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasServiceAreaIndex"))
    return <NotFoundPage />;

  const content = findServiceArea(location.slug);

  if (!content) return <ServiceAreaScaffold location={location} />;

  return <ServiceAreaBody location={location} content={content} />;
}

/** Renders only when a typed `serviceAreas` entry is missing — kept so new
 *  locations with the capability flag read as unfinished rather than empty. */
function ServiceAreaScaffold({ location }: { location: Location }) {
  return (
    <PageShell
      meta={{
        title: `Service area — ${location.city} — scaffold`,
        description: `Cities and counties served near ${location.city}.`,
        canonicalPath: `/${location.slug}/service-area/`,
      }}
      title={`Service area — ${location.city}`}
    >
      {location.serviceAreaChildren.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">
          Service-area content pending.
        </p>
      ) : (
        <ul className="list-disc pl-5">
          {location.serviceAreaChildren.map((child) => (
            <li key={child.slug}>
              <a
                className="underline"
                href={`/${location.slug}/service-area/${child.slug}/`}
              >
                {child.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}

function ServiceAreaBody({
  location,
  content,
}: {
  location: Location;
  content: ServiceAreaContent;
}) {
  const canonicalPath = `/${location.slug}/service-area/`;

  useEffect(() => {
    applyRouteMeta({
      title: `${location.city}, ${location.state} service area`,
      description: content.intro,
      canonicalPath,
    });
  }, [location.city, location.state, content.intro, canonicalPath]);

  // Children already present in locations[] data have mounted Sprint 1
  // child pages. The rest render as plain text — no dead links.
  const linkableChildren = new Set(
    location.serviceAreaChildren.map((c) => c.slug)
  );

  const renderCity = (name: string, slug: string) => {
    if (linkableChildren.has(slug)) {
      return (
        <Link
          to={`/${location.slug}/service-area/${slug}/`}
          className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
        >
          {name}
        </Link>
      );
    }
    return <span className="text-slate-700">{name}</span>;
  };

  return (
    <>
      <section
        aria-labelledby="service-area-title"
        className="bg-white border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <Link to={`/${location.slug}/`} className="hover:underline">
              {location.city}, {location.state}
            </Link>
            <span aria-hidden="true"> › </span>
            <span>Service Area</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            {location.city}, {location.state}
          </p>
          <h1
            id="service-area-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight [overflow-wrap:anywhere]"
          >
            Service Area
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-prose">
            {content.intro}
          </p>
        </Container>
      </section>

      <section
        aria-label="Communities we serve"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)] mb-8 [overflow-wrap:anywhere]">
            {content.regionalHeading}
          </h2>

          {content.counties.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-extrabold text-[var(--color-brand-primary)] uppercase tracking-wider mb-4">
                Counties
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                {content.counties.map((county) => (
                  <li key={county.slug + "-" + county.name}>
                    {renderCity(county.name, county.slug)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            {content.directions.map((direction) => (
              <div key={direction.heading}>
                <h3 className="text-lg font-extrabold text-[var(--color-brand-primary)] uppercase tracking-wider mb-4">
                  {direction.heading}
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 text-sm">
                  {direction.cities.map((city) => (
                    <li key={direction.heading + "-" + city.slug}>
                      {renderCity(city.name, city.slug)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-slate-600">
            Reference-sourced community list. Individual city/county pages
            that are not yet linked will arrive in a later sprint.
          </p>
        </Container>
      </section>

      <section
        aria-label="Final call to action"
        className="bg-[#0C1F33] text-white"
      >
        <Container width="wide" className="py-12 sm:py-16 flex flex-col items-center text-center gap-5">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight max-w-3xl [overflow-wrap:anywhere]">
            Serving {location.city} and the surrounding communities
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Request a free, no-obligation estimate for your project.
          </p>
          <Link
            to={
              hasLocationCapability(location.slug, "hasFreeEstimate")
                ? `/${location.slug}/free-estimate/`
                : `/${location.slug}/#estimate`
            }
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-sm bg-[#D9232A] hover:bg-[#B81B22] text-white text-sm font-extrabold uppercase tracking-wider transition-colors shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          >
            Get a Free Estimate
          </Link>
        </Container>
      </section>
    </>
  );
}
