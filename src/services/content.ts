import { services } from "@/data/services";
import { locations } from "@/data/locations";
import { offers } from "@/data/offers";
import { reviews } from "@/data/reviews";
import { listArticleSummaries, findArticle } from "@/data/articles";
import type {
  Article,
  ArticleSummary,
  Location,
  Offer,
  Review,
  Service,
} from "@/types";

/**
 * Read-only mock content service. Each function returns a promise so callers
 * stay compatible with a future Laravel-backed implementation.
 */

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getLocations(): Promise<Location[]> {
  return locations;
}

export async function getOffers(): Promise<Offer[]> {
  return offers;
}

export async function getReviews(): Promise<Review[]> {
  return reviews;
}

export async function getArticleSummaries(): Promise<ArticleSummary[]> {
  return listArticleSummaries();
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return findArticle(slug);
}
