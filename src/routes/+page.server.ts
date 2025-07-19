import type { PageServerLoad } from './$types';
import { fetchConsultants } from '$lib/server/consultants.server';
import type { Consultant } from '$lib/types';

export const load: PageServerLoad<{ featured: Consultant[] }> = async () => {
	const featured = await fetchConsultants(3);
	return { featured };
};
