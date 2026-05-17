# Foodish

Official page manually reviewed:
- https://raw.githubusercontent.com/surhud004/Foodish/master/README.md

## Overview
- Public API base URL: `https://foodish-api.com`
- Authentication: none mentioned
- Response format: JSON
- The README notes the first request can be slow because the app runs on a free instance

Manual route count confirmed from the reviewed README: **2**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/` | Return a random food image from a random category |
| GET | `/api/images/:food` | Return a random image from one food category |

## Parameters
- `:food` is a category slug such as the README example `biryani`
- The docs point users to the demo site for the full list of categories

## Response notes
Example response shape from the README:

```json
{"image":"https://foodish-api.com/images/burger/burger101.jpg"}
```

## Rate limits
No numeric rate limit is published in the reviewed README.

## Pagination
Not applicable.

## Errors
No formal error schema is documented in the reviewed README.

## fireROUTE notes
- The API is read-only and image-focused.
- Keep category selection as a path parameter passthrough.
