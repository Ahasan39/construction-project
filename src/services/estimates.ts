import type { LeadFormPayload, LeadFormResult } from "@/types";

/**
 * Lead-form submission service.
 * Posts to the Laravel API when VITE_API_BASE_URL is configured, while gracefully
 * falling back to local simulation for the static GitHub Pages demo site.
 */
export async function submitLead(
  payload: LeadFormPayload
): Promise<LeadFormResult> {
  // Minimal defensive checks. Real validation lives in the form layer.
  if (!payload.name.trim() || !payload.phone.trim() || !payload.email.trim()) {
    return { status: "error", message: "Missing required fields." };
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (apiBase) {
    try {
      const response = await fetch(
        `${apiBase.replace(/\/+$/, "")}/api/v1/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          status: "success",
          message:
            data.message ??
            "Your estimate request has been received. Our team will contact you shortly.",
        };
      }

      if (response.status === 422) {
        const errorData = await response.json().catch(() => null);
        const firstError =
          errorData?.message ?? "Please check the information entered.";
        return { status: "error", message: firstError };
      }
    } catch {
      // Graceful fallback to static demo mode when API is offline or unreachable
    }
  }

  // Static demo acknowledgment fallback (for GitHub Pages demo)
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    status: "success",
    demo: true,
    message:
      "Demo acknowledgment only — no submission was delivered. Backend integration pending.",
  };
}
