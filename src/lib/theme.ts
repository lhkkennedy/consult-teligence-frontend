import { writable } from 'svelte/store';

export const theme = writable<'light' | 'dark'>('dark');

export function toggleTheme() {
	theme.update((current) => {
		const next = current === 'dark' ? 'light' : 'dark';
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', next === 'dark');
		}
		return next;
	});
}

if (typeof window !== 'undefined') {
	const saved = localStorage.getItem('theme');
	if (saved === 'dark' || saved === 'light') {
		theme.set(saved);
		document.documentElement.classList.toggle('dark', saved === 'dark');
	} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme.set('dark');
		document.documentElement.classList.add('dark');
	}
	theme.subscribe((val) => {
		localStorage.setItem('theme', val);
		document.documentElement.classList.toggle('dark', val === 'dark');
	});
}
