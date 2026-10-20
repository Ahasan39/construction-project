import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { staticRoutes } from "./src/app/staticRoutes";
import { servicePages, type ServiceHubKey } from "./src/data/servicePages";
import { findRoofingDetail } from "./src/data/roofingDetails";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/construction-project/" : "/",
  plugins: [react(), tailwindcss(), {
    name: "static-route-entries",
    apply: "build",
    async closeBundle() {
      const output = path.resolve(__dirname, "dist");
      const html = await readFile(path.join(output, "index.html"), "utf8");
      for (const route of staticRoutes().filter((route) => route !== "/")) {
        const directory = path.join(output, route.slice(1));
        await mkdir(directory, { recursive: true });
        const service = servicePages[route.slice(1) as ServiceHubKey];
        const hero = service?.hero.file;
        const preload = hero ? `<link rel="preload" as="image" type="image/webp" href="/construction-project/images/services/photos/${hero}-900.webp" imagesrcset="/construction-project/images/services/photos/${hero}-480.webp 480w, /construction-project/images/services/photos/${hero}-900.webp 900w" imagesizes="100vw" fetchpriority="high">` : "";
        const detail = route.startsWith("/roofing/") ? findRoofingDetail(route.split("/")[2]) : undefined;
        const photo = detail?.hero;
        const detailPreload = photo ? `<link rel="preload" as="image" type="image/webp" href="/construction-project/images/roofing-details/${photo.name}-${photo.width}.webp" imagesrcset="/construction-project/images/roofing-details/${photo.name}-480.webp 480w, /construction-project/images/roofing-details/${photo.name}-${photo.width}.webp ${photo.width}w" imagesizes="100vw" fetchpriority="high">` : "";
        const routePreload = detailPreload || preload;
        await writeFile(path.join(directory, "index.html"), routePreload ? html.replace("</head>", `${routePreload}\n</head>`) : html);
      }
      // Pages serves this shell with HTTP 404, keeping path, query and hash intact.
      await writeFile(path.join(output, "404.html"), html);
      // Only the homepage entry preloads the homepage image. Other clean-route
      // entries and 404 keep their own route's high-priority image discovery.
      const homePreload = '<link rel="preload" as="image" type="image/webp" href="/construction-project/images/homepage/hero-suburban-home.webp" imagesrcset="/construction-project/images/homepage/hero-suburban-home-mobile.webp 480w, /construction-project/images/homepage/hero-suburban-home.webp 960w" imagesizes="(max-width: 768px) 100vw, 680px" fetchpriority="high">';
      await writeFile(path.join(output, "index.html"), html.replace("</head>", `${homePreload}\n</head>`));
      await writeFile(path.join(output, ".nojekyll"), "");
      console.log(`Generated ${staticRoutes().length} supported static route entries and 404.html`);
    },
  }],
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
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"],
  },
}));
