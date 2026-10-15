import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { getArticle } from "@/services/content";
import type { Article } from "@/types";
import NotFoundPage from "./NotFoundPage";

export default function BlogArticlePage() {
  const { slug } = useParams();
  const [state, setState] = useState<
    { status: "loading" } | { status: "found"; article: Article } | { status: "missing" }
  >({ status: "loading" });

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
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <PageShell
        meta={{
          title: "Loading…",
          description: "",
          canonicalPath: `/blog/${slug ?? ""}/`,
          noindex: true,
        }}
        title="Loading…"
      />
    );
  }
  if (state.status === "missing") return <NotFoundPage />;

  const a = state.article;
  return (
    <PageShell
      meta={{
        title: `${a.title} — scaffold`,
        description: a.excerpt,
        canonicalPath: `/blog/${a.slug}/`,
      }}
      title={a.title}
      intro={a.excerpt}
    >
      <article dangerouslySetInnerHTML={{ __html: a.bodyHtml }} />
    </PageShell>
  );
}
