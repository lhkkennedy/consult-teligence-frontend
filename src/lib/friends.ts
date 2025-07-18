import { authToken } from './stores/authStore';
import { get } from 'svelte/store';
import type { FriendRequest, User, FriendSystemResponse, FriendsListResponse } from './types';

const API_URL = import.meta.env.VITE_STRAPI_URL;

// Helper function to get auth headers
function getAuthHeaders() {
	const token = get(authToken);
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	};
}

// Send a friend request
export async function sendFriendRequest(
	toUserId: number
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch(`${API_URL}/api/friend-requests`, {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				data: {
					to: toUserId,
					status: 'pending'
				}
			})
		});

		const data = await response.json();

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
export async function acceptFriendRequest(
	requestId: number
): Promise<{ success: boolean; error?: string }> {
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
export async function rejectFriendRequest(
	requestId: number
): Promise<{ success: boolean; error?: string }> {
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
export async function removeFriend(
	friendId: number
): Promise<{ success: boolean; error?: string }> {
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
export async function getPendingFriendRequests(): Promise<{
	data: FriendRequest[];
	error?: string;
}> {
	try {
		const response = await fetch(
			`${API_URL}/api/friend-requests?populate[from][populate][0]=profileImage&populate[to][populate][0]=profileImage&filters[to][id][$eq]=${get(authToken) ? 'current' : 0}&filters[status][$eq]=pending`,
			{
				headers: getAuthHeaders()
			}
		);

		if (response.ok) {
			const data: FriendSystemResponse = await response.json();
			return { data: data.data };
		} else {
			return { data: [], error: 'Failed to fetch friend requests' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Get sent friend requests
export async function getSentFriendRequests(): Promise<{ data: FriendRequest[]; error?: string }> {
	try {
		const response = await fetch(
			`${API_URL}/api/friend-requests?populate[from][populate][0]=profileImage&populate[to][populate][0]=profileImage&filters[from][id][$eq]=${get(authToken) ? 'current' : 0}&filters[status][$eq]=pending`,
			{
				headers: getAuthHeaders()
			}
		);

		if (response.ok) {
			const data: FriendSystemResponse = await response.json();
			return { data: data.data };
		} else {
			return { data: [], error: 'Failed to fetch sent requests' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Get friends list
export async function getFriendsList(): Promise<{ data: User[]; error?: string }> {
	try {
		const response = await fetch(`${API_URL}/api/friends?populate[profileImage]=*`, {
			headers: getAuthHeaders()
		});

		if (response.ok) {
			const data: FriendsListResponse = await response.json();
			return { data: data.data };
		} else {
			return { data: [], error: 'Failed to fetch friends' };
		}
	} catch (error) {
		return { data: [], error: 'Network error' };
	}
}

// Check if users are friends
export async function checkFriendshipStatus(
	userId: number
): Promise<{
	status: 'friends' | 'pending_sent' | 'pending_received' | 'not_friends';
	error?: string;
}> {
	try {
		// Check if they are friends
		const friendsResponse = await fetch(`${API_URL}/api/friends?filters[user][id][$eq]=${userId}`, {
			headers: getAuthHeaders()
		});

		if (friendsResponse.ok) {
			const friendsData = await friendsResponse.json();
			if (friendsData.data && friendsData.data.length > 0) {
				return { status: 'friends' };
			}
		}

		// Check for pending requests
		const requestsResponse = await fetch(
			`${API_URL}/api/friend-requests?filters[status][$eq]=pending&filters[from][id][$eq]=${userId}&filters[to][id][$eq]=${get(authToken) ? 'current' : 0}`,
			{
				headers: getAuthHeaders()
			}
		);

		if (requestsResponse.ok) {
			const requestsData = await requestsResponse.json();
			if (requestsData.data && requestsData.data.length > 0) {
				return { status: 'pending_received' };
			}
		}

		// Check for sent requests
		const sentResponse = await fetch(
			`${API_URL}/api/friend-requests?filters[status][$eq]=pending&filters[from][id][$eq]=${get(authToken) ? 'current' : 0}&filters[to][id][$eq]=${userId}`,
			{
				headers: getAuthHeaders()
			}
		);

		if (sentResponse.ok) {
			const sentData = await sentResponse.json();
			if (sentData.data && sentData.data.length > 0) {
				return { status: 'pending_sent' };
			}
		}

		return { status: 'not_friends' };
	} catch (error) {
		return { status: 'not_friends', error: 'Network error' };
	}
}
