import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { getArticleSummaries } from "@/services/content";
import type { ArticleSummary } from "@/types";

export default function BlogIndexPage() {
  const [items, setItems] = useState<ArticleSummary[]>([]);
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
    <PageShell
      meta={{
        title: "Blog — scaffold",
        description: "News & resources.",
        canonicalPath: "/blog/",
      }}
      title="News & Resources"
    >
      <ul className="divide-y divide-[var(--color-border)]">
        {items.map((a) => (
          <li key={a.slug} className="py-3">
            <a href={`/blog/${a.slug}/`} className="font-medium underline">
              {a.title}
            </a>
            <p className="text-sm text-[var(--color-ink-muted)]">{a.excerpt}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
