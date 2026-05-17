# Cloudmersive

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `cloudmersive`
- Docs used manually:
  - `https://www.cloudmersive.com/image-recognition-and-processing-api`
  - `https://api.cloudmersive.com/openapi.asp`
  - `https://api.cloudmersive.com/docs/image.asp` (linked from the official product page during this review)
  - `https://api-console.cloudmersive.com/swagger/index.html?urls.primaryName=Image%20Recognition%20and%20Processing%20API` (linked from the official product page during this review)
  - route-level official iframe URLs exposed by the reviewed page:
    - `https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/image/face/locate-with-landmarks`
    - `https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/image/face/detect-gender`
    - `https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/image/nsfw/classify`
    - `https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/image/recognize/detect-objects`
- Confirmed API base URL: `https://api.cloudmersive.com`
- Primary media types confirmed in this pass: multipart image upload requests and JSON responses
- Authentication model confirmed in this pass: API key auth using Cloudmersive's `Apikey` auth scheme
- Manually confirmed routes in this pass: `4`

## Authentication
From the reviewed official product page, OpenAPI page, and sampled route-level SDK example:
- Cloudmersive requires API key authentication for the image-recognition product family
- the sampled route-level SDK example configures auth as `Apikey`
- reviewed SDK snippets use this pattern:
  - `defaultClient.authentications['Apikey']`
  - `Apikey.apiKey = 'YOUR API KEY'`
- the reviewed materials did not surface a bearer-token alternative for this API family

## Common request/response conventions
- Base URL: `https://api.cloudmersive.com`
- The official OpenAPI page lists stable Swagger/OpenAPI entry points under `https://api.cloudmersive.com/swagger/api/...`
- The image product page is built around uploading an image for processing and receiving JSON results
- The sampled route-level SDK example directly confirms file-upload input named `imageFile` and notes common formats such as PNG and JPEG are supported
- The reviewed product page and SDK samples indicate JSON result objects rather than paginated collections

## Manually confirmed endpoint set

### 1) Detect faces and facial landmarks
- Method: `POST`
- Path: `/image/face/locate-with-landmarks`
- Full URL: `https://api.cloudmersive.com/image/face/locate-with-landmarks`
- Purpose: detect faces in an image and return facial landmarks such as eyes, nose, mouth, chin, and related face details
- Confirmed request input from the sampled official SDK example:
  - `imageFile` - required file upload; common formats such as PNG and JPEG are supported
- Auth: Cloudmersive `Apikey`
- Response notes:
  - the sampled SDK example returns a structured JSON response object named `FaceLocateWithLandmarksResponse`

### 2) Detect gender from an image
- Method: `POST`
- Path: `/image/face/detect-gender`
- Full URL: `https://api.cloudmersive.com/image/face/detect-gender`
- Purpose: classify the gender of people detected in an uploaded image
- Confirmed request pattern from the official product page and route URL:
  - image-upload workflow for a submitted picture
- Auth: Cloudmersive `Apikey`
- Response notes:
  - official product copy describes age/gender classification over uploaded images with machine-learning output returned programmatically

### 3) Classify NSFW / racy content
- Method: `POST`
- Path: `/image/nsfw/classify`
- Full URL: `https://api.cloudmersive.com/image/nsfw/classify`
- Purpose: classify an uploaded image into safe vs. not-safe-for-work / racy categories
- Confirmed request pattern from the official product page and route URL:
  - image-upload workflow for the input image
- Auth: Cloudmersive `Apikey`
- Response notes:
  - the reviewed product page describes this as content-moderation classification over photos

### 4) Detect people and objects in an image
- Method: `POST`
- Path: `/image/recognize/detect-objects`
- Full URL: `https://api.cloudmersive.com/image/recognize/detect-objects`
- Purpose: identify objects and people and return their detected locations/types from an uploaded image
- Confirmed request pattern from the official product page and route URL:
  - image-upload workflow for the input image
- Auth: Cloudmersive `Apikey`
- Response notes:
  - official product copy describes automatic identification of object and people locations and types

## Pagination
- None of the reviewed image-recognition routes are documented as paginated.
- The reviewed materials describe single-request analysis operations against one uploaded image at a time.

## Rate limits
From the reviewed official product page:
- Cloudmersive publicly advertises `600 free API calls/month, with no expiration` for the self-serve offering shown on the image-recognition page
- the reviewed official pages did not publish a route-level requests-per-minute table for these specific image routes

## Error handling
- the sampled official SDK example handles failures through `ApiException` / exception reporting
- the reviewed product and route materials available in this pass did not expose a single consolidated HTTP error-code table for the sampled image routes
- because the official docs UI is heavily iframe-driven, the clearest directly confirmed error signal in this pass is SDK-level exception handling rather than a published per-route status list

## Response format notes
- request bodies are file uploads rather than plain JSON for sampled image-analysis operations
- responses are returned as JSON objects consumed by Cloudmersive SDKs
- the reviewed product copy consistently frames these routes as synchronous image-analysis calls rather than asynchronous job polling

## Important usage notes
- Cloudmersive also markets private-cloud, edge, and managed-instance deployments alongside the public cloud API
- the official OpenAPI page indicates Cloudmersive maintains stable Swagger URLs for the image API family
- the route-level examples exposed on the official page are iframe-backed; in this review, the route URLs and one sampled SDK page provided the most reliable confirmation data
- the product page makes clear that the broader image API family includes more capabilities than the four routes captured here; this file records only the routes manually confirmed in this pass

## Verification notes
This file was manually rebuilt from Cloudmersive's official image-recognition product page, official OpenAPI/Swagger landing page, official docs links exposed from that page, and the route-level iframe URLs surfaced by the official site.