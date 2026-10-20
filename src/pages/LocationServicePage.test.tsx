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
const GRAND_RAPIDS_HUBS = ["roofing", "siding", "windows", "gutters", "masonry"] as const;
const CLEVELAND_HUBS = ["roofing", "siding", "windows", "gutters"] as const;
const CINCINNATI_HUBS = ["roofing", "siding", "windows", "gutters", "masonry"] as const;
const DAYTON_HUBS = ["roofing", "siding", "windows", "gutters"] as const;
const LEXINGTON_HUBS = ["roofing", "siding", "windows", "gutters", "masonry"] as const;
const LOUISVILLE_HUBS = ["roofing", "siding", "windows", "gutters", "masonry"] as const;

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

describe("Grand Rapids local-service hubs render", () => {
  it.each(GRAND_RAPIDS_HUBS)("renders a completed body with a city-named H1 for /grand-rapids/%s/", (key) => {
    renderAt(`/grand-rapids/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("grand rapids");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA falls back to the location hub #estimate anchor when no scoped free-estimate exists", () => {
    renderAt("/grand-rapids/siding");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    // React Router resolves `to` relative to the current pathname; the raw
    // target is `/grand-rapids/#estimate`.
    expect(link.getAttribute("href")).toBe("/grand-rapids/#estimate");
  });

  it("breadcrumb returns to the Grand Rapids location hub", () => {
    renderAt("/grand-rapids/masonry");
    const breadcrumb = screen.getByRole("navigation", { name: /breadcrumb/i });
    const link = within(breadcrumb).getByRole("link", { name: /grand rapids, mi/i });
    expect(link.getAttribute("href")).toBe("/grand-rapids/");
  });
});

describe("Cleveland local-service hubs render", () => {
  it.each(CLEVELAND_HUBS)("renders a completed body with a city-named H1 for /cleveland/%s/", (key) => {
    renderAt(`/cleveland/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("cleveland");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA points at the Cleveland location-hub #estimate anchor (local estimate route still a shell)", () => {
    renderAt("/cleveland/siding");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/cleveland/#estimate");
  });

  it("Cleveland masonry remains Not Found (reference links the global /masonry/, not a scoped URL)", () => {
    renderAt("/cleveland/masonry");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });
});

describe("Cincinnati local-service hubs render", () => {
  it.each(CINCINNATI_HUBS)("renders a completed body with a city-named H1 for /cincinnati/%s/", (key) => {
    renderAt(`/cincinnati/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("cincinnati");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA points at the Cincinnati location-hub #estimate anchor", () => {
    renderAt("/cincinnati/windows");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/cincinnati/#estimate");
  });

  it("renders FAQ only on Cincinnati pages where the reference publishes one", () => {
    renderAt("/cincinnati/siding");
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeTruthy();
    cleanup();
    renderAt("/cincinnati/roofing");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
    cleanup();
    renderAt("/cincinnati/masonry");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
  });
});

describe("Dayton local-service hubs render", () => {
  it.each(DAYTON_HUBS)("renders a completed body with a city-named H1 for /dayton/%s/", (key) => {
    renderAt(`/dayton/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("dayton");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA points at the Dayton location-hub #estimate anchor", () => {
    renderAt("/dayton/siding");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/dayton/#estimate");
  });

  it("Dayton masonry and insulation remain Not Found (reference tiles link globally)", () => {
    renderAt("/dayton/masonry");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
    cleanup();
    renderAt("/dayton/insulation");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("Dayton roofing has no FAQ (reference has none) while siding does", () => {
    renderAt("/dayton/roofing");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
    cleanup();
    renderAt("/dayton/siding");
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeTruthy();
  });
});

describe("Lexington local-service hubs render (Sprint 5.5.7)", () => {
  it.each(LEXINGTON_HUBS)("renders a completed body with a city-named H1 for /lexington/%s/", (key) => {
    renderAt(`/lexington/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("lexington");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA points at the Lexington location-hub #estimate anchor", () => {
    renderAt("/lexington/roofing");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/lexington/#estimate");
  });

  it("Lexington roofing renders its reference-verified FAQ while masonry omits one", () => {
    renderAt("/lexington/roofing");
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeTruthy();
    cleanup();
    renderAt("/lexington/masonry");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
  });

  it("Lexington insulation stays Not Found (not a ServiceHubKey)", () => {
    renderAt("/lexington/insulation");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });
});

describe("Louisville local-service hubs render (Sprint 5.5.8)", () => {
  it.each(LOUISVILLE_HUBS)("renders a completed body with a city-named H1 for /louisville/%s/", (key) => {
    renderAt(`/louisville/${key}`);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent?.toLowerCase()).toContain("louisville");
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
  });

  it("hero CTA points at the Louisville location-hub #estimate anchor", () => {
    renderAt("/louisville/windows");
    const h1 = screen.getByRole("heading", { level: 1 });
    const intro = h1.closest("section")!;
    const link = within(intro).getByRole("link", { name: /get a free estimate/i });
    expect(link.getAttribute("href")).toBe("/louisville/#estimate");
  });

  it("renders FAQ only where the reference publishes one", () => {
    renderAt("/louisville/roofing");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
    cleanup();
    renderAt("/louisville/siding");
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeTruthy();
    cleanup();
    renderAt("/louisville/masonry");
    expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
  });
});

describe("Grand Rapids FAQ provenance (Sprint 5.5.4 correction)", () => {
  it("keeps the reference-verified Siding FAQ section", () => {
    renderAt("/grand-rapids/siding");
    expect(screen.getByText(/siding replacement cost in grand rapids\?/i)).toBeTruthy();
  });

  it.each(["roofing", "windows", "gutters", "masonry"])(
    "omits the FAQ section on /grand-rapids/%s (no reference FAQ)",
    (key) => {
      renderAt(`/grand-rapids/${key}`);
      expect(screen.queryByRole("heading", { name: /frequently asked questions/i })).toBeNull();
    }
  );
});

describe("Unsupported location-service combinations stay Not Found", () => {
  // Detroit still has no scoped service pages.
  it("renders Not Found for /detroit/roofing", () => {
    renderAt("/detroit/roofing");
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
