import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { findLocation } from "@/data/locations";
import {
  hasLocationCapability,
  isLocationServiceAvailable,
} from "@/data/availability";
import { services } from "@/data/services";
import { brand } from "@/data/brand";
import NotFoundPage from "./NotFoundPage";

const STEPS = [
  {
    n: "1",
    title: "Request a written estimate",
    body: "Start with an on-site inspection and a written quote that itemizes materials, labor, and warranty terms for your home.",
  },
  {
    n: "2",
    title: "Review written financing terms",
    body: "If third-party financing is offered for your project, compare the written APR, payment schedule, and total cost against your other options.",
  },
  {
    n: "3",
    title: "Confirm approval, then schedule",
    body: "Credit approval and terms are determined by the participating lender. Once approved and confirmed in writing, your installation is scheduled.",
  },
];

export default function LocationFinancingPage() {
  const { locationSlug } = useParams();
  const location = locationSlug ? findLocation(locationSlug) : undefined;
  const hasFinancing = location
    ? hasLocationCapability(location.slug, "hasFinancing")
    : false;

  useEffect(() => {
    if (!location || !hasFinancing) return;
    applyRouteMeta({
      title: `Financing — ${location.city}, ${location.state}`,
      description: `Overview of residential exterior project financing for ${location.city}, ${location.state} homeowners — informational only. This reproduction site does not operate a lender or process credit applications.`,
      canonicalPath: `/${location.slug}/financing/`,
    });
  }, [location, hasFinancing]);

  if (!location || !hasFinancing) return <NotFoundPage />;

  const estimateTo = hasLocationCapability(location.slug, "hasFreeEstimate")
    ? `/${location.slug}/free-estimate/`
    : `/${location.slug}/#estimate`;

  return (
    <>
      <section
        aria-labelledby="location-financing-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden="true"> › </span>
            <Link to={`/${location.slug}/`} className="hover:underline">
              {location.city}, {location.state}
            </Link>
            <span aria-hidden="true"> › </span>
            <span>Financing</span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {location.city}, {location.state} · Project Financing
          </p>
          <h1
            id="location-financing-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            {location.city} Financing Options.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            Homeowners in {location.city}, {location.state} often pair roof
            replacement, siding, window, gutter, or masonry projects with
            third-party financing introduced during the estimate appointment.
            This demonstration page provides general information only — specific
            rates, credit eligibility, lender partners, and application forms
            belong to the reference program and are not processed on this site.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to={estimateTo}
              className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
            >
              Get a FREE Estimate
            </Link>
            <Link
              to="/financing/"
              className="inline-flex items-center justify-center h-12 rounded-sm border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white font-bold text-sm px-5 transition-colors"
            >
              General Financing Overview
            </Link>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="how-local-financing-works-title"
        className="bg-white border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="how-local-financing-works-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            How financing works for {location.city} projects
          </h2>
          <ol className="mt-6 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-5"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-accent)] text-white font-black">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-brand-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        aria-labelledby="eligible-local-services-title"
        className="bg-white border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12 sm:py-14">
          <h2
            id="eligible-local-services-title"
            className="text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Exterior services in {location.city}, {location.state}
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-prose">
            Explore the exterior remodeling services available to{" "}
            {location.city}-area homeowners before requesting your written
            estimate.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const scoped = isLocationServiceAvailable(location.slug, s.key);
              const to = scoped
                ? `/${location.slug}/${s.slug}/`
                : `/${s.slug}/`;
              return (
                <li key={s.key}>
                  <Link
                    to={to}
                    className="block rounded-sm border border-slate-200 bg-[#F4F6F8] hover:bg-white hover:border-slate-300 px-4 py-3 transition-colors"
                  >
                    <span className="font-semibold text-[var(--color-brand-primary)]">
                      {scoped ? `${location.city} ${s.title}` : s.title}
                    </span>
                    <span className="block text-sm text-slate-600 mt-1">
                      {s.tagline}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="local-financing-disclosures-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="local-financing-disclosures-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Important disclosures
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              <strong>Rates and payments.</strong> Any APR, monthly payment, or
              promotional offer referenced on the live site is subject to
              lender underwriting and the terms in effect at the time of
              application. This reproduction does not quote rates.
            </p>
            <p>
              <strong>Approval.</strong> Loan approval, credit limits, and
              repayment terms are set by the participating lender, not by the
              contractor or this demonstration website.
            </p>
            <p>
              <strong>No live application.</strong> No credit or financing
              application is collected on this site. Questions can be directed
              to our demo contact line at{" "}
              <a
                href={brand.phoneHref}
                className="font-bold text-[var(--color-brand-accent)] hover:underline"
              >
                {brand.phoneDisplay}
              </a>{" "}
              or{" "}
              <a
                href={brand.emailHref}
                className="font-semibold text-[var(--color-brand-primary)] hover:underline"
              >
                {brand.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="local-financing-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="local-financing-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Start with an estimate in {location.city}
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free, no-obligation written estimate for your{" "}
              {location.city}, {location.state} property.
            </p>
          </div>
          <Link
            to={estimateTo}
            className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
          >
            Get a FREE Estimate
          </Link>
        </Container>
      </section>
    </>
  );
}
