<script lang="ts">
  import Search from '@lucide/svelte/icons/search';
	import { regions, countries, specialties, subSpecialties } from "$lib/mockData.js";
  import type { Region, Country, Specialty, SearchFilters, SubSpecialty } from '$lib/types.ts';

  // Callback prop instead of event dispatcher
  export let onSearch: (filters: SearchFilters) => void = () => {};

  let keyword:string = '';
  let selectedRegion: Region | '' = '';
  let selectedCountry: Country | '' = '';
  let selectedSpecialty: Specialty | '' = '';
  let selectedSubSpecialty: SubSpecialty | '' = '';
  let availableCountries: Country[] = [];
  let availableSubSpecialties: SubSpecialty[] = [];

  $: availableCountries = selectedRegion !== '' ? countries[selectedRegion] : [];
  $: availableSubSpecialties = selectedSpecialty ? subSpecialties[selectedSpecialty] : [];

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    const filters: SearchFilters = {};
    if (keyword) filters.keyword = keyword;
    if (selectedRegion) filters.region = selectedRegion;
    if (selectedCountry) filters.country = selectedCountry;
    if (selectedSpecialty) filters.specialty = selectedSpecialty;
    if (selectedSubSpecialty) filters.subSpecialty = selectedSubSpecialty;

    onSearch(filters);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-secondary-bg rounded-lg p-lg py-sm">
  <div class="relative mb-sm">
    <label for="keyword" class="block text-text-primary mb-xs">Keyword Search</label>
    <div class="relative">
      <input
        id="keyword"
        type="text"
        placeholder="Name, company, or role"
        class="form-input w-full pl-xl"
        bind:value={keyword}
      />
      <Search class="absolute left-sm top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-md mb-sm">
    <div>
      <label for="region" class="block text-text-primary mb-xs">Region</label>
      <select
        id="region"
        class="form-select w-full"
        bind:value={selectedRegion}
        on:change={() => { selectedCountry = ''; }}
      >
        <option value="">All Regions</option>
        {#each regions as r}
          <option value={r}>{r}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="country" class="block text-text-primary mb-xs">Country</label>
      <select
        id="country"
        class="form-select w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-bg disabled:text-text-primary disabled:border-text-primary"
        bind:value={selectedCountry}
        disabled={!selectedRegion}
      >
        <option value="">All Countries</option>
        {#each availableCountries as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-md mb-sm">
    <div>
      <label for="specialty" class="block text-text-primary mb-xs">Specialty</label>
      <select
        id="specialty"
        class="form-select w-full"
        bind:value={selectedSpecialty}
        on:change={() => { selectedSubSpecialty = ''; }}
      >
        <option value="">All Specialties</option>
        {#each specialties as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="subSpecialty" class="block text-text-primary mb-xs">Sub-Specialty</label>
      <select
        id="subSpecialty"
        class="form-select w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary-bg disabled:text-text-primary disabled:border-text-primary"
        bind:value={selectedSubSpecialty}
        disabled={!selectedSpecialty}

      >
        <option value="">All Sub-Specialties </option>
        {#each availableSubSpecialties as ss}
          <option value={ss}>{ss}</option>
        {/each}
      </select>

    </div>
  </div>

  <div class="text-center">
    <button type="submit" class="btn btn-primary px-xl">
      Find Experts
    </button>
  </div>
</form>
