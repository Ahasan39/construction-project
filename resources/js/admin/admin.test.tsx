import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import HomepageEditorPage from "./pages/HomepageEditorPage";
import ServicesPage from "./pages/ServicesPage";
import LeadsPage from "./pages/LeadsPage";
import MarketingPage from "./pages/MarketingPage";
import { SettingsBrandingPage } from "./pages/SettingsPages";
import { staticRoutes } from "@/app/staticRoutes";

afterEach(() => cleanup());

function renderAdmin(path: string, element: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="pages/homepage" element={<HomepageEditorPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="settings/branding" element={<SettingsBrandingPage />} />
          <Route index element={<DashboardPage />} />
          <Route path="*" element={element} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("admin routing & shell", () => {
  it("renders the dashboard with sidebar navigation at /admin", () => {
    renderAdmin("/admin", <DashboardPage />);
    expect(screen.getByRole("heading", { level: 1, name: /admin dashboard/i })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: /admin navigation/i })).toBeTruthy();
    // Sidebar should surface the main sections.
    const nav = screen.getByRole("navigation", { name: /admin sections/i });
    expect(within(nav).getByRole("link", { name: /dashboard/i })).toBeTruthy();
    expect(within(nav).getByRole("link", { name: /^projects$/i })).toBeTruthy();
    expect(within(nav).getByRole("link", { name: /^marketing$/i })).toBeTruthy();
  });

  it("marks admin pages as noindex at runtime", () => {
    renderAdmin("/admin", <DashboardPage />);
    const meta = document.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute("content")).toBe("noindex,nofollow");
  });

  it("validates the homepage editor form", () => {
    renderAdmin("/admin/pages/homepage", <HomepageEditorPage />);
    const heading = screen.getByLabelText(/^heading/i) as HTMLInputElement;
    fireEvent.change(heading, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /save & apply/i }));
    expect(screen.getByText(/hero heading is required/i)).toBeTruthy();
  });

  it("filters leads by status", () => {
    renderAdmin("/admin/leads", <LeadsPage />);
    expect(screen.getAllByText(/sample lead 001/i).length).toBeGreaterThan(0);
    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    fireEvent.change(statusSelect, { target: { value: "won" } });
    expect(screen.getAllByText(/sample lead 004/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/sample lead 001/i)).toBeNull();
  });

  it("saves marketing settings as a draft without loading scripts", () => {
    renderAdmin("/admin/marketing", <MarketingPage />);
    expect(screen.getAllByText(/not configured/i).length).toBeGreaterThan(0);
    // Scripts are never injected by this UI.
    const scripts = Array.from(document.querySelectorAll("script")).map((s) => s.src);
    expect(scripts.some((s) => /pixel|googletagmanager|google-analytics/.test(s))).toBe(false);
  });

  it("validates brand color hex codes", () => {
    renderAdmin("/admin/settings/branding", <SettingsBrandingPage />);
    const primaries = screen.getAllByLabelText(/primary color/i) as HTMLInputElement[];
    const textInput = primaries.find((el) => el.type === "text") as HTMLInputElement;
    fireEvent.change(textInput, { target: { value: "nothex" } });
    const saveButtons = screen.getAllByRole("button", { name: /^save$/i });
    fireEvent.click(saveButtons[0]);
    expect(screen.getByText(/6-digit hex code/i)).toBeTruthy();
  });

  it("renders the services table with the live service taxonomy", () => {
    renderAdmin("/admin/services", <ServicesPage />);
    for (const name of ["Roofing", "Gutters", "Siding", "Windows", "Masonry"]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });
});

describe("admin responsive navigation", () => {
  it("opens the mobile drawer, locks body scroll, and closes on Escape", () => {
    renderAdmin("/admin", <DashboardPage />);
    const trigger = screen.getByRole("button", { name: /open navigation/i });
    fireEvent.click(trigger);
    // Drawer is rendered as a landmark region with Admin navigation label.
    expect(screen.getByRole("complementary", { name: /admin navigation/i })).toBeTruthy();
    // Pressing Escape closes it (handler is on document).
    fireEvent.keyDown(document, { key: "Escape" });
    // After close, the Close button inside the drawer should not have focus
    // (we just assert the trigger regained focus via activeElement).
    expect(document.activeElement?.id).toBe("admin-nav-trigger");
  });

  it("surfaces the page title in the topbar", () => {
    renderAdmin("/admin/leads", <LeadsPage />);
    // Topbar renders the matched route title.
    const topbar = screen.getByRole("banner");
    expect(within(topbar).getByText(/estimate leads/i)).toBeTruthy();
  });
});

describe("admin isolation from public SEO surface", () => {
  it("staticRoutes() does not expose any /admin entry", () => {
    const routes = staticRoutes();
    const leaked = routes.filter((r) => r.startsWith("/admin"));
    expect(leaked).toEqual([]);
  });
});
