import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactUsPage from "./ContactUsPage";

afterEach(() => cleanup());

function renderPage() {
  return render(
    <MemoryRouter>
      <ContactUsPage />
    </MemoryRouter>
  );
}

describe("ContactUsPage", () => {
  it("renders a single Contact Us H1", () => {
    renderPage();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/contact us/i);
  });

  it("exposes the shared demo phone and email contacts", () => {
    renderPage();
    const phone = screen.getByRole("link", { name: /\+880 1842-299275/i });
    expect(phone.getAttribute("href")).toBe("tel:+8801842299275");
    const email = screen.getByRole("link", {
      name: /amamulahasan77@gmail\.com/i,
    });
    expect(email.getAttribute("href")).toBe("mailto:amamulahasan77@gmail.com");
  });

  it("links the Free Estimate CTA to /free-estimate", () => {
    renderPage();
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });

  it("declares the demo contact disclaimer", () => {
    renderPage();
    expect(
      screen.getByText(/no office address or business hours are published/i)
    ).toBeTruthy();
  });

  it("renders a service-area list linking to location hubs", () => {
    renderPage();
    const region = screen.getByRole("region", { name: /reach out by service area/i });
    const nashville = within(region).getByRole("link", { name: /nashville, tn/i });
    expect(nashville.getAttribute("href")).toBe("/nashville/");
  });
});
