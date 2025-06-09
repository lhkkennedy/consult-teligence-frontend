<script lang="ts">
	import { regions, countries, specialties } from "$lib/mockData.js";
  import type { Region, Country, Specialty, SearchFilters } from '$lib/types.ts';

  export let selectedRegion: Region | null = null;
  export let selectedCountry: Country | null = null;
</script>

<div class="bg-[#1E2130] p-6 rounded-lg text-center">
  <p class="text-[#A0AEC0]">
    This is a placeholder for an interactive world map. In a real implementation, this would be an SVG or Canvas-based map where users can click on regions or countries.
  </p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-8">
    {#each regions as region}
      <button
        type="button"
        class="px-4 py-2 rounded-md 
          {selectedRegion === region
            ? 'bg-[#8A2BE2] text-white'
            : 'bg-[#2D3748] text-[#A0AEC0] hover:bg-[#3D4758]'} transition-colors"
        on:click={() => {
            selectedRegion = region;
            selectedCountry = null;
          }
        }
      >
        {region}
      </button>
    {/each}
  </div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-8">
    {#if selectedRegion}
      {#each countries[selectedRegion] as country}
        <button
          type="button"
          class="px-4 py-2 rounded-md 
            {selectedCountry === country
              ? 'bg-[#8A2BE2] text-white'
              : 'bg-[#2D3748] text-[#A0AEC0] hover:bg-[#3D4758]'} transition-colors"
          on:click={() => selectedCountry = country}>
          {country}
        </button>
      {/each}
    {/if}
  </div>
</div>
