import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BackToTopButton } from "./BackToTopButton";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: 0,
    writable: true,
  });
});

describe("BackToTopButton", () => {
  it("is hidden from assistive tech while near the top of the page", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    render(<BackToTopButton />);
    const btn = document.querySelector(
      "button[aria-label='Back to top']"
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("aria-hidden")).toBe("true");
    expect(btn.getAttribute("tabindex")).toBe("-1");
    expect(btn.className).toContain("opacity-0");
    expect(btn.className).toContain("pointer-events-none");
  });

  it("becomes visible once the viewport scrolls past the threshold", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });
    render(<BackToTopButton />);
    act(() => {
      fireEvent.scroll(window);
    });
    const btn = screen.getByRole("button", { name: /back to top/i });
    expect(btn.getAttribute("aria-hidden")).toBe("false");
    expect(btn.getAttribute("tabindex")).toBe("0");
    expect(btn.className).toContain("opacity-100");
    expect(btn.className).toContain("pointer-events-auto");
  });

  it("re-hides when the viewport returns near the top", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });
    render(<BackToTopButton />);
    act(() => fireEvent.scroll(window));
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 10,
      writable: true,
    });
    act(() => fireEvent.scroll(window));
    const btn = document.querySelector(
      "button[aria-label='Back to top']"
    ) as HTMLButtonElement;
    expect(btn.className).toContain("opacity-0");
  });

  it("smooth-scrolls to the top on click under default motion preferences", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });
    const spy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<BackToTopButton />);
    act(() => fireEvent.scroll(window));
    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
    expect(spy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  it("falls back to instant scroll under prefers-reduced-motion: reduce", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });
    const preference = Object.assign(new EventTarget(), { matches: true });
    vi.stubGlobal("matchMedia", () => preference);
    const spy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<BackToTopButton />);
    act(() => fireEvent.scroll(window));
    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
    expect(spy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });

  it("positions above the Live Chat launcher via `bottom-[88px]` / `sm:bottom-[96px]`", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
      writable: true,
    });
    render(<BackToTopButton />);
    act(() => fireEvent.scroll(window));
    const btn = screen.getByRole("button", { name: /back to top/i });
    expect(btn.className).toContain("bottom-[88px]");
    expect(btn.className).toContain("sm:bottom-[96px]");
    expect(btn.className).toContain("right-4");
    expect(btn.className).toContain("sm:right-6");
  });
});
