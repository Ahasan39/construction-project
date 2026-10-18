import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { services } from "@/data/services";
import { serviceLocationLinks, servicePages } from "@/data/servicePages";
import { staticRoutes } from "@/app/staticRoutes";
import ServiceHubPage from "./ServiceHubPage";

afterEach(cleanup);

function renderService(key: string) {
  return render(<MemoryRouter initialEntries={[`/${key}/`]}><Routes>
    <Route path="/:slug/" element={<ServiceHubPage service={services.find(s => s.key === key)!} />} />
    <Route path="/nashville/siding/" element={<h1>Local siding destination</h1>} />
  </Routes></MemoryRouter>);
}

describe("service page content and routing", () => {
  it("only resolves local actions to confirmed static routes, including hub fallbacks", () => {
    const routes = staticRoutes();
    for (const service of services) {
      for (const location of serviceLocationLinks(service.key)) {
        expect(routes).toContain(location.to.replace(/\/$/, ""));
      }
    }
    expect(serviceLocationLinks("siding").find(l => l.label.startsWith("Ann Arbor"))?.to).toBe("/ann-arbor/");
    expect(serviceLocationLinks("siding").find(l => l.label.startsWith("Nashville"))?.to).toBe("/nashville/siding/");
  });

  it.each(services.map(s => s.key))("renders %s with one heading, one priority image, no form and valid internal destinations", key => {
    const { container } = renderService(key);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(1);
    expect(container.querySelector('img[fetchpriority="high"]')?.getAttribute("loading")).toBe("eager");
    const routes = staticRoutes();
    for (const anchor of container.querySelectorAll('a[href^="/"]')) {
      const href = anchor.getAttribute("href")!;
      expect(routes).toContain(href === "/" ? href : href.replace(/\/$/, ""));
    }
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex,nofollow");
  });

  it("navigates the service location picker to the availability-gated destination", () => {
    renderService("siding");
    fireEvent.change(screen.getByLabelText("Select a location for siding"), { target: { value: "/nashville/siding/" } });
    expect(screen.getByRole("heading", { name: "Local siding destination" })).toBeTruthy();
  });

  it("moves the siding style selector both directions and wraps", () => {
    renderService("siding");
    fireEvent.click(screen.getByRole("button", { name: "Previous siding style" }));
    expect(screen.getByText("6 / 6")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next siding style" }));
    expect(screen.getByText("1 / 6")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next siding style" }));
    expect(screen.getByText("2 / 6")).toBeTruthy();
  });

  it("uses disclosures only on the observed page compositions", () => {
    expect(servicePages.siding.faqs?.length).toBe(6);
    expect(servicePages.windows.faqs?.length).toBe(5);
    for (const key of ["gutters", "masonry"] as const) {
      const { container, unmount } = renderService(key);
      expect(container.querySelector("details")).toBeNull();
      expect(screen.queryByRole("button", { name: "Next reviews" })).toBeNull();
      unmount();
    }
  });

  it("keeps roofing reviews single-slide at desktop widths", () => {
    window.innerWidth = 1440;
    const { container } = renderService("roofing");
    expect(container.querySelectorAll('[aria-roledescription="slide"][aria-hidden="false"]')).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Next reviews" }));
    expect(container.querySelector('[aria-roledescription="slide"][aria-hidden="false"]')?.getAttribute("aria-label")).toBe("2 of 9");
  });
});
