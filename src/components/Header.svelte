<script lang="ts">
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ThemeToggle from './ThemeToggle.svelte';

	let isMenuOpen = false;
	let scrolled = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-300 {scrolled ? 'backdrop-blur-sm shadow-sm bg-white/95 dark:bg-transparent' : 'bg-white dark:bg-[#1E2130]'}"
>
	{#if !scrolled}
		<div class="h-full bg-accent-purple/80" transition:slide={{ y: -100, duration: 300 }}>
			<div class="text-md text-white mx-auto flex max-w-screen-2xl items-center p-2">
				<p class="text-md font-normal text-white">Global Property Experts on Call</p>
				<div class="flex-1"></div>
				<a
					href="https://facebook.com/YourPage"
					aria-label="Facebook"
					target="_blank"
					rel="noopener"
					class="text-white hover:text-gray-200 transition-colors"
				>
					<Facebook size={20} />
				</a>
				<a
					href="https://instagram.com/YourProfile"
					aria-label="Instagram"
					target="_blank"
					rel="noopener"
					class="ml-4 text-white hover:text-gray-200 transition-colors"
				>
					<Instagram size={20} />
				</a>
				<a
					href="https://linkedin.com/in/YourProfile"
					aria-label="LinkedIn"
					target="_blank"
					rel="noopener"
					class="ml-4 text-white hover:text-gray-200 transition-colors"
				>
					<Linkedin size={20} />
				</a>
			</div>
		</div>
	{/if}
	<div class="flex items-center">
		<a href="/" class="mx-4 px-4 rounded-full flex items-center bg-[#1E2130] dark:bg-transparent hover:border-accent-teal border-2 hover:shadow-xl transition-colors duration-300">
			<img src="/propeterra_logo_transparent.png" alt="PropeTerra Logo" class="h-12" />
		</a>
		<div class="mx-2 h-10 w-px bg-gray-300 dark:bg-white/30"></div>
		<div class="container mx-auto flex items-center justify-between px-6 py-4">
			<!-- Brand -->
			<a href="/" class="text-2xl font-extrabold tracking-tight text-accent-purple dark:text-white"> Consulteligence </a>

			<!-- Desktop nav -->
			<nav class="hidden space-x-10 md:flex">
				<a
					href="/"
					class="font-bold text-accent-purple dark:text-accent-pink transition hover:text-accent-purple/80 dark:hover:text-accent-pink/80"
				>Home</a
				>
				<a href="/experts" class="text-gray-700 dark:text-white transition hover:text-accent-purple dark:hover:text-accent-pink">Experts</a
				>
				<a href="/knowledge" class="text-gray-700 dark:text-white transition hover:text-accent-purple dark:hover:text-accent-pink"
					>Knowledge</a
				>
				<a href="/about" class="text-gray-700 dark:text-white transition hover:text-accent-purple dark:hover:text-accent-pink">About</a>
				<a href="/contact" class="text-gray-700 dark:text-white transition hover:text-accent-purple dark:hover:text-accent-pink">Contact</a
				>
			</nav>

			<!-- Auth buttons (desktop) -->
			<div class="hidden items-center space-x-4 md:flex">
				<!-- Login as a ghost button with hover underline and subtle background on hover -->
				<a
					href="/login"
					class="relative px-3 py-2 font-normal tracking-wide text-gray-700 dark:text-white transition
                before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-accent-purple dark:before:bg-white
                before:transition-all before:duration-300 hover:bg-gray-100 dark:hover:bg-white/10
                hover:before:w-full"
				>
					Log In
				</a>

				<!-- Sign Up as a rounded "pill" with a gradient, shadow & scale-on-hover -->
				<a
					href="/signup"
					class="transform rounded-full border-2 border-accent-purple bg-accent-purple px-6
                py-2
                font-normal tracking-wide text-white shadow-lg transition hover:scale-105 hover:border-accent-teal hover:shadow-xl"
				>
					Sign Up
				</a>
			</div>

			<!-- Theme toggle button (desktop) -->
			<div class="hidden md:flex ml-4">
				<ThemeToggle />
			</div>

			<!-- Mobile toggle -->
			<button
				class="rounded p-2 text-gray-700 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink focus:outline-none focus:ring-2 focus:ring-accent-purple md:hidden"
				on:click={toggleMenu}
				aria-label="Toggle menu"
			>
				{#if isMenuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>

		<!-- Mobile sliding drawer -->
		{#if isMenuOpen}
			<div
				class="fixed inset-0 right-0 top-0 w-64 transform overflow-y-auto bg-white dark:bg-[#1E2130] p-6 shadow-lg transition-transform md:hidden"
				style="transform: translateX(0);"
			>
				<button
					class="mb-8 rounded p-1 text-gray-700 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink focus:outline-none focus:ring-2 focus:ring-accent-purple"
					on:click={toggleMenu}
				>
					<X size={24} />
				</button>
				<nav class="flex flex-col space-y-6">
					<a href="/" class="text-gray-800 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink">Home</a>
					<a href="/experts" class="text-gray-800 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink">Experts</a>
					<a href="/knowledge" class="text-gray-800 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink">Knowledge</a>
					<a href="/about" class="text-gray-800 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink">About</a>
					<a href="/contact" class="text-gray-800 dark:text-white hover:text-accent-purple dark:hover:text-accent-pink">Contact</a>
				</nav>
				<div class="mt-8 space-y-4">
					<a
						href="/login"
						class="block w-full rounded border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-700 dark:text-white transition hover:bg-gray-100 dark:hover:bg-gray-800"
					>
						Log In
					</a>
					<a
						href="/signup"
						class="block w-full rounded bg-accent-purple px-4 py-2 text-center text-white transition hover:bg-accent-purple/90"
					>
						Sign Up
					</a>
				</div>
				<!-- Theme toggle button (mobile) -->
				<div class="mt-6">
					<ThemeToggle />
				</div>
			</div>
		{/if}
	</div>
</header>
