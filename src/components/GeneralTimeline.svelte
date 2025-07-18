<script lang="ts">
	import { onMount } from 'svelte';
	import TimelinePost from './TimelinePost.svelte';

	let posts: any[] = [];
	let page = 1;
	let hasMore = true;
	let loading = false;
	let error = '';
	let observer;
	let sentinel;

	async function fetchTimelineItems() {
		if (loading || !hasMore) return;
		loading = true;
		error = '';
		try {
			const res = await fetch(
				`/api/timeline-items?pagination[page]=${page}&pagination[pageSize]=10&sort=createdAt:desc`
			);
			const data = await res.json();
			const items = data.data || [];
			if (items.length < 10) hasMore = false;
			posts = [...posts, ...items.map(mapStrapiTimelineItem)];
			page += 1;
		} catch (e) {
			error = 'Failed to load timeline.';
		} finally {
			loading = false;
		}
	}

	function mapStrapiTimelineItem(item) {
		const attr = item.attributes || {};
		let property_data = undefined;
		if (attr.type === 'property' && attr.property?.data?.attributes) {
			const prop = attr.property.data.attributes;
			property_data = {
				property_uid: attr.property.data.id,
				title: prop.title,
				address: prop.location,
				property_type: prop.property_type,
				status: prop.status,
				headline_metric: prop.headline_metric,
				images: prop.images?.data?.map((img) => img.attributes.url) || [],
				roles: prop.roles || [],
				deal_size: prop.deal_size,
				irr: prop.irr,
				completion_percentage: prop.completion_percentage
			};
		}
		return {
			post_id: item.id,
			person_id: attr.author?.data?.id,
			created_at: attr.createdAt,
			body_md: attr.content,
			media_urls: [], // TODO: map media if present
			property_uid: attr.property?.data?.id,
			post_type: attr.type,
			sentiment: 'Neutral', // TODO: map if present
			visibility: attr.visibility,
			reactions: [], // TODO: map if present
			comments: [], // TODO: map if present
			property_data
		};
	}

	onMount(() => {
		fetchTimelineItems();
		observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore && !loading) {
				fetchTimelineItems();
			}
		});
		if (sentinel) observer.observe(sentinel);
		return () => observer && observer.disconnect();
	});
</script>

<div class="timeline-container">
	<div class="space-y-6">
		{#each posts as post}
			<TimelinePost {post} />
		{/each}
	</div>
	{#if loading}
		<div class="py-4 text-center text-gray-500 dark:text-[#A0AEC0]">Loading...</div>
	{/if}
	{#if error}
		<div class="py-4 text-center text-red-500">{error}</div>
	{/if}
	{#if !loading && posts.length === 0}
		<div class="py-12 text-center text-gray-600 dark:text-[#A0AEC0]">No posts yet.</div>
	{/if}
	<div bind:this={sentinel}></div>
</div>
