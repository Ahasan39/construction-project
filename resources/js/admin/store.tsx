import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  initialBlogPosts,
  initialBranding,
  initialContact,
  initialGeneralSettings,
  initialGlobalSeo,
  initialHomepage,
  initialIntegrations,
  initialLeads,
  initialLocations,
  initialNav,
  initialPages,
  initialProjects,
  initialSeoPages,
  initialServices,
  initialTestimonials,
} from "./mockData";
import type {
  AdminBlogRow,
  AdminLead,
  AdminLocationRow,
  AdminPageRow,
  AdminProjectRow,
  AdminServiceRow,
  AdminTestimonialRow,
  BrandingSettings,
  ContactSettings,
  GeneralSettings,
  GlobalSeo,
  HomepageContent,
  IntegrationState,
  LeadStatus,
  NavItemRow,
  SeoPageEntry,
} from "./types";

interface Toast {
  id: number;
  tone: "success" | "error" | "info";
  message: string;
}

interface AdminContextValue {
  pages: AdminPageRow[];
  homepage: HomepageContent;
  setHomepage: (next: HomepageContent) => void;
  services: AdminServiceRow[];
  setServices: (next: AdminServiceRow[]) => void;
  locations: AdminLocationRow[];
  setLocations: (next: AdminLocationRow[]) => void;
  projects: AdminProjectRow[];
  setProjects: (next: AdminProjectRow[]) => void;
  blogPosts: AdminBlogRow[];
  setBlogPosts: (next: AdminBlogRow[]) => void;
  testimonials: AdminTestimonialRow[];
  setTestimonials: (next: AdminTestimonialRow[]) => void;
  navItems: NavItemRow[];
  setNavItems: (next: NavItemRow[]) => void;
  leads: AdminLead[];
  setLeadStatus: (id: string, status: LeadStatus) => void;
  seoPages: SeoPageEntry[];
  setSeoPages: (next: SeoPageEntry[]) => void;
  globalSeo: GlobalSeo;
  setGlobalSeo: (next: GlobalSeo) => void;
  general: GeneralSettings;
  setGeneral: (next: GeneralSettings) => void;
  branding: BrandingSettings;
  setBranding: (next: BrandingSettings) => void;
  contact: ContactSettings;
  setContact: (next: ContactSettings) => void;
  integrations: IntegrationState;
  setIntegrations: (next: IntegrationState) => void;
  toasts: Toast[];
  pushToast: (tone: Toast["tone"], message: string) => void;
  dismissToast: (id: number) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

let toastId = 0;

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [homepage, setHomepage] = useState<HomepageContent>(initialHomepage);
  const [services, setServices] = useState<AdminServiceRow[]>(initialServices);
  const [locations, setLocations] = useState<AdminLocationRow[]>(initialLocations);
  const [projects, setProjects] = useState<AdminProjectRow[]>(initialProjects);
  const [blogPosts, setBlogPosts] = useState<AdminBlogRow[]>(initialBlogPosts);
  const [testimonials, setTestimonials] = useState<AdminTestimonialRow[]>(initialTestimonials);
  const [navItems, setNavItems] = useState<NavItemRow[]>(initialNav);
  const [leads, setLeads] = useState<AdminLead[]>(initialLeads);
  const [seoPages, setSeoPages] = useState<SeoPageEntry[]>(initialSeoPages);
  const [globalSeo, setGlobalSeo] = useState<GlobalSeo>(initialGlobalSeo);
  const [general, setGeneral] = useState<GeneralSettings>(initialGeneralSettings);
  const [branding, setBranding] = useState<BrandingSettings>(initialBranding);
  const [contact, setContact] = useState<ContactSettings>(initialContact);
  const [integrations, setIntegrations] = useState<IntegrationState>(initialIntegrations);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const pushToast = useCallback((tone: Toast["tone"], message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, tone, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      pages: initialPages,
      homepage, setHomepage,
      services, setServices,
      locations, setLocations,
      projects, setProjects,
      blogPosts, setBlogPosts,
      testimonials, setTestimonials,
      navItems, setNavItems,
      leads, setLeadStatus,
      seoPages, setSeoPages,
      globalSeo, setGlobalSeo,
      general, setGeneral,
      branding, setBranding,
      contact, setContact,
      integrations, setIntegrations,
      toasts, pushToast, dismissToast,
    }),
    [homepage, services, locations, projects, blogPosts, testimonials, navItems, leads, seoPages, globalSeo, general, branding, contact, integrations, toasts, setLeadStatus, pushToast, dismissToast]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminStore(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
