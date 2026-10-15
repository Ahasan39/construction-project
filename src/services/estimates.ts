import type { LeadFormPayload, LeadFormResult } from "@/types";

/**
 * MOCK lead-form submission. Does not send email, SMS, or any network request.
 * No personal data is persisted. Replace with a real Laravel API call during
 * backend integration.
 */
export async function submitLead(
  payload: LeadFormPayload
): Promise<LeadFormResult> {
  // Simulate a short network delay to let the UI exercise its pending state.
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Minimal defensive checks. Real validation lives in the form layer.
  if (!payload.name.trim() || !payload.phone.trim() || !payload.email.trim()) {
    return { status: "error", message: "Missing required fields." };
  }

  return {
    status: "success",
    demo: true,
    message:
      "Demo acknowledgment only — no submission was delivered. Backend integration pending.",
  };
}
