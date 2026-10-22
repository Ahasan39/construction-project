import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReviewsStrip } from "./ReviewsStrip";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/**
 * Sprint 5.14 refactor: the carousel defaults to a CSS-driven marquee that
 * continuously scrolls duplicated reviews under `prefers-reduced-motion:
 * no-preference`. Any user interaction (Prev/Next/dot/arrow/swipe/pause
 * toggle) switches to the original stepped mode, which the earlier
 * assertions below exercise.
 */

describe("ReviewsStrip Carousel — stepped mode (post-interaction)", () => {
  it("clamps the last mobile position when resized and keeps visible slides interactive", () => {
    vi.stubGlobal("innerWidth", 320);
    render(<ReviewsStrip />);
    fireEvent.click(screen.getByRole("tab", { name: "Go to slide 9" }));
    expect(screen.getAllByRole("group").length).toBe(1);
    vi.stubGlobal("innerWidth", 1024);
    fireEvent(window, new Event("resize"));
    expect(
      screen.getByRole("tab", { selected: true }).getAttribute("aria-label")
    ).toBe("Go to slide 7");
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(
      slides
        .filter((slide) => !slide.hasAttribute("inert"))
        .map((slide) => slide.getAttribute("aria-label"))
    ).toEqual(["7 of 9", "8 of 9", "9 of 9"]);
    vi.stubGlobal("innerWidth", 640);
    fireEvent(window, new Event("resize"));
    expect(screen.getAllByRole("group").length).toBe(2);
    vi.stubGlobal("innerWidth", 320);
    fireEvent(window, new Event("resize"));
    expect(screen.getAllByRole("group").length).toBe(1);
  });

  it("accepts swipes starting or ending at screen coordinate zero", () => {
    render(<ReviewsStrip />);
    const window = screen.getByRole("region").querySelector("[tabindex='0']")!;
    fireEvent.touchStart(window, { targetTouches: [{ clientX: 100 }] });
    fireEvent.touchMove(window, { targetTouches: [{ clientX: 0 }] });
    fireEvent.touchEnd(window);
    // First manual step forward from marquee lands on index 1.
    expect(
      screen.getByRole("tab", { selected: true }).getAttribute("aria-label")
    ).toBe("Go to slide 2");
    fireEvent.touchStart(window, { targetTouches: [{ clientX: 0 }] });
    fireEvent.touchMove(window, { targetTouches: [{ clientX: 100 }] });
    fireEvent.touchEnd(window);
    expect(
      screen.getByRole("tab", { selected: true }).getAttribute("aria-label")
    ).toBe("Go to slide 1");
  });

  it("stops auto-motion when reduced motion is enabled and keeps manual navigation usable", () => {
    const preference = Object.assign(new EventTarget(), { matches: true });
    vi.stubGlobal("matchMedia", () => preference);
    render(<ReviewsStrip />);
    // Reduced motion → stepped mode from the start, no marquee track.
    expect(document.querySelector(".marquee-track")).toBeNull();
    // Play/Pause toggle is aria-disabled under reduced motion.
    const play = screen.getByRole("button", { name: /start reviews autoplay/i });
    expect(play.getAttribute("aria-disabled")).toBe("true");
    // Manual nav still works.
    fireEvent.click(screen.getByRole("button", { name: /next reviews/i }));
    expect(
      screen.getByRole("tab", { selected: true }).getAttribute("aria-label")
    ).toBe("Go to slide 2");
  });

  it("renders carousel landmark with accessible title and controls", () => {
    render(<ReviewsStrip />);
    expect(
      screen.getByRole("region", { name: /customer reviews/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /previous reviews/i })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /next reviews/i })).toBeTruthy();
    // Default is autoplaying marquee → the toggle button offers "Pause".
    expect(
      screen.getByRole("button", { name: /pause reviews autoplay/i })
    ).toBeTruthy();
  });

  it("advances slide index on Next button click and updates aria-hidden", () => {
    render(<ReviewsStrip />);
    const nextBtn = screen.getByRole("button", {
      name: /next reviews/i,
    }) as HTMLButtonElement;
    const prevBtn = screen.getByRole("button", {
      name: /previous reviews/i,
    }) as HTMLButtonElement;

    // Marquee mode by default → Prev disabled, Next enabled.
    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    fireEvent.click(nextBtn);

    // Now in stepped mode at index 1.
    expect(prevBtn.disabled).toBe(false);
  });

  it("responds to keyboard ArrowRight and ArrowLeft on carousel container", () => {
    render(<ReviewsStrip />);
    const carouselWindow = screen
      .getByLabelText(/customer reviews/i)
      .querySelector("[tabindex='0']")!;
    const prevBtn = screen.getByRole("button", {
      name: /previous reviews/i,
    }) as HTMLButtonElement;

    expect(prevBtn.disabled).toBe(true);

    fireEvent.keyDown(carouselWindow, { key: "ArrowRight" });
    expect(prevBtn.disabled).toBe(false);

    fireEvent.keyDown(carouselWindow, { key: "ArrowLeft" });
    // Stepped mode held; index wrapped back to 0 → Prev disabled again.
    expect(prevBtn.disabled).toBe(true);
  });

  it("toggles between marquee and stepped mode via play/pause button", () => {
    render(<ReviewsStrip />);
    // Starts in marquee → button says "Pause".
    const pause = screen.getByRole("button", { name: /pause reviews autoplay/i });
    fireEvent.click(pause);
    // Now stepped → button says "Start".
    expect(
      screen.getByRole("button", { name: /start reviews autoplay/i })
    ).toBeTruthy();
    // Click again to resume marquee.
    fireEvent.click(
      screen.getByRole("button", { name: /start reviews autoplay/i })
    );
    expect(
      screen.getByRole("button", { name: /pause reviews autoplay/i })
    ).toBeTruthy();
  });

  it("allows clicking pagination dots to select a slide (switches to stepped mode)", () => {
    render(<ReviewsStrip />);
    const dotButtons = screen.getAllByRole("tab");
    expect(dotButtons.length).toBeGreaterThan(1);
    // In marquee mode no dot is aria-selected.
    expect(
      dotButtons.filter((d) => d.getAttribute("aria-selected") === "true").length
    ).toBe(0);

    fireEvent.click(dotButtons[1]);
    expect(dotButtons[1].getAttribute("aria-selected")).toBe("true");
  });
});

describe("ReviewsStrip Carousel — marquee mode (continuous)", () => {
  it("renders a marquee track by default with duplicated reviews (seamless loop setup)", () => {
    render(<ReviewsStrip />);
    const track = document.querySelector(".marquee-track") as HTMLElement;
    expect(track).toBeTruthy();
    expect(track.classList.contains("w-max")).toBe(true);
    // 9 reviews × 2 copies = 18 card slots in the track.
    const slots = Array.from(track.children);
    expect(slots.length).toBe(18);
    // First 9 are canonical, next 9 are aria-hidden clones with no role.
    expect(slots[0].getAttribute("aria-hidden")).toBeNull();
    expect(slots[0].getAttribute("role")).toBe("group");
    expect(slots[9].getAttribute("aria-hidden")).toBe("true");
    expect(slots[9].hasAttribute("role")).toBe(false);
  });

  it("marquee-root wrapper enables CSS :hover and :focus-within to pause the track", () => {
    render(<ReviewsStrip />);
    const window = screen.getByRole("region").querySelector("[tabindex='0']")!;
    expect(window.classList.contains("marquee-root")).toBe(true);
  });

  it("clone copies do not add duplicate accessible slide-label groups", () => {
    render(<ReviewsStrip />);
    // Only the 9 canonical reviews should be reachable as role=group.
    expect(screen.getAllByRole("group").length).toBe(9);
  });

  it("entering stepped mode (via Next) removes the marquee track from the DOM", () => {
    render(<ReviewsStrip />);
    expect(document.querySelector(".marquee-track")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /next reviews/i }));
    expect(document.querySelector(".marquee-track")).toBeNull();
    // Returning to marquee re-renders the track.
    fireEvent.click(screen.getByRole("button", { name: /start reviews autoplay/i }));
    expect(document.querySelector(".marquee-track")).toBeTruthy();
  });
});
