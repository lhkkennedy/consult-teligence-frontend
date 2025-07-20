<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Hash from '@lucide/svelte/icons/hash';

	// Props
	export let initialQuery = '';
	export let onSearch: (query: string) => void;

	let searchQuery = initialQuery;
	let showSuggestions = false;
	let searchInput: HTMLInputElement;

	// Mock search suggestions
	const suggestions = [
		{ type: 'trending', text: 'Commercial Real Estate', icon: TrendingUp },
		{ type: 'trending', text: 'Market Analysis', icon: TrendingUp },
		{ type: 'hashtag', text: '#NewListing', icon: Hash },
		{ type: 'hashtag', text: '#DealClosed', icon: Hash },
		{ type: 'trending', text: 'Investment Opportunities', icon: TrendingUp },
		{ type: 'hashtag', text: '#MarketInsights', icon: Hash }
	];

	function handleSearch() {
		if (searchQuery.trim()) {
			onSearch(searchQuery.trim());
			showSuggestions = false;
		}
	}

	function handleSuggestionClick(suggestion: string) {
		searchQuery = suggestion;
		handleSearch();
	}

	function handleClearSearch() {
		searchQuery = '';
		onSearch('');
		showSuggestions = false;
		if (searchInput) {
			searchInput.focus();
		}
	}

	function handleInputFocus() {
		if (searchQuery) {
			showSuggestions = true;
		}
	}

	function handleInputBlur() {
		// Delay hiding suggestions to allow for clicks
		setTimeout(() => {
			showSuggestions = false;
		}, 200);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		} else if (event.key === 'Escape') {
			handleClearSearch();
		}
	}

	// Update searchQuery when initialQuery changes
	$: if (initialQuery !== searchQuery) {
		searchQuery = initialQuery;
	}

	// Filter suggestions based on current query
	$: filteredSuggestions = searchQuery
		? suggestions.filter(suggestion =>
				suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: suggestions.slice(0, 3);
</script>

<div class="relative">
	<!-- Search Input -->
	<div class="relative">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<Search size={16} class="text-gray-400" />
		</div>
		<input
			bind:this={searchInput}
			bind:value={searchQuery}
			type="text"
			placeholder="Search posts, people, properties..."
			on:focus={handleInputFocus}
			on:blur={handleInputBlur}
			on:keydown={handleKeydown}
			class="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white dark:placeholder-gray-400"
		/>
		{#if searchQuery}
			<button
				on:click={handleClearSearch}
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
			>
				<X size={16} />
			</button>
		{/if}
	</div>

	<!-- Search Suggestions -->
	{#if showSuggestions && filteredSuggestions.length > 0}
		<div class="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#2D3748]">
			<div class="px-3 py-2">
				<h4 class="text-xs font-medium text-gray-500 dark:text-[#A0AEC0] uppercase tracking-wide">
					{searchQuery ? 'Search Results' : 'Trending Topics'}
				</h4>
			</div>
			{#each filteredSuggestions as suggestion}
				<button
					on:click={() => handleSuggestionClick(suggestion.text)}
					class="flex w-full items-center space-x-3 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#1E2130]"
				>
					<svelte:component 
						this={suggestion.icon} 
						size={14} 
						class="text-gray-400 dark:text-[#A0AEC0]" 
					/>
					<span class="text-gray-700 dark:text-[#E2E8F0]">{suggestion.text}</span>
				</button>
			{/each}
		</div>
	{/if}

	<!-- Quick Search Tips -->
	{#if !searchQuery && !showSuggestions}
		<div class="mt-2 text-xs text-gray-500 dark:text-[#A0AEC0]">
			<div class="flex items-center space-x-4">
				<span>💡 Try: "commercial" or "deals"</span>
				<span>📍 Location: "New York"</span>
			</div>
		</div>
	{/if}
</div>