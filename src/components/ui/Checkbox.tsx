import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, invalid, id: idProp, className = "", ...rest },
    ref
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const descId = description ? `${id}-desc` : undefined;

    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-describedby={descId}
          aria-invalid={invalid || undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand-primary)]"
          {...rest}
        />
        <div className="flex flex-col">
          <label htmlFor={id} className="text-sm leading-snug cursor-pointer">
            {label}
          </label>
          {description && (
            <p
              id={descId}
              className="text-xs text-[var(--color-ink-muted)] mt-0.5"
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);
