import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte'
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,ts}'],
    coverage: {
      reporter: ['text', 'json-summary', 'json']
    }
  }
});
