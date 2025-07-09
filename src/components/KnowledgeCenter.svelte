<script>
	import { createEventDispatcher } from 'svelte';
	import { articles } from '$lib/mockData';

	const dispatch = createEventDispatcher();

	function handleArticleSelect(id) {
		dispatch('articleSelect', id);
	}
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
	{#each articles as article (article.id)}
		<div
			class="cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-[#2D3748] bg-white dark:bg-[#1E2130] transition-all duration-300 hover:border-accent-purple dark:hover:border-[#4A90E2]"
			on:click={() => handleArticleSelect(article.id)}
			on:keydown={(e) => e.key === 'Enter' && handleArticleSelect(article.id)}
			tabindex="0"
			role="button"
		>
			<div
				class="flex h-40 items-center justify-center bg-gray-100 dark:bg-[#2D3748] [mask-image:linear-gradient(to_top,transparent,black_40%)]"
			>
				<img src={`${article.image}`} alt={`${article.image}`} />
			</div>

			<div class="p-6">
				<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h3>
				<p class="mb-4 text-sm text-gray-600 dark:text-[#A0AEC0]">{article.summary}</p>
				<div class="flex justify-between text-xs text-gray-500 dark:text-[#A0AEC0]">
					<span>{article.category}</span>
					<span>{article.date}</span>
				</div>
			</div>
		</div>
	{/each}
</div>
