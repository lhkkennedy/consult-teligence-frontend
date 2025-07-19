<script lang="ts">
	import Facebook from '@lucide/svelte/icons/facebook';
	import Instagram from '@lucide/svelte/icons/instagram';
	import Linkedin from '@lucide/svelte/icons/linkedin';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ThemeToggle from './ThemeToggle.svelte';
	import { user, logout, consultantId } from '../lib/stores/authStore.ts';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	let showProfileMenu = false;

	let isMenuOpen = false;
	let scrolled = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	function handleProfileClick() {
		showProfileMenu = !showProfileMenu;
	}

	function handleLogout() {
		logout();
		showProfileMenu = false;
		goto('/');
	}

	function handleViewProfile() {
		showProfileMenu = false;
		console.log($consultantId);
		if ($consultantId) {
			goto(`/experts/${$consultantId}`);
		} else {
			goto('/experts'); // fallback if no consultantId
		}
	}

	function handleFriends() {
		showProfileMenu = false;
		goto('/friends');
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-300 {scrolled
		? 'bg-white/95 shadow-sm backdrop-blur-sm dark:bg-transparent'
		: 'bg-white dark:bg-[#1E2130]'}"
>
	{#if !scrolled}
		<div class="h-full bg-accent-purple/80" transition:slide={{ duration: 300 }}>
			<div class="text-md mx-auto flex max-w-screen-2xl items-center p-2 text-white">
				<p class="text-md font-normal text-white">Global Property Experts on Call</p>
				<div class="flex-1"></div>
				<a
					href="https://facebook.com/YourPage"
					aria-label="Facebook"
					target="_blank"
					rel="noopener"
					class="text-white transition-colors hover:text-gray-200"
				>
					<Facebook size={20} />
				</a>
				<a
					href="https://instagram.com/YourProfile"
					aria-label="Instagram"
					target="_blank"
					rel="noopener"
					class="ml-4 text-white transition-colors hover:text-gray-200"
				>
					<Instagram size={20} />
				</a>
				<a
					href="https://linkedin.com/in/YourProfile"
					aria-label="LinkedIn"
					target="_blank"
					rel="noopener"
					class="ml-4 text-white transition-colors hover:text-gray-200"
				>
					<Linkedin size={20} />
				</a>
			</div>
		</div>
	{/if}
	<div class="flex items-center">
		<a
			href="/"
			class="mx-4 flex items-center rounded-full border-2 bg-[#1E2130] px-4 transition-colors duration-300 hover:border-accent-teal hover:shadow-xl dark:bg-transparent"
		>
			<img src="/propeterra_logo_transparent.png" alt="PropeTerra Logo" class="h-12" />
		</a>
		<div class="mx-2 h-10 w-px bg-gray-300 dark:bg-white/30"></div>
		<div class="container mx-auto flex items-center justify-between px-6 py-4">
			<!-- Brand -->
			<a href="/" class="text-2xl font-extrabold tracking-tight text-accent-purple dark:text-white">
				Consulteligence
			</a>

			<!-- Desktop nav -->
			<nav class="hidden space-x-10 md:flex">
				<a
					href="/"
					class="font-bold text-accent-purple transition hover:text-accent-purple/80 dark:text-accent-pink dark:hover:text-accent-pink/80"
					>Home</a
				>
				<a
					href="/experts"
					class="text-gray-700 transition hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
					>Experts</a
				>
				<a
					href="/knowledge"
					class="text-gray-700 transition hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
					>Knowledge</a
				>
				<a
					href="/about"
					class="text-gray-700 transition hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
					>About</a
				>
				<a
					href="/contact"
					class="text-gray-700 transition hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
					>Contact</a
				>
			</nav>

			<!-- Auth buttons (desktop) -->
			<div class="hidden items-center space-x-4 md:flex">
				{#if $user}
					<div class="relative">
						<button
							class="flex items-center space-x-2 rounded-full border-2 border-accent-purple bg-white px-4 py-2 font-semibold text-accent-purple transition hover:bg-accent-purple/10 dark:bg-[#23263a] dark:text-white"
							on:click={handleProfileClick}
							aria-label="Profile menu"
						>
							<span>{$user.username}</span>
							<img
								src="/propeterra_logo_transparent.png"
								alt="Profile"
								class="ml-2 h-8 w-8 rounded-full border border-gray-300 object-cover"
							/>
						</button>
						{#if showProfileMenu}
							<div
								class="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#23263a]"
							>
								<div class="py-1">
									<button
										class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
										on:click={handleViewProfile}>View Profile</button
									>
									<button
										class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
										on:click={() => {
											showProfileMenu = false;
											goto('/dashboard');
										}}>Dashboard</button
									>
									<button
										class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
										on:click={handleFriends}>My Network</button
									>
									<button
										class="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
										on:click={handleLogout}>Logout</button
									>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Login as a ghost button with hover underline and subtle background on hover -->
					<a
						href="/login"
						class="relative px-3 py-2 font-normal tracking-wide text-gray-700 transition before:absolute
                before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-accent-purple before:transition-all before:duration-300
                hover:bg-gray-100 hover:before:w-full dark:text-white dark:before:bg-white
                dark:hover:bg-white/10"
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
				{/if}
			</div>

			<!-- Theme toggle button (desktop) -->
			<div class="ml-4 hidden md:flex">
				<ThemeToggle />
			</div>

			<!-- Mobile toggle -->
			<button
				class="rounded p-2 text-gray-700 hover:text-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple dark:text-white dark:hover:text-accent-pink md:hidden"
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
				class="fixed inset-0 right-0 top-0 w-64 transform overflow-y-auto bg-white p-6 shadow-lg transition-transform dark:bg-[#1E2130] md:hidden"
				style="transform: translateX(0);"
			>
				<button
					class="mb-8 rounded p-1 text-gray-700 hover:text-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple dark:text-white dark:hover:text-accent-pink"
					on:click={toggleMenu}
				>
					<X size={24} />
				</button>
				<nav class="flex flex-col space-y-6">
					<a
						href="/"
						class="text-gray-800 hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
						>Home</a
					>
					<a
						href="/experts"
						class="text-gray-800 hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
						>Experts</a
					>
					<a
						href="/knowledge"
						class="text-gray-800 hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
						>Knowledge</a
					>
					<a
						href="/about"
						class="text-gray-800 hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
						>About</a
					>
					<a
						href="/contact"
						class="text-gray-800 hover:text-accent-purple dark:text-white dark:hover:text-accent-pink"
						>Contact</a
					>
				</nav>
				<div class="mt-8 space-y-4">
					{#if $user}
						<button
							class="block w-full rounded border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
							on:click={() => {
								handleViewProfile();
								toggleMenu();
							}}
						>
							View Profile
						</button>
						<button
							class="block w-full rounded border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
							on:click={() => {
								showProfileMenu = false;
								goto('/dashboard');
								toggleMenu();
							}}
						>
							Dashboard
						</button>
						<button
							class="block w-full rounded border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
							on:click={() => {
								handleFriends();
								toggleMenu();
							}}
						>
							My Network
						</button>
						<button
							class="block w-full rounded border border-red-500 px-4 py-2 text-center text-red-600 transition hover:bg-gray-100 dark:hover:bg-gray-800"
							on:click={() => {
								handleLogout();
								toggleMenu();
							}}
						>
							Logout
						</button>
					{:else}
						<a
							href="/login"
							class="block w-full rounded border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
						>
							Log In
						</a>
						<a
							href="/signup"
							class="block w-full rounded bg-accent-purple px-4 py-2 text-center text-white transition hover:bg-accent-purple/90"
						>
							Sign Up
						</a>
					{/if}
				</div>
				<!-- Theme toggle button (mobile) -->
				<div class="mt-6">
					<ThemeToggle />
				</div>
			</div>
		{/if}
	</div>
</header>
