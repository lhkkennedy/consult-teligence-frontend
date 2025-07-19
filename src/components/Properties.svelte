<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Eye from '@lucide/svelte/icons/eye';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Search from '@lucide/svelte/icons/search';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import DollarSign from '@lucide/svelte/icons/dollar-sign';
	import Building from '@lucide/svelte/icons/building';
	import Target from '@lucide/svelte/icons/target';

	export let properties: any[] = [];
	export let stats: {
		total_gfa: number;
		total_aum: number;
		deal_count: number;
		avg_deal_size: number;
	} = { total_gfa: 0, total_aum: 0, deal_count: 0, avg_deal_size: 0 };
	export let loading: boolean = false;
	export let error: string = '';
	let sentinel;

	let searchQuery = '';
	let selectedRole = 'All';
	let selectedStatus = 'All';
	let selectedPropertyType = 'All';
	let sortBy = 'Most recent';

	// Filter options
	const roles = [
		'All',
		'Developer',
		'Asset Manager',
		'Legal Counsel',
		'Valuation',
		'Broker',
		'Investor'
	];
	const statuses = ['All', 'Under Construction', 'Stabilised', 'Exited', 'Planning'];
	const propertyTypes = ['All', 'Industrial', 'Office', 'Retail', 'Residential', 'Hospitality'];
	const sortOptions = ['Most recent', 'Deal size', 'IRR achieved', 'Construction completion %'];

	// Filter properties
	$: filteredProperties = properties.filter((property) => {
		const matchesRole = selectedRole === 'All' || property.roles.includes(selectedRole);
		const matchesStatus = selectedStatus === 'All' || property.status === selectedStatus;
		const matchesType =
			selectedPropertyType === 'All' || property.property_type === selectedPropertyType;
		const matchesSearch =
			!searchQuery ||
			property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			property.address.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesRole && matchesStatus && matchesType && matchesSearch;
	});

	// Sort properties
	$: sortedProperties = [...filteredProperties].sort((a, b) => {
		switch (sortBy) {
			case 'Deal size':
				return (b.deal_size || 0) - (a.deal_size || 0);
			case 'IRR achieved':
				return (b.irr || 0) - (a.irr || 0);
			case 'Construction completion %':
				return (b.completion_percentage || 0) - (a.completion_percentage || 0);
			default:
				return 0; // Most recent is already sorted
		}
	});

	// Format currency
	function formatCurrency(amount: number): string {
		if (amount >= 1000000) {
			return `$${(amount / 1000000).toFixed(1)}M`;
		}
		return `$${(amount / 1000).toFixed(0)}K`;
	}

	// Format GFA
	function formatGFA(sqft: number): string {
		if (sqft >= 1000000) {
			return `${(sqft / 1000000).toFixed(1)}M sq ft`;
		}
		return `${(sqft / 1000).toFixed(0)}K sq ft`;
	}

	// Get status color
	function getStatusColor(status: string): string {
		switch (status) {
			case 'Under Construction':
				return 'bg-blue-500/80 text-blue-200 border-blue-500';
			case 'Stabilised':
				return 'bg-green-500/80 text-green-200 border-green-500';
			case 'Exited':
				return 'bg-purple-500/80 text-purple-200 border-purple-500';
			case 'Planning':
				return 'bg-yellow-500/80 text-yellow-200 border-yellow-500';
			default:
				return 'bg-gray-500/80 text-gray-200 border-gray-500';
		}
	}
</script>

<div class="properties-container">
	<!-- Metrics Ribbon -->
	<div
		class="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-[#2D3748] dark:bg-[#1E2130]"
	>
		<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
			<div class="text-center">
				<div class="mb-2 flex items-center justify-center">
					<Building size={20} class="mr-2 text-blue-400" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]"
						>{formatGFA(stats.total_gfa)}</span
					>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Total GFA Delivered</p>
			</div>
			<div class="text-center">
				<div class="mb-2 flex items-center justify-center">
					<DollarSign size={20} class="mr-2 text-green-400" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]"
						>{formatCurrency(stats.total_aum)}</span
					>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Assets Under Mgmt</p>
			</div>
			<div class="text-center">
				<div class="mb-2 flex items-center justify-center">
					<Target size={20} class="mr-2 text-purple-400" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]"
						>{stats.deal_count}</span
					>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Closed Deals</p>
			</div>
			<div class="text-center">
				<div class="mb-2 flex items-center justify-center">
					<TrendingUp size={20} class="mr-2 text-yellow-400" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]"
						>{formatCurrency(stats.avg_deal_size)}</span
					>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Average Deal Size</p>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div
		class="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-[#2D3748] dark:bg-[#1E2130]"
	>
		<div
			class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-x-4 lg:space-y-0"
		>
			<!-- Search -->
			<div class="flex-1">
				<div class="relative">
					<Search
						size={18}
						class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-600 dark:text-[#A0AEC0]"
					/>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search properties..."
						class="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-[#E2E8F0]"
					/>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex flex-wrap gap-3">
				<select
					bind:value={selectedRole}
					class="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-[#E2E8F0]"
				>
					{#each roles as role}
						<option value={role}>{role}</option>
					{/each}
				</select>

				<select
					bind:value={selectedStatus}
					class="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-[#E2E8F0]"
				>
					{#each statuses as status}
						<option value={status}>{status}</option>
					{/each}
				</select>

				<select
					bind:value={selectedPropertyType}
					class="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-[#E2E8F0]"
				>
					{#each propertyTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>

				<select
					bind:value={sortBy}
					class="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:border-[#4A5568] dark:bg-[#2D3748] dark:text-[#E2E8F0]"
				>
					{#each sortOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Properties Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each sortedProperties as property}
			<div
				class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-accent-purple dark:border-[#2D3748] dark:bg-[#1E2130]"
			>
				<!-- Property Image -->
				<div class="relative h-48 bg-gray-100 dark:bg-[#2D3748]">
					<div>{property.media_urls}</div>
					{#if property.media_urls && property.media_urls.length > 0}
						{#if typeof property.media_urls[0] === 'string'}
							<img
								src={property.media_urls[0]}
								alt={property.title}
								class="h-full w-full object-cover"
							/>
						{:else if property.media_urls[0]?.url}
							<img
								src={property.media_urls[0].url}
								alt={property.title}
								class="h-full w-full object-cover"
							/>
						{/if}
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-[#2D3748]"
						>
							<Building size={48} class="text-[#A0AEC0] opacity-60" />
						</div>
					{/if}
					<div class="absolute right-3 top-3">
						<span class="rounded-full border px-2 py-1 text-xs {getStatusColor(property.status)}">
							{property.status}
						</span>
					</div>
				</div>

				<!-- Property Details -->
				<div class="flex flex-1 flex-col p-4">
					<div class="flex-1">
						<div class="mb-2 flex items-start justify-between">
							<div class="flex-1">
								<h3 class="mb-1 font-semibold text-gray-900 dark:text-[#E2E8F0]">
									{property.title}
								</h3>
								<div class="mb-2 flex items-center text-sm text-gray-600 dark:text-[#A0AEC0]">
									<MapPin size={14} class="mr-1" />
									<span>{property.address}</span>
								</div>
							</div>
						</div>

						<!-- Roles -->
						<div class="mb-3 flex flex-wrap gap-1">
							{#each Array.isArray(property.roles) ? property.roles : property.roles ? property.roles
											.split(',')
											.map((r) => r.trim()) : [] as role}
								<span
									class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-[#2D3748] dark:text-[#A0AEC0]"
								>
									{role}
								</span>
							{/each}
						</div>

						<!-- Headline Metric -->
						{#if property.headline_metric}
							<div class="mb-3">
								<span class="text-sm font-medium text-green-600 dark:text-green-400">
									{property.headline_metric}
								</span>
							</div>
						{/if}

						<!-- Additional Metrics -->
						<div class="mb-4 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-[#A0AEC0]">
							{#if property.deal_size}
								<div>Deal Size: {formatCurrency(property.deal_size)}</div>
							{/if}
							{#if property.irr}
								<div>IRR: {property.irr}%</div>
							{/if}
							{#if property.completion_percentage}
								<div>Completion: {property.completion_percentage}%</div>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div
						class="mt-auto flex items-center justify-between border-t border-gray-200 pt-4 dark:border-[#2D3748]"
					>
						<button
							class="flex items-center space-x-1 text-gray-600 transition-colors hover:text-accent-purple dark:text-[#A0AEC0] dark:hover:text-white"
						>
							<Eye size={16} />
							<span class="text-sm">View</span>
						</button>
						<button
							class="flex items-center space-x-1 text-gray-600 transition-colors hover:text-accent-purple dark:text-[#A0AEC0] dark:hover:text-white"
						>
							<MessageCircle size={16} />
							<span class="text-sm">Share</span>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if loading}
		<div class="py-4 text-center text-gray-500 dark:text-[#A0AEC0]">Loading...</div>
	{/if}
	{#if error}
		<div class="py-4 text-center text-red-500">{error}</div>
	{/if}
	{#if !loading && properties.length === 0}
		<div class="py-12 text-center text-gray-600 dark:text-[#A0AEC0]">No properties found.</div>
	{/if}
	<div bind:this={sentinel}></div>
</div>
