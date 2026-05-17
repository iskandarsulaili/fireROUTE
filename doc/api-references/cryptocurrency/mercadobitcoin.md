# MercadoBitcoin

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `mercadobitcoin`
- Official pages manually reviewed in this pass:
  - `https://central.ajuda.mercadobitcoin.com.br/servicedesk/customer/portals?q=API`
  - `https://central.ajuda.mercadobitcoin.com.br/servicedesk/customer/portal/22/article/667123763?source=search`
  - `https://central.ajuda.mercadobitcoin.com.br/servicedesk/customer/portal/22/article/667811896?source=search`
  - `https://api.mercadobitcoin.net/api/v4/docs`
- Current official status confirmed from the reviewed pages: Mercado Bitcoin still exposes a live first-party API discovery layer through its help center, but the direct v4 docs host is blocked before the route-level reference becomes readable
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked Mercado Bitcoin's official API-discovery surfaces through the help center and the direct v4 docs host. The reviewed first-party pages still confirm that Mercado Bitcoin supports API-based integrations, distinguishes between data and negotiation usage, and provides API-key management guidance. However, the actual route reference remains blocked behind the docs host protection layer, so I could not verify concrete endpoints.

## What the reviewed official pages currently confirm
1. `https://central.ajuda.mercadobitcoin.com.br/servicedesk/customer/portals?q=API` currently renders `Central de Ajuda do MB - Jira Service Management` and exposes official API-related search results.
2. The reviewed help-center search currently surfaces these first-party entries:
   - `API de Dados`
   - `API de Negociação`
   - `API e integrações`
   - `Gestão de chave de API`
   - `Wallet out automatizado - API`
3. The visible help-center search snippets explicitly reference the current docs host `https://api.mercadobitcoin.net/api/v4/docs` and the public-data anchor `https://api.mercadobitcoin.net/api/v4/docs#tag/Public-Data`.
4. The same reviewed snippets confirm that Mercado Bitcoin distinguishes between a public/data API surface and a negotiation / trading API surface.
5. The reviewed `Gestão de chave de API` search snippet says an API key is composed of `nome`, `identificador`, and `segredo`, and frames that key as the authentication material for integration with the negotiation or data interfaces.
6. The direct help-center article URLs for `API e integrações` and `Gestão de chave de API` both still resolve as live first-party article pages, even though the browser session did not expose their full article bodies beyond the titles.
7. Direct navigation to `https://api.mercadobitcoin.net/api/v4/docs` currently renders `Attention Required! | Cloudflare` with `Sorry, you have been blocked` / `You are unable to access mercadobitcoin.net` before any Swagger / ReDoc route inventory becomes visible.
8. Because the docs host is blocked before the actual API reference loads, no trustworthy endpoint list, method table, request schema catalog, response examples, or error reference was visible in this review.

## Current blocker
This remains a docs-host access blocker, not a dead-provider case:
- Mercado Bitcoin still publishes first-party API discovery material in the help center
- the reviewed help-center snippets still point directly to the current v4 docs host
- the help-center discovery material still distinguishes data vs. negotiation API usage and key management
- but the actual docs host is blocked before its route-level content becomes readable

Because of that blocker, I could not responsibly confirm:
- exact base URL and route inventory
- HTTP methods per route
- request parameters and bodies
- authentication header names or signing rules
- pagination behavior
- numeric rate limits
- canonical response envelopes
- formal error schemas

## Important usage notes
- Treat Mercado Bitcoin as an active API provider with a blocked technical reference, not as a discontinued API.
- The most useful first-party discovery surface currently visible in-browser is the official help-center API search.
- The help-center evidence is strong enough to confirm an active API program, but not strong enough to infer exact routes.
- Re-check `https://api.mercadobitcoin.net/api/v4/docs` in a session that can pass its protection layer before claiming any route inventory.

## fireROUTE normalization notes
- Keep MercadoBitcoin marked `manually_documented` with `0` confirmed current routes.
- Preserve the blocker classification as docs-host access / route-visibility failure.
- Keep the category README docs URL pointed at the help-center discovery page unless Mercado Bitcoin restores readable public route documentation at the direct docs host.
