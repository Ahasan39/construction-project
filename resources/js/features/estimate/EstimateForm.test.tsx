import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock the mock service so each test deterministically chooses success or
// error without touching the implementation module.
vi.mock("@/services/estimates", () => {
  return {
    submitLead: vi.fn(),
  };
});

import { submitLead } from "@/services/estimates";
import { EstimateForm } from "./EstimateForm";
import type { LeadFormPayload } from "@/types";

type Mock = ReturnType<typeof vi.fn>;
const mockedSubmit = submitLead as unknown as Mock;

function renderForm() {
  return render(
    <MemoryRouter>
      <EstimateForm />
    </MemoryRouter>
  );
}

async function fillValid() {
  fireEvent.change(screen.getByLabelText(/^name/i), {
    target: { value: "Jane Homeowner" },
  });
  fireEvent.change(screen.getByLabelText(/^phone/i), {
    target: { value: "(555) 010-0100" },
  });
  fireEvent.change(screen.getByLabelText(/^email/i), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/select location/i), {
    target: { value: "nashville-area" },
  });
  fireEvent.change(screen.getByLabelText(/select service/i), {
    target: { value: "roofing" },
  });
}

beforeEach(() => {
  mockedSubmit.mockReset();
});
afterEach(() => cleanup());

describe("EstimateForm", () => {
  it("shows per-field errors on empty submit and does not call the service", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));

    expect(await screen.findByText(/please enter your name/i)).toBeTruthy();
    expect(screen.getByText(/please enter a phone number/i)).toBeTruthy();
    expect(screen.getByText(/please enter an email address/i)).toBeTruthy();
    expect(screen.getByText(/pick a service area\./i)).toBeTruthy();
    expect(screen.getByText(/^pick a service\.$/i)).toBeTruthy();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("rejects malformed email and phone with field-level errors", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/^phone/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText(/select location/i), {
      target: { value: "nashville-area" },
    });
    fireEvent.change(screen.getByLabelText(/select service/i), {
      target: { value: "roofing" },
    });
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));

    expect(await screen.findByText(/7–20 digits/i)).toBeTruthy();
    expect(screen.getByText(/valid email address/i)).toBeTruthy();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("accepts common phone formats and submits to the service with trimmed values", async () => {
    mockedSubmit.mockResolvedValueOnce({
      status: "success",
      demo: true,
      message: "Demo acknowledgment only.",
    });
    renderForm();
    await fillValid();
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));

    await waitFor(() => expect(mockedSubmit).toHaveBeenCalledTimes(1));
    const payload = mockedSubmit.mock.calls[0][0] as LeadFormPayload;
    expect(payload.name).toBe("Jane Homeowner");
    expect(payload.phone).toBe("(555) 010-0100");
    expect(payload.email).toBe("jane@example.com");
    expect(payload.regionKey).toBe("nashville-area");
    expect(payload.serviceKey).toBe("roofing");
    expect(payload.consentReminders).toBe(false);
    expect(payload.consentPromotions).toBe(false);
  });

  it("renders a success acknowledgement and allows another submission", async () => {
    mockedSubmit.mockResolvedValueOnce({
      status: "success",
      demo: true,
      message: "Demo acknowledgment only — not delivered.",
    });
    renderForm();
    await fillValid();
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));

    expect(
      await screen.findByText(/thanks — we received your details/i)
    ).toBeTruthy();
    expect(screen.getByText(/demo acknowledgment only/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /submit another/i }));
    expect(screen.getByLabelText(/^name/i)).toBeTruthy();
  });

  it("surfaces an error message on service error and preserves entered values", async () => {
    mockedSubmit.mockResolvedValueOnce({
      status: "error",
      message: "Service temporarily unavailable.",
    });
    renderForm();
    await fillValid();
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));

    expect(
      await screen.findByText(/service temporarily unavailable/i)
    ).toBeTruthy();
    // Values are still present.
    expect((screen.getByLabelText(/^name/i) as HTMLInputElement).value).toBe(
      "Jane Homeowner"
    );
    expect((screen.getByLabelText(/^email/i) as HTMLInputElement).value).toBe(
      "jane@example.com"
    );

    // Retrying succeeds the second time.
    mockedSubmit.mockResolvedValueOnce({
      status: "success",
      demo: true,
      message: "ok",
    });
    fireEvent.click(screen.getByRole("button", { name: /free estimate/i }));
    expect(await screen.findByText(/thanks — we received your details/i)).toBeTruthy();
  });

  it("ignores additional submits while a request is pending (duplicate-prevention)", async () => {
    let resolveFn: (v: unknown) => void = () => {};
    mockedSubmit.mockImplementation(
      () => new Promise((resolve) => (resolveFn = resolve))
    );
    renderForm();
    await fillValid();

    const btn = screen.getByRole("button", { name: /free estimate/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    // While pending.
    expect(mockedSubmit).toHaveBeenCalledTimes(1);
    expect(btn.getAttribute("aria-busy")).toBe("true");

    resolveFn({ status: "success", demo: true, message: "ok" });
    await waitFor(() =>
      expect(screen.getByText(/thanks — we received your details/i)).toBeTruthy()
    );
  });

  it("keeps the two consent choices independent and defaults them to unchecked", () => {
    renderForm();
    const reminders = screen.getByLabelText(
      /appointment reminders/i
    ) as HTMLInputElement;
    const promos = screen.getByLabelText(/seasonal offers/i) as HTMLInputElement;
    expect(reminders.checked).toBe(false);
    expect(promos.checked).toBe(false);

    fireEvent.click(reminders);
    expect(reminders.checked).toBe(true);
    expect(promos.checked).toBe(false);

    fireEvent.click(promos);
    expect(promos.checked).toBe(true);
    expect(reminders.checked).toBe(true);
  });

  it("includes Lexington in the location dropdown even though absent on the reference", () => {
    renderForm();
    const options = within(
      screen.getByLabelText(/select location/i)
    ).getAllByRole("option");
    const labels = options.map((o) => o.textContent?.toLowerCase() ?? "");
    expect(labels.some((l) => l.includes("lexington"))).toBe(true);
  });
});
