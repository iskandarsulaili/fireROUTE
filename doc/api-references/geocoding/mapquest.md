# MapQuest

## Provider metadata
- Category: `Geocoding`
- Provider slug: `mapquest`
- Official docs used manually:
  - `https://developer.mapquest.com/documentation/api/geocoding/`
  - `https://developer.mapquest.com/documentation/api/geocoding/address/get.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/address/post.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/reverse/get.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/reverse/post.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/batch/get.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/batch/post.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/async-batch/post.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/async-batch/results.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/async-batch/errors.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/async-batch/start.html`
  - `https://developer.mapquest.com/documentation/api/geocoding/status-codes.html`
  - `https://developer.mapquest.com/plans/`
- Public geocoding API base URL documented by provider: `https://www.mapquestapi.com/geocoding/v1`
- Transport: `HTTPS`
- Auth model: API key in query parameter `key`
- Response formats documented: sync endpoints support `JSON`, `XML`, and `CSV`; async job metadata endpoints return `JSON`; async results/errors endpoints stream `CSV`

## Product and access notes
- The geocoding docs split the product into forward geocoding, reverse geocoding, batch geocoding, and enterprise-only asynchronous batch jobs.
- The pricing page inspected in this run showed a pay-as-you-go plan with `15,000` free included transactions and then per-transaction billing, plus monthly plans at `30,000`, `75,000`, `200,000`, and enterprise levels.
- The geocoding docs repeatedly mark the API as `Rate Limited`, but the route pages do not publish a per-second or per-minute throttle table.
- The geocoding docs and pricing page both position MapQuest as a transactional geospatial API rather than an unlimited public lookup service.

## Confirmed API surface
The inspected official docs confirm these `13` geocoding routes:
1. `GET /geocoding/v1/address`
2. `POST /geocoding/v1/address`
3. `GET /geocoding/v1/reverse`
4. `POST /geocoding/v1/reverse`
5. `GET /geocoding/v1/batch`
6. `POST /geocoding/v1/batch`
7. `POST /geocoding/v1/batch/jobs`
8. `GET /geocoding/v1/batch/jobs/{jobId}`
9. `GET /geocoding/v1/batch/jobs/{jobId}/results`
10. `GET /geocoding/v1/batch/jobs/{jobId}/errors`
11. `PUT /geocoding/v1/batch/jobs/{jobId}/start`
12. `PUT /geocoding/v1/batch/jobs/{jobId}/stop`
13. `DELETE /geocoding/v1/batch/jobs/{jobId}`

## Shared request rules
- Base route family: `https://www.mapquestapi.com/geocoding/v1`
- All confirmed routes require the query parameter `key`.
- Sync routes support `outFormat=json|xml|csv`; default is `json`.
- Sync `csv` responses support a configurable `delimiter`.
- Several sync GET/POST routes also support `callback=` for JSONP.
- Reverse geocoding docs say native-language support depends on sending `accept-language` with ISO-2 country codes.

## 1) Forward geocode address
### `GET /geocoding/v1/address`
- Purpose: geocode a single free-form address or 5-box query supplied in the query string
- Full URL pattern: `https://www.mapquestapi.com/geocoding/v1/address?key=KEY&location=Washington,DC`
- Documented required parameter:
  - `location`
- Documented notable optional parameters:
  - `boundingBox`
  - `ignoreLatLngInput` (default `false`)
  - `thumbMaps` (default `true`)
  - `maxResults`
  - `outFormat`
  - `delimiter` when `outFormat=csv`
  - `intlMode` with values `5BOX`, `1BOX`, `AUTO`
  - `callback`
- Important official note:
  - the geocoding overview explicitly distinguishes single-line input from 5-box address input on the same endpoint

### `POST /geocoding/v1/address`
- Purpose: geocode a single address supplied in the request body
- Full URL pattern: https://www.mapquestapi.com/geocoding/v1/address?key=KEY
- Documented request body:
  - top-level `location`
  - optional `options` object carrying `boundingBox`, `ignoreLatLngInput`, `thumbMaps`, `maxResults`, `delimiter`, and `intlMode`
- Documented query parameters on the request URL:
  - `key`
  - optional `outFormat`
  - optional `callback`

## 2) Reverse geocode coordinates
### `GET /geocoding/v1/reverse`
- Purpose: convert `latitude,longitude` coordinates to the associated address or nearest address point
- Full URL pattern: `https://www.mapquestapi.com/geocoding/v1/reverse?key=KEY&location=30.333472,-81.470448`
- Documented required parameter:
  - `location` as `lat,lng`
- Documented notable optional parameters:
  - `thumbMaps`
  - `outFormat`
  - `delimiter`
  - `includeNearestIntersection`
  - `includeRoadMetadata`
  - `callback`
- Important official note:
  - native-language support depends on `accept-language`

### `POST /geocoding/v1/reverse`
- Purpose: reverse-geocode coordinates supplied as a JSON body
- Full URL pattern: https://www.mapquestapi.com/geocoding/v1/reverse?key=KEY
- Documented request body:
  - `location.latLng.lat`
  - `location.latLng.lng`
  - optional `includeNearestIntersection`
  - optional `includeRoadMetadata`
  - optional `options.thumbMaps`
  - optional `options.delimiter` for CSV output
- Documented query parameters on the request URL:
  - `key`
  - optional `outFormat`
  - optional `callback`

## 3) Batch geocode up to 100 records
### `GET /geocoding/v1/batch`
- Purpose: geocode multiple locations in one request using repeated query-string `location` parameters
- Full URL pattern: `https://www.mapquestapi.com/geocoding/v1/batch?key=KEY&location=Denver,CO&location=Boulder,CO`
- Documented limits:
  - `100` locations maximum per batch call
- Documented notable parameters:
  - repeated `location`
  - `boundingBox`
  - `ignoreLatLngInput`
  - `thumbMaps`
  - `maxResults`
  - `outFormat`
  - `delimiter`
  - `callback`

### `POST /geocoding/v1/batch`
- Purpose: geocode multiple locations in a JSON body
- Full URL pattern: https://www.mapquestapi.com/geocoding/v1/batch?key=KEY
- Documented request body:
  - top-level `locations` array
  - optional `options` object with `boundingBox`, `ignoreLatLngInput`, `thumbMaps`, `maxResults`, and `delimiter`
- Documented limits:
  - `100` locations maximum per request
- Documented query parameters on the request URL:
  - `key`
  - optional `outFormat`
  - optional `callback`

## 4) Enterprise async batch job lifecycle
### `POST /geocoding/v1/batch/jobs`
- Purpose: create an asynchronous geocoding or reverse-geocoding job for large CSV uploads
- Full URL pattern: `https://www.mapquestapi.com/geocoding/v1/batch/jobs?key=YOUR_API_KEY&type=geocode&startJob=true`
- Availability note from docs: `enterprise only`
- Documented query parameters:
  - `key`
  - `type=geocode|reverse` (default `geocode`)
  - `startJob=true|false` (default `true`)
  - `inputDelimiter` (defaults to `,`)
- Documented request body:
  - plain-text CSV payload, not JSON
  - geocode jobs use columns such as `recId,q,in,lang,limit`
  - reverse jobs use columns such as `recId,at,lang,limit`
- Documented limits:
  - up to `1,000,000` rows
  - up to `500MB` per CSV file
  - results retained for `24` hours after completion

### `GET /geocoding/v1/batch/jobs/{jobId}`
- Purpose: retrieve async job metadata and status
- Documented path parameter:
  - `jobId`
- Documented response fields:
  - `id`
  - `status`
  - `href`
- Documented status values visible on the async docs:
  - `submitted`
  - `queued`
  - `pending`
  - `inProgress`
  - `completed`
  - `stopped`
  - `failure`

### `GET /geocoding/v1/batch/jobs/{jobId}/results`
- Purpose: stream completed async batch results
- Documented response format:
  - `Content-Type: text/plain`
  - `Transfer-Encoding: chunked`
  - pipe-delimited CSV
- Documented CSV fields:
  - `recId`
  - `seqNumber`
  - `seqLength`
  - `position`
  - `address`
  - `title`

### `GET /geocoding/v1/batch/jobs/{jobId}/errors`
- Purpose: stream per-record async batch errors
- Documented response format:
  - `Content-Type: text/plain`
  - `Transfer-Encoding: chunked`
  - pipe-delimited CSV
- Documented CSV fields:
  - `recId`
  - `errorCode`
  - `errorMessage`
- The docs say `errorMessage` contains a JSON object with fields such as `status`, `recordId`, `title`, `cause`, `action`, and `jobRecord`.

### `PUT /geocoding/v1/batch/jobs/{jobId}/start`
- Purpose: start a job that was created with `startJob=false` or restart a stopped job
- Documented response: JSON metadata with `id`, `status`, and `href`
- Docs say the status typically changes to `queued`

### `PUT /geocoding/v1/batch/jobs/{jobId}/stop`
- Purpose: stop an in-flight async batch job
- Documented path/query pattern from the route catalog: `jobId` in path plus `key` in query
- The official route index exposes this as a separate job-lifecycle endpoint under the same async namespace

### `DELETE /geocoding/v1/batch/jobs/{jobId}`
- Purpose: delete an async batch job record
- Documented path/query pattern from the route catalog: `jobId` in path plus `key` in query
- The official route index exposes this as a separate job-lifecycle endpoint under the same async namespace

## Response, errors, pagination, and rate limits
- Sync responses include `info.statuscode`, `info.messages`, `results`, and detailed `locations` entries with fields like `latLng`, `displayLatLng`, `street`, `adminArea*`, `postalCode`, `geocodeQuality`, `geocodeQualityCode`, `linkId`, `sideOfStreet`, and optional `mapUrl`.
- Reverse responses may additionally include `nearestIntersection` and `roadMetadata` when requested.
- There is no page-number pagination model; batch behavior is handled through multi-record requests instead.
- Official status/error table inspected for geocoding:
  - `0` - successful geocode call
  - `400` - input error; docs say the message starts with `Illegal argument from request:`
  - `403` - key-related error
  - `500` - unknown/internal processing error
- Official functional maximum from the same status-codes page:
  - `100` acceptable locations for synchronous batch calls
- Async job docs add the larger enterprise limits of `1,000,000` rows and `500MB` input files.
- The route pages mark the API as `Rate Limited`, and the pricing page exposes transaction-based plan caps, but the inspected geocoding docs do not publish a requests-per-minute table.

## Canonical fireROUTE notes
- Keep sync and async batch flows separate; they have materially different limits (`100` vs `1,000,000` rows), media types, and retrieval mechanics.
- Preserve GET-vs-POST variants for address, reverse, and batch routes because the query-string and request-body contracts differ.
- For async results and errors, preserve the CSV stream behavior instead of coercing them into a JSON-only abstraction.
- `callback` support on sync JSON routes indicates legacy browser integration patterns; do not assume modern CORS-first behavior from the route docs alone.

## Verification notes
- This file was manually rebuilt from live official MapQuest geocoding and pricing pages using browser tools only.
