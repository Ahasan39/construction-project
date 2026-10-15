import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  MemoryRouter,
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
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => cleanup());

describe("LocationSelector", () => {
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
