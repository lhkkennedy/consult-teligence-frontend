<script>
	export let title = 'Connect with Real Estate Experts Worldwide';
	export let subtitle =
		'Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas.';
	export let ctaText = 'Find an Expert';
	export let ctaLink = '/experts';
	export let className = '';
</script>

<section
	class="relative h-[1000px] overflow-hidden bg-cover bg-center {className}"
	style="background-image:url('/propeterra-background-img.png')"
>
	<!-- Content -->
	<div class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
		<h1 class="mb-6 text-4xl font-bold text-white md:text-6xl">{title}</h1>
		<p class="mx-auto mb-12 max-w-3xl text-xl text-[#A0AEC0]">{subtitle}</p>
		<a
			href={ctaLink}
			class="transform rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 px-6 py-2
             font-semibold uppercase tracking-wide
             text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
		>
			{ctaText}
		</a>
	</div>
</section>
