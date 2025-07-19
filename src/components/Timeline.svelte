<script lang="ts">
	import TimelinePost from './TimelinePost.svelte';

	export let timelineItems: any[] = [];
	export let loading: boolean = false;
	export let error: string = '';
</script>

<div class="timeline-container">
	<!-- Timeline Posts -->
	<div class="space-y-6">
		{#each timelineItems as post}
			<TimelinePost {post} />
		{/each}
	</div>
	{#if loading}
		<div class="py-4 text-center text-gray-500 dark:text-[#A0AEC0]">Loading...</div>
	{/if}
	{#if error}
		<div class="py-4 text-center text-red-500">{error}</div>
	{/if}
	{#if !loading && timelineItems.length === 0}
		<div class="py-12 text-center text-gray-600 dark:text-[#A0AEC0]">No posts yet.</div>
	{/if}
</div>
