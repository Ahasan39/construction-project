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

export interface ThreeSegmentLocationPageProps {
  locationSlug?: string;
  serviceSlug?: string;
  variantSlug?: string;
}

/**
 * Dispatcher for `/:locationSlug/:serviceSlug/:variantSlug`. The variant must
 * be explicitly listed in the (location, service) availability record;
 * anything else → NotFound.
 */
export default function ThreeSegmentLocationPage(props?: ThreeSegmentLocationPageProps) {
  const params = useParams();
  const locationSlug = props?.locationSlug ?? params.locationSlug;
  const serviceSlug = props?.serviceSlug ?? params.serviceSlug;
  const variantSlug = props?.variantSlug ?? params.variantSlug;
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
