import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  /**
   * Underlying element. Defaults to `div`. Pass a semantic element such as
   * `section` or `header` when the wrapper carries meaning in the DOM.
   */
  as?: ElementType;
  /** Delay in milliseconds applied via `--reveal-delay`. */
  delayMs?: number;
  /** Extra classes appended to the base `reveal` utility. */
  className?: string;
  /** Fraction of the element that must be visible to trigger (default 0.08). */
  threshold?: number;
  /**
   * When true, the reveal replays if the element exits and re-enters the
   * viewport. Default false — distracting on long scrolls. The shared design
   * is a one-shot entrance per element.
   */
  replay?: boolean;
  style?: CSSProperties;
}

/**
 * Site-wide section/element reveal.
 *
 * - CSS-first: initial hidden state and transition live in `globals.css`
 *   under a `prefers-reduced-motion: no-preference` guard, so reduced-motion
 *   viewers see fully-rendered content without the entrance animation and
 *   without any JS fallback.
 * - Resilient: if IntersectionObserver is not available (SSR, test harnesses,
 *   very old browsers), the `is-visible` class is applied immediately so the
 *   content is always readable.
 * - Non-blocking: observer disconnects after the element has been revealed
 *   once (default), so no event listener remains active for scrolls.
 */
export function Reveal({
  children,
  as,
  delayMs = 0,
  className = "",
  threshold = 0.08,
  replay = false,
  style,
}: RevealProps) {
  const Tag: ElementType = as ?? "div";
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // No IntersectionObserver (SSR / jsdom / old browser) → reveal immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!replay) observer.disconnect();
          } else if (replay) {
            setVisible(false);
          }
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, replay]);

  const combined =
    `reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`;
  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ...(delayMs > 0 ? ({ ["--reveal-delay"]: `${delayMs}ms` } as CSSProperties) : {}),
  };

  return (
    <Tag ref={ref} className={combined} style={mergedStyle}>
      {children}
    </Tag>
  );
}
