<script lang="ts">
	import Timeline from './Timeline.svelte';
	import Properties from './Properties.svelte';
	import Clock from '@lucide/svelte/icons/clock';
	import Building from '@lucide/svelte/icons/building';

	export let personId: string;
	export let timelineItems: any[] = [];
	export let properties: any[] = [];

	let activeTab = 'timeline';

	const tabs = [
		{ id: 'timeline', label: 'Timeline', icon: Clock },
		{ id: 'properties', label: 'Properties', icon: Building }
	];
</script>

<div class="profile-tabs">
	<!-- Tab Navigation -->
	<div class="flex border-b border-gray-200 dark:border-[#2D3748] mb-6 bg-white dark:bg-[#1E2130] rounded-t-lg">
		{#each tabs as tab}
			<button
				class="flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple {activeTab === tab.id ? 'text-accent-purple dark:text-white border-b-2 border-accent-purple dark:border-white' : 'text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white'}"
				on:click={() => activeTab = tab.id}
			>
				<svelte:component this={tab.icon} size={18} />
				<span>{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="tab-content bg-white dark:bg-[#1E2130] rounded-b-lg">
		{#if activeTab === 'timeline'}
			<Timeline timelineItems={timelineItems} />
		{:else if activeTab === 'properties'}
			<Properties properties={properties} />
		{/if}
	</div>
</div> 