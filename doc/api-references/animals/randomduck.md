# RandomDuck

## Overview
- Provider: random-d.uk API
- Category: Animals
- Official docs: `https://random-d.uk/api`
- Current base URLs: `https://random-d.uk/api` and `https://random-d.uk/api/v2`
- Legacy base URL: `https://random-d.uk/api/v1`
- Auth: none
- HTTPS: yes
- Response formats: JSON and raw image responses
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official page
- Versioning note: the docs strongly recommend specifying an API version because omitting one uses the newest version

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/random` | optional `Type` query with `GIF` or `JPG` | Returns JSON with a random duck image URL and optional attribution message. |
| GET | `/quack` | optional `Type` query with `GIF` or `JPG` | Same behavior as `/random`. |
| GET | `/randomimg` | optional `Type` query with `GIF` or `JPG` | Returns the image file directly (`image/jpeg` or `image/gif`). |
| GET | `/list` | none | Returns JSON listing available image and GIF filenames plus counts. |
| GET | `/:num.jpg` | `num` path | Returns a specific JPEG file. |
| GET | `/:num.gif` | `num` path | Returns a specific GIF file. |
| GET | `/http/:code` | `code` path HTTP status code | Returns an HTTP duck image for the supplied status code. |
| POST | `/add` | multipart form upload | Upload endpoint documented separately from the read API. |
| GET | `/v1/random` | none | Legacy V1 random-duck JSON endpoint. |
| GET | `/v1/quack` | none | Legacy V1 alias of `/v1/random`. |
| GET | `/v1/randomimg` | none | Legacy V1 image redirect endpoint. |
| GET | `/v1/randomgif` | none | Legacy V1 GIF redirect endpoint. |

## Request and response notes
- The docs show a V2 `/random` response body shaped like:
  ```json
  {"url":"https://random-d.uk/api/images/51.jpg","message":"Powered by random-d.uk"}
  ```
- `/randomimg`, `/:num.jpg`, `/:num.gif`, and `/http/:code` return image payloads rather than JSON.
- `/list` returns a JSON object containing image filename arrays, GIF filename arrays, HTTP duck assets, and item counts.
- The docs page itself can be serialized with `?format=json` for a machine-parsable documentation response.

## Upload endpoint notes
- The official page documents uploads at `POST https://random-d.uk/add`.
- Encoding is documented as `multipart/form-data`.
- The upload flow is distinct from the public read endpoints and is not described as anonymous bulk ingestion.

## Error handling
- The official page publishes response-content examples but no formal error schema.
- Consumers should expect normal HTTP failures for invalid asset IDs, invalid HTTP codes, or unsupported upload requests.

## Integration notes for fireROUTE
- Treat V2 as the canonical surface and keep V1 marked as legacy compatibility only.
- Preserve direct-image endpoints as raw/binary passthrough routes instead of forcing JSON normalization.
- If fireROUTE exposes the upload route, keep it clearly separated from read-only image retrieval behavior.

## Sources inspected
- `https://random-d.uk/api`
