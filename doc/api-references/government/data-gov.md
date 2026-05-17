# Data.gov

## Provider metadata
- Category: `Government`
- Provider slug: `data-gov`
- Assigned docs URL: `https://api.data.gov/`
- Official docs/pages reviewed in this run:
  - `https://api.data.gov/`
  - `https://api.data.gov/docs/developer-manual/`
- Current status after official review: `manually_documented`
- Current public API base URL: `https://api.data.gov` as the shared gateway/documentation host
- Authentication model: API key managed by `api.data.gov`; the official developer manual documents header, query-string, and HTTP Basic username transport options
- Response format: no single provider-owned business payload format; the official manual documents shared gateway errors in `JSON`, `XML`, `CSV`, or `HTML` depending on request format
- Rate limits: default `1,000 requests per hour` per API key across participating `api.data.gov` APIs; `DEMO_KEY` is limited to `30 requests per IP per hour` and `50 requests per IP per day`
- Pagination: no standalone provider-owned pagination contract because the official docs describe a shared API gateway rather than one route inventory
- Error format: standardized gateway-level errors documented for all `API Umbrella` web services behind `api.data.gov`
- Manually confirmed canonical route count: `0`

## What was confirmed from the official site
- The official homepage describes `api.data.gov` as `a free API management service for federal agencies` and says it is currently used by `25 agencies` for `over 450 APIs`.
- The official site presents `api.data.gov` as a cross-agency access layer and documentation hub, not as one standalone government dataset API with its own resource collection.
- The official developer manual confirms that one API key can be used across APIs from agencies participating in the `api.data.gov` service.
- The official developer manual documents API-key transport methods and shared gateway behavior, but it does not publish a provider-owned business/data endpoint inventory analogous to `/datasets`, `/records`, or `/search`.
- The official homepage links `Live Metrics`, `Developer Manual`, and `Agency Manual`, which reinforces that the reachable official surface is a gateway/documentation product rather than a single route-level public data API.

## Authentication
The official developer manual documents three supported ways to send the API key.

### 1. HTTP header
- Header name: `X-Api-Key`
- Official example:
  - `curl -H 'X-Api-Key: DEMO_KEY' 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json?limit=1'`

### 2. Query parameter
- Query parameter name: `api_key`
- The official manual notes this may also be used for non-GET requests such as `POST` and `PUT`
- Official example:
  - Example URL documented on the official page: `https://developer.nrel.gov/api/alt-fuel-stations/v1.json?limit=1&api_key=<your_api_key>`

### 3. HTTP Basic authentication username
- Send the API key as the Basic-auth username
- Password remains empty
- Official example:
  - `curl 'https://YOUR_KEY_HERE@developer.nrel.gov/api/alt-fuel-stations/v1.json?limit=1'`

## Rate limits
The official developer manual documents shared gateway throttling.

- Default hourly limit: `1,000 requests per hour`
- Scope: limits are applied across all `api.data.gov` API requests made with the same key
- Temporary block behavior: exceeding the limit temporarily blocks the key until capacity returns
- Reset model: the hourly counter resets on a rolling basis, not at the top of the hour

### DEMO_KEY limits
- `30 requests per IP address per hour`
- `50 requests per IP address per day`

### Usage headers
The official manual says every API response returns:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`

Official example:
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 998`

## Shared error model
The official developer manual lists these standardized gateway-level errors.

| Error code | HTTP status | Official meaning |
|---|---:|---|
| `API_KEY_MISSING` | 403 | No API key was supplied |
| `API_KEY_INVALID` | 403 | An invalid API key was supplied |
| `API_KEY_DISABLED` | 403 | The supplied API key has been disabled |
| `API_KEY_UNAUTHORIZED` | 403 | The key is not authorized for the requested service |
| `API_KEY_UNVERIFIED` | 403 | The key has not yet been verified |
| `HTTPS_REQUIRED` | 400 | The request must be made over HTTPS |
| `OVER_RATE_LIMIT` | 429 | The key exceeded its allowed rate limits |
| `NOT_FOUND` | 404 | No API was found at the requested URL |

### Error response formats
The official developer manual says the gateway may return errors in:
- `JSON`
- `XML`
- `CSV`
- `HTML`

Requests with unknown formats default to JSON errors.

## Route inventory result
- No standalone provider-owned data routes were published on the reviewed official `api.data.gov` pages.
- The official documentation is for the shared gateway, API-key handling, rate limiting, and standardized gateway errors.
- Because the reviewed official surface does not define one canonical `api.data.gov` business endpoint inventory, the manually confirmed route count remains `0`.

## Important usage notes
- Treat `api.data.gov` as reusable federal API gateway infrastructure, not as one normal content API provider.
- Document downstream agency APIs under their own providers instead of attaching those agencies' route inventories to `data-gov`.
- Revisit this provider only if `api.data.gov` later publishes a provider-owned public route inventory beyond the current gateway/auth/error documentation.
