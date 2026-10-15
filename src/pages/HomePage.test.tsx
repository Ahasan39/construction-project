import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";

afterEach(() => cleanup());

describe("HomePage composition", () => {
  function renderPage() {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  }

  it("renders exactly one <h1>", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders every expected homepage section landmark", () => {
    renderPage();
    // Section landmarks are identified by their accessible labels / headings.
    expect(screen.getByRole("region", { name: /hero/i })).toBeTruthy();
    expect(
      screen.getByRole("complementary", { name: /request a free estimate/i })
    ).toBeTruthy();
    expect(screen.getByRole("region", { name: /value statement/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /^why/i, level: 2 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /services/i, level: 2 })).toBeTruthy();
    expect(screen.getByRole("region", { name: /offers, financing/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /customers have to say/i })).toBeTruthy();
  });

  it("hero image is eager-loaded with explicit dimensions (LCP-friendly)", () => {
    renderPage();
    const hero = screen.getByRole("region", { name: /hero/i });
    const img = within(hero).getByRole("img");
    expect(img.getAttribute("fetchpriority") || img.getAttribute("fetchPriority")).toBe(
      "high"
    );
    expect(img.getAttribute("width")).toBeTruthy();
    expect(img.getAttribute("height")).toBeTruthy();
    expect(img.getAttribute("loading")).not.toBe("lazy");
  });

  it("service grid links to real internal routes (no empty hrefs)", () => {
    renderPage();
    const servicesHeading = screen.getByRole("heading", {
      name: /services/i,
      level: 2,
    });
    const servicesSection = servicesHeading.closest("section")!;
    const linkEls = within(servicesSection).getAllByRole("link");
    for (const a of linkEls) {
      const href = a.getAttribute("href") ?? "";
      expect(href.length).toBeGreaterThan(0);
      expect(href).not.toBe("#");
    }
  });
});
