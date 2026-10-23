import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------------- */
/* Breadcrumbs & PageHeader                                                   */
/* ------------------------------------------------------------------------- */

export interface Crumb { label: string; to?: string; }

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="hover:text-slate-800">{c.label}</Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "font-medium text-slate-700" : ""}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface PageHeaderProps {
  crumbs?: Crumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ crumbs, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:justify-end">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* StatCard                                                                   */
/* ------------------------------------------------------------------------- */

export interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "accent" | "success" | "warning";
  icon?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string };
}

export function StatCard({ label, value, hint, tone = "default", icon, trend }: StatCardProps) {
  const toneRing = {
    default: "ring-slate-200",
    accent: "ring-sky-200",
    success: "ring-emerald-200",
    warning: "ring-amber-200",
  }[tone];
  const iconBg = {
    default: "bg-slate-100 text-slate-700",
    accent: "bg-sky-100 text-sky-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  }[tone];
  const trendCls = trend ? (trend.direction === "up" ? "text-emerald-700" : trend.direction === "down" ? "text-red-600" : "text-slate-500") : "";
  return (
    <div className={`rounded-xl bg-white p-4 shadow-sm ring-1 sm:p-5 ${toneRing}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl">{value}</p>
        </div>
        {icon && (
          <div className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${iconBg}`}>{icon}</div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        {hint && <p className="text-slate-500">{hint}</p>}
        {trend && <p className={`font-medium ${trendCls}`}>{trend.direction === "up" ? "▲" : trend.direction === "down" ? "▼" : "—"} {trend.label}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* StatusBadge                                                                */
/* ------------------------------------------------------------------------- */

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-800 border-emerald-200",
    draft: "bg-amber-100 text-amber-800 border-amber-200",
    scheduled: "bg-sky-100 text-sky-800 border-sky-200",
    configured: "bg-emerald-100 text-emerald-800 border-emerald-200",
    not_configured: "bg-slate-100 text-slate-700 border-slate-200",
    new: "bg-sky-100 text-sky-800 border-sky-200",
    contacted: "bg-indigo-100 text-indigo-800 border-indigo-200",
    quoted: "bg-amber-100 text-amber-800 border-amber-200",
    won: "bg-emerald-100 text-emerald-800 border-emerald-200",
    lost: "bg-slate-200 text-slate-700 border-slate-300",
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inactive: "bg-slate-100 text-slate-700 border-slate-200",
  };
  const label = status.replace(/_/g, " ");
  const cls = map[status] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------------- */
/* FormField                                                                  */
/* ------------------------------------------------------------------------- */

export interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
}

export function FormField({ label, hint, error, required, children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required && <span className="ml-0.5 text-[#d9232a]" aria-hidden="true">*</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": !!error })}
      {hint && !error && <p id={hintId} className="text-xs text-slate-500">{hint}</p>}
      {error && <p id={errId} className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const inputCls =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-500";

/* ------------------------------------------------------------------------- */
/* SearchFilterBar                                                            */
/* ------------------------------------------------------------------------- */

export interface Filter {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SearchFilterBar({
  search,
  onSearch,
  placeholder = "Search…",
  filters = [],
  children,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  filters?: Filter[];
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
      <label className="relative min-w-[200px] flex-1 sm:basis-64">
        <span className="sr-only">Search</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"><path d="M11 4a7 7 0 100 14 7 7 0 000-14z M20 20l-4-4" strokeLinecap="round" /></svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          type="search"
          className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:border-[var(--color-focus)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
      </label>
      {filters.map((f) => (
        <label key={f.label} className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
          <span className="whitespace-nowrap font-medium text-slate-700">{f.label}</span>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="h-9 min-w-0 max-w-[180px] rounded-md border border-slate-200 bg-white px-2 text-sm focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      ))}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* DataTable (header + body wrapper)                                          */
/* ------------------------------------------------------------------------- */

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  width?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  emptyState,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  emptyState?: ReactNode;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (sortDir === "asc" ? 1 : -1);
    });
    return copy;
  }, [rows, columns, sortKey, sortDir]);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  if (rows.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-2.5 text-${c.align ?? "left"}`}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.sortable ? (
                    <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]">
                      {c.header}
                      <span aria-hidden="true" className="text-slate-400">
                        {sortKey === c.key ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </button>
                  ) : c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((row) => (
              <tr key={rowKey(row)} className="transition-colors motion-reduce:transition-none hover:bg-slate-50/80">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 text-${c.align ?? "left"} align-middle`}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* EmptyState                                                                 */
/* ------------------------------------------------------------------------- */

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode; }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6"><path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" /></svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Modal (Confirm / Editor)                                                   */
/* ------------------------------------------------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;
  const sizeCls = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        className={`relative w-full ${sizeCls} max-h-[92dvh] rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 focus:outline-none sm:rounded-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        {children && <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>}
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <AdminButton variant="ghost" onClick={onCancel}>Cancel</AdminButton>
          <AdminButton variant={destructive ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</AdminButton>
        </>
      }
    >
      <p className="text-sm text-slate-700">{message}</p>
    </Modal>
  );
}

/* ------------------------------------------------------------------------- */
/* AdminButton                                                                */
/* ------------------------------------------------------------------------- */

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
  children: ReactNode;
}

export function AdminButton({ variant = "primary", size = "md", className = "", children, type = "button", ...rest }: AdminButtonProps) {
  const variantCls = {
    primary: "bg-[#d9232a] text-white hover:bg-[#b81b22] disabled:opacity-60",
    secondary: "bg-[#0f2231] text-white hover:bg-[#17334a] disabled:opacity-60",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-60",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60",
  }[variant];
  const sizeCls = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm" }[size];
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${variantCls} ${sizeCls} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* IntegrationCard                                                            */
/* ------------------------------------------------------------------------- */

export interface IntegrationCardProps {
  provider: string;
  purpose: string;
  initial: string;
  status: "not_configured" | "draft" | "configured";
  savedAt: string | null;
  onConfigure: () => void;
}

export function IntegrationCard({ provider, purpose, initial, status, savedAt, onConfigure }: IntegrationCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">{initial}</div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">{provider}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{purpose}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={status} />
        <span className="text-xs text-slate-500">{savedAt ? `Saved ${savedAt}` : "Not saved"}</span>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <AdminButton size="sm" variant="outline" onClick={onConfigure}>
          {status === "not_configured" ? "Configure" : "Edit"}
        </AdminButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* ImagePreview                                                               */
/* ------------------------------------------------------------------------- */

export function ImagePreview({
  src,
  alt,
  onPick,
  aspect = "video",
}: {
  src: string;
  alt: string;
  onPick?: () => void;
  aspect?: "video" | "square";
}) {
  const aspectCls = aspect === "square" ? "aspect-square" : "aspect-video";
  return (
    <div className={`relative ${aspectCls} w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100`}>
      {src ? (
        // Preview tag: no cache busting, no CORS. Alt is required.
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">No image selected</div>
      )}
      {onPick && (
        <button
          type="button"
          onClick={onPick}
          className="absolute bottom-2 right-2 rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-800 shadow hover:bg-white"
        >
          Choose image
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Toggle                                                                     */
/* ------------------------------------------------------------------------- */

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-800">{label}</label>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 ${
          checked ? "bg-[#d9232a]" : "bg-slate-300"
        }`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Pagination (simple page selector)                                          */
/* ------------------------------------------------------------------------- */

export function Pagination({ page, pageSize, total, onPageChange }: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void; }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
      <span>Showing page {page} of {pages} — {total} total</span>
      <div className="flex items-center gap-1">
        <AdminButton size="sm" variant="outline" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>Previous</AdminButton>
        <AdminButton size="sm" variant="outline" onClick={() => onPageChange(Math.min(pages, page + 1))} disabled={page === pages}>Next</AdminButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Textarea / Input helper wrappers that forward handlers                      */
/* ------------------------------------------------------------------------- */

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${inputCls} ${className}`} {...rest} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${inputCls} min-h-[90px] ${className}`} {...rest} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return <select className={`${inputCls} ${className}`} {...rest}>{children}</select>;
}

/* ------------------------------------------------------------------------- */
/* FileInput — in-memory preview only                                         */
/* ------------------------------------------------------------------------- */

export function FileInput({ accept, onPick }: { accept?: string; onPick: (dataUrl: string, file: File) => void; }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>Choose file</span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onPick(String(reader.result), file);
          reader.readAsDataURL(file);
          // allow re-selecting the same file
          e.target.value = "";
        }}
      />
    </label>
  );
}
