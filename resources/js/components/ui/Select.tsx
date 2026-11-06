import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

const base =
  "block w-full h-11 px-3 rounded-[var(--radius-md)] bg-white border transition-colors appearance-none pr-10";
const stateOk =
  "border-[var(--color-border)] focus:border-[var(--color-focus)]";
const stateBad =
  "border-[var(--color-danger)] focus:border-[var(--color-danger)]";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className = "", children, ...rest },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${base} ${invalid ? stateBad : stateOk} ${className}`}
        {...rest}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        ▾
      </span>
    </div>
  );
});
