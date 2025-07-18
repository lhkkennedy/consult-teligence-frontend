<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/types';

	export let friend: User;
	export let loading = false;

	const dispatch = createEventDispatcher<{
		remove: { friendId: number };
		viewProfile: { friendId: number };
	}>();

	function handleRemove() {
		dispatch('remove', { friendId: friend.id });
	}

	function handleViewProfile() {
		dispatch('viewProfile', { friendId: friend.id });
	}

	$: fullName = `${friend.firstName || ''} ${friend.lastName || ''}`.trim() || friend.username;
	$: profileImageUrl = friend.profileImage || '/default-avatar.png';
</script>

<div class="friend-card">
	<div class="user-info" on:click={handleViewProfile}>
		<img src={profileImageUrl} alt={fullName} class="avatar" />
		<div class="user-details">
			<h4 class="name">{fullName}</h4>
			{#if friend.company && friend.currentRole}
				<p class="role">{friend.currentRole} at {friend.company}</p>
			{:else if friend.company}
				<p class="role">{friend.company}</p>
			{:else if friend.currentRole}
				<p class="role">{friend.currentRole}</p>
			{/if}
			{#if friend.location}
				<p class="location">📍 {friend.location}</p>
			{/if}
		</div>
	</div>
	
	<div class="actions">
		<button 
			class="btn btn-remove" 
			on:click={handleRemove}
			disabled={loading}
			title="Remove friend"
		>
			{loading ? 'Removing...' : '✕'}
		</button>
	</div>
</div>

<style>
	.friend-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		background: white;
		margin-bottom: 0.75rem;
		transition: all 0.2s ease;
	}

	.friend-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.user-info:hover {
		opacity: 0.8;
	}

	.avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #f3f4f6;
	}

	.user-details {
		flex: 1;
	}

	.name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: #1f2937;
	}

	.role {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0 0 0.125rem 0;
	}

	.location {
		font-size: 0.75rem;
		color: #9ca3af;
		margin: 0;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-remove {
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
	}

	.btn-remove:hover:not(:disabled) {
		background: #fee2e2;
		color: #b91c1c;
	}

	@media (max-width: 640px) {
		.friend-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.actions {
			width: 100%;
			justify-content: flex-end;
		}
	}
</style>