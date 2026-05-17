# Data USA

## Provider metadata
- Category: `Government`
- Provider slug: `data-usa`
- Official docs/pages used:
  - `https://datausa.io/about/api/` (official API guide)
- Current public API base URL: `https://api.datausa.io/tesseract`
- Auth model: no API key or authentication requirement is described on the official API guide reviewed here
- Response formats: `jsonrecords`, `jsonarrays`, `csv`, `tsv`, `parquet`, and `xlsx` are explicitly documented for the data endpoint; the guide describes the API generally as returning JSON results
- Rate limits: no public rate-limit policy was exposed on the official API guide reviewed here
- Manually confirmed route count: `4`

## Access notes
- The official guide presents the API as a Tesseract query surface organized around cubes, members, and a format-selectable data endpoint.
- The guide says every visualization on the site has a “show data” button that reveals the API call used to generate that view, which is useful for discovering real query patterns.
- The official documentation page describes the core endpoints only; it does not publish a shared HTTP error-code table.

## Canonical endpoints
1. `GET /tesseract/cubes`
   - Returns the list of available data cubes.
2. `GET /tesseract/cubes/{name}`
   - Returns the schema for a specific cube, including measures, dimensions, and levels.
3. `GET /tesseract/members`
   - Returns members for a selected cube level.
4. `GET /tesseract/data.{format}`
   - Main query endpoint for retrieving cube data in one of the documented formats.

## Parameters
### `GET /tesseract/cubes`
- No query parameters are documented on the official page.

### `GET /tesseract/cubes/{name}`
- `name` - required cube name

### `GET /tesseract/members`
Official example parameters:
- `cube` - required cube name
- `level` - required dimension/level name whose members should be returned

### `GET /tesseract/data.{format}`
Core request components documented by the official guide:
- `format` - output format suffix; supported values are `csv`, `tsv`, `parquet`, `xlsx`, `jsonarrays`, and `jsonrecords`
- `cube` - dataset/cube to query
- `drilldowns` - comma-separated dimensions/columns to include in the response
- `measures` - comma-separated measures/metrics to return; measures use the cube's default aggregation function
- `include` - dimension-member filters such as `Year:2023`; multiple filters may be separated by semicolons or repeated across parameters
- `limit` - `limit,offset` pair, for example `100,0`

Advanced query parameters documented on the official page:
- `exclude` - inverse of `include`; excludes listed members while keeping others
- `parents` - include parent members for hierarchical dimensions; can be a comma-separated level list or `true`
- `filters` - measure-based filter expression using operators like `gt`, `gte`, `lt`, `lte`, `eq`, `neq`, `isnull`, and `isnotnull`, with `.and.` / `.or.` combinations supported
- `ranking` - ranking directive such as `<measure>`, `-<measure>`, comma-separated combinations, or `true`
- `sort` - ordering directive in `<measure-or-level>.asc` or `.desc` form
- `top` - TopK directive in `<amount>.<level1>[,<level2>].<measure-or-level>.<order>` form
- `time` - special time filter in `<dimension>.latest[.amount]`, `<dimension>.oldest[.amount]`, `<dimension>.trailing[.amount]`, or `<dimension>.leading[.amount]` form

## Response notes
### `GET /tesseract/data.{format}` JSON structure
The official response-format section shows these JSON sections:
- `annotations` - dataset/source metadata such as `subtopic`, `dataset_link`, `table_id`, `dataset_name`, `topic`, `source_name`, and `source_description`
- `page` - pagination metadata with `limit`, `offset`, and `total`
- `columns[]` - ordered list of column names in the payload
- `data[]` - result rows

### Endpoint-specific response behavior
- `/tesseract/cubes` returns the available cubes on the Tesseract server.
- `/tesseract/cubes/{name}` returns the full schema for a cube, including measures, dimensions, and levels.
- `/tesseract/members` returns distinct member values for the requested `cube` + `level` combination.
- `/tesseract/data.{format}` changes output structure depending on the chosen format; `jsonrecords` is the readable object-oriented JSON form used in the official examples.

## Pagination and filtering notes
- The official guide represents pagination on the data endpoint using `limit=<count>,<offset>`.
- The JSON response also echoes pagination state in `page.limit`, `page.offset`, and `page.total`.
- Dimension filtering (`include` / `exclude`) and measure filtering (`filters`) are documented separately and should not be conflated.
- The guide explicitly says that available drilldowns, measures, and filterable members are cube-specific and should be discovered from `/tesseract/cubes/{name}` and `/tesseract/members`.

## Error notes
- The reviewed official page does not publish a shared HTTP status-code matrix, error schema, or rate-limit headers.
- Because the API is query-string driven, malformed parameter combinations should be expected during integration, but the official guide does not define a canonical error envelope.

## Usage notes
- Start with `/tesseract/cubes` and `/tesseract/cubes/{name}` to discover legal cube names, measures, dimensions, and levels before constructing data queries.
- Use `/tesseract/members` to discover valid member keys for filters such as `include=Year:2023` or state/county identifiers.
- The `data.{format}` endpoint is the real workhorse; the other three routes are primarily discovery helpers for building valid queries.
- `jsonrecords` is the most convenient format for fireROUTE-style structured ingestion, while CSV/TSV/XLSX/Parquet are better suited to bulk export workflows.

## fireROUTE normalization notes
- Normalize this provider to four GET routes rooted at the Tesseract base URL.
- Preserve the format suffix on `data.{format}` as a first-class route variable rather than collapsing all formats into one hidden parameter.
- Keep cube-specific schema discovery explicit in adapters, because available drilldowns/measures/members depend on the selected cube.
