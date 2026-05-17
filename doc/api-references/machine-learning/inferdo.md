# Inferdo

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `inferdo`
- Docs used manually:
  - `https://rapidapi.com/user/inferdo`
  - `https://rapidapi.com/inferdo/api/face-detection6`
  - `https://rapidapi.com/inferdo/api/face-detection6/playground/apiendpoint_3db9b578-b576-4895-b67d-ba443cc62928`
  - `https://rapidapi.com/inferdo/api/face-detection6/playground/apiendpoint_430e347f-7eca-4190-9e1b-e6e6114879e0`
  - `https://rapidapi.com/inferdo/api/image-labeling1`
  - `https://rapidapi.com/inferdo/api/image-labeling1/playground/apiendpoint_da71147c-d087-48b3-8138-0a982eeda314`
  - `https://rapidapi.com/inferdo/api/nsfw-image-classification1`
  - `https://rapidapi.com/inferdo/api/nsfw-image-classification1/playground/apiendpoint_149fed5a-d653-49b8-b415-26472a0bbb42`
- Confirmed API base URLs:
  - `https://face-detection6.p.rapidapi.com`
  - `https://image-labeling1.p.rapidapi.com`
  - `https://nsfw-image-classification1.p.rapidapi.com`
- Primary media type confirmed from the official docs: JSON
- Authentication model confirmed from the official docs: RapidAPI-hosted header auth; the reviewed playground snippets explicitly show `x-rapidapi-host` plus `Content-Type: application/json`, and the RapidAPI playground exposes an `Authorizations` section for the subscription key flow
- Manually confirmed routes in this pass: `4`

## Authentication
From the official RapidAPI publisher and playground pages:
- access is sold through RapidAPI subscription tiers (`BASIC`, `PRO`, `ULTRA`, `MEGA`)
- reviewed request samples use RapidAPI proxy hosts rather than an Inferdo-owned hostname
- reviewed cURL snippets explicitly require:
  - `Content-Type: application/json`
  - `x-rapidapi-host: <api-host>`
- the anonymous playground views do not print a literal `x-rapidapi-key` value, but the official RapidAPI request flow exposes `Authorizations` and is RapidAPI-key based rather than anonymous/public

## Common request/response conventions
- All confirmed routes are `POST` JSON endpoints on RapidAPI proxy hosts.
- All confirmed examples send an image by URL inside the JSON request body.
- No multipart upload route was exposed in the reviewed docs; the examples consistently use remote image URLs.
- Responses are JSON.
- The reviewed APIs are all on `v1 (current)` per the official RapidAPI pages.

## Manually confirmed endpoint set

### 1) Face Detection w/ Age & Gender
- Method: `POST`
- Path: `/img/face-age-gender`
- Full URL: `https://face-detection6.p.rapidapi.com/img/face-age-gender`
- Purpose: detect faces and return bounding boxes together with predicted binary gender and an age range for each face
- Confirmed request body fields:
  - `url` - required image URL used by the example request
  - `accuracy_boost` - optional accuracy/speed tradeoff control; the official overview says valid values are `1` through `4`
- Confirmed response fields from the official example:
  - `detected_faces[]`
  - `detected_faces[].BoundingBox.startX`
  - `detected_faces[].BoundingBox.startY`
  - `detected_faces[].BoundingBox.endX`
  - `detected_faces[].BoundingBox.endY`
  - `detected_faces[].BoundingBox.Probability`
  - `detected_faces[].Gender.Gender`
  - `detected_faces[].Gender.Probability`
  - `detected_faces[].Age.Age-Range.Low`
  - `detected_faces[].Age.Age-Range.High`
- Important notes from the official docs:
  - the route is presented as the richer alternative to plain face detection
  - the same `accuracy_boost` tradeoff applies here too

### 2) Face Detection
- Method: `POST`
- Path: `/img/face`
- Full URL: `https://face-detection6.p.rapidapi.com/img/face`
- Purpose: detect face locations in an image and return bounding boxes with probabilities
- Confirmed request body fields:
  - `url` - required image URL used by the example request
  - `accuracy_boost` - optional; the official overview documents values `1` to `4`, where `1` is fastest/least accurate and `4` is slowest/most accurate
- Confirmed response fields from the official example:
  - `Detected_faces[]`
  - `Detected_faces[].BoundingBox.startX`
  - `Detected_faces[].BoundingBox.startY`
  - `Detected_faces[].BoundingBox.endX`
  - `Detected_faces[].BoundingBox.endY`
  - `Detected_faces[].Probability`
- Important notes from the official docs:
  - the docs describe this as basic face localization
  - the overview explicitly recommends `accuracy_boost=2` for most use cases

### 3) Image Labeling
- Method: `POST`
- Path: `/img/label`
- Full URL: `https://image-labeling1.p.rapidapi.com/img/label`
- Purpose: assign semantic labels to an image
- Confirmed request body fields:
  - `url` - required image URL used by the example request
- Confirmed response format from the official example:
  - JSON object mapping labels such as `Pet`, `Grass`, `Dog`, `Animal`, `Mammal`, `Green`, `Lawn`, `Meadow`, `Dog breed`, and `Puppy` to floating-point confidence values
- Important notes from the official docs:
  - the overview says the model is trained across thousands of labels in many categories
  - the reviewed docs only exposed the single `POST /img/label` route for this API

### 4) NSFW Image Classification
- Method: `POST`
- Path: `/img/nsfw`
- Full URL: `https://nsfw-image-classification1.p.rapidapi.com/img/nsfw`
- Purpose: flag possible inappropriate, nude, adult, or otherwise NSFW content in images
- Confirmed request body fields:
  - `url` - required image URL used by the example request
- Confirmed response fields from the official example:
  - `NSFW_Prob`
- Important notes from the official docs:
  - the overview says the model covers both real and drawn images
  - the reviewed docs only exposed the single `POST /img/nsfw` route for this API

## Pagination
- None of the reviewed Inferdo routes document cursor, page-number, or token pagination.
- All confirmed routes are single-request inference endpoints that return one JSON result object per call.

## Rate limits
- The reviewed RapidAPI pages publish commercial plan tiers (`BASIC`, `PRO`, `ULTRA`, `MEGA`) plus observed marketplace metadata such as popularity, service level, and latency.
- The reviewed official pages do not publish explicit numeric request-per-minute or quota tables.
- Because no numeric quota table was exposed, a provider-specific rate-limit value could not be confirmed beyond the requirement to consume the APIs through RapidAPI plans.

## Error handling
- The reviewed official pages expose `Example Responses` / `Results` areas in the playground, but they do not publish a formal error-schema reference.
- No provider-specific error body structure, status-code table, or retry contract could be confirmed from the reviewed pages.
- Consumers should therefore expect RapidAPI/platform-level failures and upstream inference-validation failures, but the exact documented error envelope was not exposed in the official pages reviewed here.

## Important usage notes
- The publisher page currently lists three Inferdo APIs under the same publisher account:
  - `Face Detection`
  - `Image Labeling`
  - `NSFW Image Classification`
- Inferdo's public examples consistently tell users to supply an image URL rather than upload raw bytes.
- Only the face-detection API documents the optional `accuracy_boost` control in the reviewed pages.
- The confirmed route surface is split across three RapidAPI proxy hosts rather than one shared provider hostname.

## Verification notes
This file was manually rebuilt from Inferdo's official RapidAPI publisher page plus the official RapidAPI overview/playground pages for Face Detection, Image Labeling, and NSFW Image Classification.