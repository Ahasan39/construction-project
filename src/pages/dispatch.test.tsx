import { describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { afterEach } from "vitest";

import TopLevelSlugPage from "./TopLevelSlugPage";
import TwoSegmentPage from "./TwoSegmentPage";
import NotFoundPage from "./NotFoundPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path=":slug" element={<TopLevelSlugPage />} />
        <Route path=":a/:b" element={<TwoSegmentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("top-level slug dispatcher", () => {
  it("renders a service hub for a known service slug", () => {
    renderAt("/roofing");
    expect(screen.getByRole("heading", { level: 1, name: /roofing/i })).toBeTruthy();
  });

  it("renders a location hub for a known location slug", () => {
    renderAt("/nashville");
    expect(
      screen.getByRole("heading", { level: 1, name: /nashville/i })
    ).toBeTruthy();
  });

  it("renders Not Found for an unknown top-level slug", () => {
    renderAt("/not-a-real-slug");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });
});

describe("two-segment dispatcher", () => {
  it("renders a service variant when service + variant match", () => {
    renderAt("/roofing/roof-replacement");
    expect(
      screen.getByRole("heading", { level: 1, name: /roof replacement/i })
    ).toBeTruthy();
  });

  it("renders Not Found when the variant is unknown under a known service", () => {
    renderAt("/roofing/not-a-variant");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("renders Not Found for an unavailable location/service combo", () => {
    renderAt("/lexington/roofing");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });

  it("renders a location-service page for an available combo", () => {
    renderAt("/nashville/siding");
    expect(screen.getByRole("heading", { name: /siding — nashville/i })).toBeTruthy();
  });

  it("renders Not Found when the first segment is neither a service nor a location", () => {
    renderAt("/nowhere/anything");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeTruthy();
  });
});
