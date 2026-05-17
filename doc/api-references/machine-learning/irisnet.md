# Irisnet

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `irisnet`
- Official pages manually reviewed:
  - `https://irisnet.de/api/` -> redirects to `https://api.irisnet.de/swagger-ui/index.html`
  - `https://api.irisnet.de/swagger-ui/swagger-initializer.js`
  - `https://api.irisnet.de/open-api/swagger-config`
  - `https://api.irisnet.de/open-api`
- Manual review outcome: `manually_documented`
- Confirmed routes in this pass: `20`

## API overview
- Official product/API name: `Irisnet API`
- OpenAPI version: `3.1.0`
- API version in the spec: `v2`
- Base URL: `https://api.irisnet.de`
- Primary docs entry: `https://irisnet.de/api/`
- Direct Swagger UI: `https://api.irisnet.de/swagger-ui/index.html`
- OpenAPI JSON: `https://api.irisnet.de/open-api`
- Swagger config: `https://api.irisnet.de/open-api/swagger-config`

The official OpenAPI description presents Irisnet as an API for `Artificial Intelligence (AI) for image- and video-processing in real-time` and states that users should authorize requests with a license key before using the interactive documentation.

## Authentication
- Auth type: `apiKey`
- Header name: `LICENSE-KEY`
- Header location: `header`
- Official description: `License Key access`

## Route inventory

### Configuration Management
1. `GET /v2/config`
   - Summary: list all saved AI configurations.
2. `POST /v2/config`
   - Summary: create a new AI configuration.
   - Request body: `application/json`
   - Response codes: `200`, `400`, `403`
3. `GET /v2/config/{configId}`
   - Summary: get a specific AI configuration.
   - Path params:
     - `configId` `string(uuid)` required
   - Response codes: `200`, `404`
4. `DELETE /v2/config/{configId}`
   - Summary: delete an AI configuration.
   - Path params:
     - `configId` `string(uuid)` required
   - Response codes: `204`, `404`

### Detailed configuration parameters
5. `GET /v2/config/parameters/{configId}`
   - Summary: get the parameters of an AI configuration.
   - Path params:
     - `configId` `string(uuid)` required
   - Response codes: `200`, `404`
6. `POST /v2/config/parameters/{configId}`
   - Summary: set parameters on an AI configuration.
   - Path params:
     - `configId` `string(uuid)` required
   - Request body: `application/json`
   - Response codes: `200`, `204`, `400`, `404`
7. `DELETE /v2/config/parameters/{configId}`
   - Summary: delete the parameters of an AI configuration.
   - Path params:
     - `configId` `string(uuid)` required
   - Response codes: `204`, `404`

### AI check operations
8. `POST /v2/age-verification/{configId}`
   - Summary: perform an age-verification check for a selfie.
   - Path params:
     - `configId` `string(uuid)` required
   - Request body: `application/json`
   - Response codes: `202`, `402`
   - Usage note: asynchronous; request data includes callback handling.
9. `POST /v2/face-authentication/{configId}`
   - Summary: perform a face-authentication check for a selfie.
   - Path params:
     - `configId` `string(uuid)` required
   - Request body: `application/json`
   - Response codes: `202`, `402`
   - Usage note: returns a `checkId` immediately and sends the final result to the supplied callback URL.
10. `POST /v2/check-id-document/{configId}`
    - Summary: check an ID document.
    - Path params:
      - `configId` `string(uuid)` required
    - Request body: `application/json`
    - Response codes: `202`, `402`
    - Usage note: asynchronous callback flow.
11. `POST /v2/check-live-id-document/{configId}`
    - Summary: start a guided live ID-document check.
    - Path params:
      - `configId` `string(uuid)` required
    - Request body: `application/json`
    - Response codes: `202`, `402`
    - Usage note: asynchronous callback flow.
12. `POST /v2/check-poa-document/{configId}`
    - Summary: perform a proof-of-address document check.
    - Path params:
      - `configId` `string(uuid)` required
    - Request body: `application/json`
    - Response codes: `202`, `402`
    - Usage note: asynchronous callback flow.
13. `POST /v2/check-image/{configId}`
    - Summary: check an image with the AI.
    - Path params:
      - `configId` `string(uuid)` required
    - Query params:
      - `url` `string` optional, deprecated
      - `detail` `integer` optional
      - `imageEncode` `boolean` optional
    - Request body: `application/json`
    - Response codes: `200`, `402`, `404`
14. `POST /v2/check-text/{configId}`
    - Summary: check a text with the AI.
    - Path params:
      - `configId` `string(uuid)` required
    - Query params:
      - `detail` `integer` optional
    - Request body: `application/json`
    - Response codes: `200`, `402`, `404`
15. `POST /v2/check-stream/{configId}`
    - Summary: check a stream with the AI.
    - Path params:
      - `configId` `string(uuid)` required
    - Query params:
      - `inUrl` `string` required
      - `outUrl` `string` optional
      - `cycleLength` `integer` optional
      - `checkRate` `integer` optional
    - Response codes: `200`, `402`, `404`
16. `POST /v2/check-video/{configId}`
    - Summary: check a video with the AI.
    - Path params:
      - `configId` `string(uuid)` required
    - Query params:
      - `url` `string` required
      - `detail` `integer` optional
      - `imageEncode` `boolean` optional
      - `checkRate` `integer` optional
    - Request body: `application/json`
    - Response codes: `202`, `402`, `404`
    - Usage note: asynchronous callback flow.

### Balance endpoints
17. `GET /v2/info`
    - Summary: get information for the supplied license key.
    - Response codes: `200`, `404`
18. `GET /v2/cost/{configId}`
    - Summary: get the cost of a configuration for a single image.
    - Path params:
      - `configId` `string(uuid)` required
    - Response codes: `200`, `404`, `429`
19. `GET /v2/cost/{configId}/{frames}`
    - Summary: get the cost of a configuration for moving images by frame count.
    - Path params:
      - `configId` `string(uuid)` required
      - `frames` `integer` required
    - Response codes: `200`, `404`, `429`
20. `GET /v2/cost/{configId}/{fps}/{duration}`
    - Summary: get the cost of a configuration for moving images by FPS and duration.
    - Path params:
      - `configId` `string(uuid)` required
      - `fps` `integer` required
      - `duration` `integer` required
    - Response codes: `200`, `404`, `429`

Manual route count confirmed: **20**.

## Request and response format notes
- The official spec is published as JSON OpenAPI and uses `application/json` request bodies for the documented POST operations.
- The published schemas include `Config`, `ParamSet`, `BiometricCheckRequestData`, `DocumentCheckRequestData`, `PoaCheckRequestData`, `LiveDocumentCheckRequestData`, `LicenseInfo`, `CheckResult`, and `ApiNotice`.
- The face-authentication example in the official spec shows a `callback.callbackUrl` field and a `selfieImage` payload, indicating callback-based async processing and base64-style image submission.
- `check-image` still exposes a query `url`, but the spec explicitly marks that parameter as deprecated and says to use the request body instead.
- `detail` is an optional integer on several check endpoints and changes how much result detail is returned.
- `imageEncode` is available on image/video routes to request encoded output artifacts.
- `checkRate` controls how often frames are analyzed on video/stream routes.

## Errors and status handling
- `200` success on synchronous reads and some AI checks.
- `202` accepted for async workflows that later report to a callback URL.
- `204` no-content responses for successful deletes and some parameter updates.
- `400` bad-request style validation failures are documented for configuration and parameter-setting routes.
- `402` insufficient-credit errors are documented across AI check endpoints.
- `403` is documented on `POST /v2/config`.
- `404` is documented for missing configs, missing parameters, or missing license-key-related resources.
- `429` is documented on the cost endpoints.
- The common official error schema is `ApiNotice`.

## Pagination
- No pagination parameters or pagination section are documented in the official OpenAPI spec.
- No list endpoint in the reviewed spec exposed cursor, page, offset, or limit parameters.

## Rate limits
- I found no published fixed quota or requests-per-minute policy in the reviewed official OpenAPI pages.
- The official spec does document `429` responses on the cost endpoints, so some limit enforcement exists, but no quantitative limit was published in the reviewed docs.

## Important usage notes
- The API is configuration-driven: create a configuration first, then reuse the returned `configId` across parameter, cost, and AI-check operations.
- Several biometric/document/video workflows are asynchronous and rely on callback delivery rather than returning the final analysis inline.
- The OpenAPI JSON is directly downloadable from `https://api.irisnet.de/open-api`, which makes client generation feasible.
- The official Swagger initializer points the docs UI at `/open-api/swagger-config`, and that config in turn resolves the live spec at `/open-api`.

## Verification notes
This file was manually rebuilt from the live official Irisnet redirect, the Swagger UI initializer, the swagger config JSON, and the OpenAPI document published on the provider-controlled `api.irisnet.de` host.