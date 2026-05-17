# PlaceBear

## Overview
- Provider: PlaceBear
- Category: Animals
- Official docs: `https://placebear.com/`
- Base URL: `https://placebear.com`
- Auth: none
- HTTPS: yes
- Response format: direct image responses
- Pagination: none
- Rate limits: no numeric rate limit documented on the official site

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/:width/:height` | required `width` and `height` path parameters | Returns a placeholder bear image sized to the requested dimensions. |
| GET | `/g/:width/:height` | required `width` and `height` path parameters | Returns a grayscale placeholder bear image. |

## Path and format notes
- The homepage explicitly documents example URLs `https://placebear.com/200/300` and `https://placebear.com/g/200/300`.
- The same page notes that you can append `.jpg` to the end of the URL if desired.
- The service is positioned as a design/development placeholder-image utility rather than a JSON API.

## Response behavior
- Responses are image payloads, not JSON objects.
- No response schema, metadata endpoint, or structured error schema is published on the official page.

## Error handling
- The official site does not publish formal error-body examples.
- Consumers should expect standard HTTP failures when dimensions are invalid or a resource variant cannot be generated.

## Integration notes for fireROUTE
- Model this provider as a raw image passthrough service.
- Keep grayscale handling as a distinct route family via the `/g` prefix.
- Treat optional `.jpg` suffix support as a format note rather than a separate canonical route family.

## Sources inspected
- `https://placebear.com/`
