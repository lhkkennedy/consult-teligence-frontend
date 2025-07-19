import { authToken } from './stores/authStore';
import { get } from 'svelte/store';
import type { FriendRequest, User, FriendSystemResponse, FriendsListResponse } from './types';
import {
	mockSendFriendRequest,
	mockAcceptFriendRequest,
	mockRejectFriendRequest,
	mockRemoveFriend,
	mockGetPendingFriendRequests,
	mockGetSentFriendRequests,
	mockGetFriendsList,
	mockCheckFriendshipStatus
} from './mockFriendsApi';

const API_URL = import.meta.env.VITE_STRAPI_URL;

// Check if we should use mock API
const useMockApi = !API_URL || API_URL === 'undefined';

// Helper function to get auth headers
function getAuthHeaders() {
	const token = get(authToken);
	console.log('Auth token:', token ? 'Present' : 'Missing');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	};
}

// Send a friend request
export async function sendFriendRequest(toUserId: number): Promise<{ success: boolean; error?: string }> {
	if (useMockApi) {
		return mockSendFriendRequest(toUserId);
	}

	try {
		const requestBody = {
			data: {
				to: toUserId
			}
		};
		
		const token = get(authToken);
		console.log('Sending friend request:', {
			url: `${API_URL}/api/friend-requests`,
			toUserId: toUserId,
			toUserIdType: typeof toUserId,
			currentUserToken: token ? 'Present' : 'Missing',
			body: requestBody,
			headers: getAuthHeaders()
		});
		
		const response = await fetch(`${API_URL}/api/friend-requests`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(requestBody)
		});

		console.log('Response status:', response.status);
		const data = await response.json();
		console.log('Response data:', data);

		if (response.ok) {
			return { success: true };
		} else {
			return { success: false, error: data.error?.message || 'Failed to send friend request' };
		}
	} catch (error) {
		return { success: false, error: 'Network error' };
	}
}

// Accept a friend request
export async function acceptFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
	if (useMockApi) {
		return mockAcceptFriendRequest(requestId);
	}

	try {
		const response = await fetch(`${API_URL}/api/friend-requests/${requestId}`, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				data: {
					status: 'accepted'
				}
			})
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true };
		} else {
			return { success: false, error: data.error?.message || 'Failed to accept friend request' };
		}
	} catch (error) {
		return { success: false, error: 'Network error' };
	}
}

// Reject a friend request
export async function rejectFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
	if (useMockApi) {
		return mockRejectFriendRequest(requestId);
	}

	try {
		const response = await fetch(`${API_URL}/api/friend-requests/${requestId}`, {
			method: 'PUT',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				data: {
					status: 'rejected'
				}
			})
		});

		const data = await response.json();

		if (response.ok) {
			return { success: true };
		} else {
			return { success: false, error: data.error?.message || 'Failed to reject friend request' };
		}
	} catch (error) {
		return { success: false, error: 'Network error' };
	}
}

// Remove a friend
export async function removeFriend(friendId: number): Promise<{ success: boolean; error?: string }> {
	if (useMockApi) {
		return mockRemoveFriend(friendId);
	}

	try {
		const response = await fetch(`${API_URL}/api/friends/${friendId}`, {
			method: 'DELETE',
			headers: getAuthHeaders()
		});

		if (response.ok) {
			return { success: true };
		} else {
			const data = await response.json();
			return { success: false, error: data.error?.message || 'Failed to remove friend' };
		}
	} catch (error) {
		return { success: false, error: 'Network error' };
	}
}

// Get pending friend requests (received)
export async function getPendingFriendRequests(): Promise<{ data: FriendRequest[]; error?: string }> {
	if (useMockApi) {
		return mockGetPendingFriendRequests();
	}

	try {
		const response = await fetch(
			`${API_URL}/api/friend-requests/pending`,
			{
				headers: getAuthHeaders()
			}
		);

		const data: FriendSystemResponse = await response.json();

		if (response.ok) {
			return { data: data.data };
		} else {
			return { data: [], error: data.error?.message || 'Failed to fetch friend requests' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Get sent friend requests
export async function getSentFriendRequests(): Promise<{ data: FriendRequest[]; error?: string }> {
	if (useMockApi) {
		return mockGetSentFriendRequests();
	}

	try {
		const response = await fetch(
			`${API_URL}/api/friend-requests/sent`,
			{
				headers: getAuthHeaders()
			}
		);

		const data: FriendSystemResponse = await response.json();

		if (response.ok) {
			return { data: data.data };
		} else {
			return { data: [], error: data.error?.message || 'Failed to fetch sent requests' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Get friends list
export async function getFriendsList(): Promise<{ data: User[]; error?: string }> {
	if (useMockApi) {
		return mockGetFriendsList();
	}

	try {
		const response = await fetch(
			`${API_URL}/api/friends`,
			{
				headers: getAuthHeaders()
			}
		);

		const data: FriendsListResponse = await response.json();

		if (response.ok) {
			return { data: data.data };
		} else {
			return { data: [], error: data.error?.message || 'Failed to fetch friends' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Check if users are friends
export async function checkFriendshipStatus(userId: number): Promise<{ status: 'friends' | 'pending_sent' | 'pending_received' | 'not_friends'; error?: string }> {
	if (useMockApi) {
		return mockCheckFriendshipStatus(userId);
	}

	try {
		const response = await fetch(
			`${API_URL}/api/friends/status/${userId}`,
			{
				headers: getAuthHeaders()
			}
		);

		if (response.ok) {
			const data = await response.json();
			switch (data.status) {
				case 'friends':
					return { status: 'friends' };
				case 'request_sent':
					return { status: 'pending_sent' };
				case 'request_received':
					return { status: 'pending_received' };
				default:
					return { status: 'not_friends' };
			}
		} else {
			return { status: 'not_friends', error: 'Failed to check friendship status' };
		}
	} catch (error) {
		return { status: 'not_friends', error: 'Network error' };
	}
}