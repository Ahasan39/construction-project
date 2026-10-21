import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LocationPage from "./LocationPage";
import { findLocation, locations } from "@/data/locations";
import {
  findLocationPage,
  hasLocationPage,
  completedLocationSlugs,
} from "@/data/locationPages";
import { serviceAreaRegions } from "@/data/regions";
import { hasLocationCapability, isLocationServiceAvailable } from "@/data/availability";
import { services } from "@/data/services";

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
  it("has typed content for every location in the catalog", () => {
    for (const location of locations) {
      expect(hasLocationPage(location.slug)).toBe(true);
    }
    expect(completedLocationSlugs.length).toBe(locations.length);
  });

  it("every preselected region exists in the shared region list", () => {
    const regionKeys = new Set(serviceAreaRegions.map((r) => r.key));
    for (const slug of completedLocationSlugs) {
      const page = findLocationPage(slug)!;
      expect(regionKeys.has(page.defaultRegionKey)).toBe(true);
    }
  });

  it("every heading reasons heading names 'Mr. Roof'", () => {
    for (const slug of completedLocationSlugs) {
      expect(findLocationPage(slug)!.reasons.heading).toMatch(/Mr\. Roof/);
    }
  });
});

describe("LocationPage composition (every completed slug renders)", () => {
  it.each(completedLocationSlugs)("renders a hero and final CTA for %s", (slug) => {
    renderLocation(slug);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getByRole("region", { name: /final call to action/i })).toBeTruthy();
  });

  it("preselects the correct region (hero region select is suppressed)", () => {
    renderLocation("grand-rapids");
    expect(screen.queryByRole("combobox", { name: /select location/i })).toBeNull();
  });

  it("final CTA uses the scoped free-estimate route when the location advertises one", () => {
    renderLocation("nashville");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/nashville/free-estimate/");
    expect(hasLocationCapability("nashville", "hasFreeEstimate")).toBe(true);
  });

  it("final CTA falls back to the in-page hero anchor when no local estimate route exists", () => {
    renderLocation("ann-arbor");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    // React Router resolves `to="#estimate"` relative to the current pathname.
    expect(link.getAttribute("href")).toBe("/ann-arbor#estimate");
    expect(hasLocationCapability("ann-arbor", "hasFreeEstimate")).toBe(false);
    // The anchor target exists on the page.
    expect(document.getElementById("estimate")).not.toBeNull();
  });

  it("Ann Arbor keeps the reference 'As Seen On' media strip", () => {
    renderLocation("ann-arbor");
    expect(screen.getByRole("region", { name: /as seen on/i })).toBeTruthy();
  });

  it.each(["nashville", "grand-rapids", "cleveland", "cincinnati", "dayton", "lexington", "louisville", "detroit", "lansing"])(
    "omits the As Seen On strip for %s (reference pages do not show one)",
    (slug) => {
      renderLocation(slug);
      expect(screen.queryByRole("region", { name: /as seen on/i })).toBeNull();
    }
  );

  it("service grid uses /location/service/ only when availability lists it", () => {
    renderLocation("nashville");
    const siding = screen.getByRole("link", { name: /explore siding/i });
    expect(siding.getAttribute("href")).toBe("/nashville/siding/");
    expect(isLocationServiceAvailable("nashville", "siding")).toBe(true);
  });

  it("service grid falls back to the global hub when the combination is not scoped", () => {
    // Lansing's availability still only lists roofing (with service-area
    // index). The other four service hubs are confirmed reference URLs but
    // are deferred to a later sprint, so our implementation renders them
    // as the global hub fallback.
    renderLocation("lansing");
    for (const service of services) {
      if (service.key === "insulation") continue;
      if (service.key === "roofing") continue; // scoped for Lansing in availability
      const link = screen.getByRole("link", { name: new RegExp(`visit ${service.title} hub`, "i") });
      expect(link.getAttribute("href")).toBe(`/${service.slug}/`);
      expect(isLocationServiceAvailable("lansing", service.key)).toBe(false);
    }
  });
});
