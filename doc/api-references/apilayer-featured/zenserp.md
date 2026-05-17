# Zenserp

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `zenserp`
- Official docs inspected manually:
  - `https://zenserp.com/`
- Confirmed API base URL: `https://app.zenserp.com/api/v2`
- Response format confirmed from docs: JSON
- Authentication model: API key account flow advertised on the official site; query/header auth details were not exposed in the inspected landing-page snippet
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/search` | Fetch live search-engine results (Google and other supported engines) | required `q`; commonly shown `engine`; additional location/device/filter options are described in the product documentation/playground |

## Usage notes
- The official site shows the example request `https://app.zenserp.com/api/v2/search?q=pied+piper&engine=google`.
- The product page markets Google Search, Google Trends, YouTube Search, and Shopping-style SERP extraction through the same API platform.
- The inspected official page emphasized the single search endpoint pattern, with the search `engine` shaping result type and schema.

## Important fireROUTE notes
- This is a SERP retrieval API, not a general web-search knowledge API.
- Result payloads can contain heterogeneous snippet families such as `organic`, `questions`, and `videos` on the same response.

## Verification notes
This file was manually rebuilt from Zenserp's official site.