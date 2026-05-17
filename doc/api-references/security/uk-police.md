# UK Police

## Provider metadata
- Category: `Security`
- Provider slug: `uk-police`
- Docs used manually:
  - `https://data.police.uk/docs/`
  - `https://data.police.uk/docs/authentication/`
  - `https://data.police.uk/docs/api-call-limits/`
  - `https://data.police.uk/docs/method/crimes-street-dates/`
  - `https://data.police.uk/docs/method/forces/`
  - `https://data.police.uk/docs/method/force/`
  - `https://data.police.uk/docs/method/crime-street/`
  - `https://data.police.uk/docs/method/neighbourhoods/`
- Confirmed REST API base URL: `https://data.police.uk/api`
- Primary media type: JSON
- Request styles explicitly documented on the main docs page: HTTP `GET` and `POST`
- Manually confirmed routes in this pass: `5`

## Authentication
From the official authentication page:
- the Police API no longer requires authentication
- no API key, OAuth flow, or token header is documented for the reviewed public endpoints

## Common request/response conventions
- Base URL: `https://data.police.uk/api`
- JSON is the documented response format
- the docs provide example request URLs and example response bodies for each reviewed method page
- successful requests return HTTP `200`
- failures return non-`200` statuses

## Manually confirmed endpoint set

### 1) List data availability by month
- Method: `GET`
- Path: `/crimes-street-dates`
- Full URL: `https://data.police.uk/api/crimes-street-dates`
- Purpose: list available months of street-crime data and associated stop-and-search force coverage
- Response shape confirmed on the method page:
  - array of objects containing:
    - `date` - ISO `YYYY-MM`
    - `stop-and-search` - array of force IDs with stop-and-search data for that month

### 2) List police forces
- Method: `GET`
- Path: `/forces`
- Full URL: `https://data.police.uk/api/forces`
- Purpose: return force IDs used by force-scoped endpoints
- Important usage note from the method page:
  - British Transport Police is excluded from the force list returned by this method
- Response fields confirmed on the method page:
  - `id` - unique force identifier
  - `name` - force name

### 3) Retrieve one force
- Method: `GET`
- Path: `/forces/{force}`
- Full URL example from the docs: `https://data.police.uk/api/forces/leicestershire`
- Purpose: retrieve force metadata and engagement channels
- Path parameters:
  - `force` - force identifier obtained from `/forces`
- Response fields confirmed on the method page include:
  - `description`
  - `url`
  - `engagement_methods[]`
    - `url`
    - `type`
    - `description`
    - `title`
  - `telephone`
  - `id`
  - `name`

### 4) Retrieve street-level crimes
- Method: `GET`
- Path pattern: `/crimes-street/{category}`
- Full URL examples from the docs:
  - `https://data.police.uk/api/crimes-street/all-crime?date=2024-01&lat=52.629729&lng=-1.131592`
  - `https://data.police.uk/api/crimes-street/all-crime?date=2024-01&poly=52.268,0.543:52.794,0.238:52.130,0.478`
- Purpose: retrieve approximate street-level crimes by point or polygon area
- Path parameters:
  - `category` - any crime category; the docs example uses `all-crime`
- Query parameters confirmed on the method page:
  - point search:
    - `lat`
    - `lng`
    - `date` - optional `YYYY-MM`, latest month by default
  - custom area search:
    - `poly` - colon-delimited lat/lng pairs
    - `date` - optional `YYYY-MM`
- Response fields confirmed on the method page include:
  - `category`
  - `persistent_id`
  - `month`
  - `location`
    - `latitude`
    - `street.id`
    - `street.name`
    - `longitude`
  - `context`
  - `location_type`
  - `outcome_status`
- Important usage notes from the method page:
  - returned locations are approximate, not exact
  - if a custom area contains more than `10,000` crimes, the API returns `503`
  - GET requests longer than `4094` characters return `400`; the docs recommend `POST` for very complex `poly` values

### 5) List neighbourhoods for a force
- Method: `GET`
- Path: `/{force}/neighbourhoods`
- Full URL example from the docs: `https://data.police.uk/api/leicestershire/neighbourhoods`
- Purpose: list neighbourhood teams for one force
- Path parameters:
  - `force` - force identifier
- Response fields confirmed on the method page:
  - `id` - force-specific team identifier; explicitly not globally unique across forces
  - `name` - neighbourhood name

## Pagination
- none of the five reviewed Police API methods document pagination

## Rate limits
From the official API call limits page:
- leaky-bucket rate limiting is used
- current published limit: `15 requests/second` with a burst of `30`
- if the limit is exceeded, the API returns HTTP `429 Too Many Requests`

## Error and response notes
From the official docs and reviewed method pages:
- success responses return HTTP `200`
- failures return non-`200` statuses
- explicit reviewed error conditions include:
  - `429` when rate limits are exceeded
  - `503` for street-crime custom-area requests that would exceed `10,000` crimes
  - `400` for `GET` requests longer than `4094` characters on the street-crime polygon route
- the docs do not publish a generalized JSON error schema on the reviewed pages

## Important usage notes
- the API is public and currently unauthenticated
- street-level crime coordinates are anonymized approximations
- force IDs from `/forces` are reused across many other endpoints
- for Scotland, the street-crime docs caution that only British Transport Police provide data, so apparent crime levels may look artificially low

## Verification notes
This file was manually rebuilt from the official data.police.uk documentation pages with browser inspection.