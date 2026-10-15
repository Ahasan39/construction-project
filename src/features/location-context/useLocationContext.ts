import { useLocation } from "react-router-dom";
import { findLocation } from "@/data/locations";
import type { Location } from "@/types";

/**
 * Derive the "current location" strictly from the URL. The reference does not
 * surface a saved selection that overrides an explicit location URL, and we
 * never let state hidden from the user shadow a route they are actively on.
 *
 * Returns `null` when the first path segment is not a known location slug.
 */
export function useLocationContext(): Location | null {
  const { pathname } = useLocation();
  const first = pathname.replace(/^\/+/, "").split("/")[0];
  if (!first) return null;
  return findLocation(first) ?? null;
}
