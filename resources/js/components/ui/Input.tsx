import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const base =
  "block w-full h-11 px-3 rounded-[var(--radius-md)] bg-white border transition-colors";
const stateOk =
  "border-[var(--color-border)] focus:border-[var(--color-focus)]";
const stateBad =
  "border-[var(--color-danger)] focus:border-[var(--color-danger)]";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={`${base} ${invalid ? stateBad : stateOk} ${className}`}
      {...rest}
    />
  );
});
