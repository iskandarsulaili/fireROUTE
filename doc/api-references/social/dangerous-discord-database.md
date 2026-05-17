# Dangerous Discord Database

## Manual review status
- Category: `Social`
- Provider slug: `dangerous-discord-database`
- Official docs URL from index: `https://discord.riverside.rocks/docs/index.php`
- Official pages manually inspected in this pass:
  - `https://discord.riverside.rocks/docs/index.php`
  - `https://discord.riverside.rocks/`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The indexed official docs host does not currently resolve in the browser session and fails with `net::ERR_NAME_NOT_RESOLVED`.
- The obvious same-host official alternative page, the site root, fails with the same DNS-resolution error.
- Because the official host is not resolving, no first-party API reference, base URL, auth instructions, endpoint inventory, pagination guidance, rate-limit notes, or response schema could be reviewed.

## Evidence from manual inspection
- Navigating to `https://discord.riverside.rocks/docs/index.php` failed with `net::ERR_NAME_NOT_RESOLVED`.
- Navigating to `https://discord.riverside.rocks/` failed with `net::ERR_NAME_NOT_RESOLVED`.
- The reachable browser error page for the root host stated: `This site can’t be reached` and `discord.riverside.rocks’s server IP address could not be found.`
- No official fallback documentation was reachable on the provider-owned host during this pass.

## Endpoint inventory
- No endpoints were manually confirmable in this pass.

## Authentication and authorization
- Not confirmable from current official sources because the official host is unreachable.

## Pagination
- Not confirmable from current official sources.

## Rate limits
- Not confirmable from current official sources.

## Errors and format notes
- The only current observable failure mode is host-level DNS resolution failure, not a provider-documented API error response.
- No provider-documented success payloads, error envelopes, or format notes were reachable.

## fireROUTE note
- Treat Dangerous Discord Database as blocked until the provider restores DNS for the official host or republishes the docs on another clearly official domain.
