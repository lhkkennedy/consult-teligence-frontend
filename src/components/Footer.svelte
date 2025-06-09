<script lang="ts">
  import { specialties } from '$lib/mockData.ts';
</script>

<footer class="bg-[#1E2130] py-16 mt-16">
  <div class="container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h3 class="text-xl font-semibold mb-6">Consulteligence</h3>
        <p class="text-[#A0AEC0] mb-6">
          Access specialized knowledge from verified real estate professionals across 190 countries and 10 different expertise areas.
        </p>
      </div>
      
      <div>
        <h4 class="text-lg font-medium mb-4">Quick Links</h4>
        <ul class="space-y-2">
          <li><a href="/" class="text-[#A0AEC0] hover:text-white transition-colors">Home</a></li>
          <li><a href="/experts" class="text-[#A0AEC0] hover:text-white transition-colors">Find Experts</a></li>
          <li><a href="/knowledge" class="text-[#A0AEC0] hover:text-white transition-colors">Knowledge Center</a></li>
          <li><a href="/about" class="text-[#A0AEC0] hover:text-white transition-colors">About Us</a></li>
          <li><a href="/contact" class="text-[#A0AEC0] hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-lg font-medium mb-4">Expertise Areas</h4>
        <ul class="space-y-2">
          {#each specialties as specialty}
            <li>
              <a href="/experts?specialty={specialty}" class="text-[#A0AEC0] hover:text-white transition-colors">
                {specialty}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      
      <div>
        <h4 class="text-lg font-medium mb-4">Contact Us</h4>
        <address class="not-italic text-[#A0AEC0]">
          <p>123 Real Estate Avenue</p>
          <p>New York, NY 10001</p>
          <p class="mt-4">Email: info@consulteligence.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </address>
      </div>
    </div>
    
    <div class="border-t border-[#2D3748] mt-12 pt-8 text-center text-[#A0AEC0]">
      <p>© 2025 Consulteligence. All rights reserved.</p>
    </div>
  </div>
</footer>

