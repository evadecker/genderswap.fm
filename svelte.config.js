import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: sequence([
    preprocess({
      typescript: true,
      scss: true
    }),
    mdsvex({
      extensions: ['.md'],
      layout: {
        _: 'src/lib/components/ProseLayout.svelte'
      }
    }),
    preprocessMeltUI()
  ]),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
      platform: 'node'
    }),
    alias: {
      $lib: 'src/lib'
    }
  }
};

export default config;
