import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    preprocess({
      typescript: true,
      scss: true
    }),
    mdsvex({
      extensions: ['.md'],
      layout: {
        _: './src/routes/about/layout.svelte'
      }
    })
  ],
  kit: {
    adapter: adapter()
  }
};

export default config;
