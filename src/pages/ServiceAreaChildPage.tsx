import { useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import NotFoundPage from "./NotFoundPage";

export default function ServiceAreaChildPage() {
  const { locationSlug, childSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasServiceAreaIndex"))
    return <NotFoundPage />;

  const child = location.serviceAreaChildren.find((c) => c.slug === childSlug);
  if (!child) return <NotFoundPage />;

  return (
    <PageShell
      meta={{
        title: `${child.name} — ${location.city} service area — scaffold`,
        description: `Serving ${child.name} near ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/service-area/${child.slug}/`,
      }}
      title={`${child.name}`}
      intro={`Service area under ${location.city}.`}
    />
  );
}
