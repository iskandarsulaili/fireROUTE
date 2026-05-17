# Coffee

Official page manually reviewed:
- https://coffee.alexflipnote.dev/

## Overview
- Public API base URL: `https://coffee.alexflipnote.dev`
- Authentication: none mentioned
- Purpose: random coffee images

Manual route count confirmed from the reviewed homepage: **2**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/random` | Return a random coffee image |
| GET | `/random.json` | Return JSON metadata for a random coffee image |

## Response notes
- `/random` serves an image directly
- `/random.json` is explicitly labeled as the JSON variant on the homepage

## Rate limits
No numeric rate limit is published on the reviewed homepage.

## Pagination
Not applicable.

## Errors
No formal error schema is documented on the reviewed homepage.

## fireROUTE notes
- This provider has a tiny surface area and is primarily useful as a random-image source.
- Prefer `/random.json` when fireROUTE needs a structured response rather than a raw image.
