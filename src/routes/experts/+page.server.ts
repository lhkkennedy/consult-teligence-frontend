import type { PageLoad } from './$types';
import { fetchConsultants } from '$lib/server/consultants.server';

export const load: PageLoad<{ consultants: Consultant[] }> = async () => {
	const consultants = await fetchConsultants(100);
	return { consultants };
};
