<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let title = 'Connect with Real Estate Experts Worldwide';
	export let subtitle = 'Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas. Join the global network of property professionals.';
	export let ctaText = 'Find an Expert';
	export let ctaLink = '/experts';
	export let secondaryCtaText = 'Join the Network';
	export let secondaryCtaLink = '/signup';
	export let className = '';

	let isVisible = false;
	let animatedNumbers = { experts: 0, countries: 0, projects: 0 };

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 300);

		// Animate numbers
		const animateNumbers = () => {
			const duration = 2000;
			const steps = 60;
			const stepDuration = duration / steps;

			let step = 0;
			const interval = setInterval(() => {
				step++;
				const progress = step / steps;
				
				animatedNumbers.experts = Math.floor(2500 * progress);
				animatedNumbers.countries = Math.floor(190 * progress);
				animatedNumbers.projects = Math.floor(15000 * progress);

				if (step >= steps) {
					clearInterval(interval);
				}
			}, stepDuration);
		};

		setTimeout(animateNumbers, 1000);
	});
</script>

<section
	class="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed {className}"
	style="background-image: linear-gradient(135deg, rgba(20, 13, 74, 0.9) 0%, rgba(105, 68, 141, 0.8) 100%), url('/propeterra-background-img.png')"
>
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-20 left-10 w-20 h-20 bg-accent-purple/20 rounded-full blur-xl animate-pulse"></div>
		<div class="absolute top-40 right-20 w-32 h-32 bg-accent-teal/20 rounded-full blur-xl animate-pulse delay-1000"></div>
		<div class="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-pink/20 rounded-full blur-xl animate-pulse delay-2000"></div>
		<div class="absolute bottom-40 right-1/3 w-24 h-24 bg-accent-blue/20 rounded-full blur-xl animate-pulse delay-3000"></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
		{#if isVisible}
			<div in:fly={{ y: 50, duration: 800, easing: quintOut }} out:fade>
				<h1 class="mb-6 text-5xl md:text-7xl font-bold text-white leading-tight">
					{title}
				</h1>
			</div>

			<div in:fly={{ y: 50, duration: 800, delay: 200, easing: quintOut }} out:fade>
				<p class="mx-auto mb-12 max-w-4xl text-xl md:text-2xl text-[#A0AEC0] leading-relaxed">
					{subtitle}
				</p>
			</div>

			<div in:fly={{ y: 50, duration: 800, delay: 400, easing: quintOut }} out:fade class="flex flex-col sm:flex-row gap-4 mb-16">
				<a
					href={ctaLink}
					class="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
				>
					<span class="relative z-10">{ctaText}</span>
					<div class="absolute inset-0 bg-gradient-to-r from-accent-pink to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				</a>
				
				<a
					href={secondaryCtaLink}
					class="group inline-flex items-center justify-center px-8 py-4 border-2 border-accent-teal text-accent-teal font-semibold text-lg rounded-full transition-all duration-300 hover:bg-accent-teal hover:text-white hover:scale-105"
				>
					{secondaryCtaText}
					<svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
					</svg>
				</a>
			</div>

			<!-- Statistics -->
			<div in:fly={{ y: 50, duration: 800, delay: 600, easing: quintOut }} out:fade class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-white mb-2">
						{animatedNumbers.experts.toLocaleString()}+
					</div>
					<div class="text-[#A0AEC0] text-lg">Active Experts</div>
				</div>
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-white mb-2">
						{animatedNumbers.countries}
					</div>
					<div class="text-[#A0AEC0] text-lg">Countries</div>
				</div>
				<div class="text-center">
					<div class="text-4xl md:text-5xl font-bold text-white mb-2">
						{animatedNumbers.projects.toLocaleString()}+
					</div>
					<div class="text-[#A0AEC0] text-lg">Projects Completed</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
		<div class="animate-bounce">
			<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
			</svg>
		</div>
	</div>
</section>
