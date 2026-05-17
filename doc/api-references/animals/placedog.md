# PlaceDog

## Overview
- Provider: place.dog
- Category: Animals
- Official docs: `https://place.dog/`
- Base URL: `https://place.dog`
- Auth: none
- HTTPS: yes
- Response format: direct image responses
- Pagination: none
- Rate limits: no numeric rate limit documented on the official site

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/:width/:height` | required `width` and `height` path parameters | Returns a placeholder dog image sized to the requested dimensions. |

## Request notes
- The official homepage documents the service as “Just add a width and height to the end of the url.”
- The published example URL is `https://place.dog/300/200`.
- The page also shows a curl example saving the returned image payload to `doggo.jpeg`.

## Response behavior
- Responses are image payloads, not JSON objects.
- The official page does not document alternate formats, metadata routes, pagination, or a structured error schema.

## Error handling
- No formal error documentation is published.
- Consumers should expect standard HTTP failures when dimensions are malformed or the requested asset cannot be served.

## Integration notes for fireROUTE
- Treat this provider as a single raw-image placeholder route with two required path dimensions.
- Do not assume JSON support or additional query parameters unless they appear in future official docs.

## Sources inspected
- `https://place.dog/`
