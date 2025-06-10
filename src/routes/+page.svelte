<script lang="ts">
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import Hero from '../components/Hero.svelte';
  import ExpertSearchForm from '../components/ExpertSearchForm.svelte';
  import ExpertSearchResults from '../components/ExpertSearchResults.svelte';
  import TagExplorer from '../components/TagExplorer.svelte';
  import WorldMap from '../components/WorldMap.svelte';
  import ExpertProfile from '../components/ExpertProfile.svelte';
  import KnowledgeCenter from '../components/KnowledgeCenter.svelte';
  // import { consultants } from '$lib/mockData.js';
  import type { Consultant, SearchFilters } from '$lib/types.ts';

  const uploadPath = import.meta.env.VITE_STRAPI_UPLOAD_PATH;
  console.log(uploadPath)
  
  export let data;
  let consultants = data.consultants;

  // saerchQuery can carry any of these filters
  let searchQuery: {
    region?: string;
    country?: string;
    specialty?: string;
    subSpecialty?: string;
  } = {};

  let showAll: boolean = false;

  // id of the selected expert (or null if none)
  let selectedExpert: number | null = null;

  // similarly for other filters
  let selectedRegion: string | null = null;
  let selectedCountry: string | null = null;
  let selectedSpecialty: string | null = null;
  let selectedSubSpecialty: string | null = null;


  let activeProfile: Consultant | null = null;
  let filteredConsultants: Consultant[] = consultants;
  
  // Filter consultants based on selected filters
  $: {
    filteredConsultants = consultants.filter(c => {
      if (selectedRegion && c.geographicalExpertise !== selectedRegion) return false;
      if (selectedCountry && c.countryExpertise !== selectedCountry) return false;
      if (selectedSpecialty && !c.functionalExpertise.includes(selectedSpecialty)) return false;
      if (selectedSubSpecialty && !c.functionalExpertise.includes(selectedSubSpecialty)) return false;
      return true;
    });
  }
  
  // Load expert profile when selected
  $: {
    if (selectedExpert !== null) {
      activeProfile = consultants.find(c => c.id === selectedExpert) ?? null;
      console.log("active profile:", activeProfile)
    } else {
      activeProfile = null;
    }
  }
  
  function handleSearch(filters: SearchFilters) {
    searchQuery = filters;
    selectedExpert = null;
    
    // Apply filters
    if (filters.region) selectedRegion = filters.region;
    if (filters.country) selectedCountry = filters.country;
    if (filters.specialty) selectedSpecialty = filters.specialty;
    if (filters.subSpecialty) selectedSubSpecialty = filters.subSpecialty;
    console.log(filters)
  }
  
  function handleExpertSelect(id: number) {
    selectedExpert = id;
    console.log("expert selected:", id)
  }
  
  function handleRegionSelect(event: CustomEvent<string>) {
    selectedRegion = event.detail;
    searchQuery = { ...searchQuery, region: event.detail };
  }
  
  function handleCountrySelect(event: CustomEvent<string>) {
    selectedCountry = event.detail;
    searchQuery = { ...searchQuery, country: event.detail };
  }
  
  function handleSpecialtySelect(event: CustomEvent<string>) {
    selectedSpecialty = event.detail;
    searchQuery = { ...searchQuery, specialty: event.detail };
  }
  
  function handleSubSpecialtySelect(event: CustomEvent<{specialty: string, subSpecialty: string}>) {
    const { specialty, subSpecialty } = event.detail;
    selectedSubSpecialty = subSpecialty;
    searchQuery = { ...searchQuery, specialty, subSpecialty };
  }
  
  function handleArticleSelect(event: CustomEvent<string>) {
    console.log(`Selected article: ${event.detail}`);
  }
  
  function resetSearch() {
    searchQuery = {};
    selectedExpert = null;
    showAll = true;
  }
</script>

<div class="min-h-screen flex flex-col bg-primary-bg">
  <Header />

  <main class="flex-grow py-8 pt-24">
    {#if selectedExpert !== null && activeProfile}
      <div class="container mx-auto p-6">
        <div class="mb-4 pt-6">
          <button
            class="btn btn-secondary flex items-center gap-2"
            on:click={() => { selectedExpert = null; }}
          >
            <span>←</span>
            <span>Back to Search Results</span>
          </button>
        </div>
        <ExpertProfile {activeProfile} />
      </div>
    {:else if Object.keys(searchQuery).length > 0  || showAll && selectedExpert === null}
      <div class="container mx-auto p-6">
        <div class="mb-16">
          <ExpertSearchForm onSearch={handleSearch} />
        </div>
        <ExpertSearchResults
          consultants={filteredConsultants}
          onExpertSelect={handleExpertSelect}
          containerClass="grid grid-cols-1 md:grid-cols-3 gap-8"
        />
      </div>
    {:else}
      <Hero
        title="Connect with Real Estate Experts Worldwide"
        subtitle="Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas."
        ctaText="Find an Expert"
        ctaLink="#search"
        className="mb-16"
      />
      <div class="container mx-auto p-6">

          <section id="search" class="mb-16">
            <h2 class="text-center text-2xl font-heading font-semibold mb-8 text-white">Find the Perfect Expert</h2>
            <ExpertSearchForm onSearch={handleSearch} />
          </section>

          <section class="mb-16">
            <h2 class="text-center text-2xl font-heading font-semibold mb-8 text-white">Featured Experts</h2>
            <ExpertSearchResults
              consultants={filteredConsultants.slice(0, 3)}
              onExpertSelect={handleExpertSelect}
              containerClass="grid grid-cols-1 md:grid-cols-3 gap-8"
            />
            <div class="text-center mt-16">
              <button
                class="btn btn-primary"
                on:click={resetSearch}
              >
                View All Experts
              </button>
            </div>
          </section>

          <section class="mb-16">
            <h2 class="text-center text-2xl font-heading font-semibold mb-8 text-white">Explore by Location</h2>
            <div class="mb-12">
              <WorldMap
                on:regionSelect={handleRegionSelect}
                on:countrySelect={handleCountrySelect}
                {selectedRegion}
                {selectedCountry}
              />
            </div>
          </section>

          <section class="mb-16">
            <h2 class="text-center text-2xl font-heading font-semibold mb-8 text-white">Explore by Tag</h2>
            <TagExplorer
              on:regionSelect={handleRegionSelect}
              on:countrySelect={handleCountrySelect}
              {selectedRegion}
              {selectedCountry}
            />
          </section>



          <section class="mb-16">
            <h2 class="text-center text-xl font-heading font-semibold mb-4 text-white">Knowledge Center</h2>
            <p class="text-center max-w-3xl mx-auto mb-12 text-[#A0AEC0]">
              Explore expert insights, market trends, and in-depth analysis from our global network of real estate professionals.
            </p>
            <KnowledgeCenter on:articleSelect={handleArticleSelect} />
          </section>
      </div>
    {/if}
  </main>

  <Footer />
</div>

