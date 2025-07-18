<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '../../../../lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Image, X, AlertCircle, CheckCircle, Trash2 } from '@lucide/svelte';
	import type { PostType, Sentiment, Visibility } from '../../../../lib/types';
	import { UserContentService } from '../../../../lib/services/userContentService';
	import { page } from '$app/stores';

	let formData = {
		body_md: '',
		post_type: 'Generic' as PostType,
		sentiment: 'Neutral' as Sentiment,
		visibility: 'Public' as Visibility,
		property_uid: '',
		media_urls: [] as string[]
	};

	let userProperties: any[] = [];
	let loading = true;
	let submitting = false;
	let deleting = false;
	let errors: Record<string, string> = {};
	let showPreview = false;
	let originalPost: any = null;

	const postTypes: { value: PostType; label: string; description: string }[] = [
		{ value: 'NewListing', label: 'New Listing', description: 'Announce a new property listing' },
		{ value: 'ProgressUpdate', label: 'Progress Update', description: 'Share construction or development progress' },
		{ value: 'Closing', label: 'Closing', description: 'Announce a successful deal closure' },
		{ value: 'Insight', label: 'Market Insight', description: 'Share market analysis or insights' },
		{ value: 'Generic', label: 'General Post', description: 'General update or announcement' }
	];

	const sentiments: { value: Sentiment; label: string; icon: string }[] = [
		{ value: 'Bull', label: 'Bullish', icon: '📈' },
		{ value: 'Bear', label: 'Bearish', icon: '📉' },
		{ value: 'Neutral', label: 'Neutral', icon: '➡️' }
	];

	const visibilityOptions: { value: Visibility; label: string; description: string }[] = [
		{ value: 'Public', label: 'Public', description: 'Visible to everyone' },
		{ value: 'Connections', label: 'Connections Only', description: 'Visible to your connections' },
		{ value: 'Private', label: 'Private', description: 'Only visible to you' }
	];

	onMount(async () => {
		// Check if user is authenticated
		if (!$user) {
			goto('/login');
			return;
		}

		// Load post data and user properties
		await Promise.all([
			loadPostData(),
			loadUserProperties()
		]);
		
		loading = false;
	});

	async function loadPostData() {
		try {
			const postId = $page.params.postId;
			originalPost = await UserContentService.getPostById(postId);
			
			if (!originalPost) {
				goto('/dashboard');
				return;
			}

			// Populate form with existing data
			formData = {
				body_md: originalPost.body_md,
				post_type: originalPost.post_type,
				sentiment: originalPost.sentiment,
				visibility: originalPost.visibility,
				property_uid: originalPost.property_uid || '',
				media_urls: [...originalPost.media_urls]
			};
		} catch (error) {
			console.error('Error loading post:', error);
			goto('/dashboard');
		}
	}

	async function loadUserProperties() {
		try {
			userProperties = await UserContentService.getUserProperties();
		} catch (error) {
			console.error('Error loading user properties:', error);
			userProperties = [];
		}
	}

	function validateForm(): boolean {
		const validation = UserContentService.validatePostData(formData);
		errors = validation.errors;
		return validation.isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		submitting = true;

		try {
			const postId = $page.params.postId;
			await UserContentService.updatePost(postId, formData);

			// Redirect to dashboard
			goto('/dashboard?tab=posts');
		} catch (error) {
			console.error('Error updating post:', error);
			errors.submit = 'Failed to update post. Please try again.';
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
			return;
		}

		deleting = true;

		try {
			const postId = $page.params.postId;
			await UserContentService.deletePost(postId);

			// Redirect to dashboard
			goto('/dashboard?tab=posts');
		} catch (error) {
			console.error('Error deleting post:', error);
			errors.submit = 'Failed to delete post. Please try again.';
		} finally {
			deleting = false;
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (files && files.length > 0) {
			Array.from(files).forEach(file => {
				const mockUrl = URL.createObjectURL(file);
				formData.media_urls = [...formData.media_urls, mockUrl];
			});
		}
	}

	function removeImage(index: number) {
		formData.media_urls = formData.media_urls.filter((_, i) => i !== index);
	}

	function formatBody(body: string): string {
		return body
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/\n/g, '<br>');
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-[#0F1419]">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center space-x-4 mb-4">
				<button
					on:click={() => goto('/dashboard')}
					class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
				>
					<ArrowLeft class="h-5 w-5" />
					<span>Back to Dashboard</span>
				</button>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">Update your post content and settings</p>
				</div>
				<button
					on:click={handleDelete}
					disabled={deleting}
					class="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
				>
					<Trash2 class="h-4 w-4" />
					<span>{deleting ? 'Deleting...' : 'Delete Post'}</span>
				</button>
			</div>
		</div>

		{#if loading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Form -->
				<div class="lg:col-span-2">
					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<!-- Post Type -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Post Type
							</label>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{#each postTypes as type}
									<label class="relative">
										<input
											type="radio"
											bind:group={formData.post_type}
											value={type.value}
											class="sr-only"
										/>
										<div class="cursor-pointer p-4 border-2 rounded-lg transition-colors {formData.post_type === type.value ? 'border-accent-purple bg-accent-purple/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}">
											<div class="font-medium text-gray-900 dark:text-white">{type.label}</div>
											<div class="text-sm text-gray-500 dark:text-gray-400">{type.description}</div>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Content -->
						<div>
							<label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Post Content
							</label>
							<textarea
								id="content"
								bind:value={formData.body_md}
								rows="6"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.body_md ? 'border-red-500' : ''}"
								placeholder="Share your thoughts, updates, or insights... Use **bold** and *italic* for formatting."
							></textarea>
							{#if errors.body_md}
								<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
									<AlertCircle class="h-4 w-4 mr-1" />
									<span class="text-sm">{errors.body_md}</span>
								</div>
							{/if}
							<div class="flex justify-between items-center mt-2">
								<div class="text-sm text-gray-500 dark:text-gray-400">
									{formData.body_md.length}/1000 characters
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">
									Supports **bold** and *italic* formatting
								</div>
							</div>
						</div>

						<!-- Sentiment -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Market Sentiment
							</label>
							<div class="flex space-x-4">
								{#each sentiments as sentiment}
									<label class="flex items-center space-x-2 cursor-pointer">
										<input
											type="radio"
											bind:group={formData.sentiment}
											value={sentiment.value}
											class="text-accent-purple focus:ring-accent-purple"
										/>
										<span class="text-lg">{sentiment.icon}</span>
										<span class="text-sm text-gray-700 dark:text-gray-300">{sentiment.label}</span>
									</label>
								{/each}
							</div>
						</div>

						<!-- Property Attachment -->
						{#if userProperties.length > 0}
							<div>
								<label for="property" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Attach Property (Optional)
								</label>
								<select
									id="property"
									bind:value={formData.property_uid}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white"
								>
									<option value="">Select a property...</option>
									{#each userProperties as property}
										<option value={property.property_uid}>
											{property.title} - {property.address}
										</option>
									{/each}
								</select>
							</div>
						{/if}

						<!-- Media Upload -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Add Images (Optional)
							</label>
							<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
								<Image class="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<input
									type="file"
									accept="image/*"
									multiple
									on:change={handleImageUpload}
									class="hidden"
									id="image-upload"
								/>
								<label
									for="image-upload"
									class="cursor-pointer text-accent-purple hover:text-accent-purple/80 font-medium"
								>
									Click to upload images
								</label>
								<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
									PNG, JPG, GIF up to 10MB each
								</p>
							</div>
						</div>

						<!-- Media Preview -->
						{#if formData.media_urls.length > 0}
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Current Images
								</label>
								<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
									{#each formData.media_urls as url, index}
										<div class="relative">
											<img
												src={url}
												alt="Post image"
												class="w-full h-32 object-cover rounded-lg"
											/>
											<button
												type="button"
												on:click={() => removeImage(index)}
												class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
											>
												<X class="h-4 w-4" />
											</button>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Visibility -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Visibility
							</label>
							<div class="space-y-3">
								{#each visibilityOptions as option}
									<label class="flex items-start space-x-3 cursor-pointer">
										<input
											type="radio"
											bind:group={formData.visibility}
											value={option.value}
											class="mt-1 text-accent-purple focus:ring-accent-purple"
										/>
										<div>
											<div class="text-sm font-medium text-gray-900 dark:text-white">
												{option.label}
											</div>
											<div class="text-sm text-gray-500 dark:text-gray-400">
												{option.description}
											</div>
										</div>
									</label>
								{/each}
							</div>
						</div>

						<!-- Submit Error -->
						{#if errors.submit}
							<div class="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
								<AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
								<span class="text-red-600 dark:text-red-400">{errors.submit}</span>
							</div>
						{/if}

						<!-- Submit Button -->
						<div class="flex space-x-4">
							<button
								type="submit"
								disabled={submitting}
								class="flex-1 bg-accent-purple text-white py-3 px-6 rounded-lg hover:bg-accent-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{#if submitting}
									<div class="flex items-center justify-center">
										<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Updating Post...
									</div>
								{:else}
									Update Post
								{/if}
							</button>
							<button
								type="button"
								on:click={() => showPreview = !showPreview}
								class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
							>
								{showPreview ? 'Hide' : 'Show'} Preview
							</button>
						</div>
					</form>
				</div>

				<!-- Preview Sidebar -->
				<div class="lg:col-span-1">
					<div class="sticky top-8">
						{#if showPreview}
							<div class="bg-white dark:bg-[#1E2130] rounded-lg shadow-sm p-6">
								<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
								<div class="space-y-4">
									<!-- Post Header -->
									<div class="flex items-center space-x-3">
										<div class="w-10 h-10 bg-gray-200 dark:bg-[#2D3748] rounded-full flex items-center justify-center">
											<span class="text-sm font-semibold text-gray-700 dark:text-white">
												{$user?.username?.charAt(0) || 'U'}
											</span>
										</div>
										<div>
											<div class="font-semibold text-gray-900 dark:text-white">
												{$user?.username || 'User'}
											</div>
											<div class="text-sm text-gray-500 dark:text-gray-400">Just now</div>
										</div>
									</div>

									<!-- Post Type and Sentiment -->
									<div class="flex items-center space-x-2">
										<span class="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
											{formData.post_type.replace(/([A-Z])/g, ' $1').trim()}
										</span>
										<span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
											{formData.sentiment}
										</span>
									</div>

									<!-- Post Content -->
									{#if formData.body_md}
										<div class="text-gray-900 dark:text-white leading-relaxed">
											{@html formatBody(formData.body_md)}
										</div>
									{:else}
										<div class="text-gray-400 dark:text-gray-500 italic">
											Your post content will appear here...
										</div>
									{/if}

									<!-- Media Preview -->
									{#if formData.media_urls.length > 0}
										<div class="grid grid-cols-2 gap-2">
											{#each formData.media_urls.slice(0, 4) as url}
												<img
													src={url}
													alt="Preview"
													class="w-full h-20 object-cover rounded-lg"
												/>
											{/each}
										</div>
									{/if}

									<!-- Property Attachment Preview -->
									{#if formData.property_uid}
										{@const property = userProperties.find(p => p.property_uid === formData.property_uid)}
										{#if property}
											<div class="bg-gray-100 dark:bg-[#2D3748] rounded-lg p-3">
												<div class="font-medium text-sm text-gray-900 dark:text-white">
													{property.title}
												</div>
												<div class="text-sm text-gray-500 dark:text-gray-400">
													{property.address}
												</div>
											</div>
										{/if}
									{/if}
								</div>
							</div>
						{:else}
							<div class="bg-white dark:bg-[#1E2130] rounded-lg shadow-sm p-6">
								<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips</h3>
								<div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
									<div class="flex items-start space-x-2">
										<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Use **bold** and *italic* for emphasis</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Attach properties to provide context</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Choose the right sentiment for market context</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
										<span>Add images to make your posts more engaging</span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>