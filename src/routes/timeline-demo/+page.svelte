<script lang="ts">
	import GeneralTimeline from '$components/GeneralTimeline.svelte';
	import ProfileTabs from '../../components/ProfileTabs.svelte';
</script>

<svelte:head>
	<title>Timeline Demo - PropTelligence</title>
</svelte:head>

<main class="min-h-screen bg-[#0F1419] py-8 pt-24 text-white">
	<div class="container mx-auto px-6">
		<div class="mb-8">
			<h1 class="mb-4 text-3xl font-bold">Timeline & Properties Demo</h1>
			<p class="max-w-2xl text-[#A0AEC0]">
				This demo showcases the new Timeline and Properties features for expert profiles. The
				Timeline shows chronological updates about properties and market insights, while the
				Properties tab displays a comprehensive portfolio view with metrics and filtering.
			</p>
		</div>
		<div class="rounded-lg border border-[#2D3748] bg-[#1E2130] p-6">
			<GeneralTimeline />
		</div>
		<div class="rounded-lg border border-[#2D3748] bg-[#1E2130] p-6">
			<ProfileTabs personId="demo_user_123" />
		</div>
	</div>
</main>
