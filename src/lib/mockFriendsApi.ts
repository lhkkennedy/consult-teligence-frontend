import type { FriendRequest, User, FriendSystemResponse, FriendsListResponse } from './types';
import { consultants } from './mockData';
import { authToken, user } from './stores/authStore';
import { get } from 'svelte/store';

// Mock data for friends system
const mockUsers: User[] = consultants.slice(0, 5).map(consultant => ({
	id: consultant.id,
	username: `${consultant.firstName.toLowerCase()}.${consultant.lastName.toLowerCase()}`,
	firstName: consultant.firstName,
	lastName: consultant.lastName,
	email: consultant.contactInfo.email || `${consultant.firstName.toLowerCase()}.${consultant.lastName.toLowerCase()}@example.com`,
	profileImage: consultant.profileImage,
	company: consultant.company,
	currentRole: consultant.currentRole,
	location: consultant.location,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString()
}));

// Mock friend requests
let mockFriendRequests: FriendRequest[] = [
	{
		id: 1,
		from: mockUsers[1],
		to: mockUsers[0],
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 2,
		from: mockUsers[2],
		to: mockUsers[0],
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];

// Mock friends list
let mockFriends: User[] = [
	mockUsers[3],
	mockUsers[4]
];

// Helper function to simulate API delay
function delay(ms: number = 500): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API functions
export async function mockSendFriendRequest(toUserId: number): Promise<{ success: boolean; error?: string }> {
	await delay();
	
	const currentUser = get(user);
	if (!currentUser) {
		return { success: false, error: 'User not authenticated' };
	}
	
	const toUser = mockUsers.find(user => user.id === toUserId);
	if (!toUser) {
		return { success: false, error: 'User not found' };
	}

	// Check if request already exists
	const existingRequest = mockFriendRequests.find(
		req => req.from.id === currentUser.id && req.to.id === toUserId && req.status === 'pending'
	);
	
	if (existingRequest) {
		return { success: false, error: 'Friend request already sent' };
	}

	const newRequest: FriendRequest = {
		id: Date.now(),
		from: currentUser,
		to: toUser,
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	mockFriendRequests.push(newRequest);
	return { success: true };
}

export async function mockAcceptFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
	await delay();
	
	const request = mockFriendRequests.find(req => req.id === requestId);
	if (!request) {
		return { success: false, error: 'Friend request not found' };
	}

	// Update request status
	request.status = 'accepted';
	request.updatedAt = new Date().toISOString();

	// Add to friends list
	if (!mockFriends.find(friend => friend.id === request.from.id)) {
		mockFriends.push(request.from);
	}

	return { success: true };
}

export async function mockRejectFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
	await delay();
	
	const request = mockFriendRequests.find(req => req.id === requestId);
	if (!request) {
		return { success: false, error: 'Friend request not found' };
	}

	request.status = 'rejected';
	request.updatedAt = new Date().toISOString();

	return { success: true };
}

export async function mockRemoveFriend(friendId: number): Promise<{ success: boolean; error?: string }> {
	await delay();
	
	mockFriends = mockFriends.filter(friend => friend.id !== friendId);
	return { success: true };
}

export async function mockGetPendingFriendRequests(): Promise<{ data: FriendRequest[]; error?: string }> {
	await delay();
	
	const currentUser = get(user);
	if (!currentUser) {
		return { data: [], error: 'User not authenticated' };
	}
	
	const pendingRequests = mockFriendRequests.filter(
		req => req.to.id === currentUser.id && req.status === 'pending'
	);
	
	return { data: pendingRequests };
}

export async function mockGetSentFriendRequests(): Promise<{ data: FriendRequest[]; error?: string }> {
	await delay();
	
	const currentUser = get(user);
	if (!currentUser) {
		return { data: [], error: 'User not authenticated' };
	}
	
	const sentRequests = mockFriendRequests.filter(
		req => req.from.id === currentUser.id && req.status === 'pending'
	);
	
	return { data: sentRequests };
}

export async function mockGetFriendsList(): Promise<{ data: User[]; error?: string }> {
	await delay();
	
	return { data: mockFriends };
}

export async function mockCheckFriendshipStatus(userId: number): Promise<{ status: 'friends' | 'pending_sent' | 'pending_received' | 'not_friends'; error?: string }> {
	await delay();
	
	const currentUser = get(user);
	if (!currentUser) {
		return { status: 'not_friends', error: 'User not authenticated' };
	}
	
	// Check if they are friends
	const isFriend = mockFriends.some(friend => friend.id === userId);
	if (isFriend) {
		return { status: 'friends' };
	}

	// Check for pending requests
	const pendingReceived = mockFriendRequests.find(
		req => req.from.id === userId && req.to.id === currentUser.id && req.status === 'pending'
	);
	if (pendingReceived) {
		return { status: 'pending_received' };
	}

	const pendingSent = mockFriendRequests.find(
		req => req.from.id === currentUser.id && req.to.id === userId && req.status === 'pending'
	);
	if (pendingSent) {
		return { status: 'pending_sent' };
	}

	return { status: 'not_friends' };
}

// Export mock users for testing
export { mockUsers };