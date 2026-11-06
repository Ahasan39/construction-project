import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { assetUrl } from "@/app/assets";
import { Container } from "@/components/ui";
import { getArticleSummaries } from "@/services/content";
import type { ArticleSummary } from "@/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const [items, setItems] = useState<ArticleSummary[] | null>(null);

  useEffect(() => {
    applyRouteMeta({
      title: "News & Resources",
      description:
        "Residential-exterior articles — demonstration posts for layout verification. The reference site's own blog has not been reproduced in this session.",
      canonicalPath: "/blog/",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    getArticleSummaries().then((xs) => {
      if (!cancelled) setItems(xs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section
        aria-labelledby="blog-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Blog</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Articles &amp; resources
          </p>
          <h1
            id="blog-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            News &amp; Resources.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            Short, practical explainers on residential-exterior topics —
            roofing, gutters, siding, windows and masonry — from the team.
            Have a question these articles don't answer? The Contact Us page
            and the phone number in the footer are the fastest way to reach us.
          </p>
        </Container>
      </section>

      <section aria-labelledby="blog-list-title" className="bg-white">
        <Container width="wide" className="py-14 sm:py-16">
          <h2 id="blog-list-title" className="sr-only">
            Article list
          </h2>

          {items === null ? (
            <p role="status" className="text-slate-600">Loading articles…</p>
          ) : items.length === 0 ? (
            <div className="rounded-sm border border-slate-200 bg-[#F4F6F8] p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-[var(--color-brand-primary)]">
                No articles are available yet
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                When editorial content is supplied, articles will appear here.
                This reproduction does not fabricate posts to fill the layout.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <li
                  key={a.slug}
                  className="rounded-sm border border-slate-200 bg-[#F4F6F8] overflow-hidden flex flex-col hover-lift"
                >
                  {a.thumbnailSrc ? (
                    <Link
                      to={`/blog/${a.slug}`}
                      className="block aspect-[16/10] overflow-hidden bg-slate-200"
                      aria-label={a.title}
                    >
                      <img
                        src={assetUrl(a.thumbnailSrc)}
                        alt={`${a.category} — ${a.title}`}
                        width={900}
                        height={562}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 hover:scale-[1.03]"
                      />
                    </Link>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-[16/10] bg-slate-200"
                    />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <time dateTime={a.publishedAt}>
                        {formatDate(a.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--color-brand-primary)]">
                        {a.category}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-[var(--color-brand-primary)] leading-snug">
                      <Link
                        to={`/blog/${a.slug}`}
                        className="hover:underline"
                      >
                        {a.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                      {a.excerpt}
                    </p>
                    <Link
                      to={`/blog/${a.slug}`}
                      className="mt-4 self-start text-xs font-bold text-[var(--color-brand-accent)] hover:underline uppercase tracking-wider arrow-nudge"
                    >
                      <span>Read more</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section
        aria-labelledby="blog-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="blog-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Ready to start a project?
            </h2>
            <p className="mt-2 text-slate-300 max-w-prose">
              Request a free written estimate and a team member will follow up
              to confirm next steps.
            </p>
          </div>
          <Link
            to="/free-estimate"
            className="inline-flex items-center justify-center h-12 rounded-sm bg-[#d9232a] hover:bg-[#b81b22] text-white font-extrabold uppercase tracking-wider px-6 shadow-md transition-colors"
          >
            Get a FREE Estimate
          </Link>
        </Container>
      </section>
    </>
  );
}
