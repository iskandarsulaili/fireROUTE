# TCGdex

## Overview
- Provider: TCGdex API
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::8`
- Indexed docs URL reviewed first: `https://www.tcgdex.net/docs`
- Additional official pages inspected:
  - `https://tcgdex.dev/`
  - `https://tcgdex.dev/rest`
  - `https://tcgdex.dev/rest/card`
  - `https://tcgdex.dev/rest/cards`
  - `https://tcgdex.dev/rest/set`
  - `https://tcgdex.dev/rest/sets`
  - `https://tcgdex.dev/rest/set-card`
  - `https://tcgdex.dev/rest/serie`
  - `https://tcgdex.dev/rest/series`
  - `https://tcgdex.dev/rest/other-fields`
  - `https://tcgdex.dev/rest/filtering-sorting-pagination`
  - `https://tcgdex.dev/graphql`
  - `https://tcgdex.dev/errors`
  - `https://tcgdex.dev/errors/general`
  - `https://tcgdex.dev/errors/language-invalid`
  - `https://tcgdex.dev/errors/not-found`
- Base URL pattern: `https://api.tcgdex.net/v2/{lang}`
- Auth: none documented
- HTTPS: yes
- Response formats: JSON for REST, `application/problem+json` for documented error responses, GraphQL endpoint also exists
- Confirmed routes: `21`

## Route inventory

### Core REST resources
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/cards/{id}` | path `lang`, `id` | Returns a full `Card` object. |
| GET | `/cards` | path `lang`; filter/sort/pagination query parameters | Returns an array of `CardBrief` objects. |
| GET | `/sets/{id}` | path `lang`, `id` | Returns a full `Set` object with card list and metadata. |
| GET | `/sets` | path `lang`; filter/sort/pagination query parameters | Returns an array of set summaries. |
| GET | `/sets/{setId}/{localId}` | path `lang`, `setId`, `localId` | Returns one card resolved by local card number within a set. |
| GET | `/series/{id}` | path `lang`, `id` | Returns a full `Serie` object. |
| GET | `/series` | path `lang`; filter/sort/pagination query parameters | Returns an array of `SerieBrief` objects. |

### Auxiliary list endpoints
All of the following are shown as REST list endpoints under the official `Other endpoints` page and use the same `https://api.tcgdex.net/v2/{lang}` base pattern.

| Method | Path |
|---|---|
| GET | `/categories` |
| GET | `/hps` |
| GET | `/illustrators` |
| GET | `/rarities` |
| GET | `/retreats` |
| GET | `/types` |
| GET | `/dexids` |
| GET | `/energytypes` |
| GET | `/regulationmarks` |
| GET | `/stages` |
| GET | `/suffixes` |
| GET | `/trainertypes` |
| GET | `/variants` |

### GraphQL endpoint
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GraphQL endpoint advertised; HTTP method not stated on the reviewed docs page | `/graphql` | GraphQL query body as supported by the online editor | The docs page says full GraphQL documentation is still in progress, but links directly to the live editor at `https://api.tcgdex.net/v2/graphql`. |

## Shared parameters, filtering, sorting, and pagination
- Shared path segment:
  - `{lang}` — language code in the URL path
- Language values confirmed from the official error pages:
  - `en`, `fr`, `es`, `it`, `pt`, `pt-br`, `pt-pt`, `de`, `nl`, `pl`, `ru`, `ja`, `ko`, `zh-tw`, `id`, `th`, `zh-cn`
- List endpoints support field filters in query string form `object.key=value`.
- Documented filter behaviors and prefixes:
  - default loose contains match, e.g. `name=pikachu`
  - `like:` loose contains match
  - `not:` / `notlike:` loose negative match
  - `eq:` exact equality
  - `neq:` exact inequality
  - `gte:` greater-than-or-equal numeric match
  - `lte:` less-than-or-equal numeric match
  - `gt:` greater-than numeric match
  - `lt:` less-than numeric match
  - `null:` field must be null / missing value
  - `notnull:` field must have a value
- Multiple values can be supplied with `|`, for example `name=eq:Furret|Pikachu`.
- Sorting query parameters:
  - `sort:field` — object field to sort by
  - `sort:order` — `ASC` or `DESC`
- Official default sorting note: `releaseDate > localId > id`
- Pagination query parameters:
  - `pagination:page` — page number, default `1` when pagination is enabled
  - `pagination:itemsPerPage` — items per page, default `100` when `pagination:page` is set
- Official pagination note: pagination is not enabled automatically; you add it explicitly to list requests.

## Response and error notes
- The REST guide says every request must be `GET` and returns JSON in the response body.
- The REST docs say standard HTTP response codes are used.
- Reviewed successful examples show object or array JSON responses depending on the route.
- Error reporting page says errors follow RFC 9457 and use content type `application/problem+json`.
- Standard problem fields documented on the official error page:
  - `type`
  - `title`
  - `status`
  - `detail`
- Reviewed TCGdex-specific error examples also include route/method context such as:
  - `endpoint`
  - `method`
  - sometimes `lang` and `details`
- Documented reviewed error pages:
  - `500` general server error
  - `404` invalid language error
  - `404` not found / unknown endpoint or resource
- Resource-specific route pages for `/cards/{id}`, `/sets/{setId}/{localId}`, and `/series/{id}` all show a simple JSON `{"error":"Endpoint or id not found"}` example for missing resources.

## Important usage notes
- The indexed URL `https://www.tcgdex.net/docs` now returns a `404 page not found`, but that page links to the current official API docs at `https://tcgdex.dev/`.
- The REST API is available only over HTTPS; the docs explicitly say plain HTTP is redirected to HTTPS.
- The official homepage highlights multilingual support and exposes both REST and GraphQL access paths.
- The GraphQL docs page is intentionally incomplete; only the live endpoint/editor URL is confirmed there.

## Rate limits
- No published numeric rate limit was found on the reviewed official docs and error pages.

## Integration notes for fireROUTE
- Model TCGdex as a public multilingual API rooted at `https://api.tcgdex.net/v2/{lang}`.
- Treat the provider as `20` documented REST routes plus `1` officially linked GraphQL endpoint.
- Preserve the unusual query parameter names exactly as documented, including colon-containing keys like `sort:field` and `pagination:itemsPerPage`.
- Preserve RFC 9457 problem responses separately from normal JSON resource responses.
- Do not assume the indexed `www.tcgdex.net/docs` URL is the live docs home; the maintained documentation is now under `tcgdex.dev`.

## Sources inspected
- `https://www.tcgdex.net/docs`
- `https://tcgdex.dev/`
- `https://tcgdex.dev/rest`
- `https://tcgdex.dev/rest/card`
- `https://tcgdex.dev/rest/cards`
- `https://tcgdex.dev/rest/set`
- `https://tcgdex.dev/rest/sets`
- `https://tcgdex.dev/rest/set-card`
- `https://tcgdex.dev/rest/serie`
- `https://tcgdex.dev/rest/series`
- `https://tcgdex.dev/rest/other-fields`
- `https://tcgdex.dev/rest/filtering-sorting-pagination`
- `https://tcgdex.dev/graphql`
- `https://tcgdex.dev/errors`
- `https://tcgdex.dev/errors/general`
- `https://tcgdex.dev/errors/language-invalid`
- `https://tcgdex.dev/errors/not-found`
