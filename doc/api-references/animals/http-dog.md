# HTTP Dog

## Overview
- Provider: HTTP Status Dogs
- Category: Animals
- Official docs: `https://http.dog/`
- Base URL: `https://http.dog`
- Auth: none
- HTTPS: yes
- Response formats: direct image responses and JSON metadata
- Pagination: none
- Rate limits: no numeric rate limit documented on the official site

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/:code.jpg` | required three-digit `code` path parameter | Returns the JPEG image for the supplied HTTP status code. |
| GET | `/:code.webp` | required `code` path parameter | Returns the WebP image variant. |
| GET | `/:code.jxl` | required `code` path parameter | Returns the JPEG XL image variant. |
| GET | `/:code.avif` | required `code` path parameter | Returns the AVIF image variant. |
| GET | `/:code.json` | required `code` path parameter | Returns JSON metadata for the status code and links to image variants. |

## Request notes
- The homepage documents the primary usage pattern as `https://http.dog/[code].jpg`.
- The same page explicitly states that `.webp`, `.jxl`, `.avif`, and `.json` are supported alternatives.
- During manual review, the homepage exposed 95 individual status-code pages.

## JSON response notes
- Manual inspection of `https://http.dog/404.json` returned JSON shaped like:
  ```json
  {
    "status_code": 404,
    "title": "Not Found",
    "url": "https://http.dog/404",
    "image": {
      "jpg": "https://http.dog/404.jpg",
      "webp": "https://http.dog/404.webp",
      "avif": "https://http.dog/404.avif",
      "jxl": "https://http.dog/404.jxl"
    }
  }
  ```
- This makes the `.json` route useful as a lightweight metadata lookup layer over the image assets.

## Error handling
- The official site does not publish a dedicated error schema.
- Consumers should expect standard HTTP failures for unsupported or missing status-code assets.

## Integration notes for fireROUTE
- Expose the image variants as raw/binary passthrough routes.
- Expose the `.json` route separately because it returns structured metadata instead of an image payload.
- Keep the status code as a required path parameter and do not treat the homepage itself as an API response endpoint.

## Sources inspected
- `https://http.dog/`
- `https://http.dog/404.json`
