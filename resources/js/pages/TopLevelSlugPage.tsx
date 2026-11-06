import { useParams } from "react-router-dom";
import ServiceHubPage from "./ServiceHubPage";
import LocationPage from "./LocationPage";
import NotFoundPage from "./NotFoundPage";
import { findService } from "@/data/services";
import { findLocation } from "@/data/locations";

/**
 * Dispatcher for `/:slug` — services and locations publish at the same depth
 * on the reference. Resolve by looking up typed data; unknown → 404.
 */
export default function TopLevelSlugPage() {
  const { slug } = useParams();
  if (!slug) return <NotFoundPage />;

  const service = findService(slug);
  if (service) return <ServiceHubPage service={service} />;

  const location = findLocation(slug);
  if (location) return <LocationPage location={location} />;

  return <NotFoundPage />;
}
