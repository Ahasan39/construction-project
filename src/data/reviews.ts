import type { Review } from "@/types";

/**
 * DEMONSTRATION review data. These are not real customer statements and must
 * be replaced before launch. The `isPlaceholder: true` discriminant is a
 * guard so UI code can clearly label demo content in dev builds.
 */
export const reviews: Review[] = [
  {
    id: "demo-1",
    rating: 5,
    author: "Sample Customer",
    cityState: "Sample City, ST",
    serviceKey: "roofing",
    body: "Placeholder review text used only to verify layout. Replace with client-approved content.",
    isPlaceholder: true,
  },
  {
    id: "demo-2",
    rating: 5,
    author: "Sample Customer",
    cityState: "Sample City, ST",
    serviceKey: "siding",
    body: "Placeholder review text used only to verify layout. Replace with client-approved content.",
    isPlaceholder: true,
  },
  {
    id: "demo-3",
    rating: 5,
    author: "Sample Customer",
    cityState: "Sample City, ST",
    serviceKey: "windows",
    body: "Placeholder review text used only to verify layout. Replace with client-approved content.",
    isPlaceholder: true,
  },
];
