import { useEffect } from "react";
import { applyRouteMeta } from "@/app/seo";
import { PageShell } from "@/components/layout/PageShell";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { AwardsStrip } from "@/components/sections/AwardsStrip";
import {
  LocationHero,
  LocationTrust,
  LocationOffers,
  LocationServiceGrid,
  LocationOverviewSection,
  LocationReasons,
  LocationAsSeenOn,
  LocationFinalCta,
} from "@/components/sections/LocationSections";
import {
  isLocationServiceAvailable,
  locationServiceAvailability,
  hasLocationCapability,
} from "@/data/availability";
import { findLocationPage } from "@/data/locationPages";
import type { Location, ServiceKey } from "@/types";

export interface LocationPageProps {
  location: Location;
}

export default function LocationPage({ location }: LocationPageProps) {
  const content = findLocationPage(location.slug);

  useEffect(() => {
    if (!content) return;
    applyRouteMeta({
      title: `${location.city}, ${location.state} roofing & home exterior`,
      description: content.hero.description,
      canonicalPath: `/${location.slug}/`,
    });
  }, [content, location]);

  if (!content) return <LocationScaffold location={location} />;

  const availableForLocation = (service: ServiceKey) =>
    isLocationServiceAvailable(location.slug, service);

  // Prefer a scoped free-estimate route when the location advertises one;
  // otherwise anchor the hero form on this page. Never invent a local
  // free-estimate route that is not listed in availability.
  const ctaTo = hasLocationCapability(location.slug, "hasFreeEstimate")
    ? `/${location.slug}/free-estimate/`
    : "#estimate";

  return (
    <>
      <LocationHero content={content} location={location} />
      <LocationTrust />
      <LocationOffers location={location} />
      <LocationServiceGrid
        content={content}
        location={location}
        isServiceAvailable={availableForLocation}
      />
      <LocationOverviewSection overview={content.overview} />
      <LocationReasons reasons={content.reasons} />
      {content.showAsSeenOnStrip && <LocationAsSeenOn />}
      <ReviewsStrip />
      <AwardsStrip />
      <LocationFinalCta content={content} ctaTo={ctaTo} />
    </>
  );
}

/** Original scaffold, preserved for locations that have not been built out. */
function LocationScaffold({ location }: { location: Location }) {
  const serviceKeys = locationServiceAvailability
    .filter((a) => a.locationSlug === location.slug)
    .map((a) => a.serviceKey);

  return (
    <PageShell
      meta={{
        title: `${location.city}, ${location.state} — scaffold`,
        description: `Exterior contracting services in ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/`,
      }}
      title={`${location.city}, ${location.state}`}
      intro="Location hub scaffold."
    >
      <h2 className="text-lg font-semibold mt-4">Available services</h2>
      {serviceKeys.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">
          No location-scoped service pages yet. The hub links back to the
          global service pages.
        </p>
      ) : (
        <ul className="list-disc pl-5">
          {serviceKeys.map((s) => (
            <li key={s}>
              <a href={`/${location.slug}/${s}/`} className="underline">
                /{location.slug}/{s}/
              </a>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-lg font-semibold mt-6">Capabilities</h2>
      <ul className="list-disc pl-5">
        {hasLocationCapability(location.slug, "hasFreeEstimate") && (
          <li>
            <a className="underline" href={`/${location.slug}/free-estimate/`}>
              Location-specific free estimate
            </a>
          </li>
        )}
        {hasLocationCapability(location.slug, "hasFinancing") && (
          <li>
            <a className="underline" href={`/${location.slug}/financing/`}>
              Location financing
            </a>
          </li>
        )}
        {hasLocationCapability(location.slug, "hasServiceAreaIndex") && (
          <li>
            <a className="underline" href={`/${location.slug}/service-area/`}>
              Service area index
            </a>
          </li>
        )}
      </ul>
    </PageShell>
  );
}
