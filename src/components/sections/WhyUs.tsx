import { Container, PlaceholderImage } from "@/components/ui";

interface Benefit {
  title: string;
  body: string;
  imageLabel: string;
}

/**
 * "Why Us" section — four benefit panels from the reference. Each panel is
 * image + text, stacked vertically on narrow screens and alternating left/right
 * on wide screens. Imagery is placeholder until client assets land.
 *
 * Copy is lightly paraphrased from the reference's demonstration content and
 * marked as placeholder in text until client-approved copy is supplied.
 */
const benefits: Benefit[] = [
  {
    title: "60+ Years. 500,000+ Installs. 1,500+ Five-Star Reviews.",
    body: "Decades of hands-on experience with a track record of workmanship homeowners trust. (Demonstration copy — awaiting client-approved stats.)",
    imageLabel: "Crew installing roof",
  },
  {
    title: "Direct Answers. Decisive Action.",
    body: "Clear estimates, side-by-side options, and honest cost breakdowns that let you make confident decisions.",
    imageLabel: "Consultation with homeowner",
  },
  {
    title: "Lifetime Protection. High-Speed Service.",
    body: "Same-day installations with precision and minimal disruption, backed by a lifetime warranty on qualifying work.",
    imageLabel: "Finished roof close-up",
  },
  {
    title: "More Than a Roof. It's an Exterior Upgrade.",
    body: "Roofing, siding, windows, gutters and masonry unified under one expert team — one project, one point of contact.",
    imageLabel: "Full-house exterior",
  },
];

export function WhyUs() {
  return (
    <section
      aria-labelledby="why-us-heading"
      className="bg-[var(--color-surface-alt)]"
    >
      <Container className="py-14 md:py-20">
        <h2
          id="why-us-heading"
          className="text-3xl md:text-4xl font-extrabold text-center"
        >
          Why <span className="text-[var(--color-brand-accent)]">Us?</span>
        </h2>

        <ol className="mt-10 flex flex-col gap-10">
          {benefits.map((b, i) => (
            <li
              key={b.title}
              className={`grid gap-6 md:grid-cols-2 md:items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="rounded-[var(--radius-lg)] overflow-hidden bg-white shadow-[var(--shadow-card)]">
                <PlaceholderImage
                  width={800}
                  height={520}
                  label={b.imageLabel}
                  tone="brand"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-brand-primary)]">
                  {b.title}
                </h3>
                <p className="mt-3 text-[var(--color-ink-muted)]">{b.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
