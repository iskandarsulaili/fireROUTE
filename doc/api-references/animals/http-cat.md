# HTTP Cat

## Overview
- Provider: HTTP Cats
- Category: Animals
- Official docs: `https://http.cat/`
- Base URL: `https://http.cat`
- Auth: none
- HTTPS: yes
- Response format: direct image responses
- Pagination: none
- Rate limits: no numeric rate limit documented on the official site

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/:status_code` | required `status_code` path parameter | Returns the image for the supplied HTTP status code using the provider's default response behavior. |
| GET | `/:status_code.jpg` | required `status_code` path parameter | Explicit JPEG form documented on the homepage. |

## Request notes
- The homepage publishes the canonical usage pattern `https://http.cat/[status_code]`.
- The same page notes that if you need an extension, you can append `.jpg`.
- During manual review, the homepage listed 95 individual status-code images linking to status-specific pages.

## Response behavior
- This provider serves images rather than JSON payloads.
- The official page does not publish a metadata endpoint, pagination model, or structured response schema.

## Error handling
- No formal error-body schema is documented.
- Consumers should expect ordinary HTTP failures if a status-code asset is unsupported or unavailable.

## Integration notes for fireROUTE
- Treat HTTP Cat as an image-asset provider keyed by HTTP status code.
- Prefer the extensionless form as the canonical route and keep `.jpg` as an explicit format variant.
- Preserve path-parameter routing rather than trying to normalize responses into JSON.

## Sources inspected
- `https://http.cat/`
