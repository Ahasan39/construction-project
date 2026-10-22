import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogIndexPage from "./BlogIndexPage";
import BlogArticlePage from "./BlogArticlePage";
import NotFoundPage from "./NotFoundPage";
import { listArticleSummaries } from "@/data/articles";

afterEach(() => cleanup());

function renderIndex() {
  return render(
    <MemoryRouter>
      <BlogIndexPage />
    </MemoryRouter>
  );
}

function renderArticle(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="blog/:slug" element={<BlogArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("BlogIndexPage", () => {
  it("renders a single News & Resources H1", () => {
    renderIndex();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/news & resources/i);
  });

  it("renders one card per article with a relevant image and alt text", async () => {
    renderIndex();
    const expected = listArticleSummaries();
    await waitFor(() => {
      const readMore = screen.getAllByRole("link", { name: /read more/i });
      expect(readMore.length).toBe(expected.length);
    });
    for (const a of expected) {
      expect(screen.getAllByText(a.title).length).toBeGreaterThan(0);
      expect(a.thumbnailSrc).toBeTruthy();
      expect(typeof a.thumbnailSrc).toBe("string");
      // Image rendered with descriptive alt text (category + title).
      const imgs = screen.getAllByAltText(
        new RegExp(`${a.category} —`, "i")
      );
      expect(imgs.length).toBeGreaterThan(0);
    }
  });

  it("each card links to its article detail route", async () => {
    renderIndex();
    const expected = listArticleSummaries();
    await waitFor(() =>
      expect(screen.getAllByText(/read more/i).length).toBe(expected.length)
    );
    const readMore = screen.getAllByRole("link", { name: /read more/i });
    const hrefs = readMore.map((a) => a.getAttribute("href"));
    for (const a of expected) {
      expect(hrefs).toContain(`/blog/${a.slug}`);
    }
  });

  it("Free Estimate CTA resolves to /free-estimate", () => {
    renderIndex();
    const cta = screen.getByRole("link", { name: /get a free estimate/i });
    expect(cta.getAttribute("href")).toBe("/free-estimate");
  });
});

describe("BlogArticlePage", () => {
  it("renders a known article's title, category eyebrow and advice disclaimer", async () => {
    renderArticle("/blog/placeholder-article-1");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { level: 1, name: /severe storm/i })
      ).toBeTruthy()
    );
    // Category eyebrow is present (replacing the former "Demo article" chip).
    expect(screen.getAllByText(/^roofing$/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/not legal, insurance.*or financial advice/i)
    ).toBeTruthy();
  });

  it("breadcrumb links back to /blog", async () => {
    renderArticle("/blog/placeholder-article-1");
    const nav = await waitFor(() =>
      screen.getByRole("navigation", { name: /breadcrumb/i })
    );
    const back = within(nav).getByRole("link", { name: /^blog$/i });
    expect(back.getAttribute("href")).toBe("/blog");
  });

  it("renders a Related section when more articles exist", async () => {
    renderArticle("/blog/placeholder-article-1");
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /more articles/i })).toBeTruthy()
    );
  });

  it("resolves Not Found for an unknown article slug", async () => {
    renderArticle("/blog/this-slug-does-not-exist");
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /page not found/i })
      ).toBeTruthy()
    );
  });
});
