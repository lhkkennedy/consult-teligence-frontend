import type { PageServerLoad } from './$types';
import { fetchConsultant } from '$lib/server/consultants.server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const docId = params.documentId;
	if (!docId) throw error(400, 'Missing documentId');
	const activeProfile = await fetchConsultant(docId);
	return { activeProfile };
};
