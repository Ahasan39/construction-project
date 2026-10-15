import { PageShell } from "@/components/layout/PageShell";
import type { Service, ServiceVariant } from "@/types";

export interface ServiceVariantPageProps {
  service: Service;
  variant: ServiceVariant;
}

export default function ServiceVariantPage({
  service,
  variant,
}: ServiceVariantPageProps) {
  return (
    <PageShell
      meta={{
        title: `${variant.title} — ${service.title} — scaffold`,
        description: variant.summary,
        canonicalPath: `/${service.slug}/${variant.slug}/`,
      }}
      title={variant.title}
      intro={variant.summary}
    />
  );
}
