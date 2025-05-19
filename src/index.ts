interface Env {
	CORS_ALLOW_ORIGIN: string;
	SIM_API_KEY: string;
}

export default {
	async fetch(request: Request, env: Env) {
		// If the request is an OPTIONS request, return a 200 response with permissive CORS headers
		// This is required for the Sim Proxy to work from the browser and arbitrary origins
		// If you wish to restrict the origins that can access your Sim Proxy, you can do so by
		// changing the `*` in the `Access-Control-Allow-Origin` header to a specific origin.
		// For example, if you wanted to allow requests from `https://example.com`, you would change the
		// header to `https://example.com`. Multiple domains are supported by verifying that the request
		// originated from one of the domains in the `CORS_ALLOW_ORIGIN` environment variable.
		const supportedDomains = env.CORS_ALLOW_ORIGIN?.split(',');
		const headers = {
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, OPTIONS',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Origin': supportedDomains
				? request.headers.get('Origin')
					? supportedDomains.includes(request.headers.get('Origin')!)
						? request.headers.get('Origin')!
						: undefined
					: undefined
				: '*',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 200,
				headers: headers as Record<string, string>,
			});
		}

		const url = new URL(request.url);

		// Clone the request to modify headers
		const req = new Request(`https://api.sim.dune.com${url.pathname}${url.search}`, {
			...request,
			headers: new Headers({
				...Object.fromEntries(request.headers.entries()),
				'X-Sim-Api-Key': env.SIM_API_KEY,
			}),
		});

		return fetch(req);
	},
};
