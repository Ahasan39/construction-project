import { describe, expect, it } from "vitest";
import { staticRoutes } from "./staticRoutes";
import { primaryNav } from "@/data/navigation";
import type { NavItem } from "@/types";

/**
 * Walk the primary nav and assert every non-external internal destination
 * is covered by `staticRoutes()`. External and anchor-only entries are skipped.
 * This catches a dropped scaffold or a renamed slug at build time rather than
 * via a rendered browser pass.
 */
function flatten(items: NavItem[]): NavItem[] {
  const out: NavItem[] = [];
  for (const i of items) {
    out.push(i);
    if (i.children) out.push(...flatten(i.children));
  }
  return out;
}

describe("navigation integrity", () => {
  it("every internal primary-nav path has a matching static-route entry", () => {
    const routes = new Set(staticRoutes());
    const items = flatten(primaryNav).filter(
      (i) => !i.external && i.to.startsWith("/")
    );
    const missing: string[] = [];
    for (const i of items) {
      const normalized = i.to.replace(/\/+$/, "") || "/";
      if (!routes.has(normalized)) missing.push(i.to);
    }
    expect(missing).toEqual([]);
  });

  it("expected utility and legal routes are all enumerated", () => {
    const routes = new Set(staticRoutes());
    const expected = [
      "/", "/free-estimate", "/about", "/special-offers", "/financing",
      "/warranties", "/refer-a-friend", "/contact-us", "/reviews",
      "/commercial-projects", "/careers/sales", "/privacy-policy",
      "/terms-and-conditions", "/billpay", "/visualizer", "/crew", "/blog",
    ];
    for (const path of expected) {
      expect(routes.has(path)).toBe(true);
    }
  });
});
