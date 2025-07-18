<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import BriefCase from '@lucide/svelte/icons/briefcase';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import AddFriendButton from './AddFriendButton.svelte';
	import type { Consultant } from '$lib/types.ts';
	import { onMount } from 'svelte';
	import { checkFriendshipStatus, sendFriendRequest } from '$lib/server/friends.server';
	import { user } from '$lib/stores/authStore';

	/** consultant data shape */
	export let consultant: Consultant;

	/** callback to parent when this card is clicked */
	export let onSelect: (documentId: string) => void;

	let friendshipStatus: 'friends' | 'pending_sent' | 'pending_received' | 'not_friends' = 'not_friends';
	let loading = false;

	// Ensure onSelect has a default value
	$: onSelect = onSelect || (() => {});

	onMount(async () => {
		if ($user && $user.id !== consultant.id) {
			await loadFriendshipStatus();
		}
	});

	async function loadFriendshipStatus() {
		try {
			const result = await checkFriendshipStatus(consultant.id);
			if (result.status) {
				friendshipStatus = result.status;
			}
		} catch (error) {
			console.error('Failed to check friendship status:', error);
		}
	}

	async function handleAddFriend(event: CustomEvent<{ userId: number }>) {
		const { userId } = event.detail;
		loading = true;

		try {
			const result = await sendFriendRequest(userId);
			if (result.success) {
				friendshipStatus = 'pending_sent';
			} else {
				console.error('Failed to send friend request:', result.error);
			}
		} catch (error) {
			console.error('Failed to send friend request:', error);
		} finally {
			loading = false;
		}
	}

	async function handleCancelRequest(event: CustomEvent<{ userId: number }>) {
		// This would need to be implemented in the backend
		// For now, just reset the status
		friendshipStatus = 'not_friends';
	}

	async function handleAcceptRequest(event: CustomEvent<{ userId: number }>) {
		// This would need to be implemented in the backend
		// For now, just set as friends
		friendshipStatus = 'friends';
	}
</script>

<div
	role="button"
	tabindex="0"
	class="expert-card flex h-full cursor-pointer flex-col transition-all duration-300 border border-gray-200 dark:border-[#2D3748] bg-white dark:bg-[#1E2130] hover:border-accent-purple"
	on:click={() => onSelect(consultant.documentId)}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect(consultant.documentId);
		}
	}}
>
	<!-- Profile Image -->
	{#if consultant.profileImage}
		<div class="mb-4 flex justify-center">
			<img
				src={`${consultant.profileImage}`}
				alt={`${consultant.firstName} ${consultant.lastName}`}
				class="h-24 w-24 rounded-full object-cover"
			/>
		</div>
	{/if}
	<h3 class="mb-2 font-heading text-xl font-semibold text-gray-900 dark:text-white">
		{consultant.firstName}
		{consultant.lastName}
	</h3>

	<div class="mb-1 flex items-center text-gray-600 dark:text-[#A0AEC0]">
		<BriefCase size={16} class="mr-1" />
		<span>{consultant.currentRole}</span>
	</div>

	<div class="mb-1 flex items-center text-gray-600 dark:text-[#A0AEC0]">
		<MapPin size={16} class="mr-1" />
		<span>{consultant.location}</span>
	</div>

	<div class="mb-6 flex items-center text-gray-600 dark:text-[#A0AEC0]">
		<DollarSign size={16} class="mr-1" />
		<span>${consultant.rate}/hr</span>
	</div>

	<div class="flex items-center justify-between rounded-b-lg border-t border-gray-200 dark:border-border-gray pb-4 pt-4">
		<div class="flex flex-wrap gap-1">
			{#each consultant.functionalExpertise as exp}
				<button
					type="button"
					class="rounded-sm bg-gray-100 dark:bg-secondary-bg px-2 py-1 text-xs text-gray-700 dark:text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
					on:click={() => console.log('filter by', exp)}
				>
					{exp}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex gap-2 mt-auto">
		{#if $user && $user.id !== consultant.id}
			<AddFriendButton 
				user={consultant} 
				{friendshipStatus} 
				{loading}
				on:addFriend={handleAddFriend}
				on:cancelRequest={handleCancelRequest}
				on:acceptRequest={handleAcceptRequest}
			/>
		{/if}
		<button
			type="button"
			class="btn btn-primary flex-1 bg-accent-purple text-white dark:bg-accent-purple dark:text-white"
			on:click|stopPropagation={() => onSelect(consultant.documentId)}
		>
			View Profile
		</button>
	</div>
</div>
