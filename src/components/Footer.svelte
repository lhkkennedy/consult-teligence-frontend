<script lang="ts">
	import { specialties } from '$lib/mockData.ts';
</script>

<footer class="mt-16 bg-gray-100 dark:bg-[#1E2130] py-16">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-4">
			<div>
				<h3 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Consulteligence</h3>
				<p class="mb-6 text-gray-600 dark:text-[#A0AEC0]">
					Access specialized knowledge from verified real estate professionals across 190 countries
					and 10 different expertise areas.
				</p>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Quick Links</h4>
				<ul class="space-y-2">
					<li><a href="/" class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white">Home</a></li>
					<li>
						<a href="/experts" class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white"
							>Find Experts</a
						>
					</li>
					<li>
						<a href="/knowledge" class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white"
							>Knowledge Center</a
						>
					</li>
					<li>
						<a href="/about" class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white">About Us</a>
					</li>
					<li>
						<a href="/contact" class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white">Contact</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Expertise Areas</h4>
				<ul class="space-y-2">
					{#each specialties as specialty}
						<li>
							<a
								href="/experts?specialty={specialty}"
								class="text-gray-600 dark:text-[#A0AEC0] transition-colors hover:text-accent-purple dark:hover:text-white"
							>
								{specialty}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Contact Us</h4>
				<address class="not-italic text-gray-600 dark:text-[#A0AEC0]">
					<p>123 Real Estate Avenue</p>
					<p>New York, NY 10001</p>
					<p class="mt-4">Email: info@consulteligence.com</p>
					<p>Phone: +1 (555) 123-4567</p>
				</address>
			</div>
		</div>

		<div class="mt-12 border-t border-gray-300 dark:border-[#2D3748] pt-8 text-center text-gray-600 dark:text-[#A0AEC0]">
			<p>© 2025 Consulteligence. All rights reserved.</p>
		</div>
	</div>
</footer>
