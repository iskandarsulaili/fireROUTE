# Imagga

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `imagga`
- Docs used manually:
  - `https://docs.imagga.com/`
- Confirmed API base URL: `https://api.imagga.com`
- Authentication model confirmed in this pass: HTTP Basic authentication with `api_key` as username and `api_secret` as password
- Confirmed request formats in this pass: query-string GET requests, `multipart/form-data` POST uploads, JSON responses, and a binary image response for background removal
- Manually confirmed routes in this pass: `38`

## Authentication
- The official docs say all Imagga API requests must be authenticated with HTTP Basic Authentication.
- The docs describe the credential mapping as:
  - API key -> username
  - API secret -> password
- Official header format documented on the reviewed page:
  - `Authorization: Basic base64(api_key:api_secret)`
- The docs explicitly require HTTPS because Basic Auth sends credentials with every request.
- No OAuth flow, bearer-token scheme, or expiring session token flow was documented on the reviewed page.

## Request and response format notes
- The public API base URL shown repeatedly in the official docs is `https://api.imagga.com`.
- Most confirmed routes return JSON with the top-level structure:
  - `result`
  - `status.type`
  - `status.text`
- GET routes typically accept either `image_url` or `image_upload_id` for image input.
- POST routes typically accept either:
  - `image` uploaded as `multipart/form-data`, or
  - `image_base64`
- The official docs repeatedly warn to provide exactly one supported image input per request.
- One reviewed exception is background removal, which returns a binary image rather than JSON.

## Error handling
The reviewed docs expose a shared error section with these HTTP codes:
- `400` - bad request
- `401` - unauthorized / invalid authentication
- `403` - forbidden
- `404` - not found
- `405` - method not allowed
- `406` - requested response format not supported
- `410` - gone, including expired uploads or tickets
- `429` - concurrency or rate limits exceeded
- `500` - internal server error
- `503` - service unavailable

The same error section advises:
- check the HTTP status code
- parse `status.type`
- use `status.text` for diagnostics
- retry only transient failures such as `429`, `500`, and `503`

## Pagination
- The reviewed docs do not describe one global pagination model for the whole API.
- The routes reviewed in this pass mostly return one result object per request.
- Two route families do document explicit pagination-like controls:
  - face recognition query: `offset`, `count`, and `threshold`
  - visual search: `offset` and `count`

## Rate limits and usage notes
- The reviewed docs do not publish a numeric requests-per-minute table.
- The shared error section says `429` is returned when concurrency or rate limits are exceeded.
- The official Usage API provides account usage counters and optional history/concurrency data via `GET /v2/usage`.

## Important usage notes
- `/v2/uploads` returns an `upload_id` that can be reused across other billable endpoints via `image_upload_id`.
- Uploaded files remain available for `24` hours, then expire automatically.
- Ticket results remain available for up to `24` hours after job completion and are also deleted after a successful final query where `is_final=true`.
- `/v2/text` is explicitly marked as an experimental OCR endpoint in the reviewed docs.
- `/v3/tags` supports `light` and `pro` models; the docs say `model=pro` returns `403` on non-Pro plans.
- `/v2/remove-background` is documented as a paid-plan-only feature and returns binary image data.
- Visual-search and face-grouping workflows rely on ticket polling or callback URLs for async completion.

## Confirmed routes

### Recognition and enrichment

#### 1) Classic image tagging
- Method: `GET`
- Path: `/v2/tags`
- Full URL: `https://api.imagga.com/v2/tags`
- Key query parameters confirmed in the docs:
  - `image_url`
  - `image_upload_id`
  - `language`
  - `threshold`
  - `limit`
  - `verbose`
  - `decrease_parents`
  - `tagger_id`
- Notes:
  - returns flat tags with confidence scores
  - exactly one image input is required

#### 2) Classic image tagging with upload or base64
- Method: `POST`
- Path: `/v2/tags`
- Full URL: `https://api.imagga.com/v2/tags`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Same query-string options as the GET variant are documented for the tagging section.

#### 3) Structured image tagging
- Method: `GET`
- Path: `/v3/tags`
- Full URL: `https://api.imagga.com/v3/tags`
- Key query parameters confirmed in the docs:
  - `image_url`
  - `image_upload_id`
  - `model`
  - `include_caption`
- Notes:
  - returns grouped semantic tags instead of confidence-scored flat tags
  - docs say `model` defaults to `light`

#### 4) Structured image tagging with upload or base64
- Method: `POST`
- Path: `/v3/tags`
- Full URL: `https://api.imagga.com/v3/tags`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Confirmed query parameters:
  - `model`
  - `include_caption`

#### 5) List categorizers
- Method: `GET`
- Path: `/v2/categorizers`
- Full URL: `https://api.imagga.com/v2/categorizers`
- Notes:
  - returns public and account-specific categorizers and their labels

#### 6) Categorize image by URL or upload ID
- Method: `GET`
- Path: `/v2/categories/{categorizer_id}`
- Full URL: `https://api.imagga.com/v2/categories/{categorizer_id}`
- Confirmed path parameter:
  - `categorizer_id`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `language`
  - `save_index`
  - `save_id`

#### 7) Categorize uploaded or base64 image
- Method: `POST`
- Path: `/v2/categories/{categorizer_id}`
- Full URL: `https://api.imagga.com/v2/categories/{categorizer_id}`
- Confirmed path parameter:
  - `categorizer_id`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Confirmed query parameters:
  - `language`
  - `save_index`
  - `save_id`

#### 8) Face detection by URL or upload ID
- Method: `GET`
- Path: `/v2/faces/detections`
- Full URL: `https://api.imagga.com/v2/faces/detections`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `return_face_id`

#### 9) Face detection with upload or base64
- Method: `POST`
- Path: `/v2/faces/detections`
- Full URL: `https://api.imagga.com/v2/faces/detections`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Confirmed query parameter:
  - `return_face_id`

#### 10) Face similarity
- Method: `GET`
- Path: `/v2/faces/similarity`
- Full URL: `https://api.imagga.com/v2/faces/similarity`
- Confirmed query parameters:
  - `face_id`
  - `second_face_id`

#### 11) Face groupings
- Method: `POST`
- Path: `/v2/faces/groupings`
- Full URL: `https://api.imagga.com/v2/faces/groupings`
- Confirmed parameter:
  - `callback_url`
- Notes:
  - asynchronous route returning `ticket_id`

#### 12) Feed recognition index
- Method: `PUT`
- Path: `/v2/faces/recognition/{index_id}`
- Full URL: `https://api.imagga.com/v2/faces/recognition/{index_id}`
- Confirmed path parameter:
  - `index_id`
- Confirmed body field:
  - `people`

#### 13) Train recognition index
- Method: `POST`
- Path: `/v2/faces/recognition/{index_id}`
- Full URL: `https://api.imagga.com/v2/faces/recognition/{index_id}`
- Confirmed path parameter:
  - `index_id`
- Confirmed parameter:
  - `callback_url`
- Notes:
  - asynchronous route returning `ticket_id`

#### 14) Query recognition index or fetch metadata
- Method: `GET`
- Path: `/v2/faces/recognition/{index_id}`
- Full URL: `https://api.imagga.com/v2/faces/recognition/{index_id}`
- Confirmed path parameter:
  - `index_id`
- Confirmed query parameters:
  - `face_id`
  - `offset`
  - `count`
  - `threshold`

#### 15) Get recognition person details / existence
- Method: `GET`
- Path: `/v2/faces/recognition/{index_id}/{person_id}`
- Full URL: `https://api.imagga.com/v2/faces/recognition/{index_id}/{person_id}`
- Confirmed path parameters:
  - `index_id`
  - `person_id`

#### 16) Delete recognition index entry
- Method: `DELETE`
- Path: `/v2/faces/recognition/{index_id}/{person_id}/{face_id}`
- Full URL: `https://api.imagga.com/v2/faces/recognition/{index_id}/{person_id}/{face_id}`
- Confirmed path parameters:
  - `index_id`
  - `person_id`
  - `face_id`
- Official note:
  - docs say deletion behavior varies depending on which path parts are provided in the request path pattern used

#### 17) OCR by image URL
- Method: `GET`
- Path: `/v2/text`
- Full URL: `https://api.imagga.com/v2/text`
- Confirmed query parameter:
  - `image_url`

#### 18) OCR with upload or base64
- Method: `POST`
- Path: `/v2/text`
- Full URL: `https://api.imagga.com/v2/text`
- Confirmed body parameters:
  - `image`
  - `image_base64`

### Moderation

#### 19) Adult-content detection by URL or upload ID
- Method: `GET`
- Path: `/v2/categories/adult_content`
- Full URL: `https://api.imagga.com/v2/categories/adult_content`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `return_tags`

#### 20) Adult-content detection with upload or base64
- Method: `POST`
- Path: `/v2/categories/adult_content`
- Full URL: `https://api.imagga.com/v2/categories/adult_content`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Confirmed query parameter:
  - `return_tags`

#### 21) OCR-based text moderation by URL
- Method: `GET`
- Path: `/v2/categories/ocr_moderation`
- Full URL: `https://api.imagga.com/v2/categories/ocr_moderation`
- Confirmed query parameter:
  - `image_url`

#### 22) OCR-based text moderation with upload or base64
- Method: `POST`
- Path: `/v2/categories/ocr_moderation`
- Full URL: `https://api.imagga.com/v2/categories/ocr_moderation`
- Confirmed body parameters:
  - `image`
  - `image_base64`

### Search and image transformation

#### 23) Visual search by URL or upload ID
- Method: `GET`
- Path: `/v2/similar-images/categories/{categorizer_id}/{index_id}/{entry_id}`
- Full URL: `https://api.imagga.com/v2/similar-images/categories/{categorizer_id}/{index_id}/{entry_id}`
- Confirmed path parameters:
  - `categorizer_id`
  - `index_id`
  - `entry_id`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `offset`
  - `count`
  - `distance`
  - `region`
  - `merge_by_separator`
  - `merge_by_algorithm`

#### 24) Visual search with upload or base64
- Method: `POST`
- Path: `/v2/similar-images/categories/{categorizer_id}/{index_id}`
- Full URL: `https://api.imagga.com/v2/similar-images/categories/{categorizer_id}/{index_id}`
- Confirmed path parameters:
  - `categorizer_id`
  - `index_id`
- Confirmed body parameters:
  - `image`
  - `image_base64`

#### 25) Train visual-search index
- Method: `PUT`
- Path: `/v2/similar-images/categories/{categorizer_id}/{index_id}`
- Full URL: `https://api.imagga.com/v2/similar-images/categories/{categorizer_id}/{index_id}`
- Confirmed path parameters:
  - `categorizer_id`
  - `index_id`
- Confirmed parameter:
  - `callback_url`

#### 26) Delete visual-search index or entry
- Method: `DELETE`
- Path: `/v2/similar-images/categories/{categorizer_id}/{index_id}/{entry_id}`
- Full URL: `https://api.imagga.com/v2/similar-images/categories/{categorizer_id}/{index_id}/{entry_id}`
- Confirmed path parameters:
  - `categorizer_id`
  - `index_id`
  - `entry_id`

#### 27) Color extraction by URL or upload ID
- Method: `GET`
- Path: `/v2/colors`
- Full URL: `https://api.imagga.com/v2/colors`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `extract_overall_colors`
  - `extract_object_colors`
  - `overall_count`
  - `separated_count`
  - `deterministic`
  - `features_type`

#### 28) Color extraction with upload or base64
- Method: `POST`
- Path: `/v2/colors`
- Full URL: `https://api.imagga.com/v2/colors`
- Confirmed body parameters:
  - `image`
  - `image_base64`

#### 29) Smart cropping by URL or upload ID
- Method: `GET`
- Path: `/v2/croppings`
- Full URL: `https://api.imagga.com/v2/croppings`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `resolution`
  - `no_scaling`
  - `rect_percentage`
  - `image_result`

#### 30) Smart cropping with upload or base64
- Method: `POST`
- Path: `/v2/croppings`
- Full URL: `https://api.imagga.com/v2/croppings`
- Confirmed body parameters:
  - `image`
  - `image_base64`

#### 31) Structured cropping by URL or upload ID
- Method: `GET`
- Path: `/v3/croppings`
- Full URL: `https://api.imagga.com/v3/croppings`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `mode`
  - `query`
  - `model`
  - `resolution`
  - `context`
  - `no_scaling`

#### 32) Structured cropping with upload or base64
- Method: `POST`
- Path: `/v3/croppings`
- Full URL: `https://api.imagga.com/v3/croppings`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Confirmed query parameters:
  - `mode`
  - `query`
  - `model`
  - `resolution`
  - `context`
  - `no_scaling`

#### 33) Background removal by URL or upload ID
- Method: `GET`
- Path: `/v2/remove-background`
- Full URL: `https://api.imagga.com/v2/remove-background`
- Confirmed query parameters:
  - `image_url`
  - `image_upload_id`
  - `result_background`
- Important format note:
  - returns a binary image, not JSON

#### 34) Background removal with upload or base64
- Method: `POST`
- Path: `/v2/remove-background`
- Full URL: `https://api.imagga.com/v2/remove-background`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Important format note:
  - returns a binary image, not JSON

### Utilities

#### 35) Upload media
- Method: `POST`
- Path: `/v2/uploads`
- Full URL: `https://api.imagga.com/v2/uploads`
- Confirmed body parameters:
  - `image`
  - `image_base64`
- Notes:
  - returns `upload_id`
  - official docs say uploads remain available for 24 hours

#### 36) Delete uploaded media
- Method: `DELETE`
- Path: `/v2/uploads/{upload_id}`
- Full URL: `https://api.imagga.com/v2/uploads/{upload_id}`
- Confirmed path parameter:
  - `upload_id`

#### 37) Poll async ticket
- Method: `GET`
- Path: `/v2/tickets/{ticket_id}`
- Full URL: `https://api.imagga.com/v2/tickets/{ticket_id}`
- Confirmed path parameter:
  - `ticket_id`
- Notes:
  - ticket outputs remain available for up to 24 hours and are deleted after a successful final query

#### 38) Usage statistics
- Method: `GET`
- Path: `/v2/usage`
- Full URL: `https://api.imagga.com/v2/usage`
- Confirmed query parameters:
  - `history`
  - `concurrency`
- Notes:
  - returns billing-period usage, counters, and optional history/concurrency info

## Verification notes
- The current official docs page at `https://docs.imagga.com/` rendered in this environment and exposed the route sections used in this file.
- Route count and path inventory were manually verified from the official documentation sections for recognition, moderation, search, editing, and utility APIs.
- This file replaces the autogenerated placeholder with a manual route inventory grounded in the current official docs.