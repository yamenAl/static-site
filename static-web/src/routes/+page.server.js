import { supabase } from '$lib/supabaseClient';

const PAGE_SIZE = 4;

const defaultAbout =
	'I care about the unglamorous craft — the empty states, the error copy, the exact moment a feature first makes sense to someone.';

/** @param {string | null | undefined} url */
function cleanUrl(url) {
	return url?.replace(/\$\d+$/, '').trim() ?? '';
}

/** @param {string | null | undefined} text */
function isPlaceholder(text) {
	const value = text?.trim().toLowerCase();
	return !value || value === 'body';
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

/** @param {Record<string, string | null | undefined> | null | undefined} info */
function buildFacts(info) {
	/** @type {{ k: string; v: string }[]} */
	const facts = [];

	if (info?.Adress?.trim()) facts.push({ k: 'Based', v: info.Adress.trim() });
	if (info?.work?.trim()) facts.push({ k: 'Now', v: info.work.trim() });
	if (info?.languages?.trim()) facts.push({ k: 'Languages', v: info.languages.trim() });

	return facts;
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

/** @param {ReturnType<typeof buildProjects>} projects */
function buildTickerItems(projects) {
	return projects.map((project) => project.name).filter(Boolean);
}

/** @param {any} homePage @param {any} info @param {ReturnType<typeof buildProjects>} projects */
function buildPageData(homePage, info, projects) {
	const displayName =
		info?.display_name?.trim() ||
		[info?.first_name, info?.last_name].filter(Boolean).join(' ').trim() ||
		homePage?.name?.trim() ||
		'';

	const firstName =
		info?.first_name?.trim().split(' ')[0] ||
		displayName.split(' ')[0] ||
		'';
	const lastName = info?.last_name?.trim() || displayName.split(' ').slice(1).join(' ');
	const year = new Date().getFullYear();
	const aboutText = homePage?.body?.trim();
	const about = !isPlaceholder(aboutText) ? aboutText : defaultAbout;

	return {
		profile: { homePage, info },
		displayName,
		firstName,
		lastName,
		roleHtml: homePage?.title?.trim() || '',
		about,
		socials: buildSocials(info),
		meta: [`©${year}`, ...(info?.Adress?.trim() ? [info.Adress.trim()] : [])],
		tickerItems: buildTickerItems(projects),
		projects,
		facts: buildFacts(info),
		year,
		email: info?.my_mail?.trim() || ''
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
