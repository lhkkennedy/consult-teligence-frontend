<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';
	import Heart from '@lucide/svelte/icons/heart';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Calendar from '@lucide/svelte/icons/calendar';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';
	import Zap from '@lucide/svelte/icons/zap';
	import Star from '@lucide/svelte/icons/star';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Building from '@lucide/svelte/icons/building';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Clock from '@lucide/svelte/icons/clock';
	import Users from '@lucide/svelte/icons/users';
	import CheckCircle from '@lucide/svelte/icons/check-circle';
	import Eye from '@lucide/svelte/icons/eye';
	import type { TimelinePost } from '../lib/types.js';

	export let post: TimelinePost & {
		author_name?: string;
		author_avatar?: string;
		author_company?: string;
		author_role?: string;
		property_data?: any;
		engagement_score?: number;
		deal_size?: string;
		location?: string;
		property_type?: string;
		is_trending?: boolean;
		is_featured?: boolean;
		read_time?: number;
		tags?: string[];
		is_saved?: boolean;
		view_count?: number;
		share_count?: number;
		save_count?: number;
		author_verified?: boolean;
		author_followers?: number;
		deal_stage?: string;
		roi_estimate?: string;
		market_trend?: string;
	};
	export let onInteraction: (postId: string, action: string, data?: any) => void;

	// Local state
	let showComments = false;
	let showReactions = false;
	let commentText = '';
	let isLiked = false;
	let isSaved = post.is_saved || false;
	let showShareMenu = false;
	let showAuthorMenu = false;

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

	// Get deal stage color
	function getDealStageColor(stage: string): string {
		switch (stage) {
			case 'Lead':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			case 'Under Contract':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'Closed':
				return 'bg-green-500/20 text-green-400 border-green-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	}

	// Get market trend color
	function getMarketTrendColor(trend: string): string {
		switch (trend) {
			case 'Rising':
				return 'text-green-400';
			case 'Declining':
				return 'text-red-400';
			case 'Volatile':
				return 'text-yellow-400';
			default:
				return 'text-gray-400';
		}
	}

	// Format date
	function formatDate(dateString: string): string {
		if (!dateString) return 'Unknown';
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return 'Unknown';
		return formatDistanceToNow(date, { addSuffix: true });
	}

	// Get total reactions
	function getTotalReactions(): number {
		return post.reactions?.length || 0;
	}

	// Get reaction counts by type
	function getReactionCounts() {
		const counts = { like: 0, love: 0, celebrate: 0, insightful: 0 };
		post.reactions?.forEach(reaction => {
			if (reaction.reaction_type in counts) {
				counts[reaction.reaction_type as keyof typeof counts]++;
			}
		});
		return counts;
	}

	// Handle like
	function handleLike() {
		isLiked = !isLiked;
		onInteraction(post.post_id, 'like');
	}

	// Handle comment
	function handleComment() {
		if (commentText.trim()) {
			onInteraction(post.post_id, 'comment', { comment: commentText });
			commentText = '';
		}
		showComments = !showComments;
	}

	// Handle save
	function handleSave() {
		isSaved = !isSaved;
		onInteraction(post.post_id, 'save');
	}

	// Handle share
	function handleShare() {
		showShareMenu = !showShareMenu;
		// In a real app, this would open a share dialog
	}

	// Handle reaction
	function handleReaction(type: string) {
		onInteraction(post.post_id, `reaction_${type}`);
		showReactions = false;
	}

	// Handle follow author
	function handleFollowAuthor() {
		onInteraction(post.post_id, 'follow');
	}

	// Get reaction counts
	$: reactionCounts = getReactionCounts();
</script>

<div
	class="timeline-post rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-[#2D3748] dark:bg-[#1E2130] {post.is_featured ? 'ring-2 ring-blue-500/20' : ''}"
>
	<!-- Enhanced Post Header -->
	<div class="mb-4 flex items-start justify-between">
		<div class="flex items-center space-x-3">
			{#if post.author_avatar}
				<img
					src={post.author_avatar}
					alt={post.author_name || 'User'}
					class="h-10 w-10 rounded-full object-cover"
				/>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-[#2D3748]"
				>
					<span class="text-sm font-semibold text-gray-700 dark:text-white">
						{(post.author_name || 'U').charAt(0)}
					</span>
				</div>
			{/if}
			<div class="flex-1">
				<div class="flex items-center space-x-2">
					<span class="font-semibold text-gray-900 dark:text-white"
						>{post.author_name || 'Unknown'}</span
					>
					{#if post.author_verified}
						<CheckCircle size={14} class="text-blue-500" title="Verified" />
					{/if}
					{#if post.is_trending}
						<TrendingUp size={14} class="text-orange-500" title="Trending" />
					{/if}
					{#if post.is_featured}
						<Star size={14} class="text-yellow-500" title="Featured" />
					{/if}
					<span class="text-sm text-gray-500 dark:text-[#A0AEC0]"
						>{formatDate(post.created_at)}</span
					>
				</div>
				<div class="mt-1 flex items-center space-x-2">
					{#if post.author_company}
						<span class="text-sm text-gray-600 dark:text-[#A0AEC0]"
							>{post.author_company}</span
						>
					{/if}
					{#if post.author_role}
						<span class="text-sm text-gray-500 dark:text-[#718096]"
							>• {post.author_role}</span
						>
					{/if}
					{#if post.author_followers}
						<div class="flex items-center space-x-1 text-sm text-gray-500 dark:text-[#718096]">
							<Users size={12} />
							<span>{post.author_followers.toLocaleString()} followers</span>
						</div>
					{/if}
				</div>
			</div>
			<div class="relative">
				<button
					on:click={() => (showAuthorMenu = !showAuthorMenu)}
					class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#2D3748] dark:hover:text-gray-300"
				>
					<MoreHorizontal size={16} />
				</button>
				{#if showAuthorMenu}
					<div class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#2D3748]">
						<button
							on:click={handleFollowAuthor}
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						>
							Follow {post.author_name}
						</button>
						<button
							on:click={() => (showAuthorMenu = false)}
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						>
							View Profile
						</button>
						<button
							on:click={() => (showAuthorMenu = false)}
							class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
						>
							Message
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Enhanced Post Type and Sentiment Badges -->
	<div class="mb-3 flex flex-wrap items-center gap-2">
		<span
			class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {getPostTypeColor(post.post_type)}"
		>
			{post.post_type === 'NewListing' && '🏠'}
			{post.post_type === 'ProgressUpdate' && '📈'}
			{post.post_type === 'Closing' && '✅'}
			{post.post_type === 'Insight' && '💡'}
			{post.post_type === 'property' && '🏢'}
			{post.post_type}
		</span>
		{#if post.sentiment}
			<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
				{getSentimentIcon(post.sentiment)} {post.sentiment}
			</span>
		{/if}
		{#if post.deal_stage}
			<span
				class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium {getDealStageColor(post.deal_stage)}"
			>
				{post.deal_stage}
			</span>
		{/if}
		{#if post.market_trend}
			<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
				📊 {post.market_trend}
			</span>
		{/if}
	</div>

	<!-- Enhanced Post Content -->
	<div class="mb-4">
		<div
			class="prose prose-sm max-w-none text-gray-900 dark:text-white"
			class:prose-invert={true}
		>
			{@html formatBody(post.body_md)}
		</div>
	</div>

	<!-- Enhanced Property Data Display -->
	{#if post.property_data}
		<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#4A5568] dark:bg-[#2D3748]">
			<div class="flex items-start space-x-4">
				{#if post.property_data.images && post.property_data.images.length > 0}
					<img
						src={post.property_data.images[0]}
						alt={post.property_data.title}
						class="h-16 w-16 rounded-lg object-cover"
					/>
				{/if}
				<div class="flex-1">
					<h4 class="font-medium text-gray-900 dark:text-white">{post.property_data.title}</h4>
					<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">{post.property_data.address}</p>
					<div class="mt-2 flex flex-wrap items-center gap-2">
						{#each post.property_data.roles as role}
							<span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
								{role}
							</span>
						{/each}
					</div>
					<div class="mt-2 flex items-center space-x-4 text-sm">
						<span class="font-medium text-gray-900 dark:text-white">{post.property_data.headline_metric}</span>
						{#if post.property_data.deal_size}
							<span class="text-gray-600 dark:text-[#A0AEC0]">
								${(post.property_data.deal_size / 1000000).toFixed(1)}M
							</span>
						{/if}
						{#if post.roi_estimate}
							<span class="text-green-600 dark:text-green-400 font-medium">
								ROI: {post.roi_estimate}
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Enhanced Media Display -->
	{#if post.media_urls && post.media_urls.length > 0}
		<div class="mb-4">
			{#if post.media_urls.length === 1}
				<img
					src={post.media_urls[0]}
					alt="Post media"
					class="rounded-lg w-full object-cover"
				/>
			{:else}
				<div class="grid grid-cols-2 gap-2">
					{#each post.media_urls.slice(0, 4) as mediaUrl}
						<img
							src={mediaUrl}
							alt="Post media"
							class="rounded-lg w-full h-32 object-cover"
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Enhanced Post Metadata -->
	<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-[#A0AEC0]">
		{#if post.location}
			<div class="flex items-center space-x-1">
				<MapPin size={14} />
				<span>{post.location}</span>
			</div>
		{/if}
		{#if post.deal_size}
			<div class="flex items-center space-x-1">
				<DollarSign size={14} />
				<span>{post.deal_size}</span>
			</div>
		{/if}
		{#if post.property_type}
			<div class="flex items-center space-x-1">
				<Building size={14} />
				<span>{post.property_type}</span>
			</div>
		{/if}
		{#if post.read_time}
			<div class="flex items-center space-x-1">
				<Clock size={14} />
				<span>{post.read_time} min read</span>
			</div>
		{/if}
		{#if post.view_count}
			<div class="flex items-center space-x-1">
				<Eye size={14} />
				<span>{post.view_count.toLocaleString()} views</span>
			</div>
		{/if}
		{#if post.engagement_score}
			<div class="flex items-center space-x-1">
				<Zap size={14} />
				<span>Engagement: {post.engagement_score}</span>
			</div>
		{/if}
	</div>

	<!-- Enhanced Tags -->
	{#if post.tags && post.tags.length > 0}
		<div class="mb-4 flex flex-wrap gap-2">
			{#each post.tags as tag}
				<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer">
					{tag}
				</span>
			{/each}
		</div>
	{/if}

	<!-- Enhanced Interaction Bar -->
	<div class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-[#4A5568]">
		<div class="flex items-center space-x-6">
			<!-- Like Button -->
			<button
				on:click={handleLike}
				class="flex items-center space-x-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:bg-[#2D3748] dark:hover:text-white"
			>
				<Heart size={16} class={isLiked ? 'text-red-500 fill-current' : ''} />
				<span>{getTotalReactions()}</span>
			</button>

			<!-- Comment Button -->
			<button
				on:click={handleComment}
				class="flex items-center space-x-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:bg-[#2D3748] dark:hover:text-white"
			>
				<MessageCircle size={16} />
				<span>{post.comments?.length || 0}</span>
			</button>

			<!-- Share Button -->
			<div class="relative">
				<button
					on:click={handleShare}
					class="flex items-center space-x-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:bg-[#2D3748] dark:hover:text-white"
				>
					<Share2 size={16} />
					<span>{post.share_count || 0}</span>
				</button>
				{#if showShareMenu}
					<div class="absolute bottom-full left-0 mb-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#2D3748]">
						<button class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
							Copy Link
						</button>
						<button class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
							Share to Network
						</button>
						<button class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
							Export
						</button>
					</div>
				{/if}
			</div>

			<!-- Save Button -->
			<button
				on:click={handleSave}
				class="flex items-center space-x-2 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:bg-[#2D3748] dark:hover:text-white"
			>
				<Bookmark size={16} class={isSaved ? 'text-blue-500 fill-current' : ''} />
				<span>{post.save_count || 0}</span>
			</button>
		</div>

		<!-- External Link -->
		{#if post.property_data}
			<a
				href="#"
				class="flex items-center space-x-1 rounded-full px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-[#A0AEC0] dark:hover:bg-[#2D3748] dark:hover:text-white"
			>
				<ExternalLink size={16} />
				<span>View Details</span>
			</a>
		{/if}
	</div>

	<!-- Enhanced Comments Section -->
	{#if showComments}
		<div class="mt-4 border-t border-gray-200 pt-4 dark:border-[#4A5568]">
			<h4 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Comments</h4>
			
			<!-- Comment Input -->
			<div class="mb-4 flex space-x-3">
				<img
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
					alt="Your avatar"
					class="h-8 w-8 rounded-full object-cover"
				/>
				<div class="flex-1">
					<input
						bind:value={commentText}
						type="text"
						placeholder="Write a comment..."
						class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-white dark:placeholder-gray-400"
					/>
				</div>
				<button
					on:click={handleComment}
					disabled={!commentText.trim()}
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
				>
					Post
				</button>
			</div>

			<!-- Comments List -->
			<div class="space-y-3">
				{#if post.comments && post.comments.length > 0}
					{#each post.comments as comment}
						<div class="flex space-x-3">
							<img
								src={comment.user_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
								alt={comment.user_name || 'User'}
								class="h-8 w-8 rounded-full object-cover"
							/>
							<div class="flex-1">
								<div class="rounded-lg bg-gray-50 px-3 py-2 dark:bg-[#2D3748]">
									<div class="flex items-center space-x-2">
										<span class="text-sm font-medium text-gray-900 dark:text-white">
											{comment.user_name || 'Unknown'}
										</span>
										<span class="text-xs text-gray-500 dark:text-[#A0AEC0]">
											{formatDate(comment.created_at)}
										</span>
									</div>
									<p class="mt-1 text-sm text-gray-700 dark:text-[#E2E8F0]">{comment.body}</p>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-sm text-gray-500 dark:text-[#A0AEC0]">No comments yet. Be the first to comment!</p>
				{/if}
			</div>
		</div>
	{/if}
</div>