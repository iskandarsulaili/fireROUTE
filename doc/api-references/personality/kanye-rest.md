# kanye.rest

## Provider metadata
- Category: `Personality`
- Provider slug: `kanye-rest`
- Docs used manually:
  - `https://kanye.rest/`
  - live API check: `https://api.kanye.rest/`
- Confirmed API base URL: `https://api.kanye.rest`
- Authentication: none
- Primary response format: JSON
- Manually confirmed routes in this pass: `1`

## Authentication
- The official homepage presents the service as a free random-quote API.
- No API key, OAuth flow, cookie requirement, or account setup is documented on the reviewed official page.
- The live API endpoint returned data directly without any credential prompt.

## Common request/response conventions
- Base URL: `https://api.kanye.rest`
- The homepage links directly to the API endpoint rather than to a multi-page reference.
- The live API response observed in this session was a JSON object with a single field:
  - `quote`
- The homepage also includes a visible quote list and a refresh button, but the reviewed official page does not document any additional public API path besides the linked API root.

## Manually confirmed endpoint set

### 1) Get a random Kanye West quote
- Method: `GET`
- Path: `/`
- Full URL: `https://api.kanye.rest/`
- Purpose: return one random Kanye West quote as JSON.
- Confirmed request parameters: none documented on the official page and none required in the reviewed request.
- Confirmed response notes:
  - JSON object with a `quote` string
  - sample live response in this session followed the shape `{ "quote": "..." }`

## Pagination
- None documented.

## Rate limits
- No numeric public rate limit or quota policy was published on the reviewed official page.
- I did not infer limits that the official page did not state.

## Error handling
- The reviewed official page does not publish an HTTP status matrix or typed error schema.
- The live root request succeeded immediately and returned a single JSON object.

## Response format notes
- The API returns JSON.
- The reviewed official surface does not document alternate output formats, versioned route prefixes, or query-driven variants.

## Important usage notes
- The official homepage is itself the main documentation surface.
- The API surface currently appears intentionally minimal: one linked endpoint for random quotes.
- The homepage's quote-list UI is useful context for content provenance, but it is not documented there as a separate API route.

## Verification notes
This file was manually rebuilt from the official kanye.rest homepage and a live browser check of the linked API endpoint.