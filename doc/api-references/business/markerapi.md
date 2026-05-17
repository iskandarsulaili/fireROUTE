# markerapi

## Provider metadata
- Category: `business`
- Provider slug: `markerapi`
- Official pages manually reviewed in this pass:
  - `https://markerapi.com/`
  - `https://markerapi.com/documentation/`
- Manually confirmed route count: `5`

## Product overview
The official Marker site describes Marker as a **REST API** for searching the United States trademark database (USPTO) and returning a **JSON-encoded** result set. The current public documentation exposes a small V2 surface focused on trademark lookup rather than a broad multi-resource platform.

## Confirmed base URL and transport
From the reviewed official URL templates and examples:
- Primary documented URL family: `https://markerapi.com/api/v2/trademarks/...`
- Current version explicitly named on the docs page: `V2`
- Response format called out by the homepage/docs: `JSON`
- Transport style exposed publicly: path-parameterized REST URLs

### Important host note
The public documentation mostly shows URL templates on the main host:
- `https://markerapi.com/api/v2/...`

But the official PHP sample currently builds requests against:
- `https://dev.markerapi.com/api/v2/...`

That is a first-party docs inconsistency. For fireROUTE purposes, treat `https://markerapi.com/api/v2` as the primary documented base and record `https://dev.markerapi.com/api/v2` as a sample-code alternate host that should be runtime-verified before production use.

## Confirmed authentication model
The reviewed official docs do **not** describe OAuth, bearer tokens, or custom auth headers.

What they do confirm:
- an **active API subscription** is required
- authentication is passed directly in the request path as:
  - `/username/{api_username}/password/{api_password}`
- the public registration flow includes a dedicated **API Username** field

Because credentials are path-embedded in the public examples, downstream integrations should assume request logging and analytics systems could accidentally capture secrets unless URLs are redacted.

## Confirmed endpoint inventory
The official documentation explicitly says: **“Marker API V2 has 5 different API endpoints.”**

All five documented routes are shown as URL templates and appear to be **GET-style retrieval endpoints**.

| Endpoint family | Method | Documented path template | Confirmed parameters | Notes |
|---|---|---|---|---|
| Serial Number Search | `GET` | `/api/v2/trademarks/serialnumber/{serial_number}/username/{api_username}/password/{api_password}` | `serial_number`, `api_username`, `api_password` | Returns one record per search and includes registration data for the trademark. |
| Trademark Search | `GET` | `/api/v2/trademarks/trademark/{search_term}/status/{status}/start/{start}/username/{api_username}/password/{api_password}` | `search_term`, `status`, `start`, `api_username`, `api_password` | Search term may include asterisks for wildcard search. `status` is documented as `active` or `all`. |
| Description Search | `GET` | `/api/v2/trademarks/description/{search_term}/status/{status}/start/{start}/username/{api_username}/password/{api_password}` | `search_term`, `status`, `start`, `api_username`, `api_password` | Docs say the caller should **not** include asterisks; the API handles it as a `*search*` wildcard internally. |
| Owner Search | `GET` | `/api/v2/trademarks/owner/{search_term}/start/{start}/username/{api_username}/password/{api_password}` | `search_term`, `start`, `api_username`, `api_password` | Searches by person, group, or company owner; search term may include wildcard asterisks. |
| Expiration Search | `GET` | `/api/v2/trademarks/expiring/{window}/start/{start}/username/{api_username}/password/{api_password}` | `window`, `start`, `api_username`, `api_password` | `window` is a future time frame such as `6 months`, `1 year`, or `90 days`. |

## Parameters and request-behavior notes
Confirmed from the official docs page:
- `start` is an integer paging offset/token used for subsequent pages
- the official PHP example states that a **new search should start at `1`**
- `status` is only documented on trademark-search and description-search routes
- `status` accepts `active` or `all`
- trademark search supports explicit wildcard `*` usage inside the search term
- description search is already wildcarded by the service and should not include explicit asterisks
- expiration search expects a human-readable future interval string like `6 months`, `1 year`, or `90 days`

## Pagination
The official docs are specific about pagination:
- all endpoints implement paging
- page size is `100` results per page
- when more data is available, the response includes a `next` key
- the `next` value should be sent back as the next request’s `start` parameter
- the docs explicitly say to keep the other parameters the same while only advancing `start`

This is a continuation-token / offset-like pattern rather than page-number pagination.

## Confirmed response structure and fields
The homepage and docs page confirm a JSON result set and name several response fields. The official PHP example also exposes some structural hints.

Confirmed response-level details:
- the PHP sample reads a top-level `count`
- the PHP sample iterates a top-level `trademarks` collection
- paginated responses may contain a top-level `next`
- serial-number lookups return one record per search

Confirmed or explicitly listed trademark-level fields:
- `serial number`
- `trademark` / `wordmark`
- `goods and services code`
- `description`
- `status code`
- `status`
- `status description`
- `owner and address`
- `filing date`
- `registration date`

The sample code also refers to these property names when unpacking records:
- `serialnumber`
- `wordmark`
- `description`
- `code`
- `registrationdate`

## Rate limits and commercial limits
The reviewed official pages do **not** publish a per-second or per-minute throttle.

What they do publish is plan-level monthly search volume:
- free tier: `1K searches a month`
- paid tier: `10K searches a month` for `$25 USD`
- paid tier: `250K searches a month` for `$50 USD`
- paid tier: `10M searches a month` for `$100 USD`

For fireROUTE normalization, treat those as documented commercial quotas rather than hard transport-layer rate limits.

## Errors and unsupported details
The reviewed public docs did **not** expose:
- a formal error schema
- HTTP status-code guidance
- retry headers
- webhook support
- batch endpoints
- POST/PUT/PATCH/DELETE write operations

Any of those behaviors would need fresh first-party confirmation before implementation.

## Important usage notes
- Marker’s public API surface is currently very small and narrowly focused: exactly five documented V2 search endpoints.
- The docs rely on **path-embedded credentials**, so integrations should avoid logging full request URLs.
- Preserve the documented `start` + `next` pagination contract exactly.
- Preserve the endpoint-specific wildcard behavior differences between trademark, description, and owner search.
- Treat the `markerapi.com` vs `dev.markerapi.com` host split as an official-doc inconsistency that should be verified during runtime testing.
- Because the public docs only expose URL templates and examples, fireROUTE should keep request construction conservative and avoid inventing undocumented optional parameters.
