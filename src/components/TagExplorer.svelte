<script lang="ts">
	import type { Region, Specialty } from '../lib/mockData.ts';
	import { regions, countries, specialties } from '../lib/mockData.ts';
	import type { SearchFilters, Consultant } from '../lib/types.ts';

	export let selectedRegion: Region | null = null;
	export let selectedCountry: Country | null = null;
	export let selectedSpecialty: Specialty | null = null;
	export let selectedSubSpecialty: SubSpecialty | null = null;

	export let onRegionSelect: (region: Region) => void = () => {};
	export let onCountrySelect: (country: Country | null) => void = () => {};
	export let onSpecialtySelect: (specialty: Specialty) => void = () => {};
	export let onSubSpecialtySelect: (subspecialty: SubSpecialty) => void = () => {};
</script>

<div>
	<div class="mb-8">
		<h3 class="mb-4 text-lg font-semibold">Regions</h3>
		<div class="flex flex-wrap gap-2">
			{#each regions as region}
				<button
					class="rounded-md px-4 py-2 {selectedRegion === region
						? 'bg-[#8A2BE2] text-white'
						: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
					on:click={() => {
						selectedRegion = region;
						onRegionSelect(region);
					}}
				>
					{region}
				</button>
			{/each}
		</div>
	</div>
	{#if selectedRegion}
		<div>
			<h3 class="mb-4 text-lg font-semibold">Countries in {selectedRegion}</h3>
			<div class="flex flex-wrap gap-2">
				{#each countries[selectedRegion] as country}
					<button
						class="rounded-md px-4 py-2 {selectedCountry === country
							? 'bg-[#8A2BE2] text-white'
							: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
						on:click={() => {
							selectedCountry = country;
							onCountrySelect(country);
						}}
					>
						{country}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mb-8">
		<h3 class="mb-4 text-lg font-semibold">Specialties</h3>
		<div class="flex flex-wrap gap-2">
			{#each specialties as specialty}
				<button
					class="rounded-md px-4 py-2 {selectedSpecialty === specialty
						? 'bg-[#8A2BE2] text-white'
						: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
					on:click={() => {
						selectedSpecialty = specialty;
						onSpecialtySelect(specialty);
					}}
				>
					{specialty}
				</button>
			{/each}
		</div>
	</div>

	{#if selectedSpecialty}
		<div>
			<h3 class="mb-4 text-lg font-semibold">Sub-Specialties in {selectedSpecialty}</h3>
			<div class="flex flex-wrap gap-2">
				{#each subSpecialties[selectedSpecialty] as subSpecialty}
					<button
						class="rounded-md px-4 py-2 {selectedSubSpecialty === subSpecialty
							? 'bg-[#8A2BE2] text-white'
							: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
						on:click={() => {
							selectedSubSpecialty = subSpecialty;
							onSubSpecialtySelect(subSpecialty);
						}}
					>
						{subSpecialty}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
