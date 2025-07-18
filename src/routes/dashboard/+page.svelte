<script lang="ts">
	import { onMount } from 'svelte';
	import { user, consultantId } from '../../lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { Plus, FileText, Building2, TrendingUp, Users, Calendar } from '@lucide/svelte';
	import { UserContentService } from '../../lib/services/userContentService';

	let userPosts: any[] = [];
	let userProperties: any[] = [];
	let loading = true;
	let activeTab = 'overview';

	onMount(async () => {
		// Check if user is authenticated
		if (!$user) {
			goto('/login');
			return;
		}

		// Load user's posts and properties
		await loadUserData();
		loading = false;
	});

	async function loadUserData() {
		try {
			// Load user's posts and properties using the service
			userPosts = await UserContentService.getUserPosts();
			userProperties = await UserContentService.getUserProperties();
		} catch (error) {
			console.error('Error loading user data:', error);
			// Fallback to empty arrays if there's an error
			userPosts = [];
			userProperties = [];
		}
	}

	function handleCreatePost() {
		goto('/dashboard/create-post');
	}

	function handleCreateProperty() {
		goto('/dashboard/create-property');
	}

	function handleEditPost(postId: string) {
		goto(`/dashboard/edit-post/${postId}`);
	}

	function handleEditProperty(propertyId: string) {
		goto(`/dashboard/edit-property/${propertyId}`);
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-[#0F1419]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">Manage your posts and properties</p>
		</div>

		{#if loading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
			</div>
		{:else}
			<!-- Quick Stats -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
					<div class="flex items-center">
						<div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<FileText class="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{userPosts.length}</p>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
					<div class="flex items-center">
						<div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
							<Building2 class="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Properties</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{userProperties.length}</p>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
					<div class="flex items-center">
						<div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
							<TrendingUp class="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">1.2k</p>
						</div>
					</div>
				</div>

				<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
					<div class="flex items-center">
						<div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
							<Users class="h-6 w-6 text-orange-600 dark:text-orange-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 mb-8">
				<button
					on:click={handleCreatePost}
					class="flex items-center justify-center px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/90 transition-colors"
				>
					<Plus class="h-5 w-5 mr-2" />
					Create New Post
				</button>
				<button
					on:click={handleCreateProperty}
					class="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
				>
					<Plus class="h-5 w-5 mr-2" />
					Add New Property
				</button>
			</div>

			<!-- Tabs -->
			<div class="bg-white dark:bg-[#1E2130] rounded-lg shadow-sm">
				<div class="border-b border-gray-200 dark:border-gray-700">
					<nav class="flex space-x-8 px-6">
						<button
							class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'overview' ? 'border-accent-purple text-accent-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
							on:click={() => activeTab = 'overview'}
						>
							Overview
						</button>
						<button
							class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'posts' ? 'border-accent-purple text-accent-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
							on:click={() => activeTab = 'posts'}
						>
							Posts ({userPosts.length})
						</button>
						<button
							class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'properties' ? 'border-accent-purple text-accent-purple' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
							on:click={() => activeTab = 'properties'}
						>
							Properties ({userProperties.length})
						</button>
					</nav>
				</div>

				<div class="p-6">
					{#if activeTab === 'overview'}
						<div class="space-y-6">
							<!-- Recent Posts -->
							<div>
								<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Posts</h3>
								{#if userPosts.length > 0}
									<div class="space-y-4">
										{#each userPosts.slice(0, 3) as post}
											<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D3748] rounded-lg">
												<div>
													<p class="font-medium text-gray-900 dark:text-white">{post.body_md.substring(0, 50)}...</p>
													<p class="text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
												</div>
												<button
													on:click={() => handleEditPost(post.post_id)}
													class="text-accent-purple hover:text-accent-purple/80 text-sm font-medium"
												>
													Edit
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400">No posts yet. Create your first post!</p>
								{/if}
							</div>

							<!-- Recent Properties -->
							<div>
								<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Properties</h3>
								{#if userProperties.length > 0}
									<div class="space-y-4">
										{#each userProperties.slice(0, 3) as property}
											<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D3748] rounded-lg">
												<div>
													<p class="font-medium text-gray-900 dark:text-white">{property.title}</p>
													<p class="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
												</div>
												<button
													on:click={() => handleEditProperty(property.property_uid)}
													class="text-accent-purple hover:text-accent-purple/80 text-sm font-medium"
												>
													Edit
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400">No properties yet. Add your first property!</p>
								{/if}
							</div>
						</div>
					{:else if activeTab === 'posts'}
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">All Posts</h3>
							{#if userPosts.length > 0}
								<div class="space-y-4">
									{#each userPosts as post}
										<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D3748] rounded-lg">
											<div class="flex-1">
												<div class="flex items-center space-x-2 mb-2">
													<span class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
														{post.post_type}
													</span>
													<span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
														{post.sentiment}
													</span>
												</div>
												<p class="font-medium text-gray-900 dark:text-white mb-1">{post.body_md}</p>
												<p class="text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
											</div>
											<button
												on:click={() => handleEditPost(post.post_id)}
												class="ml-4 text-accent-purple hover:text-accent-purple/80 text-sm font-medium"
											>
												Edit
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-12">
									<FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<p class="text-gray-500 dark:text-gray-400">No posts yet. Create your first post!</p>
									<button
										on:click={handleCreatePost}
										class="mt-4 px-4 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/90 transition-colors"
									>
										Create Post
									</button>
								</div>
							{/if}
						</div>
					{:else if activeTab === 'properties'}
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">All Properties</h3>
							{#if userProperties.length > 0}
								<div class="space-y-4">
									{#each userProperties as property}
										<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2D3748] rounded-lg">
											<div class="flex-1">
												<div class="flex items-center space-x-2 mb-2">
													<span class="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
														{property.status}
													</span>
													<span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
														{property.property_type}
													</span>
												</div>
												<p class="font-medium text-gray-900 dark:text-white mb-1">{property.title}</p>
												<p class="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
												{#if property.deal_size}
													<p class="text-sm text-gray-500 dark:text-gray-400">${property.deal_size.toLocaleString()}</p>
												{/if}
											</div>
											<button
												on:click={() => handleEditProperty(property.property_uid)}
												class="ml-4 text-accent-purple hover:text-accent-purple/80 text-sm font-medium"
											>
												Edit
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-12">
									<Building2 class="h-12 w-12 text-gray-400 mx-auto mb-4" />
									<p class="text-gray-500 dark:text-gray-400">No properties yet. Add your first property!</p>
									<button
										on:click={handleCreateProperty}
										class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
									>
										Add Property
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>