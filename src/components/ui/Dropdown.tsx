import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export interface DropdownProps {
  /** Content of the trigger button. */
  label: ReactNode;
  /** Panel content; receives a `close` callback for the item click-handlers. */
  children: (api: { close: () => void }) => ReactNode;
  /** Optional accessible label for the panel wrapper. */
  panelLabel?: string;
  /** Classes applied to the trigger button. */
  triggerClassName?: string;
  /** Classes applied to the panel wrapper. */
  panelClassName?: string;
  /** Alignment of the panel relative to the trigger. */
  align?: "left" | "right";
}

/**
 * Button + panel disclosure. Not an ARIA menu — the panel contains ordinary
 * links / inputs that remain navigable with Tab. Keyboard: Enter/Space opens,
 * Escape closes and restores focus to the trigger. Pointer: click outside
 * closes. The pattern follows WAI-ARIA Authoring Practices for a disclosure
 * widget rather than role="menu".
 */
export function Dropdown({
  label,
  children,
  panelLabel,
  triggerClassName = "",
  panelClassName = "",
  align = "left",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    }
    function onPointer(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={triggerClassName}
      >
        {label}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="group"
          aria-label={panelLabel}
          className={`absolute ${alignClass} top-full mt-1 z-50 min-w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] p-2 ${panelClassName}`}
        >
          {children({ close })}
        </div>
      )}
    </div>
  );
}
