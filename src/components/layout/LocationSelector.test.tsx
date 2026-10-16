import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { LocationSelector } from "./LocationSelector";

function PathSpy() {
  const { pathname } = useLocation();
  return <div data-testid="path">{pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <LocationSelector idPrefix="test" />
              <PathSpy />
              <Link to="/grand-rapids/roofing">Change route</Link>
              <Link to="/">Global home</Link>
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("LocationSelector", () => {
  it("names the native control and displays the global placeholder", () => {
    renderAt("/");
    const select = screen.getByRole("combobox", { name: "Location" }) as HTMLSelectElement;
    expect(select.selectedOptions[0].textContent).toBe("Select location");
    expect(select.selectedOptions[0].disabled).toBe(true);
  });

  it.each(["/grand-rapids", "/grand-rapids/roofing"])("shows the location name from %s", (path) => {
    renderAt(path);
    const select = screen.getByRole("combobox", { name: "Location" }) as HTMLSelectElement;
    expect(select.value).toBe("grand-rapids");
    expect(select.selectedOptions[0].textContent).toBe("Grand Rapids, MI");
  });

  it("updates the same selector after external route changes and clears on global home", () => {
    renderAt("/nashville");
    const select = screen.getByRole("combobox", { name: "Location" }) as HTMLSelectElement;
    fireEvent.click(screen.getByText("Change route"));
    expect(select.value).toBe("grand-rapids");
    fireEvent.click(screen.getByText("Global home"));
    expect(select.value).toBe("");
    expect(select.selectedOptions[0].textContent).toBe("Select location");
  });

  it("keeps selection navigation to a location hub from a nested service route", () => {
    renderAt("/nashville/siding");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "lexington" } });
    expect(screen.getByTestId("path").textContent).toBe("/lexington");
  });
  it("navigates to /<slug> when a location is picked", () => {
    renderAt("/");
    const select = screen.getByLabelText(/location/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "cleveland" } });
    expect(screen.getByTestId("path").textContent).toBe("/cleveland");
  });

  it("stays on the current URL when the user re-picks the current location", () => {
    renderAt("/nashville");
    const select = screen.getByLabelText(/location/i) as HTMLSelectElement;
    expect(select.value).toBe("nashville");
    fireEvent.change(select, { target: { value: "nashville" } });
    expect(screen.getByTestId("path").textContent).toBe("/nashville");
  });

  it("falls back to the empty option on a non-location URL (URL is source of truth)", () => {
    renderAt("/roofing");
    const select = screen.getByLabelText(/location/i) as HTMLSelectElement;
    expect(select.value).toBe("");
  });
});
