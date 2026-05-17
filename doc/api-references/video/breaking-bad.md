# Breaking Bad

## Provider metadata
- Category: `Video`
- Provider slug: `breaking-bad`
- Official docs URL from index: `https://breakingbadapi.com/documentation`
- Official pages manually reviewed in this pass:
  - `https://breakingbadapi.com/documentation`
  - `https://breakingbadapi.com/`
- Manual review outcome: `explicit_blocker`
- Route count confirmed: `0`

## Blocker summary
- The indexed official documentation URL and the same-host official root page both fail before any provider-controlled docs or API output loads.
- In this run, both reviewed official URLs failed browser navigation with `net::ERR_NAME_NOT_RESOLVED`.
- Because the official host never resolved in this browser session, no trustworthy base URL, endpoint inventory, method list, parameter schema, auth contract, pagination behavior, rate-limit policy, error schema, or response-format notes could be confirmed from current official sources.

## Evidence from manual inspection
- A fresh browser CDP target navigated to `https://breakingbadapi.com/documentation` and returned `errorText: net::ERR_NAME_NOT_RESOLVED`.
- A second manual browser navigation to the same-host official root page `https://breakingbadapi.com/` returned the same `errorText: net::ERR_NAME_NOT_RESOLVED`.
- No first-party homepage, documentation page, migration notice, or JSON response from the official domain was reachable in this session.

## Route extraction result
- No official Breaking Bad HTTPS routes were manually confirmable from the reviewed host in this pass.
- I did not backfill endpoints from mirrors, old examples, or third-party summaries because this fireROUTE pass requires current official-source confirmation.

## Authentication and authorization
- Not confirmable from the reviewed official host in this run.

## Pagination
- Not confirmable from the reviewed official host in this run.

## Rate limits
- Not confirmable from the reviewed official host in this run.

## Errors and format notes
- The only directly observable behavior in this pass was host-resolution failure on the official domain.
- That browser error is a reachability blocker, not a trustworthy representation of the provider's application-level error schema.

## fireROUTE note
- Keep Breaking Bad blocked until the official domain resolves again or the maintainer publishes replacement first-party documentation on a reachable official host.
