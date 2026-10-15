import { Container } from "@/components/ui";

/**
 * Statement band from the reference:
 *
 * "Protect your home with industry-leading expertise and comprehensive home
 *  exterior services backed by a superior warranty."
 *
 * Rendered as centered prose with two phrases emphasized in brand color.
 */
export function ProtectBand() {
  return (
    <section
      aria-label="Value statement"
      className="bg-white border-b border-[var(--color-border)]"
    >
      <Container className="py-10 md:py-14 text-center">
        <p className="text-xl md:text-2xl font-semibold leading-snug max-w-4xl mx-auto">
          Protect your home with{" "}
          <span className="text-[var(--color-brand-primary)]">
            industry-leading expertise
          </span>{" "}
          and{" "}
          <span className="text-[var(--color-brand-primary)]">
            comprehensive home exterior services
          </span>{" "}
          backed by a superior warranty.
        </p>
      </Container>
    </section>
  );
}
