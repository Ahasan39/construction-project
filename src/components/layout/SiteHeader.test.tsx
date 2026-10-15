import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<SiteHeader />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("SiteHeader — About dropdown", () => {
  it("is closed by default with aria-expanded=false and no aria-haspopup (disclosure, not menu)", () => {
    renderAt("/");
    const trigger = screen.getByRole("button", { name: /about/i });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-haspopup")).toBeNull();
  });

  it("opens on click and exposes aria-expanded=true", () => {
    renderAt("/");
    const trigger = screen.getByRole("button", { name: /about/i });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Special Offers")).toBeTruthy();
  });

  it("closes on Escape and restores focus to trigger", () => {
    renderAt("/");
    const trigger = screen.getByRole("button", { name: /about/i });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when an item inside is activated", () => {
    renderAt("/");
    const trigger = screen.getByRole("button", { name: /about/i });
    fireEvent.click(trigger);
    const warranties = screen.getByRole("link", { name: "Warranties" });
    fireEvent.click(warranties);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("SiteHeader — global vs location estimate CTA", () => {
  it("global route points estimate CTA to /free-estimate", () => {
    renderAt("/");
    // The desktop CTA is inside the header. Prefer scoping to banner landmark.
    const banner = screen.getByRole("banner");
    const estimateLinks = within(banner)
      .getAllByRole("link", { name: /free estimate/i })
      .map((n) => n.getAttribute("href"));
    expect(estimateLinks).toContain("/free-estimate");
  });

  it("Nashville (hasFreeEstimate) resolves estimate CTA to /nashville/free-estimate", () => {
    renderAt("/nashville");
    const banner = screen.getByRole("banner");
    const estimateLinks = within(banner)
      .getAllByRole("link", { name: /free estimate/i })
      .map((n) => n.getAttribute("href"));
    expect(estimateLinks).toContain("/nashville/free-estimate");
  });

  it("Lexington (no local capability) falls back to the global estimate CTA", () => {
    renderAt("/lexington");
    const banner = screen.getByRole("banner");
    const estimateLinks = within(banner)
      .getAllByRole("link", { name: /free estimate/i })
      .map((n) => n.getAttribute("href"));
    expect(estimateLinks).toContain("/free-estimate");
    expect(estimateLinks).not.toContain("/lexington/free-estimate");
  });
});

describe("SiteHeader — location selector", () => {
  it("reflects the current location as the selected value", () => {
    renderAt("/nashville");
    const desktopSelect = screen.getAllByLabelText(/location/i)[0] as HTMLSelectElement;
    expect(desktopSelect.value).toBe("nashville");
  });

  it("has no selection on a non-location URL", () => {
    renderAt("/roofing");
    const desktopSelect = screen.getAllByLabelText(/location/i)[0] as HTMLSelectElement;
    expect(desktopSelect.value).toBe("");
  });
});

describe("SiteHeader — top strip phone CTA", () => {
  it("renders a Call <phone> link in the top utility strip", () => {
    renderAt("/");
    const banner = screen.getByRole("banner");
    const callLinks = within(banner).getAllByRole("link", { name: /call/i });
    expect(callLinks.length).toBeGreaterThan(0);
  });
});
