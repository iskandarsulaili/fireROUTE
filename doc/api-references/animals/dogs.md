# Dogs

## Overview
- Provider: Dog CEO Dog API
- Category: Animals
- Official docs: `https://dog.ceo/dog-api/`
- Base URL: `https://dog.ceo/api`
- Auth: none
- HTTPS: yes
- Response format: JSON with `message` and `status` fields for API endpoints
- Pagination: none documented
- Rate limits: no numeric limit documented on the official site
- Notes: image payloads are returned either as a single URL string or an array of URL strings depending on the endpoint

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/breeds/list/all` | none | Returns all breeds and sub-breeds as an object map. |
| GET | `/breeds/image/random` | none | Returns one random dog image from the full collection. |
| GET | `/breeds/image/random/{count}` | `count` path integer | Returns multiple random images from the full collection. |
| GET | `/breed/{breed}/images` | `breed` path | Returns all image URLs for a breed. |
| GET | `/breed/{breed}/images/random` | `breed` path | Returns one random image for a breed. |
| GET | `/breed/{breed}/images/random/{count}` | `breed`, `count` path | Returns multiple random images for a breed. |
| GET | `/breed/{breed}/list` | `breed` path | Returns sub-breeds for a breed. |
| GET | `/breed/{breed}/{sub_breed}/images` | `breed`, `sub_breed` path | Returns all images for a sub-breed. |
| GET | `/breed/{breed}/{sub_breed}/images/random` | `breed`, `sub_breed` path | Returns one random image for a sub-breed. |
| GET | `/breed/{breed}/{sub_breed}/images/random/{count}` | `breed`, `sub_breed`, `count` path | Returns multiple random images for a sub-breed. |

## Request and response notes
- Example success payload for image endpoints:
  ```json
  {
    "message": "https://images.dog.ceo/breeds/spaniel-welsh/n02102177_2148.jpg",
    "status": "success"
  }
  ```
- Endpoints that return multiple matches place an array of image URLs in `message`.
- `/breeds/list/all` returns an object keyed by breed name, with each value being an array of sub-breeds.
- The docs site also links a separate breed browser page for discovering valid breed and sub-breed names.

## Error handling
- The public docs emphasize success examples but do not publish a formal error schema.
- Consumers should expect standard HTTP failures plus non-`success` values in the JSON `status` field when a request cannot be fulfilled.

## Integration notes for fireROUTE
- Treat this provider as a simple unauthenticated image source.
- Canonical route families are: breed index, random images, breed image listings, and sub-breed image listings.
- Validate breed and sub-breed names before issuing requests because path segments are the only request inputs.

## Sources inspected
- `https://dog.ceo/dog-api/`
- `https://dog.ceo/dog-api/documentation`
- `https://dog.ceo/dog-api/documentation/random`
- `https://dog.ceo/dog-api/documentation/breed`
- `https://dog.ceo/dog-api/documentation/sub-breed`
