import { writable } from 'svelte/store';

export interface User {
	id: number;
	username: string;
	email: string;
	// Add other fields as needed from Strapi user object
}

export const authToken = writable<string | null>(null);
export const user = writable<User | null>(null);
export const consultantId = writable<string | null>(null);

export function logout() {
	authToken.set(null);
	user.set(null);
	localStorage.removeItem('jwt');
	localStorage.removeItem('user');
}

if (typeof window !== 'undefined') {
	const jwt = localStorage.getItem('jwt');
	const userData = localStorage.getItem('user');
	const docId = localStorage.getItem('consultantId');
	if (jwt) authToken.set(jwt);
	if (userData) user.set(JSON.parse(userData));
	if (docId) consultantId.set(docId);
}
