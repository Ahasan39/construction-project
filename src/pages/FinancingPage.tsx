import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";

const STEPS = [
  {
    n: "1",
    title: "Request an estimate",
    body: "A written estimate documents the scope and materials. It is the starting point for any financing conversation.",
  },
  {
    n: "2",
    title: "Review the written terms",
    body: "If financing is offered, compare the written terms — rate, length and total cost — against your other options.",
  },
  {
    n: "3",
    title: "Decide, then schedule",
    body: "Approval depends on the lender, not the contractor. Once approved and signed, the project is scheduled.",
  },
];

export default function FinancingPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Financing",
      description:
        "Overview of residential-exterior financing — informational only. This reproduction site does not operate a lender or process applications.",
      canonicalPath: "/financing/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="financing-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Financing</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Project financing
          </p>
          <h1
            id="financing-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Financing.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            Residential exterior projects are often financed through a
            third-party lender introduced by the contractor. This reproduction
            site provides general information only — specific rates, approval
            criteria, lender partners and application links are set by the
            reference program and are not reproduced here.
          </p>
        </Container>
      </section>

      <section aria-labelledby="how-financing-works-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="how-financing-works-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            How financing typically works
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
        aria-labelledby="financing-disclosures-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="financing-disclosures-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Important disclosures
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              <strong>Rates and payments.</strong> Any specific APR, monthly
              payment or promotional rate quoted in reference materials belongs
              to the lender and the time it was published. This reproduction
              does not quote rates. Compare the written terms you receive
              against your other options before signing.
            </p>
            <p>
              <strong>Approval.</strong> Approval, loan amount and terms are
              determined by the lender's own underwriting. Contractors
              introduce lenders; they do not approve or guarantee loans.
            </p>
            <p>
              <strong>No live application.</strong> No financing application
              can be submitted from this reproduction site. The Free Estimate
              CTA below starts a project conversation only.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="financing-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="financing-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Start with an estimate
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free, no-obligation written estimate. Financing options
              are discussed afterward if they are relevant to your project.
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
