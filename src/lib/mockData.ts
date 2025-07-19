import type { TimelinePost, Property, PortfolioStats } from './types.js';

export const consultants = [
	{
		id: 1,
		firstName: 'John',
		lastName: 'Smith',
		location: 'New York, USA',
		company: 'Smith & Associates',
		currentRole: 'Senior Real Estate Consultant',
		functionalExpertise: ['Commercial Real Estate', 'Property Valuation', 'Investment Analysis'],
		geographicalExpertise: 'North America',
		countryExpertise: 'USA',
		rate: 250,
		bio: 'John Smith is a seasoned real estate professional with over 15 years of experience in commercial real estate and property valuation. He specializes in investment analysis for institutional clients and has worked on projects valued at over $500 million throughout his career.',
		education: 'MBA in Real Estate Finance, Columbia University',
		certifications: [
			'Certified Commercial Investment Member (CCIM)',
			'Member of the Appraisal Institute (MAI)'
		],
		languages: ['English', 'Spanish'],
		profileImage: '/experts/john-smith.jpg',
		contactInfo: {
			email: 'john.smith@example.com',
			phone: '+1 (212) 555-1234',
			linkedin: 'linkedin.com/in/johnsmith'
		},
		availability: 'Available for projects starting June 2025',
		testimonials: [
			{
				id: 1,
				name: 'Sarah Johnson',
				company: 'Global Investments Ltd',
				text: 'John provided exceptional insights for our commercial property acquisition in Manhattan. His valuation expertise saved us from a potentially costly mistake.'
			},
			{
				id: 2,
				name: 'Michael Chen',
				company: 'Pacific Development Group',
				text: 'Working with John was a pleasure. His deep knowledge of the New York market and analytical approach to investment opportunities proved invaluable.'
			}
		],
		caseStudies: [
			{
				id: 1,
				title: 'Manhattan Office Complex Acquisition',
				description:
					'Advised on the $120M acquisition of a multi-tenant office complex, identifying value-add opportunities that increased ROI by 22%.'
			},
			{
				id: 2,
				title: 'Brooklyn Mixed-Use Development',
				description:
					'Provided comprehensive market analysis and financial modeling for a $85M mixed-use development project in Brooklyn.'
			}
		]
	},
	{
		id: 2,
		firstName: 'Emma',
		lastName: 'Johnson',
		location: 'London, UK',
		company: 'Urban Development Partners',
		currentRole: 'Director of Residential Development',
		functionalExpertise: ['Residential Development', 'Urban Planning', 'Sustainability'],
		geographicalExpertise: 'Europe',
		countryExpertise: 'UK',
		rate: 275,
		bio: 'Emma Johnson is a forward-thinking residential development expert with a passion for sustainable urban planning. With 12 years in the industry, she has led numerous successful residential projects across the UK, focusing on creating environmentally conscious living spaces that enhance community well-being.',
		education: "Master's in Urban Planning, University College London",
		certifications: [
			'Member of the Royal Town Planning Institute (MRTPI)',
			'LEED Accredited Professional'
		],
		languages: ['English', 'French'],
		profileImage: '/experts/emma-johnson.jpg',
		contactInfo: {
			email: 'emma.johnson@example.com',
			phone: '+44 20 7946 0523',
			linkedin: 'linkedin.com/in/emmajohnson'
		},
		availability: 'Limited availability - booking 3 months in advance',
		testimonials: [
			{
				id: 1,
				name: 'David Williams',
				company: 'Horizon Investments',
				text: "Emma's expertise in sustainable residential development transformed our project in Manchester. Her innovative approach to community-focused design has become our new standard."
			},
			{
				id: 2,
				name: 'Sophia Patel',
				company: 'Green Living Developments',
				text: 'Working with Emma on our eco-housing project was enlightening. Her knowledge of sustainable materials and energy-efficient design helped us achieve our environmental goals while maintaining profitability.'
			}
		],
		caseStudies: [
			{
				id: 1,
				title: 'Riverside Eco-Community, Bristol',
				description:
					'Led the planning and development of a 120-unit sustainable housing community that achieved carbon neutrality and won the National Housing Design Award.'
			},
			{
				id: 2,
				title: 'London Urban Regeneration Project',
				description:
					'Transformed a former industrial site into a mixed-use development with 200 residential units, incorporating green spaces and community facilities.'
			}
		]
	},
	{
		id: 3,
		firstName: 'Carlos',
		lastName: 'Rodriguez',
		location: 'Madrid, Spain',
		company: 'Global Hospitality Advisors',
		currentRole: 'Head of Hospitality Investments',
		functionalExpertise: ['Hospitality Real Estate', 'Tourism Development', 'Asset Management'],
		geographicalExpertise: 'Europe',
		countryExpertise: 'Spain',
		rate: 225,
		bio: 'Carlos Rodriguez is a hospitality real estate specialist with extensive experience across Europe and Latin America. He has advised on hotel acquisitions, resort developments, and tourism infrastructure projects worth over €300 million. His expertise lies in identifying emerging tourism markets and optimizing hospitality asset performance.',
		education: 'MBA in Hospitality Management, IE Business School',
		certifications: ['Certified Hotel Administrator (CHA)', 'Real Estate Investment Advisor'],
		languages: ['Spanish', 'English', 'Portuguese'],
		profileImage: '/experts/carlos-rodriguez.jpg',
		contactInfo: {
			email: 'carlos.rodriguez@example.com',
			phone: '+34 91 123 4567',
			linkedin: 'linkedin.com/in/carlosrodriguez'
		},
		availability: 'Available for consulting engagements',
		testimonials: [
			{
				id: 1,
				name: 'Isabella Moreno',
				company: 'Mediterranean Resorts Group',
				text: 'Carlos provided exceptional guidance during our expansion into the Spanish coastal market. His understanding of tourism trends and local regulations was invaluable.'
			},
			{
				id: 2,
				name: 'Antoine Dubois',
				company: 'European Hotel Investments',
				text: "We've worked with Carlos on multiple hotel acquisitions across Southern Europe. His market insights and negotiation skills have consistently delivered above-market returns."
			}
		],
		caseStudies: [
			{
				id: 1,
				title: 'Luxury Resort Development, Costa del Sol',
				description:
					'Managed the development strategy for a €75M luxury resort, optimizing the concept to achieve 35% higher ADR than competing properties.'
			},
			{
				id: 2,
				title: 'Boutique Hotel Portfolio Acquisition',
				description:
					'Advised on the €120M acquisition of a portfolio of boutique hotels across Spain and Portugal, implementing asset management strategies that increased EBITDA by 28%.'
			}
		]
	}
];

export const regions = [
	'North America',
	'South America',
	'Europe',
	'Africa',
	'Asia',
	'Middle East',
	'Oceania'
] as const;

export type Region = (typeof regions)[number];

export const countries: Record<Region, readonly string[]> = {
	'North America': ['USA', 'Canada', 'Mexico'],
	'South America': ['Brazil', 'Argentina', 'Chile', 'Colombia'],
	Europe: ['UK', 'France', 'Germany', 'Spain', 'Italy'],
	Africa: ['South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco'],
	Asia: ['China', 'Japan', 'India', 'Singapore', 'South Korea'],
	'Middle East': ['UAE', 'Saudi Arabia', 'Qatar', 'Israel', 'Turkey'],
	Oceania: ['Australia', 'New Zealand', 'Fiji']
};

export const specialties = [
	'Corporate Real Estate Management',
	'Real Estate Investment',
	'Real Estate Law',
	'Media Consultant',
	'Real Estate Management',
	'Real Estate Development',
	'Property Management',
	'Real Estate Appraisal',
	'Finance',
	'Tech',
	'Real Estate Marketing',
	'Real Estate Agent',
	'Real Estate Brokerage'
] as const;
export type Specialty = (typeof specialties)[number];

export const articles = [
	{
		id: 1,
		title: 'The Future of Urban Living: Trends in 2025',
		summary:
			'Explore how urban living spaces are evolving with technology integration and sustainability practices.',
		image: '/urban-living.png',
		author: 'Emma Johnson',
		date: '2025-05-15',
		category: 'Urban Planning'
	},
	{
		id: 2,
		title: 'Commercial Real Estate Recovery Post-Pandemic',
		summary:
			'Analysis of how commercial properties are adapting to new work patterns and economic conditions.',
		image: '/commercial-recovery.png',
		author: 'John Smith',
		date: '2025-05-02',
		category: 'Commercial Real Estate'
	},
	{
		id: 3,
		title: 'Sustainable Development in Emerging Markets',
		summary:
			'How green building practices are gaining momentum in rapidly developing urban centers worldwide.',
		image: '/emerging-markets.png',
		author: 'Maria Sanchez',
		date: '2025-04-28',
		category: 'Property Development'
	},
	{
		id: 4,
		title: 'Investment Opportunities in Global Real Estate',
		summary:
			'Strategic insights into promising real estate markets and sectors for investors in the coming year.',
		image: 'global-realestate.jpeg',
		author: 'Carlos Rodriguez',
		date: '2025-04-15',
		category: 'Investment Analysis'
	}
];

// Mock Timeline Data
export const mockTimelinePosts: TimelinePost[] = [
	{
		post_id: 'post_1',
		person_id: 'p_123',
		created_at: '2024-01-15T10:30:00Z',
		body_md:
			'Excited to bring **Dockside Industrial Park** to market at 5.25% cap rate. This 150,000 sq ft facility represents a prime opportunity for industrial investors looking for stable cash flow in the growing logistics sector.',
		media_urls: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
		property_uid: 'pr_DE.ZH6XWP83',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r1', user_id: 'u1', reaction_type: 'like', created_at: '2024-01-15T11:00:00Z' },
			{ id: 'r2', user_id: 'u2', reaction_type: 'celebrate', created_at: '2024-01-15T11:15:00Z' },
			{ id: 'r3', user_id: 'u3', reaction_type: 'insightful', created_at: '2024-01-15T12:00:00Z' }
		],
		comments: [
			{
				id: 'c1',
				user_id: 'u4',
				body: "Great location! What's the current occupancy?",
				created_at: '2024-01-15T11:30:00Z',
				user_name: 'Sarah Johnson',
				user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
			}
		]
	},
	{
		post_id: 'post_2',
		person_id: 'p_123',
		created_at: '2024-01-10T14:20:00Z',
		body_md:
			"Construction update: **Riverside Office Complex** is now 75% complete. The steel framework is up and we're on track for Q3 2024 delivery. This will be a game-changer for the downtown office market.",
		media_urls: [
			'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
			'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
		],
		property_uid: 'pr_DE.RIVERSIDE01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r4', user_id: 'u5', reaction_type: 'like', created_at: '2024-01-10T15:00:00Z' },
			{ id: 'r5', user_id: 'u6', reaction_type: 'celebrate', created_at: '2024-01-10T15:30:00Z' }
		]
	},
	{
		post_id: 'post_3',
		person_id: 'p_123',
		created_at: '2024-01-05T09:15:00Z',
		body_md:
			'Market insight: The shift towards hybrid work is creating new opportunities in suburban office markets. Companies are looking for smaller, more flexible spaces closer to where employees live.',
		media_urls: [],
		post_type: 'Insight',
		sentiment: 'Neutral',
		visibility: 'Public',
		reactions: [
			{ id: 'r6', user_id: 'u7', reaction_type: 'insightful', created_at: '2024-01-05T10:00:00Z' },
			{ id: 'r7', user_id: 'u8', reaction_type: 'like', created_at: '2024-01-05T10:30:00Z' }
		]
	},
	{
		post_id: 'post_4',
		person_id: 'p_123',
		created_at: '2023-12-28T16:45:00Z',
		body_md:
			'🎉 **Deal Closed!** Just completed the sale of **Harborview Retail Center** for $45M at a 4.8% cap rate. Great working with the team at Harborview Properties on this transaction.',
		media_urls: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		property_uid: 'pr_DE.HARBORVIEW01',
		post_type: 'Closing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r8', user_id: 'u9', reaction_type: 'celebrate', created_at: '2023-12-28T17:00:00Z' },
			{ id: 'r9', user_id: 'u10', reaction_type: 'like', created_at: '2023-12-28T17:15:00Z' },
			{ id: 'r10', user_id: 'u11', reaction_type: 'celebrate', created_at: '2023-12-28T18:00:00Z' }
		]
	}
];

export const mockProperties: Property[] = [
	{
		property_uid: 'pr_DE.ZH6XWP83',
		title: 'Dockside Industrial Park',
		address: '45 Fenchurch St, London EC3',
		property_type: 'Industrial',
		status: 'Stabilised',
		headline_metric: '5.25% cap rate',
		images: [
			'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
			'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
		],
		roles: ['Developer', 'Asset Manager'],
		deal_size: 22000000,
		irr: 12.5,
		completion_percentage: 100
	},
	{
		property_uid: 'pr_DE.RIVERSIDE01',
		title: 'Riverside Office Complex',
		address: '123 Riverside Dr, Manchester M1',
		property_type: 'Office',
		status: 'Under Construction',
		headline_metric: '75% complete',
		images: [
			'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
			'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
		],
		roles: ['Developer'],
		deal_size: 35000000,
		completion_percentage: 75
	},
	{
		property_uid: 'pr_DE.HARBORVIEW01',
		title: 'Harborview Retail Center',
		address: '789 Harbor Blvd, Liverpool L1',
		property_type: 'Retail',
		status: 'Exited',
		headline_metric: 'Sold at 4.8% cap',
		images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		roles: ['Broker', 'Investor'],
		deal_size: 45000000,
		irr: 18.2,
		completion_percentage: 100
	},
	{
		property_uid: 'pr_DE.URBANLIVING01',
		title: 'Urban Living Residences',
		address: '456 City Center Ave, Birmingham B1',
		property_type: 'Residential',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
		roles: ['Developer', 'Legal Counsel'],
		deal_size: 28000000,
		completion_percentage: 10
	}
];

export const mockPortfolioStats: PortfolioStats = {
	total_gfa: 1300000, // 1.3M sq ft
	total_aum: 430000000, // $430M
	deal_count: 27,
	avg_deal_size: 16000000 // $16M
};

// --- MOCK DATA SET 2 ---
export const mockProperties2: Property[] = [
	{
		property_uid: 'pr_FR.PARISLOFT01',
		title: 'Paris Loft Apartments',
		address: '12 Rue de Rivoli, Paris',
		property_type: 'Residential',
		status: 'Under Construction',
		headline_metric: '60% sold',
		images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		roles: ['Developer'],
		deal_size: 32000000,
		completion_percentage: 60
	},
	{
		property_uid: 'pr_FR.BUSINESSPARK01',
		title: 'Business Park La Défense',
		address: '45 Avenue de l’Arche, Courbevoie',
		property_type: 'Office',
		status: 'Stabilised',
		headline_metric: '98% occupancy',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Asset Manager'],
		deal_size: 54000000,
		irr: 10.8,
		completion_percentage: 100
	}
];

export const mockTimelinePosts2: TimelinePost[] = [
	{
		post_id: 'post2_1',
		person_id: 'p_201',
		created_at: '2024-03-12T09:00:00Z',
		body_md:
			'Excavation complete at **Paris Loft Apartments**. Construction is on schedule for Q2 2025 delivery.',
		media_urls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		property_uid: 'pr_FR.PARISLOFT01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r21', user_id: 'u21', reaction_type: 'like', created_at: '2024-03-12T09:30:00Z' }
		],
		comments: [
			{
				id: 'c21',
				user_id: 'u22',
				body: 'Will there be penthouse units available?',
				created_at: '2024-03-12T10:00:00Z',
				user_name: 'Marie Dubois',
				user_avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100'
			}
		]
	},
	{
		post_id: 'post2_2',
		person_id: 'p_202',
		created_at: '2024-03-15T14:20:00Z',
		body_md:
			'**Business Park La Défense** reaches 98% occupancy. Welcoming our newest tenant, a leading fintech firm.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_FR.BUSINESSPARK01',
		post_type: 'Insight',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r22', user_id: 'u23', reaction_type: 'celebrate', created_at: '2024-03-15T15:00:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats2: PortfolioStats = {
	total_gfa: 420000, // 320k + 100k
	total_aum: 86000000, // $32M + $54M
	deal_count: 2,
	avg_deal_size: 43000000 // $86M / 2
};

// --- MOCK DATA SET 3 ---
export const mockProperties3: Property[] = [
	{
		property_uid: 'pr_USA.SUNSETVILLAS01',
		title: 'Sunset Villas',
		address: '789 Palm Dr, Miami, FL',
		property_type: 'Residential',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800'],
		roles: ['Developer', 'Legal Counsel'],
		deal_size: 25000000,
		completion_percentage: 5
	},
	{
		property_uid: 'pr_USA.BAYTOWER01',
		title: 'Bay Tower',
		address: '300 Bay St, San Francisco, CA',
		property_type: 'Office',
		status: 'Under Construction',
		headline_metric: '30% complete',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Developer'],
		deal_size: 47000000,
		completion_percentage: 30
	},
	{
		property_uid: 'pr_USA.MARKETPLAZA01',
		title: 'Market Plaza',
		address: '100 Market St, Dallas, TX',
		property_type: 'Retail',
		status: 'Stabilised',
		headline_metric: 'Fully leased',
		images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		roles: ['Asset Manager'],
		deal_size: 39000000,
		irr: 13.2,
		completion_percentage: 100
	}
];

export const mockTimelinePosts3: TimelinePost[] = [
	{
		post_id: 'post3_1',
		person_id: 'p_301',
		created_at: '2024-04-01T11:00:00Z',
		body_md:
			'Groundbreaking ceremony for **Sunset Villas**! Excited to bring luxury living to Miami.',
		media_urls: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800'],
		property_uid: 'pr_USA.SUNSETVILLAS01',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r31', user_id: 'u31', reaction_type: 'celebrate', created_at: '2024-04-01T11:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post3_2',
		person_id: 'p_302',
		created_at: '2024-04-10T16:45:00Z',
		body_md:
			'**Bay Tower** construction update: steel structure is up, 30% complete. Leasing interest is strong.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_USA.BAYTOWER01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r32', user_id: 'u32', reaction_type: 'like', created_at: '2024-04-10T17:00:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post3_3',
		person_id: 'p_303',
		created_at: '2024-04-15T13:20:00Z',
		body_md:
			'**Market Plaza** is now fully leased! Thanks to our team and tenants for making this a success.',
		media_urls: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		property_uid: 'pr_USA.MARKETPLAZA01',
		post_type: 'Closing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r33', user_id: 'u33', reaction_type: 'love', created_at: '2024-04-15T14:00:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats3: PortfolioStats = {
	total_gfa: 350000, // 90k + 120k + 140k
	total_aum: 111000000, // $25M + $47M + $39M
	deal_count: 3,
	avg_deal_size: 37000000 // $111M / 3
};

// --- MOCK DATA SET 4 ---
export const mockProperties4: Property[] = [
	{
		property_uid: 'pr_JP.TOKYOTOWER01',
		title: 'Tokyo Tower Residences',
		address: '1-1-2 Oshiage, Sumida City, Tokyo',
		property_type: 'Residential',
		status: 'Under Construction',
		headline_metric: '80% complete',
		images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800'],
		roles: ['Developer'],
		deal_size: 41000000,
		completion_percentage: 80
	},
	{
		property_uid: 'pr_JP.SHIBUYAHUB01',
		title: 'Shibuya Tech Hub',
		address: '2-24-12 Shibuya, Tokyo',
		property_type: 'Office',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Developer', 'Legal Counsel'],
		deal_size: 37000000,
		completion_percentage: 10
	}
];

export const mockTimelinePosts4: TimelinePost[] = [
	{
		post_id: 'post4_1',
		person_id: 'p_401',
		created_at: '2024-05-01T10:00:00Z',
		body_md:
			'Final floors being completed at **Tokyo Tower Residences**. Move-in expected by September.',
		media_urls: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800'],
		property_uid: 'pr_JP.TOKYOTOWER01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r41', user_id: 'u41', reaction_type: 'like', created_at: '2024-05-01T10:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post4_2',
		person_id: 'p_402',
		created_at: '2024-05-10T15:00:00Z',
		body_md: 'Announcing the **Shibuya Tech Hub** project. A new center for innovation in Tokyo.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_JP.SHIBUYAHUB01',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r42', user_id: 'u42', reaction_type: 'celebrate', created_at: '2024-05-10T15:30:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats4: PortfolioStats = {
	total_gfa: 350000, // 200k + 150k
	total_aum: 78000000, // $41M + $37M
	deal_count: 2,
	avg_deal_size: 39000000 // $78M / 2
};

// --- MOCK DATA SET 5 ---
export const mockProperties5: Property[] = [
	{
		property_uid: 'pr_AU.SYDNEYWHARF01',
		title: 'Sydney Wharf Offices',
		address: '88 Wharf Rd, Sydney',
		property_type: 'Office',
		status: 'Stabilised',
		headline_metric: '100% leased',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Asset Manager'],
		deal_size: 52000000,
		irr: 11.5,
		completion_percentage: 100
	},
	{
		property_uid: 'pr_AU.BONDIRESIDENCE01',
		title: 'Bondi Beach Residences',
		address: '101 Campbell Parade, Bondi Beach',
		property_type: 'Residential',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		roles: ['Developer'],
		deal_size: 34000000,
		completion_percentage: 5
	}
];

export const mockTimelinePosts5: TimelinePost[] = [
	{
		post_id: 'post5_1',
		person_id: 'p_501',
		created_at: '2024-06-01T09:00:00Z',
		body_md: '**Sydney Wharf Offices** achieves 100% leasing. Thanks to our team and tenants!',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_AU.SYDNEYWHARF01',
		post_type: 'Closing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r51', user_id: 'u51', reaction_type: 'love', created_at: '2024-06-01T09:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post5_2',
		person_id: 'p_502',
		created_at: '2024-06-10T13:00:00Z',
		body_md: 'Planning approved for **Bondi Beach Residences**. Construction to start soon.',
		media_urls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		property_uid: 'pr_AU.BONDIRESIDENCE01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r52', user_id: 'u52', reaction_type: 'like', created_at: '2024-06-10T13:30:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats5: PortfolioStats = {
	total_gfa: 310000, // 180k + 130k
	total_aum: 86000000, // $52M + $34M
	deal_count: 2,
	avg_deal_size: 43000000 // $86M / 2
};

// --- MOCK DATA SET 6 ---
export const mockProperties6: Property[] = [
	{
		property_uid: 'pr_BR.RIOCOMPLEX01',
		title: 'Rio Business Complex',
		address: '200 Av. Atlântica, Rio de Janeiro',
		property_type: 'Office',
		status: 'Under Construction',
		headline_metric: '50% complete',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Developer'],
		deal_size: 39000000,
		completion_percentage: 50
	},
	{
		property_uid: 'pr_BR.COPACABANARES01',
		title: 'Copacabana Residences',
		address: '300 Rua Barata Ribeiro, Rio de Janeiro',
		property_type: 'Residential',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		roles: ['Developer'],
		deal_size: 27000000,
		completion_percentage: 10
	}
];

export const mockTimelinePosts6: TimelinePost[] = [
	{
		post_id: 'post6_1',
		person_id: 'p_601',
		created_at: '2024-07-01T08:00:00Z',
		body_md:
			'Halfway milestone reached at **Rio Business Complex**. On track for Q1 2025 delivery.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_BR.RIOCOMPLEX01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r61', user_id: 'u61', reaction_type: 'like', created_at: '2024-07-01T08:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post6_2',
		person_id: 'p_602',
		created_at: '2024-07-10T12:00:00Z',
		body_md: 'Excited to announce **Copacabana Residences**—luxury living in Rio. Sales open soon.',
		media_urls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		property_uid: 'pr_BR.COPACABANARES01',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r62', user_id: 'u62', reaction_type: 'celebrate', created_at: '2024-07-10T12:30:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats6: PortfolioStats = {
	total_gfa: 270000, // 150k + 120k
	total_aum: 66000000, // $39M + $27M
	deal_count: 2,
	avg_deal_size: 33000000 // $66M / 2
};

// --- MOCK DATA SET 7 ---
export const mockProperties7: Property[] = [
	{
		property_uid: 'pr_DE.BERLINLOFTS01',
		title: 'Berlin Lofts',
		address: '10 Alexanderplatz, Berlin',
		property_type: 'Residential',
		status: 'Under Construction',
		headline_metric: '70% complete',
		images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		roles: ['Developer'],
		deal_size: 36000000,
		completion_percentage: 70
	},
	{
		property_uid: 'pr_DE.MITTEOFFICE01',
		title: 'Mitte Office Center',
		address: '20 Friedrichstrasse, Berlin',
		property_type: 'Office',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Developer', 'Legal Counsel'],
		deal_size: 31000000,
		completion_percentage: 15
	}
];

export const mockTimelinePosts7: TimelinePost[] = [
	{
		post_id: 'post7_1',
		person_id: 'p_701',
		created_at: '2024-08-01T10:00:00Z',
		body_md: 'Construction at **Berlin Lofts** is 70% complete. Move-in expected by December.',
		media_urls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		property_uid: 'pr_DE.BERLINLOFTS01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r71', user_id: 'u71', reaction_type: 'like', created_at: '2024-08-01T10:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post7_2',
		person_id: 'p_702',
		created_at: '2024-08-10T14:00:00Z',
		body_md:
			'Introducing **Mitte Office Center**—a new business hub in Berlin. Leasing opens soon.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_DE.MITTEOFFICE01',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r72', user_id: 'u72', reaction_type: 'celebrate', created_at: '2024-08-10T14:30:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats7: PortfolioStats = {
	total_gfa: 260000, // 140k + 120k
	total_aum: 67000000, // $36M + $31M
	deal_count: 2,
	avg_deal_size: 33500000 // $67M / 2
};

// --- MOCK DATA SET 8 ---
export const mockProperties8: Property[] = [
	{
		property_uid: 'pr_CA.TORONTOCENTRE01',
		title: 'Toronto Centre Residences',
		address: '123 Yonge St, Toronto',
		property_type: 'Residential',
		status: 'Planning',
		headline_metric: 'Planning phase',
		images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		roles: ['Developer'],
		deal_size: 29000000,
		completion_percentage: 10
	},
	{
		property_uid: 'pr_CA.BAYSTREETTOWER01',
		title: 'Bay Street Tower',
		address: '200 Bay St, Toronto',
		property_type: 'Office',
		status: 'Under Construction',
		headline_metric: '40% complete',
		images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		roles: ['Developer'],
		deal_size: 43000000,
		completion_percentage: 40
	}
];

export const mockTimelinePosts8: TimelinePost[] = [
	{
		post_id: 'post8_1',
		person_id: 'p_801',
		created_at: '2024-09-01T09:00:00Z',
		body_md: 'Planning underway for **Toronto Centre Residences**. Sales to open in October.',
		media_urls: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
		property_uid: 'pr_CA.TORONTOCENTRE01',
		post_type: 'NewListing',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r81', user_id: 'u81', reaction_type: 'celebrate', created_at: '2024-09-01T09:30:00Z' }
		],
		comments: []
	},
	{
		post_id: 'post8_2',
		person_id: 'p_802',
		created_at: '2024-09-10T12:00:00Z',
		body_md: 'Construction at **Bay Street Tower** reaches 40%. Leasing interest is high.',
		media_urls: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'],
		property_uid: 'pr_CA.BAYSTREETTOWER01',
		post_type: 'ProgressUpdate',
		sentiment: 'Bull',
		visibility: 'Public',
		reactions: [
			{ id: 'r82', user_id: 'u82', reaction_type: 'like', created_at: '2024-09-10T12:30:00Z' }
		],
		comments: []
	}
];

export const mockPortfolioStats8: PortfolioStats = {
	total_gfa: 230000, // 110k + 120k
	total_aum: 72000000, // $29M + $43M
	deal_count: 2,
	avg_deal_size: 36000000 // $72M / 2
};
