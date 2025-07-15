<script lang="ts">
	import { goto } from '$app/navigation';
	import ExpertProfile from '../../../components/ExpertProfile.svelte';
	import type { Consultant } from '../../../lib/types.ts';

	// SvelteKit injects the data from +page.server.ts here
	export let data: { activeProfile: Consultant, timelineItems: any[], properties: any[] };
	const { activeProfile, timelineItems, properties } = data;

	function goBack() {
		// Go back to the previous page or the experts list
		goto('/experts');
	}
</script>

<main class="flex-grow py-8 pt-24">
	<div class="container mx-auto p-6">
		<button class="btn btn-secondary mb-6" on:click={goBack}> ← Back to Experts </button>
		<ExpertProfile {activeProfile} {timelineItems} {properties} />
	</div>
</main>
