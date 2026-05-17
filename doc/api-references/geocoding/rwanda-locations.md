# Rwanda Locations

## Provider metadata
- Category: `Geocoding`
- Provider slug: `rwanda-locations`
- Official docs used manually:
  - `https://rapidapi.com/victorkarangwa4/api/rwanda`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_aa80bf62-1ee5-4287-9e2f-9670bfb9faff`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_cc661b5e-592d-4df6-b8ba-028f71ef59de`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_0671451a-5461-47d7-bb65-f0eaa4f742e6`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_06b10ebc-c363-43c3-8329-5126678bce8e`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_d813d4c1-1240-4c17-add6-6a8cc548dbc1`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/playground/apiendpoint_4bbc092a-19fb-4b1f-aede-54f23e0924bd`
  - `https://rapidapi.com/victorkarangwa4/api/rwanda/pricing`
  - `https://rwanda.victor.rw/`
- Public API base URL confirmed from the official RapidAPI page: `https://rwanda.p.rapidapi.com`
- Transport: `HTTPS`
- Auth model: RapidAPI-hosted access; the unsigned public playground exposes `x-rapidapi-host: rwanda.p.rapidapi.com`, and a direct live request to `/provinces` without credentials returned `{"message":"Invalid API key. Go to https://docs.rapidapi.com/docs/keys for more info."}`
- Response format observed from the official site and direct API host checks: JSON

## Product and access notes
- The official RapidAPI overview describes the API as administrative-structure data for Rwanda covering provinces, districts, sectors, cells, and villages.
- The same overview states Rwanda is organized into four provinces plus Kigali city, `30` districts, `416` sectors, `2148` cells, and `14 837` villages.
- The official product website currently returns a simple JSON summary instead of a separate human-readable docs portal.
- The official RapidAPI pricing page shows one `Basic` plan at `$0.00 /mo` with `500,000 / Month` requests and a `1000 requests per hour` rate limit.

## Confirmed API surface
The inspected official RapidAPI docs confirm these `6` GET routes under `https://rwanda.p.rapidapi.com`:
1. `GET /`
2. `GET /provinces`
3. `GET /districts`
4. `GET /cells`
5. `GET /sectors`
6. `GET /villages`

## Shared request and behavior notes
- All six confirmed routes are published as GET endpoints in the official RapidAPI version `v1 (current)`.
- The public playground shows no body payloads for the confirmed routes.
- No pagination controls were exposed on the public docs pages.
- The public playground labels route filters with short query names:
  - `p` - province filter, evidenced by sample values such as `east`
  - `d` - district filter, evidenced by sample values such as `ngoma`
  - `s` - sector filter, evidenced by sample values such as `kibungo`
  - `c` - cell filter, evidenced by sample values such as `cyasemakamba`
- The public playground's `Authorizations` tab says `No additional authorizations needed`, but the live direct API host still rejects unsigned requests with an `Invalid API key` JSON message. fireROUTE should therefore treat the provider as API-key-gated even though the public unsigned playground does not reveal the exact key-header wiring.

## 1) All locations
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://rwanda.p.rapidapi.com/`
- Purpose: fetch all provinces, districts, sectors, cells, and villages from Rwanda in one call

Documented parameters:
- none exposed on the official public playground

Response and usage notes:
- The official endpoint description says this route returns all provinces, districts, sectors, cells, and villages from Rwanda.
- Because this is the top-level dump route, consumers should expect a broad response rather than a filtered subset.

## 2) Provinces
- Method: `GET`
- Path: `/provinces`
- Full URL pattern: `https://rwanda.p.rapidapi.com/provinces`
- Purpose: list all provinces found in Rwanda

Documented parameters:
- none exposed on the official public playground

Response and usage notes:
- The public example cURL snippet targets `/provinces` directly with no query string.
- A direct unsigned browser request to this route returned the live JSON error `{"message":"Invalid API key. Go to https://docs.rapidapi.com/docs/keys for more info."}`.

## 3) Districts
- Method: `GET`
- Path: `/districts`
- Full URL pattern: `https://rwanda.p.rapidapi.com/districts`
- Purpose: list districts, optionally narrowed to one province

Documented query parameter:
- `p` - province filter; official sample value `east`

Response and usage notes:
- The official endpoint description says that when no province is provided, the route returns all districts in Rwanda.
- The public cURL example is `https://rwanda.p.rapidapi.com/districts?p=east`.

## 4) Cells
- Method: `GET`
- Path: `/cells`
- Full URL pattern: `https://rwanda.p.rapidapi.com/cells`
- Purpose: list cells, optionally narrowed by province, district, and sector

Documented query parameters:
- `p` - province filter; official sample value `east`
- `d` - district filter; official sample value `ngoma`
- `s` - sector filter; official sample value `kibungo`

Response and usage notes:
- The official endpoint description says omitting these filters returns all cells in Rwanda.
- The public cURL example is `https://rwanda.p.rapidapi.com/cells?p=east&d=ngoma&s=kibungo`.

## 5) Sectors
- Method: `GET`
- Path: `/sectors`
- Full URL pattern: `https://rwanda.p.rapidapi.com/sectors`
- Purpose: list sectors, optionally narrowed by province and district

Documented query parameters:
- `p` - province filter; official sample value `east`
- `d` - district filter; official sample value `ngoma`

Response and usage notes:
- The official endpoint description says omitting these filters returns all sectors in Rwanda.
- The public cURL example is `https://rwanda.p.rapidapi.com/sectors?p=east&d=ngoma`.

## 6) Villages
- Method: `GET`
- Path: `/villages`
- Full URL pattern: `https://rwanda.p.rapidapi.com/villages`
- Purpose: list villages, optionally narrowed by province, district, sector, and cell

Documented query parameters:
- `p` - province filter; official sample value `east`
- `d` - district filter; official sample value `ngoma`
- `s` - sector filter; official sample value `kibungo`
- `c` - cell filter; official sample value `cyasemakamba`

Response and usage notes:
- The official endpoint description says omitting these filters returns all villages in Rwanda.
- The public cURL example is `https://rwanda.p.rapidapi.com/villages?p=east&d=ngoma&s=kibungo&c=cyasemakamba`.

## Rate limits, pagination, and errors
- Official pricing page limit: `500,000 / Month` requests on the public `Basic` plan
- Official pricing page rate limit: `1000 requests per hour`
- No pagination parameters were exposed on the official public docs pages for any confirmed route
- Confirmed live error behavior from a direct unauthenticated request: JSON message `Invalid API key. Go to https://docs.rapidapi.com/docs/keys for more info.`
- No richer public error schema was exposed in the unsigned official playground

## Important usage notes
- The route set is hierarchical: the more of `p`, `d`, `s`, and `c` you omit, the broader the returned administrative slice becomes.
- The official public docs use very short parameter names; fireROUTE should preserve those exact wire-level names even if internal labels expand them.
- The public unsigned playground does not expose the exact API-key header name, so the auth note above is grounded only to the live invalid-key response and the RapidAPI-managed hosting context.

## Verification notes
- This file was manually rebuilt from the live official RapidAPI listing, official RapidAPI playground pages, official RapidAPI pricing page, a direct live check of the provider API host, and the provider's official product website using browser tools only.
