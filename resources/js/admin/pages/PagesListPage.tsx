import { useState } from "react";
import { Link } from "react-router-dom";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import { AdminButton, DataTable, PageHeader, SearchFilterBar, StatusBadge } from "../components";

export default function PagesListPage() {
  useNoIndex("Pages");
  const { pages } = useAdminStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = pages.filter((p) => {
    if (search && !(p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search))) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const types = Array.from(new Set(pages.map((p) => p.type)));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Pages" }]}
        title="Pages"
        description="All website pages. Click a page to edit its content. The homepage editor is the only live editor in this sprint; other page editors are planned."
        actions={<Link to="/admin/pages/homepage"><AdminButton variant="primary">Edit homepage</AdminButton></Link>}
      />

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search pages or slugs…"
        filters={[
          { label: "Type", value: typeFilter, onChange: setTypeFilter, options: [{ value: "all", label: "All" }, ...types.map((t) => ({ value: t, label: t }))] },
          { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [
            { value: "all", label: "All" }, { value: "draft", label: "Draft" }, { value: "published", label: "Published" },
          ]},
        ]}
      />

      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        columns={[
          { key: "title", header: "Title", sortable: true, sortValue: (r) => r.title, render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.title}</p>
              <p className="text-xs text-slate-500">{r.slug}</p>
            </div>
          )},
          { key: "type", header: "Type", sortable: true, sortValue: (r) => r.type, render: (r) => <span className="text-xs text-slate-700">{r.type}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "updated", header: "Last updated", sortable: true, sortValue: (r) => r.updatedAt, render: (r) => <span className="text-xs text-slate-500">{r.updatedAt}</span> },
          { key: "actions", header: "", align: "right", render: (r) => (
            r.slug === "/" ? (
              <Link to="/admin/pages/homepage"><AdminButton size="sm" variant="outline">Edit</AdminButton></Link>
            ) : (
              <AdminButton size="sm" variant="ghost" disabled title="Editor planned for later sprint">Edit</AdminButton>
            )
          )},
        ]}
      />
    </>
  );
}
