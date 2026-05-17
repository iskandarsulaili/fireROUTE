# Ticketmaster

## Provider metadata
- Category: `Events`
- Provider slug: `ticketmaster`
- Official docs/pages reviewed manually:
  - `https://developer.ticketmaster.com/products-and-docs/apis/getting-started/`
  - `https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/`
  - `https://developer.ticketmaster.com/products-and-docs/apis/partner/`
  - `https://developer.ticketmaster.com/products-and-docs/apis/inventory-status/`
  - `https://developer.ticketmaster.com/products-and-docs/apis/international-discovery/v2/`
- Manually confirmed route count: `45` operations across `41` unique path templates
- Method breakdown:
  - `37` `GET`
  - `3` `POST`
  - `4` `PUT`
  - `1` `DELETE`

## What the official docs currently show
Ticketmaster’s developer portal currently exposes multiple distinct API surfaces rather than one single uniform API:

1. **Discovery API** — the primary open event-discovery surface for new integrations
2. **International Discovery API** — a legacy regional search surface that is still documented, but no longer accepts new API-key requests
3. **Partner API** — a restricted transactional ticketing API for approved distribution partners only
4. **Inventory Status API** — an authorized, near-real-time availability/status API for approved clients only

For new public event-search integrations, the reviewed official docs explicitly recommend the standard Discovery API rather than International Discovery.

## Base URLs and access model

| Surface | Base URL / host | Access model | Notes |
|---|---|---|---|
| Discovery API | `https://app.ticketmaster.com/discovery/v2/` | public developer API key | query-string `apikey`; main open discovery surface |
| International Discovery API | `https://app.ticketmaster.eu/mfxapi/v2/` | legacy API key access | no longer accepting new API-key requests |
| Partner API (prod) | `https://app.ticketmaster.com/partners/v1` | partner-only approval required | transactional reserve/purchase/order flows |
| Partner API (pre-prod) | `https://app.ticketmaster.com/partners-preprod/v1` | partner-only approval required | official pre-production host |
| Inventory Status API | `https://app.ticketmaster.com/inventory-status/` with documented route under `/inventory-status/v1` | authorized clients only | near-real-time status/availability |

## Authentication

### Discovery API
- Official auth mechanism: query-string `apikey`
- Official example: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_API_KEY`
- Invalid-key behavior published in the docs:

```json
{
  "fault": {
    "faultstring": "Invalid ApiKey",
    "detail": {
      "errorcode": "oauth.v2.InvalidApiKey"
    }
  }
}
```

### International Discovery API
- Official auth mechanism: query-string API key on every request
- Requests must use HTTPS
- The docs also require TLS `v1.2+`
- Output format is negotiated with `Accept`; the reviewed docs explicitly list `application/json`

### Partner API
- Access is not open; the docs say it is restricted to companies with official distribution relationships
- Official auth options:
  - query-string `apikey`
  - header `x-api-key`
- Some commit/cart flows additionally mention `Authorization` for auto-claiming tickets to a member account

### Inventory Status API
- Access is provided only to authorized clients
- Official access request contact: `devportalinquiry@ticketmaster.com`
- Requests use Ticketmaster-issued API keys

## Route-family inventory

### 1) Discovery API (`13` `GET` routes)
Base: `https://app.ticketmaster.com/discovery/v2/`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/discovery/v2/suggest` | search suggestions |
| `GET` | `/discovery/v2/attractions` | attraction search |
| `GET` | `/discovery/v2/attractions/{id}` | attraction details |
| `GET` | `/discovery/v2/classifications` | classification search/list |
| `GET` | `/discovery/v2/classifications/genres/{id}` | genre details |
| `GET` | `/discovery/v2/classifications/segments/{id}` | segment details |
| `GET` | `/discovery/v2/classifications/subgenres/{id}` | subgenre details |
| `GET` | `/discovery/v2/classifications/{id}` | classification details |
| `GET` | `/discovery/v2/events` | event search |
| `GET` | `/discovery/v2/events/{id}` | event details |
| `GET` | `/discovery/v2/events/{id}/images` | event images |
| `GET` | `/discovery/v2/venues` | venue search |
| `GET` | `/discovery/v2/venues/{id}` | venue details |

### 2) International Discovery API (`16` `GET` routes)
Base: `https://app.ticketmaster.eu/mfxapi/v2/`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/events` | event search |
| `GET` | `/events/{event_id}` | event details |
| `GET` | `/events/{event_id}/prices` | ticket price levels |
| `GET` | `/events/{event_id}/seatmap` | seatmap assets |
| `GET` | `/events/{event_id}/areas` | event area/section details |
| `GET` | `/attractions` | attraction search |
| `GET` | `/attractions/{attraction_id}` | attraction details |
| `GET` | `/attractions/suggestions` | attraction suggestions |
| `GET` | `/attractions/{attraction_id}/similar` | similar attractions |
| `GET` | `/venues` | venue search |
| `GET` | `/venues/{venue_id}` | venue details |
| `GET` | `/countries` | country reference data |
| `GET` | `/domains` | domain reference data |
| `GET` | `/cities` | city reference data |
| `GET` | `/categories` | category reference data |
| `GET` | `/search/suggestions` | general search suggestions |

Important docs nuance confirmed from the reviewed V2 page:
- the docs say the Similar Attractions route changed from legacy query-style `/attractions/similar?attraction_id={attraction_id}` to path-style `/attractions/{attraction_id}/similar`
- some visible example/code snippets still show older query-style examples, so implementers should follow the V2 change note rather than assuming every embedded snippet is normalized

### 3) Partner API (`15` operations)
Base: `https://app.ticketmaster.com/partners/v1`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/partners/v1/tracking?event_id={event_id}&apikey={apikey}` | affiliate click-tracking URL |
| `POST` | `/partners/v1/events/{event_id}/cart?apikey={apikey}` | reserve tickets and create cart |
| `GET` | `/partners/v1/events/{event_id}/cart/shipping?apikey={apikey}&cart_id={cart_id}&region={region}` | shipping options lookup |
| `PUT` | `/partners/v1/events/{event_id}/cart/shipping?apikey={apikey}&cart_id={cart_id}` | apply shipping option |
| `PUT` | `/partners/v1/events/{event_id}/cart/payment?apikey={apikey}` | add billing/payment information |
| `PUT` | `/partners/v1/events/{event_id}/cart?apikey={apikey}` | commit cart / finalize purchase |
| `GET` | `/partners/v1/claim-link?cart_id={cart_id}&event_id={event_id}` | regenerate claim link |
| `DELETE` | `/partners/v1/events/{event_id}/cart?apikey={apikey}&cart_id={cart_id}` | delete cart / release hold |
| `GET` | `/partners/v1/polling-status?token={token}&cart_id={cart_id}` | poll async operation status |
| `GET` | `/partners/v1/orders?order_token={order_token}&apikey={apikey}` or `/partners/v1/orders?cart_id={cart_id}&event_id={event_id}&apikey={apikey}` | order lookup by order token or by cart/event |
| `GET` | `/partners/v1/orders/unredeemed?apikey={apikey}` | unredeemed orders |
| `GET` | `/partners/v1/status?token={token}&apikey={apikey}` | order redemption status |
| `POST` | `/partners/v1/refund?apikey={apikey}&order_token={order_token}` | refund one order |
| `PUT` | `/partners/v1/refund?apikey={apikey}` | submit batch refunds |
| `GET` | `/partners/v1/refund/{id}?apikey={apikey}` | batch refund job status |

### 4) Inventory Status API (`1` `POST` route)
Base family: `https://app.ticketmaster.com/inventory-status/`

| Method | Path | Official purpose |
|---|---|---|
| `POST` | `/inventory-status/v1/availability?events={universalids}&apikey={apikey}` | near-real-time availability/status for comma-separated event IDs |

## Parameters and request-shape notes

### Discovery API common parameters
The reviewed official Discovery page exposes a broad query surface for search/list routes. Common documented parameters include:
- `apikey`
- `id`
- `keyword`
- `attractionId`
- `venueId`
- `postalCode`
- `latlong` — explicitly marked deprecated; the docs recommend `geoPoint`
- `radius`
- `unit` — `miles` or `km`
- `source` — examples include `ticketmaster`, `universe`, `frontgate`, `tmr`
- `locale`
- `marketId`
- `startDateTime`
- `endDateTime`
- `includeTBA`
- `includeTBD`
- `includeTest`
- `size`
- `page`
- `sort`
- `onsaleStartDateTime`
- `onsaleEndDateTime`
- `city`
- `countryCode`
- `stateCode`
- `classificationName`
- `classificationId`
- `dmaId`
- `localStartDateTime`
- `localStartEndDateTime`
- `startEndDateTime`
- `publicVisibilityStartDateTime`
- `preSaleDateTime`
- `onsaleOnStartDate`
- `onsaleOnAfterStartDate`
- `collectionId`
- `segmentId`
- `segmentName`
- `includeFamily`
- `promoterId`
- `genreId`
- `subGenreId`
- `typeId`
- `subTypeId`
- `geoPoint`
- `preferredCountry`
- `includeSpellcheck`

### International Discovery API common parameters
From the reviewed official V2 examples and route descriptions:
- shared/common filters include `domain`, `lang`, `rows`, `start`, `sort_by`, and `order`
- event search examples/documentation expose filters including `attraction_ids`, `category_ids`, `subcategory_ids`, `event_ids`, `event_name`, `venue_ids`, `city_ids`, `country_ids`, `postal_code`, `lat`, `long`, `radius`, `eventdate_to`, `eventdate_from`, `onsaledate_to`, `onsaledate_from`, `offsaledate_to`, `offsaledate_from`, `min_price`, `max_price`, `price_excl_fees`, `seats_available`, `cancelled`, `is_not_package`, and `exclude_external`
- attraction routes additionally expose parameters such as `attraction_name` and `has_events`
- venue routes expose `venuename`, geography filters, and row/start pagination
- information routes expose parameters such as `country_id`, `category_id`, `subcategories`, `query`, and `include_packages`

### Partner API key parameters and identifiers
Across the reviewed Partner routes, the docs explicitly show or describe these identifiers:
- `apikey`
- `x-api-key`
- `event_id` — described as a `15`-digit alphanumeric event ID on the tracking endpoint
- `cart_id`
- `region`
- `order_token`
- `token`
- `sharedId`
- `subId1`, `subId2`, `subId3`

Important partner request notes confirmed from the reviewed docs:
- reserve-cart requests may include a captcha solution token in the JSON body when the integration requires captcha
- partner integrations should aggressively clean up abandoned carts with `DELETE /cart`
- the billing/payment step supports credit cards, debit cards, and invoice flows, but market support differs by partner type
- unredeemed-orders access requires IP-address whitelisting
- batch refunds are asynchronous and return a job receipt that must be polled

### Inventory Status API parameters
The reviewed official page documents:
- `events` — required comma-separated universal event IDs; maximum supported request size is `7KB` or roughly `350` universal event IDs
- `apikey` — required

Inventory-specific request notes:
- supported sources currently listed: `Ticketmaster`, `TMR`, `TicketWeb`
- supported regions currently listed: `AT`, `AU`, `BE`, `CA`, `CH`, `CZ`, `DE`, `DK`, `ES`, `FI`, `GB`, `IE`, `MX`, `NL`, `NO`, `NZ`, `PL`, `SE`, `US`
- for batched status requests, the docs say to keep event IDs grouped by the same ticketing source and region combination

## Pagination, polling, and batching

### Discovery API pagination
- page-number pagination via `page`
- page size via `size`
- official deep-paging limit: `size * page < 1000`

### International Discovery API pagination
- list responses shown in the reviewed docs include `pagination.start`, `pagination.rows`, and `pagination.total`
- route examples use `rows` and `start` rather than page-number pagination

### Partner API async polling
The docs explicitly say some Partner operations may return `202` with a polling object instead of an immediate final result.

Reviewed official example fields:
- `polling_url`
- `wait`
- `cart_id`

The docs tell clients to wait the documented number of seconds, then `GET` the supplied polling URL. Polling can repeat.

### Inventory batching
- one POST request can include many event IDs in the `events` query value
- the official docs warn not to mix different source/region combinations in one request

## Rate limits
### Discovery API
The reviewed getting-started and Discovery pages publish:
- default quota: `5000` API calls per day
- default burst rate: `5` requests per second

Reviewed quota telemetry response headers:
- `Rate-Limit`
- `Rate-Limit-Available`
- `Rate-Limit-Over`
- `Rate-Limit-Reset`

### International Discovery API
- No numeric quota policy was surfaced on the reviewed page.

### Partner API
- No numeric rate-limit table was surfaced on the reviewed page.
- Operationally, the docs instead emphasize polling behavior and reservation-resource cleanup.

### Inventory Status API
- No numeric quota policy was surfaced on the reviewed page.

## Error and response-format notes

### Discovery API
- invalid API key: documented `401`
- quota exceeded: documented `429`

Official quota-exceeded example:

```json
{
  "fault": {
    "faultstring": "Rate limit quota violation. Quota limit exceeded. Identifier : {apikey}",
    "detail": {
      "errorcode": "policies.ratelimit.QuotaViolation"
    }
  }
}
```

Other reviewed Discovery response notes:
- examples use `.json` resource suffixes
- the getting-started page also shows `callback` usage in examples, indicating legacy JSONP-style support in examples
- the reviewed getting-started page explicitly says the API supports CORS

### International Discovery API
- reviewed docs explicitly publish `application/json` via `Accept`
- example responses include top-level resource arrays plus a `pagination` object
- the reviewed page did not publish a comparable numeric error-code table

### Partner API
- many routes are transaction-oriented and may respond asynchronously with `202` polling instructions rather than a final synchronous payload
- the reviewed page did not publish one universal error-code table, but it repeatedly marks routes as `Polling: Yes` or `Polling: No`

### Inventory Status API
The reviewed docs describe a JSON array of objects with fields including:
- `eventid`
- `status`
- `resaleStatus`
- `statusDetail`
- `resaleStatusDetail`
- `currency`
- `priceRanges`

Additional reviewed Inventory notes:
- min/max price ranges are currently supported only in `US`, `CA`, `AU`, `NZ`, and `MX`
- if the true maximum exceeds `2000.00`, the API caps the returned max at `2000.00` and sets `listingsExtendBeyondMax=true`
- price data refreshes at most once per hour

## Important usage notes
- Treat Ticketmaster as a **multi-surface provider**, not a single-base-url API.
- For new public event-search integrations, prefer the main Discovery API.
- International Discovery is still documented, but the reviewed docs explicitly say no new API-key requests are being accepted.
- Partner and Inventory Status are not open self-serve APIs; both require approval and/or an existing commercial relationship.
- Partner transactions are sensitive to local ticketing-system maintenance windows; the docs warn that local reservation systems can be unavailable between `2AM` and `4AM` local time.
- Partner integrations should explicitly clean up abandoned carts.
- Inventory-status batching should be normalized by source and region to avoid misleading availability results.

## fireROUTE normalization notes
- Keep the four Ticketmaster surfaces distinct in any routing layer:
  - open discovery
  - legacy international discovery
  - partner commerce/fulfillment
  - inventory availability
- Do not collapse International Discovery into main Discovery even though Ticketmaster recommends Discovery for new work; the legacy surface still has its own documented host, parameters, and route inventory.
- Preserve Partner polling semantics instead of assuming normal synchronous purchase flows.
- Preserve Inventory Status as a separate POST workflow even though it uses query parameters heavily.

## Verification notes
This file was manually rebuilt from the current official Ticketmaster developer portal pages listed above, replacing the earlier thinner Discovery-only summary.