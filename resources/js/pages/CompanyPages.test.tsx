import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "./AboutPage";
import SpecialOffersPage from "./SpecialOffersPage";
import FinancingPage from "./FinancingPage";
import WarrantiesPage from "./WarrantiesPage";
import ReviewsPage from "./ReviewsPage";
import { reviews } from "@/data/reviews";

afterEach(() => cleanup());

function renderPage(Page: React.ComponentType) {
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );
}

describe("AboutPage", () => {
  it("renders a single About H1", () => {
    renderPage(AboutPage);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/about/i);
  });

  it("renders the service list linking to internal service hubs", () => {
    renderPage(AboutPage);
    const callout = screen.getByRole("complementary", { name: /services covered/i });
    const roofing = within(callout).getByRole("link", { name: /roofing/i });
    expect(roofing.getAttribute("href")).toBe("/roofing");
  });

  it("Free Estimate CTAs link to /free-estimate", () => {
    renderPage(AboutPage);
    const links = screen.getAllByRole("link", { name: /get a free estimate/i });
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l.getAttribute("href")).toBe("/free-estimate");
  });
});

describe("SpecialOffersPage", () => {
  it("renders a Special offers H1 and the honest contact-team disclosure", () => {
    renderPage(SpecialOffersPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /special offers/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/contact our team for the latest offer wording/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/terms may vary by service, season, and location/i)
    ).toBeTruthy();
  });

  it("does not fabricate a dollar discount, percentage, or expiry date on offer cards", () => {
    renderPage(SpecialOffersPage);
    const section = screen.getByRole("region", { name: /offer categories/i });
    const text = section.textContent ?? "";
    expect(/\$\s?\d/.test(text)).toBe(false);
    expect(/\d+\s?%/.test(text)).toBe(false);
    expect(
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}/i.test(
        text
      )
    ).toBe(false);
  });

  it("Free Estimate CTA links to /free-estimate", () => {
    renderPage(SpecialOffersPage);
    const cta = screen.getAllByRole("link", { name: /get a free estimate/i })[0];
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });
});

describe("FinancingPage", () => {
  it("renders a Financing H1", () => {
    renderPage(FinancingPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /financing/i })
    ).toBeTruthy();
  });

  it("declares no live financing application and no quoted rates", () => {
    renderPage(FinancingPage);
    expect(screen.getByText(/no live application/i)).toBeTruthy();
    expect(screen.getByText(/this reproduction does not quote rates/i)).toBeTruthy();
  });

  it("renders the three-step overview", () => {
    renderPage(FinancingPage);
    expect(screen.getByText(/request an estimate/i)).toBeTruthy();
    expect(screen.getByText(/review the written terms/i)).toBeTruthy();
    expect(screen.getByText(/decide, then schedule/i)).toBeTruthy();
  });
});

describe("WarrantiesPage", () => {
  it("renders a Warranties H1", () => {
    renderPage(WarrantiesPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /warranties/i })
    ).toBeTruthy();
  });

  it("distinguishes manufacturer from workmanship coverage", () => {
    renderPage(WarrantiesPage);
    expect(
      screen.getByRole("heading", { name: /manufacturer warranties/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /workmanship/i })
    ).toBeTruthy();
  });

  it("does not quote a specific coverage duration or guarantee", () => {
    renderPage(WarrantiesPage);
    expect(
      screen.getByText(/this page does not quote a coverage duration/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/this reproduction does not issue coverage/i)
    ).toBeTruthy();
  });
});

describe("ReviewsPage", () => {
  it("renders a Customer reviews H1 and all transcribed testimonials", () => {
    renderPage(ReviewsPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /customer reviews/i })
    ).toBeTruthy();
    const quoted = screen.getAllByRole("img", { name: /out of 5 stars/i });
    expect(quoted).toHaveLength(reviews.length);
  });

  it("declares the no-aggregate-rating / no-badge policy", () => {
    renderPage(ReviewsPage);
    expect(
      screen.getByText(/does not aggregate reviews/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/links to external review platforms.*omitted/i)
    ).toBeTruthy();
  });

  it("does not fabricate review-platform badges or external links", () => {
    renderPage(ReviewsPage);
    const links = screen.getAllByRole("link");
    for (const l of links) {
      const href = l.getAttribute("href") ?? "";
      expect(href.startsWith("http")).toBe(false);
    }
  });
});
