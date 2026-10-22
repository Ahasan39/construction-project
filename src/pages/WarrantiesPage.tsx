import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";

const CATEGORIES = [
  {
    key: "manufacturer",
    heading: "Manufacturer warranties",
    body: "Shingles, siding, windows and other installed products carry a warranty issued by the manufacturer that made them. Coverage length, prorations and conditions are set by the manufacturer, not the installer, and are documented in the product's own warranty certificate.",
    scope: [
      "Covers material defects as defined by the manufacturer.",
      "Length and proration schedule vary by product line and tier.",
      "Transfer rules and registration requirements are set by the manufacturer.",
    ],
  },
  {
    key: "workmanship",
    heading: "Workmanship / installation warranties",
    body: "Workmanship coverage addresses the installation itself — how the product was fastened, flashed and finished. The reference program emphasizes standing behind its installation separately from the manufacturer's material coverage.",
    scope: [
      "Covers how the product was installed, not product defects.",
      "Length and transfer terms are set by the contractor, not the manufacturer.",
      "Service response and remediation are documented in the signed contract.",
    ],
  },
];

export default function WarrantiesPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Warranties",
      description:
        "Overview of manufacturer vs. workmanship warranties on residential exterior work — informational only.",
      canonicalPath: "/warranties/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="warranties-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Warranties</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Project coverage
          </p>
          <h1
            id="warranties-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Warranties.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            A residential-exterior project is typically covered by two
            separate warranties — a manufacturer warranty on the product and a
            workmanship warranty on the installation. This page explains the
            distinction in general terms. Specific coverage lengths,
            prorations, exclusions and transfer rules are set by the reference
            program's own certificates and are not reproduced here.
          </p>
        </Container>
      </section>

      <section aria-labelledby="categories-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="categories-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Two kinds of coverage
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {CATEGORIES.map((c) => (
              <li
                key={c.key}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-6"
              >
                <h3 className="text-xl font-black tracking-tight text-[var(--color-brand-primary)]">
                  {c.heading}
                </h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {c.body}
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-700 list-disc pl-5">
                  {c.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="warranty-notes-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="warranty-notes-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Important notes
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              <strong>No fixed term quoted here.</strong> Specific lengths and
              exclusions depend on the product line and the signed contract.
              This page does not quote a coverage duration or guarantee.
            </p>
            <p>
              <strong>Read the certificates.</strong> On any project, keep the
              product's manufacturer warranty certificate and the signed
              workmanship terms together with the final invoice. Both are
              needed to make a claim later.
            </p>
            <p>
              <strong>This reproduction does not issue coverage.</strong>{" "}
              Nothing on this page creates a warranty obligation. Warranty
              service is provided by the actual contractor and manufacturers
              on real projects, not by this demo.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="warranties-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="warranties-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Questions about coverage on a project?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              A written estimate is the easiest way to see which product lines
              and warranty tiers apply to your project.
            </p>
          </div>
          <Link
            to="/free-estimate"
            className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
          >
            Get a FREE Estimate
          </Link>
        </Container>
      </section>
    </>
  );
}
