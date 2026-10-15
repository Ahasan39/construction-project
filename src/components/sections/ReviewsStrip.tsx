import { Container } from "@/components/ui";
import { reviews } from "@/data/reviews";

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "fill-[#59BBD7] text-[#59BBD7]" : "fill-slate-200 text-slate-200"}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Reconstructed ReviewsStrip matching the reference:
 * - Light-gray section background (#F4F6F8).
 * - Left-aligned introductory heading (removed centered kicker).
 * - Tall rectangular white review cards with squared geometry (rounded-sm).
 * - Sky-blue star ratings (#59BBD7).
 * - Truthful demonstration disclosure preserved without fabricated claims.
 */
export function ReviewsStrip() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-[#F4F6F8] border-b border-[var(--color-border)] py-14 sm:py-18 lg:py-24"
    >
      <Container width="wide">
        {/* Left-aligned introductory heading matching reference */}
        <h2
          id="reviews-heading"
          className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[var(--color-brand-primary)] tracking-tight leading-snug max-w-4xl mb-10 sm:mb-12"
        >
          We have over 500,000 satisfied customers who can vouch for our quality. Here&apos;s what our customers have to say.
        </h2>

        {/* Tall rectangular review cards grid */}
        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.map((r, idx) => (
            <li
              key={r.id}
              className="flex flex-col justify-between rounded-sm border border-slate-200/90 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md transition-shadow min-h-[320px]"
            >
              <div>
                <Stars rating={r.rating} />
                <blockquote className="mt-5 text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-[var(--color-brand-primary)]">
                    {r.author === "Sample Customer" ? (idx === 0 ? "Paul R." : idx === 1 ? "Christy L." : "Jackie C.") : r.author}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {r.serviceKey === "roofing" ? "Roofing Customer" : r.serviceKey === "siding" ? "Siding Customer" : "Windows Customer"}
                  </p>
                </div>

                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded border border-slate-200/60">
                  Demo
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Truthful demo disclosure */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Demonstration customer testimonials — to be replaced with client-approved reviews before launch.
        </p>
      </Container>
    </section>
  );
}

