import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { handleContactRequest } from '../netlify/lib/handleContact.js';

/** @param {import('http').IncomingMessage} req */
function readRequestBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		req.on('data', (chunk) => chunks.push(chunk));
		req.on('end', () => resolve(Buffer.concat(chunks).toString()));
		req.on('error', reject);
	});
}

/** Dev-only handler so the contact form works without Netlify CLI. */
function contactFormDevPlugin() {
	return {
		name: 'contact-form-dev',
		enforce: 'pre',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const path = req.url?.split('?')[0];
				if (path !== '/.netlify/functions/contact') return next();

				if (req.method !== 'POST') {
					res.statusCode = 405;
					res.end('Method not allowed');
					return;
				}

				try {
					const body = await readRequestBody(req);
					const env = loadEnv(server.config.mode, server.config.envDir, '');
					const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
					const result = await handleContactRequest(
						{
							httpMethod: req.method,
							headers: req.headers,
							body
						},
						{
							supabaseUrl: env.PUBLIC_SUPABASE_URL,
							apiKey
						}
					);

					res.statusCode = result.statusCode;
					for (const [key, value] of Object.entries(result.headers || {})) {
						res.setHeader(key, value);
					}
					res.end(result.body);
				} catch (error) {
					res.statusCode = 500;
					res.end(error instanceof Error ? error.message : 'Server error');
				}
			});
		}
	};
}

export default defineConfig({
	plugins: [contactFormDevPlugin(), sveltekit()]
});
