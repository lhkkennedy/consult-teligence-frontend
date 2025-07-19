<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from '../../components/Header.svelte';
	import FeedPost from '../../components/FeedPost.svelte';
	import FeedFilters from '../../components/FeedFilters.svelte';
	import FeedCategories from '../../components/FeedCategories.svelte';
	import FeedSearch from '../../components/FeedSearch.svelte';
	import LoadingScreen from '../../components/LoadingScreen.svelte';
	import { mockTimelinePosts, mockTimelinePosts2, mockTimelinePosts3 } from '../../lib/mockData.js';
	import type { TimelinePost } from '../../lib/types.js';

	// Feed state
	let posts: TimelinePost[] = [];
	let filteredPosts: TimelinePost[] = [];
	let loading = true;
	let error = '';
	let currentCategory = 'all';
	let searchQuery = '';
	let sortBy = 'recent';
	let filters = {
		postTypes: [] as string[],
		sentiments: [] as string[],
		dateRange: 'all' as string,
		hasMedia: false,
		hasComments: false,
		dealSize: 'all' as string,
		location: '' as string,
		propertyType: [] as string[]
	};

	// Pagination
	let currentPage = 1;
	let postsPerPage = 10;
	let hasMorePosts = true;

	// Advanced features
	let showAdvancedFilters = false;
	let isRefreshing = false;
	let lastRefreshTime = new Date();
	let feedStats = {
		totalPosts: 0,
		newPosts: 0,
		activeDeals: 0,
		trendingTopics: 0
	};

	// Enhanced features
	let showNotifications = false;
	let notifications = [
		{ id: 1, type: 'new_post', message: 'Sarah Chen posted a new deal', time: '2m ago', read: false },
		{ id: 2, type: 'mention', message: 'You were mentioned in a post', time: '5m ago', read: false },
		{ id: 3, type: 'deal_update', message: 'Deal status updated to "Under Contract"', time: '10m ago', read: true }
	];
	let unreadNotifications = notifications.filter(n => !n.read).length;

	// Smart recommendations
	let recommendedConnections = [
		{ id: 1, name: 'Alex Thompson', company: 'Thompson Capital', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', mutualConnections: 5, specialty: 'Commercial Real Estate' },
		{ id: 2, name: 'Maria Garcia', company: 'Garcia Development', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100', mutualConnections: 3, specialty: 'Residential Development' },
		{ id: 3, name: 'David Chen', company: 'Chen Investment Group', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', mutualConnections: 7, specialty: 'Investment Management' }
	];

	// Market insights
	let marketInsights = {
		trendingTopics: ['Commercial Real Estate', 'Market Analysis', 'Investment Opportunities', 'Deal Flow'],
		marketSentiment: 'Bullish',
		sentimentScore: 75,
		activeDeals: 234,
		avgDealSize: '$15.2M',
		topMarkets: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco']
	};

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

	// Combine all mock timeline posts with enhanced data
	const allPosts = [
		...mockTimelinePosts,
		...mockTimelinePosts2,
		...mockTimelinePosts3
	].map((post, index) => ({
		...post,
		author_name: getAuthorName(index),
		author_avatar: getAuthorAvatar(index),
		author_company: getAuthorCompany(index),
		author_role: getAuthorRole(index),
		property_data: getPropertyData(post.property_uid),
		engagement_score: Math.floor(Math.random() * 100) + 10,
		deal_size: getDealSize(index),
		location: getLocation(index),
		property_type: getPropertyType(index),
		is_trending: Math.random() > 0.7,
		is_featured: Math.random() > 0.8,
		read_time: Math.floor(Math.random() * 5) + 1,
		tags: getTags(post.post_type, post.sentiment),
		view_count: Math.floor(Math.random() * 1000) + 50,
		share_count: Math.floor(Math.random() * 50) + 5,
		save_count: Math.floor(Math.random() * 20) + 2,
		author_verified: Math.random() > 0.3,
		author_followers: Math.floor(Math.random() * 5000) + 100,
		deal_stage: getDealStage(post.post_type),
		roi_estimate: getROIEstimate(),
		market_trend: getMarketTrend()
	}));

	function getAuthorName(index: number): string {
		const authors = ['John Smith', 'Emma Johnson', 'Carlos Rodriguez', 'Sarah Chen', 'Michael Davis', 'Lisa Wang', 'David Thompson', 'Maria Garcia'];
		return authors[index % authors.length];
	}

	function getAuthorAvatar(index: number): string {
		const avatars = [
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
			'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
			'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
		];
		return avatars[index % avatars.length];
	}

	function getAuthorCompany(index: number): string {
		const companies = ['Smith & Associates', 'Urban Development Partners', 'Global Hospitality Advisors', 'Chen Real Estate Group', 'Davis Investment Group', 'Wang Properties', 'Thompson Capital', 'Garcia Development'];
		return companies[index % companies.length];
	}

	function getAuthorRole(index: number): string {
		const roles = ['Senior Real Estate Consultant', 'Director of Development', 'Head of Investments', 'Principal Broker', 'Investment Manager', 'Development Director', 'Capital Partner', 'Development Manager'];
		return roles[index % roles.length];
	}

	function getPropertyData(propertyUid?: string) {
		if (!propertyUid) return null;
		const properties = [
			{
				title: 'Dockside Industrial Park',
				address: '45 Fenchurch St, London EC3',
				images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
				roles: ['Developer', 'Investor'],
				headline_metric: '5.25% cap rate',
				deal_size: 22000000,
				property_type: 'Industrial'
			},
			{
				title: 'Riverside Office Complex',
				address: '123 Riverside Dr, Manchester M1',
				images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800'],
				roles: ['Developer'],
				headline_metric: '75% complete',
				deal_size: 35000000,
				property_type: 'Office'
			},
			{
				title: 'Harborview Retail Center',
				address: '789 Harbor Blvd, Liverpool L1',
				images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
				roles: ['Broker', 'Investor'],
				headline_metric: 'Sold at 4.8% cap',
				deal_size: 45000000,
				property_type: 'Retail'
			}
		];
		return properties[Math.floor(Math.random() * properties.length)];
	}

	function getDealSize(index: number): string {
		const sizes = ['< $5M', '$5M - $25M', '$25M - $100M', '$100M+'];
		return sizes[index % sizes.length];
	}

	function getLocation(index: number): string {
		const locations = ['New York, NY', 'London, UK', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'San Francisco, CA', 'Boston, MA', 'Seattle, WA'];
		return locations[index % locations.length];
	}

	function getPropertyType(index: number): string {
		const types = ['Office', 'Retail', 'Industrial', 'Residential', 'Hospitality', 'Mixed-Use'];
		return types[index % types.length];
	}

	function getTags(postType: string, sentiment: string): string[] {
		const tags = [];
		if (postType === 'NewListing') tags.push('#NewListing', '#Investment');
		if (postType === 'Closing') tags.push('#DealClosed', '#Success');
		if (postType === 'Insight') tags.push('#MarketInsights', '#Analysis');
		if (sentiment === 'Bull') tags.push('#Bullish', '#Opportunity');
		if (sentiment === 'Bear') tags.push('#MarketWatch', '#Caution');
		return tags;
	}

	function getDealStage(postType: string): string {
		switch (postType) {
			case 'NewListing': return 'Lead';
			case 'ProgressUpdate': return 'Under Contract';
			case 'Closing': return 'Closed';
			default: return 'Active';
		}
	}

	function getROIEstimate(): string {
		const rois = ['8.5%', '12.3%', '15.7%', '9.2%', '11.8%'];
		return rois[Math.floor(Math.random() * rois.length)];
	}

	function getMarketTrend(): string {
		const trends = ['Rising', 'Stable', 'Declining', 'Volatile'];
		return trends[Math.floor(Math.random() * trends.length)];
	}

	// Load posts with enhanced functionality
	async function loadPosts() {
		loading = true;
		try {
			// Simulate API call with realistic delay
			await new Promise(resolve => setTimeout(resolve, 800));
			posts = allPosts;
			updateFeedStats();
			applyFilters();
			loading = false;
		} catch (err) {
			error = 'Failed to load posts';
			loading = false;
		}
	}

	// Refresh feed
	async function refreshFeed() {
		isRefreshing = true;
		try {
			await new Promise(resolve => setTimeout(resolve, 500));
			// Simulate new posts being added
			const newPosts = allPosts.slice(0, 3).map(post => ({
				...post,
				post_id: `new_${Date.now()}_${Math.random()}`,
				created_at: new Date().toISOString()
			}));
			posts = [...newPosts, ...posts];
			lastRefreshTime = new Date();
			updateFeedStats();
			applyFilters();
		} catch (err) {
			console.error('Failed to refresh feed:', err);
		} finally {
			isRefreshing = false;
		}
	}

	// Update feed statistics
	function updateFeedStats() {
		feedStats = {
			totalPosts: posts.length,
			newPosts: Math.floor(Math.random() * 10) + 1,
			activeDeals: posts.filter(p => p.post_type === 'NewListing' || p.post_type === 'ProgressUpdate').length,
			trendingTopics: posts.filter(p => p.is_trending).length
		};
	}

	// Enhanced filtering with more options
	function applyFilters() {
		let filtered = [...posts];

		// Apply category filter
		if (currentCategory !== 'all') {
			switch (currentCategory) {
				case 'following':
					// Simulate following filter
					filtered = filtered.filter((_, index) => index % 2 === 0);
					break;
				case 'trending':
					// Show trending posts
					filtered = filtered.filter(post => post.is_trending || (post.reactions?.length || 0) > 3);
					break;
				case 'saved':
					// Simulate saved posts
					filtered = filtered.filter((_, index) => index % 3 === 0);
					break;
				case 'discover':
					// Show posts from new connections or trending topics
					filtered = filtered.filter(post => post.is_featured || post.engagement_score > 70);
					break;
			}
		}

		// Apply search filter with enhanced matching
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(post =>
				post.body_md.toLowerCase().includes(query) ||
				(post as any).author_name?.toLowerCase().includes(query) ||
				(post as any).author_company?.toLowerCase().includes(query) ||
				(post as any).location?.toLowerCase().includes(query) ||
				(post as any).tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
				post.property_data?.title?.toLowerCase().includes(query)
			);
		}

		// Apply post type filters
		if (filters.postTypes.length > 0) {
			filtered = filtered.filter(post => filters.postTypes.includes(post.post_type));
		}

		// Apply sentiment filters
		if (filters.sentiments.length > 0) {
			filtered = filtered.filter(post => filters.sentiments.includes(post.sentiment));
		}

		// Apply media filter
		if (filters.hasMedia) {
			filtered = filtered.filter(post => post.media_urls && post.media_urls.length > 0);
		}

		// Apply comments filter
		if (filters.hasComments) {
			filtered = filtered.filter(post => post.comments && post.comments.length > 0);
		}

		// Apply deal size filter
		if (filters.dealSize !== 'all') {
			filtered = filtered.filter(post => (post as any).deal_size === filters.dealSize);
		}

		// Apply location filter
		if (filters.location) {
			filtered = filtered.filter(post => 
				(post as any).location?.toLowerCase().includes(filters.location.toLowerCase())
			);
		}

		// Apply property type filter
		if (filters.propertyType.length > 0) {
			filtered = filtered.filter(post => 
				filters.propertyType.includes((post as any).property_type)
			);
		}

		// Apply sorting with enhanced algorithms
		switch (sortBy) {
			case 'recent':
				filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
				break;
			case 'popular':
				filtered.sort((a, b) => (b.reactions?.length || 0) - (a.reactions?.length || 0));
				break;
			case 'trending':
				filtered.sort((a, b) => {
					const aScore = (a.reactions?.length || 0) + (a.comments?.length || 0) * 2 + (a as any).engagement_score;
					const bScore = (b.reactions?.length || 0) + (b.comments?.length || 0) * 2 + (b as any).engagement_score;
					return bScore - aScore;
				});
				break;
			case 'engagement':
				filtered.sort((a, b) => (b as any).engagement_score - (a as any).engagement_score);
				break;
		}

		filteredPosts = filtered;
		currentPage = 1;
		hasMorePosts = filteredPosts.length > postsPerPage;
	}

	// Load more posts
	function loadMorePosts() {
		if (!hasMorePosts) return;
		currentPage++;
		hasMorePosts = filteredPosts.length > currentPage * postsPerPage;
	}

	// Get paginated posts
	$: paginatedPosts = filteredPosts.slice(0, currentPage * postsPerPage);

	// Handle category change
	function handleCategoryChange(category: string) {
		currentCategory = category;
		applyFilters();
	}

	// Handle search
	function handleSearch(query: string) {
		searchQuery = query;
		applyFilters();
	}

	// Handle filter change
	function handleFilterChange(newFilters: any) {
		filters = { ...filters, ...newFilters };
		applyFilters();
	}

	// Handle sort change
	function handleSortChange(sort: string) {
		sortBy = sort;
		applyFilters();
	}

	// Enhanced post interaction handling
	function handlePostInteraction(postId: string, action: string, data?: any) {
		// Update post in the array
		const postIndex = posts.findIndex(p => p.post_id === postId);
		if (postIndex !== -1) {
			const post = posts[postIndex];
			switch (action) {
				case 'like':
					if (!post.reactions) post.reactions = [];
					post.reactions.push({
						id: `r_${Date.now()}`,
						user_id: 'current_user',
						reaction_type: 'like',
						created_at: new Date().toISOString()
					});
					break;
				case 'comment':
					if (!post.comments) post.comments = [];
					post.comments.push({
						id: `c_${Date.now()}`,
						user_id: 'current_user',
						body: data?.comment || 'Great post!',
						created_at: new Date().toISOString(),
						user_name: 'Current User',
						user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
					});
					break;
				case 'save':
					// Toggle save state
					(post as any).is_saved = !(post as any).is_saved;
					break;
				case 'share':
					// Handle share action
					console.log('Sharing post:', postId);
					break;
				case 'follow':
					// Handle follow action
					console.log('Following author of post:', postId);
					break;
			}
			posts = [...posts];
			applyFilters();
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
		loadPosts();
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
				<FeedSearch on:search={handleSearch} />

				<!-- Categories -->
				<FeedCategories 
					currentCategory={currentCategory} 
					onCategoryChange={handleCategoryChange} 
				/>

				<!-- Enhanced Filters -->
				<FeedFilters 
					filters={filters}
					sortBy={sortBy}
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
				{#if loading}
					<LoadingScreen />
				{:else if error}
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
							</div>
						</div>
					</div>
				{:else if paginatedPosts.length === 0}
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
									filters = {
										postTypes: [],
										sentiments: [],
										dateRange: 'all',
										hasMedia: false,
										hasComments: false,
										dealSize: 'all',
										location: '',
										propertyType: []
									};
									searchQuery = '';
									applyFilters();
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
						{#each paginatedPosts as post (post.post_id)}
							<FeedPost 
								{post} 
								onInteraction={handlePostInteraction}
							/>
						{/each}
					</div>

					<!-- Enhanced Load More -->
					{#if hasMorePosts}
						<div class="mt-8 text-center">
							<button
								on:click={loadMorePosts}
								class="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
							>
								Load More Posts
								<span class="ml-2 text-xs opacity-75">
									({filteredPosts.length - paginatedPosts.length} remaining)
								</span>
							</button>
						</div>
					{:else if paginatedPosts.length > 0}
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