<script lang="ts">
	import { theme, toggleTheme } from '../lib/theme.js';
	import { onMount } from 'svelte';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';

	let currentTheme: 'light' | 'dark' = 'dark';
	const unsubscribe = theme.subscribe((val: 'light' | 'dark') => (currentTheme = val));
	onMount(() => () => unsubscribe());
</script>

<button
	class="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:text-gray-900 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white"
	on:click={toggleTheme}
	aria-label="Toggle dark/light mode"
>
	{#if currentTheme === 'dark'}
		<Moon size={18} />
	{:else}
		<Sun size={18} />
	{/if}
</button>
