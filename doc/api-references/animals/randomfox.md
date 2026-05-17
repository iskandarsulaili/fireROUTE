# RandomFox

## Overview
- Provider: RandomFox
- Category: Animals
- Official site/docs: `https://randomfox.ca/`
- Base URL: `https://randomfox.ca`
- Primary API endpoint: `https://randomfox.ca/floof/`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none
- Rate limits: none documented

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/floof/` | none | Returns one random fox image URL and a share link. |

## Response format
- The official endpoint returns a JSON object shaped like:
  ```json
  {
    "image": "https://randomfox.ca/images/29.jpg",
    "link": "https://randomfox.ca/?i=29"
  }
  ```
- `image` points directly to the fox image.
- `link` points to the RandomFox share page for that fox.

## Error handling
- No formal error schema is published on the official page.
- The site presents the API as a single public JSON endpoint.

## Integration notes for fireROUTE
- This is a single-route unauthenticated random-image source.
- The API is best modeled as a simple `random_image` provider with no filtering options.

## Sources inspected
- `https://randomfox.ca/`
- `https://randomfox.ca/floof/`
