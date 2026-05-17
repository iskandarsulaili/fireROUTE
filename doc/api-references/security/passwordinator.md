# Passwordinator

## Provider metadata
- Category: `Security`
- Provider slug: `passwordinator`
- Docs used manually:
  - `https://github.com/fawazsullia/password-generator/`
  - `https://raw.githubusercontent.com/fawazsullia/password-generator/master/index.js`
  - `https://passwordinator.onrender.com`
- Confirmed API base URL from the official README: `https://passwordinator.onrender.com`
- Primary response format: JSON
- Authentication model confirmed from the official README and server source: none
- CORS / method notes confirmed from the official server source:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET`
- Manually confirmed routes in this pass: `1`

## Service availability note
- The official README states the project originally lived on Heroku and may not always be reachable.
- In this pass, a live browser check of `https://passwordinator.onrender.com` returned plain-text `Not Found`.
- Because the current deployment is not serving the documented API successfully in this environment, the request shape below is grounded in the official GitHub README plus the official Node.js server implementation.

## Authentication
- No authentication is documented in the official README.
- The official Node.js server implementation also defines no API-key, bearer-token, cookie, or session requirement.

## Common request/response conventions
- Runtime base URL: `https://passwordinator.onrender.com`
- HTTP method family: `GET` only
- Default behavior described in the official README: requesting the server root returns a `14`-character password made from lowercase letters
- Response body shape from the official README and server source:
  - `{ "data": "<generated-password>" }`

## Manually confirmed endpoint inventory

### 1) Generate a password
- Method: `GET`
- Path: `/`
- Full URL: `https://passwordinator.onrender.com/`
- Purpose: generate a random password string
- Query parameters documented in the official README and implemented in the official server source:
  - `num` - optional boolean; include numbers when `true`
  - `char` - optional boolean; include special characters when `true`
  - `caps` - optional boolean; include uppercase letters when `true`
  - `len` - optional integer; requested password length; the README says it must be greater than `7`
- Official example requests shown in the README:
  - `GET https://passwordinator.onrender.com`
  - `GET https://passwordinator.onrender.com?num=true&char=true&caps=true&len=18`
- Response example documented in the README:
  - `{ "data": "sAl7*KladK" }`

Manual route count confirmed: **1**.

## Parameters and request-body notes
- All customization is query-string driven.
- No request body is used.
- The official server validates query names against exactly four supported keys: `num`, `caps`, `char`, and `len`.

## Pagination
- No pagination, cursor, offset, or page-size parameters are documented or implemented.
- This is a single synchronous utility endpoint that returns one generated value per request.

## Rate limits
- The official server source includes an in-memory per-IP limiter.
- Limit confirmed from the source and limiter message: `20` requests per `10` seconds per IP.
- When exceeded, the server responds with plain text:
  - `Too many requests, slow down. Max 20 allowed in 10 seconds`
- No `Retry-After` header or longer-term published quota policy was visible in the official README.

## Errors and response notes
- Invalid query keys return HTTP `400` with JSON shaped like:
  - `{ "data": "<key> is not a valid query" }`
- The official README says `len` must be greater than `7`, and the server source contains an intended HTTP `400` response with:
  - `{ "data": "len can't be less than 8" }`
- However, the current implementation compares `queryObj.num < 8` inside that validation branch, so live length enforcement may not perfectly match the README text.
- The rate-limit response is plain text rather than JSON.

## Important usage notes
- The official README explicitly describes this as a learning project.
- The same README explicitly warns it should not be used for serious password-generation needs.
- The README also warns that the public deployment may be unavailable, which matched this pass's live `Not Found` result on the Onrender host.
- fireROUTE should therefore treat the route shape as documented, but the public deployment as unreliable.

## Verification notes
This file was manually rebuilt from the official GitHub README, the official Node.js server source, and a live browser check of the published Onrender host.