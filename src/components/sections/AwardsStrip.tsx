import { Container } from "@/components/ui";

const awards = [
  {
    name: "Roofing Contractor Top 100",
    src: "/images/awards/roofing-contractor-top-100.svg",
    width: 160,
    height: 80,
  },
  {
    name: "BBB Accredited Business A+",
    src: "/images/awards/bbb-accredited-a-plus.svg",
    width: 160,
    height: 80,
  },
  {
    name: "Owens Corning Platinum Preferred Contractor",
    src: "/images/awards/owens-corning-platinum.svg",
    width: 160,
    height: 80,
  },
  {
    name: "Angi 2022 Super Service Award",
    src: "/images/awards/angi-super-service-award.svg",
    width: 160,
    height: 80,
  },
  {
    name: "Best of HomeAdvisor Winner",
    src: "/images/awards/homeadvisor-winner.svg",
    width: 160,
    height: 80,
  },
];

/**
 * Reconstructed Awards & Certifications strip:
 * - Rich dark navy background matching reference site (#0f2231).
 * - Full-vector authentic award badges replacing provisional dashed wireframe tiles.
 */
export function AwardsStrip() {
  return (
    <section
      aria-labelledby="awards-heading"
      className="bg-[var(--color-brand-primary)] border-t border-slate-800 text-white py-12 sm:py-14"
    >
      <Container width="wide">
        <h2 id="awards-heading" className="sr-only">
          Awards and certifications
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {awards.map((badge) => (
            <div
              key={badge.name}
              className="flex items-center justify-center h-16 sm:h-20 max-w-[160px] opacity-90 hover:opacity-100 transition-opacity"
            >
              <img
                src={badge.src}
                alt={badge.name}
                width={badge.width}
                height={badge.height}
                loading="lazy"
                decoding="async"
                className="h-full w-auto object-contain drop-shadow"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
