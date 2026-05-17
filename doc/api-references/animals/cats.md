# TheCatAPI

## Overview
- Provider: TheCatAPI
- Category: Animals
- Official docs: `https://docs.thecatapi.com/`
- Canonical base URL: `https://api.thecatapi.com/v1`
- Auth: API key supported via `x-api-key` header or `api_key` query parameter; many read endpoints can be called without a key but keyless access is reduced
- HTTPS: yes
- Response format: JSON
- Pagination: supported on list endpoints via `page` and `limit`; image search responses also include pagination headers in the OpenAPI docs
- Rate limits: no single global numeric limit is published in the docs pages reviewed; docs do note reduced unauthenticated access and lower keyless image-search limits

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/images/search` | query: `size`, `mime_types`, `format`, `has_breeds`, `order`, `page`, `limit`; basic docs also show `breed_ids`, `category_ids`, `sub_id` | Search or return random approved images. |
| GET | `/images/{image_id}` | `image_id` path | Fetch a single image by id. |
| GET | `/images/{image_id}/analysis` | `image_id` path | Returns raw analysis results for an uploaded image. |
| GET | `/images` | query: `limit`, `page`, `order`, `original_filename`, `sub_id` | Returns images uploaded to your account. |
| POST | `/images/upload` | multipart body; requires API key | Upload a new image. |
| GET | `/images/{image_id}/breeds` | `image_id` path | Returns breed tags attached to an image. |
| POST | `/images/{image_id}/breeds` | `image_id` path; JSON body; requires API key | Adds a breed tag to one of your images. |
| DELETE | `/images/{image_id}/breeds/{breed_id}` | `image_id`, `breed_id` path; requires API key | Removes a breed tag from your image. |
| GET | `/breeds` | query: `limit`, `page`; optional API key | Lists cat breeds. |
| GET | `/breeds/{breed_id}` | `breed_id` path | Returns one breed record. |
| GET | `/favourites` | query: `attach_image`, `image_id`, `sub_id`, `page`, `limit`, `order`; requires API key in practical use | Lists favourites. |
| POST | `/favourites` | JSON body: `image_id`, optional `sub_id`; requires API key | Creates a favourite. |
| GET | `/favourites/{favourite_id}` | `favourite_id` path | Returns one favourite. |
| DELETE | `/favourites/{favourite_id}` | `favourite_id` path; requires API key | Deletes a favourite. |
| GET | `/votes` | query: `attach_image`, `sub_id`, `page`, `limit`, `order`; requires API key in practical use | Lists votes. |
| POST | `/votes` | JSON body: `image_id`, optional `sub_id`, `value`; requires API key | Creates an upvote or downvote. |
| GET | `/votes/{vote_id}` | `vote_id` path | Returns one vote. |
| DELETE | `/votes/{vote_id}` | `vote_id` path; requires API key | Deletes a vote. |

## Authentication and access notes
- The quick-start pages explicitly show two auth forms:
  - `x-api-key: YOUR-KEY`
  - `?api_key=YOUR_KEY`
- Docs recommend using the header form for full access.
- Without an API key, image search is more limited; the quick-start page explicitly says more than 10 images and additional fields require authenticated access.

## Query and body details
- `GET /images/search` supports both the OpenAPI parameters and the quick-start tutorial parameters. The combined set confirmed in the official docs reviewed is:
  - `size`
  - `mime_types`
  - `format`
  - `has_breeds`
  - `order`
  - `page`
  - `limit`
  - `breed_ids`
  - `category_ids`
  - `sub_id`
- `POST /favourites` body:
  ```json
  {
    "image_id": "id-of-image",
    "sub_id": "optional-user-id"
  }
  ```
- `POST /votes` body:
  ```json
  {
    "image_id": "id-of-image",
    "sub_id": "optional-user-id",
    "value": 1
  }
  ```
  The tutorial also shows `value: -1` for a downvote.

## Response and pagination notes
- `GET /images/search` returns an array of image objects with fields such as `id`, `url`, `width`, `height`, `breeds`, and favourite/vote-related fields when available.
- The OpenAPI docs state that image search responses include pagination headers such as `Pagination-Count`, `Pagination-Page`, and `Pagination-Limit`.
- Tutorial examples show favourites and votes using `created_at` ordering and pagination with `page` and `limit`.
- Breed, favourite, and vote resources all use JSON response bodies.

## Error handling
- The reviewed docs are split between tutorial pages and an OpenAPI reference.
- The OpenAPI reference exposes standard HTTP status sections per operation; the tutorial pages focus on request and response examples rather than a single global error schema.
- Consumers should expect API-key failures and validation errors on write operations.

## Integration notes for fireROUTE
- Separate TheCatAPI into four capability groups: images, breeds, favourites, and votes.
- Prefer header-based auth when implementing write operations.
- Preserve list pagination metadata from headers where available.
- Keep keyless and keyed behavior distinct because the docs explicitly note different access levels.

## Sources inspected
- `https://docs.thecatapi.com/`
- `https://developers.thecatapi.com/view-account/ylX4blBYT9FaoVd6OhvR?report=bOoHBz-8t`
- The built-in OpenAPI reference page linked from the docs portal (`OpenAPI Spec Doc`)
- The official OpenAPI document linked from the reference: `https://raw.githubusercontent.com/thatapicompany/apis/main/theCatAPI.com/thecatapi-oas.yaml`
