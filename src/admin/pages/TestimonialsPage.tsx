import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import { AdminButton, ConfirmDialog, DataTable, FormField, Modal, PageHeader, SearchFilterBar, TextArea, TextInput, Toggle } from "../components";
import type { AdminTestimonialRow } from "../types";

const empty: AdminTestimonialRow = { id: "", author: "", location: "", rating: 5, quote: "", sampleContent: true };

export default function TestimonialsPage() {
  useNoIndex("Testimonials");
  const { testimonials, setTestimonials, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminTestimonialRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminTestimonialRow | null>(null);

  const filtered = testimonials.filter((t) =>
    t.author.toLowerCase().includes(search.toLowerCase()) || t.quote.toLowerCase().includes(search.toLowerCase())
  );

  function save(row: AdminTestimonialRow) {
    if (!row.author.trim() || !row.quote.trim()) { pushToast("error", "Author and quote are required."); return; }
    if (row.id) setTestimonials(testimonials.map((t) => (t.id === row.id ? row : t)));
    else setTestimonials([...testimonials, { ...row, id: `t-${Date.now()}` }]);
    pushToast("success", row.id ? "Testimonial updated." : "Testimonial added.");
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Testimonials" }]}
        title="Testimonials"
        description="Customer reviews shown on the public reviews page. Entries flagged as sample content are visibly labelled on the site."
        actions={<AdminButton variant="primary" onClick={() => setEditing({ ...empty })}>+ New testimonial</AdminButton>}
      />

      <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <strong>Sample content notice:</strong> all testimonials currently in the system are flagged as sample content. Do not publish fabricated reviews — swap them for authentic, consented customer quotes before launch.
      </div>

      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search testimonials…" />
      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        columns={[
          { key: "author", header: "Author", render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.author}</p>
              <p className="text-xs text-slate-500">{r.location}</p>
            </div>
          )},
          { key: "quote", header: "Quote", render: (r) => <p className="max-w-md text-xs text-slate-700">“{r.quote}”</p> },
          { key: "rating", header: "Rating", render: (r) => <span className="text-sm text-amber-500" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span> },
          { key: "sample", header: "Sample?", render: (r) => <span className={`text-xs ${r.sampleContent ? "text-amber-700" : "text-emerald-700"}`}>{r.sampleContent ? "Sample" : "Authentic"}</span> },
          { key: "actions", header: "", align: "right", render: (r) => (
            <div className="flex items-center justify-end gap-1">
              <AdminButton size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</AdminButton>
              <AdminButton size="sm" variant="ghost" onClick={() => setConfirmDelete(r)}>Delete</AdminButton>
            </div>
          )},
        ]}
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit testimonial" : "New testimonial"}
        size="md"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => save(editing)}>{editing.id ? "Save" : "Create"}</AdminButton>
          </>
        ) : null}
      >
        {editing && (
          <div className="space-y-4">
            <FormField label="Author" required>{(p) => <TextInput {...p} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />}</FormField>
            <FormField label="Location">{(p) => <TextInput {...p} value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />}</FormField>
            <FormField label="Rating (1–5)">{(p) => <TextInput {...p} type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })} />}</FormField>
            <FormField label="Quote" required>{(p) => <TextArea {...p} rows={4} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />}</FormField>
            <Toggle label="Sample content" hint="Mark as sample until an authentic customer quote replaces it." checked={editing.sampleContent} onChange={(v) => setEditing({ ...editing, sampleContent: v })} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete testimonial?"
        message={`Remove the testimonial from “${confirmDelete?.author}”?`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (confirmDelete) { setTestimonials(testimonials.filter((t) => t.id !== confirmDelete.id)); setConfirmDelete(null); pushToast("success", "Deleted."); } }}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
