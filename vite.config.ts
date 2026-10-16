import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { staticRoutes } from "./src/app/staticRoutes";

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
        await writeFile(path.join(directory, "index.html"), html);
      }
      // Pages serves this shell with HTTP 404, keeping path, query and hash intact.
      await writeFile(path.join(output, "404.html"), html);
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
