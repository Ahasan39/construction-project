import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";
import { EstimateForm } from "@/features/estimate/EstimateForm";

export default function FreeEstimatePage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Free Estimate",
      description:
        "Request a free, no-obligation estimate for roofing, siding, windows, gutters or masonry. Demo form — submissions are not sent.",
      canonicalPath: "/free-estimate/",
    });
  }, []);

  return (
    <section
      aria-labelledby="free-estimate-title"
      className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden="true"> › </span>
          <span>Free Estimate</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Free, No-Obligation Written Quote
            </p>
            <h1
              id="free-estimate-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight [overflow-wrap:anywhere]"
            >
              Free Estimate.
            </h1>
            <p className="text-slate-700 text-base leading-relaxed max-w-prose">
              Fill out the form and we will contact you to confirm the next
              step. Your details only reach this demo — no reference-company
              endpoint is called.
            </p>

            <div className="mt-2 rounded-sm bg-white border border-slate-200/80 p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-[var(--color-brand-primary)]">
                Prefer to talk?
              </p>
              <p className="text-sm text-slate-700">
                Call{" "}
                <a
                  href={brand.phoneHref}
                  className="font-bold text-[var(--color-brand-accent)] hover:underline"
                >
                  {brand.phoneDisplay}
                </a>{" "}
                or email{" "}
                <a
                  href={brand.emailHref}
                  className="font-semibold text-[var(--color-brand-primary)] hover:underline"
                >
                  {brand.email}
                </a>
                .
              </p>
              <p className="text-xs text-slate-500">
                Demo contact routes — no office address is published for this
                demo.
              </p>
            </div>
          </div>

          <aside
            aria-label="Estimate form"
            className="rounded-sm bg-[#0C1F33] text-white p-6 sm:p-7 shadow-md border border-slate-800"
          >
            <div className="pb-3 mb-4 border-b border-slate-700/60">
              <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
                Request a Free Estimate
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Select your location and service below. Demo form — submissions are not sent.
              </p>
            </div>

            <EstimateForm
              variant="inverse"
              submitLabel="Get a FREE ESTIMATE"
            />
          </aside>
        </div>
      </Container>
    </section>
  );
}
