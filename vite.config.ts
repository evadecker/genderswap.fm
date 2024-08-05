import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{js,ts}"],
    coverage: {
      include: ["src/**/*.{js,ts,svelte}"],
      exclude: [
        "src/lib/stores/**",
        "src/lib/types/**",
        "src/routes/**",
        "src/lib/schemas.ts",
        "src/lib/supabase.ts",
      ],
      reporter: ["text", "json-summary", "json"],
    },
  },
});
