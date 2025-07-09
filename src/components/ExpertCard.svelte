<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import BriefCase from '@lucide/svelte/icons/briefcase';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import type { Consultant } from '$lib/types.ts';
	/** consultant data shape */

	export let consultant: Consultant;

	/** callback to parent when this card is clicked */
	export let onSelect: (documentId: string) => void = () => {};
</script>

<div
	role="button"
	tabindex="0"
	class="expert-card flex h-full cursor-pointer flex-col transition-all duration-300 hover:border-[#8A2BE2]"
	on:click={() => onSelect(consultant.documentId)}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect(consultant.documentId);
		}
	}}
>
	<!-- Profile Image -->
	{#if consultant.profileImage}
		<div class="mb-4 flex justify-center">
			<img
				src={`${consultant.profileImage}`}
				alt={`${consultant.firstName} ${consultant.lastName}`}
				class="h-24 w-24 rounded-full object-cover"
			/>
		</div>
	{/if}
	<h3 class="mb-2 font-heading text-xl font-semibold">
		{consultant.firstName}
		{consultant.lastName}
	</h3>

	<div class="mb-1 flex items-center text-[#A0AEC0]">
		<BriefCase size={16} class="mr-1" />
		<span>{consultant.currentRole}</span>
	</div>

	<div class="mb-1 flex items-center text-[#A0AEC0]">
		<MapPin size={16} class="mr-1" />
		<span>{consultant.location}</span>
	</div>

	<div class="mb-6 flex items-center text-[#A0AEC0]">
		<DollarSign size={16} class="mr-1" />
		<span>${consultant.rate}/hr</span>
	</div>

	<div class="flex items-center justify-between rounded-b-lg border-t border-border-gray pb-4 pt-4">
		<div class="flex flex-wrap gap-1">
			{#each consultant.functionalExpertise as exp}
				<button
					type="button"
					class="rounded-sm bg-secondary-bg px-2 py-1 text-xs text-text-primary hover:bg-gray-700"
					on:click={() => console.log('filter by', exp)}
				>
					{exp}
				</button>
			{/each}
		</div>
	</div>

	<button
		type="button"
		class="btn btn-primary mt-auto w-full"
		on:click|stopPropagation={() => onSelect(consultant.documentId)}
	>
		View Profile
	</button>
</div>
