# MercadoLibre

## Provider metadata
- Category: `Shopping`
- Provider slug: `mercadolibre`
- Docs attempted manually:
  - `https://developers.mercadolibre.cl/es_ar/api-docs-es`
  - `https://developers.mercadolibre.com/`
- Outcome in this browser session: official docs blocked / unavailable
- Manually confirmed routes in this pass: `0`

## Blocker summary
I could not reach a usable official route reference for MercadoLibre in this session.

### Official page attempt 1
- URL: `https://developers.mercadolibre.cl/es_ar/api-docs-es`
- Result observed in the browser: the site rendered an error page with the message `Hubo un error accediendo a esta pagina...`
- Route-level API content was not available from the official indexed documentation URL

### Official page attempt 2
- URL: `https://developers.mercadolibre.com/`
- Result observed in the browser: blank / empty page in this session
- No route inventory, auth guide, or machine-readable API reference was visible from this alternative official host

## What could still be confirmed
- the provider's official developer presence is under MercadoLibre-owned `developers.mercadolibre.*` hosts
- the indexed category entry describes the API generally as covering sales, ads, products, services, and shops

## What could not be confirmed from reachable official pages
Because the official docs were unavailable in this session, I could not manually verify:
- a canonical REST base URL
- endpoint paths or HTTP methods
- auth header / query parameter names
- pagination semantics
- error schema details
- rate limits

## fireROUTE note
This provider is currently documented as a blocker only. Revisit when the official developer portal is reachable and rendering route-level documentation again.