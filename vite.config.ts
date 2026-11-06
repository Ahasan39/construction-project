import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/js"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["resources/js/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["resources/js/test/setup.ts"],
  },
});
