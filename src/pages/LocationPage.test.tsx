import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LocationPage from "./LocationPage";
import { findLocation } from "@/data/locations";
import { findLocationPage, hasLocationPage } from "@/data/locationPages";

function renderLocation(slug: string) {
  const location = findLocation(slug);
  if (!location) throw new Error(`unknown location: ${slug}`);
  return render(
    <MemoryRouter initialEntries={[`/${slug}`]}>
      <LocationPage location={location} />
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("locationPages data", () => {
  it("has typed content for ann-arbor and nashville", () => {
    expect(hasLocationPage("ann-arbor")).toBe(true);
    expect(hasLocationPage("nashville")).toBe(true);
  });

  it("preselects the correct region for each completed location", () => {
    expect(findLocationPage("ann-arbor")?.defaultRegionKey).toBe(
      "south-east-michigan"
    );
    expect(findLocationPage("nashville")?.defaultRegionKey).toBe(
      "nashville-area"
    );
  });

  it("does not render completed content for an unimplemented location", () => {
    expect(hasLocationPage("detroit")).toBe(false);
  });
});

describe("LocationPage — Ann Arbor", () => {
  it("renders a hero with the local heading and emergency prompt", () => {
    renderLocation("ann-arbor");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/southeast michigan/i);
    expect(screen.getAllByText(/active leak/i).length).toBeGreaterThan(0);
  });

  it("preselects the region in the hero estimate form (no region select rendered)", () => {
    renderLocation("ann-arbor");
    // Region <select> is hidden when `lockedRegion` is provided.
    expect(screen.queryByRole("combobox", { name: /select location/i })).toBeNull();
    // Submit button is still present.
    expect(screen.getByRole("button", { name: /get a free estimate/i })).toBeTruthy();
  });

  it("shows the As Seen On media strip when the reference variant requires it", () => {
    renderLocation("ann-arbor");
    expect(screen.getByRole("region", { name: /as seen on/i })).toBeTruthy();
  });

  it("final CTA points to the location hub when free-estimate is unavailable", () => {
    renderLocation("ann-arbor");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/ann-arbor/");
  });
});

describe("LocationPage — Nashville", () => {
  it("renders a hero heading that names Nashville", () => {
    renderLocation("nashville");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/nashville/i);
  });

  it("omits the As Seen On strip (not present on the reference nashville page)", () => {
    renderLocation("nashville");
    expect(screen.queryByRole("region", { name: /as seen on/i })).toBeNull();
  });

  it("final CTA deep-links into the location free-estimate route", () => {
    renderLocation("nashville");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/nashville/free-estimate/");
  });

  it("service grid links /nashville/siding/ because siding is available for Nashville", () => {
    renderLocation("nashville");
    const link = screen.getByRole("link", { name: /explore siding/i });
    expect(link.getAttribute("href")).toBe("/nashville/siding/");
  });
});
