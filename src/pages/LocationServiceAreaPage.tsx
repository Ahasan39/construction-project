import { useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import NotFoundPage from "./NotFoundPage";

export default function LocationServiceAreaPage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasServiceAreaIndex"))
    return <NotFoundPage />;

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
          Sub-city data not loaded in Sprint 1.
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
