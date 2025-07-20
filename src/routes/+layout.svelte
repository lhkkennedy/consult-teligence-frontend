<script lang="ts">
	import '../app.css';
	import LoadingScreen from '../components/LoadingScreen.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';

	let initialLoading = true;
	let navLoading = false;
	$: showLoader = initialLoading || navLoading;

	onMount(() => {
		window.scrollTo({ top: 0, left: 0 });
	});

	beforeNavigate(() => {
		if (!showLoader) {
			navLoading = true;
		}
	});

	afterNavigate(() => {
		window.scrollTo({ top: 0, left: 0 });
	});

	function onLoaderFinish() {
		if (navLoading) {
			navLoading = false;
		} else if (initialLoading) {
			initialLoading = false;
		}
	}
</script>

<!-- +layout.svelte -->
<div class="flex min-h-screen flex-col bg-primary-bg pt-24">
	<Header />
	<slot />
	<Footer />
</div>

{#if showLoader}
	<LoadingScreen onFinish={onLoaderFinish} />
{/if}
