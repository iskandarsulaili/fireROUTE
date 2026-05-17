# Final Fantasy XIV

## Overview
- Provider: XIVAPI v2 / Boilmaster Documentation
- Category: Games & Comics
- Official docs: `https://v2.xivapi.com/api/docs`
- OpenAPI document linked from the official docs UI: `https://v2.xivapi.com/api/openapi.json`
- Base URL: `https://v2.xivapi.com/api`
- Auth: none documented in the official OpenAPI or docs UI
- HTTPS: yes
- Response formats: JSON for metadata/search/sheet endpoints; image responses for asset endpoints
- Pagination:
  - `/search` uses `limit` plus a UUID `cursor` continuation token from `next`
  - `/sheet/{sheet}` uses `limit` plus `after`
- Rate limits: none documented in the official docs or OpenAPI

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/asset` | required `path`, required `format`, optional `version` | Reads a single game asset and converts it to the requested output format. |
| GET | `/asset/map/{territory}/{index}` | required `territory`, required `index`, optional `version` | Composes and returns a map image for a territory/index pair. |
| GET | `/search` | optional `version`, `query`, `sheets`, `cursor`, `limit`, `language`, `schema`, `fields`, `transient` | Executes a structured search query across one or more sheets. |
| GET | `/sheet` | optional `version` | Lists available sheets for the selected game version. |
| GET | `/sheet/{sheet}` | required `sheet`; optional `rows`, `limit`, `after`, `language`, `schema`, `fields`, `transient` | Lists rows from one sheet, with targeted row selection or pagination. |
| GET | `/sheet/{sheet}/{row}` | required `sheet`, required `row`; optional `language`, `schema`, `fields`, `transient` | Reads one row from a sheet. |
| GET | `/version` | none | Lists known recorded game versions. |

## Parameter and query syntax notes
- Shared version selector:
  - `version` chooses a specific recorded game-data version.
- `/asset`
  - `path` is the game asset path, for example `ui/icon/051000/051474_hr1.tex`.
  - `format` is required; the docs example shows `png`.
- `/asset/map/{territory}/{index}`
  - `territory` is a 4-character territory identifier such as `s1d1`.
  - `index` is a zero-padded two-digit map index such as `00`.
- `/search`
  - `query` uses the documented clause syntax like `Name="Gil"` or `Name~"Crystal"`.
  - Supported operations from the official schema: partial match `~`, exact equality `=`, numeric comparisons `>=`, `>`, `<=`, `<`.
  - Clauses can be grouped, decorated with `+` / `-`, and targeted into nested fields with dot notation.
  - `sheets` is the sheet list to search against; the docs say at least one must be specified when not using `cursor`.
  - `cursor` takes precedence over `query` for continuation requests.
  - `limit` controls page size.
  - `language` supports the schema enum: `none`, `ja`, `en`, `de`, `fr`, `chs`, `cht`, `kr`.
  - `schema` selects the row-reading schema version.
  - `fields` and `transient` use the documented filter-string syntax for selecting fields.
- `/sheet/{sheet}`
  - `rows` accepts a comma-separated list or row ranges matching `^\d+(:\d+)?(,\d+(:\d+)?)*$`.
  - `after` paginates after the specified row; the docs say behavior is undefined if both `rows` and `after` are provided.
- `/sheet/{sheet}/{row}`
  - `row` matches the OpenAPI `RowSpecifier` pattern `^\d+(:\d+)?$`.

## Response and format notes
- `/version` returns JSON with a `versions` array of version metadata objects.
- `/sheet` returns JSON with a `sheets` array; a live check returned `7912` sheet entries.
- `/sheet/{sheet}` returns JSON with `schema`, `version`, and `rows`.
- `/sheet/{sheet}/{row}` returns JSON with `schema`, `version`, `row_id`, and `fields`.
- `/search` returns JSON with `results`, `schema`, `version`, and optional `next` for pagination.
- `/asset` returned `image/png` in a live check.
- `/asset/map/{territory}/{index}` returned `image/jpeg` in a live check.

## Error handling
- The OpenAPI defines a shared JSON error schema:
  - `code` — HTTP status code
  - `message` — human-readable error description
- Asset endpoints explicitly document `200`, `304`, and a default error response.
- Search and sheet endpoints document `200` plus a default error response.
- Live checks confirmed JSON error bodies such as:
  - `{"code":400,"message":"invalid request: (none) cannot be converted to Png"}` for a bad `/asset` request
  - `{"code":400,"message":...}` for malformed `/search` input

## Usage notes
- The official docs title the API documentation as `Boilmaster Documentation`.
- The docs do not publish any API-key requirement or authentication scheme.
- Search queries must be URL-escaped when they contain special characters; the docs call this out explicitly for characters like `+`.
- Field filters support decorators like `@lang(<language>)` and `@as(raw)` / `@as(html)`.
- `/sheet/{sheet}/{row}` can return very large nested payloads if no `fields` filter is used.

## Live checks performed
- `GET https://v2.xivapi.com/api/version`
- `GET https://v2.xivapi.com/api/sheet`
- `GET https://v2.xivapi.com/api/sheet/Item?limit=2`
- `GET https://v2.xivapi.com/api/sheet/Item/1`
- `GET https://v2.xivapi.com/api/search?query=Name=%22Gil%22&sheets=Item&limit=1`
- `GET https://v2.xivapi.com/api/search?query=Name~%22Crystal%22&sheets=Item&limit=1`
- `GET https://v2.xivapi.com/api/asset?path=ui/icon/051000/051474_hr1.tex&format=png`
- `GET https://v2.xivapi.com/api/asset?path=bad&format=png`
- `GET https://v2.xivapi.com/api/asset/map/s1d1/00`

## fireROUTE integration notes
- Treat `/search` as the main structured discovery endpoint and preserve its query language exactly.
- Treat `/sheet` and `/sheet/{sheet}` as raw table-access endpoints rather than consumer-friendly game abstractions.
- Preserve `cursor`, `after`, `fields`, and `transient` exactly; they are core to pagination and payload shaping.
- Asset routes are binary/media endpoints, not JSON endpoints.

## Sources inspected
- `https://v2.xivapi.com/api/docs`
- `https://v2.xivapi.com/api/openapi.json`
- `https://v2.xivapi.com/api/version`
- `https://v2.xivapi.com/api/sheet`
- `https://v2.xivapi.com/api/sheet/Item?limit=2`
- `https://v2.xivapi.com/api/sheet/Item/1`
- `https://v2.xivapi.com/api/search?query=Name=%22Gil%22&sheets=Item&limit=1`
- `https://v2.xivapi.com/api/search?query=Name~%22Crystal%22&sheets=Item&limit=1`
- `https://v2.xivapi.com/api/asset?path=ui/icon/051000/051474_hr1.tex&format=png`
- `https://v2.xivapi.com/api/asset/map/s1d1/00`
