# GoTiny

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `gotiny`
- Official pages reviewed manually in this pass:
  - `https://gotiny.cc/`
  - `https://raw.githubusercontent.com/robvanbakel/gotiny-api/master/README.md`
- Manually confirmed current live-route count: `0`

## Current provider state
GoTiny is no longer a live public URL-shortener service.

The current first-party evidence reviewed in this pass shows:
- the official service host `https://gotiny.cc/` now returns a Vercel `404: NOT_FOUND` page
- the official repository README now starts with `GoTiny is no longer available`
- that same README links to the first-party shutdown notice `GoTiny is shutting down`

Because the live service host is gone and the first-party README explicitly says the product is no longer available, the current fireROUTE route count remains `0`.

## Historical API shape still documented by the official README
The archived first-party README still describes the former public API shape, but these routes are historical only and are not counted as current live routes.

### Historical route 1: create short link
- Method: `POST`
- Historical endpoint: `https://gotiny.cc/api`
- Body/content type: JSON
- Documented request forms:
  - `{ "input": "https://example.com/very-long-url" }`
  - object form with keys such as `long`, `custom`, and `useFallback`
  - array input for multiple links at once
- Documented response format: JSON
- Documented example response fields:
  - `long`
  - `code`

### Historical route 2: resolve short link
- Method: `GET`
- Historical endpoint pattern: `https://gotiny.cc/api/{code}`
- Documented default response format: plain text long URL
- Documented optional format switch:
  - query parameter `?format=json`

## Historically documented parameters and usage notes
From the official README text reviewed in this pass:
- `input` accepts a URL or a string containing one or more URLs
- `custom` was documented for custom short codes
- `useFallback` was documented as a boolean to disable random fallback-code generation
- custom codes were documented as `4-32` characters using lowercase letters, numbers, `-`, and `_`
- the service was documented as being able to shorten multiple URLs in one request

## Authentication
- No authentication requirement was documented in the reviewed first-party README.
- Because the service host is no longer available, there is no current live auth flow to validate.

## Rate limits
- No rate-limit policy was visible in the reviewed first-party materials for the retired service.

## Pagination
- Not applicable in the reviewed first-party materials.
- The documented historical routes were create/resolve operations rather than paginated list endpoints.

## Error handling
- The only current live behavior confirmed in this pass is the root-host failure page `404: NOT_FOUND`.
- The reviewed README does not provide a current post-shutdown API error contract.

## Format notes
- The historical create route was documented as JSON request/response.
- The historical resolve route was documented as plain text by default, with optional JSON via `?format=json`.
- These format notes are preserved for continuity only and should not be treated as evidence of a still-live service.

## Important usage notes
- Treat GoTiny as a retired provider, not as a currently routable shortener backend.
- Do not count the README's old `POST /api` and `GET /api/{code}` examples as live fireROUTE routes while the official host returns `404: NOT_FOUND`.
- Re-check only if the provider-controlled service host returns and publishes a fresh current API reference.

## Verification note
This file was rebuilt manually from the live official service host and the current official first-party README using browser tools only. The official README still preserves historical endpoint details, but the provider's current live route count remains `0` because the service is explicitly shut down and the official host no longer serves the API.
