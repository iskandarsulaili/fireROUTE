# World Bank

## Provider metadata
- Category: `Science & Math`
- Provider slug: `world-bank`
- Official docs/pages used:
  - `https://datahelpdesk.worldbank.org/knowledgebase/topics/125589` (Developer Information index)
  - `https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries` (country query reference)
  - `https://datahelpdesk.worldbank.org/knowledgebase/articles/1886674-new-features-and-enhancements-in-the-v2-api` (v2 endpoint requirements and indicator-query enhancements)
  - `https://datahelpdesk.worldbank.org/knowledgebase/articles/1886686-metadata-api-queries` (source/concept/data query formats)
  - `https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-api-error-codes` (error-code table reached from the Developer Information index)
- Current public API base URL: `https://api.worldbank.org/v2`
- Auth model: no authentication documented for the public Indicators API pages reviewed
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: XML by default, JSON via `format=json`
- Rate limits: no public numeric quota or throttle policy was published on the reviewed official pages
- Manually confirmed route count: `11`

## Versioning and access notes
- The official docs explicitly state that `v2` must be present in requests.
- Version 1 is retired; the docs say old endpoints are no longer supported and now return `Resource not found`.
- Sample responses on the official pages include pagination metadata fields such as `page`, `pages`, `per_page`, and `total`.

## Canonical endpoints
1. `GET /country`
   - Lists countries.
   - The docs note this response also includes regions, income levels, and lending types useful for filtering.
2. `GET /country/{country-id}`
   - Returns one country by ISO-2, ISO-3, or World Bank code where applicable.
3. `GET /country/{country-id}/indicator/{indicator-id}`
   - Main indicator-data route shown in the v2 examples.
   - Official examples include `country/all/indicator/SP.POP.TOTL` and region/country aggregates.
4. `GET /region`
   - Lists regions.
5. `GET /incomelevel`
   - Lists income levels.
6. `GET /lendingtype`
   - Lists lending types.
7. `GET /sources`
   - Lists source databases.
8. `GET /sources/{source-id}`
   - Returns a specific source database.
9. `GET /sources/{source-id}/concepts`
   - Lists concepts/dimensions for a source.
10. `GET /sources/{source-id}/concepts/{concept-id}/data`
   - Returns concept-variable data for a concept under a source.
11. `GET /sources/{source-id}/{concept-id}/data`
   - Advanced multidimensional data query route documented on the metadata/advanced-data pages.

## Core parameters and path conventions
### Shared output and pagination parameters
- `format` - reviewed docs show `json` as the alternate to default XML
- `page`, `pages`, `per_page`, `total` - pagination metadata returned in responses

### Country and indicator query options confirmed in the official docs
- `ctrycode=y|n` - include or suppress World Bank 3-character country/region/income/lending codes in responses
- `footnote=y|n` - include or suppress footnote details in indicator data calls
- `scale=y|n` - include or suppress automatic scale-of-numbers information
- `source` - select a specific source database for indicator/data queries where required by the docs' examples

### Download/export options shown in official examples referenced by the docs set
- `downloadformat=csv|excel`
- `dataformat=list|table`

### Path-shape notes from the official examples
- `{country-id}` can be a country code like `br`, `chn`, `ind`, `usa`, or aggregate groups like `all` and `EAP`.
- Indicator codes use the World Bank indicator identifier format, e.g. `SP.POP.TOTL`.
- The docs show semicolon-separated multi-value path segments for some data requests.

## Response notes
- Country-query responses include ISO3 and ISO2 codes where available.
- Country responses may include region, admin region, income level, lending type, capital city, longitude, and latitude.
- Metadata/source responses expose fields such as source ID, name, description, URL, data availability, metadata availability, and concept counts.
- Advanced-data responses are XML/JSON envelopes carrying source metadata plus multidimensional variables and values.

## Error notes
The official API Error Codes page lists these documented errors:
- `105` - `503 Service currently unavailable`
- `110` - `404 API Version "XXX" not found`
- `111` - `404 Format "XXX" not found`
- `112` - `404 Method "XXX" not found`
- `115` - `404 Missing required parameter`
- `120` - `404 Parameter "XXX" has an invalid value`
- `140` - `400 Endpoint "XXX" not found`
- `150` - `400 Language with ISO2 code "XX" is not yet supported in the API`
- `160` - `400` filtering on indicator value without a date range is not allowed
- `199` - `500 Unexpected error`

## Usage notes
- Treat this as a versioned read-only API rooted at `/v2`.
- Default output is XML; request JSON explicitly with `format=json` when building adapters.
- The docs use aggregate scopes like `all` and regional codes as first-class path values, so fireROUTE should not over-normalize them away.
- Source/concept/data routes are a distinct metadata/advanced-data family alongside the country/indicator family.

## fireROUTE normalization notes
- Preserve `/v2` in all normalized routes.
- Normalize country metadata, indicator data, and source/concept metadata as separate route families.
- Preserve documented query flags such as `ctrycode`, `footnote`, `scale`, `source`, `downloadformat`, and `dataformat`.
- Expect paginated list envelopes rather than bare arrays or objects.
