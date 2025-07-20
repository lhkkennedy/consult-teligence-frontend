<script lang="ts">
	import { onMount } from 'svelte';
	import Hero from '../components/Hero.svelte';
	import ExpertSearchResults from '../components/ExpertSearchResults.svelte';
	import WorldMap from '../components/WorldMap.svelte';
	import TagExplorer from '../components/TagExplorer.svelte';
	import KnowledgeCenter from '../components/KnowledgeCenter.svelte';
	import StatisticsSection from '../components/StatisticsSection.svelte';
	import HowItWorks from '../components/HowItWorks.svelte';
	import TestimonialsSection from '../components/TestimonialsSection.svelte';
	import CTASection from '../components/CTASection.svelte';
	import type { Consultant } from '$lib/types.ts';
	import { goto } from '$app/navigation';

	export let data: { featured: Consultant[] };
	const { featured } = data;

	let selectedRegion: string | null = null;
	let selectedCountry: string | null = null;
	let isVisible = false;

	function handleExpertSelect(id: string) {
		goto(`/experts/${id}`);
	}

	function handleRegionSelect(event: CustomEvent<string>) {
		selectedRegion = event.detail;
	}

	function handleCountrySelect(event: CustomEvent<string>) {
		selectedCountry = event.detail;
	}

	function handleArticleSelect(event: CustomEvent<string>) {
		console.log(`Selected article: ${event.detail}`);
	}

	onMount(() => {
		// Trigger animations when page loads
		setTimeout(() => {
			isVisible = true;
		}, 100);
	});
</script>

<main class="flex-grow">
	<!-- Enhanced Hero Section -->
	<Hero
		title="Connect with Real Estate Experts Worldwide"
		subtitle="Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas. Join the global network of property professionals."
		ctaText="Find an Expert"
		ctaLink="/experts"
		secondaryCtaText="Join the Network"
		secondaryCtaLink="/signup"
		className="mb-0"
	/>

	<!-- Statistics Section -->
	<StatisticsSection />

	<!-- How It Works Section -->
	<HowItWorks />

	<!-- Featured Experts Section -->
	<section class="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
		<div class="container mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Featured Experts
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Discover top real estate professionals from around the world. Each expert brings unique insights and proven track records.
				</p>
			</div>
			
			<ExpertSearchResults
				consultants={featured}
				onExpertSelect={handleExpertSelect}
				containerClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
			/>
			
			<div class="text-center">
				<a 
					href="/experts" 
					class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
				>
					View All Experts
					<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<!-- Interactive World Map Section -->
	<section class="py-20 bg-[#1E2130]">
		<div class="container mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Global Network Coverage
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Our network spans across 190 countries with experts in every major real estate market worldwide.
				</p>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
				<div class="lg:col-span-2">
					<WorldMap
						on:regionSelect={handleRegionSelect}
						on:countrySelect={handleCountrySelect}
						{selectedRegion}
						{selectedCountry}
					/>
				</div>
				<div class="space-y-6">
					<div class="bg-[#2D3748] rounded-lg p-6">
						<h3 class="text-xl font-semibold text-white mb-4">Network Statistics</h3>
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="text-[#A0AEC0]">Countries Covered</span>
								<span class="text-white font-bold">190</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-[#A0AEC0]">Expert Categories</span>
								<span class="text-white font-bold">13</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-[#A0AEC0]">Active Experts</span>
								<span class="text-white font-bold">2,500+</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-[#A0AEC0]">Projects Completed</span>
								<span class="text-white font-bold">15,000+</span>
							</div>
						</div>
					</div>
					
					<div class="bg-[#2D3748] rounded-lg p-6">
						<h3 class="text-xl font-semibold text-white mb-4">Quick Search</h3>
						<TagExplorer
							on:regionSelect={handleRegionSelect}
							on:countrySelect={handleCountrySelect}
							{selectedRegion}
							{selectedCountry}
						/>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<TestimonialsSection />

	<!-- Knowledge Center Section -->
	<section class="py-20 bg-gradient-to-b from-secondary-bg to-primary-bg">
		<div class="container mx-auto px-6">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					Knowledge Center
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Stay ahead with expert insights, market trends, and in-depth analysis from our global network of real estate professionals.
				</p>
			</div>
			
			<KnowledgeCenter on:articleSelect={handleArticleSelect} />
			
			<div class="text-center mt-12">
				<a 
					href="/knowledge" 
					class="inline-flex items-center px-6 py-3 border-2 border-accent-teal text-accent-teal font-semibold rounded-full transition-all duration-300 hover:bg-accent-teal hover:text-white"
				>
					Explore All Articles
					<svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
					</svg>
				</a>
			</div>
		</div>
	</section>

	<!-- Call to Action Section -->
	<CTASection />
</main>
