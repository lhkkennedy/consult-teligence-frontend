<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let type: string = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let error: string = '';
	export let rows: number = 1;

	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement | HTMLTextAreaElement;
		dispatch('input', target.value);
	}

	function handleBlur() {
		dispatch('blur');
	}
</script>

<div class="mb-6">
	<label for={label.toLowerCase().replace(/\s+/g, '-')} class="block text-white font-medium mb-2">
		{label} {required ? '*' : ''}
	</label>
	
	{#if type === 'textarea'}
		<textarea
			id={label.toLowerCase().replace(/\s+/g, '-')}
			{value}
			{placeholder}
			{required}
			{rows}
			class="form-input w-full resize-none {error ? 'border-red-500' : ''}"
			on:input={handleInput}
			on:blur={handleBlur}
		></textarea>
	{:else}
		<input
			id={label.toLowerCase().replace(/\s+/g, '-')}
			{type}
			{value}
			{placeholder}
			{required}
			class="form-input w-full {error ? 'border-red-500' : ''}"
			on:input={handleInput}
			on:blur={handleBlur}
		/>
	{/if}
	
	{#if error}
		<p class="text-red-400 text-sm mt-1">{error}</p>
	{/if}
</div>