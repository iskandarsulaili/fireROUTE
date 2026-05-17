# Pixela

## Provider metadata
- Category: `Tracking`
- Provider slug: `pixela`
- Official docs used manually:
  - `https://docs.pixe.la/`
  - `https://docs.pixe.la/entry/post-user`
  - `https://docs.pixe.la/entry/post-graph`
  - `https://docs.pixe.la/entry/post-pixel`
  - homepage landing page `https://pixe.la/`
- Confirmed API base URL: `https://pixe.la`
- Primary formats documented: JSON for API responses, SVG/HTML for graph-view routes
- Authentication: create-user route uses a body token on registration; authenticated graph/pixel operations use `X-USER-TOKEN`
- Manually confirmed routes in this pass: `34`

## Authentication and common response behavior
From the reviewed official pages:
- `POST /v1/users` requires a `token` field in the request body when creating a user
- authenticated graph and pixel operations document the request header `X-USER-TOKEN`
- the `X-USER-TOKEN` header is described as the authentication token specified at user-registration time
- successful examples return JSON with fields such as `message` and `isSuccess`

Documented error/status notes from reviewed route pages:
- `POST /v1/users` explicitly documents possible `400`, `403`, `404`, `409`, and `500`
- `POST /v1/users/<username>/graphs/<graphID>` explicitly documents possible `400`, `404`, `413`, `500`, and `503`
- the pixel page notes that a `503` may include `"isRejected": true`, indicating a request that can be retried

## Confirmed API surface
The official API index page explicitly lists these routes:

### User
- `POST /v1/users`
- `PUT /v1/users/{username}`
- `DELETE /v1/users/{username}`

### User Profile
- `GET /@{username}`
- `PUT /@{username}`

### Graph
- `POST /v1/users/{username}/graphs`
- `GET /v1/users/{username}/graphs`
- `GET /v1/users/{username}/graphs/{graphID}/graph-def`
- `GET /v1/users/{username}/graphs/{graphID}`
- `PUT /v1/users/{username}/graphs/{graphID}`
- `DELETE /v1/users/{username}/graphs/{graphID}`
- `GET /v1/users/{username}/graphs/{graphID}.html`
- `GET /v1/users/{username}/graphs/{graphID}/pixels`
- `GET /v1/users/{username}/graphs/{graphID}/stats`
- `GET /v1/users/{username}/graphs/{graphID}/analyze`

### Pixel
- `POST /v1/users/{username}/graphs/{graphID}`
- `POST /v1/users/{username}/graphs/{graphID}/pixels`
- `GET /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}`
- `GET /v1/users/{username}/graphs/{graphID}/latest`
- `GET /v1/users/{username}/graphs/{graphID}/today`
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}`
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/add`
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/subtract`
- `DELETE /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}`

### Retina
- `GET /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/retina`

### Instant recording
- `PUT /v1/users/{username}/graphs/{graphID}/increment`
- `PUT /v1/users/{username}/graphs/{graphID}/decrement`
- `PUT /v1/users/{username}/graphs/{graphID}/add`
- `PUT /v1/users/{username}/graphs/{graphID}/subtract`
- `POST /v1/users/{username}/graphs/{graphID}/stopwatch`

### Webhook
- `POST /v1/users/{username}/webhooks`
- `GET /v1/users/{username}/webhooks`
- `POST /v1/users/{username}/webhooks/{webhookHash}`
- `DELETE /v1/users/{username}/webhooks/{webhookHash}`

## 1) Create a user
- Method: `POST`
- Path: `/v1/users`
- Purpose: create a new Pixela user

Documented request body fields:
- `token` - required authentication token for the new user; validation rule `[ -~]{8,128}`
- `username` - required; validation rule `[a-z][a-z0-9-]{1,32}`
- `agreeTermsOfService` - required; `yes` or `no`
- `notMinor` - required; `yes` or `no`
- `thanksCode` - optional supporter / limited-feature code

Documented example response:
- success body includes `message` and `isSuccess`

## 2) Create a graph
- Method: `POST`
- Path: `/v1/users/{username}/graphs`
- Purpose: create a graph definition for one tracked metric

Documented request header:
- `X-USER-TOKEN` - required

Documented request body fields:
- `id` - required graph identifier; validation rule `^[a-z][a-z0-9-]{1,16}`
- `name` - required graph name
- `unit` - required metric unit such as `commit`, `kilogram`, or `calory`
- `type` - required; `int` or `float`
- `color` - required; supported values listed are `shibafu`, `momiji`, `sora`, `ichou`, `ajisai`, `kuro`
- `timezone` - optional TZ-database name; defaults to UTC if omitted
- `description` - optional; max 256 characters
- `startOnMonday` - optional boolean
- `selfSufficient` - optional supporter-only setting
- `isSecret` - optional boolean; supporter-limited
- `publishOptionalData` - optional boolean; supporter-limited

## 3) Post a pixel
- Method: `POST`
- Path: `/v1/users/{username}/graphs/{graphID}`
- Purpose: record one quantity value for one date

Documented request header:
- `X-USER-TOKEN` - required

Documented request body fields:
- `date` - required; `yyyyMMdd`
- `quantity` - required stringified numeric value
  - docs list validation patterns for `int` and `float`
- `optionalData` - optional JSON string under 10 KB

Documented resilience note:
- on temporary unavailability, the docs say `503` responses can be retried
- a response body containing `"isRejected": true` means the request was rejected 25% of the time and may be retried until success

## 4) Representative read/view routes
The official index additionally documents these important read/view surfaces:
- `GET /@{username}` - public user profile page
- `GET /v1/users/{username}/graphs` - list graph definitions
- `GET /v1/users/{username}/graphs/{graphID}/graph-def` - get a graph definition
- `GET /v1/users/{username}/graphs/{graphID}` - get graph SVG
- `GET /v1/users/{username}/graphs/{graphID}.html` - graph detail HTML page
- `GET /v1/users/{username}/graphs/{graphID}/pixels` - graph pixel list
- `GET /v1/users/{username}/graphs/{graphID}/stats` - graph stats
- `GET /v1/users/{username}/graphs/{graphID}/analyze` - graph analysis/stats
- `GET /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}` - get one pixel by date
- `GET /v1/users/{username}/graphs/{graphID}/latest` - get latest pixel
- `GET /v1/users/{username}/graphs/{graphID}/today` - get today's pixel
- `GET /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/retina` - high-resolution pixel display

## 5) Representative mutation and automation routes
The index also confirms:
- `PUT /v1/users/{username}` - update user
- `DELETE /v1/users/{username}` - delete user
- `PUT /@{username}` - update user profile
- `PUT /v1/users/{username}/graphs/{graphID}` - update graph
- `DELETE /v1/users/{username}/graphs/{graphID}` - delete graph
- `POST /v1/users/{username}/graphs/{graphID}/pixels` - post multiple pixels
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}` - update a pixel
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/add` - add to a dated pixel
- `PUT /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}/subtract` - subtract from a dated pixel
- `DELETE /v1/users/{username}/graphs/{graphID}/{yyyyMMdd}` - delete a dated pixel
- `PUT /v1/users/{username}/graphs/{graphID}/increment` - increment the current pixel
- `PUT /v1/users/{username}/graphs/{graphID}/decrement` - decrement the current pixel
- `PUT /v1/users/{username}/graphs/{graphID}/add` - add to the current pixel
- `PUT /v1/users/{username}/graphs/{graphID}/subtract` - subtract from the current pixel
- `POST /v1/users/{username}/graphs/{graphID}/stopwatch` - measuring and recording time
- `POST /v1/users/{username}/webhooks` - create webhook
- `GET /v1/users/{username}/webhooks` - list webhooks
- `POST /v1/users/{username}/webhooks/{webhookHash}` - invoke webhook
- `DELETE /v1/users/{username}/webhooks/{webhookHash}` - delete webhook

## Pagination, rate limits, and format notes
From the reviewed official pages:
- no generic pagination system was surfaced in the reviewed routes
- no numeric rate-limit document was surfaced in the reviewed pages
- Pixela exposes both API responses and presentation routes:
  - JSON-style API responses for create/update/read operations
  - SVG graph output at `GET /v1/users/{username}/graphs/{graphID}`
  - HTML graph-detail output at `GET /v1/users/{username}/graphs/{graphID}.html`

## fireROUTE notes
- Pixela is broader than a simple single-route habit tracker; the official index documents full user, graph, pixel, instant-recording, and webhook surfaces.
- Many operations are centered on `{username}` and `{graphID}` rather than server-generated opaque IDs.
- `quantity` is transmitted as a string even when representing numeric data.
- Supporter-only options are mixed into several route schemas; adapters should not assume they are universally available.

## Verification notes
This file was manually rebuilt from the official Pixela docs index and sampled official route pages using browser inspection.