import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import NotFoundPage from "@/pages/NotFoundPage";

/* Route-level code splitting for every template family. */
const HomePage = lazy(() => import("@/pages/HomePage"));
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
const StaticPage = lazy(() => import("@/pages/StaticPage"));
const ExternalEntryPage = lazy(() => import("@/pages/ExternalEntryPage"));

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
  return <Suspense fallback={null}>{children}</Suspense>;
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
      { index: true, element: <L><HomePage /></L> },

      /* Lead form */
      { path: "free-estimate", element: <L><FreeEstimatePage /></L> },

      /* Resource / company pages */
      {
        path: "about",
        element: (
          <L>
            <StaticPage
              meta={{ title: "About — scaffold", description: "About the company.", canonicalPath: "/about/" }}
              title="About"
            />
          </L>
        ),
      },
      {
        path: "special-offers",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Special offers — scaffold", description: "Current offers and promotions.", canonicalPath: "/special-offers/" }}
              title="Special offers"
            />
          </L>
        ),
      },
      {
        path: "financing",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Financing — scaffold", description: "Financing options.", canonicalPath: "/financing/" }}
              title="Financing"
            />
          </L>
        ),
      },
      {
        path: "warranties",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Warranties — scaffold", description: "Warranty information.", canonicalPath: "/warranties/" }}
              title="Warranties"
            />
          </L>
        ),
      },
      {
        path: "refer-a-friend",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Refer a friend — scaffold", description: "Referral program.", canonicalPath: "/refer-a-friend/" }}
              title="Refer a friend"
            />
          </L>
        ),
      },
      {
        path: "reviews",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Customer reviews — scaffold", description: "Customer reviews.", canonicalPath: "/reviews/" }}
              title="Customer reviews"
            />
          </L>
        ),
      },
      {
        path: "commercial-projects",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Commercial projects — scaffold", description: "Selected commercial projects.", canonicalPath: "/commercial-projects/" }}
              title="Commercial projects"
            />
          </L>
        ),
      },
      {
        path: "careers/sales",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Sales careers — scaffold", description: "Sales career opportunities.", canonicalPath: "/careers/sales/" }}
              title="Sales careers"
            />
          </L>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <L>
            <StaticPage
              meta={{ title: "Privacy policy — scaffold", description: "Privacy policy.", canonicalPath: "/privacy-policy/" }}
              title="Privacy policy"
            />
          </L>
        ),
      },

      /* External integration entry points */
      {
        path: "billpay",
        element: (
          <L>
            <ExternalEntryPage
              meta={{ title: "Pay my bill — scaffold", description: "External bill-pay portal entry point.", canonicalPath: "/billpay/" }}
              title="Pay my bill"
              intro="Bill payment is handled by an external processor. Replace the outbound link with the client's provider before launch."
              outboundLabel="Open bill-pay portal"
              outboundHref={null}
            />
          </L>
        ),
      },
      {
        path: "visualizer",
        element: (
          <L>
            <ExternalEntryPage
              meta={{ title: "Design visualizer — scaffold", description: "External 3D exterior design tool entry point.", canonicalPath: "/visualizer/" }}
              title="Design visualizer"
              intro="The 3D visualizer is an external tool. Replace the outbound link with the client's provider before launch."
              outboundLabel="Open visualizer"
              outboundHref={null}
            />
          </L>
        ),
      },
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
]);
