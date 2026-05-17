# Compare Flight Prices

## Provider metadata
- Category: `Transportation`
- Provider slug: `compare-flight-prices`
- Official docs used manually:
  - `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/`
  - `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/playground/apiendpoint_5057e44d-446f-48ee-96b0-d505bac600f3`
  - `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/playground/apiendpoint_b332d469-89b4-43e2-98f5-55685dc774a7`
- Base URL: `https://compare-flight-prices.p.rapidapi.com`
- Authentication / access notes:
  - the API is published through RapidAPI and the playground organizes requests under an `App` / `Authorizations` section
  - the public unsigned playground exposes the required host header `x-rapidapi-host: compare-flight-prices.p.rapidapi.com`
  - the public page does not reveal a concrete secret value; access is therefore tied to RapidAPI app subscription / key management rather than a provider-owned standalone auth flow
- Primary request style: query-string GET requests
- Primary response-format note: the public page exposes request snippets but did not expose a full example response payload in the unsigned view inspected during this pass

## Important official usage notes
- The official overview page currently exposes 2 GET endpoints.
- The provider positions the API as a live fare-comparison service across Expedia, Travelocity, Orbitz, Kayak, Priceline, Hotwire, CheapOAir, OneTravel, Vayama, FlightHub, and SkyScanner.
- The official workflow is two-step:
  1. call `StartFlightSearch` to begin the live search and receive a `SearchID`
  2. poll `GetPrices` with that `SearchID` while results are gathered
- The official overview states that all search fields are required except `date2` when `flightType = 1` (one way).
- Passenger-count parameters are all required on the search route, and the documented valid range is `0-9`.
- Documented enums:
  - `flightType`: `1 = one way`, `2 = round trip`
  - `cabin`: `1 = economy`, `2 = business`, `3 = first`, `5 = premium economy`

## Rate limits, pagination, and errors
- The official pricing note says: `this API is free to use but has a limit of 1 requests per second.`
- No pagination parameters are documented.
- `GetPrices` is designed as polling rather than page-based retrieval.
- The inspected public pages did not expose a provider-specific error table or structured error schema.

## Confirmed API surface
The official RapidAPI pages currently expose 2 routes:
1. `GET /GetPricesAPI/StartFlightSearch.aspx`
2. `GET /GetPricesAPI/GetPrices.aspx`

## Common request and response notes
- Both confirmed operations are GET endpoints on `compare-flight-prices.p.rapidapi.com`.
- The generated RapidAPI cURL snippets send `Content-Type: application/json` and the required `x-rapidapi-host` header.
- The public page did not expose a complete example response body for unsigned users, so response object fields could not be manually enumerated from the official page in this pass.

## 1) Start live flight search
- Method: `GET`
- Path: `/GetPricesAPI/StartFlightSearch.aspx`
- Full URL: `https://compare-flight-prices.p.rapidapi.com/GetPricesAPI/StartFlightSearch.aspx`
- Purpose: begin a live search and return the `SearchID` used to poll prices

Documented query parameters:
- `city1` - required string departure-city IATA code, example `LAX`
- `city2` - required string destination-city IATA code, example `NYC`
- `date1` - required date (`yyyy-mm-dd`) departure date
- `date2` - optional date (`yyyy-mm-dd`) return date; the overview says it is the only field that can be omitted for one-way searches
- `flightType` - required enum: `1` one way, `2` round trip
- `cabin` - required enum: `1` economy, `2` business, `3` first, `5` premium economy
- `adults` - required enum/integer count of travelers age `18+`, allowed values `0-9`
- `seniors` - required enum/integer senior-traveler count, allowed values `0-9`
- `youth` - required enum/integer traveler count age `12-17`, allowed values `0-9`
- `child` - required enum/integer traveler count age `2-11`, allowed values `0-9`
- `infant` - required enum/integer infant count under age `2`, allowed values `0-9`
- `lapinfant` - required enum/integer lap-infant count under age `2`, allowed values `0-9`
- `islive` - optional boolean; official note says it must be `true` or `false`, not `0` or `1`

Documented request snippet notes:
- Official playground example:
  `https://compare-flight-prices.p.rapidapi.com/GetPricesAPI/StartFlightSearch.aspx?lapinfant=0&child=0&city2=NYC&date1=2021-01-01&youth=0&flightType=1&adults=1&cabin=1&infant=0&city1=LAX&seniors=0&date2=2021-01-02&islive=false`
- Generated headers shown publicly:
  - `Content-Type: application/json`
  - `x-rapidapi-host: compare-flight-prices.p.rapidapi.com`

## 2) Poll prices for an existing search
- Method: `GET`
- Path: `/GetPricesAPI/GetPrices.aspx`
- Full URL: `https://compare-flight-prices.p.rapidapi.com/GetPricesAPI/GetPrices.aspx`
- Purpose: retrieve prices gathered so far for a previously started search

Documented query parameters:
- `SearchID` - required string identifier returned by `StartFlightSearch`

Documented request snippet notes:
- Official playground base request:
  `https://compare-flight-prices.p.rapidapi.com/GetPricesAPI/GetPrices.aspx`
- Generated headers shown publicly:
  - `Content-Type: application/json`
  - `x-rapidapi-host: compare-flight-prices.p.rapidapi.com`
- The overview explicitly instructs clients to poll this route while results are being gathered.

## Sources inspected
- `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/`
- `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/playground/apiendpoint_5057e44d-446f-48ee-96b0-d505bac600f3`
- `https://rapidapi.com/obryan-software-obryan-software-default/api/compare-flight-prices/playground/apiendpoint_b332d469-89b4-43e2-98f5-55685dc774a7`
