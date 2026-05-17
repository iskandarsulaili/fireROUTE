# Thirukkural

Official page manually reviewed:
- https://api-thirukkural.web.app/

## Overview
- Public API base URL shown on the official page: `https://api-thirukkural.vercel.app`
- Authentication: none mentioned on the reviewed page
- Response format: JSON is implied by the API-example URL and the page's API demonstration
- Purpose: retrieve Thirukkural entries by number

Manual route count confirmed from the reviewed official page: **1**.

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/api` | Retrieve a Kural using the `num` query parameter |

## Confirmed parameters
- `num`: Kural number, shown in the official example URL as `?num=x`

## Auth, rate limits, and pagination
- No authentication requirement is mentioned on the reviewed page.
- No numeric rate limit is published on the reviewed page.
- No pagination is documented; the public example is a single-item lookup.

## Important usage notes
- The official page directly advertises the example request `https://api-thirukkural.vercel.app/api?num=x`.
- The site presents the API as a very small single-route service rather than a broader resource tree.

## fireROUTE notes
- Model this provider as a simple lookup endpoint.
- Preserve `num` as a passthrough query parameter.
