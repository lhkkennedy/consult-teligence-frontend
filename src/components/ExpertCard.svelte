<script lang="ts">
  import MapPin from '@lucide/svelte/icons/map-pin';
  import BriefCase from '@lucide/svelte/icons/briefcase';
  import DollarSign from '@lucide/svelte/icons/dollar-sign';
  import type { Consultant } from '$lib/types.ts'
  /** consultant data shape */

  export let consultant: Consultant;
  
  /** callback to parent when this card is clicked */
  export let onSelect: (id: number) => void = () => {};

</script>

<div
  role="button"
  tabindex="0"
  class="expert-card cursor-pointer hover:border-[#8A2BE2] transition-all duration-300"
  on:click={() => onSelect(consultant.id)}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(consultant.id);
    }
  }}
>
  <!-- Profile Image -->
  {#if consultant.profileImage}
    <div class="flex justify-center mb-4">

      <img
        src={`${consultant.profileImage}`}
        alt={`${consultant.firstName} ${consultant.lastName}`}
        class="w-24 h-24 rounded-full object-cover"
      />
    </div>
  {/if}
  <h3 class="text-xl font-heading font-semibold mb-2">
    {consultant.firstName} {consultant.lastName}
  </h3>

  <div class="flex items-center text-[#A0AEC0] mb-1">
    <BriefCase size={16} class="mr-1" />
    <span>{consultant.currentRole}</span>
  </div>

  <div class="flex items-center text-[#A0AEC0] mb-1">
    <MapPin size={16} class="mr-1" />
    <span>{consultant.location}</span>
  </div>

  <div class="flex items-center text-[#A0AEC0] mb-6">
    <DollarSign size={16} class="mr-1" />
    <span>${consultant.rate}/hr</span>
  </div>

  <div class="mb-6">
    <h4 class="text-sm font-medium text-white mb-1">Expertise:</h4>
    <p class="text-[#A0AEC0] text-sm">
      {consultant.functionalExpertise}
    </p>
  </div>

  <button 
    type="button"
    class="btn btn-secondary w-full"
    on:click|stopPropagation={() => onSelect(consultant.id)}
    >
        View Profile
  </button>
</div>
