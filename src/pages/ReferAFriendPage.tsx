import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";
import { ReferralForm } from "@/features/referral/ReferralForm";

const STEPS = [
  {
    n: "1",
    title: "Tell us about your friend",
    body: "Share your friend's name and best contact details, along with their service area, using the form below.",
  },
  {
    n: "2",
    title: "They request a project",
    body: "Your friend reaches out for a free estimate and, if they choose to move forward, has their project completed.",
  },
  {
    n: "3",
    title: "You both get rewarded",
    body: "Once the referred project is complete, the reference program credits both of you. See the reward note below for details.",
  },
];

export default function ReferAFriendPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Refer a Friend",
      description:
        "Refer a friend to the team. Three simple steps — demo referral form, submissions are not transmitted or stored.",
      canonicalPath: "/refer-a-friend/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="refer-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Refer a Friend</span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Share the team you trust
          </p>
          <h1
            id="refer-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Refer a Friend.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-2xl">
            Know someone who could use a hand with roofing, siding, windows,
            gutters or masonry? Pass along their details and we will take it
            from there. On the reference program, both of you receive a reward
            once the referred project is complete.
          </p>
        </Container>
      </section>

      <section aria-labelledby="how-it-works-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            How it works
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

      <section aria-labelledby="reward-title" className="bg-[#F4F6F8] border-y border-[var(--color-border)]">
        <Container width="wide" className="py-12">
          <h2
            id="reward-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Reward &amp; terms
          </h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            On the reference site, the referral program credits both the
            referrer and the referred customer once a qualifying project is
            completed. Exact reward amount, eligibility, and payout timing are
            set by the reference program's own terms. This reproduction site
            does not operate the program and does not pay rewards; any amounts
            or timing you see here are for layout demonstration only.
          </p>
        </Container>
      </section>

      <section
        aria-labelledby="referral-form-title"
        className="bg-white"
      >
        <Container width="content" className="py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
            <div>
              <h2
                id="referral-form-title"
                className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
              >
                Send a referral
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Fill in your details and your friend's details. We will reach
                out to your friend about a free estimate for their project.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Prefer to talk?{" "}
                <a
                  href={brand.phoneHref}
                  className="font-bold text-[var(--color-brand-accent)] hover:underline"
                >
                  {brand.phoneDisplay}
                </a>
              </p>
            </div>

            <div className="rounded-sm bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
              <ReferralForm />
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="estimate-cta-title" className="bg-[#0C1F33] text-white">
        <Container width="wide" className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h2
              id="estimate-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Need an estimate yourself?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free, no-obligation estimate online — the same form
              your referred friend will see.
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
