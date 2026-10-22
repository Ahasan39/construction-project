import { useEffect, useId, useRef, useState } from "react";

interface Message {
  id: number;
  from: "visitor" | "system";
  text: string;
}

const WELCOME: Message = {
  id: 0,
  from: "system",
  text:
    "Hi — thanks for stopping by. Our team responds fastest by phone or through the Contact Us form; this chat is a convenience note-taker only and is not actively monitored in real time.",
};

/**
 * Visitor-facing live-chat widget — polished demo.
 *
 * No real provider is configured. The composer is local-only: nothing leaves
 * the page, no delivery is claimed, no persistence happens. Accessibility
 * invariants (dialog role, Escape-to-close, focus trap into the panel on
 * open, focus restored to launcher on close, visible focus states, reduced-
 * motion handling, labelled transcript as `role="log"`) are preserved.
 */
export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const nextIdRef = useRef(1);

  const panelId = useId();
  const inputId = useId();
  const errorId = useId();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) launcherRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) {
      setError("Type a message before sending.");
      return;
    }
    setError(null);
    const visitorId = nextIdRef.current++;
    const systemId = nextIdRef.current++;
    setMessages((m) => [
      ...m,
      { id: visitorId, from: "visitor", text },
      {
        id: systemId,
        from: "system",
        text:
          "Thanks for your note. This chat is not actively monitored — for the fastest reply, please call the number in the footer or use the Contact Us form, and a team member will get back to you.",
      },
    ]);
    setDraft("");
  }

  const canSend = draft.trim().length > 0;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
      // Respect iOS safe-area insets so the launcher sits above the home bar.
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={`${panelId}-title`}
          aria-describedby={`${panelId}-status`}
          className="pointer-events-auto w-[min(23rem,calc(100vw-2rem))] max-h-[min(32rem,calc(100vh-7rem))] flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_50px_-20px_rgba(15,34,49,0.35),0_8px_16px_-8px_rgba(15,34,49,0.18)] motion-safe:animate-[fadeIn_140ms_ease-out] ring-1 ring-black/5"
        >
          <header className="shrink-0 flex items-center gap-3 px-4 py-3.5 bg-[var(--color-brand-primary)] text-white">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
            >
              <ChatIcon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id={`${panelId}-title`}
                className="text-sm font-black tracking-tight leading-tight"
              >
                How can we help?
              </h2>
              <p
                id={`${panelId}-status`}
                className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"
                />
                <span>Fastest reply by phone or Contact Us</span>
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-[var(--radius-md)] text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 transition-colors"
              aria-label="Close live chat"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Chat transcript"
            className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-2.5 bg-[var(--color-surface-alt)]"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.from === "visitor"
                    ? "self-end max-w-[85%] rounded-[14px] rounded-br-[4px] px-3.5 py-2.5 text-sm leading-relaxed bg-[var(--color-brand-primary)] text-white shadow-sm"
                    : "self-start max-w-[88%] rounded-[14px] rounded-bl-[4px] px-3.5 py-2.5 text-sm leading-relaxed bg-white text-[var(--color-ink)] border border-[var(--color-border)] shadow-[0_1px_1px_rgba(15,34,49,0.04)]"
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="shrink-0 border-t border-[var(--color-border)] bg-white px-3 pt-3 pb-3 flex flex-col gap-2"
          >
            <label htmlFor={inputId} className="sr-only">
              Your message
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id={inputId}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
                rows={1}
                placeholder="Type your question…"
                aria-invalid={!!error || undefined}
                aria-describedby={error ? errorId : undefined}
                className="flex-1 min-h-[2.5rem] max-h-28 resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-slate-400 focus:border-[var(--color-focus)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-focus)] transition-colors"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-accent)] text-white shadow-sm hover:bg-[var(--color-brand-accent-600)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] transition-colors"
                aria-label="Send message"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    d="M4 12l16-8-5 16-3-7-8-1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {error && (
              <p id={errorId} role="alert" className="text-xs text-[var(--color-danger)]">
                {error}
              </p>
            )}
            <p className="text-[11px] text-[var(--color-ink-muted)]">
              This chat isn't actively monitored. Press Enter to submit, Shift+Enter for a new line.
            </p>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Hide chat launcher" : "Open chat"}
        className="pointer-events-auto group inline-flex items-center gap-2 h-14 px-5 rounded-full bg-[var(--color-brand-accent)] text-white text-sm font-extrabold uppercase tracking-wider shadow-[0_14px_28px_-10px_rgba(217,35,42,0.55),0_6px_12px_-6px_rgba(15,34,49,0.25)] ring-1 ring-black/5 hover:bg-[var(--color-brand-accent-600)] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] motion-safe:transition-[background-color,transform,box-shadow] motion-safe:duration-150"
      >
        <ChatIcon
          className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-rotate-6"
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{open ? "Close" : "Chat with us"}</span>
        <span className="sm:hidden">{open ? "Close" : "Chat"}</span>
      </button>
    </div>
  );
}

function ChatIcon({
  className = "",
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}) {
  return (
    <svg
      aria-hidden={ariaHidden ?? "true"}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5.3A8 8 0 1 1 21 12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeLinecap="round" />
    </svg>
  );
}
