import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";

const SECTIONS = [
  {
    id: "scope",
    title: "What this document is",
    body: "This privacy policy is a non-final demo placeholder provided with the frontend reproduction site. It is intended as a working outline for the client's legal team to review and finalize before launch. Nothing on this page is a binding legal commitment or an active privacy policy of any specific business.",
  },
  {
    id: "info-collected",
    title: "Information that could be collected on a production deployment",
    body: "On a production deployment, forms on this site (free-estimate and referral) would typically collect contact information such as name, phone, email, service area and the service or project of interest. This frontend reproduction does not transmit or store those values — submissions remain in the browser and are not sent to any server.",
  },
  {
    id: "analytics",
    title: "Analytics, cookies and tracking",
    body: "A production deployment may add analytics, advertising, or session-replay tooling. Specific tools, retention periods and third-party partners would be listed here only when they are actually in use. This reproduction does not list any specific analytics vendor because none is wired up by the frontend demo.",
  },
  {
    id: "retention",
    title: "Retention and access requests",
    body: "A production policy would describe how long data is retained, how an individual can request access to or deletion of their data, and the jurisdictions whose laws apply. Those details are not fabricated here because they depend on the client's actual systems, vendors and legal counsel.",
  },
  {
    id: "contact",
    title: "Contact for privacy questions",
    body: "In production, a privacy contact and address would appear here. Pending that, the shared demo contact routes elsewhere on this site are the only contact information available.",
  },
];

export default function PrivacyPolicyPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Privacy Policy",
      description:
        "Non-final demo privacy-policy placeholder — requires legal review before launch. This reproduction site does not collect or transmit form data.",
      canonicalPath: "/privacy-policy/",
      noindex: true,
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="privacy-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Privacy Policy</span>
          </nav>
          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider px-2 py-1">
            Demo placeholder — not legal advice
          </span>
          <h1
            id="privacy-title"
            className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Privacy policy.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            This page is a non-final demo placeholder. It describes, in general
            terms, what a production privacy policy for this kind of site
            typically covers. It has not been reviewed by legal counsel and
            does not represent an active privacy policy of any specific
            business. Replace this content before launch.
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
