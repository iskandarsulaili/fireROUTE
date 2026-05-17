# Doge-Meme

## Manual review status
- Category: `Social`
- Provider slug: `doge-meme`
- Official docs URL from index: `https://api.doge-meme.lol/docs`
- Official pages manually inspected in this pass:
  - `https://api.doge-meme.lol/docs`
  - `https://api.doge-meme.lol/`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The indexed official docs hostname currently fails DNS resolution in the browser session with `net::ERR_NAME_NOT_RESOLVED`.
- The obvious same-host official alternative page, the API host root, fails with the same DNS-resolution error.
- Because the provider-owned host is not resolving, no official route list, base URL, auth model, parameter schema, pagination behavior, rate limits, or response format could be manually verified.

## Evidence from manual inspection
- Navigating to `https://api.doge-meme.lol/docs` failed with `net::ERR_NAME_NOT_RESOLVED`.
- Navigating to `https://api.doge-meme.lol/` failed with `net::ERR_NAME_NOT_RESOLVED`.
- The reachable browser error page for the host stated: `This site can’t be reached` and `api.doge-meme.lol’s server IP address could not be found.`
- No provider-owned fallback documentation page was reachable from the reviewed host.

## Endpoint inventory
- No endpoints were manually confirmable in this pass.

## Authentication and authorization
- The category index suggests no auth, but that could not be re-confirmed from current official sources because the host is unreachable.

## Pagination
- Not confirmable from current official sources.

## Rate limits
- Not confirmable from current official sources.

## Errors and format notes
- The only current observable failure mode is host-level DNS resolution failure, not a provider-documented API error envelope.
- No official JSON response examples or schema documents were reachable.

## fireROUTE note
- Treat Doge-Meme as blocked until the provider restores the official hostname or republishes its documentation on another clearly official page.
