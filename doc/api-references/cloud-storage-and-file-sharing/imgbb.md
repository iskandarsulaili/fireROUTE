# Imgbb

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `imgbb`
- Official pages reviewed manually:
  - `https://imgbb.com/`
  - `https://api.imgbb.com/`
- Confirmed API base URL: `https://api.imgbb.com`
- Manually confirmed route count: `1`

## API surface confirmed from official docs
ImgBB’s current first-party API page documents a single upload route family:

| Methods | Path | Purpose |
|---|---|---|
| `POST`, `GET` | `/1/upload` | Upload one image and return the uploaded-image metadata in JSON |

## Authentication
- Authentication uses required parameter `key`.
- The docs describe `key` as the API key.
- The reviewed example places the API key in the query string.

## Request parameters
### `/1/upload`
Required:
- `key` — API key
- `image` — image payload as a binary file, base64 data, or an image URL

Optional:
- `name` — file name
- `expiration` — auto-delete time in seconds, documented range `60` to `15552000`

Official request notes:
- the docs say calls can use `POST` or `GET`
- the docs explicitly recommend `POST` because `GET` is constrained by URL-length limits
- local-file uploads should always use `POST`
- the documented maximum image size is `32 MB`

## Response format
- The docs say API v1 responses return uploaded-image information in JSON format.
- The page states response headers include HTTP status codes.
- The page also says the JSON body includes a `status` property.

## Rate limits
- No numeric public rate-limit table is published on the reviewed official API page.

## Pagination
- None documented
- Not applicable for the single upload route family reviewed here

## Errors
- The reviewed official page says response headers include status codes for success/failure detection.
- The page does not publish a fuller error-code matrix in the reviewed visible documentation.

## Important usage notes
- The official root site still markets `API Access` and links directly to the current first-party API page.
- I counted the upload surface as one documented route family even though the page says it can be called with either `POST` or `GET`.
- The official example call uses:
  - `POST https://api.imgbb.com/1/upload?expiration=600&key=YOUR_CLIENT_API_KEY`
  - multipart form field `image=...`

## Verification note
This file was manually rebuilt from the current official ImgBB homepage and the live first-party API page using browser-based review only.
