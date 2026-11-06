import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

/**
 * jsdom has no implementation of `matchMedia`. The MobileNav effect calls it
 * to detect the desktop breakpoint and to clean up on resize. Provide a tiny
 * stub whose "matches" is controllable per-test.
 */
let mqlMatches = false;
let registeredHandler: ((e: MediaQueryListEvent) => void) | null = null;

function setupMatchMedia(initialMatches: boolean) {
  mqlMatches = initialMatches;
  registeredHandler = null;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (_query: string) => ({
      get matches() {
        return mqlMatches;
      },
      media: _query,
      onchange: null,
      addEventListener: (_: string, handler: (e: MediaQueryListEvent) => void) => {
        registeredHandler = handler;
      },
      removeEventListener: () => {
        registeredHandler = null;
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<SiteHeader />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => setupMatchMedia(false));
afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  vi.restoreAllMocks();
});

describe("MobileNav drawer", () => {
  it("navigates with the drawer selector, closes and reflects the URL when reopened", async () => {
    renderAt("/nashville/siding");
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const select = within(screen.getByRole("dialog")).getByRole("combobox", { name: "Location" }) as HTMLSelectElement;
    expect(select.value).toBe("nashville");
    fireEvent.change(select, { target: { value: "lexington" } });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const dialog = within(screen.getByRole("dialog"));
    expect((dialog.getByRole("combobox", { name: "Location" }) as HTMLSelectElement).value).toBe("lexington");
    expect(dialog.getByRole("link", { name: /free estimate/i }).getAttribute("href")).toBe("/free-estimate");
  });
  it("is closed by default", () => {
    renderAt("/");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens when the hamburger is clicked and traps the body scroll", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape, restores body scroll and focuses the trigger", () => {
    renderAt("/");
    const trigger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when the explicit close button is pressed", () => {
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("makes <main> and <footer> inert while open and restores them on close", () => {
    renderAt("/");
    const main = document.createElement("main");
    const footer = document.createElement("footer");
    document.body.append(main, footer);

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(main.hasAttribute("inert")).toBe(true);
    expect(main.getAttribute("aria-hidden")).toBe("true");
    expect(footer.hasAttribute("inert")).toBe(true);
    expect(footer.getAttribute("aria-hidden")).toBe("true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(main.hasAttribute("inert")).toBe(false);
    expect(main.getAttribute("aria-hidden")).toBeNull();
    expect(footer.hasAttribute("inert")).toBe(false);
    expect(footer.getAttribute("aria-hidden")).toBeNull();

    main.remove();
    footer.remove();
  });

  it("auto-closes if the viewport is already at the desktop breakpoint when opened", async () => {
    setupMatchMedia(true); // (min-width: 1280px) matches
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("auto-closes when the viewport grows past the desktop breakpoint while open", async () => {
    setupMatchMedia(false);
    renderAt("/");
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    // Simulate a resize past xl.
    await act(async () => {
      mqlMatches = true;
      registeredHandler?.({ matches: true } as MediaQueryListEvent);
    });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.body.style.overflow).toBe("");
  });
});
