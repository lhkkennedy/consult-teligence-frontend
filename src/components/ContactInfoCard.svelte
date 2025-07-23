<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ComponentType } from 'svelte';
	import TimezoneDisplay from './TimezoneDisplay.svelte';

	export let icon: ComponentType;
	export let title: string;
	export let description: string;
	export let details: string;
	export let actionText?: string;
	export let actionLink?: string;
	export let isClickable = false;
	export let isSelected = false;
	export let showTimezone = false;
	export let timezone?: string;
	export let timezoneLabel?: string;

	const dispatch = createEventDispatcher();

	function handleClick() {
		if (isClickable) {
			dispatch('click');
		}
	}
</script>

<div 
	class="expert-card transition-all duration-300 group {isClickable ? 'cursor-pointer hover:scale-105' : ''} {isSelected ? 'border-accent-teal' : ''}"
	class:hover:border-accent-teal={isClickable}
	on:click={handleClick}
>
	<div class="flex items-center mb-4">
		<svelte:component this={icon} class="w-8 h-8 text-accent-teal mr-3" />
		<h3 class="text-xl font-semibold text-white">{title}</h3>
	</div>
	<p class="text-[#A0AEC0] mb-4">{description}</p>
	<div class="text-accent-teal font-medium mb-4" bind:innerHTML={details}></div>
	
	{#if showTimezone && timezone && timezoneLabel}
		<div class="mb-4">
			<svelte:component this={TimezoneDisplay} {timezone} label={timezoneLabel} />
		</div>
	{/if}
	
	{#if actionText && actionLink}
		<a 
			href={actionLink}
			class="inline-flex items-center text-accent-teal hover:text-white transition-colors duration-300"
		>
			{actionText}
			<svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
			</svg>
		</a>
	{/if}
</div>