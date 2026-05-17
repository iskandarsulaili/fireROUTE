# AI For Thai

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `ai-for-thai`
- Docs used manually:
  - `https://aiforthai.in.th/`
  - `https://aiforthai.in.th/services/vision/face-analytics?id=67362c2e94a7cf0058a9d459`
  - `https://demo-service.aiforthai.in.th/face-recog/face-detect`
- Confirmed API base URL: `https://demo-service.aiforthai.in.th/services-api`
- Authentication model:
  - the publicly reachable demo routes worked without an auth header in this review
  - the main AI For Thai site separately says developers must register/login to obtain service access and an API key for the broader platform
- Primary response format: JSON
- Manually confirmed routes in this pass: `2`

## Authentication
- The public demo surface confirmed in this review did not require an auth header for the tested `GET` and `POST` requests.
- The main AI For Thai site still presents the broader platform as a developer product that requires account registration/login and API-key-based access to selected services.
- Because the public developer docs remain login-gated, this file documents only the demo-service HTTP surface that could be verified without credentials.

## Pricing and rate-limit notes
- No public numeric throttle table was exposed on the reviewed public pages.
- The public site clearly indicates that developer onboarding and broader service access require registration/login and API-key issuance.

## Request/response format notes
- The public demo frontend loads a shared backend helper from `useBackend-DImkA_GP.js` and calls `https://demo-service.aiforthai.in.th/services-api`.
- That frontend helper confirms two request modes for `POST /api/{serviceId}`:
  - `multipart/form-data` when files are present
  - `application/json` when no file uploads are present
- The helper appends a `useDefault` field in both modes.
- Confirmed live response examples from this review:
  - `GET /config/defaults/facedetect-w-wo-mask` returned JSON: `{"ok":true,"data":{"imageFileName":"face-ex.jpg"}}`
  - `POST /api/facedetect-w-wo-mask` with the sample image returned JSON containing `ok`, `data.objects[]`, `bbox`, and `score`
- The same shared frontend helper also contains handling for `audio/*` and `image/*` responses, indicating that some demo services can return binary media instead of JSON.

## Error handling
- A malformed `POST /api/facedetect-w-wo-mask` request in this review returned HTTP `400` with JSON shaped like:
  - `ok: false`
  - `error: <string>`
  - `status: 400`
- The observed `error` field can contain an upstream error message string rather than a normalized machine-readable error object.

## Pagination
- None of the confirmed demo routes are paginated.
- Each confirmed route is a single request/response call.

## Confirmed routes

### 1) Fetch demo defaults for a service
- Method: `GET`
- Path: `/config/defaults/{serviceId}`
- Full URL pattern: `https://demo-service.aiforthai.in.th/services-api/config/defaults/{serviceId}`
- Confirmed path parameter:
  - `serviceId` - demo service identifier
- Confirmed example:
  - `facedetect-w-wo-mask`
- Confirmed response example:
  - `{"ok":true,"data":{"imageFileName":"face-ex.jpg"}}`
- Notes:
  - the public face-detection demo uses this route to fetch its default sample asset metadata

### 2) Submit a demo inference request
- Method: `POST`
- Path: `/api/{serviceId}`
- Full URL pattern: `https://demo-service.aiforthai.in.th/services-api/api/{serviceId}`
- Confirmed path parameter:
  - `serviceId` - demo service identifier
- Confirmed request fields from the shared public frontend helper:
  - `useDefault` - boolean-like flag sent as JSON field or form field
  - `file` - uploaded file for file-based services such as face detection
  - additional JSON/form payload fields may be service-specific
- Confirmed example:
  - `serviceId = facedetect-w-wo-mask`
- Confirmed successful response shape from this review:
  - top-level `ok`
  - top-level `data`
  - `data.objects[]`
  - `data.objects[].bbox.{xLeftTop,xRightBottom,yLeftTop,yRightBottom}`
  - `data.objects[].score`
- Notes:
  - the tested face-detection demo accepted multipart upload of the published sample image and returned face bounding boxes
  - the shared frontend helper also supports JSON-only submissions for non-file services

## Important usage notes
- The main AI For Thai website publicly lists many AI services, but the route-level developer documentation remains login-gated.
- A publicly accessible service page on the main domain embeds the live demo from `demo-service.aiforthai.in.th/face-recog/face-detect`.
- The public face-detection demo identifies its backend service ID as `facedetect-w-wo-mask`.
- Because only the public demo-service HTTP surface could be grounded without credentials, the confirmed route count is deliberately conservative.

## Verification notes
This file was manually rebuilt from the public AI For Thai homepage, a public service page on the main domain, the public demo page it embeds, the demo frontend asset loaded by that page, and live browser-verified GET/POST calls against the demo-service backend.