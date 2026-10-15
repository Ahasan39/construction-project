import { Link } from "react-router-dom";
import { Container, PlaceholderImage } from "@/components/ui";

interface ServiceCard {
  title: string;
  body: string;
  imageLabel: string;
  actions: { label: string; to: string }[];
}

/**
 * Reference's homepage services grid: Roofing, Siding, Windows, Gutters, each
 * card headlined by an image + short pitch + one or two actions. Roofing has
 * the only split CTA on the reference (Replace / Repair).
 */
const cards: ServiceCard[] = [
  {
    title: "Roofing",
    body: "We treat your emergency like our own — dispatching a local expert within 24 hours and standing behind the work for life.",
    imageLabel: "Roofing illustration",
    actions: [
      { label: "Replace my roof", to: "/roofing/roof-replacement" },
      { label: "Repair my roof", to: "/roofing/roof-repair" },
    ],
  },
  {
    title: "Siding",
    body: "Pair performance siding with a neighborly design consult that makes choosing the right look for your home easy.",
    imageLabel: "Siding illustration",
    actions: [{ label: "Replace my siding", to: "/siding" }],
  },
  {
    title: "Windows",
    body: "We evaluate your home envelope specifically for high-performance windows that slash energy bills.",
    imageLabel: "Windows illustration",
    actions: [{ label: "Replace my windows", to: "/windows" }],
  },
  {
    title: "Gutters",
    body: "Install new gutters and downspouts that keep the rain where it belongs — away from your home.",
    imageLabel: "Gutters illustration",
    actions: [{ label: "Replace my gutters", to: "/gutters" }],
  },
];

export function ServiceCards() {
  return (
    <section aria-labelledby="services-heading" className="bg-white">
      <Container width="wide" className="py-14 md:py-20">
        <h2
          id="services-heading"
          className="text-3xl md:text-4xl font-extrabold text-center"
        >
          Our <span className="text-[var(--color-brand-accent)]">Services</span>
        </h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <li
              key={c.title}
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden bg-white shadow-[var(--shadow-card)]"
            >
              <PlaceholderImage width={800} height={400} label={c.imageLabel} tone="brand" />
              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-xl font-bold">{c.title}</h3>
                <p className="text-sm text-[var(--color-ink-muted)]">{c.body}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.actions.map((a) => (
                    <Link
                      key={a.to}
                      to={a.to}
                      className="inline-flex items-center h-10 px-4 rounded-[var(--radius-md)] border border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] text-sm font-semibold hover:bg-[var(--color-brand-accent)] hover:text-white transition-colors"
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
