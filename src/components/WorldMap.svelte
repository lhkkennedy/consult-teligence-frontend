<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { regions, countries, specialties, consultants } from '$lib/mockData.js';
	import ContinentsSVG from '$lib/Continents.svg?raw';
	import type { Region, Country, Specialty, SearchFilters } from '$lib/types.ts';

	export let selectedRegion: Region | null = null;
	export let selectedCountry: Country | null = null;
	export let selectedSpecialty: Specialty | null = null;

	let isVisible = false;
	let hoveredRegion: Region | null = null;
	let showTooltip = false;
	let tooltipX = 0;
	let tooltipY = 0;
	let tooltipContent = '';

	// Expert counts by region (mock data)
	const expertCounts = {
		'North America': 850,
		'South America': 320,
		'Europe': 680,
		'Africa': 240,
		'Asia': 720,
		'Middle East': 180,
		'Oceania': 110
	};

	// Region colors for better visual distinction
	const regionColors = {
		'North America': '#8B5CF6', // Purple
		'South America': '#EC4899', // Pink
		'Europe': '#3B82F6', // Blue
		'Africa': '#10B981', // Green
		'Asia': '#F59E0B', // Amber
		'Middle East': '#EF4444', // Red
		'Oceania': '#06B6D4' // Cyan
	};

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
		console.log('Region clicked:', region);
		selectedRegion = region;
		selectedCountry = null;
		selectedSpecialty = null;
	}

	function handleCountryClick(country: Country) {
		selectedCountry = country;
	}

	function handleSpecialtyClick(specialty: Specialty) {
		selectedSpecialty = specialty;
	}

	function handleRegionKeydown(event: KeyboardEvent, region: Region) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleRegionClick(region);
		}
	}

	function handleMouseMove(event: MouseEvent, region: Region) {
		tooltipX = event.clientX + 10;
		tooltipY = event.clientY - 10;
		tooltipContent = `${region} (${expertCounts[region]} experts)`;
		showTooltip = true;
	}

	function handleMouseEnter(event: MouseEvent, region: Region) {
		hoveredRegion = region;
		handleMouseMove(event, region);
	}

	function handleMouseLeave() {
		showTooltip = false;
	}

	function getRegionColor(region: Region) {
		if (selectedRegion === region) {
			return `fill-[${regionColors[region]}]`;
		}
		if (hoveredRegion && hoveredRegion === region) {
			return `fill-[${regionColors[region]}] opacity-80`;
		}
		return `fill-[#2D3748] hover:fill-[${regionColors[region]}] hover:opacity-60`;
	}

	function getRegionStroke(region: Region) {
		if (selectedRegion === region) {
			return `stroke-[${regionColors[region]}] stroke-2`;
		}
		return 'stroke-[#4A5568] stroke-1';
	}

	function getExpertCount(region: Region) {
		return expertCounts[region] || 0;
	}

	function getFilteredExperts() {
		let filtered = consultants;
		
		if (selectedRegion) {
			filtered = filtered.filter(expert => expert.geographicalExpertise === selectedRegion);
		}
		
		if (selectedCountry) {
			filtered = filtered.filter(expert => expert.countryExpertise === selectedCountry);
		}
		
		if (selectedSpecialty) {
			filtered = filtered.filter(expert => 
				expert.functionalExpertise.some(spec => spec.includes(selectedSpecialty!))
			);
		}
		
		return filtered;
	}

	$: filteredExperts = getFilteredExperts();
</script>

<div id="world-map" class="bg-gradient-to-br from-[#1E2130] to-[#2D3748] rounded-2xl p-8 shadow-2xl">
	{#if isVisible}
		<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-8">
			<h3 class="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
				Interactive World Map
			</h3>
			<p class="text-[#A0AEC0] text-lg">Explore our global network of real estate experts</p>
		</div>

		<div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
			<!-- Map Visualization -->
			<div class="xl:col-span-2">
				<div class="bg-gradient-to-br from-[#2D3748] to-[#1E2130] rounded-xl p-6 relative overflow-hidden border border-[#4A5568]/30">
					<!-- Background Pattern -->
					<div class="absolute inset-0 opacity-5">
						<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
					</div>

					<!-- Enhanced World Map SVG -->
					<div class="w-full h-80 md:h-96 relative">
						{@html ContinentsSVG}
						
						<!-- Interactive Overlay for Regions -->
						<svg class="absolute inset-0 w-full h-full" viewBox="0 0 468 239" xmlns="http://www.w3.org/2000/svg">
							<!-- North America -->
							<rect x="50" y="60" width="120" height="80" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('North America')} on:keydown={(e) => handleRegionKeydown(e, 'North America')} on:mouseenter={(e) => handleMouseEnter(e, 'North America')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'North America')} role="button" tabindex="0" aria-label="Select North America region" />
							
							<!-- South America -->
							<rect x="120" y="140" width="80" height="120" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('South America')} on:keydown={(e) => handleRegionKeydown(e, 'South America')} on:mouseenter={(e) => handleMouseEnter(e, 'South America')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'South America')} role="button" tabindex="0" aria-label="Select South America region" />
							
							<!-- Europe -->
							<rect x="200" y="40" width="60" height="40" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('Europe')} on:keydown={(e) => handleRegionKeydown(e, 'Europe')} on:mouseenter={(e) => handleMouseEnter(e, 'Europe')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'Europe')} role="button" tabindex="0" aria-label="Select Europe region" />
							
							<!-- Africa -->
							<rect x="200" y="80" width="80" height="120" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('Africa')} on:keydown={(e) => handleRegionKeydown(e, 'Africa')} on:mouseenter={(e) => handleMouseEnter(e, 'Africa')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'Africa')} role="button" tabindex="0" aria-label="Select Africa region" />
							
							<!-- Asia -->
							<rect x="260" y="40" width="150" height="100" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('Asia')} on:keydown={(e) => handleRegionKeydown(e, 'Asia')} on:mouseenter={(e) => handleMouseEnter(e, 'Asia')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'Asia')} role="button" tabindex="0" aria-label="Select Asia region" />
							
							<!-- Middle East -->
							<rect x="240" y="60" width="40" height="40" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('Middle East')} on:keydown={(e) => handleRegionKeydown(e, 'Middle East')} on:mouseenter={(e) => handleMouseEnter(e, 'Middle East')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'Middle East')} role="button" tabindex="0" aria-label="Select Middle East region" />
							
							<!-- Oceania -->
							<rect x="350" y="140" width="80" height="60" class="cursor-pointer transition-all duration-300 hover:opacity-30 fill-current" opacity="0" on:click={() => handleRegionClick('Oceania')} on:keydown={(e) => handleRegionKeydown(e, 'Oceania')} on:mouseenter={(e) => handleMouseEnter(e, 'Oceania')} on:mouseleave={handleMouseLeave} on:mousemove={(e) => handleMouseMove(e, 'Oceania')} role="button" tabindex="0" aria-label="Select Oceania region" />
						</svg>
						
						<!-- Region Labels with Expert Counts -->
						<div class="absolute inset-0 pointer-events-none">
							<!-- North America -->
							<div class="absolute top-20 left-20 text-center">
								<div class="text-sm font-medium text-white">North America</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['North America']} experts</div>
							</div>
							
							<!-- South America -->
							<div class="absolute top-32 left-32 text-center">
								<div class="text-sm font-medium text-white">South America</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['South America']} experts</div>
							</div>
							
							<!-- Europe -->
							<div class="absolute top-12 left-48 text-center">
								<div class="text-sm font-medium text-white">Europe</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['Europe']} experts</div>
							</div>
							
							<!-- Africa -->
							<div class="absolute top-24 left-48 text-center">
								<div class="text-sm font-medium text-white">Africa</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['Africa']} experts</div>
							</div>
							
							<!-- Asia -->
							<div class="absolute top-12 left-64 text-center">
								<div class="text-sm font-medium text-white">Asia</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['Asia']} experts</div>
							</div>
							
							<!-- Middle East -->
							<div class="absolute top-16 left-52 text-center">
								<div class="text-sm font-medium text-white">Middle East</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['Middle East']} experts</div>
							</div>
							
							<!-- Oceania -->
							<div class="absolute top-32 left-72 text-center">
								<div class="text-sm font-medium text-white">Oceania</div>
								<div class="text-xs text-[#A0AEC0]">{expertCounts['Oceania']} experts</div>
							</div>
						</div>
					</div>

					<!-- Enhanced Interactive Points -->
					<div class="absolute inset-0 pointer-events-none">
						<div class="absolute top-1/4 left-1/4 w-4 h-4 bg-accent-purple rounded-full animate-pulse shadow-lg shadow-accent-purple/50"></div>
						<div class="absolute top-1/3 right-1/3 w-4 h-4 bg-accent-teal rounded-full animate-pulse delay-1000 shadow-lg shadow-accent-teal/50"></div>
						<div class="absolute bottom-1/3 left-1/2 w-4 h-4 bg-accent-pink rounded-full animate-pulse delay-2000 shadow-lg shadow-accent-pink/50"></div>
						<div class="absolute top-1/2 right-1/4 w-4 h-4 bg-accent-blue rounded-full animate-pulse delay-3000 shadow-lg shadow-accent-blue/50"></div>
					</div>
				</div>
			</div>

			<!-- Enhanced Sidebar -->
			<div class="xl:col-span-2 space-y-6">
				<!-- Region Selection -->
				<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="bg-gradient-to-br from-[#2D3748] to-[#1E2130] rounded-xl p-6 border border-[#4A5568]/30">
					<h4 class="text-xl font-semibold text-white mb-4 flex items-center">
						<svg class="w-5 h-5 mr-2 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						Select Region
					</h4>
					<div class="grid grid-cols-1 gap-3">
						{#each regions as region}
							<button
								class="group relative w-full text-left px-4 py-3 rounded-lg transition-all duration-300 {selectedRegion === region
									? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg'
									: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#3D4758] hover:text-white border border-[#4A5568]/30'}"
								on:click={() => handleRegionClick(region)}
							>
								<div class="flex items-center justify-between">
									<span class="font-medium">{region}</span>
									<div class="flex items-center space-x-2">
										<span class="text-sm opacity-75">{expertCounts[region]}</span>
										<div class="w-3 h-3 rounded-full" style="background-color: {regionColors[region]}"></div>
									</div>
								</div>
								{#if selectedRegion === region}
									<div class="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 rounded-lg"></div>
								{/if}
							</button>
						{/each}
					</div>
				</div>

				{#if selectedRegion}
					<div in:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }} class="bg-gradient-to-br from-[#2D3748] to-[#1E2130] rounded-xl p-6 border border-[#4A5568]/30">
						<h4 class="text-xl font-semibold text-white mb-4 flex items-center">
							<svg class="w-5 h-5 mr-2 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							Countries in {selectedRegion}
						</h4>
						<div class="grid grid-cols-2 gap-2">
							{#each countries[selectedRegion] as country}
								<button
									class="text-left px-3 py-2 rounded-lg transition-all duration-300 {selectedCountry === country
										? 'bg-accent-teal text-white shadow-lg'
										: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#3D4758] hover:text-white border border-[#4A5568]/30'}"
									on:click={() => handleCountryClick(country)}
								>
									{country}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Specialties -->
				<div in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }} class="bg-gradient-to-br from-[#2D3748] to-[#1E2130] rounded-xl p-6 border border-[#4A5568]/30">
					<h4 class="text-xl font-semibold text-white mb-4 flex items-center">
						<svg class="w-5 h-5 mr-2 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
						</svg>
						Specialties
					</h4>
					<div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
						{#each specialties.slice(0, 10) as specialty}
							<button
								class="text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm {selectedSpecialty === specialty
									? 'bg-accent-blue text-white shadow-lg'
									: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#3D4758] hover:text-white border border-[#4A5568]/30'}"
								on:click={() => handleSpecialtyClick(specialty)}
							>
								{specialty}
							</button>
						{/each}
					</div>
				</div>

				<!-- Enhanced Stats -->
				<div in:fly={{ y: 30, duration: 600, delay: 500, easing: quintOut }} class="bg-gradient-to-br from-[#2D3748] to-[#1E2130] rounded-xl p-6 border border-[#4A5568]/30">
					<h4 class="text-xl font-semibold text-white mb-4 flex items-center">
						<svg class="w-5 h-5 mr-2 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						Network Statistics
					</h4>
					<div class="space-y-4">
						<div class="flex justify-between items-center p-3 bg-[#1E2130] rounded-lg border border-[#4A5568]/30">
							<span class="text-[#A0AEC0]">Total Regions</span>
							<span class="text-white font-bold text-lg">{regions.length}</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-[#1E2130] rounded-lg border border-[#4A5568]/30">
							<span class="text-[#A0AEC0]">Countries Covered</span>
							<span class="text-white font-bold text-lg">190</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-[#1E2130] rounded-lg border border-[#4A5568]/30">
							<span class="text-[#A0AEC0]">Active Experts</span>
							<span class="text-white font-bold text-lg">2,500+</span>
						</div>
						<div class="flex justify-between items-center p-3 bg-[#1E2130] rounded-lg border border-[#4A5568]/30">
							<span class="text-[#A0AEC0]">Filtered Results</span>
							<span class="text-white font-bold text-lg">{filteredExperts.length}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Tooltip -->
		{#if showTooltip}
			<div 
				class="fixed z-50 bg-[#2D3748] text-white px-3 py-2 rounded-lg shadow-lg border border-[#4A5568]/30 pointer-events-none"
				style="left: {tooltipX}px; top: {tooltipY}px;"
				in:scale={{ duration: 200, easing: elasticOut }}
			>
				{tooltipContent}
			</div>
		{/if}
	{/if}
</div>


