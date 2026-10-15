import { Container } from "@/components/ui";

/**
 * Awards / trust badges strip. The reference shows ~5 badge images (industry
 * trade awards and ratings). We never fabricate badges, so each slot renders
 * a captioned placeholder tile stating what the client would supply.
 */
const slots = [
  "Industry trade ranking (e.g. Roofing Contractor Top 100)",
  "Primary manufacturer certification (e.g. Owens Corning Platinum)",
  "Secondary manufacturer certification (e.g. GAF Master Elite)",
  "Business accreditation (e.g. BBB A+)",
  "Consumer-choice award",
];

export function AwardsStrip() {
  return (
    <section
      aria-labelledby="awards-heading"
      className="bg-[var(--color-surface-alt)] border-y border-[var(--color-border)]"
    >
      <Container width="wide" className="py-10 md:py-12">
        <h2
          id="awards-heading"
          className="sr-only"
        >
          Awards and certifications
        </h2>
        <p className="text-center text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
          Awards and certifications — pending client-supplied logos
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {slots.map((caption) => (
            <li
              key={caption}
              className="flex flex-col items-center justify-center text-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-white px-4 py-6 min-h-24"
            >
              <span
                aria-hidden="true"
                className="h-10 w-10 rounded-full bg-[var(--color-surface-alt)]"
              />
              <span className="mt-3 text-[11px] text-[var(--color-ink-muted)] leading-tight">
                {caption}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
