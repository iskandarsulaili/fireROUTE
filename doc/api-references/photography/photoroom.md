# PhotoRoom

## Overview
- Provider: Photoroom API
- Category: Photography
- Official docs: `https://docs.photoroom.com/`
- Official OpenAPI reference: `https://image-api.photoroom.com/openapi`
- Base URL: `https://image-api.photoroom.com`
- Auth:
  - all current API routes use an `x-api-key` header according to the official OpenAPI security scheme and docs
  - API keys are created in the API dashboard at `https://app.photoroom.com/api-dashboard`
  - the legacy `GET /v1/render` route still documents an `apiKey` query parameter in the OpenAPI spec, but the platform-wide auth docs now standardize on `x-api-key`
- HTTPS: yes
- Response format:
  - account endpoints return JSON
  - image-processing endpoints return an edited image (`image/png` in the OpenAPI spec, plus `application/json` is also documented as a 200 response format for `/v1/segment`)
  - error responses are JSON
- Pagination: none documented
- Rate limits: no public request-per-minute or request-per-hour limit is published in the inspected official docs; the docs focus on credit billing instead
- Billing notes:
  - successful calls consume image credits; calls returning errors do not
  - one Image Editing API call is billed as five Remove Background API calls
  - sandbox mode is available for free testing with watermarked output

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/v1/segment` | required `image_file`; optional `format`, `channels`, `bg_color`, `size`, `crop`, `despill` | Remove Background API (Basic plan). |
| GET | `/v1/account` | none documented beyond auth header | Account details v1 / usage lookup. |
| GET | `/v2/account` | none documented beyond auth header | Account details v2 / usage lookup. |
| GET | `/v2/edit` | `imageUrl`; edit controls such as `removeBackground`, `background.*`, `shadow.*`, `padding*`, `margin*`, `outputSize`, `export.format`, `export.dpi`, `lighting.mode`, `textRemoval.mode`, `uncrop.*`, `upscale.*`, `virtualModel.*`, `flatLay.*`, `ghostMannequin.*`, `editWithAI.*`, `imageFromPrompt.*` | Current Image Editing API for URL-based input (Plus plan). |
| POST | `/v2/edit` | `imageFile`; same edit controls as the GET route but supplied as multipart form fields, including file-based inputs like `background.imageFile` and `editWithAI.additionalImages.{key}.imageFile` | Current Image Editing API for direct file upload (Plus plan). |
| GET | `/v1/render` | legacy `templateId` required; optional `apiKey`, `imageUrl`, `conceptUrl` | Legacy image-editing v1 endpoint. |
| POST | `/v1/render` | required `templateId`; optional `imageFile`, `imageUrl` | Legacy image-editing v1 endpoint using multipart upload. |

Confirmed route count: **7**.

## Plan and product notes
- The docs say the platform currently exposes two main API products:
  - Remove Background API (Basic plan)
  - Image Editing API (Plus plan)
- The introduction page says these are the two APIs users should choose between for background-only work versus broader editing/composition workflows.
- The OpenAPI spec also still publishes legacy v1 render routes and account routes, so the full currently documented route inventory is larger than just the two modern product entrypoints.

## Auth and usage notes
- The OpenAPI security scheme defines header auth as:
  - header name: `x-api-key`
  - type: `apiKey`
- The docs tell users to activate the API in the dashboard and copy their unique key from `https://app.photoroom.com/api-dashboard`.
- The pricing docs say you can monitor remaining credits from the dashboard or through the account endpoint.

## Parameter and payload notes
- `POST /v1/segment` is a classic multipart upload route focused on background removal and output formatting.
- `GET /v2/edit` expects a publicly reachable source image through `imageUrl` and passes all edit settings in the query string.
- `POST /v2/edit` accepts direct uploads through `imageFile` and mirrors the same edit controls in multipart form data.
- The current v2 edit surface is broad and includes background generation, AI shadows, relighting, text removal, expand/uncrop, upscale, export controls, segmentation prompts, describe-any-change, edit-with-AI, virtual model, flat lay, and ghost mannequin features.

## Error and response notes
- OpenAPI-documented response codes:
  - `/v1/segment`: `200`, `400`, `402`, `403`
  - `/v1/account` and `/v2/account`: `200`, `400`, `403`
  - `/v2/edit`: `200`, `400`, `402`, `500`
  - `/v1/render`: `200`, `400`, `402`, `403`, `500`
- Successful image routes return binary image data rather than JSON documents.
- Error responses are JSON.
- The pricing docs explicitly state that calls resulting in an error do not consume image credits.

## fireROUTE integration notes
- Treat PhotoRoom as one provider with seven currently documented route/method combinations, but expose the product split clearly: Basic remove-background, Plus image-editing, account/usage endpoints, and legacy v1 render endpoints.
- Prefer `/v2/edit` for modern integrations; keep `/v1/render` labeled legacy.
- Preserve both GET and POST variants of `/v2/edit` because the input model differs materially: URL-based GET vs multipart-upload POST.
- Do not invent pagination or hard rate-limit behavior; the inspected official docs do not publish those limits.

## Sources inspected
- `https://www.photoroom.com/api`
- `https://docs.photoroom.com/`
- `https://docs.photoroom.com/image-editing-api-plus-plan/quickstart-guide`
- `https://docs.photoroom.com/getting-started/pricing`
- `https://image-api.photoroom.com/openapi`
