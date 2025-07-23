import { error } from '@sveltejs/kit';
import { VITE_STRAPI_URL } from '$env/static/private';

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
	likeCount: number;
}

interface StrapiResponse<T> {
	data: T;
	meta: any;
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
		slug: attr.slug || attr.title?.toLowerCase().replace(/\s+/g, '-') || '',
		likeCount: attr.likeCount || attr.like_count || 0
	};
}

async function fetchArticleFromStrapi(id: string): Promise<KnowledgeArticle | null> {
	try {
		const query = new URLSearchParams();
		query.set('populate', '*');
		
		const response = await fetch(`${BASE}/api/knowledge-articles/${id}?${query}`, {
			headers: getAuthHeaders()
		});
		
		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`Failed to fetch article: ${response.statusText}`);
		}
		
		const data: StrapiResponse<any> = await response.json();
		return mapStrapiArticle(data.data);
	} catch (err) {
		console.error('Error fetching article from Strapi:', err);
		throw err;
	}
}

async function fetchRelatedArticlesFromStrapi(category: string, currentId: string, tags: string[]): Promise<KnowledgeArticle[]> {
	try {
		const query = new URLSearchParams();
		query.set('populate', '*');
		query.set('pagination[pageSize]', '3');
		query.set('filters[id][$ne]', currentId);
		
		// Filter by category or tags
		if (category && category !== 'General') {
			query.set('filters[category][$eq]', category);
		} else if (tags.length > 0) {
			tags.slice(0, 2).forEach((tag, index) => {
				query.set(`filters[tags][$contains][${index}]`, tag);
			});
		}
		
		const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
			headers: getAuthHeaders()
		});
		
		if (!response.ok) {
			throw new Error(`Failed to fetch related articles: ${response.statusText}`);
		}
		
		const data = await response.json();
		return (data.data || []).map(mapStrapiArticle);
	} catch (err) {
		console.error('Error fetching related articles from Strapi:', err);
		return [];
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
		slug: 'future-urban-living-trends-2025',
		likeCount: 89
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
		slug: 'commercial-real-estate-recovery-post-pandemic',
		likeCount: 67
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
		slug: 'sustainable-development-emerging-markets',
		likeCount: 45
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
		slug: 'investment-opportunities-global-real-estate',
		likeCount: 123
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
		slug: 'proptech-revolution-technology-transforming-real-estate',
		likeCount: 78
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
		slug: 'residential-market-trends-buyer-preferences-2025',
		likeCount: 34
	}
];

export async function load({ params, fetch }) {
	try {
		const { id } = params;
		
		// Try to fetch from Strapi first
		if (BASE && BASE !== 'http://localhost:1337') {
			try {
				const article = await fetchArticleFromStrapi(id);
				
				if (!article) {
					throw error(404, 'Article not found');
				}
				
				// Fetch related articles
				const relatedArticles = await fetchRelatedArticlesFromStrapi(
					article.category, 
					article.id, 
					article.tags
				);
				
				return {
					article,
					relatedArticles,
					error: null
				};
			} catch (strapiError) {
				console.warn('Strapi fetch failed, using mock data:', strapiError);
			}
		}
		
		// Fallback to mock data
		const article = enhancedMockArticles.find(a => a.id === id || a.slug === id);
		
		if (!article) {
			throw error(404, 'Article not found');
		}
		
		// Find related articles based on category and tags
		const relatedArticles = enhancedMockArticles
			.filter(a => a.id !== article.id)
			.filter(a => 
				a.category === article.category || 
				a.tags.some(tag => article.tags.includes(tag))
			)
			.slice(0, 3);
		
		return {
			article,
			relatedArticles,
			error: null
		};
		
	} catch (err) {
		console.error('Error in article page load:', err);
		if (err.status === 404) {
			throw err;
		}
		throw error(500, 'Failed to load article');
	}
}