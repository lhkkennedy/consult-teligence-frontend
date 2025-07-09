<script lang="ts">
	import { onMount } from 'svelte';
	import TimelinePost from './TimelinePost.svelte';
	import { mockTimelinePosts, mockProperties } from '../lib/mockData.js';
	import Plus from '@lucide/svelte/icons/plus';
	import Image from '@lucide/svelte/icons/image';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Send from '@lucide/svelte/icons/send';

	export let personId: string;

	let posts = mockTimelinePosts;
	let properties = mockProperties;
	let showComposer = false;
	let newPost = {
		body_md: '',
		post_type: 'Generic',
		sentiment: 'Neutral',
		property_uid: '',
		media_urls: []
	};

	// Get property by UID
	function getPropertyByUid(uid: string) {
		return properties.find(p => p.property_uid === uid);
	}

	// Create new post
	function createPost() {
		if (!newPost.body_md.trim()) return;

		const post = {
			post_id: `post_${Date.now()}`,
			person_id: personId,
			created_at: new Date().toISOString(),
			body_md: newPost.body_md,
			media_urls: newPost.media_urls,
			property_uid: newPost.property_uid || undefined,
			post_type: newPost.post_type as any,
			sentiment: newPost.sentiment as any,
			visibility: 'Public' as any,
			reactions: [],
			comments: []
		};

		posts = [post, ...posts];
		
		// Reset form
		newPost = {
			body_md: '',
			post_type: 'Generic',
			sentiment: 'Neutral',
			property_uid: '',
			media_urls: []
		};
		showComposer = false;
	}
</script>

<div class="timeline-container">
	<!-- Composer Toggle -->
	<div class="mb-6">
		<button 
			class="btn btn-primary flex items-center space-x-2"
			on:click={() => showComposer = !showComposer}
		>
			<Plus size={18} />
			<span>{showComposer ? 'Cancel' : 'Create Post'}</span>
		</button>
	</div>

	<!-- Post Composer -->
	{#if showComposer}
		<div class="bg-[#1E2130] border border-[#2D3748] rounded-lg p-6 mb-6">
			<h3 class="text-lg font-semibold mb-4 text-[#E2E8F0]">Create New Post</h3>
			
			<div class="space-y-4">
				<!-- Post Type -->
				<div>
					<label class="block text-sm font-medium text-[#A0AEC0] mb-2">Post Type</label>
					<select 
						bind:value={newPost.post_type}
						class="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-3 py-2 text-[#E2E8F0]"
					>
						<option value="Generic">Generic</option>
						<option value="NewListing">New Listing</option>
						<option value="ProgressUpdate">Progress Update</option>
						<option value="Closing">Closing</option>
						<option value="Insight">Insight</option>
					</select>
				</div>

				<!-- Sentiment -->
				<div>
					<label class="block text-sm font-medium text-[#A0AEC0] mb-2">Sentiment</label>
					<select 
						bind:value={newPost.sentiment}
						class="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-3 py-2 text-[#E2E8F0]"
					>
						<option value="Neutral">Neutral</option>
						<option value="Bull">Bull</option>
						<option value="Bear">Bear</option>
					</select>
				</div>

				<!-- Property Selection -->
				<div>
					<label class="block text-sm font-medium text-[#A0AEC0] mb-2">Attach Property (Optional)</label>
					<select 
						bind:value={newPost.property_uid}
						class="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-3 py-2 text-[#E2E8F0]"
					>
						<option value="">No property</option>
						{#each properties as property}
							<option value={property.property_uid}>{property.title}</option>
						{/each}
					</select>
				</div>

				<!-- Post Content -->
				<div>
					<label class="block text-sm font-medium text-[#A0AEC0] mb-2">Content</label>
					<textarea 
						bind:value={newPost.body_md}
						placeholder="Share your thoughts, updates, or insights..."
						class="w-full bg-[#2D3748] border border-[#4A5568] rounded-lg px-3 py-3 text-[#E2E8F0] h-32 resize-none"
					></textarea>
					<p class="text-xs text-[#A0AEC0] mt-1">Use **bold** and *italic* for formatting</p>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<button class="p-2 text-[#A0AEC0] hover:text-white transition-colors">
							<Image size={18} />
						</button>
						<button class="p-2 text-[#A0AEC0] hover:text-white transition-colors">
							<MapPin size={18} />
						</button>
					</div>
					<button 
						class="btn btn-primary flex items-center space-x-2"
						on:click={createPost}
						disabled={!newPost.body_md.trim()}
					>
						<Send size={18} />
						<span>Post</span>
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Timeline Posts -->
	<div class="space-y-6">
		{#each posts as post}
			<TimelinePost 
				{post} 
				property={post.property_uid ? getPropertyByUid(post.property_uid) : undefined}
			/>
		{/each}
	</div>

	<!-- Empty State -->
	{#if posts.length === 0}
		<div class="text-center py-12">
			<div class="text-[#A0AEC0] mb-4">
				<Plus size={48} class="mx-auto mb-4 opacity-50" />
				<h3 class="text-lg font-medium mb-2">No posts yet</h3>
				<p>Start sharing your real estate insights and updates</p>
			</div>
			<button 
				class="btn btn-primary"
				on:click={() => showComposer = true}
			>
				Create Your First Post
			</button>
		</div>
	{/if}
</div> 