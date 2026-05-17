# Florida Man

## Overview
- Provider: Florida Man API
- Category: News
- Official docs/source page: `https://github.com/juliayxhuang/florida-man-api#readme`
- Base URL: `https://juliayxhuang.github.io/florida-man-api`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented; this is a static dataset API with direct file-style endpoints
- Rate limits: no numeric rate limit documented
- Dataset note from the README: the API exposes `10,000+` real Florida Man headlines as a static JSON API hosted on GitHub Pages

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/headlines.json` | none | Returns the full headline dataset. |
| GET | `/api/index.json` | none | Returns overall dataset metadata, including total count, available dates, and endpoint map. |
| GET | `/api/{MM}/index.json` | required zero-padded `MM` path parameter | Returns the index for one month. |
| GET | `/api/{MM}/{DD}.json` | required zero-padded `MM` and `DD` path parameters | Returns headlines for a specific calendar day across years. |

## Path parameter notes
- `MM` — two-digit month, such as `04`.
- `DD` — two-digit day-of-month, such as `23`.
- The official README example for day lookup uses `https://juliayxhuang.github.io/florida-man-api/api/04/23.json`.

## Response format notes
### `GET /api/index.json`
During manual review, this endpoint returned a JSON object with:
- `total`
- `dates[]` objects containing:
  - `month`
  - `day`
  - `count`
- `endpoints` object mapping the four published routes

### `GET /api/{MM}/{DD}.json`
During manual review, this endpoint returned an array of headline objects with fields:
- `title`
- `url`
- `source`
- `date`
- `keywords[]`

### Other endpoint notes
- The README describes `/api/headlines.json` as the all-headlines dump.
- The README describes `/api/{MM}/index.json` as the month index endpoint.
- The provider does not document pagination or filtering parameters beyond the path-driven date selection.

## Error handling
- No formal error-body schema is documented.
- Because the API is published as static JSON files on GitHub Pages, missing or invalid dates should be treated as ordinary HTTP/file-not-found failures.
- The official docs do not describe retry headers, quota headers, or typed error payloads.

## Usage notes
- This is a static-content API rather than a dynamic search service.
- `/api/index.json` is the best discovery starting point because it exposes the total item count and available date buckets.
- The day endpoint groups matching headlines by month/day across multiple years, not by one single year-only resource.

## Integration notes for fireROUTE
- Treat the provider as a dataset/files API with direct JSON resources.
- Preserve the zero-padded `MM` and `DD` path shape exactly.
- Use `/api/index.json` as the canonical discovery route before drilling into month/day resources.
- Avoid assuming pagination or incremental cursors; clients should navigate the published index files instead.

## Sources inspected
- `https://github.com/juliayxhuang/florida-man-api#readme`
- `https://juliayxhuang.github.io/florida-man-api/api/index.json`
- `https://juliayxhuang.github.io/florida-man-api/api/04/23.json`
