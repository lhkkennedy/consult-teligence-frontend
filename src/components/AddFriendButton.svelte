<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User } from '$lib/types';

	export let user: User;
	export let friendshipStatus: 'friends' | 'pending_sent' | 'pending_received' | 'not_friends';
	export let loading = false;

	const dispatch = createEventDispatcher<{
		addFriend: { userId: number };
		cancelRequest: { userId: number };
		acceptRequest: { userId: number };
	}>();

	function handleAddFriend() {
		dispatch('addFriend', { userId: user.id });
	}

	function handleCancelRequest() {
		dispatch('cancelRequest', { userId: user.id });
	}

	function handleAcceptRequest() {
		dispatch('acceptRequest', { userId: user.id });
	}

	$: buttonText = (() => {
		switch (friendshipStatus) {
			case 'friends':
				return 'Friends';
			case 'pending_sent':
				return 'Request Sent';
			case 'pending_received':
				return 'Accept Request';
			case 'not_friends':
				return 'Add Friend';
			default:
				return 'Add Friend';
		}
	})();

	$: buttonClass = (() => {
		switch (friendshipStatus) {
			case 'friends':
				return 'btn-friends';
			case 'pending_sent':
				return 'btn-pending';
			case 'pending_received':
				return 'btn-accept';
			case 'not_friends':
				return 'btn-add';
			default:
				return 'btn-add';
		}
	})();

	$: isDisabled = loading || friendshipStatus === 'friends';
</script>

<button 
	class="add-friend-btn {buttonClass}"
	on:click={friendshipStatus === 'pending_received' ? handleAcceptRequest : 
		friendshipStatus === 'pending_sent' ? handleCancelRequest : handleAddFriend}
	disabled={isDisabled}
>
	{#if loading}
		<span class="loading">Loading...</span>
	{:else}
		{buttonText}
	{/if}
</button>

<style>
	.add-friend-btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 100px;
	}

	.add-friend-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-add {
		background: #3b82f6;
		color: white;
	}

	.btn-add:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn-friends {
		background: #10b981;
		color: white;
	}

	.btn-friends:hover:not(:disabled) {
		background: #059669;
	}

	.btn-pending {
		background: #f3f4f6;
		color: #6b7280;
		border: 1px solid #d1d5db;
	}

	.btn-pending:hover:not(:disabled) {
		background: #e5e7eb;
		color: #374151;
	}

	.btn-accept {
		background: #10b981;
		color: white;
	}

	.btn-accept:hover:not(:disabled) {
		background: #059669;
	}

	.loading {
		opacity: 0.8;
	}
</style>