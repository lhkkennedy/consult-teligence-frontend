<script lang="ts">
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

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
	class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
	class:backdrop-blur-sm={scrolled}
	class:shadow-sm={scrolled}
	class:bg-transparent={scrolled}
	class:bg-primary-bg={!scrolled}
>
	{#if !scrolled}
		<div class="h-full bg-accent-purple" transition:slide={{ y: -100, duration: 300 }}>
			<div class="text-md text-whit mx-auto flex max-w-screen-2xl items-center p-2">
				<p class="text-md font-normal text-text-primary">Global Property Experts on Call</p>
				<div class="flex-1"></div>
				<a
					href="https://facebook.com/YourPage"
					aria-label="Facebook"
					target="_blank"
					rel="noopener"
				>
					<Facebook size={20} />
				</a>
				<a
					href="https://instagram.com/YourProfile"
					aria-label="Instagram"
					target="_blank"
					rel="noopener"
					class="ml-4"
				>
					<Instagram size={20} />
				</a>
				<a
					href="https://linkedin.com/in/YourProfile"
					aria-label="LinkedIn"
					target="_blank"
					rel="noopener"
					class="ml-4"
				>
					<Linkedin size={20} />
				</a>
			</div>
		</div>
	{/if}
	<div class="flex items-center">
		<a href="/" class="mx-4 flex items-center">
			<img src="/propeterra_logo_transparent.png" alt="PropeTerra Logo" class="h-10" />
		</a>
		<div class="mx-2 h-10 w-px bg-white/30"></div>
		<div class="container mx-auto flex items-center justify-between px-6 py-4">
			<!-- Brand -->
			<a href="/" class="text-2xl font-extrabold tracking-tight text-white"> Consulteligence </a>

			<!-- Desktop nav -->
			<nav class="hidden space-x-10 md:flex">
				<a
					href="/"
					class="font-bold text-accent-pink transition hover:text-text-secondary"
					on:click|preventDefault={() => {
						onHomeClick();
						window.location.href = '/';
					}}>Home</a
				>
				<a href="/experts" class="text-text-primary transition hover:text-text-secondary">Experts</a
				>
				<a href="/knowledge" class="text-text-primary transition hover:text-text-secondary"
					>Knowledge</a
				>
				<a href="/about" class="text-text-primary transition hover:text-text-secondary">About</a>
				<a href="/contact" class="text-text-primary transition hover:text-text-secondary">Contact</a
				>
			</nav>

			<!-- Auth buttons (desktop) -->
			<div class="hidden items-center space-x-4 md:flex">
				<!-- Login as a ghost button with hover underline and subtle background on hover -->
				<a
					href="/login"
					class="relative px-3 py-2 font-normal tracking-wide text-white transition
                before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-white
                before:transition-all before:duration-300 hover:bg-white/10
                hover:before:w-full"
				>
					Log In
				</a>

				<!-- Sign Up as a rounded “pill” with a gradient, shadow & scale-on-hover -->
				<a
					href="/signup"
					class="transform rounded-full border-2 border-accent-purple bg-accent-purple px-6
                py-2
                font-normal tracking-wide text-white shadow-lg transition hover:scale-105 hover:border-accent-teal hover:shadow-xl"
				>
					Sign Up
				</a>
			</div>

			<!-- Mobile toggle -->
			<button
				class="rounded p-2 text-gray-900 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:hidden"
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
				class="fixed inset-0 right-0 top-0 w-64 transform overflow-y-auto bg-white p-6 shadow-lg transition-transform md:hidden"
				style="transform: translateX(0);"
			>
				<button
					class="mb-8 rounded p-1 text-gray-900 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
					on:click={toggleMenu}
				>
					<X size={24} />
				</button>
				<nav class="flex flex-col space-y-6">
					<a href="/" class="text-gray-800 hover:text-indigo-600">Home</a>
					<a href="/experts" class="text-gray-800 hover:text-indigo-600">Experts</a>
					<a href="/knowledge" class="text-gray-800 hover:text-indigo-600">Knowledge</a>
					<a href="/about" class="text-gray-800 hover:text-indigo-600">About</a>
					<a href="/contact" class="text-gray-800 hover:text-indigo-600">Contact</a>
				</nav>
				<div class="mt-8 space-y-4">
					<a
						href="/login"
						class="block w-full rounded border border-gray-300 px-4 py-2 text-center transition hover:bg-gray-100"
					>
						Log In
					</a>
					<a
						href="/signup"
						class="block w-full rounded bg-indigo-600 px-4 py-2 text-center text-white transition hover:bg-indigo-700"
					>
						Sign Up
					</a>
				</div>
			</div>
		{/if}
	</div>
</header>
