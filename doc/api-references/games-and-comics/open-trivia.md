# Open Trivia DB

## Overview
- Provider: Open Trivia Database
- Category: Games & Comics
- Official docs: `https://opentdb.com/api_config.php`
- Base URL: `https://opentdb.com`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Rate limit: one request per IP every `5 seconds` (documented as response code `5` / rate-limit condition)
- License note: data is published under CC BY-SA 4.0 per the official page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api.php` | `amount` required; optional `category`, `difficulty`, `type`, `encode`, `token` | Main trivia question endpoint. |
| GET | `/api_token.php?command=request` | `command=request` | Creates a new session token. |
| GET | `/api_token.php?command=reset&token={token}` | `command=reset`, `token` | Resets a session token history. |
| GET | `/api_category.php` | none | Returns the category list and ids. |
| GET | `/api_count.php?category={category_id}` | `category` | Returns counts for a specific category. |
| GET | `/api_count_global.php` | none | Returns global question counts. |

## Query parameter notes
- Main question endpoint supports:
  - `amount` — maximum `50` questions per call
  - `category` — only one category per request
  - `difficulty` — `easy`, `medium`, `hard`
  - `type` — `multiple` or `boolean`
  - `encode` — `urlLegacy`, `url3986`, or `base64`
  - `token` — session token for duplicate avoidance
- Session tokens expire after `6 hours` of inactivity.

## Response-code semantics
The docs publish API-level response codes in the JSON payload:
- `0` — Success
- `1` — No Results
- `2` — Invalid Parameter
- `3` — Token Not Found
- `4` — Token Empty (all questions exhausted for that token/query)
- `5` — Rate Limit (each IP can only access the API once every 5 seconds)

## Response and encoding notes
- Default response encoding uses HTML entities.
- Optional encodings are:
  - legacy URL encoding
  - RFC 3986 URL encoding
  - Base64
- The docs explicitly call out Unicode and special-character handling as the reason the encoding option exists.

## Integration notes for fireROUTE
- Model this as a quiz/trivia search endpoint plus helper endpoints for taxonomy and quotas.
- Session-token support matters if fireROUTE wants duplicate-free quiz sessions.
- Preserve both HTTP-level and API-level response-code handling because the service uses a custom `response_code` layer.

## Sources inspected
- `https://opentdb.com/api_config.php`
