import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://genderswap.fm",
  integrations: [sitemap()],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
