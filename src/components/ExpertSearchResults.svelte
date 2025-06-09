<script lang="ts">
  import ExpertCard from './ExpertCard.svelte';
  import type { Consultant } from '$lib/types.ts';
  /** array of consultants to show */

  export let consultants: Consultant[] = [];

  /** callback prop in lieu of createEventDispatcher */
  export let onExpertSelect: (id: number) => void = () => {};

  /** allow parent to pass layout classes */
  export let containerClass = '';
</script>

{#if consultants.length === 0}
  <div class={`text-center py-12 ${containerClass}`}>
    <p class="text-[#A0AEC0]">
      No experts found matching your criteria. Please try different search parameters.
    </p>
  </div>
{:else}
  <div class={containerClass}>
    {#each consultants as consultant}
      <ExpertCard
        {consultant}
        onSelect={(id) => onExpertSelect(id)}
      />
    {/each}
  </div>
{/if}
