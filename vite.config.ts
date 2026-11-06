import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { staticRoutes } from "./src/app/staticRoutes";
import { servicePages, type ServiceHubKey } from "./src/data/servicePages";
import { findRoofingDetail } from "./src/data/roofingDetails";
import { getRouteSeo, generateSitemapXml, escapeHtml } from "./src/app/routeSeo";

function renderRouteHtml(baseHtml: string, route: string): string {
  const meta = getRouteSeo(route);
  const fullTitle = `${meta.title} | Frontend demo`;
  const canonicalSuffix = route === "/" ? "/" : `${route}/`;
  const canonicalUrl = `https://ahasan39.github.io/construction-project${canonicalSuffix}`;
  const ogImage = meta.ogImage
    ? meta.ogImage.startsWith("http")
      ? meta.ogImage
      : `https://ahasan39.github.io${meta.ogImage}`
    : "https://ahasan39.github.io/construction-project/images/homepage/hero-suburban-home.webp";

  let preload = "";
  if (route === "/") {
    preload =
      '<link rel="preload" as="image" type="image/webp" href="/construction-project/images/homepage/hero-suburban-home.webp" imagesrcset="/construction-project/images/homepage/hero-suburban-home-mobile.webp 480w, /construction-project/images/homepage/hero-suburban-home.webp 960w" imagesizes="(max-width: 768px) 100vw, 680px" fetchpriority="high">';
  } else {
    const service = servicePages[route.slice(1) as ServiceHubKey];
    const hero = service?.hero.file;
    if (hero) {
      preload = `<link rel="preload" as="image" type="image/webp" href="/construction-project/images/services/photos/${hero}-900.webp" imagesrcset="/construction-project/images/services/photos/${hero}-480.webp 480w, /construction-project/images/services/photos/${hero}-900.webp 900w" imagesizes="100vw" fetchpriority="high">`;
    }
    const detail = route.startsWith("/roofing/")
      ? findRoofingDetail(route.split("/")[2])
      : undefined;
    const photo = detail?.hero;
    if (photo) {
      preload = `<link rel="preload" as="image" type="image/webp" href="/construction-project/images/roofing-details/${photo.name}-${photo.width}.webp" imagesrcset="/construction-project/images/roofing-details/${photo.name}-480.webp 480w, /construction-project/images/roofing-details/${photo.name}-${photo.width}.webp ${photo.width}w" imagesizes="100vw" fetchpriority="high">`;
    }
  }

  const extraHead: string[] = [];

  // Open Graph
  extraHead.push(
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`
  );
  extraHead.push(
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
  );
  extraHead.push(
    `<meta property="og:type" content="${meta.ogType ?? "website"}" />`
  );
  extraHead.push(`<meta property="og:url" content="${canonicalUrl}" />`);
  extraHead.push(`<meta property="og:image" content="${ogImage}" />`);

  // Twitter Card
  extraHead.push('<meta name="twitter:card" content="summary_large_image" />');
  extraHead.push(
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`
  );
  extraHead.push(
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  );
  extraHead.push(`<meta name="twitter:image" content="${ogImage}" />`);

  // Structured Data (JSON-LD)
  if (meta.jsonLd) {
    extraHead.push(
      `<script type="application/ld+json">\n${JSON.stringify(meta.jsonLd, null, 2)}\n    </script>`
    );
  }

  // Preload
  if (preload) {
    extraHead.push(preload);
  }

  let routeHtml = baseHtml;
  routeHtml = routeHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(fullTitle)}</title>`
  );
  routeHtml = routeHtml.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  routeHtml = routeHtml.replace(
    "</head>",
    `  ${extraHead.join("\n    ")}\n  </head>`
  );

  return routeHtml;
}

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/construction-project/" : "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "static-route-entries",
      apply: "build",
      async closeBundle() {
        const output = path.resolve(__dirname, "dist");
        const html = await readFile(path.join(output, "index.html"), "utf8");
        const routes = staticRoutes();

        // Generate sitemap.xml
        const sitemapXml = generateSitemapXml(routes);
        await writeFile(path.join(output, "sitemap.xml"), sitemapXml, "utf8");

        for (const route of routes.filter((route) => route !== "/")) {
          const directory = path.join(output, route.slice(1));
          await mkdir(directory, { recursive: true });
          await writeFile(
            path.join(directory, "index.html"),
            renderRouteHtml(html, route)
          );
        }

        // Pages serves this shell with HTTP 404, keeping path, query and hash intact.
        await writeFile(path.join(output, "404.html"), html);

        // Root entry
        await writeFile(
          path.join(output, "index.html"),
          renderRouteHtml(html, "/")
        );
        await writeFile(path.join(output, ".nojekyll"), "");
        console.log(
          `Generated ${routes.length} supported static route entries, sitemap.xml, and 404.html`
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"],
  },
}));
