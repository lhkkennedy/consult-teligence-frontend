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
		total_gfa: number,
		total_aum: number,
		deal_count: number,
		avg_deal_size: number
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
	const roles = ['All', 'Developer', 'Asset Manager', 'Legal Counsel', 'Valuation', 'Broker', 'Investor'];
	const statuses = ['All', 'Under Construction', 'Stabilised', 'Exited', 'Planning'];
	const propertyTypes = ['All', 'Industrial', 'Office', 'Retail', 'Residential', 'Hospitality'];
	const sortOptions = ['Most recent', 'Deal size', 'IRR achieved', 'Construction completion %'];

	// Filter properties
	$: filteredProperties = properties.filter(property => {
		const matchesRole = selectedRole === 'All' || property.roles.includes(selectedRole);
		const matchesStatus = selectedStatus === 'All' || property.status === selectedStatus;
		const matchesType = selectedPropertyType === 'All' || property.property_type === selectedPropertyType;
		const matchesSearch = !searchQuery || 
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
	<div class="bg-white dark:bg-[#1E2130] border border-gray-200 dark:border-[#2D3748] rounded-lg p-6 mb-6">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			<div class="text-center">
				<div class="flex items-center justify-center mb-2">
					<Building size={20} class="text-blue-400 mr-2" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]">{formatGFA(stats.total_gfa)}</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Total GFA Delivered</p>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center mb-2">
					<DollarSign size={20} class="text-green-400 mr-2" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]">{formatCurrency(stats.total_aum)}</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Assets Under Mgmt</p>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center mb-2">
					<Target size={20} class="text-purple-400 mr-2" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]">{stats.deal_count}</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Closed Deals</p>
			</div>
			<div class="text-center">
				<div class="flex items-center justify-center mb-2">
					<TrendingUp size={20} class="text-yellow-400 mr-2" />
					<span class="text-2xl font-bold text-gray-900 dark:text-[#E2E8F0]">{formatCurrency(stats.avg_deal_size)}</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-[#A0AEC0]">Average Deal Size</p>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white dark:bg-[#1E2130] border border-gray-200 dark:border-[#2D3748] rounded-lg p-6 mb-6">
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
			<!-- Search -->
			<div class="flex-1">
				<div class="relative">
					<Search size={18} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-[#A0AEC0]" />
					<input 
						type="text"
						bind:value={searchQuery}
						placeholder="Search properties..."
						class="w-full bg-gray-100 dark:bg-[#2D3748] border border-gray-300 dark:border-[#4A5568] rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-[#E2E8F0]"
					/>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex flex-wrap gap-3">
				<select 
					bind:value={selectedRole}
					class="bg-gray-100 dark:bg-[#2D3748] border border-gray-300 dark:border-[#4A5568] rounded-lg px-3 py-2 text-gray-900 dark:text-[#E2E8F0] text-sm"
				>
					{#each roles as role}
						<option value={role}>{role}</option>
					{/each}
				</select>

				<select 
					bind:value={selectedStatus}
					class="bg-gray-100 dark:bg-[#2D3748] border border-gray-300 dark:border-[#4A5568] rounded-lg px-3 py-2 text-gray-900 dark:text-[#E2E8F0] text-sm"
				>
					{#each statuses as status}
						<option value={status}>{status}</option>
					{/each}
				</select>

				<select 
					bind:value={selectedPropertyType}
					class="bg-gray-100 dark:bg-[#2D3748] border border-gray-300 dark:border-[#4A5568] rounded-lg px-3 py-2 text-gray-900 dark:text-[#E2E8F0] text-sm"
				>
					{#each propertyTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>

				<select 
					bind:value={sortBy}
					class="bg-gray-100 dark:bg-[#2D3748] border border-gray-300 dark:border-[#4A5568] rounded-lg px-3 py-2 text-gray-900 dark:text-[#E2E8F0] text-sm"
				>
					{#each sortOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Properties Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each sortedProperties as property}
			<div class="bg-white dark:bg-[#1E2130] border border-gray-200 dark:border-[#2D3748] rounded-lg overflow-hidden hover:border-accent-purple transition-colors flex flex-col h-full">
				<!-- Property Image -->
				<div class="relative h-48 bg-gray-100 dark:bg-[#2D3748]">
					{#if property.media_urls && property.media_urls.length > 0}
						{#if typeof property.media_urls[0] === 'string'}
							<img src={property.media_urls[0]} alt={property.title} class="w-full h-full object-cover" />
						{:else if property.media_urls[0]?.url}
							<img src={property.media_urls[0].url} alt={property.title} class="w-full h-full object-cover" />
						{/if}
					{:else}
						<div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#2D3748]">
							<Building size={48} class="text-[#A0AEC0] opacity-60" />
						</div>
					{/if}
					<div class="absolute top-3 right-3">
						<span class="text-xs px-2 py-1 rounded-full border {getStatusColor(property.status)}">
							{property.status}
						</span>
					</div>
				</div>

				<!-- Property Details -->
				<div class="p-4 flex flex-col flex-1">
					<div class="flex-1">
						<div class="flex items-start justify-between mb-2">
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900 dark:text-[#E2E8F0] mb-1">{property.title}</h3>
								<div class="flex items-center text-gray-600 dark:text-[#A0AEC0] text-sm mb-2">
									<MapPin size={14} class="mr-1" />
									<span>{property.address}</span>
								</div>
							</div>
						</div>

						<!-- Roles -->
						<div class="flex flex-wrap gap-1 mb-3">
							{#each (Array.isArray(property.roles) ? property.roles : (property.roles ? property.roles.split(',').map(r => r.trim()) : [])) as role}
								<span class="text-xs bg-gray-100 dark:bg-[#2D3748] px-2 py-1 rounded-full text-gray-600 dark:text-[#A0AEC0]">
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
						<div class="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600 dark:text-[#A0AEC0]">
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
					<div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-[#2D3748]">
						<button class="flex items-center space-x-1 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
							<Eye size={16} />
							<span class="text-sm">View</span>
						</button>
						<button class="flex items-center space-x-1 text-gray-600 dark:text-[#A0AEC0] hover:text-accent-purple dark:hover:text-white transition-colors">
							<MessageCircle size={16} />
							<span class="text-sm">Share</span>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if loading}
		<div class="text-center py-4 text-gray-500 dark:text-[#A0AEC0]">Loading...</div>
	{/if}
	{#if error}
		<div class="text-center py-4 text-red-500">{error}</div>
	{/if}
	{#if !loading && properties.length === 0}
		<div class="text-center py-12 text-gray-600 dark:text-[#A0AEC0]">No properties found.</div>
	{/if}
	<div bind:this={sentinel}></div>
</div> 