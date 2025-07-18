<script lang="ts">
	import FriendsManager from '../../components/FriendsManager.svelte';
	import { user } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$user) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<title>Professional Network - Friends</title>
	<meta name="description" content="Manage your professional network and connections" />
</svelte:head>

<div class="friends-page">
	{#if $user}
		<FriendsManager />
	{:else}
		<div class="loading">
			<p>Loading...</p>
		</div>
	{/if}
</div>

<style>
	.friends-page {
		min-height: 100vh;
		background: #f9fafb;
		padding: 2rem 0;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
		font-size: 1.125rem;
		color: #6b7280;
	}

	@media (max-width: 640px) {
		.friends-page {
			padding: 1rem 0;
		}
	}
</style>
