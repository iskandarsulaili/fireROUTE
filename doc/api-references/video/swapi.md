# SWAPI

## Provider metadata
- Category: `Video`
- Provider slug: `swapi`
- Official docs URL from index: `https://swapi.dev/`
- Official pages manually reviewed in this pass:
  - `https://swapi.dev/`
  - `https://swapi.dev/api/people/1/`
- Manual review outcome: `explicit_blocker`
- Route count confirmed: `0`

## Blocker summary
- The indexed official host could not be reviewed because both the homepage and a direct official resource URL failed before any first-party content or JSON response loaded.
- In this run, both reviewed official URLs failed browser navigation with the same certificate error: `net::ERR_CERT_DATE_INVALID`.
- Because the official host could not be opened far enough to inspect live documentation or API output, no trustworthy base URL contract, route inventory, parameter list, auth model, pagination rules, rate-limit policy, error schema, or response format could be confirmed from `swapi.dev` in this pass.

## Evidence from manual inspection
- A fresh browser CDP target navigated to `https://swapi.dev/` and returned `errorText: net::ERR_CERT_DATE_INVALID` before any provider-controlled page content rendered.
- The same manual browser pass then navigated to the direct official resource URL `https://swapi.dev/api/people/1/`, which returned the same `errorText: net::ERR_CERT_DATE_INVALID`.
- No first-party HTML docs surface or JSON payload from `swapi.dev` was reachable in this session.

## Route extraction result
- No official HTTPS routes were manually confirmable from the reviewed host in its current certificate state.
- I did not backfill endpoints from mirrors, third-party summaries, or historical examples because this fireROUTE pass requires current official-source confirmation.

## Authentication and authorization
- Not confirmable from the reviewed official host in this run.

## Pagination
- Not confirmable from the reviewed official host in this run.

## Rate limits
- Not confirmable from the reviewed official host in this run.

## Errors and format notes
- The only directly observable behavior in this pass was the browser-level certificate failure `net::ERR_CERT_DATE_INVALID` on both reviewed official URLs.
- That is an official-host reachability blocker, not a trustworthy representation of SWAPI's application-level error schema.

## fireROUTE note
- Keep SWAPI blocked until the official certificate problem is fixed and the official host becomes reviewable again.
- Do not substitute `swapi.tech` or other mirrors for `swapi.dev` in this file; the maintained alternative is already documented separately as `swapi-2.md`.
