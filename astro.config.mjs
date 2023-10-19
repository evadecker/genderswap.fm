import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://genderswap.fm",
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
