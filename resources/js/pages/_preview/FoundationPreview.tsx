import { useState } from "react";
import {
  Button,
  Checkbox,
  Container,
  Field,
  Input,
  Section,
  Select,
  SmartLink,
  Textarea,
} from "@/components/ui";
import { PageShell } from "@/components/layout/PageShell";

/**
 * Development-only preview of UI primitives. Not linked from production
 * navigation; mounted at /__preview and tagged `noindex` so it never enters
 * sitemaps or search results.
 */
export default function FoundationPreview() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <PageShell
      meta={{
        title: "Foundation preview (dev only)",
        description: "Development-only UI primitives preview.",
        canonicalPath: "/__preview",
        noindex: true,
      }}
      title="Foundation preview"
      intro="Development-only. UI primitives sampler — not part of the public site."
    >
      <Section tone="alt" className="mt-6 rounded-[var(--radius-lg)]">
        <Container>
          <h2 className="text-xl font-semibold">Buttons</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1200);
              }}
            >
              Trigger pending
            </Button>
          </div>
        </Container>
      </Section>

      <Section className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <Container>
          <h2 className="text-xl font-semibold">Form controls</h2>
          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Full name" required>
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                  autoComplete="name"
                  required
                />
              )}
            </Field>

            <Field label="Email" required description="We never share your email.">
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="email"
                  aria-describedby={describedBy}
                  invalid={invalid}
                  required
                />
              )}
            </Field>

            <Field label="Service">
              {({ id, describedBy, invalid }) => (
                <Select id={id} aria-describedby={describedBy} invalid={invalid}>
                  <option>Roofing</option>
                  <option>Siding</option>
                  <option>Windows</option>
                </Select>
              )}
            </Field>

            <Field label="Message with error" error="This field has an error.">
              {({ id, describedBy, invalid }) => (
                <Textarea
                  id={id}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>

            <div className="md:col-span-2 flex flex-col gap-3">
              <Checkbox
                label="Send me appointment reminders (demo only, no SMS is actually sent)"
                checked={checked1}
                onChange={(e) => setChecked1(e.target.checked)}
              />
              <Checkbox
                label="Send me seasonal promotions (demo only)"
                checked={checked2}
                onChange={(e) => setChecked2(e.target.checked)}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">Submit (no-op)</Button>
            </div>
          </form>
        </Container>
      </Section>

      <Section className="mt-6">
        <Container>
          <h2 className="text-xl font-semibold">Link primitive</h2>
          <ul className="mt-3 list-disc pl-5">
            <li>
              <SmartLink to="/roofing">Internal: /roofing</SmartLink>
            </li>
            <li>
              <SmartLink to="https://example.com">External: example.com</SmartLink>
            </li>
            <li>
              <SmartLink to="tel:+15550100100">Phone: tel link</SmartLink>
            </li>
          </ul>
        </Container>
      </Section>
    </PageShell>
  );
}
