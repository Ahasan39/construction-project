import { useParams } from "react-router-dom";
import ServiceVariantPage from "./ServiceVariantPage";
import LocationServicePage from "./LocationServicePage";
import NotFoundPage from "./NotFoundPage";
import { findService } from "@/data/services";
import { findLocation } from "@/data/locations";
import { isLocationServiceAvailable } from "@/data/availability";
import type { ServiceKey } from "@/types";

/**
 * Dispatcher for `/:a/:b`:
 *   - service + variant     → ServiceVariantPage
 *   - location + service    → LocationServicePage (only when availability is explicit)
 *   - anything else         → NotFoundPage
 */
export default function TwoSegmentPage() {
  const { a, b } = useParams();
  if (!a || !b) return <NotFoundPage />;

  const service = findService(a);
  if (service) {
    const variant = service.variants.find((v) => v.slug === b);
    if (variant) return <ServiceVariantPage service={service} variant={variant} />;
    return <NotFoundPage />;
  }

  const location = findLocation(a);
  if (location) {
    const svc = findService(b);
    if (!svc) return <NotFoundPage />;
    if (!isLocationServiceAvailable(location.slug, svc.key as ServiceKey))
      return <NotFoundPage />;
    return <LocationServicePage location={location} service={svc} />;
  }

  return <NotFoundPage />;
}
