import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import { AdminButton, DataTable, FormField, Modal, PageHeader, SearchFilterBar, StatusBadge, TextArea, TextInput, Toggle } from "../components";
import type { AdminLocationRow } from "../types";

export default function LocationsPage() {
  useNoIndex("Locations");
  const { locations, setLocations, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [editing, setEditing] = useState<AdminLocationRow | null>(null);

  const states = Array.from(new Set(locations.map((l) => l.state))).sort();
  const filtered = locations.filter((l) => {
    if (search && !(l.name.toLowerCase().includes(search.toLowerCase()) || l.slug.includes(search))) return false;
    if (stateFilter !== "all" && l.state !== stateFilter) return false;
    return true;
  });

  function save(row: AdminLocationRow) {
    setLocations(locations.map((l) => (l.id === row.id ? row : l)));
    setEditing(null);
    pushToast("success", "Location updated.");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Locations" }]}
        title="Service locations"
        description={`${locations.length} service locations across ${states.length} states. Reuses the live route data.`}
      />
      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search locations…"
        filters={[
          { label: "State", value: stateFilter, onChange: setStateFilter, options: [{ value: "all", label: "All" }, ...states.map((s) => ({ value: s, label: s }))] },
        ]}
      />
      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "Location", sortable: true, sortValue: (r) => r.name, render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.name}, {r.state}</p>
              <p className="text-xs text-slate-500">/{r.slug}</p>
            </div>
          )},
          { key: "region", header: "Region", render: (r) => <span className="text-xs text-slate-600">{r.region}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.published ? "published" : "draft"} /> },
          { key: "seoTitle", header: "SEO title", render: (r) => <p className="max-w-md truncate text-xs text-slate-600" title={r.seoTitle}>{r.seoTitle}</p> },
          { key: "actions", header: "", align: "right", render: (r) => (
            <div className="flex items-center justify-end gap-1">
              <AdminButton size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</AdminButton>
              <a href={`/construction-project/${r.slug}/`} target="_blank" rel="noopener noreferrer">
                <AdminButton size="sm" variant="ghost">Preview</AdminButton>
              </a>
            </div>
          )},
        ]}
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : ""}
        size="md"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => save(editing)}>Save changes</AdminButton>
          </>
        ) : null}
      >
        {editing && (
          <div className="space-y-4">
            <FormField label="City">
              {(p) => <TextInput {...p} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />}
            </FormField>
            <FormField label="State">
              {(p) => <TextInput {...p} value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />}
            </FormField>
            <FormField label="SEO title">
              {(p) => <TextInput {...p} value={editing.seoTitle} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} />}
            </FormField>
            <FormField label="SEO summary">
              {(p) => <TextArea {...p} value={editing.seoSummary} onChange={(e) => setEditing({ ...editing, seoSummary: e.target.value })} rows={3} />}
            </FormField>
            <Toggle label="Published" hint="Unpublished locations stop appearing in the public footer." checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
          </div>
        )}
      </Modal>
    </>
  );
}
