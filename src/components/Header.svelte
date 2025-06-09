<script lang="ts">
  import Facebook  from '@lucide/svelte/icons/facebook';
  import Instagram from '@lucide/svelte/icons/instagram';
  import Linkedin  from '@lucide/svelte/icons/linkedin';
  import Menu      from '@lucide/svelte/icons/menu';
  import X         from '@lucide/svelte/icons/x';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';


  let isMenuOpen = false;
  let scrolled = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

export let onHomeClick: () => void = () => {};
</script>

<header
  class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
  class:backdrop-blur-sm={scrolled}
  class:shadow-md={scrolled}
  class:bg-transparent={scrolled}
  class:bg-primary-bg={!scrolled}
>
  {#if !scrolled}
  <div class="h-full bg-accent-purple" transition:slide="{{ y: -100, duration:300}}">
    <div class="max-w-screen-2xl mx-auto flex items-center text-md text-whit p-2">
      <p class="text-text-primary text-md font-normal">Global Property Experts on Call</p>
      <div class="flex-1"></div>
      <a href="https://facebook.com/YourPage" aria-label="Facebook" target="_blank" rel="noopener">
        <Facebook size={20} />
      </a>
      <a href="https://instagram.com/YourProfile" aria-label="Instagram" target="_blank" rel="noopener" class="ml-4">
        <Instagram size={20} />
      </a>
      <a href="https://linkedin.com/in/YourProfile" aria-label="LinkedIn" target="_blank" rel="noopener" class="ml-4">
        <Linkedin size={20} />
      </a>
    </div>
  </div>
  {/if}
  <div class="flex items-center">
    <a href="/" class="flex items-center mx-4" on:click|preventDefault={() => {onHomeClick(); window.location.href = '/'; }}>
      <img
        src="/propeterra_logo_transparent.png"
        alt="PropeTerra Logo"
        class="h-10"
      />
    </a>
    <div class="h-10 w-px bg-white/30 mx-2"></div>
    <div class="container mx-auto flex items-center justify-between px-6 py-4">
      <!-- Brand -->
      <a href="/" class="text-2xl font-extrabold tracking-tight text-white" on:click|preventDefault={() => {onHomeClick(); window.location.href = '/'; }}>
        Consulteligence
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex space-x-10">
        <a href="/" class="text-accent-pink font-bold hover:text-text-secondary transition" on:click|preventDefault={() => {onHomeClick(); window.location.href = '/'; }}>Home</a>
        <a href="/experts" class="text-text-primary hover:text-text-secondary transition">Experts</a>
        <a href="/knowledge" class="text-text-primary hover:text-text-secondary transition">Knowledge</a>
        <a href="/about"   class="text-text-primary hover:text-text-secondary transition">About</a>
        <a href="/contact" class="text-text-primary hover:text-text-secondary transition">Contact</a>
      </nav>

      <!-- Auth buttons (desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Login as a ghost button with hover underline and subtle background on hover -->
        <a
          href="/login"
          class="relative text-white font-normal tracking-wide py-2 px-3 transition
                before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-white
                hover:before:w-full before:transition-all before:duration-300
                hover:bg-white/10"
        >
          Log In
        </a>

        <!-- Sign Up as a rounded “pill” with a gradient, shadow & scale-on-hover -->
        <a
          href="/signup"
          class="font-normal text-white tracking-wide py-2 px-6 rounded-full
                bg-accent-purple
                shadow-lg transform transition hover:scale-105 hover:shadow-xl border-2 border-accent-purple hover:border-accent-teal"
        >
          Sign Up
        </a>
      </div>

      <!-- Mobile toggle -->
      <button
        class="md:hidden p-2 text-gray-900 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        on:click={toggleMenu}
        aria-label="Toggle menu"
      >
        {#if isMenuOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    </div>

    <!-- Mobile sliding drawer -->
    {#if isMenuOpen}
      <div
        class="fixed inset-0 right-0 top-0 w-64 bg-white shadow-lg p-6 overflow-y-auto transition-transform transform md:hidden"
        style="transform: translateX(0);"
      >
        <button
          class="mb-8 p-1 text-gray-900 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          on:click={toggleMenu}
        >
          <X size={24} />
        </button>
        <nav class="flex flex-col space-y-6">
          <a href="/"        class="text-gray-800 hover:text-indigo-600">Home</a>
          <a href="/experts" class="text-gray-800 hover:text-indigo-600">Experts</a>
          <a href="/knowledge" class="text-gray-800 hover:text-indigo-600">Knowledge</a>
          <a href="/about"   class="text-gray-800 hover:text-indigo-600">About</a>
          <a href="/contact" class="text-gray-800 hover:text-indigo-600">Contact</a>
        </nav>
        <div class="mt-8 space-y-4">
          <a
            href="/login"
            class="block w-full text-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Log In
          </a>
          <a
            href="/signup"
            class="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    {/if}
  </div>

</header>
