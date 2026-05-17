# City Bikes

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `city-bikes`
- Official docs/pages used:
  - `https://api.citybik.es/v2/`
- Current public API base URL: `http://api.citybik.es/v2`
- Auth model: no authentication required for the reviewed endpoints
- Response format: JSON only
- Public rate-limit note: no numeric rate limit was published in the reviewed documentation page
- Manually confirmed route count: `2`

## Authentication and access
- The reviewed documentation page describes CityBikes as a free service.
- No API key, OAuth flow, or login step is documented for the published endpoints.
- The docs emphasize attribution/linking requirements when reusing CityBikes data in an app or website.

## Canonical endpoints
1. `GET /networks` - list all known bike-share networks
2. `GET /networks/{network_id}` - fetch one network, including stations and vehicles when available

## Parameters and filters
### Query parameters
- `fields` - field-filtering selector available on any request; examples include `?fields=id,name,href` and `?fields=stations`

### Path parameters
- `network_id` - network identifier such as `velib` or `divvy`

## Response, pagination, and error notes
- The docs show JSON objects keyed by either `networks` or `network`.
- `/networks/{network_id}` responses may include `stations` and `vehicles` collections when the backing network exposes them.
- The docs do not publish page/offset pagination.
- No shared error schema is published on the reviewed page.
- Timestamps are documented as UTC values.

## Usage notes from the official docs
- Field filtering currently applies only at the first document level.
- The docs note that extra station metadata is not constant across different networks.
- Vehicle records, when present, can describe types such as `bike`, `ebike`, or `scooter`.
- The documentation states that the API is a display layer of PyBikes.

## fireROUTE normalization notes
- Model this provider as a compact public JSON API with one collection endpoint and one network-detail endpoint.
- Preserve the `fields` query parameter because it materially changes payload size and shape.
- Keep `stations` and `vehicles` optional in downstream schemas because the docs say availability varies by network.