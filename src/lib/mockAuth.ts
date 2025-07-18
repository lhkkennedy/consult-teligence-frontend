import { user, authToken } from './stores/authStore';
import { mockUsers } from './mockFriendsApi';

// Set up mock authentication for testing
export function setupMockAuth() {
	// Set a mock token
	authToken.set('mock-jwt-token');
	
	// Set the first mock user as the current user
	user.set(mockUsers[0]);
	
	// Store in localStorage for persistence
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', 'mock-jwt-token');
		localStorage.setItem('user', JSON.stringify(mockUsers[0]));
	}
}

// Check if mock auth is set up
export function isMockAuthSet(): boolean {
	const currentUser = user.get();
	const token = authToken.get();
	return !!(currentUser && token);
}