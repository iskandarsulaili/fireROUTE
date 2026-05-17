# Lowy Asia Power Index

## Provider metadata
- Category: `Open Data`
- Provider slug: `lowy-asia-power-index`
- Official docs/pages used:
  - `https://power.lowyinstitute.org/` (official Asia Power Index home page)
  - `https://power.lowyinstitute.org/network-power/` (official page whose live resource load exposes `network-power.json`)
  - `https://power.lowyinstitute.org/countries/china/` (official country page whose live resource/data endpoint is available as `/countries/{slug}.json`)
  - `https://power.lowyinstitute.org/data/economic-relationships/` (official data page whose live resource load exposes `data/historical.json`)
- Current public API base URL: `https://power.lowyinstitute.org`
- Auth model: no authentication was requested on any reviewed JSON route
- Methods confirmed from the official site: `GET`
- Response format notes: JSON; `world.json` is TopoJSON-shaped JSON, while the other confirmed routes return ordinary JSON objects or arrays
- Rate-limit notes: no public rate-limit policy was published on the reviewed official pages
- Manually confirmed route-family count: `4`

## Canonical route families confirmed from the official site
1. `GET /world.json`
   - Returns world topology data used by the official map view.
   - Live response is JSON with top-level keys `type`, `arcs`, `transform`, and `objects`.
2. `GET /network-power.json`
   - Returns data used by the official Network Power page.
   - Live response is JSON with top-level keys `global`, `data`, and `countries`.
3. `GET /countries/{slug}.json`
   - Returns detailed data for one country profile plus the site-wide country list.
   - Confirmed live example: `GET /countries/china.json`.
   - Live response is JSON with top-level keys `country` and `countries`.
4. `GET /data/historical.json`
   - Returns the historical score/ranking dataset used by official measure pages such as `economic-relationships`.
   - Live response is a large JSON array; each row is an array-like record rather than a named object.

## Parameters and path conventions
### Path parameters
- `slug` on `/countries/{slug}.json` is required.
- The official site exposes slugs in country-page URLs such as `/countries/china/`, which maps directly to `/countries/china.json`.
- Other confirmed country slugs visible on the official site include examples such as `united-states`, `japan`, `india`, and `australia`.

### Query parameters
- No supported query-string parameters were documented or exposed on the reviewed official pages for the confirmed JSON routes.
- The confirmed routes were all reachable as plain `GET` requests without API keys, tokens, or paging parameters.

## Response model notes
### `/world.json`
- TopoJSON-style payload.
- Top-level structure includes:
  - `type`
  - `arcs`
  - `transform`
  - `objects`

### `/network-power.json`
- JSON object with three top-level collections:
  - `global`
  - `data`
  - `countries`
- In the reviewed live response:
  - `global` was an array of country/location objects
  - `data` was an array of network datasets
  - `countries` was an array of the 27 Asia Power Index countries/territories

### `/countries/{slug}.json`
- JSON object with:
  - `country`
  - `countries`
- The reviewed `china.json` payload included:
  - country identity fields such as `id`, `name`, `latitude`, `longitude`, `slug`, and `href`
  - `scores` as an array of yearly/measure score entries
  - `analysis` as HTML-formatted explanatory text
  - `influence` as nested relationship datasets
- The companion `countries` array provides the cross-site country roster used by the official interface.

### `/data/historical.json`
- JSON array.
- The reviewed live response contained `26254` array rows.
- Each row is an ordered array record rather than an object with named fields.
- The first reviewed row had the shape `['AU', 0, 2024, 5, 31.8884, 0, 0.9584, null, 0.031, 1]`, so consumers should not assume self-describing keys.

## Errors and missing-route behavior
- No formal error-schema page was published on the reviewed official site.
- Missing JSON routes return the host's HTML `404` page rather than a JSON error object.
- Confirmed examples:
  - `GET /countries/not-a-real-country.json` -> `404` HTML page
  - `GET /nope.json` -> `404` HTML page
- Several historical paths from old third-party writeups, such as `/countries.json`, no longer resolve on the official host and should not be normalized as current routes.

## Usage notes
- These JSON routes were confirmed from the live official Lowy Institute site itself, not from the archived third-party GitHub repository previously linked in the category index.
- The official site does not currently publish a separate developer portal; the route inventory above is the machine-readable surface that is visibly in use by the official pages reviewed in-browser.
- Treat `/countries/{slug}.json` as the main detail endpoint and `/data/historical.json` as the shared historical score dataset behind multiple measure pages.
- Treat `world.json` and `network-power.json` as public data resources for the map/network visualizations.
- No pagination, authentication, or quota contract was published for these routes on the reviewed official pages.

## fireROUTE normalization notes
- Normalize the provider against `https://power.lowyinstitute.org`.
- Keep `/countries/{slug}.json` as a parameterized route family rather than expanding one route per country.
- Do not normalize previously reported historical paths such as `/countries.json` or `/data/{Year}.json` because they were not live on the reviewed official host in this run.
- Expect JSON on successful calls and HTML on unknown-path failures.