# US Extract

Official docs manually reviewed:
- https://www.smarty.com/docs/apis/us-extract-api/reference

## Overview
Smarty’s US Extract API scans arbitrary text input, extracts US postal addresses, and verifies them.

Confirmed from the reviewed official docs:
- Base URL: `https://us-extract.api.smarty.com`
- Canonical request URL shape: `https://us-extract.api.smarty.com?auth-id=...&auth-token=...`
- Supported methods shown on the page: `POST` and `OPTIONS`
- Authentication model for this API: secret-key auth via `auth-id` and `auth-token`
- Request body content type required by the docs: `text/plain; charset=utf-8`

## Authentication
The official docs explicitly state that embedded-key authentication is **not** supported for this API and that secret-key authentication must be used.

Confirmed credential query parameters:
- `auth-id`
- `auth-token`

Confirmed example URL:

```text
https://us-extract.api.smarty.com?auth-id=123&auth-token=abc
```

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| POST | `/` | Submit arbitrary text and receive extracted/verified address results |

Manual route count confirmed from the official docs: **1**.

## Endpoint details

### `POST /`
Confirmed from the official docs:
- Host: `us-extract.api.smarty.com`
- Request body contains the text to scan for addresses
- Required content type: `text/plain; charset=utf-8`
- Maximum request body length: `64 kilobytes`

Confirmed example request pattern:

```bash
curl -v 'https://us-extract.api.smarty.com/?auth-id=YOUR_AUTH_ID&auth-token=YOUR_AUTH_TOKEN' \
  -H 'Content-Type: text/plain; charset=utf-8' \
  --data-binary '
There are addresses everywhere.
1109 Ninth 85007
Smarty can find them.
3785 Las Vegs Av.
Los Vegas, Nevada
That is all.'
```

## Query parameters
The reviewed official docs list these request parameters in addition to the credential parameters:

| Parameter | Default | Notes |
|---|---|---|
| `html` | `derived` | Whether the input is HTML; HTML is auto-detected and stripped |
| `aggressive` | `false` | More aggressive extraction mode; may use more lookups |
| `addr_line_breaks` | `true` | Whether addresses in the input may span line breaks |
| `addr_per_line` | `0` | Limit addresses extracted per line; `0` means no limit |
| `license` | `derived` | License(s) to use for the lookup |
| `match` | `strict` | Match output strategy |

## Required headers
The official docs explicitly call out these headers:

| Header | Notes |
|---|---|
| `Content-Type` | Must describe the body; official example uses `text/plain; charset=utf-8` |
| `Host` | Example host is `us-extract.api.smarty.com` |

## Response format
Confirmed success behavior from the official docs:
- success status: `200`
- response body: JSON object
- top-level fields include `meta` and `addresses`

Confirmed `meta` example fields:
- `lines`
- `unicode`
- `address_count`
- `verified_count`
- `bytes`
- `character_count`

Confirmed extracted-address example fields:
- `text`
- `verified`
- `line`
- `start`
- `end`
- `api_output`

The docs explicitly note that `api_output` has structural parity with the US Street API response.

## Errors
The reviewed official docs publish these status codes:
- `200` — success; JSON body contains metadata and zero or more extracted addresses
- `400` — blank or malformed request body
- `401` — invalid credentials
- `402` — no active subscription
- `413` — request body larger than 64 KB
- `422` — request understood but parameters need correction
- `429` — too many requests

## Rate limits
The reviewed docs do not publish a fixed numeric rate-limit table for this endpoint.

They do explicitly document `429 Too many requests` behavior, including embedded-key commentary in the generic status-code description, but this API itself requires secret-key auth and only documents `POST` as the supported method for real use.

## Pagination
Not applicable. Each request returns extraction results for a single submitted text body.

## Important usage notes
- The official docs explicitly say that this API only supports secret-key auth in practice because only `POST` is supported for the endpoint.
- Query parameters must be URL-encoded.
- The docs recommend using a proper JSON parser for the response rather than hand-written parsing.
- Some undocumented response fields may appear and are labeled experimental by Smarty.

## fireROUTE notes
- Model this provider as a single text-submission extraction endpoint with credential query parameters.
- Preserve the full JSON response, especially `meta` and nested `api_output`, because verified-address detail is a key part of the product.
- Enforce or at least warn on the 64 KB input-size limit in any adapter.
