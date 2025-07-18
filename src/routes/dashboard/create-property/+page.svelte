<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '../../../lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Image, X, AlertCircle, CheckCircle, MapPin, DollarSign, Percent, Users } from '@lucide/svelte';
	import { UserContentService } from '../../../lib/services/userContentService';

	let formData = {
		title: '',
		address: '',
		property_type: '',
		status: 'Planning' as 'Under Construction' | 'Stabilised' | 'Exited' | 'Planning',
		deal_size: '',
		irr: '',
		completion_percentage: '',
		headline_metric: '',
		roles: [] as string[],
		images: [] as string[]
	};

	let loading = false;
	let submitting = false;
	let errors: Record<string, string> = {};
	let showPreview = false;

	const propertyTypes = [
		'Office', 'Retail', 'Industrial', 'Residential', 'Hotel', 'Mixed Use', 'Land', 'Other'
	];

	const statusOptions = [
		{ value: 'Planning', label: 'Planning', description: 'In planning phase' },
		{ value: 'Under Construction', label: 'Under Construction', description: 'Currently being built' },
		{ value: 'Stabilised', label: 'Stabilised', description: 'Completed and operational' },
		{ value: 'Exited', label: 'Exited', description: 'Sold or disposed' }
	];

	const roleOptions = [
		'Developer', 'Investor', 'Manager', 'Broker', 'Consultant', 'Contractor', 'Architect', 'Engineer'
	];

	onMount(() => {
		// Check if user is authenticated
		if (!$user) {
			goto('/login');
			return;
		}
	});

	function validateForm(): boolean {
		const validation = UserContentService.validatePropertyData(formData);
		errors = validation.errors;
		return validation.isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}

		submitting = true;

		try {
			// Prepare property data
			const propertyData = {
				...formData,
				deal_size: formData.deal_size ? Number(formData.deal_size) : undefined,
				irr: formData.irr ? Number(formData.irr) : undefined,
				completion_percentage: formData.completion_percentage ? Number(formData.completion_percentage) : undefined
			};

			// Create property using the service
			await UserContentService.createProperty(propertyData);

			// Redirect to dashboard
			goto('/dashboard?tab=properties');
		} catch (error) {
			console.error('Error creating property:', error);
			errors.submit = 'Failed to create property. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (files && files.length > 0) {
			// In a real app, you would upload to your server/cloud storage
			// For now, we'll create mock URLs
			Array.from(files).forEach(file => {
				const mockUrl = URL.createObjectURL(file);
				formData.images = [...formData.images, mockUrl];
			});
		}
	}

	function removeImage(index: number) {
		formData.images = formData.images.filter((_, i) => i !== index);
	}

	function toggleRole(role: string) {
		if (formData.roles.includes(role)) {
			formData.roles = formData.roles.filter(r => r !== role);
		} else {
			formData.roles = [...formData.roles, role];
		}
	}

	function formatCurrency(amount: string): string {
		if (!amount) return '';
		const num = Number(amount);
		if (isNaN(num)) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(num);
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
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Add New Property</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">Create a new property listing for your portfolio</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Form -->
			<div class="lg:col-span-2">
				<form on:submit|preventDefault={handleSubmit} class="space-y-6">
					<!-- Basic Information -->
					<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Property Title -->
							<div class="md:col-span-2">
								<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Property Title *
								</label>
								<input
									id="title"
									type="text"
									bind:value={formData.title}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.title ? 'border-red-500' : ''}"
									placeholder="e.g., Downtown Office Complex"
								/>
								{#if errors.title}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.title}</span>
									</div>
								{/if}
							</div>

							<!-- Address -->
							<div class="md:col-span-2">
								<label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Address *
								</label>
								<div class="relative">
									<MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="address"
										type="text"
										bind:value={formData.address}
										class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.address ? 'border-red-500' : ''}"
										placeholder="e.g., 123 Main Street, Downtown, City, State 12345"
									/>
								</div>
								{#if errors.address}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.address}</span>
									</div>
								{/if}
							</div>

							<!-- Property Type -->
							<div>
								<label for="property_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Property Type *
								</label>
								<select
									id="property_type"
									bind:value={formData.property_type}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white {errors.property_type ? 'border-red-500' : ''}"
								>
									<option value="">Select property type...</option>
									{#each propertyTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
								{#if errors.property_type}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.property_type}</span>
									</div>
								{/if}
							</div>

							<!-- Status -->
							<div>
								<label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Status
								</label>
								<select
									id="status"
									bind:value={formData.status}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white"
								>
									{#each statusOptions as status}
										<option value={status.value}>{status.label}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>

					<!-- Financial Information -->
					<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Financial Information</h3>
						
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<!-- Deal Size -->
							<div>
								<label for="deal_size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Deal Size
								</label>
								<div class="relative">
									<DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="deal_size"
										type="text"
										bind:value={formData.deal_size}
										class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.deal_size ? 'border-red-500' : ''}"
										placeholder="e.g., 5000000"
									/>
								</div>
								{#if errors.deal_size}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.deal_size}</span>
									</div>
								{/if}
								{#if formData.deal_size && !errors.deal_size}
									<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
										{formatCurrency(formData.deal_size)}
									</p>
								{/if}
							</div>

							<!-- IRR -->
							<div>
								<label for="irr" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									IRR (%)
								</label>
								<div class="relative">
									<Percent class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="irr"
										type="number"
										step="0.1"
										min="0"
										max="100"
										bind:value={formData.irr}
										class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.irr ? 'border-red-500' : ''}"
										placeholder="e.g., 12.5"
									/>
								</div>
								{#if errors.irr}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.irr}</span>
									</div>
								{/if}
							</div>

							<!-- Completion Percentage -->
							<div>
								<label for="completion_percentage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Completion (%)
								</label>
								<div class="relative">
									<Percent class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="completion_percentage"
										type="number"
										step="1"
										min="0"
										max="100"
										bind:value={formData.completion_percentage}
										class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 {errors.completion_percentage ? 'border-red-500' : ''}"
										placeholder="e.g., 75"
									/>
								</div>
								{#if errors.completion_percentage}
									<div class="flex items-center mt-2 text-red-600 dark:text-red-400">
										<AlertCircle class="h-4 w-4 mr-1" />
										<span class="text-sm">{errors.completion_percentage}</span>
									</div>
								{/if}
							</div>
						</div>

						<!-- Headline Metric -->
						<div class="mt-6">
							<label for="headline_metric" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Headline Metric
							</label>
							<input
								id="headline_metric"
								type="text"
								bind:value={formData.headline_metric}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-transparent bg-white dark:bg-[#1E2130] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
								placeholder="e.g., 95% leased, $50/sqft NNN"
							/>
						</div>
					</div>

					<!-- Roles -->
					<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Role *</h3>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
							{#each roleOptions as role}
								<label class="relative">
									<input
										type="checkbox"
										checked={formData.roles.includes(role)}
										on:change={() => toggleRole(role)}
										class="sr-only"
									/>
									<div class="cursor-pointer p-3 border-2 rounded-lg transition-colors text-center {formData.roles.includes(role) ? 'border-accent-purple bg-accent-purple/5 text-accent-purple' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}">
										<div class="text-sm font-medium">{role}</div>
									</div>
								</label>
							{/each}
						</div>
						{#if errors.roles}
							<div class="flex items-center mt-3 text-red-600 dark:text-red-400">
								<AlertCircle class="h-4 w-4 mr-1" />
								<span class="text-sm">{errors.roles}</span>
							</div>
						{/if}
					</div>

					<!-- Images -->
					<div class="bg-white dark:bg-[#1E2130] rounded-lg p-6 shadow-sm">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Property Images</h3>
						
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

						{#if formData.images.length > 0}
							<div class="mt-6">
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Uploaded Images
								</label>
								<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
									{#each formData.images as url, index}
										<div class="relative">
											<img
												src={url}
												alt="Property image"
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
							class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{#if submitting}
								<div class="flex items-center justify-center">
									<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Creating Property...
								</div>
							{:else}
								Create Property
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
								<!-- Property Image -->
								{#if formData.images.length > 0}
									<img
										src={formData.images[0]}
										alt="Property preview"
										class="w-full h-48 object-cover rounded-lg"
									/>
								{:else}
									<div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
										<Image class="h-12 w-12 text-gray-400" />
									</div>
								{/if}

								<!-- Property Info -->
								<div>
									<h4 class="font-semibold text-gray-900 dark:text-white text-lg">
										{formData.title || 'Property Title'}
									</h4>
									<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
										{formData.address || 'Property Address'}
									</p>
								</div>

								<!-- Status and Type -->
								<div class="flex items-center space-x-2">
									<span class="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
										{formData.status}
									</span>
									<span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
										{formData.property_type || 'Type'}
									</span>
								</div>

								<!-- Financial Info -->
								{#if formData.deal_size || formData.irr || formData.completion_percentage}
									<div class="space-y-2">
										{#if formData.deal_size}
											<div class="flex justify-between text-sm">
												<span class="text-gray-500 dark:text-gray-400">Deal Size:</span>
												<span class="font-medium text-gray-900 dark:text-white">
													{formatCurrency(formData.deal_size)}
												</span>
											</div>
										{/if}
										{#if formData.irr}
											<div class="flex justify-between text-sm">
												<span class="text-gray-500 dark:text-gray-400">IRR:</span>
												<span class="font-medium text-gray-900 dark:text-white">
													{formData.irr}%
												</span>
											</div>
										{/if}
										{#if formData.completion_percentage}
											<div class="flex justify-between text-sm">
												<span class="text-gray-500 dark:text-gray-400">Completion:</span>
												<span class="font-medium text-gray-900 dark:text-white">
													{formData.completion_percentage}%
												</span>
											</div>
										{/if}
									</div>
								{/if}

								<!-- Roles -->
								{#if formData.roles.length > 0}
									<div>
										<div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Roles:</div>
										<div class="flex flex-wrap gap-2">
											{#each formData.roles as role}
												<span class="text-xs bg-accent-purple/10 text-accent-purple px-2 py-1 rounded-full">
													{role}
												</span>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<div class="bg-white dark:bg-[#1E2130] rounded-lg shadow-sm p-6">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips</h3>
							<div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
								<div class="flex items-start space-x-2">
									<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
									<span>Add high-quality images to showcase your property</span>
								</div>
								<div class="flex items-start space-x-2">
									<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
									<span>Include accurate financial metrics for credibility</span>
								</div>
								<div class="flex items-start space-x-2">
									<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
									<span>Select all relevant roles to show your involvement</span>
								</div>
								<div class="flex items-start space-x-2">
									<CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
									<span>Keep the headline metric concise and impactful</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>