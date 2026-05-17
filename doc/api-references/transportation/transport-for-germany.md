# Transport for Germany

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-germany`
- Official docs/pages inspected manually in this pass:
  - `https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables`
  - `https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables/api/160160`
  - `http://data.deutschebahn.com/dataset/api-fahrplan`

## Manual review result
- Status for this pass: `manually_documented`
- Route count confirmed for fireROUTE publication: `4`

## API overview
- Product name on the official page: `Timetables`
- Version shown on the official page / explorer data: `1.0.274`
- Description from the explorer data: `API for passenger information for train stations operated by DB Station&Service AG`
- Base URL: `https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1`
- Protocol/style: REST over HTTPS
- Primary response format exposed by the spec: `application/xml`
- Pagination: none documented
- CORS: enabled according to the explorer configuration

## Authentication
- Authentication is required globally by the published OpenAPI document.
- Security schemes exposed in the official explorer:
  - `DB-Client-ID` header (`ClientID` apiKey)
  - `DB-Api-Key` header (`ClientSecret` apiKey)
- Subscription / access notes from the product page:
  - the product page exposes a `Free` usage plan
  - the page says users must sign in or register to subscribe to a usage plan

## Licensing, terms, and contacts
- Terms of service in the OpenAPI info block: `https://data.deutschebahn.com/nutzungsbedingungen.html`
- Product page service-terms link: `http://www.bahnhof.de/bahnhof-de/nutzungsbedingungen_wbt.html`
- License shown on the product page: `Creative Commons Attribution 4.0 International (CC BY 4.0)`
- Contact shown on the product page: `IRIS-TTS.API@deutschebahn.com`
- Contact email in the OpenAPI info block: `dbopendata@deutschebahn.com`

## Rate limits and caching notes
- The inspected official product page shows a `Free` plan and `24/7` operating availability.
- No numeric per-minute or per-day request cap was published on the inspected pages.
- Route descriptions include caching guidance:
  - `/fchg/{evaNo}`: full changes are updated every `30s` and should be cached for that period
  - `/rchg/{evaNo}`: recent changes are updated every `30s` and should be cached for that period
  - `/plan/{evaNo}/{date}/{hour}`: planned data is static and should be cached by web caches

## Errors
- The published operations expose these response codes:
  - `200` success (`application/xml`)
  - `404` resource not found

## Routes

### 1) Station lookup
- Method: `GET`
- Path: `/station/{pattern}`
- Purpose: returns information about stations matching the supplied pattern
- Path params:
  - `pattern` required string
    - can be a station-name prefix, EVA number, DS100/RL100 code, or wildcard `*`
    - the official description notes issues with umlauts in station-name prefixes
- Query params: none documented
- Response format: XML
- Notes:
  - the description calls this a public interface for station information, but the global auth scheme is still present in the published spec

### 2) Planned timetable slice
- Method: `GET`
- Path: `/plan/{evaNo}/{date}/{hour}`
- Purpose: returns planned data for a station within an hourly time slice
- Path params:
  - `evaNo` required string: station EVA number
  - `date` required string: `YYMMDD`
  - `hour` required string: `HH` with pattern `^([0-1][0-9]|2[0-3])$`
- Query params: none documented
- Response format: XML
- Notes:
  - response contains planned data only
  - descriptions say planned data does not contain messages
  - planned event attributes are `pt`, `pp`, `ps`, and `ppth`
  - changed attributes are absent in planned-only data
  - a small overlap can exist between adjacent hourly slices

### 3) Full changes for a station
- Method: `GET`
- Path: `/fchg/{evaNo}`
- Purpose: returns all known changes for the station
- Path params:
  - `evaNo` required string: station EVA number
- Query params: none documented
- Response format: XML
- Notes:
  - returns a `Timetable` object
  - includes all known changes from now into the future until changes become obsolete
  - changes may include messages
  - changed event attributes can include `ct`, `cp`, `cs`, and `cpth`
  - planned attributes can also appear when no associated planned data exists

### 4) Recent changes for a station
- Method: `GET`
- Path: `/rchg/{evaNo}`
- Purpose: returns only recent changes for the station
- Path params:
  - `evaNo` required string: station EVA number
- Query params: none documented
- Response format: XML
- Notes:
  - returns a `Timetable` object
  - recent changes are always a subset of full changes
  - data includes only changes that became known within the last `2 minutes`
  - the docs recommend loading full changes initially, then polling recent changes at intervals under 2 minutes to save bandwidth

## Response-model notes
- The published explorer includes XML-first schemas for timetable entities such as `Timetable`, events, station references, delays, platform changes, and messages.
- Time strings are repeatedly described in `YYMMddHHmm` format for timetable fields and `yyyyMMdd HH:mm:ss`-style examples appear in surrounding product materials.
- No JSON response option is documented in the inspected Deutsche Bahn OpenAPI surface.

## Legacy-page note
- The legacy indexed URL `http://data.deutschebahn.com/dataset/api-fahrplan` did not remain a trustworthy documentation surface in this pass and redirected away from usable DB docs.
- The current DB API Marketplace product page and attached API explorer did expose the complete route inventory above, so the provider can be documented from those official surfaces.

## Sources inspected
- `https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables`
- `https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables/api/160160`
- `http://data.deutschebahn.com/dataset/api-fahrplan`
