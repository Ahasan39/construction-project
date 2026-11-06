import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  ConfirmDialog,
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
import type { HomepageContent } from "../types";

export default function HomepageEditorPage() {
  useNoIndex("Homepage editor");
  const { homepage, setHomepage, pushToast } = useAdminStore();
  const [draft, setDraft] = useState<HomepageContent>(homepage);
  const [errors, setErrors] = useState<Partial<Record<keyof HomepageContent, string>>>({});
  const [resetOpen, setResetOpen] = useState(false);

  function update<K extends keyof HomepageContent>(key: K, value: HomepageContent[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!draft.heroHeading.trim()) e.heroHeading = "Hero heading is required.";
    if (draft.heroHeading.length > 120) e.heroHeading = "Keep the heading under 120 characters.";
    if (!draft.heroDescription.trim()) e.heroDescription = "A short description is required.";
    if (!draft.primaryCtaLabel.trim()) e.primaryCtaLabel = "CTA label is required.";
    if (!draft.primaryCtaHref.trim()) e.primaryCtaHref = "CTA destination is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSave() {
    if (!validate()) {
      pushToast("error", "Please fix the highlighted fields.");
      return;
    }
    setHomepage(draft);
    pushToast("success", "Homepage saved (local demo state).");
  }

  function onDiscard() {
    setDraft(homepage);
    setErrors({});
    setResetOpen(false);
    pushToast("info", "Changes discarded.");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Pages", to: "/admin/pages" }, { label: "Homepage" }]}
        title="Homepage editor"
        description="Edit the public homepage. Changes are kept in local demo state only — the live site is not updated until the Laravel backend sprint is complete."
        actions={
          <>
            <AdminButton variant="ghost" onClick={() => setResetOpen(true)}>Discard</AdminButton>
            <AdminButton variant="outline">Save draft</AdminButton>
            <AdminButton variant="primary" onClick={onSave}>Save & apply (demo)</AdminButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Hero</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Eyebrow">
                {(p) => <TextInput {...p} value={draft.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} maxLength={60} />}
              </FormField>
              <FormField label="Primary CTA label" required error={errors.primaryCtaLabel}>
                {(p) => <TextInput {...p} value={draft.primaryCtaLabel} onChange={(e) => update("primaryCtaLabel", e.target.value)} />}
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Heading" required hint={`${draft.heroHeading.length}/120 characters`} error={errors.heroHeading}>
                  {(p) => <TextInput {...p} value={draft.heroHeading} onChange={(e) => update("heroHeading", e.target.value)} maxLength={140} />}
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Description" required error={errors.heroDescription}>
                  {(p) => <TextArea {...p} value={draft.heroDescription} onChange={(e) => update("heroDescription", e.target.value)} rows={3} />}
                </FormField>
              </div>
              <FormField label="Primary CTA destination" required error={errors.primaryCtaHref}>
                {(p) => <TextInput {...p} value={draft.primaryCtaHref} onChange={(e) => update("primaryCtaHref", e.target.value)} />}
              </FormField>
              <FormField label="Emergency contact banner" hint="Shown as a thin band above the hero.">
                {(p) => <TextInput {...p} value={draft.emergencyBanner} onChange={(e) => update("emergencyBanner", e.target.value)} />}
              </FormField>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Estimate form</h2>
            <FormField label="Estimate form heading">
              {(p) => <TextInput {...p} value={draft.estimateHeading} onChange={(e) => update("estimateHeading", e.target.value)} />}
            </FormField>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Section visibility</h2>
            <div className="space-y-4">
              <Toggle label="Show services strip" hint="The five-service summary below the hero." checked={draft.showServices} onChange={(v) => update("showServices", v)} />
              <Toggle label="Show gallery preview" hint="Three recent published projects." checked={draft.showGallery} onChange={(v) => update("showGallery", v)} />
              <Toggle label="Show testimonials" hint="Customer reviews block." checked={draft.showTestimonials} onChange={(v) => update("showTestimonials", v)} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Hero image</h2>
            <ImagePreview src={draft.heroImage} alt="Homepage hero preview" />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FileInput accept="image/*" onPick={(dataUrl) => update("heroImage", dataUrl)} />
              <AdminButton size="sm" variant="ghost" onClick={() => update("heroImage", "")}>Clear</AdminButton>
            </div>
            <p className="mt-2 text-xs text-slate-500">Previews use an in-memory data URL. Nothing is uploaded until the backend sprint.</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Preview</h2>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#d9232a]">{draft.heroEyebrow || "Eyebrow"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{draft.heroHeading || "Hero heading"}</p>
              <p className="mt-1 text-slate-600">{draft.heroDescription || "Hero description."}</p>
              <div className="mt-3 inline-block rounded-md bg-[#d9232a] px-3 py-1.5 text-xs font-medium text-white">{draft.primaryCtaLabel || "CTA"}</div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Status</h2>
            <FormField label="Display state">
              {(p) => (
                <SelectInput {...p} className={inputCls} defaultValue="published">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </SelectInput>
              )}
            </FormField>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Discard unsaved changes?"
        message="Your edits since the last save will be lost."
        confirmLabel="Discard"
        destructive
        onConfirm={onDiscard}
        onCancel={() => setResetOpen(false)}
      />
    </>
  );
}
