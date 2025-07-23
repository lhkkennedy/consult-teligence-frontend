<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import Users from '@lucide/svelte/icons/users';
	import Globe from '@lucide/svelte/icons/globe';
	import Target from '@lucide/svelte/icons/target';
	import Award from '@lucide/svelte/icons/award';
	import Building from '@lucide/svelte/icons/building';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Heart from '@lucide/svelte/icons/heart';
	import Shield from '@lucide/svelte/icons/shield';
	import Lightbulb from '@lucide/svelte/icons/lightbulb';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Calendar from '@lucide/svelte/icons/calendar';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';

	let isVisible = false;
	let animatedNumbers = { experts: 0, countries: 0, projects: 0, satisfaction: 0 };

	onMount(() => {
		setTimeout(() => {
			isVisible = true;
		}, 100);

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
				animatedNumbers.satisfaction = Math.floor(98 * progress);

				if (step >= steps) {
					clearInterval(interval);
				}
			}, stepDuration);
		};

		setTimeout(animateNumbers, 1000);
	});

	function handleCTAClick() {
		goto('/signup');
	}

	function handleContactClick() {
		goto('/contact');
	}
</script>

<main class="flex-grow">
	<!-- Hero Section -->
	<section class="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed"
		style="background-image: linear-gradient(135deg, rgba(20, 13, 74, 0.9) 0%, rgba(105, 68, 141, 0.8) 100%), url('/propeterra-background-img.png')">
		
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
						About Consulteligence
					</h1>
				</div>

				<div in:fly={{ y: 50, duration: 800, delay: 200, easing: quintOut }} out:fade>
					<p class="mx-auto mb-12 max-w-4xl text-xl md:text-2xl text-[#A0AEC0] leading-relaxed">
						Connecting real estate professionals worldwide through innovative technology and trusted expertise. 
						We're building the future of global property consulting.
					</p>
				</div>

				<div in:fly={{ y: 50, duration: 800, delay: 400, easing: quintOut }} out:fade class="flex flex-col sm:flex-row gap-4 mb-16">
					<button
						on:click={handleCTAClick}
						class="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
					>
						<span class="relative z-10">Join Our Network</span>
						<div class="absolute inset-0 bg-gradient-to-r from-accent-pink to-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</button>
					
					<button
						on:click={handleContactClick}
						class="group inline-flex items-center justify-center px-8 py-4 border-2 border-accent-teal text-accent-teal font-semibold text-lg rounded-full transition-all duration-300 hover:bg-accent-teal hover:text-white hover:scale-105"
					>
						Get in Touch
						<ArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
					</button>
				</div>

				<!-- Statistics -->
				<div in:fly={{ y: 50, duration: 800, delay: 600, easing: quintOut }} out:fade class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
					<div class="text-center">
						<div class="text-3xl md:text-4xl font-bold text-white mb-2">
							{animatedNumbers.experts.toLocaleString()}+
						</div>
						<div class="text-[#A0AEC0] text-sm md:text-base">Active Experts</div>
					</div>
					<div class="text-center">
						<div class="text-3xl md:text-4xl font-bold text-white mb-2">
							{animatedNumbers.countries}
						</div>
						<div class="text-[#A0AEC0] text-sm md:text-base">Countries</div>
					</div>
					<div class="text-center">
						<div class="text-3xl md:text-4xl font-bold text-white mb-2">
							{animatedNumbers.projects.toLocaleString()}+
						</div>
						<div class="text-[#A0AEC0] text-sm md:text-base">Projects</div>
					</div>
					<div class="text-center">
						<div class="text-3xl md:text-4xl font-bold text-white mb-2">
							{animatedNumbers.satisfaction}%
						</div>
						<div class="text-[#A0AEC0] text-sm md:text-base">Satisfaction</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Mission & Vision Section -->
	<section class="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
		<div class="container mx-auto px-6">
			{#if isVisible}
				<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Our Mission & Vision
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						We're transforming how real estate professionals connect, collaborate, and succeed globally
					</p>
				</div>

				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<!-- Mission -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-8 border border-accent-purple/20 hover:border-accent-purple/40 transition-all duration-300">
						<div class="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center mb-6">
							<Target class="w-8 h-8 text-white" />
						</div>
						<h3 class="text-2xl font-bold text-white mb-4">Our Mission</h3>
						<p class="text-[#A0AEC0] leading-relaxed">
							To democratize access to real estate expertise by connecting property professionals worldwide through 
							innovative technology, fostering knowledge sharing, and enabling successful collaborations across borders.
						</p>
					</div>

					<!-- Vision -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-8 border border-accent-teal/20 hover:border-accent-teal/40 transition-all duration-300">
						<div class="w-16 h-16 bg-gradient-to-br from-accent-teal to-accent-blue rounded-full flex items-center justify-center mb-6">
							<Globe class="w-8 h-8 text-white" />
						</div>
						<h3 class="text-2xl font-bold text-white mb-4">Our Vision</h3>
						<p class="text-[#A0AEC0] leading-relaxed">
							To become the world's leading platform for real estate expertise, where every property professional 
							can access global knowledge, build meaningful connections, and achieve unprecedented success.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Values Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6">
			{#if isVisible}
				<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Our Core Values
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						The principles that guide everything we do and every connection we facilitate
					</p>
				</div>

				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<Shield class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Trust & Integrity</h3>
						<p class="text-[#A0AEC0]">
							We maintain the highest standards of trust and integrity in all our interactions and connections.
						</p>
					</div>

					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-teal to-accent-blue rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<Users class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Global Collaboration</h3>
						<p class="text-[#A0AEC0]">
							We believe in the power of global collaboration and knowledge sharing across borders.
						</p>
					</div>

					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-pink to-accent-coral rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<Lightbulb class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Innovation</h3>
						<p class="text-[#A0AEC0]">
							We continuously innovate to provide cutting-edge solutions for real estate professionals.
						</p>
					</div>

					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<Heart class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Excellence</h3>
						<p class="text-[#A0AEC0]">
							We strive for excellence in every aspect of our platform and services.
						</p>
					</div>

					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-coral to-accent-pink rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<Building class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Professional Growth</h3>
						<p class="text-[#A0AEC0]">
							We're committed to fostering professional growth and development for our community.
						</p>
					</div>

					<div class="text-center group">
						<div class="w-20 h-20 mx-auto bg-gradient-to-br from-accent-purple to-accent-teal rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
							<TrendingUp class="w-10 h-10 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white mb-4">Sustainable Success</h3>
						<p class="text-[#A0AEC0]">
							We promote sustainable business practices and long-term success for our partners.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Company Timeline Section -->
	<section class="py-20 bg-gradient-to-b from-secondary-bg to-primary-bg">
		<div class="container mx-auto px-6">
			{#if isVisible}
				<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Our Journey
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						From a simple idea to a global platform connecting real estate professionals worldwide
					</p>
				</div>

				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="relative">
					<!-- Timeline line -->
					<div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-purple to-accent-pink"></div>

					<!-- Timeline items -->
					<div class="space-y-12">
						<!-- 2020 -->
						<div class="relative flex items-center">
							<div class="w-1/2 pr-8 text-right">
								<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-purple/20">
									<div class="flex items-center justify-end mb-2">
										<Calendar class="w-5 h-5 text-accent-purple mr-2" />
										<span class="text-accent-purple font-semibold">2020</span>
									</div>
									<h3 class="text-xl font-bold text-white mb-2">Foundation</h3>
									<p class="text-[#A0AEC0]">
										Consulteligence was founded with a vision to connect real estate professionals globally.
									</p>
								</div>
							</div>
							<div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-purple rounded-full border-4 border-white"></div>
							<div class="w-1/2 pl-8"></div>
						</div>

						<!-- 2021 -->
						<div class="relative flex items-center">
							<div class="w-1/2 pr-8"></div>
							<div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-teal rounded-full border-4 border-white"></div>
							<div class="w-1/2 pl-8">
								<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-teal/20">
									<div class="flex items-center mb-2">
										<Calendar class="w-5 h-5 text-accent-teal mr-2" />
										<span class="text-accent-teal font-semibold">2021</span>
									</div>
									<h3 class="text-xl font-bold text-white mb-2">Platform Launch</h3>
									<p class="text-[#A0AEC0]">
										Successfully launched our platform with 100+ experts from 25 countries.
									</p>
								</div>
							</div>
						</div>

						<!-- 2022 -->
						<div class="relative flex items-center">
							<div class="w-1/2 pr-8 text-right">
								<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-pink/20">
									<div class="flex items-center justify-end mb-2">
										<Calendar class="w-5 h-5 text-accent-pink mr-2" />
										<span class="text-accent-pink font-semibold">2022</span>
									</div>
									<h3 class="text-xl font-bold text-white mb-2">Global Expansion</h3>
									<p class="text-[#A0AEC0]">
										Expanded to 100+ countries with 1,000+ verified experts on the platform.
									</p>
								</div>
							</div>
							<div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-pink rounded-full border-4 border-white"></div>
							<div class="w-1/2 pl-8"></div>
						</div>

						<!-- 2023 -->
						<div class="relative flex items-center">
							<div class="w-1/2 pr-8"></div>
							<div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-blue rounded-full border-4 border-white"></div>
							<div class="w-1/2 pl-8">
								<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-blue/20">
									<div class="flex items-center mb-2">
										<Calendar class="w-5 h-5 text-accent-blue mr-2" />
										<span class="text-accent-blue font-semibold">2023</span>
									</div>
									<h3 class="text-xl font-bold text-white mb-2">Innovation Milestone</h3>
									<p class="text-[#A0AEC0]">
										Launched advanced AI-powered matching and knowledge sharing features.
									</p>
								</div>
							</div>
						</div>

						<!-- 2024 -->
						<div class="relative flex items-center">
							<div class="w-1/2 pr-8 text-right">
								<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-coral/20">
									<div class="flex items-center justify-end mb-2">
										<Calendar class="w-5 h-5 text-accent-coral mr-2" />
										<span class="text-accent-coral font-semibold">2024</span>
									</div>
									<h3 class="text-xl font-bold text-white mb-2">Market Leadership</h3>
									<p class="text-[#A0AEC0]">
										Became the leading global platform with 2,500+ experts across 190 countries.
									</p>
								</div>
							</div>
							<div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-coral rounded-full border-4 border-white"></div>
							<div class="w-1/2 pl-8"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Team Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6">
			{#if isVisible}
				<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Meet Our Team
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						The passionate individuals behind Consulteligence who are dedicated to transforming global real estate
					</p>
				</div>

				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<!-- Team Member 1 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-purple/20 hover:border-accent-purple/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full mx-auto mb-4 flex items-center justify-center">
							<Users class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">Sarah Johnson</h3>
						<p class="text-accent-purple text-center mb-4">CEO & Founder</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							Former real estate executive with 15+ years of global property experience.
						</p>
					</div>

					<!-- Team Member 2 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-teal/20 hover:border-accent-teal/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-teal to-accent-blue rounded-full mx-auto mb-4 flex items-center justify-center">
							<Building class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">Michael Chen</h3>
						<p class="text-accent-teal text-center mb-4">CTO</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							Technology leader with expertise in AI and global platform development.
						</p>
					</div>

					<!-- Team Member 3 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-pink/20 hover:border-accent-pink/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-pink to-accent-coral rounded-full mx-auto mb-4 flex items-center justify-center">
							<Globe class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">Elena Rodriguez</h3>
						<p class="text-accent-pink text-center mb-4">Head of Global Operations</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							International business expert with deep knowledge of global markets.
						</p>
					</div>

					<!-- Team Member 4 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-blue/20 hover:border-accent-blue/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-teal rounded-full mx-auto mb-4 flex items-center justify-center">
							<Heart class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">David Kim</h3>
						<p class="text-accent-blue text-center mb-4">Head of Community</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							Community building specialist focused on expert engagement and growth.
						</p>
					</div>

					<!-- Team Member 5 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-coral/20 hover:border-accent-coral/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-coral to-accent-purple rounded-full mx-auto mb-4 flex items-center justify-center">
							<TrendingUp class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">Lisa Thompson</h3>
						<p class="text-accent-coral text-center mb-4">VP of Growth</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							Growth strategist with proven track record in scaling global platforms.
						</p>
					</div>

					<!-- Team Member 6 -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-purple/20 hover:border-accent-purple/40 transition-all duration-300 group">
						<div class="w-24 h-24 bg-gradient-to-br from-accent-purple to-accent-teal rounded-full mx-auto mb-4 flex items-center justify-center">
							<Award class="w-12 h-12 text-white" />
						</div>
						<h3 class="text-xl font-bold text-white text-center mb-2">James Wilson</h3>
						<p class="text-accent-purple text-center mb-4">Head of Quality</p>
						<p class="text-[#A0AEC0] text-center text-sm">
							Quality assurance expert ensuring the highest standards for our expert network.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Contact Section -->
	<section class="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
		<div class="container mx-auto px-6">
			{#if isVisible}
				<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
					<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
						Get in Touch
					</h2>
					<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
						Ready to join our global network? We'd love to hear from you and answer any questions.
					</p>
				</div>

				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<!-- Contact Info -->
					<div class="space-y-8">
						<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-purple/20">
							<div class="flex items-center mb-4">
								<MapPin class="w-6 h-6 text-accent-purple mr-3" />
								<h3 class="text-xl font-bold text-white">Our Office</h3>
							</div>
							<p class="text-[#A0AEC0]">
								123 Real Estate Avenue<br>
								New York, NY 10001<br>
								United States
							</p>
						</div>

						<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-teal/20">
							<div class="flex items-center mb-4">
								<Mail class="w-6 h-6 text-accent-teal mr-3" />
								<h3 class="text-xl font-bold text-white">Email Us</h3>
							</div>
							<p class="text-[#A0AEC0]">
								info@consulteligence.com<br>
								support@consulteligence.com
							</p>
						</div>

						<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-pink/20">
							<div class="flex items-center mb-4">
								<Phone class="w-6 h-6 text-accent-pink mr-3" />
								<h3 class="text-xl font-bold text-white">Call Us</h3>
							</div>
							<p class="text-[#A0AEC0]">
								+1 (555) 123-4567<br>
								Mon-Fri: 9AM-6PM EST
							</p>
						</div>
					</div>

					<!-- Contact Form -->
					<div class="bg-[#1E2130]/50 backdrop-blur-sm rounded-2xl p-8 border border-accent-blue/20">
						<h3 class="text-2xl font-bold text-white mb-6">Send us a Message</h3>
						<form class="space-y-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<input
									type="text"
									placeholder="First Name"
									class="w-full px-4 py-3 bg-[#1E2130] border border-[#2D3748] rounded-lg text-white placeholder-[#A0AEC0] focus:border-accent-purple focus:outline-none transition-colors"
								/>
								<input
									type="text"
									placeholder="Last Name"
									class="w-full px-4 py-3 bg-[#1E2130] border border-[#2D3748] rounded-lg text-white placeholder-[#A0AEC0] focus:border-accent-purple focus:outline-none transition-colors"
								/>
							</div>
							<input
								type="email"
								placeholder="Email Address"
								class="w-full px-4 py-3 bg-[#1E2130] border border-[#2D3748] rounded-lg text-white placeholder-[#A0AEC0] focus:border-accent-purple focus:outline-none transition-colors"
							/>
							<select class="w-full px-4 py-3 bg-[#1E2130] border border-[#2D3748] rounded-lg text-white focus:border-accent-purple focus:outline-none transition-colors">
								<option value="">Select Inquiry Type</option>
								<option value="partnership">Partnership</option>
								<option value="expert-registration">Expert Registration</option>
								<option value="support">Support</option>
								<option value="general">General Inquiry</option>
							</select>
							<textarea
								placeholder="Your Message"
								rows="4"
								class="w-full px-4 py-3 bg-[#1E2130] border border-[#2D3748] rounded-lg text-white placeholder-[#A0AEC0] focus:border-accent-purple focus:outline-none transition-colors resize-none"
							></textarea>
							<button
								type="submit"
								class="w-full px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
							>
								Send Message
							</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</section>
</main>