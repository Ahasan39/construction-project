import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { reviews } from "@/data/reviews";

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div
      role="img"
      className="flex items-center gap-1"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 ${
            i < rating
              ? "fill-[#59BBD7] text-[#59BBD7]"
              : "fill-slate-200 text-slate-200"
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Customer Reviews",
      description:
        "Testimonials transcribed from the reference site's own customer review carousel. No ratings or review-platform badges are fabricated.",
      canonicalPath: "/reviews/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="reviews-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Customer Reviews</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            In their own words
          </p>
          <h1
            id="reviews-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Customer reviews.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            The testimonials below are transcribed from the reference site's
            own public customer-review carousel. No star counts, review-site
            badges, or aggregated ratings have been invented. If a review was
            not published on the reference site, it is not shown here.
          </p>
        </Container>
      </section>

      <section aria-labelledby="reviews-list-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2
            id="reviews-list-title"
            className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            Transcribed testimonials
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-prose">
            Source: public customer-testimonial carousel on the reference
            homepage. Author names and locations are shown as published there.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-5 flex flex-col"
              >
                <Stars rating={r.rating} />
                <blockquote className="mt-3 text-sm text-slate-700 leading-relaxed">
                  “{r.body}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-[var(--color-brand-primary)]">
                    {r.author}
                  </span>
                  {r.cityState && (
                    <span className="text-slate-600"> — {r.cityState}</span>
                  )}
                </figcaption>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="reviews-notes-title"
        className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
      >
        <Container width="wide" className="py-12">
          <h2
            id="reviews-notes-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            About these reviews
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
            <p>
              This page does not aggregate reviews, show a composite rating,
              display a review-platform badge, or claim a review count. It
              simply lists the testimonials visible on the reference site's
              own customer carousel.
            </p>
            <p>
              Links to external review platforms (Google, BBB, Facebook,
              etc.) are intentionally omitted until the real URLs for the
              reference program's profiles are verified. Replace this section
              with verified links before launch.
            </p>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="reviews-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="reviews-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Ready to start a project?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free, no-obligation estimate online.
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
