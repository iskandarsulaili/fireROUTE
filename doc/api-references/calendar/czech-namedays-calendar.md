# Czech Namedays Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `czech-namedays-calendar`
- Official pages reviewed manually in this pass:
  - `https://svatky.adresa.info/`
  - `http://svatky.adresa.info/`
- Confirmed current status: first-party deployment availability blocker
- Manually confirmed route count: `0`

## What the official site currently shows
Both reviewed official URLs ended at the same canonical first-party host:
- final URL: `https://svatky.adresa.info/`
- page title: `Deployment Paused`
- visible page text: `This deployment is temporarily paused`
- visible platform marker on the page: `sin1::bx4pq-1779008555300-df8dd19a68e9`

The reviewed first-party page did not expose any provider navigation, route list, parameter reference, example request, OpenAPI document, or alternative documentation links.

## Base URL assessment
- No live API base URL could be responsibly confirmed from the currently visible official pages.
- The only currently visible first-party response is the paused deployment page itself.
- Because the deployment is paused before any API reference loads, no stable route prefix, version segment, or response host could be extracted.

## Authentication
- No current auth model is visible on the paused official page.
- I could not confirm whether the historical service used no auth, query parameters, headers, or another mechanism from the currently reachable first-party material.

## Route inventory
- No concrete HTTP methods or endpoint paths were visible on either reviewed official URL.
- Confirmed fireROUTE route count remains `0`.

## Parameters, pagination, errors, and limits
### Parameters
- No path or query parameters were documented on the paused page.

### Pagination
- No pagination model was visible.

### Errors
- The only directly visible current provider response is the paused deployment page:
  - title: `Deployment Paused`
  - body text: `This deployment is temporarily paused`

### Rate limits
- No request-rate policy or quota information was published on the currently reachable official page.

## Format notes
- No JSON, XML, HTML response examples, or schema details were exposed beyond the plain paused-deployment page.
- The currently reachable first-party response is not an API payload and should not be treated as a route contract.

## Important usage notes
- Treat Czech Namedays Calendar as an explicit first-party availability blocker for now.
- Re-checking should begin with the same official host and any newly restored first-party documentation links once the deployment is no longer paused.
- Do not preserve historical route assumptions as current until the provider again exposes a live official route reference.

## Verification note
This file was rebuilt manually from the current official root over both HTTPS and HTTP using browser tools only. No current API routes were counted because the provider-controlled site presently exposes only a paused deployment page.
