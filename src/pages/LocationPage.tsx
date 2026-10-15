import { PageShell } from "@/components/layout/PageShell";
import {
  locationServiceAvailability,
  hasLocationCapability,
} from "@/data/availability";
import type { Location } from "@/types";

export interface LocationPageProps {
  location: Location;
}

export default function LocationPage({ location }: LocationPageProps) {
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
