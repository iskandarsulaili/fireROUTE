# aztro

## Manual review status
- Category: `Social`
- Provider slug: `aztro`
- Official docs URL from index: `https://aztro.sameerkumar.website/`
- Official pages manually inspected in this pass:
  - `https://aztro.sameerkumar.website/`
  - `https://aztro.sameerkumar.website/docs`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The indexed official host is not currently serving the aztro API or its documentation.
- Both the root URL and the obvious same-host docs path currently load Heroku's `No such app` wrapper instead of provider-owned API documentation.
- Because the official host is not serving the application, no current base URL, endpoint list, parameter schema, auth contract, pagination behavior, rate limits, or response format could be re-confirmed from official sources in this pass.

## Evidence from manual inspection
- `https://aztro.sameerkumar.website/` loaded with title `No such app`.
- `https://aztro.sameerkumar.website/docs` also loaded with title `No such app`.
- In both cases the browser snapshot showed only Heroku's fallback shell with an iframe and the link text `Build something amazing`.
- Neither reviewed page exposed provider documentation, example requests, API responses, or schema links.

## Endpoint inventory
- No endpoints were manually confirmable from the current official host in this pass.
- I did not backfill historical routes from memory or unofficial mirrors because this fireROUTE pass requires current first-party confirmation.

## Authentication and authorization
- Not confirmable from the current official host.
- The reviewed official pages did not expose any token flow, API key requirement, or working request example.

## Pagination
- Not confirmable from the current official host.

## Rate limits
- Not confirmable from the current official host.

## Errors and format notes
- The only observable behavior on the reviewed official host was the host-level `No such app` wrapper.
- No provider-documented JSON success schema or API error envelope was available on the reviewed pages.

## fireROUTE note
- Treat aztro as blocked until the provider restores the official host or republishes documentation on a clearly first-party replacement page.
- On a future retry, re-check both the root URL and a same-host docs path before trusting historical route knowledge.
