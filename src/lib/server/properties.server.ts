import { VITE_STRAPI_URL, VITE_STRAPI_TOKEN } from '$env/static/private';

const BASE = VITE_STRAPI_URL || 'http://localhost:1337';

function getAuthHeaders() {
	return VITE_STRAPI_TOKEN ? { Authorization: `Bearer ${VITE_STRAPI_TOKEN}` } : {};
}

type PropertyTimelineItem = {
	property_uid: string;
	title: string;
	address: string;
	property_type: string;
	status: string;
	headline_metric?: string;
	images: string[];
	roles: string[];
	deal_size?: number;
	irr?: number;
	completion_percentage?: number;
};

type StrapiMeta = unknown; // Replace with a more specific type if available

function mapStrapiPropertyTimelineItem(item: unknown): PropertyTimelineItem {
	const attr = (item as any).attributes || item;
	const property = attr.property?.data || attr.property || {};
	const prop = property.attributes || property;
	return {
		property_uid: prop.property_uid || property.id,
		title: prop.title,
		address: prop.location || prop.address,
		property_type: prop.property_type,
		status: prop.status,
		headline_metric: prop.headline_metric,
		images: prop.images?.data?.map((img: any) => img.attributes.url) || [],
		roles: prop.roles || [],
		deal_size: prop.deal_size,
		irr: prop.irr,
		completion_percentage: prop.completion_percentage
	};
}

export async function fetchConsultantProperties(
	personId: string,
	page: number = 1,
	pageSize: number = 10
): Promise<{ items: PropertyTimelineItem[]; meta: StrapiMeta }> {
	const query = `populate=*` + `&filters[author][documentId][$eq]=${personId}`;

	const res = await fetch(`${BASE}/api/timeline-items?${query}`, {
		headers: getAuthHeaders()
	});
	if (!res.ok) {
		throw new Error(`Could not fetch properties: ${res.statusText}`);
	}
	const data = await res.json();
	return {
		items: (data.data || []).map(mapStrapiPropertyTimelineItem),
		meta: data.meta as StrapiMeta
	};
}
