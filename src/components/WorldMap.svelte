<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { regions, countries, specialties } from '$lib/mockData.js';
	import type { Region, Country, Specialty, SearchFilters } from '$lib/types.ts';

	export let selectedRegion: Region | null = null;
	export let selectedCountry: Country | null = null;

	let isVisible = false;
	let hoveredRegion: string | null = null;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#world-map');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	});

	function handleRegionClick(region: Region) {
		selectedRegion = region;
		selectedCountry = null;
	}

	function handleCountryClick(country: Country) {
		selectedCountry = country;
	}

	function getRegionColor(region: Region) {
		if (selectedRegion === region) {
			return 'fill-accent-purple';
		}
		if (hoveredRegion === region) {
			return 'fill-accent-pink';
		}
		return 'fill-[#2D3748] hover:fill-[#4A5568]';
	}

	function getCountryColor(country: Country) {
		if (selectedCountry === country) {
			return 'fill-accent-teal';
		}
		return 'fill-[#1E2130] hover:fill-[#2D3748]';
	}
</script>

<div id="world-map" class="bg-[#1E2130] rounded-2xl p-8">
	{#if isVisible}
		<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-8">
			<h3 class="text-2xl font-bold text-white mb-4">Interactive World Map</h3>
			<p class="text-[#A0AEC0]">Click on regions to explore experts by location</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Map Visualization -->
			<div class="lg:col-span-2">
				<div class="bg-[#2D3748] rounded-xl p-6 relative overflow-hidden">
					<!-- Simplified World Map SVG -->
					<svg class="w-full h-64 md:h-80" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
						<!-- North America -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('North America')}"
							d="M150 150 L300 150 L350 200 L300 250 L200 250 L150 200 Z"
							on:click={() => handleRegionClick('North America')}
							on:mouseenter={() => hoveredRegion = 'North America'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- South America -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('South America')}"
							d="M250 250 L300 250 L320 350 L300 450 L250 450 L230 350 Z"
							on:click={() => handleRegionClick('South America')}
							on:mouseenter={() => hoveredRegion = 'South America'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- Europe -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('Europe')}"
							d="M450 150 L550 150 L570 200 L550 250 L450 250 L430 200 Z"
							on:click={() => handleRegionClick('Europe')}
							on:mouseenter={() => hoveredRegion = 'Europe'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- Africa -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('Africa')}"
							d="M450 250 L550 250 L570 350 L550 450 L450 450 L430 350 Z"
							on:click={() => handleRegionClick('Africa')}
							on:mouseenter={() => hoveredRegion = 'Africa'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- Asia -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('Asia')}"
							d="M600 150 L800 150 L850 200 L800 250 L600 250 L550 200 Z"
							on:click={() => handleRegionClick('Asia')}
							on:mouseenter={() => hoveredRegion = 'Asia'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- Middle East -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('Middle East')}"
							d="M550 200 L600 200 L620 250 L600 300 L550 300 L530 250 Z"
							on:click={() => handleRegionClick('Middle East')}
							on:mouseenter={() => hoveredRegion = 'Middle East'}
							on:mouseleave={() => hoveredRegion = null}
						/>
						
						<!-- Oceania -->
						<path 
							class="cursor-pointer transition-colors duration-300 {getRegionColor('Oceania')}"
							d="M750 350 L850 350 L870 400 L850 450 L750 450 L730 400 Z"
							on:click={() => handleRegionClick('Oceania')}
							on:mouseenter={() => hoveredRegion = 'Oceania'}
							on:mouseleave={() => hoveredRegion = null}
						/>

						<!-- Region Labels -->
						<text x="200" y="200" class="text-xs fill-white pointer-events-none">North America</text>
						<text x="250" y="350" class="text-xs fill-white pointer-events-none">South America</text>
						<text x="480" y="200" class="text-xs fill-white pointer-events-none">Europe</text>
						<text x="480" y="350" class="text-xs fill-white pointer-events-none">Africa</text>
						<text x="650" y="200" class="text-xs fill-white pointer-events-none">Asia</text>
						<text x="570" y="250" class="text-xs fill-white pointer-events-none">Middle East</text>
						<text x="780" y="400" class="text-xs fill-white pointer-events-none">Oceania</text>
					</svg>

					<!-- Interactive Points -->
					<div class="absolute inset-0 pointer-events-none">
						<!-- Animated connection points -->
						<div class="absolute top-1/4 left-1/4 w-3 h-3 bg-accent-purple rounded-full animate-pulse"></div>
						<div class="absolute top-1/3 right-1/3 w-3 h-3 bg-accent-teal rounded-full animate-pulse delay-1000"></div>
						<div class="absolute bottom-1/3 left-1/2 w-3 h-3 bg-accent-pink rounded-full animate-pulse delay-2000"></div>
						<div class="absolute top-1/2 right-1/4 w-3 h-3 bg-accent-blue rounded-full animate-pulse delay-3000"></div>
					</div>
				</div>
			</div>

			<!-- Region Selection -->
			<div class="space-y-6">
				<div class="bg-[#2D3748] rounded-xl p-6">
					<h4 class="text-lg font-semibold text-white mb-4">Select Region</h4>
					<div class="space-y-2">
						{#each regions as region}
							<button
								class="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 {selectedRegion === region
									? 'bg-accent-purple text-white'
									: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#3D4758] hover:text-white'}"
								on:click={() => handleRegionClick(region)}
							>
								{region}
							</button>
						{/each}
					</div>
				</div>

				{#if selectedRegion}
					<div class="bg-[#2D3748] rounded-xl p-6">
						<h4 class="text-lg font-semibold text-white mb-4">Countries in {selectedRegion}</h4>
						<div class="space-y-2">
							{#each countries[selectedRegion] as country}
								<button
									class="w-full text-left px-4 py-2 rounded-lg transition-all duration-300 {selectedCountry === country
										? 'bg-accent-teal text-white'
										: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#3D4758] hover:text-white'}"
									on:click={() => handleCountryClick(country)}
								>
									{country}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Quick Stats -->
				<div class="bg-[#2D3748] rounded-xl p-6">
					<h4 class="text-lg font-semibold text-white mb-4">Network Stats</h4>
					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-[#A0AEC0]">Total Regions</span>
							<span class="text-white font-bold">{regions.length}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-[#A0AEC0]">Countries Covered</span>
							<span class="text-white font-bold">190</span>
						</div>
						<div class="flex justify-between">
							<span class="text-[#A0AEC0]">Active Experts</span>
							<span class="text-white font-bold">2,500+</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
