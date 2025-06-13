// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import sveltePreprocess from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config = {
	// Tell Svelte to run PostCSS (and thus Tailwind) on <style> blocks
	preprocess: sveltePreprocess({
		postcss: {
			plugins: [tailwindcss(), autoprefixer()]
		}
	}),

	kit: {
		adapter: adapter()
	}
};

export default config;
