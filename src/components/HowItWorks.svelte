<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let isVisible = false;

	const steps = [
		{
			number: '01',
			title: 'Create Your Profile',
			description: 'Sign up and build your professional profile showcasing your expertise, experience, and achievements in real estate.',
			icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		},
		{
			number: '02',
			title: 'Connect with Experts',
			description: 'Browse our global network of verified real estate professionals and connect with experts in your field or target markets.',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
		},
		{
			number: '03',
			title: 'Share Knowledge',
			description: 'Contribute to the community by sharing insights, market analysis, and participating in discussions with fellow professionals.',
			icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
		},
		{
			number: '04',
			title: 'Grow Your Network',
			description: 'Build lasting professional relationships, discover new opportunities, and expand your influence in the global real estate market.',
			icon: 'M13 10V3L4 14h7v7l9-11h-7z'
		}
	];

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#how-it-works');
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

<section id="how-it-works" class="py-20 bg-[#1E2130]">
	<div class="container mx-auto px-6">
		{#if isVisible}
			<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					How It Works
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Join our global network of real estate professionals in just four simple steps
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each steps as step, index}
					<div 
						in:fly={{ y: 30, duration: 600, delay: index * 200, easing: quintOut }}
						class="relative group"
					>
						<!-- Connection line -->
						{#if index < steps.length - 1}
							<div class="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-accent-purple to-accent-pink transform -translate-y-1/2 z-0"></div>
						{/if}

						<div class="relative z-10 bg-[#2D3748] rounded-2xl p-8 h-full group-hover:bg-gradient-to-br group-hover:from-accent-purple/20 group-hover:to-accent-pink/20 transition-all duration-300 group-hover:scale-105">
							<div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
								<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={step.icon}></path>
								</svg>
							</div>
							
							<div class="text-2xl font-bold text-accent-purple mb-4">
								{step.number}
							</div>
							
							<h3 class="text-xl font-semibold text-white mb-4">
								{step.title}
							</h3>
							
							<p class="text-[#A0AEC0] leading-relaxed">
								{step.description}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<div in:fly={{ y: 30, duration: 600, delay: 800, easing: quintOut }} class="text-center mt-16">
				<a 
					href="/signup" 
					class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
				>
					Get Started Today
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
					</svg>
				</a>
			</div>
		{/if}
	</div>
</section>