import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-600)] disabled:opacity-60",
  secondary:
    "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-600)] disabled:opacity-60",
  outline:
    "border-2 border-[var(--color-brand-accent)] bg-transparent text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-accent)] hover:text-white disabled:opacity-60",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] disabled:opacity-60",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
  md: "h-11 px-5 text-base rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base rounded-[var(--radius-md)]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    loadingLabel = "Working…",
    disabled,
    children,
    className = "",
    type = "button",
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...rest}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
});
