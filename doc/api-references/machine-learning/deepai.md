# DeepAI

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `deepai`
- Docs used manually:
  - `https://deepai.org/`
  - `https://deepai.org/docs`
- Confirmed API base URL: `https://api.deepai.org/api`
- Authentication model: API key sent in the `api-key` request header
- Primary response format: JSON
- Manually confirmed routes in this pass: `9`

## Authentication
- Every reviewed DeepAI API example sends the API key in an `api-key` header.
- The docs show this header for both JSON-body requests and multipart form uploads.
- No OAuth or bearer-token flow was documented on the reviewed pages.

## Pricing and rate-limit notes
- The reviewed docs page does not publish a numeric requests-per-second rate-limit table.
- The docs do say: `API calls are included within your DeepAI Pro membership. Any generations are used either from your allowance or deducted from your prepaid wallet balance.`
- The reviewed docs therefore expose billing/allowance behavior, but not a fixed public throttle number.

## Request/response format notes
- The reviewed examples consistently use `POST` for all confirmed routes.
- Text-only routes can be sent as JSON or form fields.
- Image routes accept either:
  - an image URL in a form field, or
  - a local uploaded file via multipart form data
- The official JavaScript and Python examples parse the response as JSON (`resp.json()` / `r.json()`), confirming structured JSON responses.

## Error handling
- The reviewed DeepAI docs page does not publish a dedicated HTTP error-code table for these APIs.
- Language examples generally print the raw response body / parsed JSON directly, implying error details also come back through the normal HTTP response.

## Pagination
- None of the reviewed DeepAI API routes are paginated.
- Each call submits one job/input payload and returns a single JSON response payload.

## Confirmed routes

### 1) AI Image Generator
- Method: `POST`
- Path: `/text2img`
- Full URL: `https://api.deepai.org/api/text2img`
- Confirmed parameter from official examples:
  - `text` - prompt text
- Notes:
  - examples are shown in cURL, JavaScript, Python, Ruby, PHP, Go, Java, C#, Swift, Kotlin, and more

### 2) Background Remover
- Method: `POST`
- Path: `/background-remover`
- Full URL: `https://api.deepai.org/api/background-remover`
- Confirmed parameter from official examples:
  - `image` - image URL or uploaded file

### 3) AI Photo Editor
- Method: `POST`
- Path: `/image-editor`
- Full URL: `https://api.deepai.org/api/image-editor`
- Confirmed parameters from official examples:
  - `image` - source image URL or uploaded file
  - `text` - editing instruction prompt

### 4) Image Colorizer
- Method: `POST`
- Path: `/colorizer`
- Full URL: `https://api.deepai.org/api/colorizer`
- Confirmed parameter:
  - `image`

### 5) Super Resolution
- Method: `POST`
- Path: `/torch-srgan`
- Full URL: `https://api.deepai.org/api/torch-srgan`
- Confirmed parameter:
  - `image`
- Notes:
  - the docs describe this route as clarifying, sharpening, and upscaling images

### 6) Waifu2x
- Method: `POST`
- Path: `/waifu2x`
- Full URL: `https://api.deepai.org/api/waifu2x`
- Confirmed parameter:
  - `image`
- Notes:
  - DeepAI says it was trained largely on anime-style art but still works on photographs and other imagery

### 7) Creative Upscale
- Method: `POST`
- Path: `/creative-upscale`
- Full URL: `https://api.deepai.org/api/creative-upscale`
- Confirmed parameter:
  - `image`

### 8) Image Replace
- Method: `POST`
- Path: `/image-replace`
- Full URL: `https://api.deepai.org/api/image-replace`
- Confirmed parameters from official examples:
  - `text` - replacement/editing instruction
  - `mask` - mask image URL or uploaded file
  - `image` - source image URL or uploaded file

### 9) Expand Image
- Method: `POST`
- Path: `/zoom-out`
- Full URL: `https://api.deepai.org/api/zoom-out`
- Confirmed parameter:
  - `image`
- Notes:
  - the docs label this feature `Expand Image` and describe it as an AI image extender / uncrop tool

## Important usage notes
- DeepAI's docs present these APIs as direct HTTP endpoints rather than long-running asynchronous job polling flows.
- The reviewed examples show clients can send either JSON or multipart form data depending on the route and input type.
- Image routes are flexible about source format: URL-based input and uploaded-file input are both shown in official examples.
- The docs page currently focuses on image-generation/editing APIs rather than exposing a broad general OpenAPI reference.

## Verification notes
This file was manually rebuilt from DeepAI's official homepage and official docs page, using the route-specific cURL and language examples embedded in the docs.