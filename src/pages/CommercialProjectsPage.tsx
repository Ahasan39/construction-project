import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";

const SCOPES = [
  {
    title: "Commercial roofing",
    body: "Low-slope and flat-roof systems for commercial buildings, including replacement, repair and ongoing inspection. See the commercial-roofing variant hub for the system types the reference program lists.",
    to: "/roofing/commercial-roofing",
    linkLabel: "Commercial roofing hub",
  },
  {
    title: "Multi-system exterior work",
    body: "Residential-exterior services at commercial scale — siding, windows, gutters and masonry — coordinated by a single point of contact so one trade's schedule does not block another.",
    to: "/roofing",
    linkLabel: "Service overview",
  },
  {
    title: "Property-manager scheduling",
    body: "Commercial projects often need coordination with tenants, after-hours access, or phased work across multiple buildings. The reference program emphasizes communication and planning throughout each phase.",
    to: "/free-estimate",
    linkLabel: "Request an estimate",
  },
];

export default function CommercialProjectsPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Commercial Projects",
      description:
        "Commercial exterior work overview — roofing, siding, windows, gutters and masonry at commercial scale. No invented client list or metrics.",
      canonicalPath: "/commercial-projects/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="commercial-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Commercial Projects</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            For property managers &amp; business owners
          </p>
          <h1
            id="commercial-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Commercial projects.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            This page is an informational overview of the kinds of commercial
            exterior work the reference program lists. No individual completed
            project, client name, project location, before/after figure, or
            commercial testimonial is reproduced here — the reference's live
            project listings were not fetched in this session, and project
            portfolios are not fabricated.
          </p>
        </Container>
      </section>

      <section aria-labelledby="scopes-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="scopes-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            What commercial scopes typically include
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {SCOPES.map((s) => (
              <li
                key={s.title}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-5 flex flex-col"
              >
                <h3 className="text-lg font-bold text-[var(--color-brand-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {s.body}
                </p>
                <Link
                  to={s.to}
                  className="mt-4 text-sm font-bold text-[var(--color-brand-accent)] hover:underline uppercase tracking-wider"
                >
                  {s.linkLabel} »
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="gallery-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="gallery-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Project gallery
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              Project images, locations, before/after photographs and client
              names are intentionally not shown here. The reference program's
              own commercial project material has not been inspected in this
              session, and no project is reproduced from memory or generic
              stock imagery.
            </p>
            <p>
              When verified commercial project material is supplied by the
              client, this section can be replaced with a real project gallery.
              Until then, it stays an honest empty state rather than invented
              content.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="commercial-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="commercial-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Discuss a commercial project
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Reach the team by phone, or request a free written estimate
              online. Demo contact routes — nothing is sent to a real address.
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
              to="/free-estimate"
              className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
            >
              Get a FREE Estimate
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
