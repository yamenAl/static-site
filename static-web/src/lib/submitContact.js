import { supabase } from '$lib/supabaseClient';

/**
 * @param {{ name: string; email: string; message: string }} payload
 */
export async function submitContactMessage({ name, email, message }) {
	const { error } = await supabase.from('visitor').insert({
		name,
		mail: email,
		msg: message
	});

	if (error) throw error;
}
