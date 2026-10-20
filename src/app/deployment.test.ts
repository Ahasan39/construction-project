import { afterEach, describe, expect, it } from "vitest";
import { assetUrl } from "./assets";
import { staticRoutes } from "./staticRoutes";
import { applyRouteMeta } from "./seo";

afterEach(() => { document.head.innerHTML = ""; });

describe("static demo deployment", () => {
  it("prefixes public assets once and preserves external URLs", () => {
    expect(assetUrl("/images/logo.svg", "/construction-project/")).toBe("/construction-project/images/logo.svg");
    expect(assetUrl("/construction-project/images/logo.svg", "/construction-project/")).toBe("/construction-project/images/logo.svg");
    expect(assetUrl("/images/logo.svg", "/")).toBe("/images/logo.svg");
    expect(assetUrl("https://example.com/logo.svg", "/construction-project/")).toBe("https://example.com/logo.svg");
  });

  it("emits only supported location/service/variant/capability routes", () => {
    const routes = staticRoutes();
    for (const path of ["/", "/nashville", "/nashville/roofing/commercial-roofing", "/nashville/siding", "/nashville/free-estimate", "/ann-arbor/service-area/toledo", "/blog/placeholder-article-1"]) {
      expect(routes).toContain(path);
    }
    for (const path of ["/__preview", "/lexington/free-estimate", "/detroit/roofing", "/ann-arbor/siding", "/nashville/roofing/metal-roofing", "/nashville/insulation", "/detroit/service-area"]) {
      expect(routes).not.toContain(path);
    }
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("keeps noindex on every route transition and omits production canonicals", () => {
    document.head.innerHTML = '<link rel="canonical" href="https://www.mrroof.com/">';
    for (const canonicalPath of ["/", "/nashville", "/nashville/roofing/commercial-roofing"]) {
      applyRouteMeta({ title: "Demo", description: "Demo route", canonicalPath });
      expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex,nofollow");
      expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    }
  });
});
