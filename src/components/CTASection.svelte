<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let isVisible = false;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#cta-section');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	});
</script>

<section id="cta-section" class="py-20 bg-gradient-to-r from-accent-purple to-accent-pink relative overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
	</div>

	<!-- Animated Elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
		<div class="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
		<div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-2000"></div>
	</div>

	<div class="container mx-auto px-6 relative z-10">
		{#if isVisible}
			<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center">
				<h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
					Ready to Join the Global Network?
				</h2>
				<p class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
					Connect with 2,500+ verified real estate experts across 190 countries. Start building your professional network today.
				</p>

				<div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
					<a
						href="/signup"
						class="group inline-flex items-center justify-center px-10 py-5 bg-white text-accent-purple font-bold text-xl rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
					>
						Get Started Free
						<svg class="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
						</svg>
					</a>
					
					<a
						href="/experts"
						class="group inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white font-bold text-xl rounded-full transition-all duration-300 hover:bg-white hover:text-accent-purple"
					>
						Browse Experts
						<svg class="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</a>
				</div>

				<!-- Benefits Grid -->
				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
					<div class="text-center">
						<div class="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<h3 class="text-white font-semibold text-lg mb-2">Free to Join</h3>
						<p class="text-white/80 text-sm">No upfront costs or hidden fees</p>
					</div>

					<div class="text-center">
						<div class="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
							</svg>
						</div>
						<h3 class="text-white font-semibold text-lg mb-2">Verified Experts</h3>
						<p class="text-white/80 text-sm">All professionals are thoroughly vetted</p>
					</div>

					<div class="text-center">
						<div class="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
							</svg>
						</div>
						<h3 class="text-white font-semibold text-lg mb-2">Instant Access</h3>
						<p class="text-white/80 text-sm">Start connecting immediately</p>
					</div>
				</div>

				<!-- Trust Badge -->
				<div in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }} class="mt-12 text-center">
					<p class="text-white/70 text-sm mb-4">Trusted by leading real estate professionals worldwide</p>
					<div class="flex justify-center items-center space-x-6 text-white/50">
						<div class="flex items-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
							</svg>
							<span class="text-sm">SSL Secured</span>
						</div>
						<div class="flex items-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
							</svg>
							<span class="text-sm">GDPR Compliant</span>
						</div>
						<div class="flex items-center">
							<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
							</svg>
							<span class="text-sm">24/7 Support</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>