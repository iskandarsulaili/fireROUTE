# 1Forge

Official docs manually reviewed:
- https://1forge.com/forex-data-api/api-documentation
- https://1forge.com/api/faq

## Overview
1Forge publishes a small REST surface for live forex and crypto quote data.

- Base URL: `https://api.1forge.com`
- Auth: API key in query string as `api_key`
- Response formats confirmed in the reviewed docs: JSON on the API documentation page; the FAQ also says data is available in JSON, XML, and CSV
- Timestamp format: Unix / epoch seconds
- WebSocket note: official docs say streaming is available in supported libraries and not available on free plans

## Authentication
All reviewed REST examples include the API key in the query string:

```text
api_key=YOUR_API_KEY
```

The FAQ says request volume is tied to the customer plan's daily quota and quotas reset daily at midnight UTC.

## Confirmed endpoints
| Method | Path | Purpose | Confirmed parameters |
|---|---|---|---|
| GET | `/quotes` | Get quotes for one or more requested pairs | `pairs`, `api_key` |
| GET | `/symbols` | List supported symbols/pairs | `api_key` |
| GET | `/convert` | Convert one currency into another | `from`, `to`, `quantity`, `api_key` |
| GET | `/market_status` | Check whether the market is open | `api_key` |
| GET | `/quota` | Show quota usage and remaining allowance | `api_key` |

Manual route count confirmed from the reviewed official docs: **5** routes.

## Endpoint details

### `GET /quotes`
Official request example:

```text
https://api.1forge.com/quotes?pairs=EUR/USD,GBP/JPY,AUD/USD&api_key=YOUR_API_KEY
```

Notes confirmed from the docs:
- `pairs` is a comma-separated list.
- Response is an array of quote objects.
- Example fields shown: `s` (symbol), `p` (mid price), `b` (bid), `a` (ask), `t` (timestamp).

### `GET /symbols`
Official request example:

```text
https://api.1forge.com/symbols?api_key=YOUR_API_KEY
```

Returns a JSON array of supported symbol strings such as `AUD/JPY`, `EUR/USD`, and `GBP/JPY`.

### `GET /convert`
Official request example:

```text
https://api.1forge.com/convert?from=USD&to=EUR&quantity=100&api_key=YOUR_API_KEY
```

Confirmed response fields from the docs:
- `value`
- `text`
- `timestamp`

### `GET /market_status`
Official request example:

```text
https://api.1forge.com/market_status?api_key=YOUR_API_KEY
```

Confirmed response example contains:
- `market_is_open`

### `GET /quota`
Official request example:

```text
https://api.1forge.com/quota?api_key=YOUR_API_KEY
```

Confirmed response example contains:
- `quota_used`
- `quota_limit`
- `quota_remaining`
- `hours_until_reset`

## Rate limits and quotas
The FAQ does not publish a universal numeric limit for all plans, but it does confirm:
- requests are limited by the plan's daily quota
- quotas reset daily at `00:00 UTC`
- users can inspect usage via the `/quota` endpoint

## Errors and response behavior
The reviewed pages do not publish a dedicated error-schema reference. The API docs are example-driven and primarily show successful JSON responses.

## Pagination
No pagination model is documented for the confirmed endpoints.

## Important usage notes
- The official docs say 1Forge currently does not offer historical data.
- The docs say `api.1forge.com` is globally routed to a nearby server location.
- The FAQ states the displayed `price` is the average of bid and ask.
- The FAQ states the open/free offering is rate limited by daily quota rather than by an always-on per-request burst figure.
