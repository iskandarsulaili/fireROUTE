# OpenVisionAPI

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `openvisionapi`
- Official pages manually reviewed in this pass:
  - `https://openvisionapi.com`
  - `https://openvisionapi-documentation.readthedocs.io/en/latest/`
  - `https://openvisionapi-documentation.readthedocs.io/en/latest/start.html`
  - `https://openvisionapi-documentation.readthedocs.io/en/latest/configure.html`
  - `https://openvisionapi-documentation.readthedocs.io/en/latest/api.html`
  - `https://github.com/openvisionapi/ova-server`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/__init__.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/config/api/config.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/consts.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/detection/consts.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/detection/routes.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/detection/schemas.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/detection/validators.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/errors.py`
  - `https://github.com/openvisionapi/ova-server/blob/master/api/exceptions.py`
- Confirmed API base URL: `https://api.openvisionapi.com`
- Authentication model confirmed from the official docs/source: no API key, bearer token, or OAuth flow was documented in the reviewed official docs or official server source
- Primary request/response formats: `multipart/form-data` uploads for detection, JSON responses
- Manual review outcome: `manually_documented`
- Confirmed routes in this pass: `2`

## Authentication
- The reviewed official docs do not publish an API key, bearer token, OAuth flow, signed-request scheme, or token-issuance endpoint.
- The official detection example only documents a multipart upload header:
  - `Content-type: multipart/form-data; boundary=---BOUNDARY`
- The reviewed official server source registers the public routes directly and does not show an auth dependency on either confirmed route.
- Based on the official material reviewed here, OpenVisionAPI currently appears to expose the documented public instance without request-level authentication.

## Rate limits
- The official configuration source sets `DETECTION_RATE_LIMIT` to a default of `100/minute`.
- The reviewed official route source applies that limiter to `POST /api/v1/detection`.
- No official numeric limit was documented for `GET /health`.
- The reviewed official pages do not publish billing tiers, monthly quotas, or concurrency limits.

## Request/response format notes
- The official quick-start page says a free public instance is available at `https://api.openvisionapi.com`.
- The detection endpoint uses `multipart/form-data`, not JSON, for request submission.
- The reviewed official route source requires these form parts:
  - `model` - required form field
  - `image` - required uploaded file
- The reviewed official detection-model enum currently exposes one documented model value:
  - `yolov4`
- The reviewed official server constants currently allow these uploaded image MIME types:
  - `image/jpeg`
  - `image/png`
- The official configuration source sets the default maximum image size to `4 MB`.
- The official detection response schema is JSON with:
  - `description`
  - `predictions[]`
  - `predictions[].bbox.x1`
  - `predictions[].bbox.y1`
  - `predictions[].bbox.x2`
  - `predictions[].bbox.y2`
  - `predictions[].label`
  - `predictions[].score`
- The official health route returns JSON with:
  - `status`

## Pagination
- None of the reviewed official docs or official source files document page-number, cursor, offset, or token pagination.
- The confirmed routes are a health check and a single-image inference endpoint, so no paginated collection flow was exposed.

## Error handling
- The reviewed official error handlers confirm these explicit detection-route responses:
  - `413` with JSON `{ "error": "Image size exceeds the limit: <size in MB> MB" }` when the uploaded file exceeds the configured maximum size
  - `415` with JSON `{ "error": "Unsupported Image Type" }` when the uploaded file cannot be opened as an allowed image type
  - `429` with JSON `{ "error": "Too many requests: the limit is <rate-limit detail>" }` when the configured request limit is exceeded
- The reviewed official docs do not publish a broader HTTP status table, retry contract, or machine-readable error catalog.
- The official docs also do not document a separate pagination or batch-error envelope because only the single-image detection flow is currently exposed.

## Important usage notes
- The official homepage `https://openvisionapi.com` still failed with `net::ERR_HTTP2_PROTOCOL_ERROR` during this pass, but the provider's official Read the Docs site and official GitHub repository were reachable and sufficient to confirm the live route surface.
- The reviewed official docs position OpenVisionAPI as an open-source computer-vision API and explicitly point to the public instance at `https://api.openvisionapi.com`.
- The reviewed official configuration/source currently supports `tensorflow_lite` and `tensorflow` frameworks, with hardware options documented as `cpu`, `gpu`, and `edgetpu`.
- The reviewed public docs and official server source currently expose object detection only; no additional public classification, segmentation, OCR, or embedding routes were documented in this pass.

## Confirmed routes

### 1) Health check
- Method: `GET`
- Path: `/health`
- Full URL: `https://api.openvisionapi.com/health`
- Auth: none documented in the reviewed official docs/source
- Confirmed response body:
  - `status` - string; the official route returns `{ "status": "OK" }`
- Usage notes:
  - this route is registered directly on the main FastAPI application in the reviewed official source
  - it is the only non-inference route explicitly visible in the reviewed official code

### 2) Object detection
- Method: `POST`
- Path: `/api/v1/detection`
- Full URL: `https://api.openvisionapi.com/api/v1/detection`
- Auth: none documented in the reviewed official docs/source
- Confirmed request headers:
  - `Content-type: multipart/form-data; boundary=---BOUNDARY`
- Confirmed form-data fields:
  - `model` - required detection model selector; the reviewed official enum currently exposes `yolov4`
  - `image` - required uploaded image file
- Confirmed accepted image MIME types from official source:
  - `image/jpeg`
  - `image/png`
- Confirmed size/rate constraints from official source:
  - max image size default: `4 MB`
  - default route rate limit: `100/minute`
- Confirmed response fields:
  - `description`
  - `predictions[]`
  - `predictions[].bbox.x1`
  - `predictions[].bbox.y1`
  - `predictions[].bbox.x2`
  - `predictions[].bbox.y2`
  - `predictions[].label`
  - `predictions[].score`
- Confirmed error responses from official source:
  - `413` - JSON error for oversized images
  - `415` - JSON error for unsupported image types
  - `429` - JSON error when the rate limit is exceeded
- Usage notes:
  - the official docs' multipart example and the official route definition both show upload-by-file rather than image-by-URL submission
  - the current reviewed official docs/source expose only one model value: `yolov4`
  - the example response describes predictions as detected objects with bounding boxes and scores

## Verification notes
This file was rebuilt from a live manual review of OpenVisionAPI's reachable official Read the Docs pages plus the provider's official GitHub repository and route/configuration source. The marketing homepage itself was still transport-broken during this pass, but the official documentation and official source were reachable enough to confirm the provider's current public API surface.