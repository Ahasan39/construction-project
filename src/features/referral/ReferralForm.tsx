import { useId, useRef, useState } from "react";
import {
  Button,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { serviceAreaRegions } from "@/data/regions";
import type { ServiceAreaRegionKey } from "@/types";

type FieldErrors = Partial<Record<
  | "referrerName"
  | "referrerEmail"
  | "referrerPhone"
  | "friendName"
  | "friendPhone"
  | "friendEmail"
  | "regionKey",
  string
>>;

interface FormValues {
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  friendName: string;
  friendPhone: string;
  friendEmail: string;
  regionKey: ServiceAreaRegionKey | "";
}

const emptyValues: FormValues = {
  referrerName: "",
  referrerEmail: "",
  referrerPhone: "",
  friendName: "",
  friendPhone: "",
  friendEmail: "",
  regionKey: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d()\-\s]{7,20}$/;

function validate(v: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!v.referrerName.trim()) errors.referrerName = "Please enter your name.";
  if (!v.referrerEmail.trim()) errors.referrerEmail = "Please enter your email.";
  else if (!EMAIL_RE.test(v.referrerEmail.trim()))
    errors.referrerEmail = "Enter a valid email address.";
  if (v.referrerPhone.trim() && !PHONE_RE.test(v.referrerPhone.trim()))
    errors.referrerPhone = "Enter 7–20 digits (spaces, +, (, ), - are fine).";
  if (!v.friendName.trim()) errors.friendName = "Please enter your friend's name.";
  if (!v.friendPhone.trim())
    errors.friendPhone = "Please enter your friend's phone number.";
  else if (!PHONE_RE.test(v.friendPhone.trim()))
    errors.friendPhone = "Enter 7–20 digits (spaces, +, (, ), - are fine).";
  if (v.friendEmail.trim() && !EMAIL_RE.test(v.friendEmail.trim()))
    errors.friendEmail = "Enter a valid email address.";
  if (!v.regionKey) errors.regionKey = "Pick a service area.";
  return errors;
}

export function ReferralForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState("");
  const statusRef = useRef(status);
  statusRef.current = status;

  const demoNoticeId = useId();
  const statusRegionId = useId();

  const update =
    <K extends keyof FormValues>(key: K) =>
    (next: FormValues[K]) => {
      setValues((v) => ({ ...v, [key]: next }));
      setErrors((e) => {
        if (!(key in e)) return e;
        const copy = { ...e };
        delete copy[key as keyof FieldErrors];
        return copy;
      });
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
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

    // Simulate a short network delay so the pending state is visible.
    await new Promise((r) => setTimeout(r, 400));

    setStatus("success");
    setServerMessage(
      "Thanks — your referral details were captured locally. This demo does not transmit or store your referral; nothing has been sent to a real address."
    );
    setValues(emptyValues);
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${demoNoticeId} ${statusRegionId}`}
      className="flex flex-col gap-4"
    >
      {status === "success" ? (
        <div
          id={statusRegionId}
          role="status"
          aria-live="polite"
          className="rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] p-4 text-[var(--color-ink)]"
        >
          <p className="font-semibold">Thanks — referral captured.</p>
          <p className="text-sm mt-1">{serverMessage}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 text-sm underline"
          >
            Submit another referral
          </button>
        </div>
      ) : (
        <>
          <fieldset className="flex flex-col gap-3 border border-slate-200 rounded-sm p-4">
            <legend className="px-2 text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
              Your details
            </legend>

            <Field label="Your name" required error={errors.referrerName}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="referrerName"
                  autoComplete="name"
                  placeholder="Full name"
                  value={values.referrerName}
                  onChange={(e) => update("referrerName")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>

            <Field label="Your email" required error={errors.referrerEmail}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="referrerEmail"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={values.referrerEmail}
                  onChange={(e) => update("referrerEmail")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>

            <Field label="Your phone (optional)" error={errors.referrerPhone}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="referrerPhone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Phone"
                  value={values.referrerPhone}
                  onChange={(e) => update("referrerPhone")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>
          </fieldset>

          <fieldset className="flex flex-col gap-3 border border-slate-200 rounded-sm p-4">
            <legend className="px-2 text-sm font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
              Your friend's details
            </legend>

            <Field label="Friend's name" required error={errors.friendName}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="friendName"
                  placeholder="Full name"
                  value={values.friendName}
                  onChange={(e) => update("friendName")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>

            <Field label="Friend's phone" required error={errors.friendPhone}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="friendPhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Phone"
                  value={values.friendPhone}
                  onChange={(e) => update("friendPhone")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>

            <Field label="Friend's email (optional)" error={errors.friendEmail}>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="friendEmail"
                  type="email"
                  inputMode="email"
                  placeholder="friend@example.com"
                  value={values.friendEmail}
                  onChange={(e) => update("friendEmail")(e.target.value)}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>

            <Field label="Select location" required error={errors.regionKey}>
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  name="regionKey"
                  value={values.regionKey}
                  onChange={(e) =>
                    update("regionKey")(e.target.value as ServiceAreaRegionKey)
                  }
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                >
                  <option value="" disabled>
                    Select location
                  </option>
                  {serviceAreaRegions.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </fieldset>

          <p id={demoNoticeId} className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
            Demo form — referral information is not transmitted or stored. The
            reward amount is associated with the reference site and this demo
            is not an active promotion.
          </p>

          <div
            id={statusRegionId}
            role="status"
            aria-live="polite"
            className={`min-h-[1.5em] text-sm ${
              status === "error" ? "text-[var(--color-danger)]" : "text-[var(--color-ink-muted)]"
            }`}
          >
            {status === "error" && serverMessage}
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={status === "pending"}
            loadingLabel="Submitting…"
            className="w-full font-extrabold uppercase tracking-wider"
          >
            Submit Referral
          </Button>
        </>
      )}
    </form>
  );
}
