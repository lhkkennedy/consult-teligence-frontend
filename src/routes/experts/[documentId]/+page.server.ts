import type { PageServerLoad } from './$types';
import { fetchConsultant } from '$lib/server/consultants.server';
import { fetchConsultantTimeline } from '$lib/server/timeline.server';
import { fetchConsultantProperties } from '$lib/server/properties.server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const docId = params.documentId;
	if (!docId) throw error(400, 'Missing documentId');
	const activeProfile = await fetchConsultant(docId);
	const { items: timelineItems } = await fetchConsultantTimeline(docId);
	const { items: properties } = await fetchConsultantProperties(docId);
	console.log(properties)
	return { activeProfile, timelineItems, properties };
};
