import { useMemo, useState } from "react";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import {
  AdminButton,
  DataTable,
  Modal,
  PageHeader,
  Pagination,
  SearchFilterBar,
  SelectInput,
  StatusBadge,
  inputCls,
} from "../components";
import type { AdminLead, LeadStatus } from "../types";

const statusOptions: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function LeadsPage() {
  useNoIndex("Estimate leads");
  const { leads, setLeadStatus, services, pushToast } = useAdminStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [location, setLocation] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<AdminLead | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => leads.filter((l) => {
    if (search && !(l.name.toLowerCase().includes(search.toLowerCase()) || l.email.includes(search))) return false;
    if (status !== "all" && l.status !== status) return false;
    if (service !== "all" && l.service !== service) return false;
    if (location !== "all" && l.location !== location) return false;
    return true;
  }), [leads, search, status, service, location]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function updateStatus(id: string, next: LeadStatus) {
    setLeadStatus(id, next);
    pushToast("success", `Lead status set to ${next}.`);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Estimate leads" }]}
        title="Estimate leads"
        description="Enquiries from the public Free Estimate form. All rows are demo data — the real lead-submission backend is not yet connected."
      />

      <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 p-3 text-xs text-sky-900">
        <strong>Demo data:</strong> this list is not connected to a real backend. In production, leads will be stored in MySQL and this UI will read from the Laravel API.
      </div>

      <SearchFilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search by name or email…"
        filters={[
          { label: "Status", value: status, onChange: setStatus, options: statusOptions.map((o) => ({ value: o.value as string, label: o.label })) },
          { label: "Service", value: service, onChange: setService, options: [{ value: "all", label: "All" }, ...services.map((s) => ({ value: s.name, label: s.name }))] },
          { label: "Location", value: location, onChange: setLocation, options: [{ value: "all", label: "All" }, ...Array.from(new Set(leads.map((l) => l.location))).map((l) => ({ value: l, label: l }))] },
        ]}
      />

      {/* Mobile: compact card list (replaces the horizontal table). */}
      <ul className="space-y-2 sm:hidden" role="list" aria-label="Estimate leads">
        {paged.map((r) => (
          <li key={r.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{r.name}</p>
                <p className="truncate text-xs text-slate-500">{r.email}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-600">
              <div><dt className="sr-only">Service</dt><dd>{r.service}</dd></div>
              <div><dt className="sr-only">Location</dt><dd>{r.location}</dd></div>
              <div className="col-span-2 text-slate-500">{r.submittedAt}</div>
            </dl>
            <div className="mt-2 flex justify-end">
              <AdminButton size="sm" variant="outline" onClick={() => setOpen(r)}>View</AdminButton>
            </div>
          </li>
        ))}
        {paged.length === 0 && <li className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No matching leads.</li>}
      </ul>

      {/* ≥sm: full data table. */}
      <div className="hidden sm:block">
      <DataTable
        rows={paged}
        rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "Name", sortable: true, sortValue: (r) => r.name, render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.name}</p>
              <p className="text-xs text-slate-500">{r.email}</p>
            </div>
          )},
          { key: "service", header: "Service", render: (r) => <span className="text-xs text-slate-700">{r.service}</span> },
          { key: "location", header: "Location", render: (r) => <span className="text-xs text-slate-700">{r.location}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "submitted", header: "Submitted", sortable: true, sortValue: (r) => r.submittedAt, render: (r) => <span className="text-xs text-slate-500">{r.submittedAt}</span> },
          { key: "actions", header: "", align: "right", render: (r) => <AdminButton size="sm" variant="outline" onClick={() => setOpen(r)}>View</AdminButton> },
        ]}
      />
      </div>
      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? open.name : ""}
        description={open ? `Enquiry ${open.id} — ${open.submittedAt}` : undefined}
        size="md"
        footer={open ? (
          <>
            <a href={`mailto:${open.email}`}><AdminButton size="sm" variant="outline">Email</AdminButton></a>
            <a href={`tel:${open.phone.replace(/\s/g, "")}`}><AdminButton size="sm" variant="outline">Call</AdminButton></a>
            <AdminButton variant="primary" onClick={() => setOpen(null)}>Close</AdminButton>
          </>
        ) : null}
      >
        {open && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Phone</p>
                <p className="text-slate-800">{open.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Service</p>
                <p className="text-slate-800">{open.service}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Location</p>
                <p className="text-slate-800">{open.location}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Status</p>
                <SelectInput className={`${inputCls} mt-1`} value={open.status} onChange={(e) => updateStatus(open.id, e.target.value as LeadStatus)}>
                  {statusOptions.filter((s) => s.value !== "all").map((s) => <option key={s.value} value={s.value as string}>{s.label}</option>)}
                </SelectInput>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Message</p>
              <p className="whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-800">{open.message}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
