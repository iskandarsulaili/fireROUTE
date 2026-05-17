# Transport for Switzerland

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-switzerland`
- Provider identity confirmed from reviewed official pages as: `Open data platform mobility Switzerland`
- Official sources reviewed manually in this pass:
  - assigned docs URL: `https://opentransportdata.swiss/en/`
  - official API access page: `https://opentransportdata.swiss/en/howto-access-apis` (observed redirect target during review: `https://opentransportdata.swiss/de/cookbook/development-miscellaneous-cookbook/howto-access-apis/`)
  - official limits page: `https://opentransportdata.swiss/en/limits-and-costs/`
  - official API catalogue view: `https://data.opentransportdata.swiss/en/?res_format=API`
  - official dataset example pages:
    - `https://data.opentransportdata.swiss/en/dataset/ojp2-0`
    - `https://data.opentransportdata.swiss/en/dataset/gtfs-sa`

## Manual review result
- Status: `manual_blocked`
- Confirmed route count for this exact provider row: `0`

## Verified findings from official pages
- The official homepage title is `Open data platform mobility Switzerland – Open data platform for customer information on Swiss public transport`.
- The homepage presents this provider as a platform entrypoint and links to separate official surfaces for `Data`, `API-Manager`, `Cookbook`, and `Changelog`.
- The reviewed API access page title is `Howto: Zugriff auf unsere APIs mit API-Keys – Open Data-Plattform Mobilität Schweiz`.
- The reviewed access page confirms:
  - access is only possible via `HTTPS`
  - API URLs are contained in the data catalogue and in the respective cookbook pages
  - requests require a Bearer token in the `Authorization` header
  - only one key can be obtained per API
  - a `User-Agent` header should generally also be sent
  - some APIs use redirects, so clients should allow redirects
  - clients should enable compression, with example header `Accept-Encoding: zip, br, deflate`
  - since `3 March 2025`, keys are obtained via the official API Manager
- The reviewed limits page title is `Limits and costs – Open data platform mobility Switzerland`.
- The limits page publishes service-family-specific quotas instead of one provider-wide contract. Verified entries include:
  - `OJP 1.0`, `OJP 2.0`, `OJPFare`, `Train Formation Service`, `CKAN`: `50 requests per minute and API-key` and `20‘000 requests per day and API-key`
  - `GTFS RT`, `GTFS RT Service Alerts`: `5 requests per minute and API-key`
  - `SIRI-SX Planned`: `10 requests per hour and API-key` and `48 requests per day and API-key`
  - `SIRI-SX Unplanned`: `2 requests per minute and API-key` and `3’000 requests per day and API-key`
  - `SIRI-ET`: `2 requests per minute and API-key` and `3’000 requests per day and API-key`
  - `SIRI-PT`: `10 requests per hour and API-key` and `24 requests per day and API-key`
  - `FEDRO TDP: Traffic counters, Traffic lights, Traffic information`: `50 requests per minute and API-key`
- The same limits page also publishes paid OJP quota tiers above the free tier, including `CHF 500.- / month` and `CHF 1’000.- / month` plans.
- The reviewed official API catalogue title is `Dataset - opentransportdata.swiss - CKAN data catalog`.
- The official catalogue filtered by `API` shows `Formats: API - 13` and `13 datasets found`, including separate entries such as `Train Formation Service (Train Composition)`, `Open Journey Planner 2.0`, `Traffic information (road traffic)`, `GTFS Realtime - Service Alerts`, `Event data Public Transport (SIRI-SX / VDV736)`, `Traffic lights (road traffic) – real time`, `Traffic counters (road traffic) - real time`, `SIRI Planned Timetable`, `SIRI Estimated Timetable`, `Open Journey Planner 2020`, and `GTFS Realtime`.
- The reviewed `Open Journey Planner 2.0` dataset page confirms:
  - it is described as the API's route planner
  - API-key access is required
  - the `Open Journey Planner` resource is exposed as an `API`
  - a concrete official resource link is exposed: `https://api.opentransportdata.swiss/ojp20`
- The reviewed `GTFS Realtime - Service Alerts` dataset page confirms:
  - the continuously updated data can be obtained as a `Protobuffer file via API`
  - API-key access is required
  - a concrete official resource link is exposed: `https://api.opentransportdata.swiss/la/gtfs-sa`
- These reviewed official pages confirm that this row is an umbrella platform containing multiple distinct APIs, feeds, and service families rather than one bounded route surface.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://opentransportdata.swiss/en/`
- Official data catalogue surface: `https://data.opentransportdata.swiss/en/`
- Official API Manager surface: `https://api-manager.opentransportdata.swiss/`
- Official API access page: `https://opentransportdata.swiss/en/howto-access-apis`
- Official limits page: `https://opentransportdata.swiss/en/limits-and-costs/`
- Official API catalogue view: `https://data.opentransportdata.swiss/en/?res_format=API`
- Example official resource URLs verified during review:
  - `https://api.opentransportdata.swiss/ojp20`
  - `https://api.opentransportdata.swiss/la/gtfs-sa`
- Single provider-wide API base URL: not safely documentable for this exact row.
- Endpoint paths: not safely documentable as one bounded list for this row.
- HTTP methods:
  - the reviewed official material confirms multiple separate APIs and interfaces exist on the platform
  - no single provider-wide operation catalogue is published on the reviewed umbrella pages
- Parameters or request bodies: documented per individual API or dataset, not as one provider-wide model for this row.
- Authentication:
  - API access uses keys obtained via the official API Manager
  - the official access page documents Bearer-token auth in the `Authorization` header
  - the same page says only one key can be obtained per API
  - a `User-Agent` header should also generally be supplied
- Rate limits:
  - published, but only as service-family-specific quotas rather than one provider-wide limit
  - paid OJP quota tiers are published separately from the free limit
- Pagination: no single provider-wide pagination model was confirmed for this umbrella row.
- Errors: no single provider-wide error schema was confirmed for this umbrella row.
- Response formats:
  - the reviewed official pages confirm multiple distinct API and data families
  - one reviewed example explicitly states GTFS Realtime Service Alerts is delivered as a `Protobuffer file via API`
  - no single provider-wide response format can be documented safely for this row
- Important usage notes:
  - actual API URLs are stated to live in the data catalogue and in individual cookbook pages, not in one single platform-wide route list
  - some APIs redirect and clients should permit redirects
  - clients should enable compression where possible
  - this row represents a multi-API platform, not one small provider-specific route surface

## Why this provider remains blocked
- I manually checked the assigned official homepage and multiple official supporting pages for API access, quotas, the API catalogue, and dataset examples.
- The reviewed official material clearly documents platform-level access rules, headers, quota families, pricing tiers, and example resource links.
- However, this row maps to an umbrella platform containing many distinct APIs, feeds, and service families whose actual URLs and operation details live in separate catalogue entries and family-level pages.
- Because the reviewed official pages do not expose one safely bounded base URL and one fine-grained route inventory for this exact provider row, it remains `manual_blocked`.

## Sources inspected
- `https://opentransportdata.swiss/en/`
- `https://opentransportdata.swiss/en/howto-access-apis`
- `https://opentransportdata.swiss/en/limits-and-costs/`
- `https://data.opentransportdata.swiss/en/?res_format=API`
- `https://data.opentransportdata.swiss/en/dataset/ojp2-0`
- `https://data.opentransportdata.swiss/en/dataset/gtfs-sa`
