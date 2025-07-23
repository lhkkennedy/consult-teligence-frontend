const BASE = 'http://localhost:1337';

// Knowledge base article interface
export interface KnowledgeArticle {
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

// Strapi response interfaces
export interface StrapiResponse<T> {
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

export interface StrapiSingleResponse<T> {
	data: T;
	meta: any;
}

// Filter and search options
export interface KnowledgeFilters {
	search?: string;
	category?: string;
	sortBy?: 'recent' | 'popular' | 'trending' | 'title';
	tags?: string[];
	authors?: string[];
	page?: number;
	pageSize?: number;
}

// Pagination info
export interface PaginationInfo {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

// Knowledge base response
export interface KnowledgeResponse {
	articles: KnowledgeArticle[];
	pagination: PaginationInfo;
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

export class KnowledgeService {
	/**
	 * Fetch articles from Strapi API with filters
	 */
	static async fetchArticles(filters: KnowledgeFilters = {}): Promise<KnowledgeResponse> {
		try {
			const query = new URLSearchParams();
			
			// Add pagination
			const page = filters.page || 1;
			const pageSize = filters.pageSize || 12;
			query.set('pagination[page]', page.toString());
			query.set('pagination[pageSize]', pageSize.toString());
			
			// Add sorting
			const sortBy = filters.sortBy || 'recent';
			query.set('sort', sortBy === 'recent' ? 'publishedAt:desc' : 
				sortBy === 'popular' ? 'viewCount:desc' : 
				sortBy === 'trending' ? 'engagementScore:desc' : 
				sortBy === 'title' ? 'title:asc' : 'publishedAt:desc');
			
			// Add filters
			if (filters.category && filters.category !== 'all') {
				query.set('filters[category][$eq]', filters.category);
			}
			
			if (filters.search) {
				query.set('filters[$or][0][title][$containsi]', filters.search);
				query.set('filters[$or][1][summary][$containsi]', filters.search);
				query.set('filters[$or][2][content][$containsi]', filters.search);
			}
			
			if (filters.tags && filters.tags.length > 0) {
				filters.tags.forEach((tag, index) => {
					query.set(`filters[tags][$contains][${index}]`, tag);
				});
			}
			
			if (filters.authors && filters.authors.length > 0) {
				filters.authors.forEach((author, index) => {
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

	/**
	 * Fetch a single article by ID
	 */
	static async fetchArticle(id: string): Promise<KnowledgeArticle | null> {
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
			
			const data: StrapiSingleResponse<any> = await response.json();
			return mapStrapiArticle(data.data);
		} catch (err) {
			console.error('Error fetching article from Strapi:', err);
			throw err;
		}
	}

	/**
	 * Fetch related articles
	 */
	static async fetchRelatedArticles(category: string, currentId: string, tags: string[]): Promise<KnowledgeArticle[]> {
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

	/**
	 * Fetch featured articles
	 */
	static async fetchFeaturedArticles(limit: number = 3): Promise<KnowledgeArticle[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', limit.toString());
			query.set('filters[isFeatured][$eq]', 'true');
			query.set('sort', 'publishedAt:desc');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch featured articles: ${response.statusText}`);
			}
			
			const data = await response.json();
			return (data.data || []).map(mapStrapiArticle);
		} catch (err) {
			console.error('Error fetching featured articles from Strapi:', err);
			return [];
		}
	}

	/**
	 * Fetch popular articles
	 */
	static async fetchPopularArticles(limit: number = 3): Promise<KnowledgeArticle[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', limit.toString());
			query.set('sort', 'viewCount:desc');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch popular articles: ${response.statusText}`);
			}
			
			const data = await response.json();
			return (data.data || []).map(mapStrapiArticle);
		} catch (err) {
			console.error('Error fetching popular articles from Strapi:', err);
			return [];
		}
	}

	/**
	 * Fetch recent articles
	 */
	static async fetchRecentArticles(limit: number = 3): Promise<KnowledgeArticle[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', limit.toString());
			query.set('sort', 'publishedAt:desc');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch recent articles: ${response.statusText}`);
			}
			
			const data = await response.json();
			return (data.data || []).map(mapStrapiArticle);
		} catch (err) {
			console.error('Error fetching recent articles from Strapi:', err);
			return [];
		}
	}

	/**
	 * Fetch categories
	 */
	static async fetchCategories(): Promise<string[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', '100');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch categories: ${response.statusText}`);
			}
			
			const data = await response.json();
			const articles = (data.data || []).map(mapStrapiArticle);
			
			// Extract unique categories
			const categories = [...new Set(articles.map(article => article.category))];
			return categories.sort();
		} catch (err) {
			console.error('Error fetching categories from Strapi:', err);
			return [];
		}
	}

	/**
	 * Fetch tags
	 */
	static async fetchTags(): Promise<string[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', '100');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch tags: ${response.statusText}`);
			}
			
			const data = await response.json();
			const articles = (data.data || []).map(mapStrapiArticle);
			
			// Extract unique tags
			const allTags = articles.flatMap(article => article.tags);
			const uniqueTags = [...new Set(allTags)];
			return uniqueTags.sort();
		} catch (err) {
			console.error('Error fetching tags from Strapi:', err);
			return [];
		}
	}

	/**
	 * Fetch authors
	 */
	static async fetchAuthors(): Promise<string[]> {
		try {
			const query = new URLSearchParams();
			query.set('populate', '*');
			query.set('pagination[pageSize]', '100');
			
			const response = await fetch(`${BASE}/api/knowledge-articles?${query}`, {
				headers: getAuthHeaders()
			});
			
			if (!response.ok) {
				throw new Error(`Failed to fetch authors: ${response.statusText}`);
			}
			
			const data = await response.json();
			const articles = (data.data || []).map(mapStrapiArticle);
			
			// Extract unique authors
			const authors = [...new Set(articles.map(article => article.author))];
			return authors.sort();
		} catch (err) {
			console.error('Error fetching authors from Strapi:', err);
			return [];
		}
	}

	/**
	 * Increment view count for an article
	 */
	static async incrementViewCount(articleId: string): Promise<void> {
		try {
			// In a real app, this would update the view count in the database
			// For now, we'll just log it
			console.log(`Incrementing view count for article ${articleId}`);
		} catch (err) {
			console.error('Error incrementing view count:', err);
		}
	}

	/**
	 * Like/unlike an article
	 */
	static async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
		try {
			// In a real app, this would update the like status in the database
			// For now, we'll just return a mock response
			return {
				liked: true,
				likeCount: Math.floor(Math.random() * 100) + 1
			};
		} catch (err) {
			console.error('Error toggling like:', err);
			throw err;
		}
	}

	/**
	 * Bookmark/unbookmark an article
	 */
	static async toggleBookmark(articleId: string, userId: string): Promise<{ bookmarked: boolean }> {
		try {
			// In a real app, this would update the bookmark status in the database
			// For now, we'll just return a mock response
			return {
				bookmarked: true
			};
		} catch (err) {
			console.error('Error toggling bookmark:', err);
			throw err;
		}
	}
}