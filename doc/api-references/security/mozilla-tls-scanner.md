# Mozilla TLS Scanner

## Provider metadata
- Category: `Security`
- Provider slug: `mozilla-tls-scanner`
- Docs used manually:
  - `https://github.com/mozilla/tls-observatory#api-endpoints`
  - official raw README content from the same repository (`raw.githubusercontent.com/mozilla/tls-observatory/master/README.md`) viewed via browser fetch during review
- Confirmed API base URL: `https://tls-observatory.services.mozilla.com/api/v1`
- Primary media types: JSON, plus PEM/text on specific routes
- Authentication: none documented
- Manually confirmed routes in this pass: `9`

## Authentication
- the reviewed official README does not document API keys, OAuth, or token auth for the TLS Observatory API endpoints
- treat the reviewed public API surface as unauthenticated unless Mozilla publishes newer official auth requirements elsewhere

## Common request/response conventions
- the hosted base used throughout the official examples is `https://tls-observatory.services.mozilla.com/api/v1`
- most endpoints return JSON
- route-specific exceptions documented on the page:
  - `GET /truststore` can return PEM or JSON depending on `format`
  - `GET /__stats__` can return JSON by default or plain text when `format=text`
  - `GET /__heartbeat__` returns a simple liveness body with `200 OK`

## Manually confirmed endpoint set

### 1) Schedule a scan
- Method: `POST`
- Path: `/scan`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/scan`
- Query parameters explicitly documented:
  - `target` - required FQDN, without protocol or query string
  - `rescan` - when `true`, request a fresh scan
  - `params` - JSON object of worker-specific parameters
- Worker-specific `params` fields explicitly documented for `ev-checker`:
  - `oid`
  - `rootCertificate`
- Response: JSON document containing the scan ID
- Cache/rate notes:
  - without `rescan=true`, scans from the last `24` hours may reuse the cached scan ID
  - each target can only be rescanned every `3` minutes with `rescan=true`

### 2) Retrieve scan results
- Method: `GET`
- Path: `/results`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/results`
- Query parameters:
  - `id` - scan ID
- Response: JSON document containing the scan results and the end-entity certificate ID

### 3) Retrieve a certificate
- Method: `GET`
- Path: `/certificate`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/certificate`
- Query parameters:
  - `id` - certificate ID
  - `sha256` - DER-certificate checksum, used if `id` is not provided
- Response: JSON document containing the parsed certificate and the raw X.509 form encoded with base64

### 4) Publish a certificate
- Method: `POST`
- Path: `/certificate`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/certificate`
- Request format: `multipart/form-data`
- Form field:
  - `certificate` - PEM-encoded certificate file upload
- Response: JSON document containing the parsed certificate and base64-encoded raw X.509
- Important note: the docs say duplicate certificates are deduplicated by SHA256 of the DER form and the stored version is returned

### 5) Retrieve certificate paths
- Method: `GET`
- Path: `/paths`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/paths`
- Query parameters:
  - `id` - certificate ID
  - `sha256` - DER checksum, used if `id` is not provided
- Response: JSON path document containing the current certificate and arrays of parent certificates

### 6) Retrieve truststore contents
- Method: `GET`
- Path: `/truststore`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/truststore`
- Query parameters:
  - `store` - one of `mozilla`, `android`, `apple`, `microsoft`, `ubuntu`
  - `format` - `pem` or `json`
- Response behavior:
  - `pem` returns concatenated PEM certificates
  - `json` returns an array of certificate objects in the `/certificate` format

### 7) Retrieve issuer end-entity count
- Method: `GET`
- Path: `/issuereecount`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/issuereecount`
- Query parameters:
  - `id` - certificate ID
  - `sha256` - DER checksum, used if `id` is not provided
- Response: JSON document containing `issuer` and `eecount`

### 8) Heartbeat
- Method: `GET`
- Path: `/__heartbeat__`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/__heartbeat__`
- Behavior: simple liveness route that returns `200 OK`

### 9) Service statistics
- Method: `GET`
- Path: `/__stats__`
- Full URL: `https://tls-observatory.services.mozilla.com/api/v1/__stats__`
- Query parameters explicitly documented:
  - `format` - default JSON, or `text`
  - `details` - `full` for real-time statistics
- Important note from the docs:
  - default stats may be stale and only refreshed the last time the endpoint was called
  - `details=full` is expensive and often times out

## Pagination
- none documented on the reviewed official README

## Rate limits
- no general per-account quota is documented
- scan-specific operational limits published by Mozilla:
  - scan IDs may be reused from the last `24` hours unless `rescan=true`
  - each target can only be rescanned every `3` minutes with `rescan=true`

## Error and response notes
- the reviewed README does not publish a structured error catalog
- most routes return JSON
- `/truststore` and `/__stats__` are explicit format-switching exceptions
- `/__heartbeat__` is documented simply as returning `200 OK`

## Important usage notes
- `target` for scan scheduling must be an FQDN only; do not send protocols or query strings
- the `params` object is worker-oriented rather than a flat schema, and the reviewed docs only explicitly detail `ev-checker`
- certificate upload is deduplicated server-side based on the DER SHA256

## Verification notes
This file was manually rebuilt from Mozilla's official TLS Observatory README/API-endpoints section in the official GitHub repository.