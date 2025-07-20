<script lang="ts">
	import type { Region, Specialty } from '../lib/mockData.ts';
	import { regions, countries, specialties } from '../lib/mockData.ts';
	import type { SearchFilters, Consultant } from '../lib/types.ts';

	export let selectedRegion: Region | null = null;
	export let selectedCountry: string | null = null;
	export let selectedSpecialty: Specialty | null = null;

	// Mock sub-specialties data
	const subSpecialties: Record<Specialty, string[]> = {
		'Corporate Real Estate Management': ['Portfolio Management', 'Facility Management', 'Strategic Planning'],
		'Real Estate Investment': ['REITs', 'Private Equity', 'Direct Investment'],
		'Real Estate Law': ['Contract Law', 'Regulatory Compliance', 'Litigation'],
		'Media Consultant': ['Marketing Strategy', 'Brand Development', 'Digital Media'],
		'Real Estate Management': ['Property Management', 'Asset Management', 'Operations'],
		'Real Estate Development': ['Land Development', 'Construction Management', 'Project Finance'],
		'Property Management': ['Residential Management', 'Commercial Management', 'HOA Management'],
		'Real Estate Appraisal': ['Residential Appraisal', 'Commercial Appraisal', 'Land Appraisal'],
		'Finance': ['Mortgage Finance', 'Investment Banking', 'Risk Management'],
		'Tech': ['PropTech', 'Data Analytics', 'Digital Platforms'],
		'Real Estate Marketing': ['Digital Marketing', 'Traditional Marketing', 'Brand Strategy'],
		'Real Estate Agent': ['Residential Sales', 'Commercial Sales', 'Leasing'],
		'Real Estate Brokerage': ['Residential Brokerage', 'Commercial Brokerage', 'International Brokerage']
	};

	function handleRegionSelect(region: Region) {
		selectedRegion = region;
		selectedCountry = null;
	}

	function handleCountrySelect(country: string) {
		selectedCountry = country;
	}

	function handleSpecialtySelect(specialty: Specialty) {
		selectedSpecialty = specialty;
	}
</script>

<div>
	<div class="mb-8">
		<h3 class="mb-4 text-lg font-semibold text-white">Regions</h3>
		<div class="flex flex-wrap gap-2">
			{#each regions as region}
				<button
					class="rounded-md px-4 py-2 {selectedRegion === region
						? 'bg-accent-purple text-white'
						: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
					on:click={() => handleRegionSelect(region)}
				>
					{region}
				</button>
			{/each}
		</div>
	</div>
	
	{#if selectedRegion}
		<div class="mb-8">
			<h3 class="mb-4 text-lg font-semibold text-white">Countries in {selectedRegion}</h3>
			<div class="flex flex-wrap gap-2">
				{#each countries[selectedRegion] as country}
					<button
						class="rounded-md px-4 py-2 {selectedCountry === country
							? 'bg-accent-teal text-white'
							: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
						on:click={() => handleCountrySelect(country)}
					>
						{country}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mb-8">
		<h3 class="mb-4 text-lg font-semibold text-white">Specialties</h3>
		<div class="flex flex-wrap gap-2">
			{#each specialties as specialty}
				<button
					class="rounded-md px-4 py-2 {selectedSpecialty === specialty
						? 'bg-accent-purple text-white'
						: 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
					on:click={() => handleSpecialtySelect(specialty)}
				>
					{specialty}
				</button>
			{/each}
		</div>
	</div>

	{#if selectedSpecialty && subSpecialties[selectedSpecialty]}
		<div>
			<h3 class="mb-4 text-lg font-semibold text-white">Sub-Specialties in {selectedSpecialty}</h3>
			<div class="flex flex-wrap gap-2">
				{#each subSpecialties[selectedSpecialty] as subSpecialty}
					<button
						class="rounded-md px-4 py-2 bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748] transition-colors"
					>
						{subSpecialty}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
