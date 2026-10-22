import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

afterEach(() => cleanup());

describe("Reveal", () => {
  it("renders its children regardless of IntersectionObserver availability", () => {
    // jsdom does not implement IntersectionObserver, so the Reveal component's
    // fallback path immediately applies `is-visible`. The content must remain
    // accessible without animation support.
    render(
      <Reveal>
        <p>Hello world</p>
      </Reveal>
    );
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  it("renders the requested semantic element and preserves children", () => {
    render(
      <Reveal as="h2">
        Section heading
      </Reveal>
    );
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.textContent).toBe("Section heading");
    expect(h2.classList.contains("reveal")).toBe(true);
  });

  it("applies the `is-visible` class in environments without IntersectionObserver (jsdom fallback)", () => {
    render(
      <Reveal as="section">
        <span>inner</span>
      </Reveal>
    );
    const section = screen.getByText("inner").parentElement!;
    expect(section.classList.contains("reveal")).toBe(true);
    expect(section.classList.contains("is-visible")).toBe(true);
  });

  it("applies a staggered CSS variable when delayMs > 0", () => {
    render(
      <Reveal delayMs={160}>
        <span>stagger</span>
      </Reveal>
    );
    const el = screen.getByText("stagger").parentElement!;
    expect(el.style.getPropertyValue("--reveal-delay")).toBe("160ms");
  });
});
