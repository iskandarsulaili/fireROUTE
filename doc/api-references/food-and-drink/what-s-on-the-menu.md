# What's on the menu?

Official pages manually reviewed:
- http://nypl.github.io/menus-api/

## Overview
- API docs URL reviewed: `http://nypl.github.io/menus-api/`
- Base API URL documented on the reviewed page: `http://api.menus.nypl.org`
- Authentication: token required as a query parameter
- Primary response format: JSON
- Alternate response format documented: XML by appending `.xml`
- Related non-API export note: the docs mention biweekly CSV exports, but the documented API routes themselves are JSON/XML HTTP endpoints

Manual route count confirmed from the reviewed official docs: **9**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/menus` | List menu records |
| GET | `/menus/{id}` | Fetch one menu |
| GET | `/menus/{id}/pages` | List pages for a menu |
| GET | `/menus/{id}/dishes` | List dish entries attached to a menu |
| GET | `/menus/search` | Search menus |
| GET | `/dishes` | List dishes |
| GET | `/dishes/{id}` | Fetch one dish |
| GET | `/dishes/{id}/menus` | List menus containing a dish |
| GET | `/dishes/search` | Search dishes |

## Confirmed parameters

### Common auth parameter
- `token`: required query parameter on all documented API calls
- The docs say users must request a token by emailing `menusATnyplDOT.org` with subject `API ACCESS`

### `GET /menus`
Optional query parameters documented on the reviewed page:
- `min_year`
- `max_year`
- `sort_by=date|name|dish_count`

### `GET /menus/{id}`
- Path parameter: `id`
- Required query parameter: `token`

### `GET /menus/{id}/pages`
- Path parameter: `id`
- Required query parameter: `token`

### `GET /menus/{id}/dishes`
- Path parameter: `id`
- Required query parameter: `token`

### `GET /menus/search`
Required query parameters:
- `token`
- `query`

Optional query parameters:
- `sort_by=date|name|relevance|dish_count`

### `GET /dishes`
Optional query parameters documented on the reviewed page:
- `min_year`
- `max_year`
- `sort_by=name|date|popularity|obscurity`

### `GET /dishes/{id}`
- Path parameter: `id`
- Required query parameter: `token`

### `GET /dishes/{id}/menus`
- Path parameter: `id`
- Required query parameter: `token`

### `GET /dishes/search`
Required query parameters:
- `token`
- `query`

Optional query parameters:
- `sort_by=date|name|relevance|popularity|obscurity`

## Pagination and response notes
- The docs say pagination information is returned in the HTTP `Link` header for index endpoints.
- `rel` values can include `first`, `prev`, `next`, and `last`.
- Documented page-size limits:
  - menu objects: `per_page` max `50`
  - dish objects: `per_page` max `100`
- If a page beyond the last page is requested, the API returns an empty array.
- JSON is the default format.
- XML is available by appending `.xml` to the route.

## Rate limits
The reviewed docs explicitly state:
- `5000` requests per day per token or per IP address
- `2` requests per second
- Response headers include:
  - `X-Ratelimit-Limit`
  - `X-Ratelimit-Remaining`

## Data-quality and field notes
The reviewed docs call out several caveats:
- some fields may be empty or null because normalization is still in progress
- highest and lowest dish prices do not yet properly account for non-dollar currencies
- `first_page_full_height` and `first_page_full_width` are measured in pixels
- page-level `full_height` and `full_width` are in pixels
- page `uuid` values come from the NYPL Image Repository
- dish `lowest_price` and `highest_price` can be null for non-dollar dishes or incomplete normalization
- `first_appeared` and `last_appeared` can be null when source menus lack date data or cleanup is incomplete

## Auth notes
- The docs include placeholder headings for Basic Auth and OAuth 2, but both sections say details are forthcoming.
- The only concretely documented auth mechanism on the reviewed page is the required `token` query parameter.

## Important usage notes
- The API is still labeled beta in the reviewed docs.
- The docs explicitly recommend JSON as the default and preferred format.
- CSV is mentioned only for bulk data exports outside the API, not as a documented API response type for these routes.
- The service is HTTP-only in the reviewed docs; the category index also lists HTTPS as unavailable.

## fireROUTE notes
- Treat `/menus`, `/menus/search`, `/dishes`, and `/dishes/search` as the primary collection/search routes.
- Preserve `token` as a required passthrough query parameter.
- Preserve XML access as a suffix option rather than a separate route family.
- Surface pagination from `Link` headers instead of assuming page counters in the JSON body.
