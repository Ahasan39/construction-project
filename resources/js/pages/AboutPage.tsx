import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";
import { services } from "@/data/services";

const VALUES = [
  {
    title: "Quality workmanship",
    body: "Material selection, installation detail and site cleanup are the three places quality shows up on a residential exterior. The reference site centers each of them in its company story.",
  },
  {
    title: "Clear communication",
    body: "A single point of contact, a shared schedule and plain-language documentation keep homeowners informed from estimate through final walkthrough.",
  },
  {
    title: "Standing behind the work",
    body: "The reference program emphasizes a transferable workmanship commitment on top of manufacturer coverage. See the Warranties page for how the two differ.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "About",
      description:
        "About the team — company story, values and service approach for this reproduction site.",
      canonicalPath: "/about/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="about-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>About</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Residential exterior contractor
          </p>
          <h1
            id="about-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            About us.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            This site is a frontend reproduction of the reference contractor's
            public pages. Content is drawn from the public reference where it
            could be read directly; founding dates, staff biographies, and
            individual certifications are not reproduced because they are not
            verifiable from publicly readable source material in this session.
          </p>
        </Container>
      </section>

      <section aria-labelledby="story-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
            <div>
              <h2
                id="story-title"
                className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
              >
                Our approach to residential exteriors
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-slate-700 leading-relaxed">
                <p>
                  Residential exterior work covers five main systems — roofing,
                  siding, windows, gutters and masonry. Each has its own
                  installation detail, failure modes and material lifetimes.
                  Treating them as a single service rather than five siloed
                  trades makes the project easier for the homeowner to plan.
                </p>
                <p>
                  A good estimate is more than a price. It documents the
                  condition of the existing exterior, the recommended materials
                  with reasons, the sequence of work and the clean-up plan.
                  Those details are what the reference program communicates in
                  its own words throughout its site.
                </p>
                <p>
                  After installation, documentation of what was installed and
                  how to maintain it is kept with the homeowner. If something
                  is wrong, the reference says it is made right — one company,
                  one point of contact, one honest answer.
                </p>
              </div>
            </div>

            <aside
              aria-labelledby="services-callout-title"
              className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-6"
            >
              <h2
                id="services-callout-title"
                className="text-lg font-bold text-[var(--color-brand-primary)]"
              >
                Services covered
              </h2>
              <ul className="mt-3 space-y-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/${s.slug}`}
                      className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline"
                    >
                      {s.title}
                    </Link>
                    <span className="text-sm text-slate-600"> — {s.tagline}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/free-estimate"
                className="mt-5 inline-flex items-center justify-center h-11 w-full rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white text-xs font-extrabold uppercase tracking-wider px-6 shadow-sm transition-colors"
              >
                Get a FREE Estimate
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      <section aria-labelledby="values-title" className="bg-[#F4F6F8] border-y border-[var(--color-border)]">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="values-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            What we focus on
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <li
                key={v.title}
                className="rounded-sm border border-slate-200 bg-white p-5"
              >
                <h3 className="text-lg font-bold text-[var(--color-brand-primary)]">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {v.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="about-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="about-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Ready to talk about a project?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Reach us by phone or request a free estimate online. Demo contact
              routes — nothing is sent to a real address.
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
