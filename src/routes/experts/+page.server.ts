import type { PageServerLoad } from './$types';
import { fetchConsultants } from '$lib/server/consultants.server';
import type { Consultant } from '$lib/types';

export const load: PageServerLoad<{ consultants: Consultant[] }> = async () => {
	const consultants = await fetchConsultants(100);
	return { consultants };
};
