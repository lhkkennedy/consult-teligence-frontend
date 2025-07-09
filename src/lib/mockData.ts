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
		body_md: 'Excited to bring **Dockside Industrial Park** to market at 5.25% cap rate. This 150,000 sq ft facility represents a prime opportunity for industrial investors looking for stable cash flow in the growing logistics sector.',
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
				body: 'Great location! What\'s the current occupancy?',
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
		body_md: 'Construction update: **Riverside Office Complex** is now 75% complete. The steel framework is up and we\'re on track for Q3 2024 delivery. This will be a game-changer for the downtown office market.',
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
		body_md: 'Market insight: The shift towards hybrid work is creating new opportunities in suburban office markets. Companies are looking for smaller, more flexible spaces closer to where employees live.',
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
		body_md: '🎉 **Deal Closed!** Just completed the sale of **Harborview Retail Center** for $45M at a 4.8% cap rate. Great working with the team at Harborview Properties on this transaction.',
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
		images: [
			'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
		],
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
		images: [
			'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
		],
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
