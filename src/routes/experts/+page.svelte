<script lang="ts">
	import { goto } from '$app/navigation';
	import ExpertSearchForm from '../../components/ExpertSearchForm.svelte';
	import ExpertSearchResults from '../../components/ExpertSearchResults.svelte';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import LayoutList from '@lucide/svelte/icons/layout-list';
	import type { Consultant, SearchFilters } from '../../lib/types.ts';
	import { regions, countries, specialties } from '../../lib/mockData.ts';

	export let data: { consultants: Consultant[] };
	const consultants = data.consultants;

	let searchQuery: SearchFilters = {};
	let showAll = false;
	let viewMode: 'grid' | 'list' = 'grid';

	// --- derived filtered list
	$: filteredConsultants = consultants.filter((c) => {
		if (searchQuery.region && c.geographicalExpertise !== searchQuery.region) return false;
		if (searchQuery.country && c.countryExpertise !== searchQuery.country) return false;
		if (searchQuery.specialties?.length) {
			// require at least one matching specialty
			if (!searchQuery.specialties.some((spec) => c.functionalExpertise.includes(spec))) {
				return false;
			}
		}
		return true;
	});

	function handleSearch(filters: SearchFilters) {
		searchQuery = filters;
		showAll = false;
	}

	function handleExpertSelect(id: number) {
		goto(`/experts/${id}`);
	}

	function resetSearch() {
		searchQuery = {};
		showAll = true;
	}
</script>

<main class="flex-grow py-8 pt-24">
	<div class="container mx-auto p-6">
		<!-- Search Form -->
		<div class="mb-16">
			<ExpertSearchForm {specialties} {regions} {countries} onSearch={handleSearch} />
		</div>

		<!-- View Mode & Heading -->
		<div class="mb-6 flex items-center justify-between">
			<h2 class="font-heading text-2xl font-semibold text-white">
				{#if Object.keys(searchQuery).length || showAll}
					Search Results
				{:else}
					Find the Perfect Expert
				{/if}
			</h2>
			<div class="space-x-2">
				<button
					aria-label="Grid view"
					class="rounded p-2 hover:bg-white/10 {viewMode === 'grid' ? 'bg-white/20' : ''}"
					on:click={() => (viewMode = 'grid')}
				>
					<LayoutGrid class="h-5 w-5 text-white" />
				</button>
				<button
					aria-label="List view"
					class="rounded p-2 hover:bg-white/10 {viewMode === 'list' ? 'bg-white/20' : ''}"
					on:click={() => (viewMode = 'list')}
				>
					<LayoutList class="h-5 w-5 text-white" />
				</button>
			</div>
		</div>

		<!-- Results -->
		{#if viewMode === 'grid'}
			<ExpertSearchResults
				consultants={filteredConsultants}
				onExpertSelect={handleExpertSelect}
				containerClass="grid grid-cols-1 md:grid-cols-3 gap-8"
			/>
		{:else}
			<ExpertSearchResults
				consultants={filteredConsultants}
				onExpertSelect={handleExpertSelect}
				containerClass="space-y-6"
				itemComponent="list"
			/>
		{/if}
	</div>
</main>
