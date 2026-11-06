import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  ConfirmDialog,
  DataTable,
  FormField,
  Modal,
  PageHeader,
  SearchFilterBar,
  SelectInput,
  StatusBadge,
  TextArea,
  TextInput,
  inputCls,
} from "../components";
import type { AdminBlogRow } from "../types";

const empty: AdminBlogRow = { id: "", title: "", slug: "", excerpt: "", author: "Mr. Roof Team", status: "draft", publishedAt: "" };

export default function BlogPage() {
  useNoIndex("Blog");
  const { blogPosts, setBlogPosts, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<AdminBlogRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminBlogRow | null>(null);

  const filtered = blogPosts.filter((b) => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  function save(row: AdminBlogRow) {
    if (!row.title.trim()) { pushToast("error", "Title is required."); return; }
    const slug = row.slug.trim() || row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const next = { ...row, slug };
    if (row.id) setBlogPosts(blogPosts.map((b) => (b.id === row.id ? next : b)));
    else setBlogPosts([...blogPosts, { ...next, id: `blog-${Date.now()}` }]);
    pushToast("success", row.id ? "Post updated." : "Post created.");
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Blog" }]}
        title="Blog posts"
        description="Manage blog articles. All entries shown are clearly marked as sample content for Sprint 6.1."
        actions={<AdminButton variant="primary" onClick={() => setEditing({ ...empty })}>+ New post</AdminButton>}
      />
      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search posts…"
        filters={[
          { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [
            { value: "all", label: "All" }, { value: "draft", label: "Draft" }, { value: "published", label: "Published" },
          ] },
        ]}
      />
      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        columns={[
          { key: "title", header: "Title", sortable: true, sortValue: (r) => r.title, render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.title}</p>
              <p className="text-xs text-slate-500">/blog/{r.slug}</p>
            </div>
          )},
          { key: "author", header: "Author", render: (r) => <span className="text-xs text-slate-600">{r.author}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "published", header: "Published", render: (r) => <span className="text-xs text-slate-500">{r.publishedAt || "—"}</span> },
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
        title={editing?.id ? "Edit blog post" : "New blog post"}
        size="lg"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => save(editing)}>{editing.id ? "Save" : "Create"}</AdminButton>
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
            <FormField label="Slug">{(p) => <TextInput {...p} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />}</FormField>
            <FormField label="Author">{(p) => <TextInput {...p} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />}</FormField>
            <div className="md:col-span-2">
              <FormField label="Excerpt" hint="A short summary shown on the blog index.">
                {(p) => <TextArea {...p} rows={3} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />}
              </FormField>
            </div>
            <FormField label="Status">
              {(p) => (
                <SelectInput {...p} className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AdminBlogRow["status"] })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </SelectInput>
              )}
            </FormField>
            <FormField label="Publish date">{(p) => <TextInput {...p} type="date" value={editing.publishedAt} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} />}</FormField>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete blog post?"
        message={`“${confirmDelete?.title}” will be removed from the mock list.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (confirmDelete) { setBlogPosts(blogPosts.filter((b) => b.id !== confirmDelete.id)); setConfirmDelete(null); pushToast("success", "Post deleted."); } }}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
