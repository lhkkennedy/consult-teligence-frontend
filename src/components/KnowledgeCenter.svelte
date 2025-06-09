<script>
  import { createEventDispatcher } from 'svelte';
  import { articles } from '$lib/mockData';
  
  const dispatch = createEventDispatcher();
  
  function handleArticleSelect(id) {
    dispatch('articleSelect', id);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {#each articles as article (article.id)}
    <div 
      class="bg-[#1E2130] rounded-lg overflow-hidden border border-[#2D3748] hover:border-[#4A90E2] transition-all duration-300 cursor-pointer"
      on:click={() => handleArticleSelect(article.id)}
      on:keydown={(e) => e.key === 'Enter' && handleArticleSelect(article.id)}
      tabindex="0"
      role="button"
    >
      <div class="h-40 bg-[#2D3748] flex items-center justify-center">
        <span class="text-[#A0AEC0]">{article.image}</span>
      </div>
      
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-2">{article.title}</h3>
        <p class="text-[#A0AEC0] text-sm mb-4">{article.summary}</p>
        <div class="flex justify-between text-xs text-[#A0AEC0]">
          <span>{article.category}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  {/each}
</div>

