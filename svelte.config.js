import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-netlify';
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
    // @ts-ignore - no idea why this is failing, compiles fine
    mdsvex({
      extensions: ['.md'],
      layout: 'src/lib/components/ProseLayout.svelte'
    }),
    preprocessMeltUI()
  ]),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};

export default config;
