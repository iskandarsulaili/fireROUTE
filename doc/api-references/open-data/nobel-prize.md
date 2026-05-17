# Nobel Prize

## Provider metadata
- Category: `Open Data`
- Provider slug: `nobel-prize`
- Official docs/pages used:
  - `https://www.nobelprize.org/about/developer-zone-2/`
  - `https://app.swaggerhub.com/apis/NobelMedia/NobelMasterData/2.1` (linked from the official developer-zone page as the OpenAPI documentation for API version 2.1)
- Current public API version reviewed: `2.1`
- Current public API base URL: `https://api.nobelprize.org/2.1`
- Auth model: no API key or registration is required for the reviewed public API version; the official developer-zone page explicitly says there is no need to register for an API key
- Response formats: the official developer-zone page says API version 2 returns `JSON` or `CSV`
- Versioning notes:
  - current version stated on the official page: `2.1`
  - latest compatible major alias can also be accessed using only `2`
  - breaking structure/name changes are reserved for new versions
- Rate-limit notes: no numeric public rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `4`

## Canonical endpoints
1. `GET /laureates`
   - List/search endpoint sorted around Nobel Laureates.
   - The official page says this endpoint returns all information about Laureates and Nobel Prizes.
2. `GET /laureate/{laureateID}`
   - Single-laureate lookup by laureate identifier.
3. `GET /nobelPrizes`
   - List/search endpoint sorted around Nobel Prizes.
   - The official page says this endpoint can return a shorter prize-oriented result and links to laureate resources when full laureate detail is needed.
4. `GET /nobelPrize/{category}/{year}`
   - Single-prize lookup by Nobel category and award year.

## Confirmed parameters
### Path parameters
- `laureateID` - laureate identifier used by `GET /laureate/{laureateID}`
- `category` - Nobel Prize category used by `GET /nobelPrize/{category}/{year}`
- `year` - prize year used by `GET /nobelPrize/{category}/{year}`

### Query/interface notes confirmed from the official docs
- The official developer-zone page describes version 2 as a REST API that provides different ways to `list` and `search` the data.
- The full query-parameter catalog is exposed in the linked interactive OpenAPI 2.1 documentation.
- Within the allowed manual workflow here, the route inventory and path parameters above were directly confirmable from the official developer-zone page and the linked SwaggerHub route list.

## Response and data notes
- Version 2 responses are documented as `JSON` or `CSV`.
- The official page says the data is updated as Nobelprize.org itself is updated, including at the time of announcements of new laureates.
- The `nobelPrizes` endpoint is documented as the prize-oriented view; the `laureates` endpoint is documented as the laureate-oriented view with fuller laureate/prize linkage.

## Usage notes
- This is a small read-only public REST API centered on two top-level collections plus two item lookups.
- The provider’s official versioning policy is stable within a version: new data, parameters, and languages may be added, but response structure and parameter names are not changed within the same version line.
- NobelPrize.org also publishes linked-data/SPARQL resources separately; those are not counted in the REST route total above.

## fireROUTE normalization notes
- Use `https://api.nobelprize.org/2.1` as the canonical REST base for current integration work.
- Model this provider as four public GET routes.
- Preserve the official split between laureate-oriented and prize-oriented resources rather than flattening them into one generic search route.
- Treat JSON as the default integration format unless CSV export is explicitly requested.