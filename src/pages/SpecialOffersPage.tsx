import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { offers } from "@/data/offers";

export default function SpecialOffersPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Special Offers",
      description:
        "Promotional information — demo-only placeholder offers. This reproduction site does not run live promotions.",
      canonicalPath: "/special-offers/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="offers-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Special Offers</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Promotions
          </p>
          <h1
            id="offers-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Special offers.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            We periodically run promotions on roofing, siding, windows,
            gutters and masonry. Contact our team for the latest offer
            wording, eligibility and timing for your project.
          </p>
        </Container>
      </section>

      <section aria-labelledby="offers-list-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="offers-list-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Offer categories
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-prose">
            The categories below describe the kinds of promotions we typically
            run. Contact our team for the latest wording and terms before your
            project begins.
          </p>

          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {offers.map((o) => (
              <li
                key={o.slug}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-6 flex flex-col"
              >
                <h3 className="text-xl font-black tracking-tight text-[var(--color-brand-primary)]">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {o.body}
                </p>
                <p className="mt-3 text-xs text-slate-500 italic">
                  {o.disclaimer}
                </p>
                <Link
                  to="/free-estimate"
                  className="mt-5 inline-flex items-center justify-center h-11 self-start rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white text-xs font-extrabold uppercase tracking-wider px-6 shadow-sm transition-colors"
                >
                  Get a FREE Estimate
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="offers-note-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="offers-note-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            About these offers
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              Our team will walk through the specific promotion wording,
              eligibility, and timing that apply to your project during your
              estimate. Terms may vary by service, season, and location.
            </p>
            <p>
              Have questions before scheduling? Call the number in the footer
              or use the Contact Us form and a team member will follow up.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
