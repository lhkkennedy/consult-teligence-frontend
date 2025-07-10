import { writable } from 'svelte/store';

export const authToken = writable<string | null>(null);
export const user = writable<any>(null);

export function logout() {
  authToken.set(null);
  user.set(null);
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
}

if (typeof window !== 'undefined') {
  const jwt = localStorage.getItem('jwt');
  const userData = localStorage.getItem('user');
  if (jwt) authToken.set(jwt);
  if (userData) user.set(JSON.parse(userData));
} 