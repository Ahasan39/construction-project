import { useEffect } from "react";
import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui";
import type { RouteMeta } from "@/types";
import { applyRouteMeta } from "@/app/seo";

export interface PageShellProps {
  meta: RouteMeta;
  title: string;
  intro?: string;
  children?: ReactNode;
}

/**
 * Placeholder page scaffold used by Sprint 1 route shells. Applies route
 * metadata (title + description + canonical) and shows a "scaffold" badge so
 * reviewers never mistake it for a finished design.
 */
export function PageShell({ meta, title, intro, children }: PageShellProps) {
  useEffect(() => applyRouteMeta(meta), [meta]);

  return (
    <>
      <Section>
        <Container>
          <p className="inline-block rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
            Scaffold — Sprint 1
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold">{title}</h1>
          {intro && (
            <p className="mt-3 max-w-prose text-[var(--color-ink-muted)]">
              {intro}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </Container>
      </Section>
    </>
  );
}
