import type { Article, ArticleSummary } from "@/types";

/**
 * Blog article set. Each article has a relevant locally-hosted image reused
 * from the project's existing residential-exterior photography. The body is
 * original general-information copy about residential-exterior topics; it is
 * not professional advice and does not reproduce any copyrighted reference
 * article verbatim.
 */
const articles: Article[] = [
  {
    slug: "placeholder-article-1",
    title: "What to look for after a severe storm",
    excerpt:
      "A short, practical checklist for inspecting a residential exterior after high winds or hail — without climbing on the roof.",
    publishedAt: "2026-01-05",
    category: "Roofing",
    thumbnailSrc: "/images/services/photos/benefit-crew-working-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>After a severe storm, the first assessment can usually be done from the ground. Walk the perimeter of the house and look for granules in gutters or along the drip line, loose or missing shingles visible against the sky, bent or detached gutters, dented vent covers, cracked or dislodged siding panels, and broken window screens.</p>" +
      "<p>Document what you find with dated photographs. If the damage looks structural or is visible from the ground, call a contractor to confirm whether a full roof inspection is appropriate. If you suspect an insurance claim is involved, contact your insurer separately — a contractor's estimate is not a coverage decision.</p>" +
      "<p>Our team is happy to walk the property with you and document findings during a free written estimate.</p>",
  },
  {
    slug: "placeholder-article-2",
    title: "What goes into a written roof-replacement estimate",
    excerpt:
      "A good estimate documents scope, materials, and site logistics — not just a price. Here is what to look for on the document.",
    publishedAt: "2026-01-12",
    category: "Roofing",
    thumbnailSrc: "/images/services/photos/benefit-consultant-homeowner-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>A written estimate for a roof replacement should name the shingle product and tier, the underlayment, flashing details at penetrations, ventilation changes if any, cleanup plan, and warranty terms. It should also indicate how the schedule will work and who the point of contact is on the project.</p>" +
      "<p>Compare estimates on scope first, then on price. Two estimates at different prices often cover different work. If something is unclear, ask the contractor to clarify in writing before signing.</p>" +
      "<p>We provide written estimates with the above details spelled out — contact us to schedule one.</p>",
  },
  {
    slug: "placeholder-article-3",
    title: "Gutters and ice: why winter attention matters",
    excerpt:
      "Gutters that work well in summer can still back up under ice. A short note on why that happens and what to do about it.",
    publishedAt: "2026-02-02",
    category: "Gutters",
    thumbnailSrc: "/images/services/photos/promo-inspector-gutters-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>In cold climates, ice can collect at the eave and block the normal flow of melt water out of the gutter. Water then backs up under the shingles at the lower courses and finds its way into the attic or exterior walls.</p>" +
      "<p>Attic insulation, soffit and ridge ventilation, and gutter condition all play a part. A contractor who looks only at the gutter without checking ventilation is often missing the real cause.</p>" +
      "<p>We check gutters and ventilation together during estimate visits so you get an accurate picture.</p>",
  },
  {
    slug: "placeholder-article-4",
    title: "Siding: what the big material categories actually mean",
    excerpt:
      "Vinyl, fiber-cement, engineered wood — a plain-language note on how these product families differ.",
    publishedAt: "2026-02-20",
    category: "Siding",
    thumbnailSrc: "/images/services/photos/benefit-exterior-renovation-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>Modern residential siding usually falls into one of three broad categories: vinyl, fiber-cement, and engineered wood. Each has different installation detail, maintenance expectations, and lifetime range. Pick the category first, then the product within it.</p>" +
      "<p>Local climate, exposure, and the look you want all matter. A good estimate will walk through the differences for your specific house rather than quoting a single product up front.</p>" +
      "<p>Our team can review the categories with physical samples during an estimate so the comparison is tangible.</p>",
  },
  {
    slug: "placeholder-article-5",
    title: "Replacement windows: U-factor, SHGC and the labels on the sticker",
    excerpt:
      "The NFRC sticker on a replacement window carries four numbers. Here is what each one measures.",
    publishedAt: "2026-03-05",
    category: "Windows",
    thumbnailSrc: "/images/services/photos/hero-suburban-home-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>Replacement windows sold in the United States carry an NFRC label with four performance numbers: U-factor, Solar Heat Gain Coefficient, Visible Transmittance, and Air Leakage. U-factor measures heat flow through the window — lower is better in a cold climate. SHGC measures how much solar heat the window admits — the right value depends on climate and orientation.</p>" +
      "<p>Compare like-for-like products on these numbers rather than on brand name alone. Installation quality matters just as much as the sticker, and a good estimate addresses both.</p>" +
      "<p>Our team can walk through the labels on the specific products quoted for your project.</p>",
  },
  {
    slug: "placeholder-article-6",
    title: "Chimneys and brick: when a mason, not a roofer, is the right call",
    excerpt:
      "Some roof-area leaks are actually masonry problems. A short note on how to tell.",
    publishedAt: "2026-03-18",
    category: "Masonry",
    thumbnailSrc: "/images/services/photos/benefit-roofer-install-900.webp",
    isPlaceholder: true,
    bodyHtml:
      "<p>Water staining in a ceiling near a chimney often turns out to be a flashing or masonry issue rather than a shingle failure. The flashing at the chimney base can lift, the brick itself can be spalling, and the crown at the top can crack.</p>" +
      "<p>A roofer and a mason look at the same chimney differently. On older homes, having both on-site at the estimate stage saves a return trip later.</p>" +
      "<p>Our estimates cover both the roofing and masonry sides when the chimney is involved.</p>",
  },
];

export function listArticleSummaries(): ArticleSummary[] {
  return articles.map(
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
  return articles.find((a) => a.slug === slug);
}
