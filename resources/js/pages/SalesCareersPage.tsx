import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";

const ROLE_TOPICS = [
  {
    title: "What a sales role looks like",
    body: "Residential-exterior sales roles typically involve meeting homeowners at their property, assessing the condition of the exterior, writing a documented estimate, and following up through installation. Specific territories, lead flow and quota structure are set by the reference program and are not reproduced here.",
  },
  {
    title: "Who the role tends to suit",
    body: "People comfortable with in-home conversations, methodical about documenting what they see on a roof or exterior, and willing to learn product lines across roofing, siding, windows, gutters and masonry. The reference program's own job listings describe its specific requirements.",
  },
  {
    title: "What is not described here",
    body: "No specific salary, commission structure, benefits package, signing bonus, territory assignment, or hiring timeline is reproduced on this page. Those are set by the reference program's current, dated job postings — not by this reproduction site.",
  },
];

export default function SalesCareersPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Sales Careers",
      description:
        "Informational overview of residential-exterior sales roles. No fabricated openings, salaries, or benefits — applications are not accepted by this demo.",
      canonicalPath: "/careers/sales/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="careers-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Sales Careers</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Careers
          </p>
          <h1
            id="careers-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Sales careers.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            This page is an informational overview of what a residential
            exterior sales role tends to involve. It is not a job listing.
            Current openings, compensation, benefits and hiring status are set
            by the reference program's own live careers pages, which have not
            been fetched in this session.
          </p>
        </Container>
      </section>

      <section aria-labelledby="role-topics-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="role-topics-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            About the role
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {ROLE_TOPICS.map((t) => (
              <li
                key={t.title}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-5"
              >
                <h3 className="text-lg font-bold text-[var(--color-brand-primary)]">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {t.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="openings-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="openings-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Current openings
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              <strong>No openings are listed on this reproduction site.</strong>{" "}
              Hiring status changes frequently; publishing a specific list
              here would mislead candidates. The reference program's own
              careers pages are authoritative for which roles are open, in
              which markets, and under what terms.
            </p>
            <p>
              <strong>No application is accepted here.</strong> This
              reproduction does not host an application form or recruiter
              inbox. Nothing submitted through the Free Estimate or Contact Us
              forms is routed to a recruiter — those forms are for project
              inquiries only, and themselves do not send real submissions.
            </p>
            <p>
              External applicant-tracking links will appear here only when
              the reference program's verified application URL is supplied.
              No external career-site link is included until then.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="careers-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="careers-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Looking for the current team contact?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Use the shared contact routes below. The team contact is the
              same demo address used across this site; it is not a dedicated
              recruiter inbox.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={brand.phoneHref}
              className="text-lg font-black text-white hover:text-[var(--color-brand-accent)] transition-colors"
            >
              {brand.phoneDisplay}
            </a>
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
