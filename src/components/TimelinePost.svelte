<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import Heart from '@lucide/svelte/icons/heart';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Calendar from '@lucide/svelte/icons/calendar';
	import MapPin from '@lucide/svelte/icons/map-pin';

	export let post: any;

	// Format the post body with markdown-like styling
	function formatBody(body: string): string {
		return body
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/\n/g, '<br>');
	}

	// Get post type badge color
	function getPostTypeColor(type: string): string {
		switch (type) {
			case 'NewListing':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'ProgressUpdate':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'Closing':
				return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'Insight':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			case 'property':
				return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	}

	// Get sentiment color
	function getSentimentColor(sentiment: string): string {
		switch (sentiment) {
			case 'Bull':
				return 'text-green-400';
			case 'Bear':
				return 'text-red-400';
			default:
				return 'text-gray-400';
		}
	}

	// Get sentiment icon
	function getSentimentIcon(sentiment: string): string {
		switch (sentiment) {
			case 'Bull':
				return '📈';
			case 'Bear':
				return '📉';
			default:
				return '➡️';
		}
	}

	// Format date
	function formatDate(dateString: string): string {
		if (!dateString) return "Unknown";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Unknown";
		return formatDistanceToNow(date, { addSuffix: true });
	}

	// Get total reactions
	function getTotalReactions(): number {
		return post.reactions?.length || 0;
	}
</script>

<div class="timeline-post bg-white dark:bg-[#1E2130] border border-gray-200 dark:border-[#2D3748] rounded-lg p-6 mb-6">
	<!-- Post Header -->
	<div class="flex items-start justify-between mb-4">
		<div class="flex items-center space-x-3">
			<div class="w-10 h-10 bg-gray-200 dark:bg-[#2D3748] rounded-full flex items-center justify-center">
				<span class="text-sm font-semibold text-gray-700 dark:text-white">JD</span>
			</div>
			<div>
				<div class="flex items-center space-x-2">
					<span class="font-semibold text-gray-900 dark:text-white">{post.author_name || 'Unknown'}</span>
					<span class="text-gray-500 dark:text-[#A0AEC0] text-sm">{formatDate(post.created_at)}</span>
				</div>
				<div class="flex items-center space-x-2 mt-1">
					<span class="text-xs px-2 py-1 rounded-full border {getPostTypeColor(post.post_type)}">
						{post.post_type.replace(/([A-Z])/g, ' $1').trim()}
					</span>
					<span class="text-xs {getSentimentColor(post.sentiment)}">
						{getSentimentIcon(post.sentiment)} {post.sentiment}
					</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Property Card for property-type posts -->
	{#if post.post_type === 'property' && post.property_data}
		<div class="bg-gray-100 dark:bg-[#2D3748] rounded-lg p-4 mb-4">
			<div class="flex items-start space-x-4">
				{#if post.property_data.images && post.property_data.images.length > 0}
					<img 
						src={post.property_data.images[0]} 
						alt={post.property_data.title}
						class="w-16 h-16 object-cover rounded-lg"
					/>
				{/if}
				<div class="flex-1">
					<div class="flex items-center space-x-2 mb-1">
						<MapPin size={14} class="text-gray-500 dark:text-[#A0AEC0]" />
						<span class="font-medium text-sm text-gray-900 dark:text-white">{post.property_data.title}</span>
					</div>
					<p class="text-gray-500 dark:text-[#A0AEC0] text-sm mb-2">{post.property_data.address}</p>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							{#each post.property_data.roles as role}
								<span class="text-xs bg-white dark:bg-[#1E2130] px-2 py-1 rounded-full text-gray-500 dark:text-[#A0AEC0]">
									{role}
								</span>
							{/each}
						</div>
						{#if post.property_data.headline_metric}
							<span class="text-xs font-medium text-green-600 dark:text-green-400">
								{post.property_data.headline_metric}
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Post Content -->
	<div class="mb-4">
		<p class="text-gray-900 dark:text-[#E2E8F0] leading-relaxed">{@html formatBody(post.body_md)}</p>
	</div>

	<!-- Media Gallery -->
	{#if post.media_urls && post.media_urls.length > 0}
		<div class="mb-4">
			{#if post.media_urls.length === 1}
				<img 
					src={post.media_urls[0]} 
					alt="Post media"
					class="w-full rounded-lg object-cover max-h-96"
				/>
			{:else}
				<div class="grid grid-cols-2 gap-2">
					{#each post.media_urls.slice(0, 4) as url, index}
						<img 
							src={url} 
							alt="Post media {index + 1}"
							class="w-full h-32 object-cover rounded-lg"
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Comments -->
	{#if post.comments && post.comments.length > 0}
		<div class="bg-gray-100 dark:bg-[#2D3748] rounded-lg p-4 mb-4">
			<h4 class="text-sm font-medium mb-3 text-gray-900 dark:text-[#E2E8F0]">Comments</h4>
			{#each post.comments as comment}
				<div class="flex space-x-3 mb-3 last:mb-0">
					{#if comment.user_avatar}
						<img 
							src={comment.user_avatar} 
							alt={comment.user_name}
							class="w-8 h-8 rounded-full object-cover"
						/>
					{:else}
						<div class="w-8 h-8 bg-gray-200 dark:bg-[#1E2130] rounded-full flex items-center justify-center">
							<span class="text-xs font-semibold text-gray-700 dark:text-white">{comment.user_name.charAt(0)}</span>
						</div>
					{/if}
					<div class="flex-1">
						<div class="flex items-center space-x-2 mb-1">
							<span class="text-sm font-medium text-gray-900 dark:text-[#E2E8F0]">{comment.user_name}</span>
							<span class="text-xs text-gray-500 dark:text-[#A0AEC0]">{formatDate(comment.created_at)}</span>
						</div>
						<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">{comment.body}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Action Bar -->
	<div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#2D3748]">
		<div class="flex items-center space-x-6">
			<button class="flex items-center space-x-2 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
				<Heart size={18} />
				<span class="text-sm">{getTotalReactions()}</span>
			</button>
			<button class="flex items-center space-x-2 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
				<MessageCircle size={18} />
				<span class="text-sm">{post.comments?.length || 0}</span>
			</button>
			<button class="flex items-center space-x-2 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
				<Share2 size={18} />
				<span class="text-sm">Share</span>
			</button>
		</div>
		<div class="flex items-center space-x-2">
			<button class="text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
				<Bookmark size={18} />
			</button>
			{#if post.post_type === 'property' && post.property_data}
				<button class="flex items-center space-x-1 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
					<Calendar size={16} />
					<span class="text-sm">Tour</span>
				</button>
			{/if}
		</div>
	</div>
</div> 