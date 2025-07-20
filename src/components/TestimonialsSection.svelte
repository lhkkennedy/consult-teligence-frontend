<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let isVisible = false;
	let currentTestimonial = 0;

	const testimonials = [
		{
			name: 'Sarah Johnson',
			role: 'Senior Real Estate Consultant',
			company: 'Global Investments Ltd',
			location: 'New York, USA',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
			text: 'Consulteligence has transformed how I connect with real estate professionals worldwide. The quality of experts and the depth of knowledge available is incredible. I\'ve closed deals worth millions thanks to connections made through this platform.',
			rating: 5
		},
		{
			name: 'Michael Chen',
			role: 'Property Development Director',
			company: 'Pacific Development Group',
			location: 'Singapore',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
			text: 'As someone working in international real estate, finding reliable local expertise is crucial. This platform has been invaluable for connecting with verified professionals across different markets. The knowledge sharing is exceptional.',
			rating: 5
		},
		{
			name: 'Emma Rodriguez',
			role: 'Commercial Real Estate Broker',
			company: 'Urban Development Partners',
			location: 'London, UK',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
			text: 'The network effect is real here. I\'ve expanded my professional reach globally and gained insights into markets I never had access to before. The community is incredibly supportive and knowledgeable.',
			rating: 5
		},
		{
			name: 'David Williams',
			role: 'Investment Manager',
			company: 'Horizon Investments',
			location: 'Sydney, Australia',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
			text: 'What sets this platform apart is the quality of verification and the depth of expertise. Every expert I\'ve connected with has been thoroughly vetted and brings real value to the table.',
			rating: 5
		},
		{
			name: 'Sophia Patel',
			role: 'Real Estate Attorney',
			company: 'Green Living Developments',
			location: 'Toronto, Canada',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
			text: 'The legal and regulatory knowledge sharing on this platform is outstanding. I\'ve learned about real estate laws and practices from experts around the world, which has made me a better attorney.',
			rating: 5
		}
	];

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.3 });

		const element = document.querySelector('#testimonials-section');
		if (element) {
			observer.observe(element);
		}

		// Auto-rotate testimonials
		const interval = setInterval(() => {
			currentTestimonial = (currentTestimonial + 1) % testimonials.length;
		}, 5000);

		return () => {
			clearInterval(interval);
			if (element) {
				observer.unobserve(element);
			}
		};
	});

	function setTestimonial(index) {
		currentTestimonial = index;
	}
</script>

<section id="testimonials-section" class="py-20 bg-gradient-to-b from-primary-bg to-secondary-bg">
	<div class="container mx-auto px-6">
		{#if isVisible}
			<div in:fly={{ y: 30, duration: 600, easing: quintOut }} class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
					What Our Members Say
				</h2>
				<p class="text-xl text-[#A0AEC0] max-w-3xl mx-auto">
					Join thousands of satisfied real estate professionals who have transformed their careers through our global network
				</p>
			</div>

			<div in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }} class="max-w-4xl mx-auto">
				<!-- Testimonial Card -->
				<div class="bg-[#2D3748] rounded-2xl p-8 md:p-12 relative">
					<!-- Quote Icon -->
					<div class="absolute top-6 left-6 text-accent-purple/20">
						<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
							<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
						</svg>
					</div>

					<div class="text-center">
						<!-- Rating -->
						<div class="flex justify-center mb-6">
							{#each Array(5) as _, i}
								<svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
								</svg>
							{/each}
						</div>

						<!-- Testimonial Text -->
						<blockquote class="text-xl md:text-2xl text-white mb-8 leading-relaxed">
							"{testimonials[currentTestimonial].text}"
						</blockquote>

						<!-- Author Info -->
						<div class="flex items-center justify-center space-x-4">
							<img 
								src={testimonials[currentTestimonial].avatar} 
								alt={testimonials[currentTestimonial].name}
								class="w-16 h-16 rounded-full object-cover border-2 border-accent-purple"
							/>
							<div class="text-left">
								<div class="text-white font-semibold text-lg">
									{testimonials[currentTestimonial].name}
								</div>
								<div class="text-[#A0AEC0] text-sm">
									{testimonials[currentTestimonial].role}
								</div>
								<div class="text-[#A0AEC0] text-sm">
									{testimonials[currentTestimonial].company} • {testimonials[currentTestimonial].location}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Testimonial Navigation -->
				<div class="flex justify-center mt-8 space-x-2">
					{#each testimonials as _, index}
						<button
							class="w-3 h-3 rounded-full transition-all duration-300 {currentTestimonial === index ? 'bg-accent-purple' : 'bg-[#A0AEC0]'}"
							on:click={() => setTestimonial(index)}
							aria-label={`Go to testimonial ${index + 1}`}
						></button>
					{/each}
				</div>
			</div>

			<!-- Trust Indicators -->
			<div in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }} class="mt-16 text-center">
				<p class="text-[#A0AEC0] mb-6">Trusted by leading real estate companies worldwide</p>
				<div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
					<div class="text-white font-semibold text-lg">Global Investments Ltd</div>
					<div class="text-white font-semibold text-lg">Pacific Development Group</div>
					<div class="text-white font-semibold text-lg">Urban Development Partners</div>
					<div class="text-white font-semibold text-lg">Horizon Investments</div>
				</div>
			</div>
		{/if}
	</div>
</section>