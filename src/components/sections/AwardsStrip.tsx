import { assetUrl } from "@/app/assets";
import { Container } from "@/components/ui";

const awards = [
  {
    name: "Roofing Contractor Top 100",
    src: assetUrl("/images/awards/roofing-contractor-top-100.svg"),
    width: 160,
    height: 80,
  },
  {
    name: "BBB Accredited Business A+",
    src: assetUrl("/images/awards/bbb-accredited-a-plus.svg"),
    width: 160,
    height: 80,
  },
  {
    name: "Owens Corning Platinum Preferred Contractor",
    src: assetUrl("/images/awards/owens-corning-platinum.svg"),
    width: 160,
    height: 80,
  },
  {
    name: "Angi 2022 Super Service Award",
    src: assetUrl("/images/awards/angi-super-service-award.svg"),
    width: 160,
    height: 80,
  },
  {
    name: "Best of HomeAdvisor Winner",
    src: assetUrl("/images/awards/homeadvisor-winner.svg"),
    width: 160,
    height: 80,
  },
];

/**
 * Awards & Certifications strip:
 * - Rich dark navy background matching reference site (#0f2231).
 * - Full-vector demonstration award badges approximating industry credentials.
 */
export function AwardsStrip() {
  return (
    <section
      aria-labelledby="awards-heading"
      className="bg-[#0C1F33] border-t border-slate-800 text-white py-12 sm:py-14"
    >
      <Container width="wide">
        <h2 id="awards-heading" className="text-sm text-center mb-6">
          Reference credential artwork — illustrative only, not credentials held by this demo
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {awards.map((badge) => (
            <div
              key={badge.name}
              className="flex items-center justify-center w-32 sm:w-36 md:w-40 h-14 sm:h-16 shrink-0 opacity-95 hover:opacity-100 transition-opacity"
            >
              <img
                src={badge.src}
                alt={badge.name}
                width={badge.width}
                height={badge.height}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
