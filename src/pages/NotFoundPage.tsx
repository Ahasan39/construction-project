import { PageShell } from "@/components/layout/PageShell";

/**
 * In-app Not Found screen. This renders inside the SPA and does NOT by itself
 * produce an HTTP 404 status — hosting must be configured to serve this view
 * for unknown paths while a future prerender step may emit true 404 pages for
 * known-unenumerable slugs. See docs/PROGRESS.md §Prerendering.
 */
export default function NotFoundPage() {
  return (
    <PageShell
      meta={{
        title: "Not found — scaffold",
        description: "The requested page could not be found.",
        canonicalPath: "/404",
        noindex: true,
      }}
      title="Page not found"
      intro="We couldn't find that page. Try the homepage or the main navigation."
    />
  );
}
