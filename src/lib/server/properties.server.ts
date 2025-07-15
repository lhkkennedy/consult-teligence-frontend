import { VITE_STRAPI_URL, VITE_STRAPI_TOKEN } from '$env/static/private';

const BASE = VITE_STRAPI_URL!;
const AUTH_HEADER = { Authorization: `Bearer ${VITE_STRAPI_TOKEN!}` };

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
	const attr = (item as Record<string, unknown>).attributes || {};
	const property = (attr as any).property?.data?.attributes || {};
	return {
		property_uid: (attr as any).property?.data?.id,
		title: property.title,
		address: property.location,
		property_type: property.property_type,
		status: property.status,
		headline_metric: property.headline_metric,
		images: property.images?.data?.map((img: unknown) => (img as any).attributes.url) || [],
		roles: property.roles || [],
		deal_size: property.deal_size,
		irr: property.irr,
		completion_percentage: property.completion_percentage
	};
}

export async function fetchConsultantProperties(personId: string, page: number = 1, pageSize: number = 10): Promise<{ items: PropertyTimelineItem[]; meta: StrapiMeta }> {
	const query =
		`populate=*` + 
		`&filter[author][documentId][$eq]=${personId}`;

	const res = await fetch(`${BASE}/api/timeline-items?${query}`, {
		headers: AUTH_HEADER
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