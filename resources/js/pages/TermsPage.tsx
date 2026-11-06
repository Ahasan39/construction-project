import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";

const SECTIONS = [
  {
    id: "scope",
    title: "What this document is",
    body: "These terms are a non-final demo placeholder shipped with the frontend reproduction site. They are a working outline for the client's legal team to review and finalize before launch. Nothing on this page creates a binding agreement between any party and any specific business.",
  },
  {
    id: "demo-forms",
    title: "Demonstration forms",
    body: "Forms on this reproduction site — including the free-estimate form and the refer-a-friend form — are demonstrations. Submissions are not transmitted or stored, no project is scheduled, no referral is registered, and no reward is issued. Any production terms around form submissions, project agreements, or referrals belong in the final, legally reviewed version of this document.",
  },
  {
    id: "no-promotions",
    title: "No active promotions, financing or warranty obligations",
    body: "The Special Offers, Financing and Warranties pages on this reproduction describe general categories only. This reproduction site does not operate the reference program's promotions, does not quote financing rates or terms, and does not issue warranty coverage. Specific terms on real projects are set by the signed contract, the lender's own documents, and the manufacturer's own warranty certificate.",
  },
  {
    id: "external-links",
    title: "External destinations",
    body: "External destinations referenced on this site (bill-pay portal, visualizer, applicant-tracking system, etc.) are only included once the real URL and the business relationship are verified. Until then, the corresponding pages show an unavailable or placeholder state rather than linking to an unverified destination.",
  },
  {
    id: "changes",
    title: "Changes",
    body: "In production, this document would describe how changes to the terms are communicated and when they take effect. Those specifics are deliberately not fabricated here.",
  },
];

export default function TermsPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Terms and Conditions",
      description:
        "Non-final demo terms-and-conditions placeholder — requires legal review before launch.",
      canonicalPath: "/terms-and-conditions/",
      noindex: true,
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="terms-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Terms and Conditions</span>
          </nav>
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider px-2 py-1">
            Demo placeholder — not legal advice
          </span>
          <h1
            id="terms-title"
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Terms and conditions.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            This page is a non-final demo placeholder. It describes, in
            general terms, what a production terms-and-conditions document for
            a residential-exterior contractor site typically covers. It has
            not been reviewed by legal counsel and does not represent an
            active agreement with any specific business.
          </p>
        </Container>
      </section>

      <section className="bg-white">
        <Container width="content" className="py-12 sm:py-16">
          <nav aria-label="On this page" className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
              On this page
            </h2>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-slate-700">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
                <h2
                  id={`${s.id}-title`}
                  className="text-xl font-black tracking-tight text-[var(--color-brand-primary)]"
                >
                  {s.title}
                </h2>
                <p className="mt-3 text-slate-700 leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-10 text-xs text-slate-500 italic">
            Non-final demo content. Not legal advice. Must be reviewed and
            replaced by the client's legal counsel before production use.
          </p>
        </Container>
      </section>
    </>
  );
}
