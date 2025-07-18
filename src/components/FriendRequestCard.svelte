<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FriendRequest } from '$lib/types';

	export let request: FriendRequest;
	export let loading = false;

	const dispatch = createEventDispatcher<{
		accept: { requestId: number };
		reject: { requestId: number };
	}>();

	function handleAccept() {
		dispatch('accept', { requestId: request.id });
	}

	function handleReject() {
		dispatch('reject', { requestId: request.id });
	}

	$: user = request.from;
	$: fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
	$: profileImageUrl = user.profileImage || '/default-avatar.png';
</script>

<div class="friend-request-card">
	<div class="user-info">
		<img src={profileImageUrl} alt={fullName} class="avatar" />
		<div class="user-details">
			<h4 class="name">{fullName}</h4>
			{#if user.company && user.currentRole}
				<p class="role">{user.currentRole} at {user.company}</p>
			{:else if user.company}
				<p class="role">{user.company}</p>
			{:else if user.currentRole}
				<p class="role">{user.currentRole}</p>
			{/if}
			{#if user.location}
				<p class="location">📍 {user.location}</p>
			{/if}
		</div>
	</div>
	
	<div class="actions">
		<button 
			class="btn btn-accept" 
			on:click={handleAccept}
			disabled={loading}
		>
			{loading ? 'Accepting...' : 'Accept'}
		</button>
		<button 
			class="btn btn-reject" 
			on:click={handleReject}
			disabled={loading}
		>
			{loading ? 'Rejecting...' : 'Reject'}
		</button>
	</div>
</div>

<style>
	.friend-request-card {
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

	.friend-request-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
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
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-accept {
		background: #10b981;
		color: white;
	}

	.btn-accept:hover:not(:disabled) {
		background: #059669;
	}

	.btn-reject {
		background: #f3f4f6;
		color: #6b7280;
		border: 1px solid #d1d5db;
	}

	.btn-reject:hover:not(:disabled) {
		background: #e5e7eb;
		color: #374151;
	}

	@media (max-width: 640px) {
		.friend-request-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.actions {
			width: 100%;
			justify-content: stretch;
		}

		.btn {
			flex: 1;
		}
	}
</style>