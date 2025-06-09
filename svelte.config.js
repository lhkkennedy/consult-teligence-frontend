// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import sveltePreprocess from 'svelte-preprocess';

const config = {
  // Tell Svelte to run PostCSS (and thus Tailwind) on <style> blocks
  preprocess: sveltePreprocess({
    postcss: true
  }),

  kit: {
    adapter: adapter()
  }
};

export default config;