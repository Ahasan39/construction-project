import { PageShell } from "@/components/layout/PageShell";
import type { Location, Service, ServiceVariant } from "@/types";

export interface LocationServicePageProps {
  location: Location;
  service: Service;
  variant?: ServiceVariant;
}

export default function LocationServicePage({
  location,
  service,
  variant,
}: LocationServicePageProps) {
  if (variant) {
    return (
      <PageShell
        meta={{
          title: `${variant.title} — ${service.title} — ${location.city}, ${location.state} — scaffold`,
          description: `${variant.summary} Serving ${location.city}, ${location.state}.`,
          canonicalPath: `/${location.slug}/${service.slug}/${variant.slug}/`,
        }}
        title={`${variant.title} — ${location.city}`}
        intro={variant.summary}
      />
    );
  }

  return (
    <PageShell
      meta={{
        title: `${service.title} — ${location.city}, ${location.state} — scaffold`,
        description: `${service.tagline} Serving ${location.city}, ${location.state}.`,
        canonicalPath: `/${location.slug}/${service.slug}/`,
      }}
      title={`${service.title} — ${location.city}`}
      intro={service.tagline}
    />
  );
}
