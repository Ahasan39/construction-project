import { useParams } from "react-router-dom";
import LocationServicePage from "./LocationServicePage";
import NotFoundPage from "./NotFoundPage";
import { findLocation } from "@/data/locations";
import { findService } from "@/data/services";
import {
  hasVariantForLocationService,
  isLocationServiceAvailable,
} from "@/data/availability";
import type { ServiceKey } from "@/types";

/**
 * Dispatcher for `/:locationSlug/:serviceSlug/:variantSlug`. The variant must
 * be explicitly listed in the (location, service) availability record;
 * anything else → NotFound.
 */
export default function ThreeSegmentLocationPage() {
  const { locationSlug, serviceSlug, variantSlug } = useParams();
  if (!locationSlug || !serviceSlug || !variantSlug) return <NotFoundPage />;

  const location = findLocation(locationSlug);
  const service = serviceSlug ? findService(serviceSlug) : undefined;
  if (!location || !service) return <NotFoundPage />;

  if (!isLocationServiceAvailable(location.slug, service.key as ServiceKey))
    return <NotFoundPage />;

  const variant = service.variants.find((v) => v.slug === variantSlug);
  if (!variant) return <NotFoundPage />;

  if (
    !hasVariantForLocationService(
      location.slug,
      service.key as ServiceKey,
      variantSlug
    )
  )
    return <NotFoundPage />;

  return (
    <LocationServicePage
      location={location}
      service={service}
      variant={variant}
    />
  );
}
