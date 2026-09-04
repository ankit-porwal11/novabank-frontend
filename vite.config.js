import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for the banking frontend.
// The dev server proxies /api to the backend so cookies are same-site in dev.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Pre-bundled eagerly by Vite's dep scanner but only ever imported from
    // the lazy-loaded landing-page 3D chunk (src/components/three) — the
    // dashboard bundle never pulls these in at runtime.
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isolate three.js/R3F into their own chunk so the dashboard's
          // initial load never fetches 3D code.
          if (id.includes("node_modules/three") || id.includes("@react-three")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/gsap")) {
            return "vendor-gsap";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
