import { useId, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { services } from "@/data/services";
import { serviceAreaRegions } from "@/data/regions";
import { submitLead } from "@/services/estimates";
import type { LeadFormPayload, LeadFormResult } from "@/types";

type FieldErrors = Partial<Record<
  "name" | "phone" | "email" | "regionKey" | "serviceKey",
  string
>>;

interface FormValues {
  name: string;
  phone: string;
  email: string;
  regionKey: LeadFormPayload["regionKey"] | "";
  serviceKey: LeadFormPayload["serviceKey"] | "";
  consentReminders: boolean;
  consentPromotions: boolean;
}

const emptyValues: FormValues = {
  name: "",
  phone: "",
  email: "",
  regionKey: "",
  serviceKey: "",
  consentReminders: false,
  consentPromotions: false,
};

// RFC-5322-lite — generous enough for everyday addresses, rejects whitespace.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Keeps digits, +, (), -, space. 7–20 chars total. Allows common formatting.
const PHONE_RE = /^[+\d()\-\s]{7,20}$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.phone.trim()) errors.phone = "Please enter a phone number.";
  else if (!PHONE_RE.test(values.phone.trim()))
    errors.phone = "Enter 7–20 digits (spaces, +, (, ), - are fine).";
  if (!values.email.trim()) errors.email = "Please enter an email address.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.regionKey) errors.regionKey = "Pick a service area.";
  if (!values.serviceKey) errors.serviceKey = "Pick a service.";
  return errors;
}

export interface EstimateFormProps {
  /** Visual variant; `inverse` is tuned for the dark hero card. */
  variant?: "default" | "inverse";
  /** Narrows the "Service" dropdown to a single choice; hides it when provided. */
  lockedService?: LeadFormPayload["serviceKey"];
  /** Narrows the "Region" dropdown to a single choice; hides it when provided. */
  lockedRegion?: LeadFormPayload["regionKey"];
  /** Submit button label — defaults to the reference's wording. */
  submitLabel?: string;
}

/**
 * Reusable estimate form. Mock-submits via `services/estimates.submitLead`.
 * No personal data is stored in localStorage; the console only receives a
 * redacted field-presence summary (never the values themselves).
 */
export function EstimateForm({
  variant = "default",
  lockedService,
  lockedRegion,
  submitLabel = "Get a FREE estimate",
}: EstimateFormProps) {
  const [values, setValues] = useState<FormValues>(() => ({
    ...emptyValues,
    ...(lockedService ? { serviceKey: lockedService } : {}),
    ...(lockedRegion ? { regionKey: lockedRegion } : {}),
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState<string>("");
  const statusRef = useRef(status);
  statusRef.current = status;

  const demoNoticeId = useId();
  const statusRegionId = useId();

  const update =
    <K extends keyof FormValues>(key: K) =>
    (next: FormValues[K]) => {
      setValues((v) => ({ ...v, [key]: next }));
      // Clear the field-level error as the user corrects it.
      setErrors((e) => {
        if (!(key in e)) return e;
        const copy = { ...e };
        delete copy[key as keyof FieldErrors];
        return copy;
      });
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Duplicate-submission prevention — any additional submits while a prior
    // request is in flight are no-ops.
    if (statusRef.current === "pending") return;

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setServerMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("pending");
    setServerMessage("");

    const payload: LeadFormPayload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      regionKey: values.regionKey as LeadFormPayload["regionKey"],
      serviceKey: values.serviceKey as LeadFormPayload["serviceKey"],
      consentReminders: values.consentReminders,
      consentPromotions: values.consentPromotions,
    };

    let result: LeadFormResult;
    try {
      result = await submitLead(payload);
    } catch (err) {
      result = {
        status: "error",
        message:
          err instanceof Error
            ? `Submission failed: ${err.message}`
            : "Submission failed. Please try again.",
      };
    }

    if (result.status === "success") {
      setStatus("success");
      setServerMessage(result.message);
      // Reset only on success — error should preserve user input per spec.
      setValues(() => ({
        ...emptyValues,
        ...(lockedService ? { serviceKey: lockedService } : {}),
        ...(lockedRegion ? { regionKey: lockedRegion } : {}),
      }));
    } else {
      setStatus("error");
      setServerMessage(result.message);
    }
  }

  // Classes for the dark hero-card variant vs. the default page variant.
  const labelTone =
    variant === "inverse" ? "text-white text-xs font-semibold tracking-wide" : "text-[var(--color-ink)] text-sm font-medium";
  const noticeTone =
    variant === "inverse"
      ? "text-slate-300 text-xs"
      : "text-[var(--color-ink-muted)] text-xs";
  const inputClassName =
    variant === "inverse"
      ? "!h-10 text-sm !bg-[#10273D] !border-[#223E59] !text-white placeholder:!text-slate-400 focus:!border-[#00a3e0] !rounded-sm"
      : "";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby={[demoNoticeId, status === "error" ? statusRegionId : undefined].filter(Boolean).join(" ")}
      className="flex flex-col gap-2 sm:gap-2.5"
    >
      {/* Success acknowledgement replaces the form on happy path for clarity. */}
      {status === "success" ? (
        <div
          id={statusRegionId}
          role="status"
          aria-live="polite"
          className={`rounded-[var(--radius-md)] p-4 ${
            variant === "inverse"
              ? "bg-white/10 text-white"
              : "bg-[var(--color-surface-alt)] text-[var(--color-ink)]"
          }`}
        >
          <p className="font-semibold">Thanks — we received your details.</p>
          <p className="text-sm mt-1">{serverMessage}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-sm underline"
          >
            Submit another estimate request
          </button>
        </div>
      ) : (
        <>
          <div className={labelTone}>
            <Field
              label="Name"
              required
              error={errors.name}
              errorClassName={variant === "inverse" ? "text-rose-300 font-medium text-xs" : undefined}
              hideLabel={variant === "inverse"}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="name"
                  autoComplete="name"
                  placeholder="Full Name"
                  className={inputClassName}
                  value={values.name}
                  onChange={(e) => update("name")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>
          </div>

          <div className={labelTone}>
            <Field
              label="Phone"
              required
              error={errors.phone}
              errorClassName={variant === "inverse" ? "text-rose-300 font-medium text-xs" : undefined}
              hideLabel={variant === "inverse"}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Phone"
                  className={inputClassName}
                  value={values.phone}
                  onChange={(e) => update("phone")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>
          </div>

          <div className={labelTone}>
            <Field
              label="Email"
              required
              error={errors.email}
              errorClassName={variant === "inverse" ? "text-rose-300 font-medium text-xs" : undefined}
              hideLabel={variant === "inverse"}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Email"
                  className={inputClassName}
                  value={values.email}
                  onChange={(e) => update("email")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>
          </div>

          {!lockedRegion && (
            <div className={labelTone}>
              <Field
                label="Select location"
                required
                error={errors.regionKey}
                errorClassName={variant === "inverse" ? "text-rose-300 font-medium text-xs" : undefined}
                hideLabel={variant === "inverse"}
              >
                {({ id, describedBy, invalid }) => (
                  <Select
                    id={id}
                    name="regionKey"
                    className={inputClassName}
                    value={values.regionKey}
                    onChange={(e) =>
                      update("regionKey")(e.target.value as FormValues["regionKey"])
                    }
                    aria-describedby={describedBy}
                    invalid={invalid}
                    required
                  >
                    <option value="" disabled className="text-gray-900 bg-white">
                      Select location
                    </option>
                    {serviceAreaRegions.map((r) => (
                      <option key={r.key} value={r.key} className="text-gray-900 bg-white">
                        {r.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
          )}

          {!lockedService && (
            <div className={labelTone}>
              <Field
                label="Select service"
                required
                error={errors.serviceKey}
                errorClassName={variant === "inverse" ? "text-rose-300 font-medium text-xs" : undefined}
                hideLabel={variant === "inverse"}
              >
                {({ id, describedBy, invalid }) => (
                  <Select
                    id={id}
                    name="serviceKey"
                    className={inputClassName}
                    value={values.serviceKey}
                    onChange={(e) =>
                      update("serviceKey")(e.target.value as FormValues["serviceKey"])
                    }
                    aria-describedby={describedBy}
                    invalid={invalid}
                    required
                  >
                    <option value="" disabled className="text-gray-900 bg-white">
                      Select service
                    </option>
                    {services.map((s) => (
                      <option key={s.key} value={s.key} className="text-gray-900 bg-white">
                        {s.title}
                      </option>
                    ))}
                    <option value="insulation" className="text-gray-900 bg-white">Insulation</option>
                  </Select>
                )}
              </Field>
            </div>
          )}

          <div className="flex flex-col gap-1.5 pt-0.5">
            <Checkbox
              name="consentReminders"
              checked={values.consentReminders}
              onChange={(e) => update("consentReminders")(e.target.checked)}
              label="Send me appointment reminders and service updates."
              labelClassName={`text-xs leading-snug ${
                variant === "inverse" ? "text-slate-200 font-medium" : "text-[var(--color-ink)]"
              }`}
            />
            <Checkbox
              name="consentPromotions"
              checked={values.consentPromotions}
              onChange={(e) => update("consentPromotions")(e.target.checked)}
              label="Send me seasonal offers and promotions."
              labelClassName={`text-xs leading-snug ${
                variant === "inverse" ? "text-slate-200 font-medium" : "text-[var(--color-ink)]"
              }`}
            />
          </div>

          <p id={demoNoticeId} className={`text-[11px] sm:text-xs ${noticeTone} leading-normal`}>
            Demo form — submissions are not sent.
          </p>

          {status === "error" && (
            <div
              id={statusRegionId}
              role="status"
              aria-live="polite"
              className={`text-xs ${
                variant === "inverse"
                  ? "text-red-200"
                  : "text-[var(--color-danger)]"
              }`}
            >
              {serverMessage}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            isLoading={status === "pending"}
            loadingLabel="Submitting…"
            className={`w-full font-extrabold uppercase tracking-wider ${
              variant === "inverse"
                ? "bg-[#d9232a] hover:bg-[#b81b22] text-white py-2.5 sm:py-3 shadow-md"
                : ""
            }`}
          >
            {submitLabel}
          </Button>
        </>
      )}
    </form>
  );
}
