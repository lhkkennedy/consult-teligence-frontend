<script lang="ts">
	import { specialties } from '$lib/mockData.ts';
</script>

<footer class="mt-16 bg-[#1E2130] py-16">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-4">
			<div>
				<h3 class="mb-6 text-xl font-semibold">Consulteligence</h3>
				<p class="mb-6 text-[#A0AEC0]">
					Access specialized knowledge from verified real estate professionals across 190 countries
					and 10 different expertise areas.
				</p>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium">Quick Links</h4>
				<ul class="space-y-2">
					<li><a href="/" class="text-[#A0AEC0] transition-colors hover:text-white">Home</a></li>
					<li>
						<a href="/experts" class="text-[#A0AEC0] transition-colors hover:text-white"
							>Find Experts</a
						>
					</li>
					<li>
						<a href="/knowledge" class="text-[#A0AEC0] transition-colors hover:text-white"
							>Knowledge Center</a
						>
					</li>
					<li>
						<a href="/about" class="text-[#A0AEC0] transition-colors hover:text-white">About Us</a>
					</li>
					<li>
						<a href="/contact" class="text-[#A0AEC0] transition-colors hover:text-white">Contact</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium">Expertise Areas</h4>
				<ul class="space-y-2">
					{#each specialties as specialty}
						<li>
							<a
								href="/experts?specialty={specialty}"
								class="text-[#A0AEC0] transition-colors hover:text-white"
							>
								{specialty}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium">Contact Us</h4>
				<address class="not-italic text-[#A0AEC0]">
					<p>123 Real Estate Avenue</p>
					<p>New York, NY 10001</p>
					<p class="mt-4">Email: info@consulteligence.com</p>
					<p>Phone: +1 (555) 123-4567</p>
				</address>
			</div>
		</div>

		<div class="mt-12 border-t border-[#2D3748] pt-8 text-center text-[#A0AEC0]">
			<p>© 2025 Consulteligence. All rights reserved.</p>
		</div>
	</div>
</footer>
