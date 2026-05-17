# Noun Project

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://api.thenounproject.com/index.html`
  - `https://api.thenounproject.com/getting_started.html`
  - `https://api.thenounproject.com/documentation.html`
- Manual review outcome: `manually_documented`
- Confirmed route count: `11`

## API overview
- Base URL: `https://api.thenounproject.com`
- Current API version reviewed: `v2`
- Authentication: OAuth `1.0a` signed requests using a client key and secret
- Auth note: the getting-started page explicitly says no separate access token is required because the current API does not expose private user-data grants
- Transport: HTTPS is required for reviewed requests
- Response format: JSON success payloads and JSON/error HTTP responses
- Pagination: cursor-style `prev_page` and `next_page` tokens on icon and collection listing routes
- Rate limits:
  - all keys are subject to hourly, daily, and monthly limits
  - the reviewed public docs do not publish fixed numeric quotas for every plan
  - requests over limit return HTTP `429 Too Many Requests`

## Confirmed endpoints
|| Method | Path | Notes |
||---|---|---|
|| GET | `/v2/client/blacklist` | Returns the current blacklist attached to the client key. |
|| POST | `/v2/client/blacklist/id` | Adds or overwrites blacklisted icon or collection IDs. |
|| POST | `/v2/client/blacklist/term` | Adds or overwrites blacklisted search terms / phrases. |
|| GET | `/v2/client/usage` | Returns current usage and limits for the client key. |
|| GET | `/v2/icon` | Searches and filters icons. |
|| GET | `/v2/icon/{icon_id}/more-like-this` | Returns icons similar in style to a reference icon, optionally filtered by a query term. |
|| GET | `/v2/icon/{icon_id}` | Returns one icon record. |
|| GET | `/v2/icon/{icon_id}/download` | Returns a recolored/reformatted icon file payload. |
|| GET | `/v2/collection` | Searches icon collections. |
|| GET | `/v2/collection/{collection_id}` | Returns one collection plus paginated icon members. |
|| GET | `/v2/icon/autocomplete` | Returns term suggestions for icon search. |

## Confirmed parameters and request fields
### Shared auth requirements
- Sign reviewed API calls with OAuth `1.0a` using your API key and secret
- The getting-started page says a nonce must be at least `8` characters long

### Blacklist routes
- `POST /v2/client/blacklist/id`
  - query `type`: `icon` or `collection`; defaults to `icon`
  - JSON body `blacklist`: array of icon IDs or collection IDs
  - JSON body `overwrite`: optional boolean controlling replace-vs-append behavior
  - documented limits:
    - maximum request array length `1000` (`5` for free users)
    - maximum total ID blacklist length `20000` (`5` for free users)
- `POST /v2/client/blacklist/term`
  - JSON body `blacklist`: array of terms / phrases
  - JSON body `overwrite`: optional boolean
  - documented limits:
    - maximum request array length `1000` (`5` for free users)
    - maximum total search-term blacklist length `20000` (`5` for free users)

### `GET /v2/icon`
- `query` - icon search term
- `styles` - style filter; reviewed docs list `solid` and `line`
- `line_weight` - one integer or integer range from `1` to `60`
- `limit_to_public_domain` - restricts results to public-domain icons
- `thumbnail_size` - reviewed values `42`, `84`, `200`
- `blacklist` - excludes blacklisted term / ID matches
- `include_svg` - includes SVG URLs in results
- `limit` - max result count
- `prev_page` - pagination token for previous page
- `next_page` - pagination token for next page

### `GET /v2/icon/{icon_id}/more-like-this`
- path `icon_id` - reference icon used for style matching
- `query` - optional subject filter while preserving reference style
- `limit_to_public_domain`
- `thumbnail_size`
- `blacklist`
- `include_svg`
- `limit`
- `prev_page`
- `next_page`

### `GET /v2/icon/{icon_id}`
- path `icon_id` - icon identifier
- `thumbnail_size`
- `blacklist`

### `GET /v2/icon/{icon_id}/download`
- path `icon_id` - icon identifier
- `color` - hexadecimal color value
- `filetype` - `svg` or `png`
- `size` - PNG size; reviewed minimum `20`, maximum `1200`

### Collection routes
- `GET /v2/collection`
  - `query`
  - `blacklist`
  - `limit`
  - `prev_page`
  - `next_page`
- `GET /v2/collection/{collection_id}`
  - path `collection_id` - collection identifier
  - `blacklist`
  - `thumbnail_size`
  - `include_svg`
  - `limit`
  - `prev_page`
  - `next_page`

### `GET /v2/icon/autocomplete`
- `query` - suggestion seed term
- `blacklist` - excludes blacklisted terms
- `limit` - maximum number of suggestions; docs say max `10`

## Confirmed response fields
### Blacklist and usage routes
- `blacklist.collection_ids`
- `blacklist.icon_ids`
- `blacklist.search_terms`
- `usage_limits.monthly.limit`
- `usage_limits.monthly.usage`
- `/v2/client/usage` returns `monthly.limit` and `monthly.usage`

### Icon search/detail routes
- reviewed icon objects include:
  - `id`
  - `term`
  - `attribution`
  - `license_description`
  - `permalink`
  - `creator.name`
  - `creator.permalink`
  - `creator.username`
  - `collections[]`
  - `styles[].style`
  - `styles[].line_weight`
  - `tags[]`
  - `thumbnail_url`
- list/detail wrappers include fields such as:
  - `generated_at`
  - `icons[]` or `icon`
  - `total`
  - `next_page`
  - `prev_page`
  - `usage_limits`
- `GET /v2/icon/{icon_id}` additionally shows `icon_url` for the source asset

### Download route
- `base64_encoded_file`
- `content_type`
- `usage_limits.monthly.limit`
- `usage_limits.monthly.usage`

### Collection routes
- collection list/detail payloads show:
  - `collection.id`
  - `collection.name`
  - `collection.icon_count`
  - `collection.creator.*`
  - `collection.permalink`
  - `collection.tags[]`
  - `collection.icons[]` on the detail route
  - `collection.next_page` / `collection.prev_page` on the detail route when icon members paginate

### Autocomplete route
- `generated_at`
- `suggestions[]`
- `usage_limits.monthly.limit`
- `usage_limits.monthly.usage`

## Response, pagination, and error notes
- The getting-started guide explicitly documents:
  - `200 Success`
  - `401 Unauthorized`
  - `404 Not Found`
  - `429 Too Many Requests` when usage limits are exceeded
- Search/list routes use opaque `prev_page` / `next_page` tokens rather than numbered pages
- The blacklist read endpoint is cached for `10` minutes, so recent changes may not appear immediately
- Icon and collection asset URLs are temporary and expire within about `1` hour according to the reviewed notes

## Important usage notes
- The docs recommend using PNGs for large result sets and fetching SVG only when vector output is needed
- `filetype=svg` on the download route does not accept the `size` parameter
- Free API access on the reviewed download docs is limited to public-domain icons; paid access allows editing any icon
- Icon style filtering supports `solid` and `line`; `line_weight` applies only to `line` icons with consistent measured line width
- The getting-started page says API v1 may still work for previously approved users, but it is legacy and no longer updated; reviewed guidance recommends moving to v2
- The reviewed terms section says the API may not be used to distribute icons, replicate Noun Project’s services, exploit user content, or train AI/ML systems without prior approval

## Sources inspected
- `https://api.thenounproject.com/index.html`
- `https://api.thenounproject.com/getting_started.html`
- `https://api.thenounproject.com/documentation.html`
