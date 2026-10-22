import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import NotFoundPage from "@/pages/NotFoundPage";

import HomePage from "@/pages/HomePage";
const TopLevelSlugPage = lazy(() => import("@/pages/TopLevelSlugPage"));
const TwoSegmentPage = lazy(() => import("@/pages/TwoSegmentPage"));
const LocationFreeEstimatePage = lazy(
  () => import("@/pages/LocationFreeEstimatePage")
);
const LocationFinancingPage = lazy(
  () => import("@/pages/LocationFinancingPage")
);
const LocationServiceAreaPage = lazy(
  () => import("@/pages/LocationServiceAreaPage")
);
const ServiceAreaChildPage = lazy(() => import("@/pages/ServiceAreaChildPage"));
const ThreeSegmentLocationPage = lazy(
  () => import("@/pages/ThreeSegmentLocationPage")
);
const FreeEstimatePage = lazy(() => import("@/pages/FreeEstimatePage"));
const BlogIndexPage = lazy(() => import("@/pages/BlogIndexPage"));
const BlogArticlePage = lazy(() => import("@/pages/BlogArticlePage"));
const ExternalEntryPage = lazy(() => import("@/pages/ExternalEntryPage"));
const ContactUsPage = lazy(() => import("@/pages/ContactUsPage"));
const ReferAFriendPage = lazy(() => import("@/pages/ReferAFriendPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const SpecialOffersPage = lazy(() => import("@/pages/SpecialOffersPage"));
const FinancingPage = lazy(() => import("@/pages/FinancingPage"));
const WarrantiesPage = lazy(() => import("@/pages/WarrantiesPage"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const CommercialProjectsPage = lazy(() => import("@/pages/CommercialProjectsPage"));
const SalesCareersPage = lazy(() => import("@/pages/SalesCareersPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PayMyBillPage = lazy(() => import("@/pages/PayMyBillPage"));
const VisualizerPage = lazy(() => import("@/pages/VisualizerPage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));

/**
 * Dev-only preview. Guarded by `import.meta.env.DEV`, which Vite rewrites to a
 * literal `false` in production — the branch and the dynamic import both get
 * dead-code eliminated, so neither the route nor the preview chunk ships to
 * users. Noindex/robots alone would NOT be sufficient; this is the real gate.
 */
const FoundationPreview = import.meta.env.DEV
  ? lazy(() => import("@/pages/_preview/FoundationPreview"))
  : null;

// eslint-disable-next-line react-refresh/only-export-components
function L({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-slate-50 px-6 py-20" role="status"><p className="mx-auto max-w-7xl text-lg">Loading page…</p></div>}>{children}</Suspense>;
}

/**
 * Route table. Known literal paths come first; the generic `:slug` and `:a/:b`
 * dispatchers resolve service-vs-location at render time by consulting the
 * typed data in `@/data/*`. Unknown slugs render NotFoundPage.
 *
 * React Router matches static segments ahead of dynamic ones, so the location
 * literal routes (`:locationSlug/free-estimate` etc.) take precedence over
 * `/:a/:b`.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },

      /* Lead form */
      { path: "free-estimate", element: <L><FreeEstimatePage /></L> },

      /* Resource / company pages */
      { path: "about", element: <L><AboutPage /></L> },
      { path: "special-offers", element: <L><SpecialOffersPage /></L> },
      { path: "financing", element: <L><FinancingPage /></L> },
      { path: "warranties", element: <L><WarrantiesPage /></L> },
      {
        path: "refer-a-friend",
        element: <L><ReferAFriendPage /></L>,
      },
      {
        path: "contact-us",
        element: <L><ContactUsPage /></L>,
      },
      { path: "reviews", element: <L><ReviewsPage /></L> },
      { path: "gallery", element: <L><GalleryPage /></L> },
      { path: "commercial-projects", element: <L><CommercialProjectsPage /></L> },
      { path: "careers/sales", element: <L><SalesCareersPage /></L> },
      { path: "privacy-policy", element: <L><PrivacyPolicyPage /></L> },
      { path: "terms-and-conditions", element: <L><TermsPage /></L> },

      /* External integration entry points */
      { path: "billpay", element: <L><PayMyBillPage /></L> },
      { path: "visualizer", element: <L><VisualizerPage /></L> },
      {
        path: "crew",
        element: (
          <L>
            <ExternalEntryPage
              meta={{ title: "Crew portal — scaffold", description: "External crew/employee portal entry point.", canonicalPath: "/crew/", noindex: true }}
              title="Crew portal"
              intro="Internal portal — external authentication required."
              outboundLabel="Open crew portal"
              outboundHref={null}
            />
          </L>
        ),
      },

      /* Blog */
      { path: "blog", element: <L><BlogIndexPage /></L> },
      { path: "blog/:slug", element: <L><BlogArticlePage /></L> },

      /* Location literal segments — matched ahead of /:a/:b */
      {
        path: ":locationSlug/free-estimate",
        element: <L><LocationFreeEstimatePage /></L>,
      },
      {
        path: ":locationSlug/financing",
        element: <L><LocationFinancingPage /></L>,
      },
      {
        path: ":locationSlug/service-area",
        element: <L><LocationServiceAreaPage /></L>,
      },
      {
        path: ":locationSlug/service-area/:childSlug",
        element: <L><ServiceAreaChildPage /></L>,
      },

      /* Three-segment location → service → variant (eg /nashville/roofing/commercial-roofing) */
      {
        path: ":locationSlug/:serviceSlug/:variantSlug",
        element: <L><ThreeSegmentLocationPage /></L>,
      },

      /* Generic dispatchers at 1 and 2 segments. */
      { path: ":slug", element: <L><TopLevelSlugPage /></L> },
      { path: ":a/:b", element: <L><TwoSegmentPage /></L> },

      /* Dev-only preview — tree-shaken from production via import.meta.env.DEV. */
      ...(FoundationPreview
        ? [{ path: "__preview", element: <L><FoundationPreview /></L> }]
        : []),

      /* Catch-all */
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });
