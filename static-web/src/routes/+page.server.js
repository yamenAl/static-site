import { supabase } from '$lib/supabaseClient';

const tickerItems = [
	"Appstore Editors' Choice",
	'App of the Day',
	'One of 50 Essential UX Portfolios',
	'Interaction Latin America — Speaker'
];

const PAGE_SIZE = 4;

const defaultFacts = [
	{ k: 'Based', v: 'Berlin, DE' },
	{ k: 'Now', v: 'Senior PD, N26' },
	{ k: 'Focus', v: 'Mobile · Systems · Research' },
	{ k: 'Speaking', v: 'Interaction LATAM' }
];

const defaultAbout =
	'I care about the unglamorous craft — the empty states, the error copy, the exact moment a feature first makes sense to someone.';

/** @param {string | null | undefined} url */
function cleanUrl(url) {
	return url?.replace(/\$\d+$/, '').trim() ?? '';
}

/** @param {Record<string, string | null | undefined> | null | undefined} info */
function buildSocials(info) {
	/** @type {{ label: string; href: string }[]} */
	const socials = [];

	if (info?.linkedin) socials.push({ label: 'LinkedIn', href: cleanUrl(info.linkedin) });
	if (info?.instagram) socials.push({ label: 'Instagram', href: cleanUrl(info.instagram) });
	if (info?.GitHub) socials.push({ label: 'GitHub', href: cleanUrl(info.GitHub) });

	return socials;
}

/** @param {string | null | undefined} address */
function cityFromAddress(address) {
	const city = address?.split(',')[0]?.trim();
	return city || 'Berlin';
}

/** @param {Record<string, string | null | undefined> | null | undefined} info */
function buildFacts(info) {
	return [
		{ k: 'Based', v: info?.Adress?.trim() || defaultFacts[0].v },
		{ k: 'Now', v: info?.work?.trim() || defaultFacts[1].v },
		{ k: 'Focus', v: defaultFacts[2].v },
		{ k: 'Speaking', v: info?.languages?.trim() || defaultFacts[3].v }
	];
}

/** @param {any[] | null | undefined} rows */
function buildProjects(rows) {
	if (!rows?.length) return [];

	return rows.map((project) => ({
		id: project.id,
		name: project.name?.trim() || 'Untitled',
		em: '',
		tags: '',
		year: String(project.year_made ?? ''),
		href: cleanUrl(project.link)
	}));
}

/** @param {any} homePage @param {any} info @param {ReturnType<typeof buildProjects>} projects */
function buildPageData(homePage, info, projects) {
	const displayName =
		info?.display_name?.trim() ||
		[info?.first_name, info?.last_name].filter(Boolean).join(' ').trim() ||
		homePage?.name ||
		'Yamen';

	const firstName = info?.first_name?.trim() || displayName.split(' ')[0] || 'Yamen';
	const lastName = info?.last_name?.trim() || displayName.split(' ').slice(1).join(' ');
	const year = new Date().getFullYear();
	const aboutText = homePage?.body?.trim();
	const about = aboutText && aboutText.toLowerCase() !== 'body' ? aboutText : defaultAbout;

	return {
		profile: { homePage, info },
		displayName,
		firstName,
		lastName,
		roleHtml: homePage?.title
			? homePage.title
			: 'Senior Product Designer at <em>N26</em>, Berlin — building things people actually want to use.',
		about,
		socials: buildSocials(info),
		meta: [`©${year}`, info?.Adress ?? 'Berlin 52.52°N', 'Portfolio / Vol.01'],
		tickerItems,
		projects,
		facts: buildFacts(info),
		designedIn: cityFromAddress(info?.Adress),
		year
	};
}

export async function load() {
	const [homePageRes, infoRes, projectsRes] = await Promise.all([
		supabase.from('homePage').select('*').limit(1).maybeSingle(),
		supabase.from('info').select('*').limit(1).maybeSingle(),
		supabase
			.from('projects')
			.select('*')
			.order('year_made', { ascending: false })
			.order('created_at', { ascending: false })
	]);

	const error =
		homePageRes.error?.message ??
		infoRes.error?.message ??
		projectsRes.error?.message ??
		null;

	return {
		...buildPageData(homePageRes.data, infoRes.data, buildProjects(projectsRes.data)),
		error
	};
}
