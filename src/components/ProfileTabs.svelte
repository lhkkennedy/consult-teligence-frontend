<script lang="ts">
	import Timeline from './Timeline.svelte';
	import Properties from './Properties.svelte';
	import Clock from '@lucide/svelte/icons/clock';
	import Building from '@lucide/svelte/icons/building';

	export let personId: string;

	let activeTab = 'timeline';

	const tabs = [
		{ id: 'timeline', label: 'Timeline', icon: Clock },
		{ id: 'properties', label: 'Properties', icon: Building }
	];
</script>

<div class="profile-tabs">
	<!-- Tab Navigation -->
	<div class="flex border-b border-[#2D3748] mb-6">
		{#each tabs as tab}
			<button
				class="flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors {activeTab === tab.id ? 'text-white border-b-2 border-blue-500' : 'text-[#A0AEC0] hover:text-white'}"
				on:click={() => activeTab = tab.id}
			>
				<svelte:component this={tab.icon} size={18} />
				<span>{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="tab-content">
		{#if activeTab === 'timeline'}
			<Timeline {personId} />
		{:else if activeTab === 'properties'}
			<Properties />
		{/if}
	</div>
</div> 