import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase
		.from('info')
		.select('display_name, first_name')
		.limit(1)
		.maybeSingle();

	const name = data?.display_name || data?.first_name || 'Yamen';

	return {
		firstName: name.split(' ')[0].toLowerCase()
	};
}
