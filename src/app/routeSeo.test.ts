import { afterEach, describe, expect, it } from "vitest";
import { staticRoutes } from "./staticRoutes";
import {
  getRouteSeo,
  generateSitemapXml,
  buildLocationJsonLd,
  buildLocationServiceJsonLd,
} from "./routeSeo";
import { applyRouteMeta } from "./seo";
import { findLocation } from "@/data/locations";
import { findService } from "@/data/services";

afterEach(() => {
  document.head.innerHTML = "";
});

describe("routeSeo metadata resolution", () => {
  const routes = staticRoutes();

  it("resolves valid, non-empty SEO metadata for all 235 static routes", () => {
    expect(routes.length).toBe(235);
    for (const route of routes) {
      const meta = getRouteSeo(route);
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.canonicalPath).toBeTruthy();
      expect(meta.title).not.toContain("— scaffold");
      expect(meta.description).not.toContain("scaffold");
    }
  });

  it("injects LocalBusiness / RoofingContractor JSON-LD on all 10 location hubs", () => {
    const locationHubs = [
      "/ann-arbor",
      "/grand-rapids",
      "/cleveland",
      "/cincinnati",
      "/dayton",
      "/lexington",
      "/louisville",
      "/nashville",
      "/detroit",
      "/lansing",
    ];

    for (const hub of locationHubs) {
      const meta = getRouteSeo(hub);
      expect(meta.jsonLd).toBeDefined();
      const json = meta.jsonLd as Record<string, unknown>;
      expect(json["@context"]).toBe("https://schema.org");
      expect(json["@type"]).toEqual(["LocalBusiness", "RoofingContractor"]);
      expect(json.telephone).toBe("+880 1842-299275");
      expect(json.email).toBe("amamulahasan77@gmail.com");
    }
  });

  it("injects Service and RoofingContractor JSON-LD on location service pages", () => {
    const samplePages = [
      "/nashville/roofing",
      "/detroit/windows",
      "/lansing/siding",
      "/cincinnati/roofing/commercial-roofing",
    ];

    for (const path of samplePages) {
      const meta = getRouteSeo(path);
      expect(meta.jsonLd).toBeDefined();
      const json = meta.jsonLd as Record<string, unknown>;
      expect(json["@context"]).toBe("https://schema.org");
      expect(Array.isArray(json["@graph"])).toBe(true);
      const graph = json["@graph"] as Array<Record<string, unknown>>;
      const business = graph.find(
        (node) =>
          Array.isArray(node["@type"]) &&
          node["@type"].includes("RoofingContractor")
      );
      const service = graph.find((node) => node["@type"] === "Service");
      expect(business).toBeDefined();
      expect(service).toBeDefined();
    }
  });

  it("buildLocationJsonLd helper formats valid Schema.org structure", () => {
    const loc = findLocation("cleveland")!;
    const schema = buildLocationJsonLd(loc);
    expect(schema["@type"]).toEqual(["LocalBusiness", "RoofingContractor"]);
    expect(schema.name).toBe("Mr. Roof — Cleveland");
    expect((schema.address as Record<string, string>).addressLocality).toBe(
      "Cleveland"
    );
  });

  it("buildLocationServiceJsonLd helper formats valid Schema.org graph", () => {
    const loc = findLocation("nashville")!;
    const svc = findService("roofing")!;
    const schema = buildLocationServiceJsonLd(loc, svc);
    expect(schema["@graph"]).toBeDefined();
  });
});

describe("Sitemap Generation", () => {
  it("generates clean sitemap XML from staticRoutes() containing 235 URLs", () => {
    const routes = staticRoutes();
    const xml = generateSitemapXml(routes);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain("https://ahasan39.github.io/construction-project/");
    expect(xml).toContain("https://ahasan39.github.io/construction-project/roofing/");
    expect(xml).toContain("https://ahasan39.github.io/construction-project/nashville/");
    expect(xml).toContain("https://ahasan39.github.io/construction-project/free-estimate/");

    // Check count
    const matches = xml.match(/<url>/g);
    expect(matches?.length).toBe(235);

    // Verify admin routes are never present
    expect(xml).not.toContain("/admin");
  });
});

describe("applyRouteMeta enhanced SEO behavior", () => {
  it("injects title, description, robots, OG tags, Twitter tags and JSON-LD script", () => {
    const meta = getRouteSeo("/nashville");
    applyRouteMeta(meta);

    expect(document.title).toBe(
      "Nashville, TN roofing & home exterior | Frontend demo"
    );
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute("content")
    ).toBe(meta.description);
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute("content")
    ).toBe("noindex,nofollow");
    expect(
      document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    ).toBe("Nashville, TN roofing & home exterior | Frontend demo");
    expect(
      document.querySelector('meta[property="og:type"]')?.getAttribute("content")
    ).toBe("website");
    expect(
      document.querySelector('meta[name="twitter:card"]')?.getAttribute("content")
    ).toBe("summary_large_image");

    const jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(jsonLdScript).not.toBeNull();
    const parsed = JSON.parse(jsonLdScript!.textContent!);
    expect(parsed["@type"]).toEqual(["LocalBusiness", "RoofingContractor"]);
  });

  it("removes JSON-LD script when navigating to a page without structured data", () => {
    const locMeta = getRouteSeo("/nashville");
    applyRouteMeta(locMeta);
    expect(document.querySelector('script[type="application/ld+json"]')).not.toBeNull();

    const aboutMeta = getRouteSeo("/about");
    applyRouteMeta(aboutMeta);
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});

