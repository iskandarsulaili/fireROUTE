# JSON2Video

## Provider metadata
- Category: `Video`
- Provider slug: `json2video`
- Official docs pages used:
  - `https://json2video.com/`
  - `https://json2video.com/docs/v2/`
  - `https://json2video.com/docs/v2/api-reference/authentication`
  - `https://json2video.com/docs/v2/api-reference/api-endpoints`
  - `https://json2video.com/docs/v2/api-reference/api-endpoints/movies`
  - `https://json2video.com/docs/v2/troubleshooting/authentication`
- Main API base URL: `https://api.json2video.com/v2`
- Auth model: API key in the `x-api-key` header
- Response format: JSON for API operations, with rendered asset URLs returned in response payloads when jobs finish
- API version documented: `2`
- Manually confirmed route count: `2`

## Authentication
- All API calls require authentication.
- The docs require the `x-api-key` header on every request.
- Example authenticated requests on the official docs use:
  - `x-api-key: [[YOUR_APIKEY]]`
  - `Content-Type: application/json`
- The troubleshooting page says `401 Unauthorized` is returned when the API key is missing or invalid.
- The same troubleshooting page notes that secondary API keys may not have sufficient permissions for some operations.

## Canonical endpoints

### 1) Create a new movie render job
- Method: `POST`
- Path: `/movies`
- Base URL: `https://api.json2video.com/v2`
- Purpose: submit a movie JSON payload and start a new render job

Headers:
- `x-api-key` - required
- `Content-Type: application/json`

Request body:
- A JSON object that conforms to the JSON2Video movie schema
- The reviewed example includes a `scenes` array with media `elements`

Documented success response:
- HTTP `200`
- JSON body fields:
  - `success`
  - `project`
  - `timestamp`

Usage notes:
- The returned `project` id is the handle used for status checks.
- The docs position this as the primary endpoint for the platform.

### 2) Check movie render status
- Method: `GET`
- Path: `/movies`
- Base URL: `https://api.json2video.com/v2`
- Purpose: fetch the status of a previously submitted render job

Headers:
- `x-api-key` - required

Query parameters:
- `project` - required project id returned by the create call

Documented success response:
- HTTP `200`
- Top-level fields:
  - `success`
  - `movie`
  - `remaining_quota`

Documented `movie` fields when rendering is complete:
- `success`
- `status`
- `message`
- `project`
- `url`
- `ass`
- `created_at`
- `ended_at`
- `duration`
- `size`
- `width`
- `height`
- `rendering_time`

Documented status values:
- `pending`
- `running`
- `done`
- `error`

Quota notes:
- The docs show `remaining_quota.time` in the response.
- The reviewed pages describe remaining credits/quota but do not publish a separate numeric request-rate limit.

## Request, payload, and error notes
- JSON2Video is JSON-driven: the render request body must match the documented movie schema.
- The troubleshooting page documents these common errors:
  - `401 Unauthorized` - missing or invalid `x-api-key`
  - `400 Bad Request` - invalid JSON, missing required properties, or invalid property values
- One explicit validation example from the troubleshooting docs: when `resolution` is `custom`, both `width` and `height` are required.
- The status endpoint can return a successful outer response with `movie.success: false` and `movie.status: error`, with diagnostic text in `movie.message`.

## Output and format notes
- Finished movie status responses can include:
  - `url` - rendered video download URL
  - `ass` - subtitles file URL
- The API itself is JSON-based even though it ultimately produces video/subtitle assets.
- The docs reviewed do not publish offset/page-number pagination because the confirmed API surface here is job submission plus single-job status lookup.

## fireROUTE normalization notes
- Model JSON2Video as an asynchronous job API: submit job, then poll by `project` id.
- Preserve provider-specific movie-schema payloads rather than flattening them into a generic video template shape.
- Treat `remaining_quota.time` as account/quota metadata, not as standard page or list information.
