import { error } from '@sveltejs/kit';
import { VITE_STRAPI_URL } from '$env/static/private';
import { articles as mockArticles } from '$lib/mockData';

const BASE = VITE_STRAPI_URL || 'http://localhost:1337';

// Enhanced article type for knowledge base
interface KnowledgeArticle {
	id: string;
	title: string;
	summary: string;
	content: string;
	coverImage?: string;
	author: string;
	publishedAt: string;
	category: string;
	tags: string[];
	viewCount: number;
	engagementScore: number;
	readTime: number;
	isFeatured: boolean;
	slug: string;
}

interface StrapiResponse<T> {
	data: T[];
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

function getAuthHeaders(): Record<string, string> {
	// For public endpoints, we don't need authentication
	return {};
}

function mapStrapiArticle(item: any): KnowledgeArticle {
	const attr = item.attributes || item;
	return {
		id: item.id?.toString() || '',
		title: attr.title || '',
		summary: attr.summary || attr.excerpt || '',
		content: attr.content || '',
		coverImage: attr.coverImage?.data?.attributes?.url || attr.coverImage?.url,
		author: attr.author?.data?.attributes?.name || attr.author?.name || 'Unknown Author',
		publishedAt: attr.publishedAt || attr.published_at || attr.createdAt || new Date().toISOString(),
		category: attr.category || 'General',
		tags: attr.tags || [],
		viewCount: attr.viewCount || attr.view_count || 0,
		engagementScore: attr.engagementScore || attr.engagement_score || 0,
		readTime: attr.readTime || attr.read_time || 5,
		isFeatured: attr.isFeatured || attr.is_featured || false,
		slug: attr.slug || attr.title?.toLowerCase().replace(/\s+/g, '-') || ''
	};
}

async function fetchArticlesFromStrapi(params: URLSearchParams): Promise<{
	articles: KnowledgeArticle[];
	pagination: any;
}> {
	try {
		const query = new URLSearchParams();
		
		// Add pagination
		const page = params.get('page') || '1';
		const pageSize = params.get('pageSize') || '12';
		query.set('pagination[page]', page);
		query.set('pagination[pageSize]', pageSize);
		
		// Add sorting
		const sortBy = params.get('sortBy') || 'publishedAt:desc';
		query.set('sort', sortBy === 'recent' ? 'publishedAt:desc' : 
			sortBy === 'popular' ? 'viewCount:desc' : 
			sortBy === 'trending' ? 'engagementScore:desc' : 
			sortBy === 'title' ? 'title:asc' : 'publishedAt:desc');
		
		// Add filters
		const category = params.get('category');
		if (category && category !== 'all') {
			query.set('filters[category][$eq]', category);
		}
		
		const search = params.get('search');
		if (search) {
			query.set('filters[$or][0][title][$containsi]', search);
			query.set('filters[$or][1][summary][$containsi]', search);
			query.set('filters[$or][2][content][$containsi]', search);
		}
		
		const tags = params.get('tags');
		if (tags) {
			const tagArray = tags.split(',');
			tagArray.forEach((tag, index) => {
				query.set(`filters[tags][$contains][${index}]`, tag);
			});
		}
		
		const authors = params.get('authors');
		if (authors) {
			const authorArray = authors.split(',');
			authorArray.forEach((author, index) => {
				query.set(`filters[author][name][$in][${index}]`, author);
			});
		}
		
		// Add population
		query.set('populate', '*');
		
		const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
			headers: getAuthHeaders()
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch articles: ${response.statusText}`);
		}
		
		const data: StrapiResponse<any> = await response.json();
		
		return {
			articles: (data.data || []).map(mapStrapiArticle),
			pagination: data.meta?.pagination || {
				page: 1,
				pageSize: 12,
				pageCount: 1,
				total: 0
			}
		};
	} catch (err) {
		console.error('Error fetching articles from Strapi:', err);
		throw err;
	}
}

// Enhanced mock articles for knowledge base
const enhancedMockArticles: KnowledgeArticle[] = [
	{
		id: '1',
		title: 'The Future of Urban Living: Trends in 2025',
		summary: 'Explore how urban living spaces are evolving with technology integration and sustainability practices. Discover the latest trends that will shape the real estate market in the coming year.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
		author: 'Emma Johnson',
		publishedAt: '2025-01-15T10:00:00Z',
		category: 'Urban Planning',
		tags: ['Urban Planning', 'Technology', 'Sustainability', 'Smart Cities'],
		viewCount: 1247,
		engagementScore: 8.5,
		readTime: 8,
		isFeatured: true,
		slug: 'future-urban-living-trends-2025'
	},
	{
		id: '2',
		title: 'Commercial Real Estate Recovery Post-Pandemic',
		summary: 'Analysis of how commercial properties are adapting to new work patterns and economic conditions. Learn about the strategies that are driving recovery in different market segments.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
		author: 'John Smith',
		publishedAt: '2025-01-10T14:30:00Z',
		category: 'Commercial Real Estate',
		tags: ['Commercial', 'Market Analysis', 'Post-Pandemic', 'Office'],
		viewCount: 892,
		engagementScore: 7.2,
		readTime: 6,
		isFeatured: false,
		slug: 'commercial-real-estate-recovery-post-pandemic'
	},
	{
		id: '3',
		title: 'Sustainable Development in Emerging Markets',
		summary: 'How green building practices are gaining momentum in rapidly developing urban centers worldwide. Case studies from Asia, Africa, and Latin America.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
		author: 'Maria Sanchez',
		publishedAt: '2025-01-08T09:15:00Z',
		category: 'Sustainability',
		tags: ['Sustainability', 'Green Building', 'Emerging Markets', 'Development'],
		viewCount: 567,
		engagementScore: 6.8,
		readTime: 7,
		isFeatured: false,
		slug: 'sustainable-development-emerging-markets'
	},
	{
		id: '4',
		title: 'Investment Opportunities in Global Real Estate',
		summary: 'Strategic insights into promising real estate markets and sectors for investors in the coming year. Analysis of cap rates, IRR expectations, and market fundamentals.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
		author: 'Carlos Rodriguez',
		publishedAt: '2025-01-05T16:45:00Z',
		category: 'Investment Analysis',
		tags: ['Investment', 'Market Analysis', 'Cap Rates', 'IRR', 'Global'],
		viewCount: 1103,
		engagementScore: 8.1,
		readTime: 10,
		isFeatured: true,
		slug: 'investment-opportunities-global-real-estate'
	},
	{
		id: '5',
		title: 'PropTech Revolution: Technology Transforming Real Estate',
		summary: 'From AI-powered property management to blockchain-based transactions, discover how technology is revolutionizing every aspect of the real estate industry.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
		author: 'Sarah Chen',
		publishedAt: '2025-01-03T11:20:00Z',
		category: 'Technology',
		tags: ['Technology', 'PropTech', 'AI', 'Blockchain', 'Innovation'],
		viewCount: 756,
		engagementScore: 7.9,
		readTime: 9,
		isFeatured: false,
		slug: 'proptech-revolution-technology-transforming-real-estate'
	},
	{
		id: '6',
		title: 'Residential Market Trends: What Buyers Want in 2025',
		summary: 'Analysis of changing buyer preferences and how they\'re influencing residential development. From smart homes to community-focused design.',
		content: 'Full article content would go here...',
		coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
		author: 'Michael Brown',
		publishedAt: '2024-12-30T13:10:00Z',
		category: 'Residential Real Estate',
		tags: ['Residential', 'Market Trends', 'Buyer Preferences', 'Smart Homes'],
		viewCount: 634,
		engagementScore: 6.5,
		readTime: 5,
		isFeatured: false,
		slug: 'residential-market-trends-buyer-preferences-2025'
	}
];

export async function load({ url, fetch }) {
	try {
		const params = url.searchParams;
		
		// Try to fetch from Strapi first
		if (BASE && BASE !== 'http://localhost:1337') {
			try {
				const { articles, pagination } = await fetchArticlesFromStrapi(params);
				
				return {
					articles,
					categories: [
						'Investment Analysis', 'Market Trends', 'Property Development',
						'Commercial Real Estate', 'Residential Real Estate', 'Urban Planning',
						'Sustainability', 'Legal & Regulatory', 'Technology'
					],
					featuredArticles: articles.filter(a => a.isFeatured),
					popularArticles: articles.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
					recentArticles: articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3),
					pagination,
					filters: {
						search: params.get('search') || '',
						category: params.get('category') || 'all',
						sortBy: params.get('sortBy') || 'recent',
						tags: params.get('tags')?.split(',').filter(Boolean) || [],
						authors: params.get('authors')?.split(',').filter(Boolean) || [],
						page: parseInt(params.get('page') || '1')
					},
					error: null
				};
			} catch (strapiError) {
				console.warn('Strapi fetch failed, using mock data:', strapiError);
			}
		}
		
		// Fallback to mock data
		const mockPagination = {
			page: parseInt(params.get('page') || '1'),
			pageSize: 12,
			pageCount: 1,
			total: enhancedMockArticles.length
		};
		
		return {
			articles: enhancedMockArticles,
			categories: [
				'Investment Analysis', 'Market Trends', 'Property Development',
				'Commercial Real Estate', 'Residential Real Estate', 'Urban Planning',
				'Sustainability', 'Legal & Regulatory', 'Technology'
			],
			featuredArticles: enhancedMockArticles.filter(a => a.isFeatured),
			popularArticles: enhancedMockArticles.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3),
			recentArticles: enhancedMockArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3),
			pagination: mockPagination,
			filters: {
				search: params.get('search') || '',
				category: params.get('category') || 'all',
				sortBy: params.get('sortBy') || 'recent',
				tags: params.get('tags')?.split(',').filter(Boolean) || [],
				authors: params.get('authors')?.split(',').filter(Boolean) || [],
				page: parseInt(params.get('page') || '1')
			},
			error: null
		};
		
	} catch (err) {
		console.error('Error in knowledge page load:', err);
		throw error(500, 'Failed to load knowledge base articles');
	}
}