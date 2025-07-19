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
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">Manage your posts and properties</p>
		</div>

		{#if loading}
			<div class="flex h-64 items-center justify-center">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-accent-purple"></div>
			</div>
		{:else}
			<!-- Quick Stats -->
			<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
					<div class="flex items-center">
						<div class="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
							<FileText class="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">{userPosts.length}</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
					<div class="flex items-center">
						<div class="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
							<Building2 class="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Properties</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">
								{userProperties.length}
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
					<div class="flex items-center">
						<div class="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
							<TrendingUp class="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
							<p class="text-2xl font-bold text-gray-900 dark:text-white">1.2k</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
					<div class="flex items-center">
						<div class="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
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
			<div class="mb-8 flex flex-col gap-4 sm:flex-row">
				<button
					on:click={handleCreatePost}
					class="flex items-center justify-center rounded-lg bg-accent-purple px-6 py-3 text-white transition-colors hover:bg-accent-purple/90"
				>
					<Plus class="mr-2 h-5 w-5" />
					Create New Post
				</button>
				<button
					on:click={handleCreateProperty}
					class="flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
				>
					<Plus class="mr-2 h-5 w-5" />
					Add New Property
				</button>
			</div>

			<!-- Tabs -->
			<div class="rounded-lg bg-white shadow-sm dark:bg-[#1E2130]">
				<div class="border-b border-gray-200 dark:border-gray-700">
					<nav class="flex space-x-8 px-6">
						<button
							class="border-b-2 px-1 py-4 text-sm font-medium {activeTab === 'overview'
								? 'border-accent-purple text-accent-purple'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
							on:click={() => (activeTab = 'overview')}
						>
							Overview
						</button>
						<button
							class="border-b-2 px-1 py-4 text-sm font-medium {activeTab === 'posts'
								? 'border-accent-purple text-accent-purple'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
							on:click={() => (activeTab = 'posts')}
						>
							Posts ({userPosts.length})
						</button>
						<button
							class="border-b-2 px-1 py-4 text-sm font-medium {activeTab === 'properties'
								? 'border-accent-purple text-accent-purple'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
							on:click={() => (activeTab = 'properties')}
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
								<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Recent Posts</h3>
								{#if userPosts.length > 0}
									<div class="space-y-4">
										{#each userPosts.slice(0, 3) as post}
											<div
												class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#2D3748]"
											>
												<div>
													<p class="font-medium text-gray-900 dark:text-white">
														{post.body_md.substring(0, 50)}...
													</p>
													<p class="text-sm text-gray-500 dark:text-gray-400">
														{new Date(post.created_at).toLocaleDateString()}
													</p>
												</div>
												<button
													on:click={() => handleEditPost(post.post_id)}
													class="text-sm font-medium text-accent-purple hover:text-accent-purple/80"
												>
													Edit
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400">
										No posts yet. Create your first post!
									</p>
								{/if}
							</div>

							<!-- Recent Properties -->
							<div>
								<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
									Recent Properties
								</h3>
								{#if userProperties.length > 0}
									<div class="space-y-4">
										{#each userProperties.slice(0, 3) as property}
											<div
												class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#2D3748]"
											>
												<div>
													<p class="font-medium text-gray-900 dark:text-white">{property.title}</p>
													<p class="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
												</div>
												<button
													on:click={() => handleEditProperty(property.property_uid)}
													class="text-sm font-medium text-accent-purple hover:text-accent-purple/80"
												>
													Edit
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400">
										No properties yet. Add your first property!
									</p>
								{/if}
							</div>
						</div>
					{:else if activeTab === 'posts'}
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">All Posts</h3>
							{#if userPosts.length > 0}
								<div class="space-y-4">
									{#each userPosts as post}
										<div
											class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#2D3748]"
										>
											<div class="flex-1">
												<div class="mb-2 flex items-center space-x-2">
													<span
														class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
													>
														{post.post_type}
													</span>
													<span
														class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
													>
														{post.sentiment}
													</span>
												</div>
												<p class="mb-1 font-medium text-gray-900 dark:text-white">{post.body_md}</p>
												<p class="text-sm text-gray-500 dark:text-gray-400">
													{new Date(post.created_at).toLocaleDateString()}
												</p>
											</div>
											<button
												on:click={() => handleEditPost(post.post_id)}
												class="ml-4 text-sm font-medium text-accent-purple hover:text-accent-purple/80"
											>
												Edit
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="py-12 text-center">
									<FileText class="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p class="text-gray-500 dark:text-gray-400">
										No posts yet. Create your first post!
									</p>
									<button
										on:click={handleCreatePost}
										class="mt-4 rounded-lg bg-accent-purple px-4 py-2 text-white transition-colors hover:bg-accent-purple/90"
									>
										Create Post
									</button>
								</div>
							{/if}
						</div>
					{:else if activeTab === 'properties'}
						<div>
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">All Properties</h3>
							{#if userProperties.length > 0}
								<div class="space-y-4">
									{#each userProperties as property}
										<div
											class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-[#2D3748]"
										>
											<div class="flex-1">
												<div class="mb-2 flex items-center space-x-2">
													<span
														class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-200"
													>
														{property.status}
													</span>
													<span
														class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
													>
														{property.property_type}
													</span>
												</div>
												<p class="mb-1 font-medium text-gray-900 dark:text-white">
													{property.title}
												</p>
												<p class="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
												{#if property.deal_size}
													<p class="text-sm text-gray-500 dark:text-gray-400">
														${property.deal_size.toLocaleString()}
													</p>
												{/if}
											</div>
											<button
												on:click={() => handleEditProperty(property.property_uid)}
												class="ml-4 text-sm font-medium text-accent-purple hover:text-accent-purple/80"
											>
												Edit
											</button>
										</div>
									{/each}
								</div>
							{:else}
								<div class="py-12 text-center">
									<Building2 class="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p class="text-gray-500 dark:text-gray-400">
										No properties yet. Add your first property!
									</p>
									<button
										on:click={handleCreateProperty}
										class="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
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
