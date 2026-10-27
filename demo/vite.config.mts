// Construit la version démo (sans serveur) : npm run build:demo → demo/dist/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("."),
  base: "./",
  plugins: [react()],
  publicDir: r("../public"),
  resolve: {
    alias: [
      { find: /^next\/navigation$/, replacement: r("./shims/router.tsx") },
      { find: /^next\/link$/, replacement: r("./shims/router.tsx") },
      { find: /^pocketbase$/, replacement: r("./shims/pocketbase.ts") },
      { find: /^@\/lib\/icons$/, replacement: r("./shims/icons.ts") },
      { find: /^@\//, replacement: r("../") + "/" },
    ],
  },
  define: { "process.env.NEXT_PUBLIC_PB_URL": '""', "process.env.NEXT_PUBLIC_E2E": '""' },
  build: { outDir: r("./dist"), emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 2000 },
});
