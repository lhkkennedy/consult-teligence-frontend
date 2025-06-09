<script>
  import MapPin from '@lucide/svelte/icons/map-pin';
  import BriefCase from '@lucide/svelte/icons/briefcase';
  import DollarSign from '@lucide/svelte/icons/dollar-sign';
  import Mail from '@lucide/svelte/icons/mail';
  import Phone from '@lucide/svelte/icons/phone';
  import Linkedin from '@lucide/svelte/icons/linkedin';
  import Award from '@lucide/svelte/icons/award';
  import Book from '@lucide/svelte/icons/book';
  import Globe from '@lucide/svelte/icons/globe';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  export let activeProfile;
</script>

{#if activeProfile}
  <div class="expert-profile-container">
    <div class="w-full md:w-1/3">
      <div class="bg-[#1E2130] rounded-lg p-6 border border-[#2D3748] sticky top-24">
        <div class="text-center mb-6">
            <!-- Profile Image -->
          {#if activeProfile.profileImage}
            <div class="flex justify-center mb-4">
              <img
                src={activeProfile.profileImage}
                alt={`${activeProfile.firstName} ${activeProfile.lastName}`}
                class="w-32 h-32 rounded-full object-cover"
              />
            </div>
          {:else}
            <div class="w-32 h-32 rounded-full bg-[#2D3748] mx-auto mb-4">
              <!-- Profile image would go here -->
              <div class="flex items-center justify-center h-full text-4xl font-bold">
                {activeProfile.firstName.charAt(0)}{activeProfile.lastName.charAt(0)}
              </div>
            </div>
          {/if}

          <h2 class="text-2xl font-semibold mb-1">
            {activeProfile.firstName} {activeProfile.lastName}
          </h2>
          
          <p class="text-[#A0AEC0] mb-4">{activeProfile.currentRole}</p>
          
          <div class="flex items-center justify-center text-[#A0AEC0] mb-2">
            <MapPin size={16} class="mr-1" />
            <span>{activeProfile.location}</span>
          </div>
          
          <div class="flex items-center justify-center text-[#A0AEC0] mb-2">
            <DollarSign size={16} class="mr-1" />
            <span>${activeProfile.rate}/hr</span>
          </div>
        </div>
        
        <div class="border-t border-[#2D3748] pt-6">
          <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
          
          {#if activeProfile.contactInfo}
            <div class="space-y-3 text-[#A0AEC0]">
              {#if activeProfile.contactInfo.email}
                <div class="flex items-center">
                  <Mail size={16} class="mr-2" />
                  <span>{activeProfile.contactInfo.email}</span>
                </div>
              {/if}
              
              {#if activeProfile.contactInfo.phone}
                <div class="flex items-center">
                  <Phone size={16} class="mr-2" />
                  <span>{activeProfile.contactInfo.phone}</span>
                </div>
              {/if}
              
              {#if activeProfile.contactInfo.linkedin}
                <div class="flex items-center">
                  <Linkedin size={16} class="mr-2" />
                  <span>{activeProfile.contactInfo.linkedin}</span>
                </div>
              {/if}
              
              {#if activeProfile.contactInfo.website}
                <div class="flex items-center">
                  <Globe size={16} class="mr-2" />
                  <span>{activeProfile.contactInfo.website}</span>
                </div>
              {/if}
            </div>
          {/if}
          
          <div class="mt-6">
            <button class="btn btn-primary w-full mb-3">Contact Expert</button>
            <button class="btn btn-secondary w-full">Schedule Consultation</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="w-full md:w-2/3">
      <div class="bg-[#1E2130] rounded-lg p-6 border border-[#2D3748] mb-8">
        <div class="flex items-center mb-4">
          <BriefCase size={20} class="mr-2" />
          <h3 class="text-xl font-semibold">About & Expertise</h3>
        </div>
        <p class="text-[#A0AEC0] mb-6">{activeProfile.bio}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-medium mb-3 flex items-center">
              <BriefCase size={18} class="mr-2" /> Expertise
            </h4>
            <p class="text-[#A0AEC0]">{activeProfile.functionalExpertise}</p>
          </div>
          
          <div>
            <h4 class="text-lg font-medium mb-3 flex items-center">
              <Book size={18} class="mr-2" /> Education
            </h4>
            <p class="text-[#A0AEC0]">{activeProfile.education}</p>
          </div>
        </div>
        
        {#if activeProfile.certifications && activeProfile.certifications.length > 0}
          <div class="mt-6">
            <h4 class="text-lg font-medium mb-3 flex items-center">
              <Award size={18} class="mr-2" /> Certifications
            </h4>
            <ul class="list-disc list-inside text-[#A0AEC0]">
              {#each activeProfile.certifications as certification}
                <li>{certification}</li>
              {/each}
            </ul>
          </div>
        {/if}
        
        {#if activeProfile.languages && activeProfile.languages.length > 0}
          <div class="mt-6">
            <h4 class="text-lg font-medium mb-3 flex items-center">
              <Globe size={18} class="mr-2" /> Languages
            </h4>
            <div class="flex flex-wrap gap-2">
              {#each activeProfile.languages as language}
                <span class="px-3 py-1 bg-[#2D3748] text-[#A0AEC0] rounded-full">{language}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      {#if activeProfile.caseStudies && activeProfile.caseStudies.length > 0}
        <div class="bg-[#1E2130] rounded-lg p-6 border border-[#2D3748] mb-8">
          <div class="flex items-center mb-4">
            <Book size={20} class="mr-2" />
            <h3 class="text-xl font-semibold">Case Studies</h3>
          </div>
          
          <div class="space-y-6">
            {#each activeProfile.caseStudies as caseStudy}
              <div class="border-b border-[#2D3748] pb-6 last:border-0 last:pb-0">
                <h4 class="text-lg font-medium mb-2">{caseStudy.title}</h4>
                <p class="text-[#A0AEC0]">{caseStudy.description}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      {#if activeProfile.testimonials && activeProfile.testimonials.length > 0}
        <div class="bg-[#1E2130] rounded-lg p-6 border border-[#2D3748]">
          <div class="flex items-center mb-4">
            <MessageCircle size={20} class="mr-2" />
            <h3 class="text-xl font-semibold">Testimonials</h3>
          </div>
          
          <div class="space-y-6">
            {#each activeProfile.testimonials as testimonial}
              <div class="border-b border-[#2D3748] pb-6 last:border-0 last:pb-0">
                <p class="text-[#A0AEC0] italic mb-3">"{testimonial.text}"</p>
                <div>
                  <p class="font-medium">{testimonial.name}</p>
                  <p class="text-[#A0AEC0] text-sm">{testimonial.company}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="text-center py-12">
    <p class="text-[#A0AEC0]">Expert profile not found.</p>
  </div>
{/if}
