import { PageShell } from "@/components/layout/PageShell";
import type { Service } from "@/types";

export interface ServiceHubPageProps {
  service: Service;
}

export default function ServiceHubPage({ service }: ServiceHubPageProps) {
  return (
    <PageShell
      meta={{
        title: `${service.title} — scaffold`,
        description: service.tagline,
        canonicalPath: `/${service.slug}/`,
      }}
      title={service.title}
      intro={service.tagline}
    >
      {service.variants.length > 0 && (
        <ul className="list-disc pl-5">
          {service.variants.map((v) => (
            <li key={v.slug}>
              <a href={`/${service.slug}/${v.slug}/`} className="underline">
                {v.title}
              </a>
              <span className="text-[var(--color-ink-muted)]">
                {" "}
                — {v.summary}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
