// @ts-expect-error: $env/static/private is a Vite/SvelteKit env import
import { VITE_STRAPI_URL, VITE_STRAPI_TOKEN } from '$env/static/private';

const BASE = VITE_STRAPI_URL!;
const AUTH_HEADER = { Authorization: `Bearer ${VITE_STRAPI_TOKEN!}` };

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
	author_name: string;
};

type StrapiMeta = unknown;

function getAttr(item: unknown): Record<string, unknown> {
	if (typeof item === 'object' && item !== null) {
		const obj = item as Record<string, unknown>;
		return (obj.attributes as Record<string, unknown>) || obj;
	}
	return {};
}

function getPropertyData(attr: Record<string, unknown>): TimelineItem['property_data'] {
	const property = (attr.property as any)?.data || attr.property;
	if (!property) return undefined;
	const prop = property.attributes || property;
	return {
		property_uid: prop.property_uid,
		title: prop.title,
		address: prop.address,
		property_type: prop.property_type,
		status: prop.status,
		headline_metric: prop.headline_metric,
		images:
			prop.images?.data?.map((img: { attributes: { url: string } }) => img.attributes.url) || [],
		roles: prop.roles || [],
		deal_size: prop.deal_size,
		irr: prop.irr,
		completion_percentage: prop.completion_percentage
	};
}

function getAuthorName(attr: Record<string, unknown>): string {
	const author = (attr.author as any)?.data || attr.author;
	if (!author) return 'Unknown';
	const authorAttr = author.attributes || author;
	const firstName = authorAttr.firstName || '';
	const lastName = authorAttr.lastName || '';
	return `${firstName} ${lastName}`.trim() || 'Unknown';
}

function mapStrapiTimelineItem(item: unknown): TimelineItem {
	const attr = getAttr(item);
	return {
		post_id: (attr.post_id as string) || (item as { id?: string }).id || '',
		person_id: (attr.author as any)?.data?.id || (attr.author as any)?.id || '',
		created_at: (attr.created_at as string) || (attr.createdAt as string) || '',
		body_md: (attr.body_md as string) || (attr.content as string) || '',
		media_urls: Array.isArray(attr.media_urls) ? (attr.media_urls as string[]) : [],
		property_uid: (attr.property_uid as string) || (attr.property as any)?.property_uid,
		post_type: (attr.post_type as string) || (attr.type as string) || '',
		sentiment: (attr.sentiment as string) || 'Neutral',
		visibility: (attr.visibility as string) || 'Public',
		reactions: Array.isArray(attr.reactions) ? attr.reactions : [],
		comments: Array.isArray(attr.comments) ? attr.comments : [],
		property_data: getPropertyData(attr),
		author_name: getAuthorName(attr)
	};
}

export async function fetchConsultantTimeline(
	personId: string
): Promise<{ items: TimelineItem[]; meta: StrapiMeta }> {
	const query = `populate=*` + `&filters[author][documentId][$eq]=${personId}`;

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
