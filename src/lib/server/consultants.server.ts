// src/lib/server/consultants.server.ts
import { VITE_STRAPI_URL, VITE_STRAPI_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Consultant, RawConsultant, ConsultantsResponse } from '$lib/types';

const BASE = VITE_STRAPI_URL || 'http://localhost:1337';

function getAuthHeaders() {
	return VITE_STRAPI_TOKEN ? { Authorization: `Bearer ${VITE_STRAPI_TOKEN}` } : {};
}

function mapRaw(item: RawConsultant): Consultant {
	// if your RawConsultant.profileImage is an array, pick [0].url, adjust here
	const url =
		Array.isArray(item.profileImage) && item.profileImage[0]?.url
			? `${BASE}${item.profileImage[0].url}`
			: item.profileImage?.url
				? `${BASE}${item.profileImage.url}`
				: '/default-avatar.png';

	const contactInfo = item.contactInfo || {};

	return {
		documentId: item.documentId,
		id: item.id,
		firstName: item.firstName,
		lastName: item.lastName,
		location: item.location,
		company: item.company,
		currentRole: item.currentRole,
		functionalExpertise: item.functionalExpertise,
		geographicalExpertise: item.geographicalExpertise,
		countryExpertise: item.countryExpertise,
		rate: item.rate,
		bio: item.bio,
		education: item.education,
		certifications: item.certifications ?? [],
		languages: item.languages,
		availability: item.availability,
		profileImage: url,
		contactInfo: {
			email: contactInfo.Email ?? null,
			phone: contactInfo.Phone ?? null,
			linkedin: contactInfo.LinkedIn ?? null
		},
		testimonials: item.testimonials ?? [],
		caseStudies: item.caseStudies ?? []
	};
}

export async function fetchConsultants(limit?: number): Promise<Consultant[]> {
	const params = new URLSearchParams({ populate: '*' });
	if (limit) params.set('pagination[limit]', limit.toString());

	const res = await fetch(`${BASE}/api/consultants?${params}`, {
		headers: getAuthHeaders()
	});
	if (!res.ok) {
		throw new Error(`Could not fetch list: ${res.statusText}`);
	}
	const { data } = (await res.json()) as ConsultantsResponse;
	return data.map(mapRaw);
}

export async function fetchConsultant(documentId: string): Promise<Consultant> {
	const res = await fetch(`${BASE}/api/consultants/${documentId}?populate=*`, {
		headers: getAuthHeaders()
	});
	if (res.status === 404) throw error(404, `Not found`);
	if (!res.ok) throw error(res.status, res.statusText);
	const { data } = (await res.json()) as { data: RawConsultant };
	return mapRaw(data);
}
