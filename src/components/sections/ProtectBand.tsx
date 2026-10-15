import { Container } from "@/components/ui";

/**
 * Statement band from the reference:
 *
 * "Protect your home with industry-leading expertise and comprehensive home
 *  exterior services backed by a superior warranty."
 *
 * Rendered as large, centered bold typography with the two key phrases highlighted
 * in vibrant cyan/sky-blue (#00a3e0) matching the reference site.
 */
export function ProtectBand() {
  return (
    <section
      aria-label="Value statement"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container className="py-12 sm:py-16 md:py-20 text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug tracking-tight text-[var(--color-brand-primary)] max-w-4xl mx-auto">
          Protect your home with{" "}
          <span className="text-[#00a3e0] font-black">
            industry-leading expertise
          </span>{" "}
          and{" "}
          <span className="text-[#00a3e0] font-black">
            comprehensive home exterior services
          </span>{" "}
          backed by a superior warranty.
        </p>
      </Container>
    </section>
  );
}
