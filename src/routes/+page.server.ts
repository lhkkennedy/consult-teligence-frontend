import type { PageLoad } from './$types';
import { fetchConsultants } from '$lib/server/consultants.server';

export const load: PageLoad<{ featured: Consultant[] }> = async () => {
	const featured = await fetchConsultants(3);
	console.log('🏠 [home] fetched featured:', featured.length, 'items');
	return { featured };
};
