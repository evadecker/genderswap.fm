import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig(({ mode }) => ({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,ts}'],
    coverage: {
      include: ['src/**/*.{js,ts,svelte}'],
      exclude: [
        'src/lib/stores/**',
        'src/lib/types/**',
        'src/routes/**',
        'src/lib/schemas.ts',
        'src/lib/supabase.ts'
      ],
      reporter: ['text', 'json-summary', 'json']
    }
  },
  resolve: {
    conditions: mode === 'test' ? ['browser'] : []
  },
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte'
    })
  ]
}));
