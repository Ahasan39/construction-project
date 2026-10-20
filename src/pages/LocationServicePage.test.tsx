import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import TwoSegmentPage from "./TwoSegmentPage";
import NotFoundPage from "./NotFoundPage";
import {
  locationServicePages,
  findLocationServiceContent,
} from "@/data/locationServicePages";
import { isLocationServiceAvailable } from "@/data/availability";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path=":a/:b" element={<TwoSegmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

const NASHVILLE_HUBS = ["roofing", "siding", "windows", "gutters", "masonry"] as const;

describe("locationServicePages data", () => {
  it("defines content only for pairs listed in availability", () => {
    for (const [locationSlug, bySvc] of Object.entries(locationServicePages)) {
      for (const service of Object.keys(bySvc)) {
        expect(isLocationServiceAvailable(locationSlug, service as never)).toBe(true);
      }
    }
  });

  it("covers every Nashville hub service in scope", () => {
    for (const key of NASHVILLE_HUBS) {
      expect(findLocationServiceContent("nashville", key)).toBeTruthy();
    }
  });
});

describe("Nashville local-service hubs render", () => {
  it.each(NASHVILLE_HUBS)("renders a completed body with a city-named H1 for /nashville/%s/", (key) => {
    renderAt(`/nashville/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/nashville/i);
    // The "scaffold" badge from PageShell must not appear on a completed page.
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA on a scoped page points to the location free-estimate route", () => {
    renderAt("/nashville/siding");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/nashville/free-estimate/");
  });

  it("breadcrumb links back to the Nashville hub", () => {
    renderAt("/nashville/roofing");
    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });
    const link = within(breadcrumb).getByRole("link", { name: /nashville, tn/i });
    expect(link.getAttribute("href")).toBe("/nashville/");
  });
});

describe("Unsupported location-service combinations stay Not Found", () => {
  // Lexington has no scoped service pages at all.
  it("renders Not Found for /lexington/roofing", () => {
    renderAt("/lexington/roofing");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  // Nashville/insulation is available in the table but is NOT a ServiceHubKey
  // (no servicePages entry); it must keep the Sprint 1 scaffold rather than
  // claim to be a completed page.
  it("keeps the Sprint 1 scaffold for /nashville/insulation", () => {
    renderAt("/nashville/insulation");
    expect(screen.getByText(/scaffold — sprint 1/i)).toBeTruthy();
  });
});
