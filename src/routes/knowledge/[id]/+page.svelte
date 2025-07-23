<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Header from '../../../components/Header.svelte';
	import LoadingScreen from '../../../components/LoadingScreen.svelte';
	import type { PageData } from './$types';
	import { ArrowLeft, Calendar, User, Clock, Eye, Share2, Bookmark, Tag, Star, ThumbsUp, MessageCircle, Twitter, Linkedin, Facebook, Mail } from 'lucide-svelte';

	// Props from server load function
	export let data: PageData;

	// Extract data from props
	$: ({ article, relatedArticles, error } = data);

	// Local state
	let loading = false;
	let isVisible = false;
	let showShareMenu = false;
	let isBookmarked = false;
	let hasLiked = false;
	let likeCount = article?.likeCount || 0;

	// Social sharing functions
	function handleShare(type: string) {
		const url = window.location.href;
		const title = article?.title || '';
		const text = article?.summary || '';

		switch (type) {
			case 'twitter':
				window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
				break;
			case 'linkedin':
				window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
				break;
			case 'facebook':
				window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
				break;
			case 'email':
				window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
				break;
			case 'native':
				if (navigator.share) {
					navigator.share({
						title,
						text,
						url
					});
				}
				break;
		}
		showShareMenu = false;
	}

	function handleBookmark() {
		isBookmarked = !isBookmarked;
		// In a real app, this would save to user preferences
	}

	function handleLike() {
		hasLiked = !hasLiked;
		likeCount += hasLiked ? 1 : -1;
		// In a real app, this would update the server
	}

	function handleRelatedArticleClick(articleId: string) {
		goto(`/knowledge/${articleId}`);
	}

	function handleBackToKnowledge() {
		goto('/knowledge');
	}

	onMount(() => {
		// Trigger animation
		setTimeout(() => {
			isVisible = true;
		}, 100);

		// Initialize like count from article
		if (article) {
			likeCount = article.likeCount || 0;
		}
	});
</script>

<div class="min-h-screen bg-primary-bg">
	<Header />
	
	{#if loading}
		<LoadingScreen />
	{/if}

	{#if error}
		<div class="pt-32 pb-16">
			<div class="container mx-auto px-6 text-center">
				<h1 class="text-3xl font-bold text-white mb-4">Article Not Found</h1>
				<p class="text-gray-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
				<button
					on:click={handleBackToKnowledge}
					class="bg-accent-purple hover:bg-accent-purple/80 text-white px-6 py-3 rounded-full transition-colors duration-300"
				>
					Back to Knowledge Base
				</button>
			</div>
		</div>
	{:else if article}
		<!-- Article Header -->
		<section class="relative pt-32 pb-16 overflow-hidden">
			<div class="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-teal/10 to-accent-pink/20"></div>
			<div class="relative container mx-auto px-6">
				<!-- Back Button -->
				<button
					in:fly={{ y: 30, duration: 600, easing: quintOut }}
					on:click={handleBackToKnowledge}
					class="inline-flex items-center text-white hover:text-accent-purple transition-colors duration-300 mb-8"
				>
					<ArrowLeft class="w-5 h-5 mr-2" />
					Back to Knowledge Base
				</button>

				<div class="max-w-4xl mx-auto">
					<!-- Category Badge -->
					<div 
						in:fly={{ y: 30, duration: 600, delay: 100, easing: quintOut }}
						class="mb-6"
					>
						<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
							{article.category}
						</span>
						{#if article.isFeatured}
							<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 ml-3">
								<Star class="w-4 h-4 mr-1 fill-current" />
								Featured
							</span>
						{/if}
					</div>

					<!-- Article Title -->
					<h1 
						in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}
						class="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
					>
						{article.title}
					</h1>

					<!-- Article Summary -->
					<p 
						in:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}
						class="text-xl text-text-secondary mb-8 leading-relaxed"
					>
						{article.summary}
					</p>

					<!-- Article Meta -->
					<div 
						in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}
						class="flex flex-wrap items-center gap-6 text-gray-400 mb-8"
					>
						<div class="flex items-center">
							<User class="w-5 h-5 mr-2" />
							<span>{article.author}</span>
						</div>
						<div class="flex items-center">
							<Calendar class="w-5 h-5 mr-2" />
							<span>{new Date(article.publishedAt).toLocaleDateString('en-US', { 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							})}</span>
						</div>
						<div class="flex items-center">
							<Clock class="w-5 h-5 mr-2" />
							<span>{article.readTime} min read</span>
						</div>
						<div class="flex items-center">
							<Eye class="w-5 h-5 mr-2" />
							<span>{article.viewCount} views</span>
						</div>
					</div>

					<!-- Action Buttons -->
					<div 
						in:fly={{ y: 30, duration: 600, delay: 500, easing: quintOut }}
						class="flex items-center gap-4"
					>
						<button
							on:click={handleLike}
							class="flex items-center px-4 py-2 rounded-full transition-colors duration-300 {hasLiked ? 'bg-accent-purple text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}"
						>
							<ThumbsUp class="w-4 h-4 mr-2 {hasLiked ? 'fill-current' : ''}" />
							<span>{likeCount}</span>
						</button>
						<button
							on:click={handleBookmark}
							class="flex items-center px-4 py-2 rounded-full transition-colors duration-300 {isBookmarked ? 'bg-accent-purple text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}"
						>
							<Bookmark class="w-4 h-4 mr-2 {isBookmarked ? 'fill-current' : ''}" />
							<span>{isBookmarked ? 'Saved' : 'Save'}</span>
						</button>
						<div class="relative">
							<button
								on:click={() => showShareMenu = !showShareMenu}
								class="flex items-center px-4 py-2 rounded-full bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300"
							>
								<Share2 class="w-4 h-4 mr-2" />
								<span>Share</span>
							</button>
							{#if showShareMenu}
								<div
									in:slide={{ duration: 200 }}
									class="absolute top-full left-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 z-10"
								>
									<div class="flex items-center gap-2">
										<button
											on:click={() => handleShare('twitter')}
											class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
											title="Share on Twitter"
										>
											<Twitter class="w-4 h-4 text-blue-400" />
										</button>
										<button
											on:click={() => handleShare('linkedin')}
											class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
											title="Share on LinkedIn"
										>
											<Linkedin class="w-4 h-4 text-blue-600" />
										</button>
										<button
											on:click={() => handleShare('facebook')}
											class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
											title="Share on Facebook"
										>
											<Facebook class="w-4 h-4 text-blue-500" />
										</button>
										<button
											on:click={() => handleShare('email')}
											class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
											title="Share via Email"
										>
											<Mail class="w-4 h-4 text-gray-400" />
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Article Content -->
		<section class="container mx-auto px-6 pb-16">
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<!-- Main Content -->
				<main class="lg:col-span-3">
					<article class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
						<!-- Cover Image -->
						{#if article.coverImage}
							<div class="mb-8">
								<img 
									src={article.coverImage} 
									alt={article.title}
									class="w-full h-64 md:h-96 object-cover rounded-xl"
								/>
							</div>
						{/if}

						<!-- Article Content -->
						<div class="prose prose-invert max-w-none">
							<!-- This would be the actual article content -->
							<p class="text-lg text-gray-300 leading-relaxed mb-6">
								{article.content || `This is a detailed article about ${article.title.toLowerCase()}. The full content would be displayed here with proper formatting, images, and rich text elements.`}
							</p>
							
							<p class="text-lg text-gray-300 leading-relaxed mb-6">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
							</p>

							<h2 class="text-2xl font-bold text-white mb-4">Key Insights</h2>
							<p class="text-lg text-gray-300 leading-relaxed mb-6">
								Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</p>

							<h2 class="text-2xl font-bold text-white mb-4">Market Analysis</h2>
							<p class="text-lg text-gray-300 leading-relaxed mb-6">
								Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
							</p>

							<h2 class="text-2xl font-bold text-white mb-4">Future Outlook</h2>
							<p class="text-lg text-gray-300 leading-relaxed mb-6">
								Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
							</p>
						</div>

						<!-- Tags -->
						{#if article.tags && article.tags.length > 0}
							<div class="mt-8 pt-8 border-t border-white/10">
								<h3 class="text-lg font-semibold text-white mb-4 flex items-center">
									<Tag class="w-5 h-5 mr-2 text-accent-purple" />
									Tags
								</h3>
								<div class="flex flex-wrap gap-2">
									{#each article.tags as tag}
										<span class="px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</article>
				</main>

				<!-- Sidebar -->
				<aside class="lg:col-span-1">
					<div class="sticky top-24 space-y-6">
						<!-- Author Info -->
						<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
							<h3 class="text-lg font-semibold text-white mb-4">About the Author</h3>
							<div class="flex items-center mb-4">
								<div class="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center mr-3">
									<User class="w-6 h-6 text-accent-purple" />
								</div>
								<div>
									<p class="text-white font-medium">{article.author}</p>
									<p class="text-sm text-gray-400">Real Estate Expert</p>
								</div>
							</div>
							<p class="text-sm text-gray-400">
								{article.author} is a seasoned real estate professional with expertise in {article.category.toLowerCase()}. 
								They have contributed numerous insights to our knowledge base.
							</p>
						</div>

						<!-- Related Articles -->
						{#if relatedArticles && relatedArticles.length > 0}
							<div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
								<h3 class="text-lg font-semibold text-white mb-4">Related Articles</h3>
								<div class="space-y-4">
									{#each relatedArticles as relatedArticle}
										<article
											class="cursor-pointer group"
											on:click={() => handleRelatedArticleClick(relatedArticle.id)}
										>
											{#if relatedArticle.coverImage}
												<img 
													src={relatedArticle.coverImage} 
													alt={relatedArticle.title}
													class="w-full h-24 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
												/>
											{/if}
											<h4 class="text-sm font-medium text-white group-hover:text-accent-purple transition-colors duration-300 line-clamp-2">
												{relatedArticle.title}
											</h4>
											<p class="text-xs text-gray-400 mt-1">
												{new Date(relatedArticle.publishedAt).toLocaleDateString()}
											</p>
										</article>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Newsletter Signup -->
						<div class="bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl p-6 border border-accent-purple/30">
							<h3 class="text-lg font-semibold text-white mb-3">Stay Updated</h3>
							<p class="text-sm text-gray-300 mb-4">
								Get the latest insights and trends delivered to your inbox.
							</p>
							<div class="space-y-3">
								<input
									type="email"
									placeholder="Enter your email"
									class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple"
								/>
								<button class="w-full bg-accent-purple hover:bg-accent-purple/80 text-white px-4 py-2 rounded-lg transition-colors duration-300">
									Subscribe
								</button>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</section>
	{/if}
</div>