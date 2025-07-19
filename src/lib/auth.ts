import { authToken, user, consultantId } from './stores/authStore.ts';
import type { User } from './stores/authStore.ts';

const API_URL = import.meta.env.VITE_STRAPI_URL;

// Helper to set auth state in stores and localStorage
function setAuthState(jwt: string, userObj: User, docId: string | null) {
	authToken.set(jwt);
	user.set(userObj);
	localStorage.setItem('jwt', jwt);
	localStorage.setItem('user', JSON.stringify(userObj));
	consultantId.set(docId);
	if (docId) localStorage.setItem('consultantId', docId);
	else localStorage.removeItem('consultantId');
}

// Helper to clear auth state
export function clearAuthState() {
	authToken.set(null);
	user.set(null);
	consultantId.set(null);
	localStorage.removeItem('jwt');
	localStorage.removeItem('user');
	localStorage.removeItem('consultantId');
}

async function fetchConsultantIdByUserId(userId: number, jwt: string): Promise<string | null> {
	const res = await fetch(
		`${API_URL}/api/consultants?populate=*&filters[user][id][$eq]=${userId}`,
		{
			headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
		}
	);
	const data = await res.json();
	if (data.data && data.data.length > 0) {
		return data.data[0].documentId || null;
	}
	return null;
}

async function fetchConsultantIdByUserIdWithRetry(
	userId: number,
	jwt: string,
	retries = 5,
	delay = 300
) {
	for (let i = 0; i < retries; i++) {
		const docId = await fetchConsultantIdByUserId(userId, jwt);
		if (docId) return docId;
		await new Promise((res) => setTimeout(res, delay));
	}
	return null;
}

export async function login(identifier: string, password: string) {
	const res = await fetch(`${API_URL}/api/auth/local`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	const data = await res.json();
	console.log(data);
	if (data.jwt) {
		// Fetch consultantId before setting state
		const docId = await fetchConsultantIdByUserIdWithRetry(data.user.id, data.jwt);
		setAuthState(data.jwt, data.user as User, docId);
		return { success: true };
	} else {
		clearAuthState();
		return { success: false, error: data.error?.message || 'Login failed' };
	}
}

export async function register(username: string, email: string, password: string) {
	const res = await fetch(`${API_URL}/api/auth/local/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
	});
	const data = await res.json();
	if (data.jwt) {
		// Fetch consultantId before setting state
		const docId = await fetchConsultantIdByUserIdWithRetry(data.user.id, data.jwt);
		setAuthState(data.jwt, data.user as User, docId);
		return { success: true };
	} else {
		clearAuthState();
		return { success: false, error: data.error?.message || 'Registration failed' };
	}
}
