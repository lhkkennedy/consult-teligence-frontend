<script>
  export let title = "Connect with Real Estate Experts Worldwide";
  export let subtitle = "Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas.";
  export let ctaText = "Find an Expert";
  export let ctaLink = "#search";
  export let className = "";
</script>

<section
  class="relative h-[1000px] bg-center bg-cover overflow-hidden {className}"
  style="background-image:url('/propeterra-background-img.png')"
>
  <!-- Content -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
    <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">{title}</h1>
    <p class="text-[#A0AEC0] text-xl max-w-3xl mx-auto mb-12">{subtitle}</p>
    <a
      href={ctaLink}
      class="font-semibold text-white uppercase tracking-wide py-2 px-6 rounded-full
             bg-gradient-to-br from-indigo-500 to-purple-500
             shadow-lg transform transition hover:scale-105 hover:shadow-xl"
    >
      {ctaText}
    </a>
  </div>
</section>