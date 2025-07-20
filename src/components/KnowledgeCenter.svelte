<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { articles } from '$lib/mockData';

	const dispatch = createEventDispatcher();
	let isVisible = false;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#knowledge-center');
		if (element) {
			observer.observe(element);
		}

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	});

	function handleArticleSelect(id) {
		dispatch('articleSelect', id);
	}
</script>

<div id="knowledge-center" class="space-y-8">
	{#if isVisible}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each articles as article, index (article.id)}
				<div 
					in:fly={{ y: 30, duration: 600, delay: index * 100, easing: quintOut }}
					class="group cursor-pointer overflow-hidden rounded-2xl border border-[#2D3748] bg-[#1E2130] transition-all duration-300 hover:border-accent-purple hover:shadow-2xl hover:scale-105"
					on:click={() => handleArticleSelect(article.id)}
					on:keydown={(e) => e.key === 'Enter' && handleArticleSelect(article.id)}
					tabindex="0"
					role="button"
				>
					<!-- Article Image -->
					<div class="relative h-48 overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 group-hover:from-accent-purple/40 group-hover:to-accent-pink/40 transition-all duration-300"></div>
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
								<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
								</svg>
							</div>
						</div>
						
						<!-- Category Badge -->
						<div class="absolute top-4 left-4">
							<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
								{article.category}
							</span>
						</div>
						
						<!-- Read More Icon -->
						<div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
							</svg>
						</div>
					</div>

					<!-- Article Content -->
					<div class="p-6">
						<h3 class="text-lg font-semibold text-white mb-3 group-hover:text-accent-purple transition-colors duration-300 line-clamp-2">
							{article.title}
						</h3>
						<p class="text-sm text-[#A0AEC0] mb-4 line-clamp-3 leading-relaxed">
							{article.summary}
						</p>
						
						<!-- Article Meta -->
						<div class="flex items-center justify-between text-xs text-[#A0AEC0]">
							<div class="flex items-center space-x-2">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
								<span>{article.author}</span>
							</div>
							<div class="flex items-center space-x-2">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<span>{new Date(article.date).toLocaleDateString()}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Featured Article Highlight -->
		<div in:fly={{ y: 30, duration: 600, delay: 500, easing: quintOut }} class="mt-12">
			<div class="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 rounded-2xl p-8 border border-accent-purple/20">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					<div>
						<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30 mb-4">
							<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
							</svg>
							Featured Article
						</div>
						<h3 class="text-2xl font-bold text-white mb-4">
							The Future of Urban Living: Trends in 2025
						</h3>
						<p class="text-[#A0AEC0] mb-6 leading-relaxed">
							Explore how urban living spaces are evolving with technology integration and sustainability practices. Discover the latest trends that will shape the real estate market in the coming year.
						</p>
						<div class="flex items-center space-x-4 text-sm text-[#A0AEC0] mb-6">
							<div class="flex items-center">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
								<span>Emma Johnson</span>
							</div>
							<div class="flex items-center">
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<span>May 15, 2025</span>
							</div>
						</div>
						<button 
							class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
							on:click={() => handleArticleSelect(1)}
						>
							Read Full Article
							<svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
							</svg>
						</button>
					</div>
					<div class="relative">
						<div class="w-full h-64 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-xl flex items-center justify-center">
							<svg class="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
