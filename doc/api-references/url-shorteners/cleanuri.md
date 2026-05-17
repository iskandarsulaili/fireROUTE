# CleanURI

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `cleanuri`
- Official pages reviewed manually:
  - `https://cleanuri.com/`
  - `https://cleanuri.com/docs`
- Confirmed API base URL: `https://cleanuri.com`
- Manually confirmed route count: `1`

## API surface confirmed from official docs
CleanURI’s current first-party docs expose a single shortening endpoint:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/shorten` | Shorten one long URL and return a CleanURI short link |

## Authentication
- No API key or OAuth flow is documented on the reviewed official pages.
- The endpoint is presented as open public access with per-IP rate limiting.

## Request parameters
### `POST /api/v1/shorten`
- Body format in the official example: form-encoded POST data
- Parameters:
  - `url` required — long URL to shorten
- Official input notes:
  - long URLs should be URL-encoded
  - reserved characters such as `&`, `?`, and `#` must be encoded before submission
  - spaces are rejected and should be encoded as `%20` or `+`
  - callers should trim leading and trailing whitespace before submitting user input

## Response format
- Officially documented response format: JSON
- Documented fields:
  - `result_url` — generated short link
  - `error` — error information when a failure occurs
- Official example response:
  - `{"result_url":"https:\/\/cleanuri.com\/pEqXje"}`

## Rate limits
- Official docs publish a limit of `2 requests per second` per IP.

## Pagination
- None documented
- Not applicable for the single reviewed shortening route

## Errors
- The docs mention an `error` field in the JSON response when a failure occurs.
- The reviewed page does not publish a detailed HTTP-status table or enumerated error-code list.

## Important usage notes
- The official docs explicitly prefer `POST` over `GET` because URL length limits can break large encoded inputs.
- CleanURI’s website root still links directly to the same first-party docs page, so the docs surface is currently live and provider-controlled.
- I counted only the single explicitly documented shortening route.

## Verification note
This file was manually rebuilt from the current official CleanURI homepage and the live first-party API documentation page using browser-based review only.
