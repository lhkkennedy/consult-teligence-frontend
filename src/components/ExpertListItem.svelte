<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import BriefCase from '@lucide/svelte/icons/briefcase';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import type { Consultant } from '$lib/types.ts';

	export let consultant: Consultant;
	export let onSelect: (id: string) => void = () => {};
</script>

<div
	role="button"
	tabindex="0"
	class="expert-card flex h-full cursor-pointer flex-col border border-gray-200 bg-white transition-all duration-300 hover:border-accent-purple dark:border-[#2D3748] dark:bg-[#1E2130]"
	on:click={() => onSelect(consultant.documentId)}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect(consultant.documentId);
		}
	}}
>
	<div class="flex items-start justify-between space-x-6 p-6">
		<!-- LEFT SIDE: Avatar + Details -->
		<div class="flex flex-1 items-start space-x-5">
			{#if consultant.profileImage}
				<img
					src={consultant.profileImage}
					alt={`${consultant.firstName} ${consultant.lastName}`}
					class="h-16 w-16 rounded-full object-cover"
				/>
			{:else}
				<div class="h-16 w-16 flex-shrink-0 rounded-full bg-gray-200 dark:bg-[#2D3748]"></div>
			{/if}

			<div class="flex-1">
				<div class="mb-1 text-xs font-semibold uppercase text-accent-purple">
					{consultant.company}
				</div>
				<h3 class="font-heading text-lg font-semibold leading-snug text-gray-900 dark:text-white">
					{consultant.firstName}
					{consultant.lastName} – {consultant.currentRole}
				</h3>
				<div class="mt-1 flex items-center text-sm text-gray-600 dark:text-[#A0AEC0]">
					<BriefCase size={16} class="mr-1" />
					<span>{consultant.currentRole}</span>
				</div>
				<div class="mt-1 flex items-center text-sm text-gray-600 dark:text-[#A0AEC0]">
					<MapPin size={16} class="mr-1" />
					<span>{consultant.location}</span>
				</div>
				<div class="mt-1 flex items-center text-sm text-gray-600 dark:text-[#A0AEC0]">
					<DollarSign size={16} class="mr-1" />
					<span>${consultant.rate}/hr</span>
				</div>
			</div>
		</div>

		<!-- RIGHT SIDE: Save / Request -->
		<div class="flex shrink-0 flex-col items-end space-y-3">
			<button
				type="button"
				class="btn btn-primary mt-auto w-full bg-accent-purple text-white dark:bg-accent-purple dark:text-white"
				on:click|stopPropagation={() => onSelect(consultant.documentId)}
			>
				View Profile
			</button>
		</div>
	</div>

	<!-- MIDDLE ROW: Expertise badge + stars -->
	<div
		class="flex items-center justify-between rounded-b-lg border-t border-gray-200 px-6 pb-4 pt-4 dark:border-border-gray"
	>
		<div class="flex flex-wrap gap-2">
			{#each consultant.functionalExpertise as exp}
				<button
					type="button"
					class="rounded-sm bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-secondary-bg dark:text-text-primary dark:hover:bg-gray-700"
					on:click={() => console.log('filter by', exp)}
				>
					{exp}
				</button>
			{/each}
		</div>
		<!-- <div class="flex space-x-1 text-yellow-400">
        {#each Array(5) as _, i}
        <svg class="w-4 h-4 fill-current">
            <polygon points="9.9,1.1 12.3,6.9 18.4,7.5 13.7,11.8 15.2,17.8 9.9,14.5 4.6,17.8 6.1,11.8 1.4,7.5 7.5,6.9 "/>
        </svg>
        {/each}
    </div> -->
	</div>
</div>
