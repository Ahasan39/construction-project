import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LocationFreeEstimatePage from "./LocationFreeEstimatePage";
import NotFoundPage from "./NotFoundPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path=":locationSlug/free-estimate" element={<LocationFreeEstimatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("Nashville free-estimate", () => {
  it("renders a completed body with a city-named H1 and no scaffold badge", () => {
    renderAt("/nashville/free-estimate");
    expect(
      screen.getByRole("heading", { level: 1, name: /free estimate/i })
    ).toBeTruthy();
    expect(screen.queryByText(/scaffold — sprint 1/i)).toBeNull();
    expect(screen.queryByText(/lead form will be built/i)).toBeNull();
  });

  it("preselects the Nashville region (hero region selector suppressed) and keeps service open", () => {
    renderAt("/nashville/free-estimate");
    expect(
      screen.queryByRole("combobox", { name: /select location/i })
    ).toBeNull();
    expect(
      screen.getByRole("combobox", { name: /select service/i })
    ).toBeTruthy();
  });

  it("exposes the shared demo phone and email contacts, not reference endpoints", () => {
    renderAt("/nashville/free-estimate");
    const phone = screen.getByRole("link", { name: /\+880 1842-299275/i });
    expect(phone.getAttribute("href")).toBe("tel:+8801842299275");
    const email = screen.getByRole("link", { name: /amamulahasan77@gmail\.com/i });
    expect(email.getAttribute("href")).toBe("mailto:amamulahasan77@gmail.com");
  });

  it("breadcrumb returns to the Nashville location hub", () => {
    renderAt("/nashville/free-estimate");
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    const link = within(nav).getByRole("link", { name: /nashville, tn/i });
    expect(link.getAttribute("href")).toBe("/nashville/");
  });

  it("shows the standing demo-form notice", () => {
    renderAt("/nashville/free-estimate");
    expect(screen.getByText(/demo form — submissions are not sent/i)).toBeTruthy();
  });
});

describe("Other hasFreeEstimate locations keep the scaffold (out of Sprint 5.5.2 scope)", () => {
  it.each(["cleveland", "cincinnati", "louisville", "dayton"])(
    "/%s/free-estimate still renders the scaffold badge",
    (slug) => {
      renderAt(`/${slug}/free-estimate`);
      expect(screen.getByText(/scaffold — sprint 1/i)).toBeTruthy();
    }
  );
});

describe("Not Found guards", () => {
  it("renders Not Found when the location is unknown", () => {
    renderAt("/not-a-city/free-estimate");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("renders Not Found when the location has no hasFreeEstimate capability", () => {
    renderAt("/ann-arbor/free-estimate");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });
});
