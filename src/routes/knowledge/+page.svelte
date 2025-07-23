<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Header from '../../components/Header.svelte';
	import LoadingScreen from '../../components/LoadingScreen.svelte';
	import type { PageData } from './$types';
	import { Search, Filter, BookOpen, TrendingUp, Clock, User, Calendar, Tag, ArrowRight, Star, Eye, Share2, Bookmark } from 'lucide-svelte';

	// Props from server load function
	export let data: PageData;

	// Extract data from props
	$: ({ articles, categories, featuredArticles, popularArticles, recentArticles, pagination, filters, error } = data);

	// Local state
	let loading = false;
	let searchQuery = '';
	let selectedCategory = 'all';
	let selectedSort = 'recent';
	let selectedView = 'grid';
	let showFilters = false;
	let isVisible = false;

	// Filter states
	let selectedTags: string[] = [];
	let selectedAuthors: string[] = [];
	let dateRange = 'all';

	// Available categories and tags
	const availableCategories = [
		{ id: 'all', name: 'All Articles', count: articles?.length || 0 },
		{ id: 'investment-analysis', name: 'Investment Analysis', count: 12 },
		{ id: 'market-trends', name: 'Market Trends', count: 8 },
		{ id: 'property-development', name: 'Property Development', count: 15 },
		{ id: 'commercial-real-estate', name: 'Commercial Real Estate', count: 10 },
		{ id: 'residential-real-estate', name: 'Residential Real Estate', count: 7 },
		{ id: 'urban-planning', name: 'Urban Planning', count: 6 },
		{ id: 'sustainability', name: 'Sustainability', count: 9 },
		{ id: 'legal-regulatory', name: 'Legal & Regulatory', count: 5 },
		{ id: 'technology', name: 'Technology', count: 11 }
	];

	const availableTags = [
		'Investment', 'Market Analysis', 'Development', 'Sustainability', 'Technology',
		'Urban Planning', 'Commercial', 'Residential', 'Industrial', 'Retail',
		'Office', 'Mixed-Use', 'Green Building', 'Smart Cities', 'Fintech',
		'PropTech', 'REITs', 'Cap Rates', 'IRR', 'ROI'
	];

	const availableAuthors = [
		'Emma Johnson', 'John Smith', 'Maria Sanchez', 'Carlos Rodriguez',
		'Sarah Chen', 'Michael Brown', 'Lisa Wang', 'David Wilson'
	];

	// Filtered articles
	$: filteredArticles = articles?.filter(article => {
		// Search filter
		if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
			!article.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
			return false;
		}

		// Category filter
		if (selectedCategory !== 'all' && article.category !== selectedCategory) {
			return false;
		}

		// Tags filter
		if (selectedTags.length > 0 && !selectedTags.some(tag => 
			article.tags?.includes(tag))) {
			return false;
		}

		// Author filter
		if (selectedAuthors.length > 0 && !selectedAuthors.includes(article.author)) {
			return false;
		}

		return true;
	}) || [];

	// Sorted articles
	$: sortedArticles = [...filteredArticles].sort((a, b) => {
		switch (selectedSort) {
			case 'recent':
				return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
			case 'popular':
				return (b.viewCount || 0) - (a.viewCount || 0);
			case 'trending':
				return (b.engagementScore || 0) - (a.engagementScore || 0);
			case 'title':
				return a.title.localeCompare(b.title);
			default:
				return 0;
		}
	});

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

	function handleSearch() {
		updateUrl({ search: searchQuery });
	}

	function handleCategoryChange(category: string) {
		selectedCategory = category;
		updateUrl({ category });
	}

	function handleSortChange(sort: string) {
		selectedSort = sort;
		updateUrl({ sortBy: sort });
	}

	function handleTagToggle(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		updateUrl({ tags: selectedTags });
	}

	function handleAuthorToggle(author: string) {
		if (selectedAuthors.includes(author)) {
			selectedAuthors = selectedAuthors.filter(a => a !== author);
		} else {
			selectedAuthors = [...selectedAuthors, author];
		}
		updateUrl({ authors: selectedAuthors });
	}

	function handleArticleClick(articleId: string) {
		goto(`/knowledge/${articleId}`);
	}

	function handleShare(article: any) {
		if (navigator.share) {
			navigator.share({
				title: article.title,
				text: article.summary,
				url: window.location.origin + `/knowledge/${article.id}`
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.origin + `/knowledge/${article.id}`);
		}
	}

	function handleBookmark(article: any) {
		// Toggle bookmark state
		article.isBookmarked = !article.isBookmarked;
		// In a real app, this would save to user preferences
	}

	onMount(() => {
		// Initialize from URL params
		const urlParams = new URLSearchParams(window.location.search);
		searchQuery = urlParams.get('search') || '';
		selectedCategory = urlParams.get('category') || 'all';
		selectedSort = urlParams.get('sortBy') || 'recent';
		selectedTags = urlParams.get('tags')?.split(',').filter(Boolean) || [];
		selectedAuthors = urlParams.get('authors')?.split(',').filter(Boolean) || [];

		// Trigger animation
		setTimeout(() => {
			isVisible = true;
		}, 100);
	});
</script>

<div class="min-h-screen bg-primary-bg">
	<Header />
	
	{#if loading}
		<LoadingScreen />
	{/if}

	<!-- Hero Section -->
	<section class="relative pt-32 pb-16 overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-teal/10 to-accent-pink/20"></div>
		<div class="relative container mx-auto px-6">
			<div class="text-center max-w-4xl mx-auto">
				<h1 
					in:fly={{ y: 30, duration: 600, easing: quintOut }}
					class="text-5xl md:text-6xl font-bold text-white mb-6"
				>
					Knowledge Base
				</h1>
				<p 
					in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}
					class="text-xl text-text-secondary mb-8 leading-relaxed"
				>
					Discover insights, trends, and expert analysis in real estate. From market analysis to investment strategies, 
					find everything you need to stay ahead in the industry.
				</p>
				
				<!-- Search Bar -->
				<div 
					in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}
					class="relative max-w-2xl mx-auto"
				>
					<div class="relative">
						<Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							bind:value={searchQuery}
							on:keydown={(e) => e.key === 'Enter' && handleSearch()}
							type="text"
							placeholder="Search articles, topics, or authors..."
							class="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent"
						/>
						<button
							on:click={handleSearch}
							class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-purple hover:bg-accent-purple/80 text-white px-6 py-2 rounded-full transition-colors duration-300"
						>
							Search
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="container mx-auto px-6 pb-16">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Sidebar Filters -->
			<aside class="lg:col-span-1">
				<div class="sticky top-24 space-y-6">
					<!-- Categories -->
					<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
						<h3 class="text-lg font-semibold text-white mb-4 flex items-center">
							<BookOpen class="w-5 h-5 mr-2 text-accent-purple" />
							Categories
						</h3>
						<div class="space-y-2">
							{#each availableCategories as category}
								<button
									on:click={() => handleCategoryChange(category.id)}
									class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 flex items-center justify-between {selectedCategory === category.id ? 'bg-accent-purple/20 text-accent-purple' : 'text-gray-300 hover:bg-white/5'}"
								>
									<span>{category.name}</span>
									<span class="text-xs bg-white/10 px-2 py-1 rounded-full">{category.count}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Tags -->
					<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
						<h3 class="text-lg font-semibold text-white mb-4 flex items-center">
							<Tag class="w-5 h-5 mr-2 text-accent-purple" />
							Popular Tags
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each availableTags as tag}
								<button
									on:click={() => handleTagToggle(tag)}
									class="px-3 py-1 text-sm rounded-full transition-colors duration-300 {selectedTags.includes(tag) ? 'bg-accent-purple text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}"
								>
									{tag}
								</button>
							{/each}
						</div>
					</div>

					<!-- Authors -->
					<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
						<h3 class="text-lg font-semibold text-white mb-4 flex items-center">
							<User class="w-5 h-5 mr-2 text-accent-purple" />
							Authors
						</h3>
						<div class="space-y-2">
							{#each availableAuthors as author}
								<button
									on:click={() => handleAuthorToggle(author)}
									class="w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 {selectedAuthors.includes(author) ? 'bg-accent-purple/20 text-accent-purple' : 'text-gray-300 hover:bg-white/5'}"
								>
									{author}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</aside>

			<!-- Main Content Area -->
			<main class="lg:col-span-3">
				<!-- Controls Bar -->
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
					<div class="flex items-center space-x-4">
						<button
							on:click={() => selectedView = 'grid'}
							class="p-2 rounded-lg transition-colors duration-300 {selectedView === 'grid' ? 'bg-accent-purple/20 text-accent-purple' : 'text-gray-400 hover:text-white'}"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</button>
						<button
							on:click={() => selectedView = 'list'}
							class="p-2 rounded-lg transition-colors duration-300 {selectedView === 'list' ? 'bg-accent-purple/20 text-accent-purple' : 'text-gray-400 hover:text-white'}"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>

					<div class="flex items-center space-x-4">
						<select
							bind:value={selectedSort}
							on:change={() => handleSortChange(selectedSort)}
							class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
						>
							<option value="recent">Most Recent</option>
							<option value="popular">Most Popular</option>
							<option value="trending">Trending</option>
							<option value="title">Alphabetical</option>
						</select>
					</div>
				</div>

				<!-- Results Count -->
				<div class="mb-6">
					<p class="text-gray-400">
						Showing {sortedArticles.length} of {articles?.length || 0} articles
					</p>
				</div>

				<!-- Articles Grid/List -->
				{#if selectedView === 'grid'}
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{#each sortedArticles as article, index (article.id)}
							<article
								in:fly={{ y: 30, duration: 600, delay: index * 100, easing: quintOut }}
								class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent-purple hover:shadow-2xl hover:scale-105"
								on:click={() => handleArticleClick(article.id)}
								on:keydown={(e) => e.key === 'Enter' && handleArticleClick(article.id)}
								tabindex="0"
								role="button"
							>
								<!-- Article Image -->
								<div class="relative h-48 overflow-hidden">
									{#if article.coverImage}
										<img 
											src={article.coverImage} 
											alt={article.title}
											class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
									{:else}
										<div class="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
											<BookOpen class="w-12 h-12 text-white/50" />
										</div>
									{/if}
									
									<!-- Category Badge -->
									<div class="absolute top-4 left-4">
										<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
											{article.category}
										</span>
									</div>
									
									<!-- Featured Badge -->
									{#if article.isFeatured}
										<div class="absolute top-4 right-4">
											<Star class="w-5 h-5 text-yellow-400 fill-current" />
										</div>
									{/if}
								</div>

								<!-- Article Content -->
								<div class="p-6">
									<h3 class="text-lg font-semibold text-white mb-3 group-hover:text-accent-purple transition-colors duration-300 line-clamp-2">
										{article.title}
									</h3>
									<p class="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
										{article.summary}
									</p>
									
									<!-- Tags -->
									{#if article.tags && article.tags.length > 0}
										<div class="flex flex-wrap gap-2 mb-4">
											{#each article.tags.slice(0, 3) as tag}
												<span class="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400">
													{tag}
												</span>
											{/each}
											{#if article.tags.length > 3}
												<span class="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400">
													+{article.tags.length - 3}
												</span>
											{/if}
										</div>
									{/if}
									
									<!-- Article Meta -->
									<div class="flex items-center justify-between text-xs text-gray-500">
										<div class="flex items-center space-x-4">
											<div class="flex items-center">
												<User class="w-4 h-4 mr-1" />
												<span>{article.author}</span>
											</div>
											<div class="flex items-center">
												<Calendar class="w-4 h-4 mr-1" />
												<span>{new Date(article.publishedAt).toLocaleDateString()}</span>
											</div>
										</div>
										<div class="flex items-center space-x-2">
											<div class="flex items-center">
												<Eye class="w-4 h-4 mr-1" />
												<span>{article.viewCount || 0}</span>
											</div>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>
				{:else}
					<div class="space-y-6">
						{#each sortedArticles as article, index (article.id)}
							<article
								in:fly={{ y: 30, duration: 600, delay: index * 100, easing: quintOut }}
								class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent-purple hover:shadow-xl"
								on:click={() => handleArticleClick(article.id)}
								on:keydown={(e) => e.key === 'Enter' && handleArticleClick(article.id)}
								tabindex="0"
								role="button"
							>
								<div class="flex flex-col md:flex-row">
									<!-- Article Image -->
									<div class="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
										{#if article.coverImage}
											<img 
												src={article.coverImage} 
												alt={article.title}
												class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
											/>
										{:else}
											<div class="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
												<BookOpen class="w-12 h-12 text-white/50" />
											</div>
										{/if}
										
										<!-- Category Badge -->
										<div class="absolute top-4 left-4">
											<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
												{article.category}
											</span>
										</div>
									</div>

									<!-- Article Content -->
									<div class="flex-1 p-6">
										<div class="flex items-start justify-between mb-3">
											<h3 class="text-xl font-semibold text-white group-hover:text-accent-purple transition-colors duration-300">
												{article.title}
											</h3>
											<div class="flex items-center space-x-2 ml-4">
												<button
													on:click|stopPropagation={() => handleBookmark(article)}
													class="p-2 rounded-lg transition-colors duration-300 text-gray-400 hover:text-accent-purple"
												>
													<Bookmark class="w-4 h-4 {article.isBookmarked ? 'fill-current text-accent-purple' : ''}" />
												</button>
												<button
													on:click|stopPropagation={() => handleShare(article)}
													class="p-2 rounded-lg transition-colors duration-300 text-gray-400 hover:text-accent-purple"
												>
													<Share2 class="w-4 h-4" />
												</button>
											</div>
										</div>
										
										<p class="text-gray-400 mb-4 leading-relaxed">
											{article.summary}
										</p>
										
										<!-- Tags -->
										{#if article.tags && article.tags.length > 0}
											<div class="flex flex-wrap gap-2 mb-4">
												{#each article.tags.slice(0, 5) as tag}
													<span class="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400">
														{tag}
													</span>
												{/each}
											</div>
										{/if}
										
										<!-- Article Meta -->
										<div class="flex items-center justify-between text-sm text-gray-500">
											<div class="flex items-center space-x-6">
												<div class="flex items-center">
													<User class="w-4 h-4 mr-2" />
													<span>{article.author}</span>
												</div>
												<div class="flex items-center">
													<Calendar class="w-4 h-4 mr-2" />
													<span>{new Date(article.publishedAt).toLocaleDateString()}</span>
												</div>
												<div class="flex items-center">
													<Clock class="w-4 h-4 mr-2" />
													<span>{article.readTime || 5} min read</span>
												</div>
											</div>
											<div class="flex items-center space-x-4">
												<div class="flex items-center">
													<Eye class="w-4 h-4 mr-1" />
													<span>{article.viewCount || 0}</span>
												</div>
												<ArrowRight class="w-4 h-4 text-accent-purple" />
											</div>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>
				{/if}

				<!-- Empty State -->
				{#if sortedArticles.length === 0}
					<div class="text-center py-16">
						<BookOpen class="w-16 h-16 text-gray-500 mx-auto mb-4" />
						<h3 class="text-xl font-semibold text-white mb-2">No articles found</h3>
						<p class="text-gray-400 mb-6">
							Try adjusting your search criteria or filters to find what you're looking for.
						</p>
						<button
							on:click={() => {
								searchQuery = '';
								selectedCategory = 'all';
								selectedTags = [];
								selectedAuthors = [];
								updateUrl({ search: '', category: 'all', tags: [], authors: [] });
							}}
							class="bg-accent-purple hover:bg-accent-purple/80 text-white px-6 py-3 rounded-full transition-colors duration-300"
						>
							Clear Filters
						</button>
					</div>
				{/if}

				<!-- Pagination -->
				{#if pagination && pagination.pageCount > 1}
					<div class="flex justify-center mt-12">
						<div class="flex items-center space-x-2">
							{#each Array.from({ length: pagination.pageCount }, (_, i) => i + 1) as pageNum}
								<button
									on:click={() => updateUrl({ page: pageNum })}
									class="px-4 py-2 rounded-lg transition-colors duration-300 {pagination.page === pageNum ? 'bg-accent-purple text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}"
								>
									{pageNum}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</main>
		</div>
	</section>
</div>