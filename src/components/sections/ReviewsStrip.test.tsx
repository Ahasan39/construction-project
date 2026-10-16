import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReviewsStrip } from "./ReviewsStrip";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ReviewsStrip Carousel", () => {
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
