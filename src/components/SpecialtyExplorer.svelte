<script>
  import { createEventDispatcher } from 'svelte';
  import { specialties, subSpecialties } from '$lib/mockData';
  
  export let selectedSpecialty = null;
  export let selectedSubSpecialty = null;
  
  const dispatch = createEventDispatcher();
  
  function handleSpecialtySelect(specialty) {
    dispatch('specialtySelect', specialty);
  }
  
  function handleSubSpecialtySelect(specialty, subSpecialty) {
    dispatch('subSpecialtySelect', { specialty, subSpecialty });
  }
</script>

<div>
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-4">Specialties</h3>
    <div class="flex flex-wrap gap-2">
      {#each specialties as specialty}
        <button 
          class="px-4 py-2 rounded-md {selectedSpecialty === specialty ? 'bg-[#8A2BE2] text-white' : 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
          on:click={() => handleSpecialtySelect(specialty)}
        >
          {specialty}
        </button>
      {/each}
    </div>
  </div>
  
  {#if selectedSpecialty && subSpecialties[selectedSpecialty]}
    <div>
      <h3 class="text-lg font-semibold mb-4">Sub-Specialties in {selectedSpecialty}</h3>
      <div class="flex flex-wrap gap-2">
        {#each subSpecialties[selectedSpecialty] as subSpecialty}
          <button 
            class="px-4 py-2 rounded-md {selectedSubSpecialty === subSpecialty ? 'bg-[#4A90E2] text-white' : 'bg-[#1E2130] text-[#A0AEC0] hover:bg-[#2D3748]'} transition-colors"
            on:click={() => handleSubSpecialtySelect(selectedSpecialty, subSpecialty)}
          >
            {subSpecialty}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

