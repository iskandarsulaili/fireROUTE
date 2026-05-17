# eBird

## Overview
- Provider: eBird API 2.0
- Category: Animals
- Official docs: `https://documenter.getpostman.com/view/664302/S1ENwy59`
- Base URL: `https://api.ebird.org/v2`
- Auth: API key, normally sent as header `x-ebirdapitoken`; the docs also allow query parameter `key`
- HTTPS: yes
- Response format: JSON by default; some reference endpoints expose `fmt` query options for alternate output formats
- Pagination: no conventional page/cursor pagination is documented; list-style endpoints usually use filters plus `maxResults`
- Rate limits: no public numeric rate limit was surfaced on the reviewed official docs

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/data/obs/{regionCode}/recent` | path: `regionCode`; query: `back`, `cat`, `hotspot`, `includeProvisional`, `maxResults`, `r`, `sppLocale` | Recent observations for a region/location. |
| GET | `/data/obs/{regionCode}/recent/notable` | path: `regionCode`; query: `back`, `detail`, `hotspot`, `maxResults`, `r`, `sppLocale` | Recent notable observations in a region. |
| GET | `/data/obs/{regionCode}/recent/{speciesCode}` | path: `regionCode`, `speciesCode`; query: `back`, `hotspot`, `includeProvisional`, `maxResults`, `r`, `sppLocale` | Recent observations of one species in a region. |
| GET | `/data/obs/geo/recent` | query: `lat`, `lng`, `back`, `cat`, `dist`, `hotspot`, `includeProvisional`, `maxResults`, `sort`, `sppLocale` | Recent nearby observations around coordinates. |
| GET | `/data/obs/geo/recent/{speciesCode}` | path: `speciesCode`; query: `lat`, `lng`, `back`, `dist`, `hotspot`, `includeProvisional`, `maxResults`, `sppLocale` | Recent nearby observations of one species. |
| GET | `/data/nearest/geo/recent/{speciesCode}` | path: `speciesCode`; query: `lat`, `lng`, `back`, `dist`, `hotspot`, `includeProvisional`, `maxResults`, `sppLocale` | Nearest recent observations of a species. |
| GET | `/data/obs/geo/recent/notable` | query: `lat`, `lng`, `back`, `detail`, `dist`, `hotspot`, `maxResults`, `sppLocale` | Nearby notable observations. |
| GET | `/data/obs/{regionCode}/historic/{year}/{month}/{day}` | path: `regionCode`, `year`, `month`, `day`; query: `cat`, `detail`, `hotspot`, `includeProvisional`, `maxResults`, `rank`, `r`, `sppLocale` | Historic observations on a specific date. |
| GET | `/product/top100/{regionCode}/{year}/{month}/{day}` | path: `regionCode`, `year`, `month`, `day`; query: `rankedBy`, `maxResults` | Top 100 contributors/statistics for a date. |
| GET | `/product/lists/{regionCode}` | path: `regionCode`; query: `maxResults` | Recent checklist feed for a region. |
| GET | `/product/lists/{regionCode}/{year}/{month}/{day}` | path: `regionCode`, `year`, `month`, `day`; query: `sortKey`, `maxResults` | Checklist feed on a date. |
| GET | `/product/stats/{regionCode}/{year}/{month}/{day}` | path: `regionCode`, `year`, `month`, `day` | Regional statistics on a date. |
| GET | `/product/spplist/{regionCode}` | path: `regionCode` | Species list for a region. |
| GET | `/product/checklist/view/{subId}` | path: `subId` | View checklist details and observations. |
| GET | `/ref/adjacent/{regionCode}` | path: `regionCode` | Adjacent regions reference endpoint. |
| GET | `/ref/hotspot/{regionCode}` | path: `regionCode`; query: `back`, `fmt` | Hotspots in a region. |
| GET | `/ref/hotspot/geo` | query: `lat`, `lng`, `back`, `dist`, `fmt` | Nearby hotspots. |
| GET | `/ref/hotspot/info/{locId}` | path: `locId` | Hotspot info for a hotspot location code. |
| GET | `/ref/taxonomy/ebird` | query: `cat`, `fmt`, `locale`, `species`, `version` | Main eBird taxonomy endpoint. |
| GET | `/ref/taxon/forms/{speciesCode}` | path: `speciesCode` | Taxonomic forms/subspecies for a species. |
| GET | `/ref/taxa-locales/ebird` | none | Supported locale codes for taxon names. |
| GET | `/ref/taxonomy/versions` | none | Available taxonomy versions. |
| GET | `/ref/sppgroup/{speciesGrouping}` | path: `speciesGrouping`; query: `groupNameLocale` | Taxonomic groups/species-group listing. |
| GET | `/ref/region/info/{regionCode}` | path: `regionCode`; query: `regionNameFormat`, `delim` | Region information. |
| GET | `/ref/region/list/{regionType}/{parentRegionCode}` | path: `regionType`, `parentRegionCode`; query: `fmt` | Sub-region listing under a parent region. |

## Parameter, auth, and format notes
- The docs state that almost all endpoints require an API key tied to an eBird account.
- The key is documented primarily in header `x-ebirdapitoken`; the introduction also says `key` can be sent as a request parameter.
- Common observation filters include `back` (days back), `hotspot`, `includeProvisional`, `maxResults`, and `sppLocale`.
- Geographic observation and hotspot endpoints use `lat` and `lng`, with radius control through `dist`.
- Several reference endpoints expose `fmt`; the docs also note that older path suffixes like `.json` are no longer supported.
- `speciesCode` values come from the eBird taxonomy endpoints.

## Errors, freshness, and usage notes
- `GET /ref/hotspot/info/{locId}` explicitly documents HTTP `410 Gone` when the supplied location code is private, invalid, or not a hotspot.
- The docs page includes sample `200` JSON responses across the collection, but it does not expose a single global error-schema section or a public numeric rate-limit policy.
- When using the `r` query parameter on region species-observation endpoints, the docs say to set the `regionCode` path segment to an empty string.
- Historic observations are documented as cacheable for 30 minutes.
- `product/top100` and `product/stats` are documented as updating every 15 minutes.
- `product/spplist` is documented as updating very frequently for locations and daily for larger regions.
- The checklist-view endpoint includes an explicit warning not to use it for bulk data download.
- Adjacent-region lookups are documented as only supporting subnational2 codes in the United States, New Zealand, and Mexico.

## Integration notes for fireROUTE
- Treat eBird as a read-only, filter-heavy API with route families for observations, products, and references rather than a paginated CRUD API.
- Preserve the distinction between region-based, coordinate-based, and reference endpoints in any adapter mapping.
- Keep `fmt`-capable reference endpoints separate from JSON-default observation/product endpoints.
- Do not normalize away eBird-specific codes like `regionCode`, `speciesCode`, `locId`, or `subId`; they are core identifiers across the API.

## Route-count note
- The official Postman documentation currently exposes `25` confirmed GET operations under `https://api.ebird.org/v2`.

## Sources inspected
- `https://documenter.getpostman.com/view/664302/S1ENwy59`
- `https://documenter.gw.postman.com/api/collections/664302/S1ENwy59?environment=5517267-8932139e-2b03-483b-ae03-b78159989b40&segregateAuth=true&versionTag=latest`
- `https://ebird.org/api/keygen`
