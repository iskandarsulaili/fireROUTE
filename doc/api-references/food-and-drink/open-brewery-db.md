# Open Brewery DB

Official page manually reviewed:
- https://www.openbrewerydb.org/documentation

## Overview
- Public API base URL: `https://api.openbrewerydb.org/v1`
- Authentication: none mentioned on the reviewed docs page
- Response format: JSON

Manual route count confirmed from the reviewed docs: **5**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/breweries/{obdb-id}` | Get one brewery by unique identifier |
| GET | `/breweries` | List breweries with filters and pagination |
| GET | `/breweries/random` | Return a random brewery |
| GET | `/breweries/search` | Search breweries |
| GET | `/breweries/meta` | Return metadata for brewery queries |

## Confirmed parameters
For `GET /breweries`, the reviewed docs page shows:
- `by_city`
- `by_country`
- `by_dist`
- `by_ids`
- `by_name`
- `by_state`
- `by_postal`
- `by_type`
- `page`
- `per_page`
- `sort`

## Pagination
The official docs explicitly document:
- `page` (default `1`)
- `per_page` (default `50`, maximum `200`)

## Response notes
The reviewed docs enumerate response fields including:
- `id`, `name`, `brewery_type`
- `address_1`, `address_2`, `address_3`
- `city`, `state_province`, `postal_code`, `country`
- `longitude`, `latitude`
- `phone`, `website_url`
- deprecated fields `state` and `street`

## Rate limits
No numeric rate limit is published on the reviewed docs page.

## Errors
No formal error schema table is shown on the reviewed docs page.

## Important usage notes
- `by_state` expects full state names, not abbreviations.
- `by_dist` sorts by distance from a `latitude,longitude` origin pair.
- The docs note that spaces in filter values can use underscores or URL encoding.

## fireROUTE notes
- `/breweries` is the primary collection endpoint.
- Expose documented filters directly rather than inventing a narrower abstraction.
- Preserve provider pagination semantics with `page` and `per_page`.
