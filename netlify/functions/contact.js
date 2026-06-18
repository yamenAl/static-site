import { handleContactRequest } from '../lib/handleContact.js';

export async function handler(event) {
	const apiKey =
		process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	return handleContactRequest(event, {
		supabaseUrl: process.env.PUBLIC_SUPABASE_URL,
		apiKey
	});
}
