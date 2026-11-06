import { Link } from "react-router-dom";
import { useNoIndex } from "../useNoIndex";
import { useAdminStore } from "../store";
import { AdminButton, PageHeader, StatCard, StatusBadge } from "../components";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  useNoIndex("Dashboard");
  const { leads, locations, services, integrations } = useAdminStore();
  const newLeads = leads.filter((l) => l.status === "new");
  const publishedPages = 10;
  const configuredIntegrations = Object.values(integrations).filter((i) => i.status === "configured").length;

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Overview of your website content, enquiries, and marketing setup. All numbers below are demonstration data — not live analytics."
        actions={
          <>
            <Link to="/admin/pages/homepage"><AdminButton variant="outline">Edit homepage</AdminButton></Link>
            <Link to="/admin/gallery"><AdminButton variant="primary">+ Add project</AdminButton></Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total enquiries"
          value={leads.length}
          hint="All-time demo total"
          tone="accent"
          icon={<Icon d="M4 6h16v12H4z M4 6l8 7 8-7" />}
        />
        <StatCard
          label="New / unread"
          value={newLeads.length}
          hint="Awaiting first contact"
          tone="warning"
          icon={<Icon d="M12 2v4 M12 18v4 M4.9 4.9l2.8 2.8 M16.3 16.3l2.8 2.8 M2 12h4 M18 12h4 M4.9 19.1l2.8-2.8 M16.3 7.7l2.8-2.8" />}
        />
        <StatCard
          label="Published pages"
          value={publishedPages}
          hint={`${services.length} services · ${locations.length} locations`}
          icon={<Icon d="M4 4h12l4 4v12H4z M14 4v4h4" />}
        />
        <StatCard
          label="Marketing configured"
          value={`${configuredIntegrations}/4`}
          hint="Pixel · GTM · GA4 · SC"
          tone="success"
          icon={<Icon d="M3 11l18-7v16L3 13z" />}
        /></div>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent enquiries</h2>
              <p className="text-xs text-slate-500">Demo data — not connected to a backend yet.</p>
            </div>
            <Link to="/admin/leads" className="text-xs font-medium text-sky-700 hover:underline">View all →</Link>
          </header>
          <ul className="divide-y divide-slate-100">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-start gap-3 py-3">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {l.name.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{l.name}</p>
                  <p className="truncate text-xs text-slate-500">{l.service} · {l.location} · {l.submittedAt}</p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Website setup</h2>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Brand identity", done: true },
                { label: "Service pages", done: true },
                { label: "Location pages", done: true },
                { label: "Project gallery", done: true },
                { label: "Marketing integrations", done: configuredIntegrations > 0 },
                { label: "Legal pages", done: true },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-700">{row.label}</span>
                  <span className={`text-xs font-medium ${row.done ? "text-emerald-700" : "text-amber-700"}`}>
                    {row.done ? "Complete" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Quick actions</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/admin/pages/homepage" className="text-sky-700 hover:underline">Edit homepage content</Link></li>
              <li><Link to="/admin/gallery" className="text-sky-700 hover:underline">Add a project to the gallery</Link></li>
              <li><Link to="/admin/leads" className="text-sky-700 hover:underline">Review new enquiries</Link></li>
              <li><Link to="/admin/settings/contact" className="text-sky-700 hover:underline">Update contact details</Link></li>
              <li><Link to="/admin/marketing" className="text-sky-700 hover:underline">Configure marketing integrations</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Sprint 6.1 reminder.</strong> This admin area uses local in-memory mock state. Nothing persists across page reloads, no public-website content is changed by edits here, and no real tracking scripts load. Backend wiring (Laravel + MySQL) is scheduled for a later sprint.
      </section>
    </>
  );
}
