import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OfferPopup } from "./OfferPopup";

const DISMISS_KEY = "offerPopup:dismissed";

afterEach(() => {
  cleanup();
  try {
    window.sessionStorage.removeItem(DISMISS_KEY);
  } catch {
    /* ignore */
  }
  vi.useRealTimers();
});

beforeEach(() => {
  vi.useFakeTimers();
});

function mount(delayMs = 1000) {
  return render(
    <MemoryRouter>
      <OfferPopup delayMs={delayMs} />
    </MemoryRouter>
  );
}

describe("OfferPopup", () => {
  it("stays hidden until the configured delay elapses", () => {
    mount(1000);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(
      screen.getByRole("dialog", { name: /explore our roofing offers/i })
    ).toBeTruthy();
  });

  it("renders honest offer-exploration copy without quoting a specific discount, promo code, or expiry", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const dialog = screen.getByRole("dialog", { name: /explore our roofing offers/i });
    const text = dialog.textContent ?? "";
    expect(/contact our team to learn which offers may be available/i.test(text)).toBe(true);
    // Nothing fabricated: no $amount, no N% discount, no uppercase promo
    // code pattern (e.g. SAVE10), no concrete expiry date. The disclaimer
    // itself may contain the words "promo code" / "expiry date" as part of
    // explicitly refusing to quote them — that's fine.
    expect(/\$\s?\d/.test(text)).toBe(false);
    expect(/\d+\s?%/.test(text)).toBe(false);
    expect(/\b[A-Z]{3,}\d+\b/.test(text)).toBe(false);
    expect(
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i.test(
        text
      )
    ).toBe(false);
  });

  it("primary CTA links to /special-offers and closes the dialog on click", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const cta = screen.getByRole("link", { name: /explore offers/i });
    expect(cta.getAttribute("href")).toBe("/special-offers");
    fireEvent.click(cta);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("'No thanks' dismisses and persists for the session", () => {
    const { unmount } = mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    fireEvent.click(screen.getByRole("button", { name: /no thanks/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.sessionStorage.getItem(DISMISS_KEY)).toBe("1");
    unmount();

    // A fresh mount in the same session must NOT reopen after the delay.
    mount(0);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Escape closes the dialog", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("backdrop click dismisses", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const dialog = screen.getByRole("dialog", { name: /explore our roofing offers/i });
    const backdrop = dialog.parentElement!;
    fireEvent.click(backdrop);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("close button is labelled and dismisses", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    fireEvent.click(
      screen.getByRole("button", { name: /close promotional popup/i })
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("tolerates a sessionStorage access throw (private-mode browsers)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    // Still renders — fallback treats throw as "not dismissed".
    expect(
      screen.getByRole("dialog", { name: /explore our roofing offers/i })
    ).toBeTruthy();
    spy.mockRestore();
  });

  it("locks body scroll while open and restores on dismiss (regression — Sprint 5.7.1)", () => {
    document.body.style.overflow = "";
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });

  it("Tab from the last focusable control wraps to the first (regression — Sprint 5.7.1)", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const dialog = screen.getByRole("dialog", { name: /explore our roofing offers/i });
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    );
    // Sanity: more than two focusable controls exist (close, primary CTA, "No thanks").
    expect(focusables.length).toBeGreaterThanOrEqual(3);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(first);
  });

  it("Shift+Tab from the first focusable control wraps to the last (regression — Sprint 5.7.1)", () => {
    mount(0);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const dialog = screen.getByRole("dialog", { name: /explore our roofing offers/i });
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first.focus();
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("does not reopen when sessionStorage already marks dismissed", () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    mount(0);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
