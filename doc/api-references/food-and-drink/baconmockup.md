# BaconMockup

Official page manually reviewed:
- https://baconmockup.com/

## Overview
- Public asset base URL: `https://baconmockup.com`
- Authentication: none
- Purpose: placeholder bacon images
- Response format: image bytes

Manual route count confirmed from the reviewed homepage: **1**.

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| GET | `/{width}/{height}` | Return a placeholder image sized to the requested dimensions |

## Parameters
- `width` and `height` are numeric dimensions embedded in the path
- The homepage example is `https://baconmockup.com/300/200`

## Response notes
- The endpoint returns an image directly rather than JSON
- The homepage positions the service as a simple drop-in placeholder-image source for designs and mockups

## Rate limits
No rate limit is published on the reviewed homepage.

## Pagination
Not applicable.

## Errors
No formal error schema is documented on the reviewed homepage.

## fireROUTE notes
- This is an image placeholder service, not a structured JSON API.
- Treat it as a simple passthrough image route with two required path dimensions.
