# Bandsintown

## Overview
- Provider: Bandsintown API
- Category: Music
- Official docs: `https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0`
- Base URL: `https://rest.bandsintown.com`
- Auth: required `app_id` query parameter; docs also state you must accept Bandsintown terms and obtain written consent / an assigned application ID from Bandsintown
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/artists/{artistname}` | path `artistname`; required `app_id` | Returns artist profile data such as Bandsintown URLs, images, MBID, tracker count, and upcoming event count. |
| GET | `/artists/{artistname}/events` | path `artistname`; required `app_id`; optional `date` | Returns artist event lists. `date` may be `upcoming`, `past`, `all`, or a comma-separated date range like `2015-05-05,2017-05-05`. If omitted, the docs say only upcoming shows are returned. |

## Parameter notes
- `artistname` — artist name path parameter. The docs explicitly instruct special-character replacements for artist names containing `/`, `?`, `*`, and `"`.
- `app_id` — application ID assigned by Bandsintown.
- `date` — optional event selector for `/artists/{artistname}/events`; supports `upcoming`, `past`, `all`, or a start/end date range.

## Response format notes
- `GET /artists/{artistname}` returns one JSON object. The official example includes:
  - `id`
  - `name`
  - `url`
  - `image_url`
  - `thumb_url`
  - `facebook_page_url`
  - `mbid`
  - `tracker_count`
  - `upcoming_event_count`
- `GET /artists/{artistname}/events` returns a JSON array of events.
- Event objects in the published example include:
  - `id`
  - `artist_id`
  - `url`
  - `on_sale_datetime`
  - `datetime`
  - `description`
  - nested `venue` with `name`, `latitude`, `longitude`, `city`, `region`, `country`
  - `offers` array with fields like `type`, `url`, `status`
  - `lineup` array

## Error and usage notes
- The Swagger page does not publish a detailed error schema or HTTP status matrix beyond generic `200` responses in the examples.
- Despite being a public Swagger reference, the Getting Started section says the API is intended for artists and enterprises representing artists, and that any use requires reading and accepting the terms plus obtaining written consent and a personal application ID from Bandsintown.
- No pagination controls or documented page cursors are provided; consumers should expect complete event lists for the selected date mode.

## Integration notes for fireROUTE
- Treat this as a compact two-route provider centered on artist lookup and artist-event lookup.
- Preserve the provider's required `app_id` query parameter even though the public index originally marked auth as `No`; the official Swagger documentation clearly requires it.
- Normalize the `date` selector carefully because it changes endpoint semantics substantially (`upcoming` vs `past` vs `all` vs explicit date range).
- Escape/encode artist names exactly as documented when building URLs from human-entered artist strings.

## Sources inspected
- `https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0`
