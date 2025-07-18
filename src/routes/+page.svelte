<script lang="ts">
	import Hero from '../components/Hero.svelte';
	import ExpertSearchResults from '../components/ExpertSearchResults.svelte';
	import WorldMap from '../components/WorldMap.svelte';
	import TagExplorer from '../components/TagExplorer.svelte';
	import KnowledgeCenter from '../components/KnowledgeCenter.svelte';
	import type { Consultant } from '$lib/types.ts';
	import { goto } from '$app/navigation';
	// import { load as loadExperts } from '/experts/+page.svelte'

	export let data: { featured: Consultant[] };
	const { featured } = data;
	// similarly for other filters
	let selectedRegion: string | null = null;
	let selectedCountry: string | null = null;

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
</script>

<main class="flex-grow py-8 pt-24">
	<Hero
		title="Connect with Real Estate Experts Worldwide"
		subtitle="Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas."
		ctaText="Find an Expert"
		ctaLink="/experts"
		className="mb-16"
	/>
	<div class="container mx-auto p-6">
		<section class="mb-16">
			<h2 class="mb-8 text-center font-heading text-2xl font-semibold text-white">
				Featured Experts
			</h2>
			<ExpertSearchResults
				consultants={featured}
				onExpertSelect={handleExpertSelect}
				containerClass="grid grid-cols-1 md:grid-cols-3 gap-8"
			/>
			<div class="mt-16 text-center">
				<a href="/experts" class="btn btn-primary"> View All Experts </a>
			</div>
		</section>

		<section class="mb-16">
			<h2 class="mb-8 text-center font-heading text-2xl font-semibold text-white">
				Explore by Location
			</h2>
			<div class="mb-12">
				<WorldMap
					on:regionSelect={handleRegionSelect}
					on:countrySelect={handleCountrySelect}
					{selectedRegion}
					{selectedCountry}
				/>
			</div>
		</section>

		<section class="mb-16">
			<h2 class="mb-8 text-center font-heading text-2xl font-semibold text-white">
				Explore by Tag
			</h2>
			<TagExplorer
				on:regionSelect={handleRegionSelect}
				on:countrySelect={handleCountrySelect}
				{selectedRegion}
				{selectedCountry}
			/>
		</section>

		<section class="mb-16">
			<h2 class="mb-4 text-center font-heading text-xl font-semibold text-white">
				Knowledge Center
			</h2>
			<p class="mx-auto mb-12 max-w-3xl text-center text-[#A0AEC0]">
				Explore expert insights, market trends, and in-depth analysis from our global network of
				real estate professionals.
			</p>
			<KnowledgeCenter on:articleSelect={handleArticleSelect} />
		</section>
	</div>
</main>
