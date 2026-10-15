import { useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import NotFoundPage from "./NotFoundPage";

export default function LocationFreeEstimatePage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasFreeEstimate"))
    return <NotFoundPage />;

  return (
    <PageShell
      meta={{
        title: `Free estimate — ${location.city} — scaffold`,
        description: `Request a free estimate for ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/free-estimate/`,
      }}
      title={`Free estimate — ${location.city}`}
      intro="Lead form will be built in Sprint 2/3."
    />
  );
}
