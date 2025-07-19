<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FriendRequestCard from './FriendRequestCard.svelte';
	import FriendCard from './FriendCard.svelte';
	import AddFriendButton from './AddFriendButton.svelte';
	import type { FriendRequest, User } from '$lib/types';
	import {
		getPendingFriendRequests,
		getSentFriendRequests,
		getFriendsList,
		acceptFriendRequest,
		rejectFriendRequest,
		removeFriend,
		sendFriendRequest,
		checkFriendshipStatus
	} from '$lib/friends';

	type Tab = 'requests' | 'sent' | 'friends';

	let activeTab: Tab = 'requests';
	let pendingRequests: FriendRequest[] = [];
	let sentRequests: FriendRequest[] = [];
	let friends: User[] = [];
	let loading = false;
	let error = '';

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		loading = true;
		error = '';

		try {
			const [pendingResult, sentResult, friendsResult] = await Promise.all([
				getPendingFriendRequests(),
				getSentFriendRequests(),
				getFriendsList()
			]);

			if (pendingResult.error) error += `Pending requests: ${pendingResult.error}. `;
			else pendingRequests = pendingResult.data;

			if (sentResult.error) error += `Sent requests: ${sentResult.error}. `;
			else sentRequests = sentResult.data;

			if (friendsResult.error) error += `Friends: ${friendsResult.error}. `;
			else friends = friendsResult.data;
		} catch (err) {
			error = 'Failed to load data';
		} finally {
			loading = false;
		}
	}

	async function handleAcceptRequest(requestId: number) {
		loading = true;

		try {
			const result = await acceptFriendRequest(requestId);
			if (result.success) {
				// Remove from pending requests and add to friends
				const request = pendingRequests.find(r => r.id === requestId);
				if (request) {
					pendingRequests = pendingRequests.filter(r => r.id !== requestId);
					friends = [...friends, request.from];
				}
			} else {
				error = result.error || 'Failed to accept request';
			}
		} catch (err) {
			error = 'Failed to accept request';
		} finally {
			loading = false;
		}
	}

	async function handleRejectRequest(requestId: number) {
		loading = true;

		try {
			const result = await rejectFriendRequest(requestId);
			if (result.success) {
				pendingRequests = pendingRequests.filter(r => r.id !== requestId);
			} else {
				error = result.error || 'Failed to reject request';
			}
		} catch (err) {
			error = 'Failed to reject request';
		} finally {
			loading = false;
		}
	}

	async function handleRemoveFriend(friendId: number) {
		loading = true;

		try {
			const result = await removeFriend(friendId);
			if (result.success) {
				friends = friends.filter(f => f.id !== friendId);
			} else {
				error = result.error || 'Failed to remove friend';
			}
		} catch (err) {
			error = 'Failed to remove friend';
		} finally {
			loading = false;
		}
	}

	function handleViewProfile(documentId: string | number) {
		goto(`/experts/${documentId}`);
	}

	function setTab(tab: Tab) {
		activeTab = tab;
	}
</script>

<div class="friends-manager">
	<div class="header">
		<h2>Professional Network</h2>
		<button class="refresh-btn" on:click={loadData} disabled={loading}>
			{loading ? 'Loading...' : 'Refresh'}
		</button>
	</div>

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	<div class="tabs">
		<button 
			class="tab {activeTab === 'requests' ? 'active' : ''}"
			on:click={() => setTab('requests')}
		>
			Friend Requests ({pendingRequests.length})
		</button>
		<button 
			class="tab {activeTab === 'sent' ? 'active' : ''}"
			on:click={() => setTab('sent')}
		>
			Sent Requests ({sentRequests.length})
		</button>
		<button 
			class="tab {activeTab === 'friends' ? 'active' : ''}"
			on:click={() => setTab('friends')}
		>
			Friends ({friends.length})
		</button>
	</div>

	<div class="content">
		{#if activeTab === 'requests'}
			<div class="requests-section">
				{#if pendingRequests.length === 0}
					<div class="empty-state">
						<p>No pending friend requests</p>
					</div>
				{:else}
					{#each pendingRequests as request (request.id)}
						<FriendRequestCard 
							{request} 
							{loading}
							onAccept={handleAcceptRequest}
							onReject={handleRejectRequest}
						/>
					{/each}
				{/if}
			</div>
		{:else if activeTab === 'sent'}
			<div class="sent-section">
				{#if sentRequests.length === 0}
					<div class="empty-state">
						<p>No sent friend requests</p>
					</div>
				{:else}
					{#each sentRequests as request (request.id)}
						<div class="sent-request-card">
							<div class="user-info">
								<img src={request.to.profileImage || '/default-avatar.png'} alt={request.to.username} class="avatar" />
								<div class="user-details">
									<h4 class="name">{request.to.firstName} {request.to.lastName}</h4>
									{#if request.to.company}
										<p class="role">{request.to.company}</p>
									{/if}
								</div>
							</div>
							<div class="status">
								<span class="status-badge pending">Pending</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{:else if activeTab === 'friends'}
			<div class="friends-section">
				{#if friends.length === 0}
					<div class="empty-state">
						<p>No friends yet. Start connecting with professionals!</p>
					</div>
				{:else}
					{#each friends as friend (friend.id)}
						<FriendCard 
							{friend} 
							{loading}
							onRemove={handleRemoveFriend}
							onViewProfile={handleViewProfile}
						/>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.friends-manager {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
	}

	.refresh-btn {
		padding: 0.5rem 1rem;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.refresh-btn:hover:not(:disabled) {
		background: #e5e7eb;
	}

	.refresh-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #e5e7eb;
		margin-bottom: 1.5rem;
	}

	.tab {
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab:hover {
		color: #374151;
	}

	.tab.active {
		color: #3b82f6;
		border-bottom-color: #3b82f6;
	}

	.content {
		min-height: 400px;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #6b7280;
	}

	.empty-state p {
		font-size: 1rem;
		margin: 0;
	}

	.sent-request-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		background: white;
		margin-bottom: 0.75rem;
	}

	.sent-request-card .user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.sent-request-card .avatar {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #f3f4f6;
	}

	.sent-request-card .user-details {
		flex: 1;
	}

	.sent-request-card .name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: #1f2937;
	}

	.sent-request-card .role {
		font-size: 0.875rem;
		color: #6b7280;
		margin: 0;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-badge.pending {
		background: #fef3c7;
		color: #d97706;
	}

	@media (max-width: 640px) {
		.friends-manager {
			padding: 0.5rem;
		}

		.header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.tabs {
			flex-direction: column;
			border-bottom: none;
		}

		.tab {
			border-bottom: none;
			border-left: 2px solid transparent;
			text-align: left;
		}

		.tab.active {
			border-left-color: #3b82f6;
		}
	}
</style>