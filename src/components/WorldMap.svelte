<script lang="ts">
	import { regions, countries, specialties } from '$lib/mockData.js';
	import type { Region, Country, Specialty, SearchFilters } from '$lib/types.ts';

	export let selectedRegion: Region | null = null;
	export let selectedCountry: Country | null = null;
</script>

<div class="rounded-lg bg-[#1E2130] p-6 text-center">
	<p class="text-[#A0AEC0]">
		This is a placeholder for an interactive world map. In a real implementation, this would be an
		SVG or Canvas-based map where users can click on regions or countries.
	</p>

	<div class="mt-8 grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
		{#each regions as region}
			<button
				type="button"
				class="rounded-md px-4 py-2
          {selectedRegion === region
					? 'bg-[#8A2BE2] text-white'
					: 'bg-[#2D3748] text-[#A0AEC0] hover:bg-[#3D4758]'} transition-colors"
				on:click={() => {
					selectedRegion = region;
					selectedCountry = null;
				}}
			>
				{region}
			</button>
		{/each}
	</div>
	<div class="mt-8 grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
		{#if selectedRegion}
			{#each countries[selectedRegion] as country}
				<button
					type="button"
					class="rounded-md px-4 py-2
            {selectedCountry === country
						? 'bg-[#8A2BE2] text-white'
						: 'bg-[#2D3748] text-[#A0AEC0] hover:bg-[#3D4758]'} transition-colors"
					on:click={() => (selectedCountry = country)}
				>
					{country}
				</button>
			{/each}
		{/if}
	</div>
</div>
