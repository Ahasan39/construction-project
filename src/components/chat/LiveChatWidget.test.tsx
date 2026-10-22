import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { LiveChatWidget } from "./LiveChatWidget";

afterEach(() => cleanup());

describe("LiveChatWidget", () => {
  it("renders a labelled launcher that is collapsed by default", () => {
    render(<LiveChatWidget />);
    const launcher = screen.getByRole("button", { name: /open chat/i });
    expect(launcher.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the chat panel on launcher click and exposes an honest reach-us disclosure", () => {
    render(<LiveChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    const dialog = screen.getByRole("dialog", { name: /how can we help/i });
    expect(dialog).toBeTruthy();
    expect(
      within(dialog).getByText(/fastest reply by phone or contact us/i)
    ).toBeTruthy();
    expect(
      within(dialog).getByText(/not actively monitored in real time/i)
    ).toBeTruthy();
  });

  it("closes the panel via the close button and restores launcher aria-expanded", () => {
    render(<LiveChatWidget />);
    const launcher = screen.getByRole("button", { name: /open chat/i });
    fireEvent.click(launcher);
    fireEvent.click(screen.getByRole("button", { name: /close live chat/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen
        .getByRole("button", { name: /open chat/i })
        .getAttribute("aria-expanded")
    ).toBe("false");
  });

  it("closes the panel on Escape", () => {
    render(<LiveChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("rejects an empty-draft send with an inline error", () => {
    render(<LiveChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    const form = screen.getByRole("dialog").querySelector("form")!;
    fireEvent.submit(form);
    expect(screen.getByText(/type a message before sending/i)).toBeTruthy();
  });

  it("captures the visitor message locally and redirects to phone / Contact Us for a real reply", () => {
    render(<LiveChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    const textarea = screen.getByPlaceholderText(/type your question/i);
    fireEvent.change(textarea, { target: { value: "Hello?" } });
    fireEvent.click(screen.getByRole("button", { name: /^send message$/i }));

    const log = screen.getByRole("log", { name: /chat transcript/i });
    expect(within(log).getByText("Hello?")).toBeTruthy();
    expect(
      within(log).getByText(/call the number in the footer or use the contact us form/i)
    ).toBeTruthy();
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("never claims a successful delivery or an online agent", () => {
    render(<LiveChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));
    const dialog = screen.getByRole("dialog", { name: /how can we help/i });
    const text = dialog.textContent ?? "";
    expect(/online now/i.test(text)).toBe(false);
    expect(/message sent/i.test(text)).toBe(false);
    expect(/agent is available/i.test(text)).toBe(false);
    expect(/we have received your message/i.test(text)).toBe(false);
  });
});
