import { useId } from "react";
import type { ReactNode } from "react";

export interface FieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  errorClassName?: string;
  hideLabel?: boolean;
  /**
   * Render callback receives the ids to wire onto the control:
   *   `id` → label-for target,
   *   `describedBy` → aria-describedby,
   *   `invalid` → aria-invalid.
   */
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
}

export function Field({
  label,
  description,
  error,
  required,
  errorClassName = "text-[var(--color-danger)]",
  hideLabel = false,
  children,
}: FieldProps) {
  const id = useId();
  const descId = description ? `${id}-desc` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "text-sm font-medium"}
      >
        {label}
        {required && (
          <>
            {" "}
            <span aria-hidden="true" className="text-[var(--color-danger)]">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {description && (
        <p id={descId} className="text-sm text-[var(--color-ink-muted)]">
          {description}
        </p>
      )}
      {children({ id, describedBy, invalid: !!error })}
      {error && (
        <p
          id={errId}
          role="alert"
          className={`text-sm ${errorClassName}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
