import type { PageServerLoad } from './$types';

const API_BASE_URL = 'http://localhost:1337/api';

interface ApiPost {
  id: number;
  documentId: string;
  post_type: string;
  body_md: string;
  sentiment: string;
  visibility: string;
  deal_size?: string;
  location?: string;
  property_type?: string;
  engagement_score?: number;
  is_trending?: boolean;
  is_featured?: boolean;
  read_time?: number;
  tags?: Array<{ name: string }>;
  view_count?: number;
  share_count?: number;
  save_count?: number;
  deal_stage?: string;
  roi_estimate?: string;
  market_trend?: string;
  media_urls?: string[];
  reactions?: Array<{
    id: string;
    user_id: string;
    reaction_type: string;
    created_at: string;
  }>;
  comments?: Array<{
    id: string;
    user_id: string;
    body: string;
    created_at: string;
    user_name: string;
    user_avatar?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    username: string;
    avatar?: string;
    company?: string;
    title?: string;
    consultant?: {
      company?: string;
      title?: string;
    };
  };
  property?: {
    id: number;
    documentId: string;
    title?: string;
    address?: string;
    images?: string[];
    roles?: string[];
    headline_metric?: string;
    deal_size?: number;
    property_type?: string;
    irr?: number;
    completion_percentage?: number;
  };
}

interface ApiResponse {
  data: ApiPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Transform API post to TimelinePost format
function transformApiPost(apiPost: ApiPost) {
  return {
    post_id: apiPost.documentId || apiPost.id.toString(),
    person_id: apiPost.author?.id?.toString() || 'unknown',
    author_id: apiPost.author?.id?.toString() || 'unknown',
    author_name: apiPost.author?.username || 'Unknown User',
    author_avatar: apiPost.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    author_company: apiPost.author?.company || apiPost.author?.consultant?.company || 'Unknown Company',
    author_role: apiPost.author?.title || apiPost.author?.consultant?.title || 'Real Estate Professional',
    author_verified: false,
    author_followers: 0,
    post_type: (apiPost.post_type || 'Insight') as 'NewListing' | 'ProgressUpdate' | 'Closing' | 'Insight' | 'Generic' | 'property',
    body_md: apiPost.body_md || '',
    media_urls: apiPost.media_urls || [],
    property_uid: apiPost.property?.documentId || apiPost.property?.id?.toString(),
    property_data: apiPost.property ? {
      property_uid: apiPost.property.documentId || apiPost.property.id.toString(),
      title: apiPost.property.title || 'Property',
      address: apiPost.property.address || '',
      images: apiPost.property.images || [],
      roles: apiPost.property.roles || [],
      headline_metric: apiPost.property.headline_metric || '',
      deal_size: apiPost.property.deal_size || 0,
      property_type: apiPost.property.property_type || 'Unknown',
      status: 'Stabilised' as const,
      irr: apiPost.property.irr || 0,
      completion_percentage: apiPost.property.completion_percentage || 0
    } : undefined,
    sentiment: (apiPost.sentiment || 'Neutral') as 'Bull' | 'Bear' | 'Neutral',
    visibility: 'Public' as const,
    reactions: apiPost.reactions || [],
    comments: apiPost.comments || [],
    created_at: apiPost.createdAt || new Date().toISOString(),
    updated_at: apiPost.updatedAt || new Date().toISOString(),
    engagement_score: apiPost.engagement_score || 0,
    deal_size: apiPost.deal_size || 'Unknown',
    location: apiPost.location || 'Unknown',
    property_type: apiPost.property_type || 'Unknown',
    is_trending: apiPost.is_trending || false,
    is_featured: apiPost.is_featured || false,
    read_time: apiPost.read_time || 1,
    tags: apiPost.tags?.map(tag => tag.name) || [],
    view_count: apiPost.view_count || 0,
    share_count: apiPost.share_count || 0,
    save_count: apiPost.save_count || 0,
    deal_stage: apiPost.deal_stage || 'Active',
    roi_estimate: apiPost.roi_estimate || 'Unknown',
    market_trend: apiPost.market_trend || 'Stable'
  };
}

export const load: PageServerLoad = async ({ url }) => {
  try {
    // Get query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category') || 'all';
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'recent';
    const postTypes = url.searchParams.get('postTypes')?.split(',') || [];
    const sentiments = url.searchParams.get('sentiments')?.split(',') || [];
    const dateRange = url.searchParams.get('dateRange') || 'all';
    const dealSize = url.searchParams.get('dealSize') || 'all';
    const location = url.searchParams.get('location') || '';
    const propertyType = url.searchParams.get('propertyType')?.split(',') || [];
    const hasMedia = url.searchParams.get('hasMedia') === 'true';
    const hasComments = url.searchParams.get('hasComments') === 'true';

    // Build query parameters
    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': limit.toString(),
      'populate[author]': 'true',
      'populate[property]': 'true',
      'populate[reactions]': 'true',
      'populate[comments]': 'true',
      'populate[saves]': 'true',
      'populate[shares]': 'true',
      'populate[views]': 'true',
      'populate[tags]': 'true'
    });

    // Add category-specific filters
    if (category !== 'all') {
      switch (category) {
        case 'trending':
          params.append('filters[engagement_score][$gte]', '50');
          break;
        case 'featured':
          params.append('filters[is_featured]', 'true');
          break;
      }
    }

    // Add search filter
    if (search) {
      params.append('filters[$or][0][body_md][$containsi]', search);
      params.append('filters[$or][1][location][$containsi]', search);
      params.append('filters[$or][2][deal_size][$containsi]', search);
    }

    // Add post type filters
    if (postTypes.length > 0) {
      postTypes.forEach((type, index) => {
        params.append(`filters[post_type][$in][${index}]`, type);
      });
    }

    // Add sentiment filters
    if (sentiments.length > 0) {
      sentiments.forEach((sentiment, index) => {
        params.append(`filters[sentiment][$in][${index}]`, sentiment);
      });
    }

    // Add media filter
    if (hasMedia) {
      params.append('filters[media_urls][$notNull]', 'true');
    }

    // Add comments filter
    if (hasComments) {
      params.append('filters[comments][$notNull]', 'true');
    }

    // Add deal size filter
    if (dealSize !== 'all') {
      params.append('filters[deal_size]', dealSize);
    }

    // Add location filter
    if (location) {
      params.append('filters[location][$containsi]', location);
    }

    // Add property type filter
    if (propertyType.length > 0) {
      propertyType.forEach((type, index) => {
        params.append(`filters[property_type][$in][${index}]`, type);
      });
    }

    // Add sorting
    switch (sortBy) {
      case 'popular':
        params.set('sort[0]', 'engagement_score:desc');
        break;
      case 'trending':
        params.set('sort[0]', 'engagement_score:desc');
        params.append('filters[is_trending]', 'true');
        break;
      case 'engagement':
        params.set('sort[0]', 'engagement_score:desc');
        break;
      default:
        params.set('sort[0]', 'createdAt:desc');
    }

    // Fetch posts from API
    const response = await fetch(`${API_BASE_URL}/posts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const apiResponse: ApiResponse = await response.json();
    
    // Transform API response to TimelinePost format
    const posts = apiResponse.data.map(transformApiPost);

    // Calculate feed statistics
    const feedStats = {
      totalPosts: apiResponse.meta.pagination.total,
      newPosts: Math.floor(Math.random() * 10) + 1, // This could come from API
      activeDeals: posts.filter(p => p.post_type === 'NewListing' || p.post_type === 'ProgressUpdate').length,
      trendingTopics: posts.filter(p => p.is_trending).length
    };

    // Market insights (could come from API in the future)
    const marketInsights = {
      trendingTopics: ['Commercial Real Estate', 'Market Analysis', 'Investment Opportunities', 'Deal Flow'],
      marketSentiment: 'Bullish',
      sentimentScore: 75,
      activeDeals: 234,
      avgDealSize: '$15.2M',
      topMarkets: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco']
    };

    // Recommended connections (could come from API in the future)
    const recommendedConnections = [
      { id: 1, name: 'Alex Thompson', company: 'Thompson Capital', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', mutualConnections: 5, specialty: 'Commercial Real Estate' },
      { id: 2, name: 'Maria Garcia', company: 'Garcia Development', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100', mutualConnections: 3, specialty: 'Residential Development' },
      { id: 3, name: 'David Chen', company: 'Chen Investment Group', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', mutualConnections: 7, specialty: 'Investment Management' }
    ];

    return {
      posts,
      feedStats,
      marketInsights,
      recommendedConnections,
      pagination: {
        page: apiResponse.meta.pagination.page,
        pageSize: apiResponse.meta.pagination.pageSize,
        pageCount: apiResponse.meta.pagination.pageCount,
        total: apiResponse.meta.pagination.total,
        hasMore: apiResponse.meta.pagination.page < apiResponse.meta.pagination.pageCount
      },
      filters: {
        category,
        search,
        sortBy,
        postTypes,
        sentiments,
        dateRange,
        dealSize,
        location,
        propertyType,
        hasMedia,
        hasComments
      }
    };
  } catch (error) {
    console.error('Failed to load posts:', error);
    
    return {
      posts: [],
      feedStats: {
        totalPosts: 0,
        newPosts: 0,
        activeDeals: 0,
        trendingTopics: 0
      },
      marketInsights: {
        trendingTopics: [],
        marketSentiment: 'Neutral',
        sentimentScore: 50,
        activeDeals: 0,
        avgDealSize: '$0M',
        topMarkets: []
      },
      recommendedConnections: [],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 0,
        total: 0,
        hasMore: false
      },
      filters: {
        category: 'all',
        search: '',
        sortBy: 'recent',
        postTypes: [],
        sentiments: [],
        dateRange: 'all',
        dealSize: 'all',
        location: '',
        propertyType: [],
        hasMedia: false,
        hasComments: false
      },
      error: 'Failed to load posts. Please try again.'
    };
  }
}; 