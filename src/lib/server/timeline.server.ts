// @ts-expect-error: $env/static/private is a Vite/SvelteKit env import
import { VITE_STRAPI_URL, VITE_STRAPI_TOKEN } from '$env/static/private';

const BASE = VITE_STRAPI_URL!;
const AUTH_HEADER = { Authorization: `Bearer ${VITE_STRAPI_TOKEN!}` };

// Types for Strapi API responses
interface StrapiMedia {
	id: string | number;
	attributes: {
		url: string;
	};
}

interface StrapiProperty {
	id: string;
	attributes: {
		property_uid: string;
		title: string;
		address: string;
		property_type: string;
		status: string;
		headline_metric: string;
		images?: { data: StrapiMedia[] };
		roles?: string[];
		deal_size?: number;
		irr?: number;
		completion_percentage?: number;
	};
}

interface StrapiConsultant {
	id: string;
	attributes: Record<string, unknown>;
}

interface StrapiTimelineItem {
	id: string;
	attributes: {
		post_id?: string;
		created_at?: string;
		body_md?: string;
		media_urls?: string[];
		post_type?: string;
		sentiment?: string;
		visibility?: string;
		reactions?: unknown[];
		comments?: unknown[];
		property_uid?: string;
		property?: { data?: StrapiProperty | null };
		author?: { data?: StrapiConsultant | null };
		createdAt?: string;
		type?: string;
		content?: string;
	};
}

type TimelineItem = {
	post_id: string;
	person_id: string;
	created_at: string;
	body_md: string;
	media_urls: string[];
	property_uid?: string;
	post_type: string;
	sentiment: string;
	visibility: string;
	reactions: unknown[];
	comments: unknown[];
	property_data?: {
		property_uid: string;
		title: string;
		address: string;
		property_type: string;
		status: string;
		headline_metric: string;
		images: string[];
		roles: string[];
		deal_size?: number;
		irr?: number;
		completion_percentage?: number;
	};
};

type StrapiMeta = unknown; // Replace with a more specific type if available

function mapStrapiTimelineItem(item: StrapiTimelineItem): TimelineItem {
	const attr = item.attributes || {};
	let property_data: TimelineItem['property_data'] = undefined;
	const property = attr.property?.data;
	if (property && property.attributes) {
		const prop = property.attributes;
		property_data = {
			property_uid: prop.property_uid,
			title: prop.title,
			address: prop.address,
			property_type: prop.property_type,
			status: prop.status,
			headline_metric: prop.headline_metric,
			images: prop.images?.data?.map((img) => img.attributes.url) || [],
			roles: prop.roles || [],
			deal_size: prop.deal_size,
			irr: prop.irr,
			completion_percentage: prop.completion_percentage
		};
	}
	return {
		post_id: attr.post_id || item.id,
		person_id: attr.author?.data?.id || '',
		created_at: attr.created_at || attr.createdAt || '',
		body_md: attr.body_md || attr.content || '',
		media_urls: Array.isArray(attr.media_urls) ? attr.media_urls : [],
		property_uid: attr.property_uid || property?.attributes?.property_uid,
		post_type: attr.post_type || attr.type || '',
		sentiment: attr.sentiment || 'Neutral',
		visibility: attr.visibility || 'Public',
		reactions: Array.isArray(attr.reactions) ? attr.reactions : [],
		comments: Array.isArray(attr.comments) ? attr.comments : [],
		property_data
	};
}

export async function fetchConsultantTimeline(personId: string): Promise<{ items: TimelineItem[]; meta: StrapiMeta }> {
	const query =
		`populate=*` + 
		`&filter[author][documentId][$eq]=${personId}`;

	const res = await fetch(`${BASE}/api/timeline-items?${query}`, {
		headers: AUTH_HEADER
	});
	if (!res.ok) {
		throw new Error(`Could not fetch timeline: ${res.statusText}`);
	}
	const data = await res.json();
	return {
		items: (data.data || []).map(mapStrapiTimelineItem),
		meta: data.meta as StrapiMeta
	};
} 