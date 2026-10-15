import { Container } from "@/components/ui";
import { reviews } from "@/data/reviews";

function Stars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-[var(--color-ink-muted)]">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/**
 * Review grid. The reference arrangement across widths was NOT verified in a
 * live browser — we implemented a static responsive grid (3-up at md,
 * 1-up on narrow). Carousel is intentionally avoided until the behavior is
 * confirmed; see docs/REFERENCE_AUDIT.md.
 *
 * Every review is placeholder content (`isPlaceholder: true`) and is clearly
 * labelled as "Demonstration".
 */
export function ReviewsStrip() {
  return (
    <section aria-labelledby="reviews-heading" className="bg-white">
      <Container width="wide" className="py-14 md:py-20">
        <h2
          id="reviews-heading"
          className="text-2xl md:text-3xl font-extrabold text-center max-w-3xl mx-auto"
        >
          Hear what our customers have to say.
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-ink-muted)]">
          Demonstration content — placeholder reviews pending client-supplied
          testimonials.
        </p>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <Stars rating={r.rating} />
              <p className="mt-3 text-sm text-[var(--color-ink)] flex-1">
                "{r.body}"
              </p>
              <p className="mt-3 text-sm font-semibold">{r.author}</p>
              {r.cityState && (
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {r.cityState}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
