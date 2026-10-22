import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  labelClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { label, description, invalid, id: idProp, className = "", labelClassName = "", ...rest },
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
          className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--color-brand-accent)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
          {...rest}
        />
        <div className="flex flex-col">
          <label htmlFor={id} className={`cursor-pointer ${labelClassName || "text-sm leading-snug"}`}>
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
