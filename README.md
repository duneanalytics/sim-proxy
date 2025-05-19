# Dune Sim Proxy

This repo hosts a one-click-deploy Cloudflare worker that proxies requests to Dune's Sim APIs.
The proxy will allow you to keep your API key hidden from public requests made by clients.
You will need both a [Sim](https://sim.dune.com/) account and a [Cloudflare](https://cloudflare.com) account to deploy this.

Sim APIs offers 100k monthly API calls and 5 requests per second for free.
Cloudflare workers can execute 100k invocations each day for free.
Most projects can easily get started within these free tiers.

## Setup

### Step 1

Press the button below to deploy this to your own Cloudflare account:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/duneanalytics/sim-proxy)

### Step 2

Navigate to your newly deployed worker, and click "Settings" and then "Variables":

### Step 3

Add a new variable with the key name `SIM_API_KEY` and your [Sim API key](https://docs.sim.dune.com/#authentication) as the value:

> NOTE: We recommend selecting "Encrypt". This will hide your key from the UI and API responses, and redact them from logs.

### Step 4

Refresh the page and confirm that your API key is saved and encrypted.

You can now use your worker URL as the base Sim API endpoint in all SDK and client side configurations without leaking your API key.

# Additional Security Steps

This implementation is intentionally left in a less-than-ideal security state to facilitate easy deployment by anyone.
If you would like to lock down your Sim Proxy further, consider the following steps after you have successfully deployed the worker:

1. Update the `Access-Control-Allow-Origin` header by adding a new variable with the key name `CORS_ALLOW_ORIGIN` to contain the host that your requests are coming from (usually your client application). For example, if you wanted to allow requests from `https://example.com`, you would change the header to `https://example.com`. To support multiple domains, set `CORS_ALLOW_ORIGIN` to a comma separated list of domains (e.g. `https://example.com,https://beta.example.com`).
2. [Cloudflare Web Application Firewall (WAF)](https://www.cloudflare.com/lp/ppc/waf-x/) - You can configure the WAF to inspect requests and allow/deny based on your own business logic.