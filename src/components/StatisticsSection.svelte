<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let isVisible = false;
	let animatedStats = {
		experts: 0,
		countries: 0,
		projects: 0,
		satisfaction: 0
	};

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					animateStats();
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#stats-section');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	});

	function animateStats() {
		const duration = 2000;
		const steps = 60;
		const stepDuration = duration / steps;

		let step = 0;
		const interval = setInterval(() => {
			step++;
			const progress = step / steps;
			
			animatedStats.experts = Math.floor(2500 * progress);
			animatedStats.countries = Math.floor(190 * progress);
			animatedStats.projects = Math.floor(15000 * progress);
			animatedStats.satisfaction = Math.floor(98 * progress);

			if (step >= steps) {
				clearInterval(interval);
			}
		}, stepDuration);
	}
</script>

<section id="stats-section" class="py-20 bg-gradient-to-r from-accent-purple/10 to-accent-pink/10">
	<div class="container mx-auto px-6">
		{#if isVisible}
			<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Trusted by Real Estate Professionals Worldwide
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Join thousands of experts who have already discovered the power of our global network
				</p>
			</div>

			<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-2 md:grid-cols-4 gap-8">
				<div class="text-center group">
					<div class="relative mb-4">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
							</svg>
						</div>
					</div>
					<div class="text-3xl md:text-4xl font-bold text-white mb-2">
						{animatedStats.experts.toLocaleString()}+
					</div>
					<div class="text-[#A0AEC0] text-lg">Active Experts</div>
				</div>

				<div class="text-center group">
					<div class="relative mb-4">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-teal to-accent-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
					</div>
					<div class="text-3xl md:text-4xl font-bold text-white mb-2">
						{animatedStats.countries}
					</div>
					<div class="text-[#A0AEC0] text-lg">Countries</div>
				</div>

				<div class="text-center group">
					<div class="relative mb-4">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-pink to-accent-coral rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
						</div>
					</div>
					<div class="text-3xl md:text-4xl font-bold text-white mb-2">
						{animatedStats.projects.toLocaleString()}+
					</div>
					<div class="text-[#A0AEC0] text-lg">Projects Completed</div>
				</div>

				<div class="text-center group">
					<div class="relative mb-4">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
					</div>
					<div class="text-3xl md:text-4xl font-bold text-white mb-2">
						{animatedStats.satisfaction}%
					</div>
					<div class="text-[#A0AEC0] text-lg">Satisfaction Rate</div>
				</div>
			</div>
		{/if}
	</div>
</section>