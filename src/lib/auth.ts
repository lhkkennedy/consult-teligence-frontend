import { authToken, user } from './stores/authStore.ts';

const API_URL = import.meta.env.VITE_STRAPI_URL;

export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await res.json();
  if (data.jwt) {
    authToken.set(data.jwt);
    user.set(data.user);
    localStorage.setItem('jwt', data.jwt);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true };
  } else {
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
    authToken.set(data.jwt);
    user.set(data.user);
    localStorage.setItem('jwt', data.jwt);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true };
  } else {
    return { success: false, error: data.error?.message || 'Registration failed' };
  }
} 