import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import TwoSegmentPage from "./TwoSegmentPage";
import { findRoofingDetail, roofingDetails, roofingDetailLocationLinks } from "@/data/roofingDetails";
import { staticRoutes } from "@/app/staticRoutes";
function Location() { return <output data-testid="path">{useLocation().pathname}</output>; }
function mount(slug: string) { return render(<MemoryRouter initialEntries={[`/roofing/${slug}/`]}><Location /><Routes><Route path="/:a/:b/" element={<TwoSegmentPage />} /><Route path="*" element={<p>Destination</p>} /></Routes></MemoryRouter>); }
afterEach(cleanup);
describe("roofing details", () => {
  it.each(roofingDetails)("resolves $slug with one title and a single priority image", page => {
    expect(findRoofingDetail(page.slug)).toBe(page);
    const { container } = mount(page.slug);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(1);
    expect(container.querySelectorAll('img[loading="eager"]')).toHaveLength(1);
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelectorAll("details")).toHaveLength((page.faqs?.length ?? 0) + page.features.reduce((n, f) => n + (f.disclosures?.length ?? 0), 0));
    for (const a of container.querySelectorAll("a")) expect(staticRoutes()).toContain(a.getAttribute("href")!.replace(/\/$/, "") || "/");
  });
  it.each([undefined, "unknown", "ROOF-REPAIR", "roof-repair/extra"])("rejects invalid lookup %s", slug => expect(findRoofingDetail(slug)).toBeUndefined());
  it("renders Not Found for unknown detail slugs", () => { mount("not-a-detail"); expect(screen.getByRole("heading", {level: 1}).textContent).toBe("Page not found"); });
  it.each(roofingDetails)("routes $slug locations only to supported entries", page => {
    const links = roofingDetailLocationLinks(page.slug);
    for (const link of links) expect(staticRoutes()).toContain(link.to.replace(/\/$/, ""));
    mount(page.slug);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: links[0].to } });
    expect(screen.getByTestId("path").textContent).toBe(links[0].to);
  });
  it("repair comparison links to the completed replacement route", () => {
    mount("roof-repair");
    fireEvent.click(screen.getByText("Compare roof replacement"));
    expect(screen.getByRole("heading", {level: 1}).textContent).toBe("Roof Replacement");
  });
});
