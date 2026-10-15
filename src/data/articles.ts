import type { Article, ArticleSummary } from "@/types";

const demoArticles: Article[] = [
  {
    slug: "placeholder-article-1",
    title: "Placeholder article — layout verification only",
    excerpt: "Demonstration excerpt to verify blog listing layout.",
    publishedAt: "2026-01-01",
    category: "News",
    thumbnailSrc: null,
    bodyHtml: "<p>Placeholder content. Replace with real editorial copy.</p>",
    isPlaceholder: true,
  },
  {
    slug: "placeholder-article-2",
    title: "Second placeholder article",
    excerpt: "Demonstration excerpt to verify blog pagination.",
    publishedAt: "2026-01-02",
    category: "Roofing",
    thumbnailSrc: null,
    bodyHtml: "<p>Placeholder content.</p>",
    isPlaceholder: true,
  },
];

export function listArticleSummaries(): ArticleSummary[] {
  return demoArticles.map(
    ({ slug, title, excerpt, publishedAt, category, thumbnailSrc }) => ({
      slug,
      title,
      excerpt,
      publishedAt,
      category,
      thumbnailSrc,
    })
  );
}

export function findArticle(slug: string): Article | undefined {
  return demoArticles.find((a) => a.slug === slug);
}
