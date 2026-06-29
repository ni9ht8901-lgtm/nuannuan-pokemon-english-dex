import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      showMaximumFileSizeToCacheInBytesWarning: true,
      includeAssets: ["icons/icon-192.svg", "icons/icon-512.svg"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,webmanifest}"],
        globIgnores: ["**/visual-refs/**"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "visual-reference-images",
              expiration: {
                maxEntries: 20
              }
            }
          }
        ]
      }
    })
  ]
});
