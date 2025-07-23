import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// You can add any server-side data loading here if needed
	// For example, loading office locations from a database
	// or fetching contact information from environment variables
	
	return {
		// Add any data you want to pass to the page
	};
};