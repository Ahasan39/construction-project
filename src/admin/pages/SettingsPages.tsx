import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  FileInput,
  FormField,
  ImagePreview,
  PageHeader,
  SelectInput,
  TextArea,
  TextInput,
  Toggle,
  inputCls,
} from "../components";

/* ============================================================ */
/* General                                                       */
/* ============================================================ */

export function SettingsGeneralPage() {
  useNoIndex("General settings");
  const { general, setGeneral, pushToast } = useAdminStore();
  const [draft, setDraft] = useState(general);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }, { label: "General" }]}
        title="General settings"
        description="Company display information, locale, and default calls-to-action."
        actions={<>
          <AdminButton variant="ghost" onClick={() => setDraft(general)}>Reset</AdminButton>
          <AdminButton variant="primary" onClick={() => { setGeneral(draft); pushToast("success", "General settings saved."); }}>Save</AdminButton>
        </>}
      />
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Company display name">
            {(p) => <TextInput {...p} value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />}
          </FormField>
          <FormField label="Website URL">
            {(p) => <TextInput {...p} type="url" value={draft.websiteUrl} onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })} />}
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Short business description" hint="Used as a default meta description where a page does not override it.">
              {(p) => <TextArea {...p} rows={2} value={draft.shortDescription} onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })} />}
            </FormField>
          </div>
          <FormField label="Default locale">
            {(p) => (
              <SelectInput {...p} className={inputCls} value={draft.locale} onChange={(e) => setDraft({ ...draft, locale: e.target.value })}>
                <option value="en-US">English — United States</option>
                <option value="en-GB">English — United Kingdom</option>
              </SelectInput>
            )}
          </FormField>
          <FormField label="Default timezone">
            {(p) => (
              <SelectInput {...p} className={inputCls} value={draft.timezone} onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </SelectInput>
            )}
          </FormField>
          <FormField label="Default CTA label">
            {(p) => <TextInput {...p} value={draft.defaultCta} onChange={(e) => setDraft({ ...draft, defaultCta: e.target.value })} />}
          </FormField>
          <FormField label="Business hours">
            {(p) => <TextInput {...p} value={draft.businessHours} onChange={(e) => setDraft({ ...draft, businessHours: e.target.value })} />}
          </FormField>
        </div>
      </section>
    </>
  );
}

/* ============================================================ */
/* Branding                                                      */
/* ============================================================ */

const hexRegex = /^#[0-9a-fA-F]{6}$/;

export function SettingsBrandingPage() {
  useNoIndex("Branding");
  const { branding, setBranding, pushToast } = useAdminStore();
  const [draft, setDraft] = useState(branding);
  const [errors, setErrors] = useState<Partial<Record<"primaryColor" | "accentColor", string>>>({});

  function save() {
    const e: typeof errors = {};
    if (!hexRegex.test(draft.primaryColor)) e.primaryColor = "Use a 6-digit hex code like #0f2231.";
    if (!hexRegex.test(draft.accentColor)) e.accentColor = "Use a 6-digit hex code like #d9232a.";
    setErrors(e);
    if (Object.keys(e).length > 0) { pushToast("error", "Please fix color inputs."); return; }
    setBranding(draft);
    pushToast("success", "Branding saved.");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }, { label: "Branding" }]}
        title="Branding"
        description="Logo, favicon, and brand colors. Uploads here use an in-memory preview and are not persisted to a server in this sprint."
        actions={<>
          <AdminButton variant="ghost" onClick={() => setDraft(branding)}>Reset</AdminButton>
          <AdminButton variant="primary" onClick={save}>Save</AdminButton>
        </>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Logo</h2>
          <ImagePreview src={draft.logoPreview} alt="Logo preview" aspect="video" />
          <div className="mt-3 flex items-center gap-2">
            <FileInput accept="image/svg+xml,image/png,image/webp" onPick={(dataUrl) => setDraft({ ...draft, logoPreview: dataUrl })} />
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, logoPreview: "" })}>Clear</AdminButton>
          </div>
          <p className="mt-2 text-xs text-slate-500">Recommended: SVG or 400 × 120 px PNG/WebP. In-memory preview only.</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Favicon</h2>
          <ImagePreview src={draft.faviconPreview} alt="Favicon preview" aspect="square" />
          <div className="mt-3 flex items-center gap-2">
            <FileInput accept="image/x-icon,image/png,image/svg+xml" onPick={(dataUrl) => setDraft({ ...draft, faviconPreview: dataUrl })} />
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, faviconPreview: "" })}>Clear</AdminButton>
          </div>
          <p className="mt-2 text-xs text-slate-500">Recommended: 32 × 32 px ICO or PNG. In-memory preview only.</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Brand colors</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Primary color" error={errors.primaryColor} hint="Deep navy / charcoal used across headings and the admin shell.">
              {(p) => (
                <div className="flex items-center gap-2">
                  <input type="color" value={hexRegex.test(draft.primaryColor) ? draft.primaryColor : "#000000"} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded border border-slate-300" aria-label="Primary color picker" />
                  <TextInput {...p} value={draft.primaryColor} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} />
                </div>
              )}
            </FormField>
            <FormField label="Accent color" error={errors.accentColor} hint="Brand red used for primary CTAs.">
              {(p) => (
                <div className="flex items-center gap-2">
                  <input type="color" value={hexRegex.test(draft.accentColor) ? draft.accentColor : "#000000"} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded border border-slate-300" aria-label="Accent color picker" />
                  <TextInput {...p} value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} />
                </div>
              )}
            </FormField>
          </div>
        </section>
      </div>
    </>
  );
}

/* ============================================================ */
/* Contact                                                       */
/* ============================================================ */

export function SettingsContactPage() {
  useNoIndex("Contact");
  const { contact, setContact, pushToast } = useAdminStore();
  const [draft, setDraft] = useState(contact);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }, { label: "Contact" }]}
        title="Contact & business"
        description="Primary contact information shown in the header, footer, and on contact pages."
        actions={<>
          <AdminButton variant="ghost" onClick={() => setDraft(contact)}>Reset</AdminButton>
          <AdminButton variant="primary" onClick={() => { setContact(draft); pushToast("success", "Contact saved."); }}>Save</AdminButton>
        </>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Phone & email</h2>
          <div className="space-y-4">
            <FormField label="Primary phone">
              {(p) => <TextInput {...p} value={draft.primaryPhone} onChange={(e) => setDraft({ ...draft, primaryPhone: e.target.value })} />}
            </FormField>
            <FormField label="Secondary phone (optional)">
              {(p) => <TextInput {...p} value={draft.secondaryPhone} onChange={(e) => setDraft({ ...draft, secondaryPhone: e.target.value })} />}
            </FormField>
            <FormField label="Contact email">
              {(p) => <TextInput {...p} type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />}
            </FormField>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Address & CTAs</h2>
          <div className="space-y-4">
            <FormField label="Business address">
              {(p) => <TextArea {...p} rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />}
            </FormField>
            <FormField label="Emergency banner label">
              {(p) => <TextInput {...p} value={draft.emergencyLabel} onChange={(e) => setDraft({ ...draft, emergencyLabel: e.target.value })} />}
            </FormField>
            <FormField label="Estimate page destination" hint="Where the public “Request a Free Estimate” CTA points.">
              {(p) => <TextInput {...p} value={draft.estimateDestination} onChange={(e) => setDraft({ ...draft, estimateDestination: e.target.value })} />}
            </FormField>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Social profiles</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["facebook", "instagram", "linkedin", "youtube"] as const).map((k) => (
              <FormField key={k} label={k[0].toUpperCase() + k.slice(1) + " URL"}>
                {(p) => <TextInput {...p} type="url" value={draft.social[k]} onChange={(e) => setDraft({ ...draft, social: { ...draft.social, [k]: e.target.value } })} />}
              </FormField>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/* ============================================================ */
/* Notifications                                                 */
/* ============================================================ */

export function SettingsNotificationsPage() {
  useNoIndex("Notifications");
  const [leadEmail, setLeadEmail] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [emergency, setEmergency] = useState(true);
  const { pushToast } = useAdminStore();

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }, { label: "Notifications" }]}
        title="Notifications"
        description="Preferences for admin alerts. Real delivery is wired up in a later sprint — these toggles store intent only."
        actions={<AdminButton variant="primary" onClick={() => pushToast("success", "Preferences saved.")}>Save</AdminButton>}
      />
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <Toggle label="Email me when a new estimate lead arrives" hint="Delivered to the admin email once the backend is connected." checked={leadEmail} onChange={setLeadEmail} />
        <Toggle label="Weekly summary digest" hint="Enquiry counts and simple traffic trends." checked={weekly} onChange={setWeekly} />
        <Toggle label="Emergency alerts" hint="Site errors or form outages. Wired up in a later sprint." checked={emergency} onChange={setEmergency} />
      </section>
    </>
  );
}

/* ============================================================ */
/* Users                                                         */
/* ============================================================ */

export function SettingsUsersPage() {
  useNoIndex("Users");
  const [users] = useState([
    { id: "u-1", name: "Demo Admin", email: "admin@example.com", role: "Owner", status: "active" },
    { id: "u-2", name: "Demo Editor", email: "editor@example.com", role: "Editor", status: "active" },
    { id: "u-3", name: "Demo Viewer", email: "viewer@example.com", role: "Viewer", status: "inactive" },
  ]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }, { label: "Users" }]}
        title="Admin users"
        description="Future user management. Authentication and real roles will be implemented in the Laravel backend sprint."
        actions={<AdminButton variant="primary" disabled title="Enabled once backend auth is wired">+ Invite user</AdminButton>}
      />
      <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900">
        <strong>No authentication yet.</strong> This UI is a preview of future user management. Do not confuse this with a working auth system — it does not sign anyone in.
      </div>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {u.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">{u.name}</p>
              <p className="text-xs text-slate-500">{u.email}</p>
            </div>
            <span className="text-xs text-slate-600">{u.role}</span>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${u.status === "active" ? "border-emerald-200 bg-emerald-100 text-emerald-800" : "border-slate-200 bg-slate-100 text-slate-700"}`}>{u.status}</span>
            <AdminButton size="sm" variant="ghost" disabled>Edit</AdminButton>
          </li>
        ))}
      </ul>
    </>
  );
}
