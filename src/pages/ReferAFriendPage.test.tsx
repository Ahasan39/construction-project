import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReferAFriendPage from "./ReferAFriendPage";

afterEach(() => cleanup());

function renderPage() {
  return render(
    <MemoryRouter>
      <ReferAFriendPage />
    </MemoryRouter>
  );
}

describe("ReferAFriendPage layout", () => {
  it("renders a single Refer a Friend H1", () => {
    renderPage();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/refer a friend/i);
  });

  it("renders the three-step explanation", () => {
    renderPage();
    expect(screen.getByText(/tell us about your friend/i)).toBeTruthy();
    expect(screen.getByText(/they request a project/i)).toBeTruthy();
    expect(screen.getByText(/you both get rewarded/i)).toBeTruthy();
  });

  it("includes the reward/terms section with the demo disclaimer", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /reward & terms/i })).toBeTruthy();
    expect(
      screen.getByText(/this reproduction site does not operate the program/i)
    ).toBeTruthy();
  });

  it("links the Free Estimate CTA to /free-estimate", () => {
    renderPage();
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });
});

describe("ReferAFriend form behavior", () => {
  it("surfaces required-field errors when submitted empty", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /submit referral/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeTruthy();
    expect(screen.getByText(/please enter your email/i)).toBeTruthy();
    expect(screen.getByText(/please enter your friend's name/i)).toBeTruthy();
    expect(screen.getByText(/please enter your friend's phone number/i)).toBeTruthy();
    expect(screen.getByText(/pick a service area/i)).toBeTruthy();
  });

  it("rejects an invalid referrer email", async () => {
    renderPage();
    const email = screen.getByLabelText(/your email/i) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: /submit referral/i }));
    expect(await screen.findByText(/enter a valid email address/i)).toBeTruthy();
  });

  it("shows the demo disclaimer on the form", () => {
    renderPage();
    expect(
      screen.getByText(/referral information is not transmitted or stored/i)
    ).toBeTruthy();
  });

  it("submits a valid payload and shows the demo success state", async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Alex Referrer" } });
    fireEvent.change(screen.getByLabelText(/your email/i), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText(/friend's name/i), { target: { value: "Jamie Friend" } });
    fireEvent.change(screen.getByLabelText(/friend's phone/i), { target: { value: "555-123-4567" } });
    fireEvent.change(screen.getByLabelText(/select location/i), { target: { value: "nashville-area" } });

    fireEvent.click(screen.getByRole("button", { name: /submit referral/i }));

    await waitFor(() =>
      expect(screen.getByText(/thanks — referral captured/i)).toBeTruthy()
    );
    expect(
      screen.getByText(/this demo does not transmit or store your referral/i)
    ).toBeTruthy();
  });
});
