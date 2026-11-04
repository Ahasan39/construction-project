import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container, SmartLink } from "@/components/ui";
import { brand } from "@/data/brand";
import type { RouteMeta } from "@/types";

export interface ExternalEntryPageProps {
  meta: RouteMeta;
  title: string;
  intro: string;
  outboundLabel: string;
  /**
   * Real outbound URL supplied by the client. When null/empty, the page
   * renders a clear operational notice stating that external portal
   * sign-in is handled outside the public marketing site.
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
  useEffect(() => {
    applyRouteMeta(meta);
  }, [meta]);

  const hasHref = !!outboundHref && outboundHref.length > 0;

  return (
    <>
      <section
        aria-labelledby="external-entry-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden="true"> › </span>
            <span>{title}</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Field Operations &amp; Crew Access
          </p>
          <h1
            id="external-entry-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            {title}.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            {intro} Field crews, project supervisors, and trade partners access
            work orders, safety checklists, and dispatch schedules through
            dedicated internal systems rather than the public website.
          </p>
        </Container>
      </section>

      <section
        aria-labelledby="external-entry-status-title"
        className="bg-white"
      >
        <Container width="content" className="py-12 sm:py-16">
          <h2
            id="external-entry-status-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Portal access &amp; dispatch support
          </h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            To protect employee and job-site records, crew authentication is
            hosted on a separate internal domain and is not embedded in this
            public frontend demonstration.
          </p>

          <div className="mt-6">
            {hasHref ? (
              <SmartLink
                to={outboundHref!}
                external
                className="inline-flex items-center justify-center h-12 rounded-sm bg-[var(--color-brand-primary)] hover:bg-slate-800 text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
              >
                {outboundLabel} ↗
              </SmartLink>
            ) : (
              <p
                role="status"
                className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-[#F4F6F8] px-4 py-3 text-sm font-medium text-slate-700"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-brand-accent)]"
                />
                {outboundLabel} — internal authentication required (no public
                login form is hosted on this demo)
              </p>
            )}
          </div>

          <h3 className="mt-8 text-base font-bold text-[var(--color-brand-primary)]">
            Need dispatch or coordinator assistance?
          </h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Active crew members with scheduling or work-order questions can
            contact the operations desk at{" "}
            <a
              href={brand.phoneHref}
              className="font-bold text-[var(--color-brand-accent)] hover:underline"
            >
              {brand.phoneDisplay}
            </a>{" "}
            or email{" "}
            <a
              href={brand.emailHref}
              className="font-semibold text-[var(--color-brand-primary)] hover:underline break-all"
            >
              {brand.email}
            </a>
            . Looking to join our team? Visit{" "}
            <Link
              to="/careers/sales"
              className="font-semibold text-[var(--color-brand-primary)] underline hover:text-[var(--color-brand-accent)]"
            >
              Careers
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
