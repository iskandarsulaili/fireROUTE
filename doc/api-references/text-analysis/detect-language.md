# Detect Language

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `detect-language`
- Docs used manually:
  - `https://detectlanguage.com/documentation/v3`
- Confirmed REST API base URL: `https://ws.detectlanguage.com/v3`
- Primary media type: JSON
- Accepted request formats noted on the official page: `application/json` and `application/x-www-form-urlencoded`
- Authentication model: Bearer API key in the `Authorization` header
- Manually confirmed routes in this pass: `4`

## Authentication
From the official v3 docs:
- you must sign up to obtain an API key
- requests authenticate with:
  - `Authorization: Bearer YOUR_API_KEY`
- the examples consistently use Bearer auth against the `ws.detectlanguage.com` host

## Common request/response conventions
- Base URL: `https://ws.detectlanguage.com/v3`
- reviewed routes return JSON
- the detection endpoints return arrays of language-candidate objects rather than a wrapped response envelope
- the docs explicitly accept both `application/json` and `application/x-www-form-urlencoded` request formats

## Manually confirmed endpoint set

### 1) Detect the language of a single text
- Method: `POST`
- Path: `/detect`
- Full URL: `https://ws.detectlanguage.com/v3/detect`
- Purpose: detect the language of one input text
- Authentication confirmed on the official page:
  - `Authorization: Bearer YOUR_API_KEY`
- Request parameters explicitly documented:
  - `q` - mandatory text input; must be a valid UTF-8 encoded string
- Response format explicitly documented:
  - array of language candidates
  - each candidate includes:
    - `language` - language code
    - `score` - confidence score between `0` and `1`
- Important usage note from the official page:
  - higher `score` means higher confidence

### 2) Detect the languages of multiple texts in one request
- Method: `POST`
- Path: `/detect-batch`
- Full URL: `https://ws.detectlanguage.com/v3/detect-batch`
- Purpose: detect languages for multiple texts in one call
- Authentication confirmed on the official page:
  - `Authorization: Bearer YOUR_API_KEY`
- Request parameters explicitly documented:
  - `q` - mandatory array of texts
- Response format explicitly documented:
  - array of language-candidate arrays, one result set per submitted text
- Important usage notes from the official page:
  - batch mode reduces network overhead and improves performance
  - billing/usage still counts each text as a separate request; the docs explicitly say that if `3` texts are passed, they are counted as `3` requests

### 3) Read account usage and plan status
- Method: `GET`
- Path: `/account/status`
- Full URL: `https://ws.detectlanguage.com/v3/account/status`
- Purpose: return current daily usage and account status information
- Authentication confirmed on the official page:
  - `Authorization: Bearer YOUR_API_KEY`
- Response fields explicitly documented:
  - `date` - current date in UTC
  - `requests` - requests sent today
  - `bytes` - text bytes sent today
  - `plan` - plan code
  - `plan_expires` - plan expiration date
  - `daily_requests_limit`
  - `daily_bytes_limit`
  - `status` - `ACTIVE` or `SUSPENDED`
- Important usage note:
  - this endpoint is the official place where plan-dependent daily limits are surfaced in the reviewed docs

### 4) List all supported languages
- Method: `GET`
- Path: `/languages`
- Full URL: `https://ws.detectlanguage.com/v3/languages`
- Purpose: return the full language catalog supported by the API
- Response fields explicitly documented:
  - `code` - language code
  - `name` - language name

## Rate limits / usage limits
- the reviewed page does not publish one fixed global numeric rate-limit table
- instead, usage ceilings are exposed through the account-status response fields:
  - `daily_requests_limit`
  - `daily_bytes_limit`
- batch detection does not reduce counted usage; each text in a batch is counted separately according to the official note

## Pagination
- none documented for the reviewed v3 endpoints

## Error and response notes
- the reviewed page focuses on successful request/response examples and does not publish a dedicated HTTP error-code table
- detection responses are direct arrays, not objects wrapped under `data`
- `/detect-batch` returns nested arrays to preserve per-input separation

## Important usage notes
- if your language/framework is supported, Detect Language recommends using one of its official clients; otherwise, direct HTTP use is supported
- request-body format is flexible (`application/json` or form-encoded), but auth is consistently header-based
- the account-status endpoint is important operationally because it is where the API exposes daily usage and suspension state

## Verification notes
This file was manually rebuilt from the official Detect Language v3 documentation page using browser inspection.