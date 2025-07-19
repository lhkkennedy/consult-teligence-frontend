<script lang="ts">
	import ExpertCard from './ExpertCard.svelte';
	import ExpertListItem from './ExpertListItem.svelte';
	import type { Consultant } from '$lib/types.ts';
	/** array of consultants to show */

	export let consultants: Consultant[] = [];

	/** callback prop in lieu of createEventDispatcher */
	export let onExpertSelect: (id: string) => void = () => {};

	/** allow parent to pass layout classes */
	export let containerClass = '';

	export let itemComponent: 'grid' | 'list' = 'grid';
</script>

{#if consultants.length === 0}
	<div class={`py-12 text-center ${containerClass}`}>
		<p class="text-[#A0AEC0]">
			No experts found matching your criteria. Please try different search parameters.
		</p>
	</div>
{:else}
	<div class={containerClass}>
		{#each consultants as consultant}
			{#if itemComponent === 'list'}
				<ExpertListItem {consultant} onSelect={(id) => onExpertSelect(id)} />
			{:else}
				<ExpertCard {consultant} onSelect={(id) => onExpertSelect(id)} />
			{/if}
		{/each}
	</div>
{/if}
