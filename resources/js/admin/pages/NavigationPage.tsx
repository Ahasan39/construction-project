import { useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import { AdminButton, FormField, Modal, PageHeader, SelectInput, TextInput, inputCls } from "../components";
import type { NavItemRow } from "../types";

const empty: NavItemRow = { id: "", label: "", to: "", group: "primary" };

const groupLabels: Record<NavItemRow["group"], string> = {
  primary: "Header — primary nav",
  about: "Header — About dropdown",
  "footer-services": "Footer — Services",
  "footer-service-areas": "Footer — Service areas",
  "footer-resources": "Footer — Resources",
  "footer-company": "Footer — Company",
};

export default function NavigationPage() {
  useNoIndex("Navigation");
  const { navItems, setNavItems, contact, setContact, pushToast } = useAdminStore();
  const [editing, setEditing] = useState<NavItemRow | null>(null);
  const [credit, setCredit] = useState("Qorvin IT");

  function save(row: NavItemRow) {
    if (!row.label.trim() || !row.to.trim()) { pushToast("error", "Label and destination are required."); return; }
    if (row.id) setNavItems(navItems.map((n) => (n.id === row.id ? row : n)));
    else setNavItems([...navItems, { ...row, id: `nav-${Date.now()}` }]);
    pushToast("success", "Navigation updated.");
    setEditing(null);
  }

  const groups: NavItemRow["group"][] = ["primary", "about", "footer-services", "footer-service-areas", "footer-resources", "footer-company"];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Navigation" }]}
        title="Navigation & footer"
        description="Edit header links, the About dropdown, and the footer. Credits and footer contact information are configured here."
        actions={<AdminButton variant="primary" onClick={() => setEditing({ ...empty })}>+ New link</AdminButton>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">{groupLabels[group]}</h2>
              <AdminButton size="sm" variant="outline" onClick={() => setEditing({ ...empty, group })}>+ Link</AdminButton>
            </header>
            <ul className="divide-y divide-slate-100">
              {navItems.filter((n) => n.group === group).map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{n.label}</p>
                    <p className="truncate text-xs text-slate-500">{n.to}</p>
                  </div>
                  <div className="flex gap-1">
                    <AdminButton size="sm" variant="ghost" onClick={() => setEditing(n)}>Edit</AdminButton>
                    <AdminButton size="sm" variant="ghost" onClick={() => { setNavItems(navItems.filter((x) => x.id !== n.id)); pushToast("success", "Link removed."); }}>Remove</AdminButton>
                  </div>
                </li>
              ))}
              {navItems.filter((n) => n.group === group).length === 0 && <li className="py-2 text-xs text-slate-500">No links yet.</li>}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Footer identity</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Primary phone (footer)">
            {(p) => <TextInput {...p} value={contact.primaryPhone} onChange={(e) => setContact({ ...contact, primaryPhone: e.target.value })} />}
          </FormField>
          <FormField label="Email (footer)">
            {(p) => <TextInput {...p} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />}
          </FormField>
          <FormField label="Developer / company credit" hint="Shown as a small credit line in the footer.">
            {(p) => <TextInput {...p} value={credit} onChange={(e) => setCredit(e.target.value)} />}
          </FormField>
        </div>
        <div className="mt-4 flex justify-end">
          <AdminButton variant="primary" onClick={() => pushToast("success", "Footer identity saved.")}>Save footer</AdminButton>
        </div>
      </section>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit link" : "New link"}
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
            <FormField label="Label" required>{(p) => <TextInput {...p} value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} />}</FormField>
            <FormField label="Destination" required hint="Internal path (e.g. /financing) or absolute URL.">{(p) => <TextInput {...p} value={editing.to} onChange={(e) => setEditing({ ...editing, to: e.target.value })} />}</FormField>
            <FormField label="Group">
              {(p) => (
                <SelectInput {...p} className={inputCls} value={editing.group} onChange={(e) => setEditing({ ...editing, group: e.target.value as NavItemRow["group"] })}>
                  {groups.map((g) => <option key={g} value={g}>{groupLabels[g]}</option>)}
                </SelectInput>
              )}
            </FormField>
          </div>
        )}
      </Modal>
    </>
  );
}
