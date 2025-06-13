<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import type { SearchFilters } from '../lib/types.ts';
	import type { Region, Specialty } from '../lib/mockData.ts';

	export let specialties: readonly Specialty[] = [];
	export let onSearch: (filters: SearchFilters) => void = () => {};

	let keyword = '';
	let selectedRegion: Region | '' = '';
	let selectedCountry: string = '';
	let selectedSpecialties: Specialty[] = [];

	import { regions, countries } from '../lib/mockData.ts';
	$: availableCountries = selectedRegion ? countries[selectedRegion] : [];

	function handleSubmit() {
		const f: SearchFilters = {};
		if (keyword) f.keyword = keyword;
		if (selectedRegion) f.region = selectedRegion;
		if (selectedCountry) f.country = selectedCountry;
		if (selectedSpecialties.length) f.specialties = selectedSpecialties;
		onSearch(f);
	}
</script>

<form on:submit={handleSubmit} class="rounded-lg bg-secondary-bg p-lg py-sm">
	<div class="relative mb-sm">
		<label for="keyword" class="mb-xs block text-text-primary">Keyword Search</label>
		<div class="relative">
			<input
				id="keyword"
				type="text"
				placeholder="Name, company, or role"
				class="form-input w-full pl-xl"
				bind:value={keyword}
			/>
			<Search
				class="absolute left-sm top-1/2 -translate-y-1/2 transform text-text-secondary"
				size={18}
			/>
		</div>
	</div>

	<div class="mb-sm grid grid-cols-1 gap-md md:grid-cols-2">
		<div>
			<label for="region" class="mb-xs block text-text-primary">Regional Expertise</label>
			<select
				id="region"
				class="form-select w-full"
				bind:value={selectedRegion}
				on:change={() => {
					selectedCountry = '';
				}}
			>
				<option value="">All Regions</option>
				{#each regions as r}
					<option value={r}>{r}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="country" class="mb-xs block text-text-primary">Country Expertise</label>
			<select
				id="country"
				class="form-select w-full disabled:cursor-not-allowed disabled:border-text-primary disabled:bg-secondary-bg disabled:text-text-primary disabled:opacity-50"
				bind:value={selectedCountry}
				disabled={!selectedRegion}
			>
				<option value="">All Countries</option>
				{#each availableCountries as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="mb-4">
		<label for="specialties" class="mb-xs block text-text-primary">Specialties</label>
		<select id="speciality" class="form-select w-full" bind:value={selectedSpecialties}>
			<option value="">All Specialities</option>
			{#each specialties as s}
				<option value={s}>{s}</option>
			{/each}
		</select>
	</div>

	<div class="text-center">
		<button type="submit" class="btn btn-primary px-xl"> Find Experts </button>
	</div>
</form>
