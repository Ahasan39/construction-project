import { Container } from "@/components/ui";
import { reviews } from "@/data/reviews";

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-1 text-[#00a3e0]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-current" : "fill-slate-200 text-slate-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Reconstructed ReviewsStrip matching the reference:
 * - Headline with customer satisfaction social proof.
 * - 3 testimonial cards featuring 5 bright cyan/sky-blue review stars,
 *   authentic quote copy, verified reviewer names and service badges.
 */
export function ReviewsStrip() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container width="wide" className="py-14 sm:py-18 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#00a3e0] mb-2">
            Verified Reviews & Testimonials
          </p>
          <h2
            id="reviews-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-brand-primary)] tracking-tight leading-snug"
          >
            Hear what our customers have to say.
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Over 500,000 satisfied homeowners can vouch for our high-speed quality and craftsmanship.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <Stars rating={r.rating} />
                <blockquote className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed italic">
                  "{r.body}"
                </blockquote>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--color-brand-primary)]">
                    {r.author}
                  </p>
                  {r.cityState && (
                    <p className="text-xs text-slate-500 font-medium">
                      {r.cityState}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                  <svg className="w-3.5 h-3.5 text-[#00a3e0]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Verified</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-slate-400">
          Demonstration customer testimonials — based on representative reference feedback.
        </p>
      </Container>
    </section>
  );
}
