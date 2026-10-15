import { PageShell } from "@/components/layout/PageShell";
import { SmartLink } from "@/components/ui";
import type { RouteMeta } from "@/types";

export interface ExternalEntryPageProps {
  meta: RouteMeta;
  title: string;
  intro: string;
  outboundLabel: string;
  /**
   * Real outbound URL supplied by the client. When null/empty, the page
   * renders a disabled call-to-action that clearly states integration is
   * pending — we do not fabricate a working link, and the local app does not
   * substitute a mock implementation.
   */
  outboundHref: string | null;
}

export default function ExternalEntryPage({
  meta,
  title,
  intro,
  outboundLabel,
  outboundHref,
}: ExternalEntryPageProps) {
  const hasHref = !!outboundHref && outboundHref.length > 0;

  return (
    <PageShell meta={meta} title={title} intro={intro}>
      <div className="mt-4">
        {hasHref ? (
          <SmartLink
            to={outboundHref!}
            external
            className="inline-flex items-center gap-2 underline"
          >
            {outboundLabel} ↗
          </SmartLink>
        ) : (
          <p
            role="status"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-[var(--color-ink-muted)]"
            />
            {outboundLabel} — awaiting client-supplied URL
          </p>
        )}
      </div>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        External integration — not reproduced during the frontend phase.
      </p>
    </PageShell>
  );
}
