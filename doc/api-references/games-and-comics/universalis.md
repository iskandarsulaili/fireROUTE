# Universalis

## Overview
- Provider: Universalis
- Category: Games & Comics
- Official docs: `https://docs.universalis.app/`
- Official site/API host: `https://universalis.app/`
- Base URL: `https://universalis.app/api/v2`
- WebSocket endpoint: `wss://universalis.app/api/ws`
- Auth: none documented
- HTTPS: yes
- Response formats: JSON for REST, `application/problem+json` for documented error objects, BSON over WebSocket
- Confirmed routes: `16` (`15` REST routes + `1` WebSocket endpoint)

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v2/data-centers` | none | Returns all supported data centers with regions and world ID lists. Live check returned `200` JSON. |
| GET | `/api/v2/worlds` | none | Returns world IDs and names. Live check returned `200` JSON. |
| GET | `/api/v2/aggregated/{worldDcRegion}/{itemIds}` | path: `worldDcRegion`, `itemIds`; optional headers: `User-Agent`, `CF-Connecting-IP` | Aggregated market-board data. Docs say up to `100` comma-separated item IDs. `AverageSalePrice` and `DailySaleVelocity` use the last `4` days of sales. |
| GET | `/api/v2/extra/content/{contentId}` | path: `contentId` | Returns a game content object. Docs warn this endpoint is largely untested and may return inconsistent data. |
| GET | `/api/v2/extra/stats/least-recently-updated` | query: `world`, `dcName`, `entries` | Returns least-recently-updated items for a world or data center with upload times. `entries` default `50`, max `200`. |
| GET | `/api/v2/{worldDcRegion}/{itemIds}` | path: `worldDcRegion`, `itemIds`; query: `listings`, `entries`, `hq`, `statsWithin`, `entriesWithin`, `fields`; optional headers: `User-Agent`, `CF-Connecting-IP` | Returns current market-board listings plus recent history. Docs say up to `100` comma-separated item IDs. Live check with `listings=1&entries=1&fields=...` returned `200` JSON. |
| GET | `/api/v2/history/{worldDcRegion}/{itemIds}` | path: `worldDcRegion`, `itemIds`; query: `entriesToReturn`, `statsWithin`, `entriesWithin`, `entriesUntil`, `minSalePrice`, `maxSalePrice`; optional headers: `User-Agent`, `CF-Connecting-IP` | Returns sale history for one world/data center and one or more items. Docs say `entriesToReturn` defaults to `1800` and can be set as high as `99999`. Live check returned `200` JSON. |
| GET | `/api/v2/tax-rates` | query: `world`; optional header: `User-Agent` | Returns current in-game market tax rates for the specified world. Live check for `world=Adamantoise` returned `200` JSON. |
| GET | `/api/v2/marketable` | none | Returns the set of marketable item IDs. Live check returned `200` JSON array. |
| GET | `/api/v2/extra/stats/most-recently-updated` | query: `world`, `dcName`, `entries` | Returns most-recently-updated items for a world or data center with upload times. `entries` default `50`, max `200`. |
| GET | `/api/v2/extra/stats/recently-updated` | none | Legacy endpoint listing some recently updated items, without world/data-center attribution. |
| GET | `/api/v2/extra/stats/uploader-upload-counts` | none | Returns total upload counts grouped by uploader/client application. |
| GET | `/api/v2/extra/stats/world-upload-counts` | none | Returns upload counts and proportions grouped by world. |
| GET | `/api/v2/extra/stats/upload-history` | none | Returns uploads-per-day history for the past `30` days. |
| GET | `/api/v2/lists/{listId}` | path: `listId` | Retrieves a user list by list ID. Live check with a fake ID returned `404 application/problem+json`. |
| WS | `/api/ws` | BSON message fields include `event` and `channel`; supported events shown: `subscribe`, `unsubscribe`; documented channels: `listings/add`, `listings/remove`, `sales/add`, `sales/remove`; channel filters use suffixes like `{world=73}` | Real-time WebSocket feed. Docs show BSON-serialized client messages and BSON server messages. A full reference is not published, but the endpoint and channel names are official and confirmed in the WebSocket docs. |

## Authentication
- The official docs do not require API keys or OAuth for either the REST API or the WebSocket API.
- No auth headers, bearer tokens, or account-registration requirements are documented on the reviewed official pages.
- Some REST operations display optional `User-Agent` and `CF-Connecting-IP` headers in the docs UI, but these are not presented as authentication requirements.

## Parameters and request-shaping notes
- Shared REST path variables:
  - `worldDcRegion`: a world, data center, or region, accepted as an ID or a name depending on the endpoint docs.
  - `itemIds`: one item ID or a comma-separated list of item IDs, with a documented maximum of `100` item IDs for the multi-item price/history endpoints.
- Region names must use the documented values: `Japan`, `Europe`, `North-America`, `Oceania`, `China`, or `中国`.
- `/api/v2/{worldDcRegion}/{itemIds}` query options:
  - `listings`: number of listings to return per item
  - `entries`: number of recent history entries to return per item
  - `hq`: filter HQ vs. NQ entries/listings
  - `statsWithin`: stats window in milliseconds
  - `entriesWithin`: include only entries within the prior N seconds
  - `fields`: comma-separated partial-response selector; docs note multi-item queries change the response schema, so field selectors must match that schema
- `/api/v2/history/{worldDcRegion}/{itemIds}` query options:
  - `entriesToReturn`: default `1800`, max `99999`
  - `statsWithin`: stats window in milliseconds
  - `entriesWithin`: number of seconds before `entriesUntil` or now
  - `entriesUntil`: UNIX timestamp in seconds
  - `minSalePrice`, `maxSalePrice`: inclusive unit-price filters
- `/api/v2/extra/stats/least-recently-updated` and `/api/v2/extra/stats/most-recently-updated`:
  - `world` and `dcName` are alternative scope selectors
  - `entries` default `50`, max `200`
- WebSocket subscriptions:
  - client messages are BSON objects such as `{"event":"subscribe","channel":"listings/add"}`
  - unsubscribe uses the same structure with `event="unsubscribe"`
  - filters are embedded in `channel`, e.g. `listings/add{world=73}`
  - multiple subscriptions on the same channel can be combined for OR-like filtering

## Pagination, rate limits, and errors
- No page-number/offset pagination model is documented for the reviewed Universalis routes.
- Result size is instead controlled with route-specific limits such as:
  - `itemIds` max `100` on current/aggregated/history multi-item routes
  - `entries` default `50`, max `200` on the most/least-recently-updated stats routes
  - `entriesToReturn` default `1800`, max `99999` on the history route
- Official rate-limit notes from the docs landing page:
  - API: `25 req/s` with `50 req/s` burst
  - Website scraping: `15 req/s` with `30 req/s` burst
  - Simultaneous connections per IP: `8`
- Documented REST errors include:
  - `400` for invalid parameters on the aggregated and current-market-data routes
  - `404` for invalid world/data-center/item combinations or missing resources such as unknown list IDs
- Live error check:
  - `GET https://universalis.app/api/v2/lists/not-a-real-list-id` returned `404` with `application/problem+json`
  - sample body: `{"type":"https://tools.ietf.org/html/rfc9110#section-15.5.5","title":"Not Found","status":404,...}`

## Response-format notes
- REST responses are JSON.
- Error objects for missing resources are served as `application/problem+json`.
- `/api/v2/data-centers` returns objects with data-center names, region names, and world ID arrays.
- `/api/v2/worlds` returns world records with `id` and `name`.
- `/api/v2/marketable` returns a large JSON array of marketable item IDs.
- `/api/v2/aggregated/{worldDcRegion}/{itemIds}` returns a `results` array with aggregated pricing/statistics structures.
- `/api/v2/{worldDcRegion}/{itemIds}` can return reduced partial payloads when `fields` is supplied.
- `/api/v2/history/{worldDcRegion}/{itemIds}` returns entry histories and sale-velocity/statistical fields.
- WebSocket payloads are BSON, uncompressed, and intended to be decoded client-side.

## Important usage notes
- The docs explicitly recommend using the aggregated route when you do not need individual listings or sale entries, because it uses cached values and is strongly preferred over the current-market-data endpoint in that case.
- The WebSocket docs explicitly state that precalculated summary fields such as averages and min/max prices are not provided over the socket feed; clients must do their own processing.
- The WebSocket docs also note that the API is probably a poor fit for spreadsheet-style consumers such as Google Sheets or Excel.
- The `extra/content` endpoint is documented as largely untested and potentially inconsistent, so fireROUTE should treat it as lower-confidence than the core market endpoints.
- The user-list route is read-only in the published docs reviewed here; no official create/update/delete list routes were published.

## Integration notes for fireROUTE
- Treat Universalis as a public, unauthenticated market-data provider.
- Preserve provider-specific selectors such as `worldDcRegion`, `itemIds`, `hq`, `fields`, and the history-window controls as passthrough options rather than over-normalizing them.
- Prefer `/aggregated/...` for summary price lookups and `/history/...` or `/{worldDcRegion}/{itemIds}` only when listing-level or sale-level detail is required.
- Support `application/problem+json` as the canonical REST error format for not-found conditions.
- If WebSocket support is added, expose the raw event-channel model rather than pretending the socket feed is route-equivalent to the REST summaries.

## Sources inspected
- `https://docs.universalis.app/`
- `https://universalis.app/`
- live checks:
  - `https://universalis.app/api/v2/data-centers`
  - `https://universalis.app/api/v2/worlds`
  - `https://universalis.app/api/v2/marketable`
  - `https://universalis.app/api/v2/aggregated/Primal/5333`
  - `https://universalis.app/api/v2/Primal/5333?listings=1&entries=1&fields=listings.pricePerUnit,recentHistory.pricePerUnit,worldName,itemID`
  - `https://universalis.app/api/v2/history/Primal/5333?entriesToReturn=1`
  - `https://universalis.app/api/v2/tax-rates?world=Adamantoise`
  - `https://universalis.app/api/v2/lists/not-a-real-list-id`
