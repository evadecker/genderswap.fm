import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			layout: {
				about: './src/routes/about/prose.svelte'
			}
		})
	]
};

export default config;
