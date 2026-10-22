import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ServiceAreaChildPage from "./ServiceAreaChildPage";
import NotFoundPage from "./NotFoundPage";
import { findLocation } from "@/data/locations";
import { staticRoutes } from "@/app/staticRoutes";

afterEach(() => cleanup());

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path=":locationSlug/service-area/:childSlug"
          element={<ServiceAreaChildPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ServiceAreaChildPage — Nashville & Lansing", () => {
  const nashvilleChildren = findLocation("nashville")!.serviceAreaChildren;
  const lansingChildren = findLocation("lansing")!.serviceAreaChildren;
  const cincinnatiChildren = findLocation("cincinnati")!.serviceAreaChildren;
  const clevelandChildren = findLocation("cleveland")!.serviceAreaChildren;
  const grandRapidsChildren = findLocation("grand-rapids")!.serviceAreaChildren;
  const annArborChildren = findLocation("ann-arbor")!.serviceAreaChildren;

  it.each(nashvilleChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /nashville/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/nashville/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(new RegExp(`^${name}\\.?$`, "i"));
      expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
    }
  );

  it.each(lansingChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /lansing/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/lansing/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(new RegExp(`^${name}\\.?$`, "i"));
    }
  );

  it.each(cincinnatiChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /cincinnati/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/cincinnati/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(new RegExp(`^${name}\\.?$`, "i"));
    }
  );

  it.each(clevelandChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /cleveland/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/cleveland/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(new RegExp(`^${name}\\.?$`, "i"));
    }
  );

  it.each(grandRapidsChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /grand-rapids/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/grand-rapids/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1.textContent).toMatch(new RegExp(`^${name}\\.?$`, "i"));
    }
  );

  it.each(annArborChildren.map((c) => [c.slug, c.name]))(
    "renders a completed body for /ann-arbor/service-area/%s with the correct H1",
    (slug, name) => {
      renderAt(`/ann-arbor/service-area/${slug}`);
      const h1 = screen.getByRole("heading", { level: 1 });
      // Escape '.' from the city name regex (e.g. "St. Clair Shores").
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(h1.textContent).toMatch(new RegExp(`^${escaped}\\.?$`, "i"));
    }
  );

  it("Ann Arbor falls back to global /free-estimate (no scoped form)", () => {
    renderAt("/ann-arbor/service-area/novi");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });

  it("Cincinnati Free Estimate CTA points to /cincinnati/free-estimate", () => {
    renderAt("/cincinnati/service-area/mason");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/cincinnati/free-estimate");
  });

  it("Cleveland Free Estimate CTA points to /cleveland/free-estimate", () => {
    renderAt("/cleveland/service-area/akron");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/cleveland/free-estimate");
  });

  it("Grand Rapids falls back to global /free-estimate (no scoped form)", () => {
    renderAt("/grand-rapids/service-area/kentwood");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });

  it("breadcrumb links back to the parent service-area index and location hub", () => {
    renderAt("/nashville/service-area/gallatin");
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    const serviceArea = within(nav).getByRole("link", { name: /^service area$/i });
    expect(serviceArea.getAttribute("href")).toBe("/nashville/service-area/");
    const hub = within(nav).getByRole("link", { name: /nashville, tn/i });
    expect(hub.getAttribute("href")).toBe("/nashville/");
  });

  it("Free Estimate CTA points to the location's free-estimate when available (Nashville)", () => {
    renderAt("/nashville/service-area/gallatin");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/nashville/free-estimate");
  });

  it("Free Estimate CTA falls back to global /free-estimate when location has no scoped form (Lansing)", () => {
    renderAt("/lansing/service-area/dewitt");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });

  it("lists every global service as an internal link", () => {
    renderAt("/nashville/service-area/gallatin");
    const section = screen.getByRole("region", { name: /services available/i });
    for (const slug of ["roofing", "gutters", "siding", "windows", "masonry"]) {
      const link = within(section).getByRole("link", {
        name: new RegExp(`^${slug}`, "i"),
      });
      expect(link.getAttribute("href")).toBe(`/${slug}`);
    }
  });
});

describe("ServiceAreaChildPage — Not Found guards", () => {
  it("returns Not Found for an unknown child slug", () => {
    renderAt("/nashville/service-area/not-a-child");
    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeTruthy();
  });

  it("returns Not Found for a location without hasServiceAreaIndex", () => {
    renderAt("/louisville/service-area/frankfort");
    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeTruthy();
  });
});

describe("Static route generation for completed service-area children", () => {
  const routes = staticRoutes();
  const routeSet = new Set(routes);

  const markets: Array<[string, string]> = [
    ["nashville", "nashville"],
    ["lansing", "lansing"],
    ["cincinnati", "cincinnati"],
    ["cleveland", "cleveland"],
    ["grand-rapids", "grand-rapids"],
    ["ann-arbor", "ann-arbor"],
  ];

  it.each(markets)(
    "emits one static entry per %s serviceAreaChildren slug",
    (slug) => {
      const children = findLocation(slug)!.serviceAreaChildren;
      for (const c of children) {
        expect(routeSet.has(`/${slug}/service-area/${c.slug}`)).toBe(true);
      }
    }
  );

  it("emits no duplicate paths", () => {
    expect(routeSet.size).toBe(routes.length);
  });
});
