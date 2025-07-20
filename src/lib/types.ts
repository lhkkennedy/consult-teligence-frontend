// Remove the problematic import for now

export interface Consultant {
	documentId: string;
	id: number;
	user?: {
		id: number;
		username: string;
		email: string;
	};
	firstName: string;
	lastName: string;
	location: string;
	company: string;
	currentRole: string;
	functionalExpertise: string[];
	geographicalExpertise: string;
	countryExpertise: string;
	rate: number;
	bio: string;
	education: string;
	certifications: string[];
	languages: string[];
	profileImage: string;
	contactInfo: ContactInfo;
	availability: string;
	testimonials: Testimonial[];
	caseStudies: CaseStudy[];
}

export interface ContactInfo {
	email: string;
	phone: string;
	linkedin: string;
}

export interface Testimonial {
	id: number;
	name: string;
	company: string;
	text: string;
}

export interface CaseStudy {
	id: number;
	title: string;
	description: string;
}

// Basic types for regions, countries, and specialties
export type Region =
	| 'North America'
	| 'South America'
	| 'Europe'
	| 'Africa'
	| 'Asia'
	| 'Middle East'
	| 'Oceania';
export type Country = string;
export type Specialty = string;
export type SubSpecialty = string;

export interface SearchFilters {
	region?: Region;
	country?: Country;
	specialties?: Specialty[];
	keyword?: string;
}

// PageLoad type removed to avoid import issues

export interface RawConsultant {
	id: number;
	documentId: string;
	user?: {
		id: number;
		username: string;
		email: string;
	};
	firstName: string;
	lastName: string;
	location: string;
	company: string;
	currentRole: string;
	functionalExpertise: string[];
	geographicalExpertise: string;
	countryExpertise: string;
	rate: number;
	bio: string;
	education: string;
	certifications: string[];
	languages: string[];
	availability: string;
	// media is an array, choose the first
	profileImage: Array<{
		url: string;
		formats?: Record<string, { url: string }>;
	}>;
	contactInfo: {
		id: number;
		Email: string;
		Phone: string;
		LinkedIn: string;
	};
	testimonials: Array<{ id: number; name: string; company: string; text: string }>;
	caseStudies: Array<{ id: number; title: string; description: string }>;
}

export interface ConsultantsResponse {
	data: RawConsultant[];
	meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

// Timeline Types
export type PostType = 'NewListing' | 'ProgressUpdate' | 'Closing' | 'Insight' | 'Generic' | 'property';
export type Sentiment = 'Bull' | 'Bear' | 'Neutral';
export type Visibility = 'Public' | 'Connections' | 'Private';

export interface TimelinePost {
	post_id: string;
	person_id: string;
	author_id?: string; // Added for API compatibility
	author_name?: string; // Added for API compatibility
	author_avatar?: string; // Added for API compatibility
	author_company?: string; // Added for API compatibility
	author_role?: string; // Added for API compatibility
	author_verified?: boolean; // Added for API compatibility
	author_followers?: number; // Added for API compatibility
	created_at: string;
	updated_at?: string; // Added for API compatibility
	body_md: string;
	media_urls: string[];
	property_uid?: string;
	property_data?: Property; // Added for API compatibility
	post_type: PostType;
	sentiment: Sentiment;
	visibility: Visibility;
	reactions?: TimelineReaction[];
	comments?: TimelineComment[];
	// Additional properties for enhanced feed functionality
	engagement_score?: number; // Added for API compatibility
	deal_size?: string; // Added for API compatibility
	location?: string; // Added for API compatibility
	property_type?: string; // Added for API compatibility
	is_trending?: boolean; // Added for API compatibility
	is_featured?: boolean; // Added for API compatibility
	read_time?: number; // Added for API compatibility
	tags?: string[]; // Added for API compatibility
	view_count?: number; // Added for API compatibility
	share_count?: number; // Added for API compatibility
	save_count?: number; // Added for API compatibility
	deal_stage?: string; // Added for API compatibility
	roi_estimate?: string; // Added for API compatibility
	market_trend?: string; // Added for API compatibility
}

export interface TimelineReaction {
	id: string;
	user_id: string;
	reaction_type: 'like' | 'love' | 'celebrate' | 'insightful';
	created_at: string;
}

export interface TimelineComment {
	id: string;
	user_id: string;
	body: string;
	created_at: string;
	user_name: string;
	user_avatar?: string;
}

export interface Property {
	property_uid: string;
	title: string;
	address: string;
	property_type: string;
	status: 'Under Construction' | 'Stabilised' | 'Exited' | 'Planning';
	headline_metric?: string;
	images: string[];
	roles: string[];
	deal_size?: number;
	irr?: number;
	completion_percentage?: number;
}

export interface PortfolioStats {
	total_gfa: number;
	total_aum: number;
	deal_count: number;
	avg_deal_size: number;
}

// Friend System Types
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
	id: number;
	from: User;
	to: User;
	status: FriendRequestStatus;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	profileImage?: string;
	company?: string;
	currentRole?: string;
	location?: string;
	documentId?: string; // For navigation to expert profiles
}

export interface FriendSystemResponse {
	data: FriendRequest[];
	meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

export interface FriendsListResponse {
	data: User[];
	meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}
