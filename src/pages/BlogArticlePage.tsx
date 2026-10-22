import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { assetUrl } from "@/app/assets";
import { Container } from "@/components/ui";
import { getArticle, getArticleSummaries } from "@/services/content";
import type { Article, ArticleSummary } from "@/types";
import NotFoundPage from "./NotFoundPage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type State =
  | { status: "loading" }
  | { status: "found"; article: Article }
  | { status: "missing" };

export default function BlogArticlePage() {
  const { slug } = useParams();
  const [state, setState] = useState<State>({ status: "loading" });
  const [related, setRelated] = useState<ArticleSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setState({ status: "missing" });
      return;
    }
    getArticle(slug).then((a) => {
      if (cancelled) return;
      setState(a ? { status: "found", article: a } : { status: "missing" });
    });
    getArticleSummaries().then((xs) => {
      if (cancelled) return;
      setRelated(xs.filter((x) => x.slug !== slug).slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (state.status !== "found") return;
    const a = state.article;
    applyRouteMeta({
      title: a.title,
      description: a.excerpt,
      canonicalPath: `/blog/${a.slug}/`,
    });
  }, [state]);

  if (state.status === "loading") {
    return (
      <Container width="wide" className="py-20">
        <p role="status" className="text-slate-600">Loading article…</p>
      </Container>
    );
  }
  if (state.status === "missing") return <NotFoundPage />;

  const a = state.article;

  return (
    <>
      <section
        aria-labelledby="article-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <Link to="/blog" className="hover:underline">Blog</Link>
            <span aria-hidden="true"> › </span>
            <span>{a.title}</span>
          </nav>
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-accent)]">
            {a.category}
          </span>
          <h1
            id="article-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            {a.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
          </div>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            {a.excerpt}
          </p>
        </Container>
      </section>

      {a.thumbnailSrc && (
        <section aria-hidden="true" className="bg-white border-b border-[var(--color-border)]">
          <Container width="content" className="py-6 sm:py-8">
            <img
              src={assetUrl(a.thumbnailSrc)}
              alt=""
              width={900}
              height={562}
              fetchPriority="high"
              decoding="async"
              className="w-full aspect-[16/10] object-cover rounded-sm border border-[var(--color-border)]"
            />
          </Container>
        </section>
      )}

      <section className="bg-white">
        <Container width="content" className="py-10 sm:py-14">
          <article
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed [&_p]:mt-4 [&_p:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
          />
          <p className="mt-10 text-xs text-slate-500 italic">
            This article is general information from our team, not legal,
            insurance, engineering or financial advice. For a specific project,
            contact us for a free written estimate.
          </p>
        </Container>
      </section>

      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="bg-[#F4F6F8] border-y border-[var(--color-border)]"
        >
          <Container width="wide" className="py-12">
            <h2
              id="related-title"
              className="text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
            >
              More articles
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <li
                  key={r.slug}
                  className="rounded-sm border border-slate-200 bg-white p-5"
                >
                  <div className="text-xs text-slate-500">{r.category}</div>
                  <h3 className="mt-1 text-base font-bold text-[var(--color-brand-primary)]">
                    <Link
                      to={`/blog/${r.slug}`}
                      className="hover:underline"
                    >
                      {r.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                    {r.excerpt}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section
        aria-labelledby="article-cta-title"
        className="bg-[#0C1F33] text-white"
      >
        <Container
          width="wide"
          className="py-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
        >
          <div>
            <h2
              id="article-cta-title"
              className="text-2xl sm:text-3xl font-black tracking-tight"
            >
              Have a project to discuss?
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
