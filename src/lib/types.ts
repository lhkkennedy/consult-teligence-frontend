import type { PageLoad as KitPageLoad } from '@sveltejs/kit';

export interface Consultant {
	documentId: string;
	id: number;
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

export interface SearchFilters {
	region?: Region;
	country?: Country;
	specialties?: Specialty[];
	keyword?: string;
}

export type PageLoad = KitPageLoad<{ consultants: Consultant[] }>;

export interface RawConsultant {
	id: number;
	documentId: string;
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
