import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  ConfirmDialog,
  FileInput,
  FormField,
  ImagePreview,
  Modal,
  PageHeader,
  SearchFilterBar,
  SelectInput,
  StatusBadge,
  TextArea,
  TextInput,
  Toggle,
  inputCls,
} from "../components";
import type { AdminProjectRow } from "../types";

const empty: AdminProjectRow = {
  id: "", title: "", slug: "", category: "Roofing", propertyType: "Residential Home",
  thumbnail: "", summary: "", description: "", published: true, featured: false, order: 999,
};

export default function GalleryPage() {
  useNoIndex("Gallery");
  const { projects, setProjects, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editing, setEditing] = useState<AdminProjectRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminProjectRow | null>(null);

  const categories = Array.from(new Set(projects.map((p) => p.category))).sort();
  const filtered = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  });

  function save(row: AdminProjectRow) {
    if (!row.title.trim()) { pushToast("error", "Title is required."); return; }
    const slug = row.slug.trim() || row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const next = { ...row, slug };
    if (row.id) {
      setProjects(projects.map((p) => (p.id === row.id ? next : p)));
      pushToast("success", "Project updated.");
    } else {
      setProjects([...projects, { ...next, id: `proj-${Date.now()}` }]);
      pushToast("success", "Project added.");
    }
    setEditing(null);
  }

  function remove(row: AdminProjectRow) {
    setProjects(projects.filter((p) => p.id !== row.id));
    setConfirmDelete(null);
    pushToast("success", "Project deleted.");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Projects" }]}
        title="Project gallery"
        description="Manage portfolio projects. Images and content shown here are reused from the live gallery."
        actions={
          <>
            <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5">
              <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} className={`rounded px-2 py-1 text-xs font-medium ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-600"}`}>Grid</button>
              <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={`rounded px-2 py-1 text-xs font-medium ${view === "list" ? "bg-slate-900 text-white" : "text-slate-600"}`}>List</button>
            </div>
            <AdminButton variant="primary" onClick={() => setEditing({ ...empty })}>+ New project</AdminButton>
          </>
        }
      />

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search projects…"
        filters={[
          { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: [{ value: "all", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))] },
        ]}
      />

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <ImagePreview src={p.thumbnail} alt={p.title} />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{p.title}</h3>
                  <StatusBadge status={p.published ? "published" : "draft"} />
                </div>
                <p className="text-xs text-slate-500">{p.category} · {p.propertyType}</p>
                <p className="line-clamp-2 flex-1 text-xs text-slate-600">{p.summary}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">{p.featured ? "Featured" : ""}</span>
                  <div className="flex gap-1">
                    <AdminButton size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => setConfirmDelete(p)}>Delete</AdminButton>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {filtered.map((p) => (
            <li key={p.id} className="flex items-start gap-4 p-4">
              <div className="h-14 w-20 flex-none overflow-hidden rounded border border-slate-200 bg-slate-100">
                {p.thumbnail && <img src={p.thumbnail} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500">{p.category} · {p.propertyType} · /gallery/{p.slug}</p>
              </div>
              <StatusBadge status={p.published ? "published" : "draft"} />
              <div className="flex gap-1">
                <AdminButton size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</AdminButton>
                <AdminButton size="sm" variant="ghost" onClick={() => setConfirmDelete(p)}>Delete</AdminButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit project` : "New project"}
        size="lg"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => save(editing)}>{editing.id ? "Save changes" : "Create project"}</AdminButton>
          </>
        ) : null}
      >
        {editing && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Title" required>
                {(p) => <TextInput {...p} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />}
              </FormField>
            </div>
            <FormField label="Slug" hint="Auto-generated from title if left blank.">
              {(p) => <TextInput {...p} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />}
            </FormField>
            <FormField label="Category">
              {(p) => (
                <SelectInput {...p} className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {["Roofing", "Siding", "Windows", "Gutters", "Masonry"].map((c) => <option key={c}>{c}</option>)}
                </SelectInput>
              )}
            </FormField>
            <FormField label="Property type">
              {(p) => <TextInput {...p} value={editing.propertyType} onChange={(e) => setEditing({ ...editing, propertyType: e.target.value })} />}
            </FormField>
            <FormField label="Display order">
              {(p) => <TextInput {...p} type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />}
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Project summary">
                {(p) => <TextArea {...p} rows={2} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />}
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Project description">
                {(p) => <TextArea {...p} rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />}
              </FormField>
            </div>
            <div className="md:col-span-2">
              <p className="mb-1.5 block text-sm font-medium text-slate-800">Primary image</p>
              <ImagePreview src={editing.thumbnail} alt="Project preview" />
              <div className="mt-2 flex gap-2">
                <FileInput accept="image/*" onPick={(dataUrl) => setEditing({ ...editing, thumbnail: dataUrl })} />
                <AdminButton size="sm" variant="ghost" onClick={() => setEditing({ ...editing, thumbnail: "" })}>Clear</AdminButton>
              </div>
            </div>
            <Toggle label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <Toggle label="Featured on homepage" checked={editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete project?"
        message={`“${confirmDelete?.title}” will be removed from the mock gallery list.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
