import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  FormField,
  IntegrationCard,
  Modal,
  PageHeader,
  SelectInput,
  TextInput,
  Toggle,
  inputCls,
} from "../components";
import type { IntegrationState, IntegrationStatus } from "../types";

type ProviderKey = keyof IntegrationState;

const providers: {
  key: ProviderKey; label: string; purpose: string; initial: string;
  idLabel: string; idExample: string; validate: (v: string) => boolean;
}[] = [
  { key: "pixel", label: "Meta / Facebook Pixel", purpose: "Conversion tracking and audience building for Meta ads.", initial: "f", idLabel: "Pixel ID", idExample: "e.g. 1234567890123456", validate: (v) => /^\d{15,16}$/.test(v) },
  { key: "gtm", label: "Google Tag Manager", purpose: "Tag container for GA4, pixels, and other tracking.", initial: "T", idLabel: "Container ID", idExample: "GTM-XXXXXXX", validate: (v) => /^GTM-[A-Z0-9]{5,10}$/.test(v) },
  { key: "ga4", label: "Google Analytics 4", purpose: "Audience, acquisition, and conversion analytics.", initial: "A", idLabel: "Measurement ID", idExample: "G-XXXXXXXXXX", validate: (v) => /^G-[A-Z0-9]{6,12}$/.test(v) },
  { key: "searchConsole", label: "Google Search Console", purpose: "Search appearance, indexing status, and sitemap submission.", initial: "S", idLabel: "Site URL", idExample: "https://example.com/", validate: (v) => /^https?:\/\//.test(v) },
];

export default function MarketingPage() {
  useNoIndex("Marketing");
  const { integrations, setIntegrations, pushToast } = useAdminStore();
  const [editing, setEditing] = useState<ProviderKey | null>(null);
  const [draft, setDraft] = useState<IntegrationState>(integrations);
  const [error, setError] = useState<string | null>(null);

  function openProvider(k: ProviderKey) {
    setDraft(integrations);
    setError(null);
    setEditing(k);
  }

  function saveProvider() {
    if (!editing) return;
    const def = providers.find((p) => p.key === editing)!;
    const idValue = editing === "pixel" ? draft.pixel.id
      : editing === "gtm" ? draft.gtm.containerId
      : editing === "ga4" ? draft.ga4.measurementId
      : draft.searchConsole.siteUrl;

    if (idValue && !def.validate(idValue)) {
      setError(`Invalid ${def.idLabel} format. Expected ${def.idExample}.`);
      return;
    }

    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const nextStatus: IntegrationStatus = !idValue ? "not_configured" : "draft";

    const next: IntegrationState = { ...draft };
    if (editing === "pixel") next.pixel = { ...draft.pixel, status: nextStatus, savedAt: now };
    else if (editing === "gtm") next.gtm = { ...draft.gtm, status: nextStatus, savedAt: now };
    else if (editing === "ga4") next.ga4 = { ...draft.ga4, status: nextStatus, savedAt: now };
    else next.searchConsole = { ...draft.searchConsole, status: nextStatus, savedAt: now };

    setIntegrations(next);
    setEditing(null);
    pushToast("success", `${def.label} draft saved. No tracking scripts load in Sprint 6.1.`);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Marketing" }]}
        title="Marketing & analytics integrations"
        description="Configure tracking IDs for Meta Pixel, Google Tag Manager, GA4, and Search Console. No tracking scripts load in this sprint; saved values are kept as drafts only."
      />

      <section className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Security & privacy boundary</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
          <li>Tracking IDs entered here are configuration values, not secrets, but are still only persisted in local demo state in Sprint 6.1.</li>
          <li>No arbitrary JavaScript or HTML can be entered — the admin never executes user input.</li>
          <li>No Pixel, GTM, GA4, or marketing script is loaded by this sprint, and no events are fired.</li>
          <li>Enable/disable toggles and consent requirements are respected before scripts load, in a later sprint.</li>
          <li>Saving here produces a <strong>draft configuration</strong>. A verified live connection requires backend handshake, planned later.</li>
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => {
          const i = integrations[p.key];
          return (
            <IntegrationCard
              key={p.key}
              provider={p.label}
              purpose={p.purpose}
              initial={p.initial}
              status={i.status}
              savedAt={i.savedAt}
              onConfigure={() => openProvider(p.key)}
            />
          );
        })}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Configure ${providers.find((p) => p.key === editing)?.label}` : ""}
        description="Validation only — no scripts are injected. All values stay local to this demo session."
        size="md"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={saveProvider}>Save draft</AdminButton>
          </>
        ) : null}
      >
        {editing && renderProviderForm(editing, draft, setDraft, error)}
      </Modal>
    </>
  );
}

function renderProviderForm(
  key: ProviderKey,
  draft: IntegrationState,
  setDraft: (s: IntegrationState) => void,
  error: string | null,
) {
  if (key === "pixel") {
    return (
      <div className="space-y-4">
        <FormField label="Pixel ID" hint="15–16 digit numeric ID from Meta Events Manager." error={error ?? undefined}>
          {(p) => <TextInput {...p} value={draft.pixel.id} onChange={(e) => setDraft({ ...draft, pixel: { ...draft.pixel, id: e.target.value.replace(/\D/g, "") } })} placeholder="1234567890123456" />}
        </FormField>
        <Toggle label="Enable tracking (requires backend wiring)" hint="Will not load any pixel script in this sprint." checked={draft.pixel.enabled} onChange={(v) => setDraft({ ...draft, pixel: { ...draft.pixel, enabled: v } })} />
        <Toggle label="Track page views" checked={draft.pixel.trackPageView} onChange={(v) => setDraft({ ...draft, pixel: { ...draft.pixel, trackPageView: v } })} />
        <Toggle label="Track estimate submissions as leads" checked={draft.pixel.trackLeads} onChange={(v) => setDraft({ ...draft, pixel: { ...draft.pixel, trackLeads: v } })} />
        <Toggle label="Require consent before firing" hint="Default on. Respect visitor consent before loading tracking." checked={draft.pixel.requireConsent} onChange={(v) => setDraft({ ...draft, pixel: { ...draft.pixel, requireConsent: v } })} />
      </div>
    );
  }
  if (key === "gtm") {
    return (
      <div className="space-y-4">
        <FormField label="Container ID" hint="Format: GTM-XXXXXXX." error={error ?? undefined}>
          {(p) => <TextInput {...p} value={draft.gtm.containerId} onChange={(e) => setDraft({ ...draft, gtm: { ...draft.gtm, containerId: e.target.value.toUpperCase() } })} placeholder="GTM-XXXXXXX" />}
        </FormField>
        <Toggle label="Enable container loading (requires backend wiring)" checked={draft.gtm.enabled} onChange={(v) => setDraft({ ...draft, gtm: { ...draft.gtm, enabled: v } })} />
        <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">Events (page_view, estimate_submit, phone_click) are configured in a later sprint once the GTM container ID is verified.</p>
      </div>
    );
  }
  if (key === "ga4") {
    return (
      <div className="space-y-4">
        <FormField label="Measurement ID" hint="Format: G-XXXXXXXXXX." error={error ?? undefined}>
          {(p) => <TextInput {...p} value={draft.ga4.measurementId} onChange={(e) => setDraft({ ...draft, ga4: { ...draft.ga4, measurementId: e.target.value.toUpperCase() } })} placeholder="G-XXXXXXXXXX" />}
        </FormField>
        <Toggle label="Enable GA4" checked={draft.ga4.enabled} onChange={(v) => setDraft({ ...draft, ga4: { ...draft.ga4, enabled: v } })} />
        <Toggle label="Track page views" checked={draft.ga4.trackPageView} onChange={(v) => setDraft({ ...draft, ga4: { ...draft.ga4, trackPageView: v } })} />
        <Toggle label="Track estimate submissions as conversion events" checked={draft.ga4.trackEstimateConversion} onChange={(v) => setDraft({ ...draft, ga4: { ...draft.ga4, trackEstimateConversion: v } })} />
      </div>
    );
  }
  // searchConsole
  return (
    <div className="space-y-4">
      <FormField label="Site URL" hint="Protocol + host as registered in Search Console." error={error ?? undefined}>
        {(p) => <TextInput {...p} value={draft.searchConsole.siteUrl} onChange={(e) => setDraft({ ...draft, searchConsole: { ...draft.searchConsole, siteUrl: e.target.value } })} />}
      </FormField>
      <FormField label="Verification method">
        {(p) => (
          <SelectInput {...p} className={inputCls} value={draft.searchConsole.verificationMethod} onChange={(e) => setDraft({ ...draft, searchConsole: { ...draft.searchConsole, verificationMethod: e.target.value as "meta-tag" | "dns" | "html-file" } })}>
            <option value="meta-tag">HTML meta tag</option>
            <option value="dns">DNS TXT record</option>
            <option value="html-file">HTML file upload</option>
          </SelectInput>
        )}
      </FormField>
      <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">Verification requires access to DNS or the public hosting environment and is performed outside this UI. Saving here only stores the draft intent.</p>
    </div>
  );
}
