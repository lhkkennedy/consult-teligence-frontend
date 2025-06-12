<script lang="ts">
    import MapPin from '@lucide/svelte/icons/map-pin';
    import BriefCase from '@lucide/svelte/icons/briefcase';
    import DollarSign from '@lucide/svelte/icons/dollar-sign';
    import type { Consultant } from '$lib/types.ts';

    export let consultant: Consultant;
    export let onSelect: (id: number) => void = () => {};
</script>

<div
    role="button"
    tabindex="0"
    class="expert-card cursor-pointer hover:border-[#8A2BE2] transition-all duration-300 flex flex-col h-full"
    on:click={() => onSelect(consultant.id)}
    on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(consultant.id);
        }
    }}
>
    <div class="p-6 flex justify-between items-start space-x-6">
    <!-- LEFT SIDE: Avatar + Details -->
    <div class="flex items-start space-x-5 flex-1">
        {#if consultant.profileImage}
            <img
                src={consultant.profileImage}
                alt={`${consultant.firstName} ${consultant.lastName}`}
                class="w-16 h-16 rounded-full object-cover"
            />
        {:else}
            <div class="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0"></div>
        {/if}

        <div class="flex-1">
            <div class="text-xs font-semibold text-accent-purple uppercase mb-1">
                {consultant.company}
            </div>
            <h3 class="text-lg font-heading font-semibold leading-snug">
                {consultant.firstName} {consultant.lastName} – {consultant.currentRole}
            </h3>
              <div class="flex items-center text-text-secondary text-sm mt-1">
                <BriefCase size={16} class="mr-1" />
                <span>{consultant.currentRole}</span>
            </div>
            <div class="flex items-center text-text-secondary text-sm mt-1">
                <MapPin size={16} class="mr-1" />
                <span>{consultant.location}</span>
            </div>
              <div class="flex items-center text-text-secondary text-sm mt-1">
                <DollarSign size={16} class="mr-1" />
                <span>${consultant.rate}/hr</span>
            </div>
        </div>
    </div>

    <!-- RIGHT SIDE: Save / Request -->
    <div class="flex flex-col items-end space-y-3 shrink-0">
        <button 
            type="button"
            class="btn mt-auto btn-primary w-full"
            on:click|stopPropagation={() => onSelect(consultant.id)}
            >
                View Profile
        </button>
    </div>
    </div>

    <!-- MIDDLE ROW: Expertise badge + stars -->
    <div class="px-6 pb-4 pt-4 rounded-b-lg flex items-center justify-between border-t border-border-gray">
    <div class="flex flex-wrap gap-2">
        {#each consultant.functionalExpertise as exp}
        <button
            type="button"
            class="text-text-primary bg-secondary-bg hover:bg-gray-700 px-3 py-1 rounded-sm text-sm"
            on:click={() => console.log('filter by', exp)}
        >
            {exp}
        </button>
        {/each}
    </div>
    <!-- <div class="flex space-x-1 text-yellow-400">
        {#each Array(5) as _, i}
        <svg class="w-4 h-4 fill-current">
            <polygon points="9.9,1.1 12.3,6.9 18.4,7.5 13.7,11.8 15.2,17.8 9.9,14.5 4.6,17.8 6.1,11.8 1.4,7.5 7.5,6.9 "/>
        </svg>
        {/each}
    </div> -->
    </div>

</div>

