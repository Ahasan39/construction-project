import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PayMyBillPage from "./PayMyBillPage";
import VisualizerPage from "./VisualizerPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsPage from "./TermsPage";
import { staticRoutes } from "@/app/staticRoutes";

afterEach(() => cleanup());

function renderPage(Page: React.ComponentType) {
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );
}

describe("PayMyBillPage", () => {
  it("renders a Pay my bill H1 and refuses a fake payment form", () => {
    renderPage(PayMyBillPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /pay my bill/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/call the number in the footer and a team member will take payment/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/payment information belongs with a payment processor/i)
    ).toBeTruthy();
    // No form element at all on this page.
    expect(document.querySelector("form")).toBeNull();
    // No card/bank inputs.
    expect(document.querySelector('input[type="password"]')).toBeNull();
    const inputs = Array.from(document.querySelectorAll("input"));
    for (const i of inputs) {
      const name = (i.getAttribute("name") ?? "").toLowerCase();
      const auto = (i.getAttribute("autocomplete") ?? "").toLowerCase();
      expect(/card|cc-|cvc|cvv|routing|account/.test(name + " " + auto)).toBe(false);
    }
  });
});

describe("VisualizerPage", () => {
  it("renders a Visualizer H1 and routes design decisions through the estimate", () => {
    renderPage(VisualizerPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /design visualizer/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/we walk through product and color options with you in person/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/not a replacement for seeing the real materials/i)
    ).toBeTruthy();
  });

  it("Free Estimate CTA resolves to /free-estimate", () => {
    renderPage(VisualizerPage);
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });
});

describe("PrivacyPolicyPage", () => {
  it("renders the privacy H1 with a demo-placeholder flag", () => {
    renderPage(PrivacyPolicyPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /privacy policy/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/demo placeholder — not legal advice/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/must be reviewed and replaced by the client's legal counsel/i)
    ).toBeTruthy();
  });
});

describe("TermsPage", () => {
  it("renders the Terms and conditions H1 with a demo-placeholder flag", () => {
    renderPage(TermsPage);
    expect(
      screen.getByRole("heading", { level: 1, name: /terms and conditions/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/demo placeholder — not legal advice/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/must be reviewed and replaced by the client's legal counsel/i)
    ).toBeTruthy();
  });
});

describe("Static-route inventory audit (Sprint 8)", () => {
  it("includes all utility and legal routes", () => {
    const routes = staticRoutes();
    for (const path of [
      "/privacy-policy",
      "/terms-and-conditions",
      "/billpay",
      "/visualizer",
      "/crew",
      "/contact-us",
      "/refer-a-friend",
      "/commercial-projects",
      "/careers/sales",
    ]) {
      expect(routes).toContain(path);
    }
  });

  it("emits no duplicate paths", () => {
    const routes = staticRoutes();
    expect(new Set(routes).size).toBe(routes.length);
  });
});
