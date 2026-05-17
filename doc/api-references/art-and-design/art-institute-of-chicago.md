# Art Institute of Chicago

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://api.artic.edu/docs/`
  - `https://api.artic.edu/api/v1/openapi.json`
  - `https://api.artic.edu/api/v1/artworks?limit=1`
  - `https://api.artic.edu/api/v1/artworks?ids=116399&fields=id,title`
- Manual review outcome: `manually_documented`
- Confirmed route count: `80`

## API overview
- Base URL: `https://api.artic.edu/api/v1`
- Authentication: none on the reviewed public data routes
- Transport: HTTPS
- Response format: JSON
- Pagination: list endpoints use numbered pagination with query params such as `page` and `limit`; a live list response returned `pagination.total`, `pagination.limit`, `pagination.offset`, `pagination.total_pages`, `pagination.current_page`, and `pagination.next_url`
- Live response structure confirmed on `GET /api/v1/artworks?limit=1`:
  - top-level `pagination`
  - top-level `data[]`
  - top-level `info.license_text`, `info.license_links`, `info.version`
  - top-level `config.iiif_url`, `config.website_url`
- Rate limits: no numeric public quota was surfaced on the reviewed pages in this pass

## Confirmed endpoints
All reviewed paths were exposed as `GET` routes.

| Method | Path |
|---|---|
| GET | `/api/v1` |
| GET | `/api/v1/agent-roles` |
| GET | `/api/v1/agent-roles/{id}` |
| GET | `/api/v1/agent-types` |
| GET | `/api/v1/agent-types/{id}` |
| GET | `/api/v1/agents` |
| GET | `/api/v1/agents/search` |
| GET | `/api/v1/agents/{id}` |
| GET | `/api/v1/articles` |
| GET | `/api/v1/articles/search` |
| GET | `/api/v1/articles/{id}` |
| GET | `/api/v1/artists` |
| GET | `/api/v1/artists/{id}` |
| GET | `/api/v1/artwork-date-qualifiers` |
| GET | `/api/v1/artwork-date-qualifiers/{id}` |
| GET | `/api/v1/artwork-place-qualifiers` |
| GET | `/api/v1/artwork-place-qualifiers/{id}` |
| GET | `/api/v1/artwork-types` |
| GET | `/api/v1/artwork-types/{id}` |
| GET | `/api/v1/artworks` |
| GET | `/api/v1/artworks/search` |
| GET | `/api/v1/artworks/{id}` |
| GET | `/api/v1/artworks/{id}/manifest.json` |
| GET | `/api/v1/category-terms` |
| GET | `/api/v1/category-terms/search` |
| GET | `/api/v1/category-terms/{id}` |
| GET | `/api/v1/event-occurrences` |
| GET | `/api/v1/event-occurrences/search` |
| GET | `/api/v1/event-occurrences/{id}` |
| GET | `/api/v1/event-programs` |
| GET | `/api/v1/event-programs/search` |
| GET | `/api/v1/event-programs/{id}` |
| GET | `/api/v1/events` |
| GET | `/api/v1/events/search` |
| GET | `/api/v1/events/{id}` |
| GET | `/api/v1/exhibitions` |
| GET | `/api/v1/exhibitions/search` |
| GET | `/api/v1/exhibitions/{id}` |
| GET | `/api/v1/galleries` |
| GET | `/api/v1/galleries/search` |
| GET | `/api/v1/galleries/{id}` |
| GET | `/api/v1/generic-pages` |
| GET | `/api/v1/generic-pages/search` |
| GET | `/api/v1/highlights` |
| GET | `/api/v1/highlights/search` |
| GET | `/api/v1/highlights/{id}` |
| GET | `/api/v1/images` |
| GET | `/api/v1/images/search` |
| GET | `/api/v1/images/{id}` |
| GET | `/api/v1/mobile-sounds` |
| GET | `/api/v1/mobile-sounds/search` |
| GET | `/api/v1/mobile-sounds/{id}` |
| GET | `/api/v1/places` |
| GET | `/api/v1/places/search` |
| GET | `/api/v1/places/{id}` |
| GET | `/api/v1/products` |
| GET | `/api/v1/products/search` |
| GET | `/api/v1/products/{id}` |
| GET | `/api/v1/publications` |
| GET | `/api/v1/publications/search` |
| GET | `/api/v1/publications/{id}` |
| GET | `/api/v1/sections` |
| GET | `/api/v1/sections/search` |
| GET | `/api/v1/sections/{id}` |
| GET | `/api/v1/sites` |
| GET | `/api/v1/sites/search` |
| GET | `/api/v1/sites/{id}` |
| GET | `/api/v1/sounds` |
| GET | `/api/v1/sounds/search` |
| GET | `/api/v1/sounds/{id}` |
| GET | `/api/v1/static-pages` |
| GET | `/api/v1/static-pages/search` |
| GET | `/api/v1/static-pages/{id}` |
| GET | `/api/v1/texts` |
| GET | `/api/v1/texts/search` |
| GET | `/api/v1/texts/{id}` |
| GET | `/api/v1/tours` |
| GET | `/api/v1/tours/search` |
| GET | `/api/v1/tours/{id}` |
| GET | `/api/v1/videos` |

## Confirmed parameters and request fields
The reviewed docs/OpenAPI surface and live examples exposed these common query parameters:
- `page` - numbered page selector on list endpoints
- `limit` - page size limiter
- `fields` - sparse-field selection
- `ids` - fetch a specific set of records by ID
- `q` - search term on `/search` routes
- `params` - surfaced in the official schema, but not deeply expanded in this pass

## Confirmed response notes
From the live `artworks` list response:
- each item includes identity and linking fields such as `id`, `api_model`, and `api_link`
- media-related records can include `thumbnail`, `image_id`, and `alt_image_ids`
- collection metadata can include `artist_display`, `place_of_origin`, `date_display`, `gallery_title`, `department_title`, and `artwork_type_title`
- the live response also published licensing and IIIF configuration information under `info` and `config`

## Errors, pagination, and format notes
- The reviewed public endpoints are JSON over HTTPS.
- List endpoints publish machine-readable pagination metadata instead of relying only on headers.
- The reviewed pages in this pass did not expose a single provider-wide numeric rate-limit table.
- The reviewed pages in this pass did not expose a compact global error-code catalog; fireROUTE should expect standard HTTP error handling around the public JSON surface.

## Important usage notes
- The live list response explicitly exposes `config.iiif_url`, and the official docs also expose the IIIF manifest route for artworks.
- Use `fields` aggressively on high-cardinality resources to reduce very large payloads.
- The response `info.license_text` distinguishes the `description` field licensing from the rest of the payload, so downstream reuse should preserve that distinction.
- The API surface mixes collection-style list routes, dedicated `/search` routes, single-record detail routes, and special-case manifest delivery.

## Sources inspected
- `https://api.artic.edu/docs/`
- `https://api.artic.edu/api/v1/openapi.json`
- `https://api.artic.edu/api/v1/artworks?limit=1`
- `https://api.artic.edu/api/v1/artworks?ids=116399&fields=id,title`
