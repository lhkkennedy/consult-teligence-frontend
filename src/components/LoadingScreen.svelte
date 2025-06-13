<script lang="ts">
	import { onMount } from 'svelte';

	/** Called once the overlay has fully faded away */
	export let onFinish: () => void = () => {};

	// toggle this to kick off our CSS transitions
	let loaded = false;

	// when we mount, wait one RAF then set `loaded = true`
	onMount(() => {
		requestAnimationFrame(() => {
			loaded = true;
		});
	});

	// when the overlay finishes fading (opacity transition), unmount
	function handleTransitionEnd(e: TransitionEvent) {
		if (e.target === e.currentTarget && e.propertyName === 'opacity') {
			onFinish();
		}
	}
</script>

<div class="loader-overlay" class:loaded on:transitionend={handleTransitionEnd}>
	<div class="panel left bg-primary-bg"></div>
	<div class="panel right bg-primary-bg"></div>
	<div class="spinner">
		<div class="ring"></div>
	</div>
</div>

<style>
	.loader-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		overflow: hidden;
		/* start fully opaque */
		opacity: 1;
		/* fade starts at 1s, lasts 0.3s */
		transition: opacity 0.3s ease 1s;
	}
	.loader-overlay.loaded {
		/* when `loaded` flips, panels slide (see below) and this overlay fades */
		opacity: 0;
	}

	.panel {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50vw;
		/* slide begins at 0.2s, lasts 0.8s */
		transition: transform 0.8s ease 0.2s;
	}
	.panel.left {
		left: 0;
		transform: translateX(0);
	}
	.panel.right {
		right: 0;
		transform: translateX(0);
	}

	.loader-overlay.loaded .panel.left {
		transform: translateX(-100%);
	}
	.loader-overlay.loaded .panel.right {
		transform: translateX(100%);
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		/* spinner fade begins at 1s, lasts 0.3s */
		opacity: 1;
		transition: opacity 0.3s ease 1s;
	}
	.loader-overlay.loaded .spinner {
		opacity: 0;
	}

	.ring {
		width: 3rem;
		height: 3rem;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
