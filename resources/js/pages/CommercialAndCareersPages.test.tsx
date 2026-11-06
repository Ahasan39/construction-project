import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CommercialProjectsPage from "./CommercialProjectsPage";
import SalesCareersPage from "./SalesCareersPage";

afterEach(() => cleanup());

function renderPage(Page: React.ComponentType) {
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );
}

describe("CommercialProjectsPage", () => {
  it("renders a single Commercial projects H1", () => {
    renderPage(CommercialProjectsPage);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/commercial projects/i);
  });

  it("does not present invented client names or completed-project metrics", () => {
    renderPage(CommercialProjectsPage);
    expect(
      screen.getByText(/no individual completed project.*is reproduced here/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/stays an honest empty state/i)
    ).toBeTruthy();
  });

  it("links to the commercial-roofing variant hub and the Free Estimate CTA", () => {
    renderPage(CommercialProjectsPage);
    const roofing = screen.getByRole("link", { name: /commercial roofing hub/i });
    expect(roofing.getAttribute("href")).toBe("/roofing/commercial-roofing");
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });

  it("has no external hrefs beyond demo phone/email", () => {
    renderPage(CommercialProjectsPage);
    const links = screen.getAllByRole("link");
    for (const l of links) {
      const href = l.getAttribute("href") ?? "";
      expect(href.startsWith("http")).toBe(false);
    }
  });
});

describe("SalesCareersPage", () => {
  it("renders a single Sales careers H1", () => {
    renderPage(SalesCareersPage);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/sales careers/i);
  });

  it("does not list fabricated openings, salary, or benefits", () => {
    renderPage(SalesCareersPage);
    expect(
      screen.getByText(/no openings are listed on this reproduction site/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/no specific salary, commission structure, benefits package/i)
    ).toBeTruthy();
  });

  it("explicitly states no application is accepted here", () => {
    renderPage(SalesCareersPage);
    expect(
      screen.getByText(/no application is accepted here/i)
    ).toBeTruthy();
  });

  it("Contact Us CTA resolves to /contact-us", () => {
    renderPage(SalesCareersPage);
    const cta = screen.getByRole("link", { name: /^contact us$/i });
    expect(cta.getAttribute("href")).toBe("/contact-us");
  });

  it("includes no external applicant-tracking links until URLs are verified", () => {
    renderPage(SalesCareersPage);
    const links = screen.getAllByRole("link");
    for (const l of links) {
      const href = l.getAttribute("href") ?? "";
      expect(href.startsWith("http")).toBe(false);
    }
  });
});
