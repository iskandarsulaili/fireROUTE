# Gun Policy

## Provider metadata
- Category: `Government`
- Provider slug: `gun-policy`
- Assigned docs URL: `https://www.gunpolicy.org/api`
- Official docs/pages reviewed in this run:
  - `https://www.gunpolicy.org/api`
  - `https://www.gunpolicy.org/`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official Gun Policy URLs in this run
- Authentication model: not confirmable because both reviewed official URLs failed before any provider documentation rendered
- Response format: not confirmable because both reviewed official URLs failed before any provider documentation rendered
- Rate limits: not confirmable from the reviewed official Gun Policy URLs in this run
- Pagination: not confirmable from the reviewed official Gun Policy URLs in this run
- Error format: no provider-owned API error schema could be confirmed from the reviewed official Gun Policy URLs in this run
- Manually confirmed canonical route count: `0`

## What was confirmed from the official site
- The assigned official docs URL `https://www.gunpolicy.org/api` failed at navigation with `net::ERR_INVALID_AUTH_CREDENTIALS` before any provider page content rendered.
- The official homepage `https://www.gunpolicy.org/` failed with the same navigation error, `net::ERR_INVALID_AUTH_CREDENTIALS`.
- Because both reviewed official URLs failed before any Gun Policy page content loaded, no provider-owned API reference, route list, schema, or developer guide could be inspected in this run.

## Why this remains blocked
- The reviewed Gun Policy domain failed at the browser/network layer on both the assigned docs URL and the official homepage.
- Without a provider-owned page that actually renders, no canonical base URL, endpoint inventory, methods, parameters, authentication flow, pagination rules, rate limits, error payloads, or response examples can be confirmed safely for fireROUTE.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable from the reviewed official URLs.
- Rate limits: not confirmable from the reviewed official URLs.
- Pagination: not confirmable from the reviewed official URLs.
- Errors: the only directly confirmed behavior in this run was browser navigation failure with `net::ERR_INVALID_AUTH_CREDENTIALS` on both reviewed official URLs.
- Format notes: no official machine-readable response format or schema could be verified.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until `gunpolicy.org` again serves a reachable provider-owned API or developer reference.
- Do not normalize routes from third-party mirrors, historical summaries, or unrelated destinations while the official domain remains non-renderable in this environment.
