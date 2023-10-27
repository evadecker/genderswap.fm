import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://genderswap.fm",
  integrations: [sitemap(), react()],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
  }),
});
