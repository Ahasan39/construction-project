import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const base =
  "block w-full min-h-28 px-3 py-2 rounded-[var(--radius-md)] bg-white border transition-colors";
const stateOk =
  "border-[var(--color-border)] focus:border-[var(--color-focus)]";
const stateBad =
  "border-[var(--color-danger)] focus:border-[var(--color-danger)]";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid, className = "", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${base} ${invalid ? stateBad : stateOk} ${className}`}
        {...rest}
      />
    );
  }
);
