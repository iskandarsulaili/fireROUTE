# Binlist

Official docs manually reviewed:
- https://binlist.net/

## Overview
Binlist provides a public BIN/IIN lookup service for card metadata. The reviewed official page documents one public lookup endpoint and shows a concrete example response.

- Base URL: `https://lookup.binlist.net`
- Canonical API path: `GET /{iin}`
- Versioning signal shown in official example: `Accept-Version: 3`
- Auth: none required for the public endpoint
- Response format: JSON

## Authentication
The reviewed official page does not require an API key for the documented public lookup endpoint.

The same page also advertises paid/unlimited access through iinlist/contact channels, but the public Binlist endpoint itself is shown without authentication.

## Confirmed endpoint
| Method | Path | Purpose | Key inputs |
|---|---|---|---|
| GET | `/{iin}` | Look up card metadata for a BIN/IIN prefix | Path `{iin}` as the first 6 to 8 digits of a card number; example request includes header `Accept-Version: 3` |

Manual route count confirmed from the reviewed docs: **1**.

## Official request example
The official page shows this exact pattern:

```bash
curl -H "Accept-Version: 3" "https://lookup.binlist.net/45717360"
```

## Response fields confirmed from official example
The reviewed example response includes:
- `number.length`
- `number.luhn`
- `scheme`
- `type`
- `brand`
- `prepaid`
- `country.numeric`
- `country.alpha2`
- `country.name`
- `country.emoji`
- `country.currency`
- `country.latitude`
- `country.longitude`
- `bank.name`
- `bank.url`
- `bank.phone`
- `bank.city`

The official docs also explicitly note that fields may contain `null` values.

## Rate limits
The reviewed page explicitly states:
- requests are throttled at **5 per hour**
- there is a **burst allowance of 5**
- exceeding the speed limit returns HTTP **429**

## Pagination
No pagination is documented.

## Errors
The reviewed page explicitly documents:
- HTTP `404` when no matching cards are found
- HTTP `429` when the rate limit is exceeded

No richer shared JSON error schema is documented on the reviewed page.

## Important usage notes
- The public example includes the `Accept-Version: 3` header; preserve it in fireROUTE adapters.
- The page describes the input as the first **6 to 8 digits** of a card number.
- The same landing page also advertises premium access for unlimited requests and mentions 8-digit BIN support in the premium upsell; preserve this nuance when comparing public vs paid access.
- Do not assume all response properties are populated; `null` is explicitly possible.

## fireROUTE notes
- Binlist is a good fit for a simple read-only BIN metadata lookup adapter.
- Preserve nullable upstream fields instead of forcing synthetic defaults.
- Keep HTTP `404` and `429` semantics intact because they are explicitly documented by the provider.
