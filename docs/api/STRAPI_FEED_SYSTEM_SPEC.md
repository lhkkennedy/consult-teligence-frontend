# Strapi v5 Feed System API Specification
## Professional Real Estate Network Platform

This document outlines the comprehensive backend API requirements for the enhanced feed system, including content types, endpoints, services, and data models needed to support all advanced features.

---

## 📋 Content Types

### 1. **Posts** (Enhanced)
```typescript
interface Post {
  id: string;
  post_type: 'NewListing' | 'ProgressUpdate' | 'Closing' | 'Insight' | 'property';
  body_md: string;
  sentiment: 'Bull' | 'Bear' | 'Neutral';
  created_at: string;
  updated_at: string;
  published_at: string;
  
  // Enhanced metadata
  deal_size: string;
  location: string;
  property_type: string;
  deal_stage: string;
  roi_estimate: string;
  market_trend: string;
  read_time: number;
  engagement_score: number;
  view_count: number;
  share_count: number;
  save_count: number;
  is_trending: boolean;
  is_featured: boolean;
  
  // Relations
  author: User;
  property: Property;
  media_urls: Media[];
  tags: Tag[];
  reactions: Reaction[];
  comments: Comment[];
  saves: Save[];
  shares: Share[];
  views: View[];
  
  // SEO & Discovery
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  discoverability_score: number;
}
```

### 2. **Reactions** (Enhanced)
```typescript
interface Reaction {
  id: string;
  reaction_type: 'like' | 'love' | 'celebrate' | 'insightful' | 'helpful';
  created_at: string;
  user: User;
  post: Post;
  weight: number; // For engagement scoring
}
```

### 3. **Comments** (Enhanced)
```typescript
interface Comment {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  
  // Enhanced features
  is_edited: boolean;
  edit_history: string[];
  is_pinned: boolean;
  parent_comment?: Comment; // For threaded comments
  replies: Comment[];
  
  // Relations
  user: User;
  post: Post;
  reactions: Reaction[];
  
  // Moderation
  is_flagged: boolean;
  flag_reason: string;
  moderator_notes: string;
}
```

### 4. **Saves** (Bookmarks)
```typescript
interface Save {
  id: string;
  created_at: string;
  user: User;
  post: Post;
  collection: string; // 'default', 'deals', 'insights', etc.
  notes: string;
}
```

### 5. **Shares**
```typescript
interface Share {
  id: string;
  created_at: string;
  share_type: 'network' | 'external' | 'email' | 'copy_link';
  share_platform?: string; // 'linkedin', 'twitter', etc.
  user: User;
  post: Post;
  recipient_count: number;
  click_count: number;
}
```

### 6. **Views**
```typescript
interface View {
  id: string;
  created_at: string;
  user: User;
  post: Post;
  view_duration: number; // seconds
  is_complete: boolean; // viewed > 50% of content
  source: string; // 'feed', 'search', 'profile', etc.
}
```

### 7. **User Preferences**
```typescript
interface UserPreferences {
  id: string;
  user: User;
  
  // Feed preferences
  preferred_deal_sizes: string[];
  preferred_property_types: string[];
  preferred_locations: string[];
  preferred_post_types: string[];
  
  // Notification settings
  notifications: {
    new_deals: boolean;
    market_updates: boolean;
    mentions: boolean;
    connection_activity: boolean;
    deal_updates: boolean;
    trending_content: boolean;
  };
  
  // Privacy settings
  privacy: {
    profile_visibility: 'public' | 'connections' | 'private';
    show_online_status: boolean;
    allow_messages: boolean;
    show_activity: boolean;
  };
  
  // Feed algorithm preferences
  algorithm: {
    content_relevance_weight: number;
    connection_weight: number;
    engagement_weight: number;
    recency_weight: number;
    trending_weight: number;
  };
}
```

### 8. **Feed Analytics**
```typescript
interface FeedAnalytics {
  id: string;
  user: User;
  date: string;
  
  // Engagement metrics
  posts_viewed: number;
  posts_liked: number;
  posts_commented: number;
  posts_shared: number;
  posts_saved: number;
  
  // Time spent
  total_time_spent: number; // minutes
  average_session_duration: number;
  
  // Content preferences
  most_viewed_post_types: string[];
  most_engaged_authors: string[];
  preferred_deal_sizes: string[];
  preferred_locations: string[];
  
  // Recommendations
  recommended_connections: string[];
  recommended_topics: string[];
  recommended_deals: string[];
}
```

---

## 🔌 API Endpoints

### 1. **Feed Retrieval**
```typescript
// GET /api/feed
interface FeedRequest {
  page?: number;
  limit?: number;
  category?: 'all' | 'following' | 'trending' | 'saved' | 'discover';
  sort_by?: 'recent' | 'popular' | 'trending' | 'engagement';
  filters?: {
    post_types?: string[];
    sentiments?: string[];
    date_range?: string;
    has_media?: boolean;
    has_comments?: boolean;
    deal_size?: string;
    location?: string;
    property_type?: string[];
  };
  search?: string;
  user_id: string;
}

interface FeedResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  stats: {
    total_posts: number;
    new_posts: number;
    active_deals: number;
    trending_topics: number;
  };
  recommendations: {
    connections: User[];
    topics: string[];
    deals: Post[];
  };
}
```

### 2. **Post Interactions**
```typescript
// POST /api/posts/:id/reactions
interface ReactionRequest {
  reaction_type: string;
  user_id: string;
}

// POST /api/posts/:id/comments
interface CommentRequest {
  body: string;
  parent_comment_id?: string;
  user_id: string;
}

// POST /api/posts/:id/saves
interface SaveRequest {
  collection?: string;
  notes?: string;
  user_id: string;
}

// POST /api/posts/:id/shares
interface ShareRequest {
  share_type: string;
  share_platform?: string;
  user_id: string;
}

// POST /api/posts/:id/views
interface ViewRequest {
  view_duration?: number;
  source?: string;
  user_id: string;
}
```

### 3. **User Preferences**
```typescript
// GET /api/users/:id/preferences
// PUT /api/users/:id/preferences
interface UserPreferencesRequest {
  preferred_deal_sizes?: string[];
  preferred_property_types?: string[];
  preferred_locations?: string[];
  notifications?: object;
  privacy?: object;
  algorithm?: object;
}
```

### 4. **Search & Discovery**
```typescript
// GET /api/search
interface SearchRequest {
  query: string;
  type?: 'posts' | 'users' | 'properties' | 'deals';
  filters?: object;
  page?: number;
  limit?: number;
}

// GET /api/discover
interface DiscoverRequest {
  user_id: string;
  type: 'connections' | 'topics' | 'deals' | 'trending';
  limit?: number;
}
```

### 5. **Analytics & Insights**
```typescript
// GET /api/analytics/feed
interface FeedAnalyticsRequest {
  user_id: string;
  date_range?: string;
  metrics?: string[];
}

// GET /api/analytics/market
interface MarketAnalyticsResponse {
  sentiment: {
    overall: string;
    score: number;
    trend: string;
  };
  trends: {
    topics: string[];
    deal_sizes: object;
    locations: object;
    property_types: object;
  };
  insights: {
    active_deals: number;
    avg_deal_size: string;
    top_markets: string[];
    emerging_opportunities: string[];
  };
}
```

---

## 🏗️ Services

### 1. **Feed Service**
```typescript
class FeedService {
  async getFeed(request: FeedRequest): Promise<FeedResponse>;
  async getPersonalizedFeed(userId: string, preferences: UserPreferences): Promise<Post[]>;
  async getTrendingFeed(limit: number): Promise<Post[]>;
  async getFollowingFeed(userId: string, limit: number): Promise<Post[]>;
  async getSavedFeed(userId: string, limit: number): Promise<Post[]>;
  async getDiscoverFeed(userId: string, limit: number): Promise<Post[]>;
  async refreshFeed(userId: string): Promise<Post[]>;
}
```

### 2. **Engagement Service**
```typescript
class EngagementService {
  async addReaction(postId: string, userId: string, type: string): Promise<Reaction>;
  async removeReaction(postId: string, userId: string): Promise<void>;
  async addComment(postId: string, userId: string, body: string): Promise<Comment>;
  async savePost(postId: string, userId: string, collection?: string): Promise<Save>;
  async unsavePost(postId: string, userId: string): Promise<void>;
  async sharePost(postId: string, userId: string, type: string): Promise<Share>;
  async trackView(postId: string, userId: string, duration?: number): Promise<View>;
  async calculateEngagementScore(postId: string): Promise<number>;
}
```

### 3. **Recommendation Service**
```typescript
class RecommendationService {
  async getRecommendedConnections(userId: string, limit: number): Promise<User[]>;
  async getRecommendedTopics(userId: string, limit: number): Promise<string[]>;
  async getRecommendedDeals(userId: string, limit: number): Promise<Post[]>;
  async getPersonalizedContent(userId: string, preferences: UserPreferences): Promise<Post[]>;
  async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void>;
}
```

### 4. **Analytics Service**
```typescript
class AnalyticsService {
  async trackUserActivity(userId: string, activity: UserActivity): Promise<void>;
  async generateFeedAnalytics(userId: string, dateRange: string): Promise<FeedAnalytics>;
  async generateMarketInsights(): Promise<MarketAnalytics>;
  async calculateTrendingTopics(): Promise<string[]>;
  async updateEngagementScores(): Promise<void>;
}
```

### 5. **Notification Service**
```typescript
class NotificationService {
  async createNotification(userId: string, type: string, data: object): Promise<Notification>;
  async markAsRead(notificationId: string): Promise<void>;
  async getUnreadCount(userId: string): Promise<number>;
  async sendPushNotification(userId: string, notification: Notification): Promise<void>;
  async sendEmailNotification(userId: string, notification: Notification): Promise<void>;
}
```

---

## 🗄️ Database Schema

### 1. **Posts Table**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type VARCHAR(50) NOT NULL,
  body_md TEXT NOT NULL,
  sentiment VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Enhanced metadata
  deal_size VARCHAR(50),
  location VARCHAR(255),
  property_type VARCHAR(50),
  deal_stage VARCHAR(50),
  roi_estimate VARCHAR(20),
  market_trend VARCHAR(20),
  read_time INTEGER,
  engagement_score INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Relations
  author_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  discoverability_score INTEGER DEFAULT 0,
  
  -- Indexes
  INDEX idx_posts_type (post_type),
  INDEX idx_posts_sentiment (sentiment),
  INDEX idx_posts_created_at (created_at),
  INDEX idx_posts_engagement (engagement_score),
  INDEX idx_posts_trending (is_trending),
  INDEX idx_posts_featured (is_featured),
  INDEX idx_posts_location (location),
  INDEX idx_posts_property_type (property_type)
);
```

### 2. **Reactions Table**
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  weight INTEGER DEFAULT 1,
  
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  
  UNIQUE(user_id, post_id, reaction_type),
  INDEX idx_reactions_post (post_id),
  INDEX idx_reactions_user (user_id),
  INDEX idx_reactions_type (reaction_type)
);
```

### 3. **Comments Table**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  is_edited BOOLEAN DEFAULT FALSE,
  edit_history TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  parent_comment_id UUID REFERENCES comments(id),
  
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason VARCHAR(255),
  moderator_notes TEXT,
  
  INDEX idx_comments_post (post_id),
  INDEX idx_comments_user (user_id),
  INDEX idx_comments_parent (parent_comment_id)
);
```

---

## 🔐 Permissions & Security

### 1. **Role-Based Access Control**
```typescript
// User roles
enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  PREMIUM_USER = 'premium_user',
  STANDARD_USER = 'standard_user',
  GUEST = 'guest'
}

// Content permissions
interface ContentPermissions {
  can_create_posts: boolean;
  can_edit_posts: boolean;
  can_delete_posts: boolean;
  can_moderate_comments: boolean;
  can_view_analytics: boolean;
  can_access_premium_features: boolean;
}
```

### 2. **Rate Limiting**
```typescript
// Rate limits per endpoint
const rateLimits = {
  'GET /api/feed': { window: '1m', max: 60 },
  'POST /api/posts/:id/reactions': { window: '1m', max: 10 },
  'POST /api/posts/:id/comments': { window: '1m', max: 5 },
  'POST /api/posts/:id/shares': { window: '1m', max: 3 },
  'GET /api/search': { window: '1m', max: 30 }
};
```

### 3. **Content Moderation**
```typescript
interface ModerationRules {
  auto_flag_keywords: string[];
  spam_detection: boolean;
  profanity_filter: boolean;
  duplicate_detection: boolean;
  user_reputation_threshold: number;
}
```

---

## 🚀 Performance Optimizations

### 1. **Caching Strategy**
```typescript
// Redis cache keys
const cacheKeys = {
  feed: 'feed:{userId}:{category}:{page}',
  trending: 'trending:posts',
  recommendations: 'recommendations:{userId}',
  analytics: 'analytics:{userId}:{date}',
  user_preferences: 'preferences:{userId}'
};

// Cache TTL (Time To Live)
const cacheTTL = {
  feed: 300, // 5 minutes
  trending: 600, // 10 minutes
  recommendations: 1800, // 30 minutes
  analytics: 3600, // 1 hour
  user_preferences: 7200 // 2 hours
};
```

### 2. **Database Indexing**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_posts_feed_query ON posts (post_type, created_at, engagement_score);
CREATE INDEX idx_posts_trending ON posts (is_trending, engagement_score, created_at);
CREATE INDEX idx_reactions_engagement ON reactions (post_id, reaction_type, created_at);
CREATE INDEX idx_comments_thread ON comments (post_id, parent_comment_id, created_at);
```

### 3. **Pagination & Lazy Loading**
```typescript
interface PaginationConfig {
  default_limit: 20;
  max_limit: 100;
  cursor_based: boolean;
  include_total: boolean;
}
```

---

## 📊 Monitoring & Analytics

### 1. **Key Metrics**
```typescript
interface FeedMetrics {
  // Performance
  feed_load_time: number;
  api_response_time: number;
  cache_hit_rate: number;
  
  // Engagement
  daily_active_users: number;
  posts_per_user: number;
  engagement_rate: number;
  retention_rate: number;
  
  // Content
  posts_created: number;
  comments_per_post: number;
  shares_per_post: number;
  trending_topics: string[];
}
```

### 2. **Health Checks**
```typescript
interface HealthCheck {
  database: boolean;
  redis: boolean;
  external_apis: boolean;
  feed_generation: boolean;
  recommendation_engine: boolean;
}
```

---

## 🔄 Migration Strategy

### 1. **Phase 1: Core Feed**
- Implement basic post CRUD operations
- Add reaction and comment functionality
- Set up basic user preferences

### 2. **Phase 2: Advanced Features**
- Implement save/share functionality
- Add analytics tracking
- Build recommendation engine

### 3. **Phase 3: Optimization**
- Add caching layer
- Implement advanced filtering
- Optimize database queries

### 4. **Phase 4: Intelligence**
- Add AI-powered recommendations
- Implement content moderation
- Add predictive analytics

---

This specification provides a comprehensive foundation for building a scalable, feature-rich feed system that supports all the advanced features implemented in the frontend. The modular design allows for incremental implementation and easy extension as new features are added.