import { NavLink } from "react-router-dom";

interface NavEntry { to: string; label: string; icon: string; }
interface NavGroup { heading: string; items: NavEntry[]; }

const groups: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: "M3 12l9-9 9 9M4 10v10h5v-6h6v6h5V10" }],
  },
  {
    heading: "Content",
    items: [
      { to: "/admin/pages", label: "Pages", icon: "M4 4h12l4 4v12H4z M14 4v4h4" },
      { to: "/admin/services", label: "Services", icon: "M4 7h16M4 12h16M4 17h10" },
      { to: "/admin/locations", label: "Locations", icon: "M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z M12 11a2 2 0 100-4 2 2 0 000 4z" },
      { to: "/admin/gallery", label: "Projects", icon: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z" },
      { to: "/admin/blog", label: "Blog", icon: "M5 4h14v16H5z M8 8h8M8 12h8M8 16h5" },
      { to: "/admin/testimonials", label: "Testimonials", icon: "M5 7h14v10H9l-4 4z" },
      { to: "/admin/navigation", label: "Navigation", icon: "M4 7h16M4 12h16M4 17h16" },
    ],
  },
  {
    heading: "Growth",
    items: [
      { to: "/admin/leads", label: "Estimate leads", icon: "M4 6h16v12H4z M4 6l8 7 8-7" },
      { to: "/admin/seo", label: "SEO", icon: "M11 4a7 7 0 100 14 7 7 0 000-14z M20 20l-4-4" },
      { to: "/admin/marketing", label: "Marketing", icon: "M3 11l18-7v16L3 13z M3 11v2" },
    ],
  },
  {
    heading: "Settings",
    items: [
      { to: "/admin/settings/general", label: "General", icon: "M12 8v4l3 2M12 2a10 10 0 100 20 10 10 0 000-20z" },
      { to: "/admin/settings/branding", label: "Branding", icon: "M4 4h16v16H4z M4 10h16M10 4v16" },
      { to: "/admin/settings/contact", label: "Contact", icon: "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7l.7 3.4a2 2 0 01-.6 2L7.9 10.6a16 16 0 006 6l1.5-1.3a2 2 0 012-.6l3.4.7a2 2 0 011.7 2z" },
      { to: "/admin/settings/notifications", label: "Notifications", icon: "M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5 M9 17a3 3 0 006 0" },
      { to: "/admin/settings/users", label: "Users", icon: "M16 11a4 4 0 10-8 0 4 4 0 008 0z M3 21v-1a7 7 0 0114 0v1" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-900/40 bg-[#0f2231] text-slate-100 shadow-xl transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-[#d9232a] text-sm font-bold text-white shadow-sm">MR</div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Mr. Roof</p>
              <p className="text-sm font-semibold">Admin CMS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-300 hover:bg-slate-700/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:hidden"
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav id="admin-sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sections">
          {groups.map((group) => (
            <div key={group.heading} className="mb-5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400/80">{group.heading}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/admin"}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
                          isActive
                            ? "bg-[#d9232a] text-white shadow-sm"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            aria-hidden="true"
                            className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full transition-opacity ${isActive ? "bg-white opacity-100" : "opacity-0"}`}
                          />
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            className={`h-[18px] w-[18px] flex-none transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"}`}
                          >
                            <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-700/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">AD</div>
            <div className="min-w-0 flex-1 text-xs leading-tight">
              <p className="truncate font-semibold text-slate-100">Admin user</p>
              <p className="truncate text-slate-400">Sprint 6.2 — demo</p>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300" title="No real auth yet">Mock</span>
          </div>
        </div>
      </aside>
    </>
  );
}
