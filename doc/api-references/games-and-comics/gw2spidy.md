# GW2Spidy

## Overview
- Provider: GW2Spidy API v0.9
- Category: Games & Comics
- Official docs: `https://github.com/rubensayshi/gw2spidy/wiki`
- Official API page inspected: `https://github.com/rubensayshi/gw2spidy/wiki/API-v0.9`
- Documented base-path pattern from the official wiki: `/api/{version}/{format}`
- Absolute scheme+host: not stated on the inspected official wiki page; the docs only publish relative API paths
- Auth: no API key or other auth requirement is documented on the inspected wiki page
- HTTPS: the inspected documentation pages are HTTPS; the API route examples themselves are documented only as relative paths
- Response formats: JSON and CSV, with JSONP available for JSON responses
- Pagination: documented on paged routes via `page` and `last_page`
- Rate limits: no numeric limit documented; the official page instead publishes a fair-use warning against spamming the hobby project API
- Confirmed routes: `11`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/{version}/{format}/types` | path: `version`, `format` | Type list. Cached up to 24 hours. |
| GET | `/api/{version}/{format}/disciplines` | path: `version`, `format` | Discipline list. Cached up to 24 hours. |
| GET | `/api/{version}/{format}/rarities` | path: `version`, `format` | Rarity list. Cached up to 24 hours. |
| GET | `/api/{version}/{format}/all-items/{type}` | path: `version`, `format`, `type` | Full item list for one top-level type or `all`. Cached up to 3 minutes. |
| GET; documented POST fallback for long `filter_ids` bodies | `/api/{version}/{format}/items/{type}/{page}` | path: `version`, `format`, `type`, `page`; query: optional `sort_trending`, optional `filter_ids` | Paged item list. Docs say use POST with `filter_ids` in the body if the URL becomes too long. Cached up to 15 minutes. |
| GET | `/api/{version}/{format}/item/{dataId}` | path: `version`, `format`, `dataId` | Single item data lookup. Cached up to 3 minutes. |
| GET | `/api/{version}/{format}/listings/{dataId}/{sell-or-buy}/{page}` | path: `version`, `format`, `dataId`, `sell-or-buy`, `page` | Item listings ordered descending by datetime. Cached up to 15 minutes. |
| GET | `/api/{version}/{format}/item-search/{name}/{page}` | path: `version`, `format`, `name`, `page` | Ad-hoc item-name search. Cached up to 15 minutes. |
| GET | `/api/{version}/{format}/recipes/{type}/{page}` | path: `version`, `format`, `type`, `page` | Paged recipe list for one discipline or `all`. Cached up to 24 hours. |
| GET | `/api/{version}/{format}/recipe/{dataId}` | path: `version`, `format`, `dataId` | Single recipe data lookup. Cached up to 15 minutes. |
| GET | `/api/{version}/{format}/gem-price` | path: `version`, `format` | Current gem exchange price. Cached up to 15 minutes. |

## Documented but not counted as confirmed active
- `/api/{version}/{format}/gem-history/{page}`
  - The official wiki includes this path under “Gem Price History” but explicitly labels it `NOT IMPLEMENTED YET`.
  - It is therefore excluded from the confirmed route count above.

## Parameter and behavior notes
- Shared path arguments documented on the official page:
  - `{version}`: API version string; the inspected page specifically documents behavior for `v0.9`
  - `{format}`: one of `json` or `csv`
- Shared format notes:
  - JSON-focused docs are provided on the wiki.
  - CSV returns the same data with a header row first.
  - XML is explicitly rejected by the project author on the official page.
- JSONP:
  - For JSON output, `?jsonp=callback` is supported.
  - `?callback=callback` is documented as an equivalent form that jQuery recognizes automatically.
- Item-list route query parameters:
  - `sort_trending=`: either `sale` or `offer`; sorts descending by last-hour price change and limits results to items with more than 200 sale and offer availability.
  - `filter_ids=`: comma-separated item data IDs; maximum is whatever fits on one page, documented as 100 at the time of writing.
- Route-specific path semantics:
  - `{type}` on item routes is either a top-level type ID or `all`.
  - `{page}` is a page offset on paged endpoints.
  - `{sell-or-buy}` must be singular lowercase `sell` or `buy`.
  - `{name}` is the item name for item search.
  - `{dataId}` is an item or recipe data ID depending on the route.

## Pagination, caching, and errors
- General paging note from the official wiki:
  - paging is used where there are more than `x` results; the page says this is currently `100` for the item list and item listings
  - responses expose `page` and `last_page`
- Paged responses documented on the official page include:
  - item list: `count`, `page`, `last_page`, `results`
  - item listings: `count`, `page`, `last_page`, `total`, `results`
  - item search: `count`, `page`, `last_page`, `results`
  - recipe list: `count`, `page`, `last_page`, `results`
- Error behavior documented on the official page:
  - errors are currently reported with HTTP `404`
  - the page explicitly tells consumers to check headers
- Cache windows documented per route family:
  - `24 hours`: types, disciplines, rarities, recipes list
  - `3 minutes`: all-items, item data
  - `15 minutes`: items list, listings, item search, recipe data, gem price, gem-history placeholder

## Response-format notes
- Every JSON response contains either a `result` object or a `results` array.
- The official page says:
  - `result` is used when the method can only return one logical result
  - `results` is used when the method can return multiple objects
- Datetime fields are documented as UTC and include a literal ` UTC` suffix.
- Prices are returned as integers in copper-like units; the docs give the example `112233` = `11g 22s 33c`.

## Important usage notes
- The official page labels GW2Spidy as a hobby/community project and asks consumers not to spam it.
- The item-list route documentation strongly recommends using `all-items` for most bulk use cases, reserving `items/{type}/{page}` for `filter_ids` or `sort_trending` use.
- The item-search route documentation strongly encourages using the direct item-data route whenever possible and says search is meant for ad-hoc usage rather than large automated use.
- Item-listings freshness depends on crawl priority; some items are crawled every 15 minutes and others less often.
- `subtypes` in the type list restart their IDs from `0` for each top-level type.

## Integration notes for fireROUTE
- Treat the published API surface as relative route patterns rooted at `/api/{version}/{format}` because the inspected official wiki page does not publish an absolute host.
- Preserve response-shape differences between `result` and `results` instead of forcing one uniform schema.
- Keep JSON, CSV, and JSONP behavior distinct.
- Model `/api/{version}/{format}/items/{type}/{page}` as primarily a GET route with a special documented POST fallback only for oversized `filter_ids` submissions.
- Do not count `/gem-history/{page}` as active until the official page stops marking it `NOT IMPLEMENTED YET`.

## Sources inspected
- `https://github.com/rubensayshi/gw2spidy/wiki`
- `https://github.com/rubensayshi/gw2spidy/wiki/API-v0.9`
- `https://github.com/rubensayshi/gw2spidy`
