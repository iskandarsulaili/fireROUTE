# Transport for Chicago, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-chicago-us`
- Provider identified from official pages as: `Chicago Transit Authority (CTA) Developer Center`
- Official docs used manually in this pass:
  - `https://www.transitchicago.com/developers/`
  - `https://www.transitchicago.com/developers/ttdocs/`
  - `https://www.transitchicago.com/developers/alerts/`
  - `https://www.transitchicago.com/developers/gtfs/`
  - `https://www.transitchicago.com/developers/bustracker/`
- Base URLs confirmed from the official CTA pages:
  - `http://lapi.transitchicago.com/api/1.0`
  - `https://www.transitchicago.com/downloads/sch_data/`
- Authentication:
  - Train Tracker endpoints require a `key` query parameter after agreeing to CTA's Developer License Agreement / Terms of Use and applying for a key
  - the Customer Alerts HTML page says you must understand and agree to the Terms of Use, but the inspected summary page does not publish a route-level key parameter table
  - the GTFS feed page does not publish an API-key requirement for the ZIP feed directory
  - CTA's Bus Tracker family also exists officially, but its detailed route inventory is still linked primarily through official PDFs rather than public HTML reference pages
- Primary response / payload formats:
  - Train Tracker: XML by default, JSON when `outputType=JSON`
  - Customer Alerts: XML is what the dedicated alerts page documents; CTA's developer-center homepage also says JSON versions have been published, but the inspected alerts page does not provide JSON request syntax
  - GTFS scheduled-service feed: ZIP package containing GTFS text tables
- Transport scope documented here: CTA Train Tracker, Customer Alerts, and GTFS scheduled-service feed URLs that are publicly exposed on official HTML pages

## Important official usage notes
- CTA's developer center publicly lists four data families: Train Tracker API, Bus Tracker API, Customer Alerts API, and GTFS / scheduled service data.
- CTA says JSON versions are available for Train Tracker, Bus Tracker, and Customer Alerts endpoints.
- CTA says use of its APIs or data offerings requires agreement to the Developer License Agreement and Terms of Use.
- Train Tracker is described by CTA as a beta product.
- Train Tracker predictions are generated for estimated arrivals up to 60 minutes beyond a train's current position.
- CTA explicitly recommends using the Customer Alerts API alongside Train Tracker because service events can affect prediction quality or availability.
- CTA's GTFS page says the posted ZIP normally represents service from now until a couple of months in the future and should be interpreted with the `calendar.txt` and `calendar_dates.txt` tables.
- CTA's Bus Tracker page is still useful for product context, freshness, and quota notes, but the detailed route inventory exposed there is still PDF-led, so it is not included in the confirmed route count below.

## Rate limits, pagination, and errors
- Published numeric rate limits:
  - Train Tracker default daily transaction limit: `100,000`
  - Bus Tracker default daily transaction limit: `100,000`
- Operational throttling notes:
  - CTA says Train Tracker also has DoS protection that can temporarily time out very high request volume from a single IP
  - CTA says Bus Tracker data is refreshed about every `30 seconds`
- No pagination is documented on the inspected Train Tracker, Customer Alerts, or GTFS HTML pages.
- CTA publishes structured Train Tracker error codes on the official Train Tracker documentation page.
- The inspected Customer Alerts and GTFS HTML pages do not publish structured non-200 error schemas.

## Confirmed API surface
The official CTA HTML documentation publicly exposes 6 confirmed routes / feed URLs suitable for fireROUTE publication:
1. `GET /ttarrivals.aspx`
2. `GET /ttfollow.aspx`
3. `GET /ttpositions.aspx`
4. `GET /routes.aspx`
5. `GET /alerts.aspx`
6. `GET https://www.transitchicago.com/downloads/sch_data/`

## Common request and response notes
- Train Tracker endpoints are GET query endpoints under `http://lapi.transitchicago.com/api/1.0`.
- Train Tracker returns XML by default and can return JSON when `outputType=JSON` is supplied.
- Train Tracker supports these route identifiers in public error-code guidance:
  - arrivals filter values: `Red`, `Blue`, `Brn`, `G`, `Org`, `P`, `Pink`, `Y`
  - locations filter values: `red`, `blue`, `brn`, `g`, `org`, `p`, `pink`, `y`
- Customer Alerts routes are GET endpoints under the same `lapi.transitchicago.com` base and return well-formed XML according to CTA; the CTA developer-center homepage separately notes that JSON versions have been published, but the inspected alerts detail page does not show the JSON request form.
- The GTFS feed is a downloadable ZIP package, not a paginated JSON API.
- CTA's Bus Tracker family is officially published, but its public route-level detail on the inspected site still depends on linked PDF documents, so those routes are not counted here.

## 1) Get train arrival predictions for a station or stop
- Method: `GET`
- Path: `/ttarrivals.aspx`
- Full URL: `http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx`
- Purpose: retrieve CTA train arrival predictions for all platforms at a station or for a specific stop/platform

Documented parameters:
- `key` - required API key
- `mapid` - required if `stpid` is not supplied; CTA station identifier
- `stpid` - required if `mapid` is not supplied; CTA stop/platform identifier
- `max` - optional maximum number of results
- `rt` - optional route filter
- `outputType` - optional; use `JSON` for JSON output

Documented response notes:
- XML root element: `ctatt`
- top-level fields include `tmst`, `errCd`, `errNm`
- repeated prediction container: `eta`
- documented prediction fields include `staId`, `stpId`, `staNm`, `stpDe`, `rn`, `rt`, `destSt`, `destNm`, `trDr`, `prdt`, `arrT`, `isApp`, `isSch`, `isFlt`, `isDly`, `flags`, `lat`, `lon`, `heading`
- CTA says predictions may be withheld during major work, reroutes, or unavoidable disruptions
- CTA says scheduled departures may be returned when live predictions are unavailable

Published validation / error details:
- missing required parameters such as `mapid or stpid` and `key`
- invalid API key
- maximum daily usage exceeded
- invalid or non-integer `mapid`
- maximum 4 `mapid` values per request
- invalid route identifier
- maximum 4 `rt` values per request
- invalid or non-integer `stpid`
- maximum 4 `stpid` values per request
- invalid or non-positive `max`
- invalid unsupported parameters
- generic server error

## 2) Follow a train run through upcoming stops
- Method: `GET`
- Path: `/ttfollow.aspx`
- Full URL: `http://lapi.transitchicago.com/api/1.0/ttfollow.aspx`
- Purpose: retrieve upcoming arrival predictions for a specific train run number

Documented parameters:
- `key` - required API key
- `runnumber` - required train run number
- `outputType` - shown in CTA's JSON example as an optional way to request JSON output

Documented response notes:
- top-level fields include `tmst`, `errCd`, `errNm`, and `position`
- documented `position` fields: `lat`, `lon`, `heading`
- repeated prediction container: `eta`
- documented prediction fields include `staId`, `stpId`, `staNm`, `stpDe`, `rn`, `rt`, `destSt`, `destNm`, `trDr`, `prdt`, `arrT`, `isApp`, `isSch`, `isFlt`, `isDly`, `flags`, `lat`, `lon`, `heading`
- CTA says the API reports upcoming estimates up to 60 minutes into the future or to the end of the trip
- CTA notes `destSt` and `destNm` are operationally useful but not always a perfect match for what a passenger might expect from signage logic around the Loop

Published validation / error details:
- missing `runnumber` or `key`
- invalid API key
- maximum daily usage exceeded
- invalid unsupported parameters
- no trains found for the supplied run number
- unable to determine upcoming stops
- unable to find predictions for active stations

## 3) Get current train locations for one or more routes
- Method: `GET`
- Path: `/ttpositions.aspx`
- Full URL: `http://lapi.transitchicago.com/api/1.0/ttpositions.aspx`
- Purpose: retrieve in-service train positions and next-stop information for one or more CTA rail routes

Documented parameters:
- `key` - required API key
- `rt` - required route list
- `outputType` - shown in CTA's JSON example as an optional way to request JSON output

Documented response notes:
- XML root element: `ctatt`
- top-level fields include `tmst`, `errCd`, `errNm`
- repeated container: `route` with a `name` attribute per route
- each `route` contains repeated `train` objects
- documented train fields include `rn`, `destSt`, `destNm`, `trDr`, `nextStaId`, `nextStpId`, `nextStaNm`, `prdt`, `arrT`, `isApp`, `isDly`, `flags`, `lat`, `lon`, `heading`
- CTA says this route returns in-service trains and basic information for one or more specified `L` routes

Published validation / error details:
- missing `rt` or `key`
- invalid API key
- maximum daily usage exceeded
- invalid route identifier
- maximum 8 route values per request
- invalid unsupported parameters

## 4) Get route status summary from the Customer Alerts system
- Method: `GET`
- Path: `/routes.aspx`
- Full URL: `http://lapi.transitchicago.com/api/1.0/routes.aspx`
- Purpose: retrieve status for a route based on the most significant event currently affecting that route

Documented parameters:
- the inspected HTML summary page names the endpoint but does not publish a route-level parameter table

Documented response notes:
- CTA says the response is a well-formed XML document
- CTA says the endpoint gives route status based on the most significant presently active event affecting service on that route
- CTA says the Customer Alerts system powers route-page alerts, system status information, and RSS feeds

## 5) Get detailed customer alerts
- Method: `GET`
- Path: `/alerts.aspx`
- Full URL: `http://lapi.transitchicago.com/api/1.0/alerts.aspx`
- Purpose: retrieve detailed information about individual CTA service alerts

Documented parameters:
- the inspected HTML summary page names the endpoint but does not publish a route-level parameter table

Documented response notes:
- CTA says the response is a well-formed XML document
- CTA says alerts can be added and updated throughout the day
- CTA says alerts are associated with routes and stations, ranked by level of impact, and carry descriptive headlines and text
- CTA says this endpoint provides detailed information about individual alerts, including descriptive text

## 6) Download the posted GTFS scheduled-service package
- Method: `GET`
- Path: `https://www.transitchicago.com/downloads/sch_data/`
- Purpose: download CTA's currently posted GTFS ZIP package

Documented parameters:
- none documented on the inspected page

Documented response notes:
- CTA says the feed is delivered as a ZIP file containing 10 GTFS tables plus an HTML copy of the Developer License Agreement and Terms of Use
- CTA explicitly lists these included GTFS tables:
  - `agency.txt`
  - `stops.txt`
  - `routes.txt`
  - `trips.txt`
  - `stop_times.txt`
  - `calendar.txt`
  - `calendar_dates.txt`
  - `shapes.txt`
  - `frequencies.txt`
  - `transfers.txt`
- CTA says the feed is usually updated every week or two, but can change more frequently when needed

## Official Bus Tracker family note
- CTA's official Bus Tracker page confirms the product exists, requires agreement to terms, requires a Bus Tracker account and API key, refreshes about every 30 seconds, and has a default limit of `100,000` transactions per day.
- The same official page links its detailed v3 and v2 references primarily as PDFs:
  - `https://www.transitchicago.com/assets/1/6/cta_Bus_Tracker_API_Developer_Guide_and_Documentation_2025-04-21.pdf`
  - `https://www.transitchicago.com/assets/1/6/cta_Bus_Tracker_API_Developer_Guide_and_Documentation_20160929.pdf`
- Because the inspected public HTML page did not itself expose a route-by-route inventory, those Bus Tracker routes are not included in the confirmed route count above.

## Sources inspected
- `https://www.transitchicago.com/developers/`
- `https://www.transitchicago.com/developers/ttdocs/`
- `https://www.transitchicago.com/developers/alerts/`
- `https://www.transitchicago.com/developers/gtfs/`
- `https://www.transitchicago.com/developers/bustracker/`
- `https://www.transitchicago.com/assets/1/6/cta_Bus_Tracker_API_Developer_Guide_and_Documentation_2025-04-21.pdf`
