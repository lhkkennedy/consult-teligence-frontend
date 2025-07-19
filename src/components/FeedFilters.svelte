<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Filter from '@lucide/svelte/icons/filter';
	import SortAsc from '@lucide/svelte/icons/sort-asc';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Image from '@lucide/svelte/icons/image';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Building from '@lucide/svelte/icons/building';
	import TrendingUp from '@lucide/svelte/icons/trending-up';

	export let filters: {
		postTypes: string[];
		sentiments: string[];
		dateRange: string;
		hasMedia: boolean;
		hasComments: boolean;
		dealSize: string;
		location: string;
		propertyType: string[];
	};
	export let sortBy: string;
	export let onFilterChange: (filters: any) => void;
	export let onSortChange: (sort: string) => void;

	// Local state
	let showFilters = false;
	let showSortMenu = false;
	let showAdvancedFilters = false;

	// Available options
	const postTypes = [
		{ value: 'NewListing', label: 'New Listing', color: 'text-green-600' },
		{ value: 'ProgressUpdate', label: 'Progress Update', color: 'text-blue-600' },
		{ value: 'Closing', label: 'Closing', color: 'text-purple-600' },
		{ value: 'Insight', label: 'Insight', color: 'text-yellow-600' },
		{ value: 'property', label: 'Property', color: 'text-indigo-600' }
	];

	const sentiments = [
		{ value: 'Bull', label: 'Bullish', icon: '📈', color: 'text-green-600' },
		{ value: 'Bear', label: 'Bearish', icon: '📉', color: 'text-red-600' },
		{ value: 'Neutral', label: 'Neutral', icon: '➡️', color: 'text-gray-600' }
	];

	const dateRanges = [
		{ value: 'all', label: 'All Time' },
		{ value: 'today', label: 'Today' },
		{ value: 'week', label: 'This Week' },
		{ value: 'month', label: 'This Month' },
		{ value: 'quarter', label: 'This Quarter' },
		{ value: 'year', label: 'This Year' }
	];

	const dealSizes = [
		{ value: 'all', label: 'All Sizes' },
		{ value: '< $5M', label: 'Under $5M' },
		{ value: '$5M - $25M', label: '$5M - $25M' },
		{ value: '$25M - $100M', label: '$25M - $100M' },
		{ value: '$100M+', label: '$100M+' }
	];

	const propertyTypes = [
		{ value: 'Office', label: 'Office', icon: Building },
		{ value: 'Retail', label: 'Retail', icon: Building },
		{ value: 'Industrial', label: 'Industrial', icon: Building },
		{ value: 'Residential', label: 'Residential', icon: Building },
		{ value: 'Hospitality', label: 'Hospitality', icon: Building },
		{ value: 'Mixed-Use', label: 'Mixed-Use', icon: Building }
	];

	const sortOptions = [
		{ value: 'recent', label: 'Most Recent', icon: SortAsc },
		{ value: 'popular', label: 'Most Popular', icon: SortAsc },
		{ value: 'trending', label: 'Trending', icon: TrendingUp },
		{ value: 'engagement', label: 'High Engagement', icon: TrendingUp }
	];

	// Handle post type toggle
	function togglePostType(type: string) {
		const newPostTypes = filters.postTypes.includes(type)
			? filters.postTypes.filter(t => t !== type)
			: [...filters.postTypes, type];
		onFilterChange({ postTypes: newPostTypes });
	}

	// Handle sentiment toggle
	function toggleSentiment(sentiment: string) {
		const newSentiments = filters.sentiments.includes(sentiment)
			? filters.sentiments.filter(s => s !== sentiment)
			: [...filters.sentiments, sentiment];
		onFilterChange({ sentiments: newSentiments });
	}

	// Handle date range change
	function handleDateRangeChange(range: string) {
		onFilterChange({ dateRange: range });
	}

	// Handle media filter toggle
	function toggleMediaFilter() {
		onFilterChange({ hasMedia: !filters.hasMedia });
	}

	// Handle comments filter toggle
	function toggleCommentsFilter() {
		onFilterChange({ hasComments: !filters.hasComments });
	}

	// Handle deal size change
	function handleDealSizeChange(size: string) {
		onFilterChange({ dealSize: size });
	}

	// Handle location change
	function handleLocationChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onFilterChange({ location: target.value });
	}

	// Handle property type toggle
	function togglePropertyType(type: string) {
		const newPropertyTypes = filters.propertyType.includes(type)
			? filters.propertyType.filter(t => t !== type)
			: [...filters.propertyType, type];
		onFilterChange({ propertyType: newPropertyTypes });
	}

	// Handle sort change
	function handleSortChange(sort: string) {
		onSortChange(sort);
		showSortMenu = false;
	}

	// Clear all filters
	function clearAllFilters() {
		onFilterChange({
			postTypes: [],
			sentiments: [],
			dateRange: 'all',
			hasMedia: false,
			hasComments: false,
			dealSize: 'all',
			location: '',
			propertyType: []
		});
	}

	// Get active filters count
	$: activeFiltersCount = 
		filters.postTypes.length + 
		filters.sentiments.length + 
		(filters.dateRange !== 'all' ? 1 : 0) + 
		(filters.hasMedia ? 1 : 0) + 
		(filters.hasComments ? 1 : 0) +
		(filters.dealSize !== 'all' ? 1 : 0) +
		(filters.location ? 1 : 0) +
		filters.propertyType.length;
</script>

<div class="rounded-lg bg-white p-4 shadow-sm dark:bg-[#1E2130]">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<Filter size={16} class="text-gray-500 dark:text-[#A0AEC0]" />
			<h3 class="text-sm font-medium text-gray-900 dark:text-white">Filters</h3>
			{#if activeFiltersCount > 0}
				<span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
					{activeFiltersCount}
				</span>
			{/if}
		</div>
		<div class="flex items-center space-x-2">
			{#if activeFiltersCount > 0}
				<button
					on:click={clearAllFilters}
					class="text-xs text-gray-500 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:text-gray-300"
				>
					Clear all
				</button>
			{/if}
			<button
				on:click={() => (showFilters = !showFilters)}
				class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#2D3748] dark:hover:text-gray-300"
			>
				<ChevronDown size={16} class="transition-transform {showFilters ? 'rotate-180' : ''}" />
			</button>
		</div>
	</div>

	<!-- Sort Options -->
	<div class="mb-4">
		<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Sort by</label>
		<div class="relative">
			<button
				on:click={() => (showSortMenu = !showSortMenu)}
				class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white"
			>
				<span>
					{sortOptions.find(option => option.value === sortBy)?.label || 'Most Recent'}
				</span>
				<ChevronDown size={16} class="text-gray-400" />
			</button>
			{#if showSortMenu}
				<div
					class="absolute top-full left-0 right-0 z-10 mt-1 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#2D3748]"
				>
					{#each sortOptions as option}
						<button
							on:click={() => handleSortChange(option.value)}
							class="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1E2130] {sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''}"
						>
							<svelte:component this={option.icon} size={16} class="mr-2" />
							{option.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if showFilters}
		<div class="space-y-4">
			<!-- Post Types -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Post Types</label>
				<div class="space-y-2">
					{#each postTypes as type}
						<label class="flex items-center">
							<input
								type="checkbox"
								checked={filters.postTypes.includes(type.value)}
								on:change={() => togglePostType(type.value)}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748]"
							/>
							<span class="ml-2 text-sm text-gray-700 dark:text-[#A0AEC0] {type.color}">
								{type.label}
							</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Sentiments -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Market Sentiment</label>
				<div class="space-y-2">
					{#each sentiments as sentiment}
						<label class="flex items-center">
							<input
								type="checkbox"
								checked={filters.sentiments.includes(sentiment.value)}
								on:change={() => toggleSentiment(sentiment.value)}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748]"
							/>
							<span class="ml-2 text-sm text-gray-700 dark:text-[#A0AEC0]">
								{sentiment.icon} {sentiment.label}
							</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Date Range -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Date Range</label>
				<div class="relative">
					<Calendar size={16} class="absolute left-3 top-2.5 text-gray-400" />
					<select
						value={filters.dateRange}
						on:change={(e) => handleDateRangeChange(e.target.value)}
						class="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white"
					>
						{#each dateRanges as range}
							<option value={range.value}>{range.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Deal Size -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Deal Size</label>
				<div class="relative">
					<DollarSign size={16} class="absolute left-3 top-2.5 text-gray-400" />
					<select
						value={filters.dealSize}
						on:change={(e) => handleDealSizeChange(e.target.value)}
						class="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white"
					>
						{#each dealSizes as size}
							<option value={size.value}>{size.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Location -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Location</label>
				<div class="relative">
					<MapPin size={16} class="absolute left-3 top-2.5 text-gray-400" />
					<input
						type="text"
						value={filters.location}
						on:input={handleLocationChange}
						placeholder="Enter location..."
						class="w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white dark:placeholder-gray-400"
					/>
				</div>
			</div>

			<!-- Property Types -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Property Types</label>
				<div class="space-y-2">
					{#each propertyTypes as type}
						<label class="flex items-center">
							<input
								type="checkbox"
								checked={filters.propertyType.includes(type.value)}
								on:change={() => togglePropertyType(type.value)}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748]"
							/>
							<span class="ml-2 text-sm text-gray-700 dark:text-[#A0AEC0]">
								{type.label}
							</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Content Filters -->
			<div>
				<label class="block text-xs font-medium text-gray-700 dark:text-[#A0AEC0] mb-2">Content</label>
				<div class="space-y-2">
					<label class="flex items-center">
						<input
							type="checkbox"
							checked={filters.hasMedia}
							on:change={toggleMediaFilter}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748]"
						/>
						<Image size={16} class="ml-2 text-gray-400" />
						<span class="ml-2 text-sm text-gray-700 dark:text-[#A0AEC0]">Has Media</span>
					</label>
					<label class="flex items-center">
						<input
							type="checkbox"
							checked={filters.hasComments}
							on:change={toggleCommentsFilter}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748]"
						/>
						<MessageSquare size={16} class="ml-2 text-gray-400" />
						<span class="ml-2 text-sm text-gray-700 dark:text-[#A0AEC0]">Has Comments</span>
					</label>
				</div>
			</div>
		</div>
	{/if}
</div>