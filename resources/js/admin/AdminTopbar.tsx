import { useLocation } from "react-router-dom";

interface Props {
  onOpenNav: () => void;
  navOpen?: boolean;
}

const titleMap: Array<{ match: RegExp; title: string }> = [
  { match: /^\/admin\/?$/, title: "Dashboard" },
  { match: /^\/admin\/pages\/homepage$/, title: "Homepage editor" },
  { match: /^\/admin\/pages$/, title: "Pages" },
  { match: /^\/admin\/services$/, title: "Services" },
  { match: /^\/admin\/locations$/, title: "Locations" },
  { match: /^\/admin\/gallery$/, title: "Project gallery" },
  { match: /^\/admin\/blog$/, title: "Blog" },
  { match: /^\/admin\/testimonials$/, title: "Testimonials" },
  { match: /^\/admin\/navigation$/, title: "Navigation" },
  { match: /^\/admin\/leads$/, title: "Estimate leads" },
  { match: /^\/admin\/seo$/, title: "SEO" },
  { match: /^\/admin\/marketing$/, title: "Marketing" },
  { match: /^\/admin\/settings\/general$/, title: "General settings" },
  { match: /^\/admin\/settings\/branding$/, title: "Branding" },
  { match: /^\/admin\/settings\/contact$/, title: "Contact" },
  { match: /^\/admin\/settings\/notifications$/, title: "Notifications" },
  { match: /^\/admin\/settings\/users$/, title: "Users" },
];

function routeTitle(pathname: string): string {
  const match = titleMap.find((row) => row.match.test(pathname));
  return match ? match.title : "Admin";
}

export function AdminTopbar({ onOpenNav, navOpen = false }: Props) {
  const { pathname } = useLocation();
  const title = routeTitle(pathname);

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          id="admin-nav-trigger"
          type="button"
          onClick={onOpenNav}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] lg:hidden"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="admin-sidebar-nav"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
        </button>

        <div className="min-w-0 flex-shrink-0 lg:flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 lg:text-base">{title}</p>
        </div>

        <label className="relative ml-auto hidden min-w-0 flex-1 sm:block sm:max-w-sm">
          <span className="sr-only">Quick search</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"><path d="M11 4a7 7 0 100 14 7 7 0 000-14z M20 20l-4-4" strokeLinecap="round" /></svg>
          <input
            type="search"
            placeholder="Search admin…"
            className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-focus)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5 M9 17a3 3 0 006 0" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="absolute right-1.5 top-1.5 inline-block h-2 w-2 rounded-full bg-[#d9232a] ring-2 ring-white" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] sm:inline-flex"
            aria-label="Help"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 4 M12 17v.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="ml-2 hidden items-center gap-2 border-l border-slate-200 pl-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2231] text-xs font-semibold text-white">MR</div>
            <div className="text-xs leading-tight">
              <p className="font-semibold text-slate-800">Admin user</p>
              <p className="text-slate-500">Demo session</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
