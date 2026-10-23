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
  StatusBadge,
  TextArea,
  TextInput,
  Toggle,
} from "../components";
import type { AdminServiceRow } from "../types";

const empty: AdminServiceRow = {
  id: "", name: "", slug: "", description: "", thumbnail: "", active: true, order: 999,
};

export default function ServicesPage() {
  useNoIndex("Services");
  const { services, setServices, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminServiceRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminServiceRow | null>(null);

  const filtered = services.filter((s) =>
    [s.name, s.slug].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  function save(row: AdminServiceRow) {
    if (!row.name.trim() || !row.slug.trim()) {
      pushToast("error", "Name and slug are required.");
      return;
    }
    if (row.id) {
      setServices(services.map((s) => (s.id === row.id ? row : s)));
      pushToast("success", "Service updated.");
    } else {
      setServices([...services, { ...row, id: `svc-${Date.now()}` }]);
      pushToast("success", "Service added.");
    }
    setEditing(null);
  }

  function remove(row: AdminServiceRow) {
    setServices(services.filter((s) => s.id !== row.id));
    setConfirmDelete(null);
    pushToast("success", "Service removed.");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Services" }]}
        title="Services"
        description="Public service categories. Reflects the live site taxonomy: Roofing, Gutters, Siding, Windows, Masonry."
        actions={<AdminButton variant="primary" onClick={() => setEditing({ ...empty })}>+ New service</AdminButton>}
      />
      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search services…" />
      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        columns={[
          { key: "order", header: "#", width: "60px", sortable: true, sortValue: (r) => r.order, render: (r) => <span className="text-slate-500">{r.order}</span> },
          { key: "name", header: "Name", sortable: true, sortValue: (r) => r.name, render: (r) => (
            <div className="flex items-start gap-3">
              <div className="h-10 w-14 flex-none rounded border border-slate-200 bg-slate-100" aria-hidden="true" />
              <div>
                <p className="font-medium text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">/{r.slug}</p>
              </div>
            </div>
          )},
          { key: "description", header: "Description", render: (r) => <p className="max-w-sm text-xs text-slate-600">{r.description}</p> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.active ? "active" : "inactive"} /> },
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
        title={editing?.id ? `Edit ${editing.name}` : "New service"}
        description="Public services are keyed on their slug. Keep slugs URL-safe (lowercase, hyphens)."
        size="md"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => save(editing)}>{editing.id ? "Save changes" : "Create service"}</AdminButton>
          </>
        ) : null}
      >
        {editing && (
          <div className="space-y-4">
            <FormField label="Service name" required>
              {(p) => <TextInput {...p} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />}
            </FormField>
            <FormField label="Slug" required hint="URL segment. Example: metal-roofing">
              {(p) => <TextInput {...p} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.replace(/[^a-z0-9-]/gi, "-").toLowerCase() })} />}
            </FormField>
            <FormField label="Description">
              {(p) => <TextArea {...p} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />}
            </FormField>
            <FormField label="Display order" hint="Lower numbers appear first.">
              {(p) => <TextInput {...p} type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />}
            </FormField>
            <Toggle label="Active" hint="Inactive services are hidden on the public site." checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete service?"
        message={`Remove “${confirmDelete?.name}” from the mock service list? Public pages are not affected until backend wiring.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => confirmDelete && remove(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
