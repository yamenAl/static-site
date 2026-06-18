// Saves a contact form submission to the Supabase visitor table.

import { supabase } from '$lib/supabaseClient';

export async function submitContactMessage({ name, email, message }) {
	const { error } = await supabase.from('visitor').insert({
		name,
		mail: email,
		msg: message
	});

	if (error) throw error;
}
