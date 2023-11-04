import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://genderswap.fm",
  integrations: [sitemap(), react(), svelte()],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    },
    includeFiles: ["./public/fonts/Indivisible-Regular.otf", "./public/fonts/Indivisible-SemiBold.otf"]
  })
});