/** @param {string | undefined} contentType @param {string} rawBody */
export function parseContactBody(contentType = '', rawBody = '') {
	if (contentType.includes('application/json')) {
		try {
			return JSON.parse(rawBody || '{}');
		} catch {
			return null;
		}
	}

	if (contentType.includes('application/x-www-form-urlencoded')) {
		const params = new URLSearchParams(rawBody);
		return {
			name: params.get('name'),
			email: params.get('email'),
			message: params.get('message')
		};
	}

	return null;
}

/** @param {Record<string, string | undefined>} headers */
export function wantsJsonResponse(headers) {
	const accept = headers.accept || headers.Accept || '';
	const contentType = headers['content-type'] || headers['Content-Type'] || '';
	return accept.includes('application/json') || contentType.includes('application/json');
}

/** @param {{ name: string; email: string; message: string }} payload @param {{ supabaseUrl: string; apiKey: string }} env */
export async function saveContactMessage({ name, email, message }, { supabaseUrl, apiKey }) {
	if (!supabaseUrl || !apiKey) {
		throw new Error('Contact form is not configured on the server');
	}

	const response = await fetch(`${supabaseUrl}/rest/v1/visitor`, {
		method: 'POST',
		headers: {
			apikey: apiKey,
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			Prefer: 'return=minimal'
		},
		body: JSON.stringify({ name, mail: email, msg: message })
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || 'Could not save message');
	}
}

/** @param {{ httpMethod: string; headers: Record<string, string | undefined>; body: string }} event @param {{ supabaseUrl?: string; apiKey?: string }} env */
export async function handleContactRequest(event, env) {
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Method not allowed'
		};
	}

	const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
	const body = parseContactBody(contentType, event.body);

	if (!body) {
		return {
			statusCode: 400,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Invalid form submission'
		};
	}

	const name = String(body.name || '').trim();
	const email = String(body.email || '').trim();
	const message = String(body.message || '').trim();
	const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	if (!name || !emailOk || !message) {
		const asJson = wantsJsonResponse(event.headers);
		return {
			statusCode: 400,
			headers: { 'Content-Type': asJson ? 'application/json' : 'text/plain' },
			body: asJson
				? JSON.stringify({ error: 'Name, email, and message are required' })
				: 'Name, email, and message are required'
		};
	}

	try {
		await saveContactMessage(
			{ name, email, message },
			{ supabaseUrl: env.supabaseUrl || '', apiKey: env.apiKey || '' }
		);
	} catch (error) {
		const asJson = wantsJsonResponse(event.headers);
		const messageText = error instanceof Error ? error.message : 'Could not save message';
		return {
			statusCode: 500,
			headers: { 'Content-Type': asJson ? 'application/json' : 'text/plain' },
			body: asJson ? JSON.stringify({ error: messageText }) : messageText
		};
	}

	if (wantsJsonResponse(event.headers)) {
		return {
			statusCode: 200,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ok: true })
		};
	}

	return {
		statusCode: 303,
		headers: { Location: '/?sent=1#contact' },
		body: ''
	};
}
