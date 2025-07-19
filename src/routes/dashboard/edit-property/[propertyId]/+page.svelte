<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '../../../../lib/stores/authStore';
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		Image,
		X,
		AlertCircle,
		CheckCircle,
		Trash2,
		MapPin,
		DollarSign,
		Percent
	} from '@lucide/svelte';
	import { UserContentService } from '../../../../lib/services/userContentService';
	import { page } from '$app/stores';

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

	let loading = true;
	let submitting = false;
	let deleting = false;
	let errors: Record<string, string> = {};
	let showPreview = false;
	let originalProperty: any = null;

	const propertyTypes = [
		'Office',
		'Retail',
		'Industrial',
		'Residential',
		'Hotel',
		'Mixed Use',
		'Land',
		'Other'
	];

	const statusOptions = [
		{ value: 'Planning', label: 'Planning', description: 'In planning phase' },
		{
			value: 'Under Construction',
			label: 'Under Construction',
			description: 'Currently being built'
		},
		{ value: 'Stabilised', label: 'Stabilised', description: 'Completed and operational' },
		{ value: 'Exited', label: 'Exited', description: 'Sold or disposed' }
	];

	const roleOptions = [
		'Developer',
		'Investor',
		'Manager',
		'Broker',
		'Consultant',
		'Contractor',
		'Architect',
		'Engineer'
	];

	onMount(async () => {
		// Check if user is authenticated
		if (!$user) {
			goto('/login');
			return;
		}

		// Load property data
		await loadPropertyData();
		loading = false;
	});

	async function loadPropertyData() {
		try {
			const propertyId = $page.params.propertyId;
			originalProperty = await UserContentService.getPropertyById(propertyId);

			if (!originalProperty) {
				goto('/dashboard');
				return;
			}

			// Populate form with existing data
			formData = {
				title: originalProperty.title,
				address: originalProperty.address,
				property_type: originalProperty.property_type,
				status: originalProperty.status,
				deal_size: originalProperty.deal_size?.toString() || '',
				irr: originalProperty.irr?.toString() || '',
				completion_percentage: originalProperty.completion_percentage?.toString() || '',
				headline_metric: originalProperty.headline_metric || '',
				roles: [...originalProperty.roles],
				images: [...originalProperty.images]
			};
		} catch (error) {
			console.error('Error loading property:', error);
			goto('/dashboard');
		}
	}

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
			const propertyId = $page.params.propertyId;
			const propertyData = {
				...formData,
				deal_size: formData.deal_size ? Number(formData.deal_size) : undefined,
				irr: formData.irr ? Number(formData.irr) : undefined,
				completion_percentage: formData.completion_percentage
					? Number(formData.completion_percentage)
					: undefined
			};

			await UserContentService.updateProperty(propertyId, propertyData);

			// Redirect to dashboard
			goto('/dashboard?tab=properties');
		} catch (error) {
			console.error('Error updating property:', error);
			errors.submit = 'Failed to update property. Please try again.';
		} finally {
			submitting = false;
		}
	}

	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
			return;
		}

		deleting = true;

		try {
			const propertyId = $page.params.propertyId;
			await UserContentService.deleteProperty(propertyId);

			// Redirect to dashboard
			goto('/dashboard?tab=properties');
		} catch (error) {
			console.error('Error deleting property:', error);
			errors.submit = 'Failed to delete property. Please try again.';
		} finally {
			deleting = false;
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (files && files.length > 0) {
			Array.from(files).forEach((file) => {
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
			formData.roles = formData.roles.filter((r) => r !== role);
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
	<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="mb-4 flex items-center space-x-4">
				<button
					on:click={() => goto('/dashboard')}
					class="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
				>
					<ArrowLeft class="h-5 w-5" />
					<span>Back to Dashboard</span>
				</button>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Property</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">Update your property information</p>
				</div>
				<button
					on:click={handleDelete}
					disabled={deleting}
					class="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
				>
					<Trash2 class="h-4 w-4" />
					<span>{deleting ? 'Deleting...' : 'Delete Property'}</span>
				</button>
			</div>
		</div>

		{#if loading}
			<div class="flex h-64 items-center justify-center">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-accent-purple"></div>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- Form -->
				<div class="lg:col-span-2">
					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<!-- Basic Information -->
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
								Basic Information
							</h3>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<!-- Property Title -->
								<div class="md:col-span-2">
									<label
										for="title"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Property Title *
									</label>
									<input
										id="title"
										type="text"
										bind:value={formData.title}
										class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400 {errors.title
											? 'border-red-500'
											: ''}"
										placeholder="e.g., Downtown Office Complex"
									/>
									{#if errors.title}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.title}</span>
										</div>
									{/if}
								</div>

								<!-- Address -->
								<div class="md:col-span-2">
									<label
										for="address"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Address *
									</label>
									<div class="relative">
										<MapPin
											class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
										/>
										<input
											id="address"
											type="text"
											bind:value={formData.address}
											class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400 {errors.address
												? 'border-red-500'
												: ''}"
											placeholder="e.g., 123 Main Street, Downtown, City, State 12345"
										/>
									</div>
									{#if errors.address}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.address}</span>
										</div>
									{/if}
								</div>

								<!-- Property Type -->
								<div>
									<label
										for="property_type"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Property Type *
									</label>
									<select
										id="property_type"
										bind:value={formData.property_type}
										class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white {errors.property_type
											? 'border-red-500'
											: ''}"
									>
										<option value="">Select property type...</option>
										{#each propertyTypes as type}
											<option value={type}>{type}</option>
										{/each}
									</select>
									{#if errors.property_type}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.property_type}</span>
										</div>
									{/if}
								</div>

								<!-- Status -->
								<div>
									<label
										for="status"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Status
									</label>
									<select
										id="status"
										bind:value={formData.status}
										class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white"
									>
										{#each statusOptions as status}
											<option value={status.value}>{status.label}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						<!-- Financial Information -->
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
								Financial Information
							</h3>

							<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
								<!-- Deal Size -->
								<div>
									<label
										for="deal_size"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Deal Size
									</label>
									<div class="relative">
										<DollarSign
											class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
										/>
										<input
											id="deal_size"
											type="text"
											bind:value={formData.deal_size}
											class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400 {errors.deal_size
												? 'border-red-500'
												: ''}"
											placeholder="e.g., 5000000"
										/>
									</div>
									{#if errors.deal_size}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.deal_size}</span>
										</div>
									{/if}
									{#if formData.deal_size && !errors.deal_size}
										<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
											{formatCurrency(formData.deal_size)}
										</p>
									{/if}
								</div>

								<!-- IRR -->
								<div>
									<label
										for="irr"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										IRR (%)
									</label>
									<div class="relative">
										<Percent
											class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
										/>
										<input
											id="irr"
											type="number"
											step="0.1"
											min="0"
											max="100"
											bind:value={formData.irr}
											class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400 {errors.irr
												? 'border-red-500'
												: ''}"
											placeholder="e.g., 12.5"
										/>
									</div>
									{#if errors.irr}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.irr}</span>
										</div>
									{/if}
								</div>

								<!-- Completion Percentage -->
								<div>
									<label
										for="completion_percentage"
										class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Completion (%)
									</label>
									<div class="relative">
										<Percent
											class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
										/>
										<input
											id="completion_percentage"
											type="number"
											step="1"
											min="0"
											max="100"
											bind:value={formData.completion_percentage}
											class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400 {errors.completion_percentage
												? 'border-red-500'
												: ''}"
											placeholder="e.g., 75"
										/>
									</div>
									{#if errors.completion_percentage}
										<div class="mt-2 flex items-center text-red-600 dark:text-red-400">
											<AlertCircle class="mr-1 h-4 w-4" />
											<span class="text-sm">{errors.completion_percentage}</span>
										</div>
									{/if}
								</div>
							</div>

							<!-- Headline Metric -->
							<div class="mt-6">
								<label
									for="headline_metric"
									class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Headline Metric
								</label>
								<input
									id="headline_metric"
									type="text"
									bind:value={formData.headline_metric}
									class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#1E2130] dark:text-white dark:placeholder-gray-400"
									placeholder="e.g., 95% leased, $50/sqft NNN"
								/>
							</div>
						</div>

						<!-- Roles -->
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Your Role *</h3>
							<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
								{#each roleOptions as role}
									<label class="relative">
										<input
											type="checkbox"
											checked={formData.roles.includes(role)}
											on:change={() => toggleRole(role)}
											class="sr-only"
										/>
										<div
											class="cursor-pointer rounded-lg border-2 p-3 text-center transition-colors {formData.roles.includes(
												role
											)
												? 'border-accent-purple bg-accent-purple/5 text-accent-purple'
												: 'border-gray-200 hover:border-gray-300 dark:border-gray-700'}"
										>
											<div class="text-sm font-medium">{role}</div>
										</div>
									</label>
								{/each}
							</div>
							{#if errors.roles}
								<div class="mt-3 flex items-center text-red-600 dark:text-red-400">
									<AlertCircle class="mr-1 h-4 w-4" />
									<span class="text-sm">{errors.roles}</span>
								</div>
							{/if}
						</div>

						<!-- Images -->
						<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
							<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
								Property Images
							</h3>

							<div
								class="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-600"
							>
								<Image class="mx-auto mb-4 h-12 w-12 text-gray-400" />
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
									class="cursor-pointer font-medium text-accent-purple hover:text-accent-purple/80"
								>
									Click to upload images
								</label>
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
									PNG, JPG, GIF up to 10MB each
								</p>
							</div>

							{#if formData.images.length > 0}
								<div class="mt-6">
									<label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
										Current Images
									</label>
									<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
										{#each formData.images as url, index}
											<div class="relative">
												<img
													src={url}
													alt="Property image"
													class="h-32 w-full rounded-lg object-cover"
												/>
												<button
													type="button"
													on:click={() => removeImage(index)}
													class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
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
							<div
								class="flex items-center rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
							>
								<AlertCircle class="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
								<span class="text-red-600 dark:text-red-400">{errors.submit}</span>
							</div>
						{/if}

						<!-- Submit Button -->
						<div class="flex space-x-4">
							<button
								type="submit"
								disabled={submitting}
								class="flex-1 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{#if submitting}
									<div class="flex items-center justify-center">
										<div
											class="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"
										></div>
										Updating Property...
									</div>
								{:else}
									Update Property
								{/if}
							</button>
							<button
								type="button"
								on:click={() => (showPreview = !showPreview)}
								class="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
							<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
								<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Preview</h3>
								<div class="space-y-4">
									<!-- Property Image -->
									{#if formData.images.length > 0}
										<img
											src={formData.images[0]}
											alt="Property preview"
											class="h-48 w-full rounded-lg object-cover"
										/>
									{:else}
										<div
											class="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700"
										>
											<Image class="h-12 w-12 text-gray-400" />
										</div>
									{/if}

									<!-- Property Info -->
									<div>
										<h4 class="text-lg font-semibold text-gray-900 dark:text-white">
											{formData.title || 'Property Title'}
										</h4>
										<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
											{formData.address || 'Property Address'}
										</p>
									</div>

									<!-- Status and Type -->
									<div class="flex items-center space-x-2">
										<span
											class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-200"
										>
											{formData.status}
										</span>
										<span
											class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
										>
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
											<div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Your Roles:
											</div>
											<div class="flex flex-wrap gap-2">
												{#each formData.roles as role}
													<span
														class="rounded-full bg-accent-purple/10 px-2 py-1 text-xs text-accent-purple"
													>
														{role}
													</span>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{:else}
							<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-[#1E2130]">
								<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Tips</h3>
								<div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
									<div class="flex items-start space-x-2">
										<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
										<span>Add high-quality images to showcase your property</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
										<span>Include accurate financial metrics for credibility</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
										<span>Select all relevant roles to show your involvement</span>
									</div>
									<div class="flex items-start space-x-2">
										<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
										<span>Keep the headline metric concise and impactful</span>
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
