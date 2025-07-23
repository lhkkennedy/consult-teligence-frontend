<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Clock from '@lucide/svelte/icons/clock';

	export let timezone: string;
	export let label: string;

	let currentTime = '';
	let interval: number;

	function updateTime() {
		try {
			const now = new Date();
			const timeString = now.toLocaleTimeString('en-US', {
				timeZone: timezone,
				hour12: true,
				hour: 'numeric',
				minute: '2-digit',
				second: '2-digit'
			});
			currentTime = timeString;
		} catch (error) {
			currentTime = 'Time unavailable';
		}
	}

	onMount(() => {
		updateTime();
		interval = setInterval(updateTime, 1000);
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div class="flex items-center text-[#A0AEC0] text-sm">
	<Clock class="w-4 h-4 mr-2" />
	<span>{label}: {currentTime}</span>
</div>