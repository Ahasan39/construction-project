import { useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { findLocation } from "@/data/locations";
import { hasLocationCapability } from "@/data/availability";
import NotFoundPage from "./NotFoundPage";

export default function LocationFinancingPage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  if (!location) return <NotFoundPage />;
  if (!hasLocationCapability(location.slug, "hasFinancing"))
    return <NotFoundPage />;

  return (
    <PageShell
      meta={{
        title: `Financing — ${location.city} — scaffold`,
        description: `Financing information for ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/financing/`,
      }}
      title={`Financing — ${location.city}`}
    />
  );
}
