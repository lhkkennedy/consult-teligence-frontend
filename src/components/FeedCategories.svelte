<script lang="ts">
	import Home from '@lucide/svelte/icons/home';
	import Users from '@lucide/svelte/icons/users';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Globe from '@lucide/svelte/icons/globe';

	export let currentCategory: string;
	export let onCategoryChange: (category: string) => void;

	const categories = [
		{
			id: 'all',
			label: 'All Posts',
			icon: Home,
			description: 'View all posts from the network'
		},
		{
			id: 'following',
			label: 'Following',
			icon: Users,
			description: 'Posts from people you follow'
		},
		{
			id: 'trending',
			label: 'Trending',
			icon: TrendingUp,
			description: 'Most popular posts right now'
		},
		{
			id: 'saved',
			label: 'Saved',
			icon: Bookmark,
			description: 'Posts you\'ve saved for later'
		},
		{
			id: 'discover',
			label: 'Discover',
			icon: Globe,
			description: 'Discover new content and people'
		}
	];

	function handleCategoryClick(categoryId: string) {
		onCategoryChange(categoryId);
	}
</script>

<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
	<h3 class="mb-4 text-sm font-medium text-gray-900 dark:text-white">Feed Categories</h3>
	
	<div class="space-y-2">
		{#each categories as category}
			<button
				on:click={() => handleCategoryClick(category.id)}
				class="flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-[#2D3748] {currentCategory === category.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''}"
			>
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg {currentCategory === category.id ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-[#2D3748]'}"
				>
					<svelte:component 
						this={category.icon} 
						size={16} 
						class="transition-colors {currentCategory === category.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-[#A0AEC0]'}"
					/>
				</div>
				<div class="flex-1 min-w-0">
					<div
						class="text-sm font-medium {currentCategory === category.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}"
					>
						{category.label}
					</div>
					<div class="text-xs text-gray-500 dark:text-[#A0AEC0]">
						{category.description}
					</div>
				</div>
				{#if currentCategory === category.id}
					<div class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Quick Stats -->
	<div class="mt-6 rounded-lg bg-gray-50 p-3 dark:bg-[#2D3748]">
		<h4 class="mb-2 text-xs font-medium text-gray-700 dark:text-[#A0AEC0]">Quick Stats</h4>
		<div class="grid grid-cols-2 gap-3 text-xs">
			<div class="text-center">
				<div class="font-semibold text-gray-900 dark:text-white">1.2k</div>
				<div class="text-gray-500 dark:text-[#A0AEC0]">Posts Today</div>
			</div>
			<div class="text-center">
				<div class="font-semibold text-gray-900 dark:text-white">45</div>
				<div class="text-gray-500 dark:text-[#A0AEC0]">New Deals</div>
			</div>
		</div>
	</div>
</div>