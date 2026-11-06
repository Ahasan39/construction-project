import type { Service } from "@/types";

export const services: Service[] = [
  {
    key: "roofing",
    slug: "roofing",
    title: "Roofing",
    tagline: "Replacement, repair, metal, and commercial roofing.",
    variants: [
      { slug: "roof-replacement", title: "Roof Replacement", summary: "Full roof replacement with transferable warranty." },
      { slug: "roof-repair", title: "Roof Repair", summary: "Leak and storm-damage repair." },
      { slug: "metal-roofing", title: "Metal Roofing", summary: "Standing-seam and metal shingle systems." },
      { slug: "commercial-roofing", title: "Commercial Roofing", summary: "Flat-roof and commercial systems." },
    ],
  },
  { key: "gutters", slug: "gutters", title: "Gutters", tagline: "Seamless aluminum gutters and guards.", variants: [] },
  { key: "siding", slug: "siding", title: "Siding", tagline: "Vinyl and fiber-cement exterior cladding.", variants: [] },
  { key: "windows", slug: "windows", title: "Windows", tagline: "Energy-efficient replacement windows.", variants: [] },
  { key: "masonry", slug: "masonry", title: "Masonry", tagline: "Chimney, brick, and stone work.", variants: [] },
];

export function findService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
