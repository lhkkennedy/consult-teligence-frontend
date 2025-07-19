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
export type Region = 'North America' | 'South America' | 'Europe' | 'Africa' | 'Asia' | 'Middle East' | 'Oceania';
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
export type PostType = 'NewListing' | 'ProgressUpdate' | 'Closing' | 'Insight' | 'Generic';
export type Sentiment = 'Bull' | 'Bear' | 'Neutral';
export type Visibility = 'Public' | 'Connections' | 'Private';

export interface TimelinePost {
	post_id: string;
	person_id: string;
	created_at: string;
	body_md: string;
	media_urls: string[];
	property_uid?: string;
	post_type: PostType;
	sentiment: Sentiment;
	visibility: Visibility;
	reactions?: TimelineReaction[];
	comments?: TimelineComment[];
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
