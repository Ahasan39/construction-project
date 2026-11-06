import type { HTMLAttributes } from "react";

type Tone = "default" | "alt" | "brand";

const toneClass: Record<Tone, string> = {
  default: "bg-[var(--color-surface)]",
  alt: "bg-[var(--color-surface-alt)]",
  brand: "bg-[var(--color-brand-primary)] text-white",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  as?: "section" | "div" | "article" | "aside";
}

export function Section({
  tone = "default",
  as: As = "section",
  className = "",
  ...rest
}: SectionProps) {
  return (
    <As
      className={`py-12 md:py-16 lg:py-20 ${toneClass[tone]} ${className}`}
      {...rest}
    />
  );
}
