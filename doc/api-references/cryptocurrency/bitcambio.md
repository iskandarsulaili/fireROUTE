# Bitcambio

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `bitcambio`
- Official pages manually reviewed in this pass:
  - `https://bitcambio.com.br/`
  - `https://nova.bitcambio.com.br/api/v3/docs`
- Current first-party status confirmed from the reviewed pages: Bitcambio's public exchange site is still live and still advertises an API product, but the first-party docs host currently fails behind a Cloudflare infrastructure error before any route reference loads
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked Bitcambio from the live official homepage and the advertised official docs URL. Bitcambio is still operating publicly as a cryptocurrency exchange and still markets an API integration surface, but the current first-party docs host does not expose technical documentation in this environment.

## What the reviewed official pages currently confirm
1. `https://bitcambio.com.br/` is live and presents Bitcambio as a Brazilian exchange / trading platform.
2. The homepage hero still advertises trading terms such as `0,1% TAKER 0,1% MAKER` and `Compra e venda Bitcoins com a MENOR TAXA do mercado`.
3. The homepage includes an automation / affiliate section labeled `AUTOMAÇÕES E PROGRAMA DE AFILIADOS`.
4. That same section includes the product heading `API BITCAMBIO`.
5. The homepage also exposes a CTA labeled `QUERO USAR A API`, confirming that Bitcambio still publicly advertises an API surface.
6. The homepage footer includes a `Nova Bitcambio` quick link, which aligns with the official docs hostname under `nova.bitcambio.com.br`.
7. `https://nova.bitcambio.com.br/api/v3/docs` currently does not load a Swagger or ReDoc reference. In this pass it rendered a Cloudflare page titled `CNAME Cross-User Banned | Cloudflare` with `Error 1014`.
8. Because the docs host fails before the application documentation loads, no trustworthy first-party endpoint inventory was exposed.
9. The public homepage does not itself publish endpoint paths, HTTP methods, authentication rules, pagination behavior, rate limits, response schemas, or error formats.

## Current blocker
This remains a first-party documentation-availability blocker rather than a shutdown case:
- the main Bitcambio site is live
- the site still markets an API product
- the docs hostname still exists as the advertised technical entrypoint
- but the technical reference is blocked by a Cloudflare `Error 1014` page before any route-level content becomes available

Because of that blocker, I could not responsibly confirm:
- production API base URL
- endpoint paths or HTTP methods
- authentication scheme or signing rules
- pagination behavior
- numeric rate limits
- request / response body formats
- application-level error schemas

## Important usage notes
- Treat Bitcambio as an active provider with a currently unavailable first-party route reference.
- Keep monitoring both the homepage API CTA and the `nova.bitcambio.com.br` docs host on future passes.
- Do not infer routes from stale SDKs, cached docs, or unofficial mirrors until the first-party docs host becomes readable again.

## fireROUTE normalization notes
- Keep Bitcambio marked `manually_documented` with `0` confirmed current routes.
- Preserve the blocker classification as a first-party docs-host availability problem, not a provider shutdown.
- Keep the canonical docs URL as `https://nova.bitcambio.com.br/api/v3/docs` until Bitcambio publishes a replacement official reference.
