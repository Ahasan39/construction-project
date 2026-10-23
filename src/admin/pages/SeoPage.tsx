import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
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
import type { SeoPageEntry } from "../types";

export default function SeoPage() {
  useNoIndex("SEO");
  const { seoPages, setSeoPages, globalSeo, setGlobalSeo, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<SeoPageEntry | null>(null);

  const filtered = seoPages.filter((p) =>
    [p.path, p.title].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  function savePage(row: SeoPageEntry) {
    setSeoPages(seoPages.map((p) => (p.path === row.path ? row : p)));
    setEditing(null);
    pushToast("success", `SEO for ${row.path} updated.`);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "SEO" }]}
        title="SEO"
        description="Global SEO defaults and per-page meta. Does not connect to a search engine or submit a sitemap in this sprint — all changes are local demo state."
      />

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Global defaults</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Default title">
            {(p) => <TextInput {...p} value={globalSeo.defaultTitle} onChange={(e) => setGlobalSeo({ ...globalSeo, defaultTitle: e.target.value })} />}
          </FormField>
          <FormField label="Default robots">
            {(p) => <TextInput {...p} value={globalSeo.robots} onChange={(e) => setGlobalSeo({ ...globalSeo, robots: e.target.value })} />}
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Default description" hint="Shown when a page does not provide its own meta description.">
              {(p) => <TextArea {...p} rows={2} value={globalSeo.defaultDescription} onChange={(e) => setGlobalSeo({ ...globalSeo, defaultDescription: e.target.value })} />}
            </FormField>
          </div>
          <FormField label="Default Open Graph image URL">
            {(p) => <TextInput {...p} value={globalSeo.defaultOgImage} onChange={(e) => setGlobalSeo({ ...globalSeo, defaultOgImage: e.target.value })} />}
          </FormField>
          <FormField label="Sitemap URL">
            {(p) => <TextInput {...p} value={globalSeo.sitemapUrl} onChange={(e) => setGlobalSeo({ ...globalSeo, sitemapUrl: e.target.value })} />}
          </FormField>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <AdminButton variant="ghost">Reset defaults</AdminButton>
          <AdminButton variant="primary" onClick={() => pushToast("success", "Global SEO defaults saved.")}>Save defaults</AdminButton>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Per-page SEO</h2>
        <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search page paths…" />
        <DataTable
          rows={filtered}
          rowKey={(r) => r.path}
          columns={[
            { key: "path", header: "Path", sortable: true, sortValue: (r) => r.path, render: (r) => <code className="text-xs text-slate-700">{r.path}</code> },
            { key: "title", header: "Meta title", render: (r) => (
              <div>
                <p className="truncate text-xs text-slate-800">{r.title}</p>
                <p className="text-[10px] text-slate-500">{r.title.length}/60 chars</p>
              </div>
            )},
            { key: "description", header: "Meta description", render: (r) => (
              <div>
                <p className="line-clamp-2 max-w-md text-xs text-slate-600">{r.description}</p>
                <p className="text-[10px] text-slate-500">{r.description.length}/160 chars</p>
              </div>
            )},
            { key: "robots", header: "Index", render: (r) => <StatusBadge status={r.noindex ? "draft" : "published"} /> },
            { key: "actions", header: "", align: "right", render: (r) => <AdminButton size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</AdminButton> },
          ]}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sitemap</p>
          <p className="mt-1 text-sm text-slate-800">Generated on build from staticRoutes().</p>
          <p className="text-xs text-slate-500">Admin paths are excluded.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">robots.txt</p>
          <p className="mt-1 text-sm text-slate-800">Allow public pages, disallow /admin/.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Structured data</p>
          <p className="mt-1 text-sm text-slate-800">LocalBusiness JSON-LD on location pages.</p>
        </div>
      </section>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit SEO: ${editing.path}` : ""}
        size="md"
        footer={editing ? (
          <>
            <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            <AdminButton variant="primary" onClick={() => savePage(editing)}>Save</AdminButton>
          </>
        ) : null}
      >
        {editing && (
          <div className="space-y-4">
            <FormField label="Meta title" hint={`${editing.title.length}/60 characters`}>
              {(p) => <TextInput {...p} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />}
            </FormField>
            <FormField label="Meta description" hint={`${editing.description.length}/160 characters`}>
              {(p) => <TextArea {...p} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />}
            </FormField>
            <FormField label="Canonical URL">
              {(p) => <TextInput {...p} value={editing.canonical} onChange={(e) => setEditing({ ...editing, canonical: e.target.value })} />}
            </FormField>
            <Toggle label="Noindex" hint="Prevents the page from appearing in search results." checked={editing.noindex} onChange={(v) => setEditing({ ...editing, noindex: v })} />
          </div>
        )}
      </Modal>
    </>
  );
}
