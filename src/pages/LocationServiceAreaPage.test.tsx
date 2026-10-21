import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LocationServiceAreaPage from "./LocationServiceAreaPage";
import NotFoundPage from "./NotFoundPage";
import {
  completedServiceAreaSlugs,
  findServiceArea,
} from "@/data/serviceAreas";
import { hasLocationCapability } from "@/data/availability";
import { findLocation } from "@/data/locations";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path=":locationSlug/service-area"
          element={<LocationServiceAreaPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

const SERVICE_AREA_SLUGS = [
  "nashville",
  "cincinnati",
  "cleveland",
  "grand-rapids",
  "ann-arbor",
  "lansing",
] as const;

describe("Service-area data", () => {
  it("covers every location that advertises hasServiceAreaIndex", () => {
    for (const slug of SERVICE_AREA_SLUGS) {
      expect(hasLocationCapability(slug, "hasServiceAreaIndex")).toBe(true);
      expect(findServiceArea(slug)).toBeTruthy();
    }
    expect(completedServiceAreaSlugs.length).toBe(SERVICE_AREA_SLUGS.length);
  });
});

describe("Service-area index pages render", () => {
  it.each(SERVICE_AREA_SLUGS)(
    "renders a completed body for /%s/service-area/ without the scaffold badge",
    (slug) => {
      renderAt(`/${slug}/service-area`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(/service area/i);
      expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
    }
  );

  it.each(SERVICE_AREA_SLUGS)(
    "renders the compass-direction headings for /%s/service-area/",
    (slug) => {
      renderAt(`/${slug}/service-area`);
      const content = findServiceArea(slug)!;
      for (const direction of content.directions) {
        expect(
          screen.getByRole("heading", { level: 3, name: direction.heading })
        ).toBeTruthy();
      }
    }
  );

  it("final CTA points to the scoped free-estimate when available", () => {
    renderAt("/nashville/service-area");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/nashville/free-estimate/");
  });

  it("final CTA falls back to the location-hub #estimate anchor otherwise", () => {
    renderAt("/ann-arbor/service-area");
    const cta = screen.getByRole("region", { name: /final call to action/i });
    const link = within(cta).getByRole("link", { name: /get a free estimate/i });
    // React Router resolves `to="/ann-arbor/#estimate"` as-is.
    expect(link.getAttribute("href")).toBe("/ann-arbor/#estimate");
    expect(hasLocationCapability("ann-arbor", "hasFreeEstimate")).toBe(false);
  });

  it("children already present in locations[] data get linked; others render as text", () => {
    renderAt("/nashville/service-area");
    const nashville = findLocation("nashville")!;
    // Franklin is both in nashville.serviceAreaChildren and in reference list → linked.
    const franklin = screen.getByRole("link", { name: /^franklin$/i });
    expect(franklin.getAttribute("href")).toBe(
      "/nashville/service-area/franklin/"
    );
    expect(
      nashville.serviceAreaChildren.some((c) => c.slug === "franklin")
    ).toBe(true);

    // Clarksville is in the reference list but not in locations[] data → not linked.
    expect(screen.getByText("Clarksville").tagName.toLowerCase()).toBe("span");
    expect(
      nashville.serviceAreaChildren.some((c) => c.slug === "clarksville")
    ).toBe(false);
  });
});

describe("Not Found guards", () => {
  it("returns Not Found for a location without hasServiceAreaIndex", () => {
    renderAt("/louisville/service-area");
    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeTruthy();
    expect(hasLocationCapability("louisville", "hasServiceAreaIndex")).toBe(false);
  });

  it("returns Not Found for an unknown location", () => {
    renderAt("/not-a-city/service-area");
    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeTruthy();
  });
});
