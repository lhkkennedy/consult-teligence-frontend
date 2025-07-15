<script lang="ts">
	import GeneralTimeline from '$components/GeneralTimeline.svelte';
	import ProfileTabs from '../../components/ProfileTabs.svelte';
</script>

<svelte:head>
	<title>Timeline Demo - PropTelligence</title>
</svelte:head>

<main class="min-h-screen bg-[#0F1419] text-white py-8 pt-24">
	<div class="container mx-auto px-6">
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4">Timeline & Properties Demo</h1>
			<p class="text-[#A0AEC0] max-w-2xl">
				This demo showcases the new Timeline and Properties features for expert profiles. 
				The Timeline shows chronological updates about properties and market insights, 
				while the Properties tab displays a comprehensive portfolio view with metrics and filtering.
			</p>
		</div>
		<div class="bg-[#1E2130] border border-[#2D3748] rounded-lg p-6">
			<GeneralTimeline />
		</div>
		<div class="bg-[#1E2130] border border-[#2D3748] rounded-lg p-6">
			<ProfileTabs personId="demo_user_123" />
		</div>
	</div>
</main> 