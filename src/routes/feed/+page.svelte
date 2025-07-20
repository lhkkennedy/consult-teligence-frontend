<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Header from '../../components/Header.svelte';
	import FeedPost from '../../components/FeedPost.svelte';
	import FeedFilters from '../../components/FeedFilters.svelte';
	import FeedCategories from '../../components/FeedCategories.svelte';
	import FeedSearch from '../../components/FeedSearch.svelte';
	import LoadingScreen from '../../components/LoadingScreen.svelte';
	import type { TimelinePost } from '../../lib/types.js';
	import type { PageData } from './$types';

	// Props from server load function
	export let data: PageData;

	// Extract data from props
	$: ({ posts, feedStats, marketInsights, recommendedConnections, pagination, filters, error } = data);

	// Local state
	let loading = false;
	let isRefreshing = false;
	let lastRefreshTime = new Date();

	// Enhanced features
	let showNotifications = false;
	let notifications = [
		{ id: 1, type: 'new_post', message: 'Sarah Chen posted a new deal', time: '2m ago', read: false },
		{ id: 2, type: 'mention', message: 'You were mentioned in a post', time: '5m ago', read: false },
		{ id: 3, type: 'deal_update', message: 'Deal status updated to "Under Contract"', time: '10m ago', read: true }
	];
	let unreadNotifications = notifications.filter(n => !n.read).length;

	// User preferences and personalization
	let userPreferences = {
		preferredDealSizes: ['$5M - $25M', '$25M - $100M'],
		preferredPropertyTypes: ['Office', 'Retail', 'Industrial'],
		preferredLocations: ['New York', 'Los Angeles', 'Chicago'],
		notificationSettings: {
			newDeals: true,
			marketUpdates: true,
			mentions: true,
			connectionActivity: false
		}
	};

	// Navigation functions
	function updateUrl(newFilters: Partial<typeof filters>) {
		const url = new URL(window.location.href);
		const updatedFilters = { ...filters, ...newFilters };

		// Update URL parameters
		Object.entries(updatedFilters).forEach(([key, value]) => {
			if (value && value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)) {
				if (Array.isArray(value)) {
					url.searchParams.set(key, value.join(','));
				} else {
					url.searchParams.set(key, value.toString());
				}
			} else {
				url.searchParams.delete(key);
			}
		});

		// Navigate to new URL
		goto(url.pathname + url.search, { replaceState: true });
	}

	// Handle category change
	function handleCategoryChange(category: string) {
		updateUrl({ category });
	}

	// Handle search
	function handleSearch(query: string) {
		updateUrl({ search: query });
	}

	// Handle filter change
	function handleFilterChange(newFilters: Partial<typeof filters>) {
		updateUrl(newFilters);
	}

	// Handle sort change
	function handleSortChange(sort: string) {
		updateUrl({ sortBy: sort });
	}

	// Refresh feed
	async function refreshFeed() {
		isRefreshing = true;
		try {
			// Reload the page to get fresh data
			await goto(window.location.href, { replaceState: true });
			lastRefreshTime = new Date();
		} catch (err) {
			console.error('Failed to refresh feed:', err);
		} finally {
			isRefreshing = false;
		}
	}

	// Load more posts
	async function loadMorePosts() {
		if (!pagination.hasMore || loading) return;
		
		loading = true;
		try {
			const nextPage = pagination.page + 1;
			const url = new URL(window.location.href);
			url.searchParams.set('page', nextPage.toString());
			await goto(url.pathname + url.search, { replaceState: true });
		} catch (err) {
			console.error('Failed to load more posts:', err);
		} finally {
			loading = false;
		}
	}

	// Enhanced post interaction handling
	async function handlePostInteraction(postId: string, action: string, data?: any) {
		try {
			const API_BASE_URL = 'http://localhost:1337/api';
			
			switch (action) {
				case 'like':
					await fetch(`${API_BASE_URL}/posts/${postId}/reactions`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							reaction_type: 'like',
							user_id: 'current_user' // This should come from auth
						})
					});
					break;
				case 'comment':
					await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							body: data?.comment || 'Great post!',
							user_id: 'current_user' // This should come from auth
						})
					});
					break;
				case 'save':
					await fetch(`${API_BASE_URL}/posts/${postId}/saves`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							user_id: 'current_user' // This should come from auth
						})
					});
					break;
				case 'share':
					await fetch(`${API_BASE_URL}/posts/${postId}/shares`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							share_type: 'network',
							user_id: 'current_user' // This should come from auth
						})
					});
					break;
				case 'view':
					await fetch(`${API_BASE_URL}/posts/${postId}/views`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							user_id: 'current_user', // This should come from auth
							duration: data?.duration || 0
						})
					});
					break;
			}

			// Refresh the feed to show updated data
			await refreshFeed();
		} catch (error) {
			console.error(`Failed to handle ${action} interaction:`, error);
		}
	}

	// Handle notification toggle
	function toggleNotifications() {
		showNotifications = !showNotifications;
	}

	// Mark notification as read
	function markNotificationAsRead(notificationId: number) {
		const notification = notifications.find(n => n.id === notificationId);
		if (notification) {
			notification.read = true;
			notifications = [...notifications];
			unreadNotifications = notifications.filter(n => !n.read).length;
		}
	}

	// Handle connection request
	function handleConnectionRequest(connectionId: number) {
		console.log('Connection request sent to:', connectionId);
		// In a real app, this would send a connection request
	}

	// Auto-refresh every 5 minutes
	let refreshInterval: NodeJS.Timeout;
	onMount(() => {
		refreshInterval = setInterval(refreshFeed, 5 * 60 * 1000);
		
		return () => {
			if (refreshInterval) clearInterval(refreshInterval);
		};
	});
</script>

<svelte:head>
	<title>Feed - Professional Real Estate Network</title>
	<meta name="description" content="Stay updated with the latest real estate news, deals, and insights from industry professionals." />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-[#0F1419]">
	<Header />

	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Enhanced Page Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Feed</h1>
					<p class="mt-2 text-gray-600 dark:text-[#A0AEC0]">
						Stay updated with the latest real estate news, deals, and insights from industry professionals.
					</p>
				</div>
				<div class="flex items-center space-x-3">
					<!-- Notifications -->
					<div class="relative">
						<button
							on:click={toggleNotifications}
							class="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#2D3748] dark:hover:text-gray-300"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25V18h12.75l-2.25-2.25V9.75a6 6 0 00-6-6z" />
							</svg>
							{#if unreadNotifications > 0}
								<span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
									{unreadNotifications}
								</span>
							{/if}
						</button>
						{#if showNotifications}
							<div class="absolute right-0 z-50 mt-2 w-80 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#2D3748]">
								<div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
									<h3 class="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
								</div>
								<div class="max-h-64 overflow-y-auto">
									{#each notifications as notification}
										<button
											on:click={() => markNotificationAsRead(notification.id)}
											class="flex w-full items-start space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#1E2130] {!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}"
										>
											<div class="flex-shrink-0">
												<div class="h-2 w-2 rounded-full {!notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}"></div>
											</div>
											<div class="flex-1 min-w-0">
												<p class="text-sm text-gray-900 dark:text-white">{notification.message}</p>
												<p class="text-xs text-gray-500 dark:text-[#A0AEC0]">{notification.time}</p>
											</div>
										</button>
									{/each}
								</div>
								<div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
									<a href="/notifications" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
										View all notifications
									</a>
								</div>
							</div>
						{/if}
					</div>

					<button
						on:click={refreshFeed}
						disabled={isRefreshing}
						class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						{#if isRefreshing}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Refreshing...
						{:else}
							<svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Refresh
						{/if}
					</button>
					<div class="text-xs text-gray-500 dark:text-[#A0AEC0]">
						Last updated: {lastRefreshTime.toLocaleTimeString()}
					</div>
				</div>
			</div>

			<!-- Enhanced Feed Stats -->
			<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-gray-900 dark:text-white">{feedStats.totalPosts}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">Total Posts</div>
				</div>
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-green-600 dark:text-green-400">{feedStats.newPosts}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">New Today</div>
				</div>
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{feedStats.activeDeals}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">Active Deals</div>
				</div>
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{feedStats.trendingTopics}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">Trending</div>
				</div>
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{marketInsights.activeDeals}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">Market Deals</div>
				</div>
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{marketInsights.avgDealSize}</div>
					<div class="text-sm text-gray-500 dark:text-[#A0AEC0]">Avg Deal Size</div>
				</div>
			</div>

			<!-- Market Sentiment Bar -->
			<div class="mt-4 rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-sm font-medium text-gray-900 dark:text-white">Market Sentiment</h3>
						<p class="text-xs text-gray-500 dark:text-[#A0AEC0]">Based on recent activity</p>
					</div>
					<div class="flex items-center space-x-2">
						<span class="text-sm font-medium text-gray-900 dark:text-white">{marketInsights.marketSentiment}</span>
						<div class="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
							<div 
								class="h-2 rounded-full bg-green-500" 
								style="width: {marketInsights.sentimentScore}%"
							></div>
						</div>
						<span class="text-xs text-gray-500 dark:text-[#A0AEC0]">{marketInsights.sentimentScore}%</span>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
			<!-- Enhanced Sidebar -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Search -->
				<FeedSearch 
					initialQuery={filters.search}
					onSearch={handleSearch}
				/>

				<!-- Categories -->
				<FeedCategories 
					currentCategory={filters.category} 
					onCategoryChange={handleCategoryChange} 
				/>

				<!-- Enhanced Filters -->
				<FeedFilters 
					filters={filters}
					sortBy={filters.sortBy}
					onFilterChange={handleFilterChange}
					onSortChange={handleSortChange}
				/>

				<!-- Market Insights -->
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<h3 class="mb-4 text-sm font-medium text-gray-900 dark:text-white">Market Insights</h3>
					<div class="space-y-3">
						<div>
							<h4 class="text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Trending Topics</h4>
							<div class="flex flex-wrap gap-1">
								{#each marketInsights.trendingTopics as topic}
									<span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
										{topic}
									</span>
								{/each}
							</div>
						</div>
						<div>
							<h4 class="text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Top Markets</h4>
							<div class="space-y-1">
								{#each marketInsights.topMarkets as market}
									<div class="flex items-center justify-between text-xs">
										<span class="text-gray-600 dark:text-[#A0AEC0]">{market}</span>
										<span class="text-gray-900 dark:text-white font-medium">Active</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Recommended Connections -->
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<h3 class="mb-4 text-sm font-medium text-gray-900 dark:text-white">Recommended Connections</h3>
					<div class="space-y-3">
						{#each recommendedConnections as connection}
							<div class="flex items-center space-x-3">
								<img
									src={connection.avatar}
									alt={connection.name}
									class="h-8 w-8 rounded-full object-cover"
								/>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-gray-900 dark:text-white truncate">{connection.name}</p>
									<p class="text-xs text-gray-500 dark:text-[#A0AEC0] truncate">{connection.company}</p>
									<p class="text-xs text-gray-400 dark:text-[#718096]">{connection.mutualConnections} mutual connections</p>
								</div>
								<button
									on:click={() => handleConnectionRequest(connection.id)}
									class="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
								>
									Connect
								</button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
					<h3 class="mb-4 text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h3>
					<div class="space-y-2">
						<button class="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
							Create Post
						</button>
						<button class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white dark:hover:bg-[#1E2130]">
							Share Property
						</button>
						<button class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white dark:hover:bg-[#1E2130]">
							Start Deal
						</button>
					</div>
				</div>
			</div>

			<!-- Enhanced Main Feed -->
			<div class="lg:col-span-3">
				{#if error}
					<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
								<div class="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
								<button
									on:click={refreshFeed}
									class="mt-2 text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
								>
									Try again
								</button>
							</div>
						</div>
					</div>
				{:else if posts.length === 0}
					<div class="rounded-lg bg-white p-8 text-center dark:bg-[#1E2130]">
						<svg class="mx-auto h-12 w-12 text-gray-400 dark:text-[#4A5568]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
						<p class="mt-1 text-sm text-gray-500 dark:text-[#A0AEC0]">
							Try adjusting your filters or search terms.
						</p>
						<div class="mt-4">
							<button
								on:click={() => {
									const url = new URL(window.location.href);
									url.search = '';
									goto(url.pathname, { replaceState: true });
								}}
								class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Clear all filters
							</button>
						</div>
					</div>
				{:else}
					<!-- Enhanced Posts -->
					<div class="space-y-6">
						{#each posts as post (post.post_id)}
							<FeedPost 
								{post} 
								onInteraction={handlePostInteraction}
							/>
						{/each}
					</div>

					<!-- Enhanced Load More -->
					{#if pagination.hasMore}
						<div class="mt-8 text-center">
							<button
								on:click={loadMorePosts}
								disabled={loading}
								class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
							>
								{#if loading}
									<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Loading...
								{:else}
									Load More Posts
									<span class="ml-2 text-xs opacity-75">
										({pagination.total - posts.length} remaining)
									</span>
								{/if}
							</button>
						</div>
					{:else if posts.length > 0}
						<div class="mt-8 text-center">
							<div class="rounded-lg bg-gray-50 p-4 dark:bg-[#2D3748]">
								<p class="text-sm text-gray-500 dark:text-[#A0AEC0]">
									You've reached the end of your feed. Check back later for more updates!
								</p>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>