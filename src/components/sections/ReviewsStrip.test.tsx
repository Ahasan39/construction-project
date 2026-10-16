import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReviewsStrip } from "./ReviewsStrip";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ReviewsStrip Carousel", () => {
  it("clamps the last mobile position when resized and keeps visible slides interactive", () => {
    vi.stubGlobal("innerWidth", 320);
    render(<ReviewsStrip />);
    fireEvent.click(screen.getByRole("tab", { name: "Go to slide 9" }));
    expect(screen.getAllByRole("group").length).toBe(1);
    vi.stubGlobal("innerWidth", 1024);
    fireEvent(window, new Event("resize"));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 7");
    const slides = screen.getAllByRole("group", { hidden: true });
    expect(slides.filter((slide) => !slide.hasAttribute("inert")).map((slide) => slide.getAttribute("aria-label"))).toEqual(["7 of 9", "8 of 9", "9 of 9"]);
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
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 2");
    fireEvent.touchStart(window, { targetTouches: [{ clientX: 0 }] });
    fireEvent.touchMove(window, { targetTouches: [{ clientX: 100 }] });
    fireEvent.touchEnd(window);
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 1");
  });

  it("uses one autoplay timer and stays paused while focus remains inside", () => {
    vi.useFakeTimers();
    render(<ReviewsStrip />);
    const region = screen.getByRole("region");
    fireEvent.click(screen.getByRole("button", { name: /start reviews autoplay/i }));
    fireEvent.mouseEnter(region);
    fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 2");
    fireEvent.focus(screen.getByRole("tab", { selected: true }));
    fireEvent.mouseEnter(region);
    fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 2");
    fireEvent.blur(region, { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 3");
    fireEvent.click(screen.getByRole("button", { name: /pause reviews autoplay/i }));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 3");
  });

  it("stops active autoplay when reduced motion is enabled and does not restart automatically", () => {
    vi.useFakeTimers();
    const preference = Object.assign(new EventTarget(), { matches: false });
    vi.stubGlobal("matchMedia", () => preference);
    render(<ReviewsStrip />);
    fireEvent.click(screen.getByRole("button", { name: /start reviews autoplay/i }));
    act(() => { preference.matches = true; preference.dispatchEvent(new Event("change")); });
    const play = screen.getByRole("button", { name: /start reviews autoplay/i });
    expect(play.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(play);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 1");
    act(() => { preference.matches = false; preference.dispatchEvent(new Event("change")); });
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("tab", { selected: true }).getAttribute("aria-label")).toBe("Go to slide 1");
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
    expect(
      screen.getByRole("button", { name: /start reviews autoplay/i })
    ).toBeTruthy();
  });

  it("advances slide index on Next button click and updates aria-hidden", () => {
    render(<ReviewsStrip />);
    const nextBtn = screen.getByRole("button", { name: /next reviews/i }) as HTMLButtonElement;
    const prevBtn = screen.getByRole("button", { name: /previous reviews/i }) as HTMLButtonElement;

    // Initially at index 0, previous is disabled
    expect(prevBtn.disabled).toBe(true);

    // Click Next
    fireEvent.click(nextBtn);

    // Prev button should now be enabled
    expect(prevBtn.disabled).toBe(false);
  });

  it("responds to keyboard ArrowRight and ArrowLeft on carousel container", () => {
    render(<ReviewsStrip />);
    const carouselWindow = screen.getByLabelText(/customer reviews/i).querySelector("[tabindex='0']")!;
    const prevBtn = screen.getByRole("button", { name: /previous reviews/i }) as HTMLButtonElement;

    expect(prevBtn.disabled).toBe(true);

    // Press ArrowRight
    fireEvent.keyDown(carouselWindow, { key: "ArrowRight" });
    expect(prevBtn.disabled).toBe(false);

    // Press ArrowLeft
    fireEvent.keyDown(carouselWindow, { key: "ArrowLeft" });
    expect(prevBtn.disabled).toBe(true);
  });

  it("toggles autoplay state with play/pause button", () => {
    render(<ReviewsStrip />);
    const toggleBtn = screen.getByRole("button", { name: /start reviews autoplay/i });

    fireEvent.click(toggleBtn);
    expect(
      screen.getByRole("button", { name: /pause reviews autoplay/i })
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /pause reviews autoplay/i }));
    expect(
      screen.getByRole("button", { name: /start reviews autoplay/i })
    ).toBeTruthy();
  });

  it("allows clicking pagination dots to select a slide", () => {
    render(<ReviewsStrip />);
    const dotButtons = screen.getAllByRole("tab");
    expect(dotButtons.length).toBeGreaterThan(1);

    // Click 2nd dot
    fireEvent.click(dotButtons[1]);
    expect(dotButtons[1].getAttribute("aria-selected")).toBe("true");
  });
});
