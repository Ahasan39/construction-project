import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";
import { locations } from "@/data/locations";

export default function ContactUsPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Contact Us",
      description:
        "Get in touch with our team. Call, email, or request a free estimate online — demo contact routes for this reproduction site.",
      canonicalPath: "/contact-us/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="contact-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Contact Us</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
            <div className="flex flex-col gap-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                We would love to hear from you
              </p>
              <h1
                id="contact-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
              >
                Contact Us.
              </h1>
              <p className="text-slate-700 text-base leading-relaxed max-w-prose">
                Questions about an upcoming project, an in-progress job, or
                something else? Reach the team by phone or email, or request a
                free, no-obligation estimate online. This frontend reproduction
                routes all contacts to the shared demo address and phone — no
                reference-company endpoint is called.
              </p>

              <div className="mt-2 rounded-sm bg-white border border-slate-200/80 p-5 flex flex-col gap-3">
                <p className="text-sm font-semibold text-[var(--color-brand-primary)]">
                  Call or email the team
                </p>
                <p className="text-sm text-slate-700">
                  Phone:{" "}
                  <a
                    href={brand.phoneHref}
                    className="font-bold text-[var(--color-brand-accent)] hover:underline"
                  >
                    {brand.phoneDisplay}
                  </a>
                </p>
                <p className="text-sm text-slate-700">
                  Email:{" "}
                  <a
                    href={brand.emailHref}
                    className="font-semibold text-[var(--color-brand-primary)] hover:underline break-all"
                  >
                    {brand.email}
                  </a>
                </p>
                <p className="text-xs text-slate-500">
                  Demo contact routes — no office address or business hours are
                  published for this reproduction.
                </p>
              </div>
            </div>

            <aside
              aria-labelledby="estimate-cta-title"
              className="rounded-sm bg-[#0C1F33] text-white p-6 sm:p-7 shadow-md border border-slate-800"
            >
              <h2
                id="estimate-cta-title"
                className="text-2xl font-black tracking-tight text-white leading-tight"
              >
                Request a Free Estimate
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                The fastest way to start a conversation. Fill out the online
                form and we will follow up on next steps.
              </p>
              <Link
                to="/free-estimate"
                className="mt-5 inline-flex items-center justify-center h-12 w-full rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
              >
                Get a FREE Estimate
              </Link>
              <p className="mt-3 text-xs text-slate-400">
                Demo form — submissions are not sent.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      <section aria-labelledby="service-areas-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="service-areas-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Reach out by service area
          </h2>
          <p className="mt-2 text-slate-700 max-w-prose">
            Pick the location closest to your project to see its local hub and
            request a free estimate.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <li key={loc.slug}>
                <Link
                  to={`/${loc.slug}/`}
                  className="block rounded-sm border border-slate-200 bg-[#F4F6F8] hover:bg-white hover:border-slate-300 px-4 py-3 transition-colors"
                >
                  <span className="font-semibold text-[var(--color-brand-primary)]">
                    {loc.city}, {loc.state}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
