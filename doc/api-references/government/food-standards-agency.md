# Food Standards Agency

## Provider metadata
- Category: `Government`
- Provider slug: `food-standards-agency`
- Official docs/pages used:
  - `https://www.food.gov.uk/uk-food-hygiene-rating-data-api` (official landing page for the Food Hygiene Rating Scheme data API)
  - `https://api.ratings.food.gov.uk/help` (official FHRS API v2 help home)
  - `https://api.ratings.food.gov.uk/help/index` (official endpoint index)
  - `https://api.ratings.food.gov.uk/help/faqs` (official throttling / error guidance)
  - `https://api.ratings.food.gov.uk/help/bestpractices` (official paging and bulk-download guidance)
  - `https://api.ratings.food.gov.uk/Help/Api/GET-Establishments_name_address_longitude_latitude_maxDistanceLimit_businessTypeId_schemeTypeKey_ratingKey_ratingOperatorKey_localAuthorityId_countryId_sortOptionKey_pageNumber_pageSize` (official parameter and response-schema detail for the main establishments search route)
- Current public API base URL: `https://api.ratings.food.gov.uk`
- Auth model: no registration, login, or API key is required; callers must send header `x-api-version: 2` to receive data
- Optional headers:
  - `x-api-version: 2` - required version selector for the current documented API
  - `Accept-Language: cy-GB` - optional Welsh-language response preference; English is the default
- Response formats: JSON (`application/json`, `text/json`) and XML (`application/xml`, `text/xml`)
- Rate-limit notes: official help does not publish exact quotas, but it explicitly documents absolute client-address throttling with `403`, resource/concurrency throttling with `429`, and additional rate limiting for page sizes greater than `200`
- Manually confirmed route count: `30`

## Access notes
- The reviewed official guidance is specifically for the Food Hygiene Rating Scheme API version 2.
- The public website page says the same food hygiene data is also published as nightly open-data files, and the help pages recommend those files for regular full-data downloads.
- The API is versioned by request header rather than URL path versioning.
- Lookup endpoints are intended to feed the main establishments search route.

## Canonical endpoints
### Countries
1. `GET /Countries/{pageNumber}/{pageSize}`
   - Return detailed country records with paging.
2. `GET /Countries/basic/{pageNumber}/{pageSize}`
   - Return basic country records with paging.
3. `GET /Countries/basic`
   - Return the full unbounded basic country list.
4. `GET /Countries`
   - Return the full unbounded detailed country list.
5. `GET /Countries/{id}`
   - Return one country by numeric identifier.

### Authorities
6. `GET /Authorities/{pageNumber}/{pageSize}`
7. `GET /Authorities/basic/{pageNumber}/{pageSize}`
8. `GET /Authorities/basic`
9. `GET /Authorities`
10. `GET /Authorities/{id}`

### Regions
11. `GET /Regions/{pageNumber}/{pageSize}`
12. `GET /Regions/basic/{pageNumber}/{pageSize}`
13. `GET /Regions/basic`
14. `GET /Regions`
15. `GET /Regions/{id}`

### Business types
16. `GET /BusinessTypes/{pageNumber}/{pageSize}`
17. `GET /BusinessTypes/basic/{pageNumber}/{pageSize}`
18. `GET /BusinessTypes/basic`
19. `GET /BusinessTypes`
20. `GET /BusinessTypes/{id}`

### Establishments
21. `GET /Establishments/basic/{pageNumber}/{pageSize}`
   - Return basic establishment records with paging.
22. `GET /Establishments/basic`
   - Return the unbounded basic establishment list.
23. `GET /Establishments/list?id[0]={id[0]}&id[1]={id[1]}`
   - Return an establishment list selected by explicit IDs.
24. `GET /Establishments/{id}`
   - Return one establishment in detail.
25. `GET /Establishments?name={name}&address={address}&longitude={longitude}&latitude={latitude}&maxDistanceLimit={maxDistanceLimit}&businessTypeId={businessTypeId}&schemeTypeKey={schemeTypeKey}&ratingKey={ratingKey}&ratingOperatorKey={ratingOperatorKey}&localAuthorityId={localAuthorityId}&countryId={countryId}&sortOptionKey={sortOptionKey}&pageNumber={pageNumber}&pageSize={pageSize}`
   - Main search endpoint for filtering and paging establishment results.

### Lookup helpers
26. `GET /SortOptions`
27. `GET /SchemeTypes`
28. `GET /ScoreDescriptors?establishmentId={establishmentId}`
29. `GET /Ratings`
30. `GET /RatingOperators`

## Parameters
### Common paging patterns
The official endpoint index repeatedly documents these paging shapes:
- `{pageNumber}` - page number to return
- `{pageSize}` - page size to return
- Official best-practice guidance recommends using `pageSize` `200` or less for bulk retrieval

### `GET /Establishments`
The detailed endpoint page documents these query parameters:
- `name` - terms to search within the business name
- `address` - terms to search within business address and postcode
- `longitude` - longitude of the centre point for a spatial query
- `latitude` - latitude of the centre point for a spatial query
- `maxDistanceLimit` - max search distance in miles from the spatial centre point; may be system-capped
- `businessTypeId` - filter by business type
- `schemeTypeKey` - filter by scheme; valid values are `FHRS` and `FHIS`
- `ratingKey` - filter by rating; official valid values are:
  - FHRS: `0`, `1`, `2`, `3`, `4`, `5`
  - FHIS: `Pass`, `ImprovementRequired`, `AwaitingPublication`, `AwatingInspection`, `Exempt`
- `ratingOperatorKey` - comparison operator for FHRS rating filters; valid values are `LessThanOrEqual`, `GreaterThanOrEqual`, `Equal`; default `Equal`
- `localAuthorityId` - filter by local authority
- `countryId` - filter by country
- `sortOptionKey` - sort field/direction; valid values are `Relevance`, `rating`, `desc_rating`, `alpha`, `desc_alpha`, `distance`
- `pageNumber` - page number to return
- `pageSize` - page size to return; official docs note that the maximum is system-capped and fewer results may be returned than requested

### `GET /Establishments/list`
- Repeated `id[]` query parameters, shown in the docs as `id[0]`, `id[1]`, etc.

### `GET /ScoreDescriptors`
- `establishmentId` - establishment identifier whose score descriptors should be returned

### Single-record lookup routes
- `{id}` on `/Countries/{id}`, `/Authorities/{id}`, `/Regions/{id}`, `/BusinessTypes/{id}`, and `/Establishments/{id}` selects one record by identifier

## Response notes
### Main search response
The detailed `/Establishments` endpoint page shows these top-level JSON/XML response structures:
- `establishments[]`
- `meta`
- `links[]`

Important documented `meta` fields include:
- `dataSource`
- `extractDate`
- `itemCount`
- `returncode`
- `totalCount`
- `totalPages`
- `pageSize`
- `pageNumber`

Documented establishment fields shown on the endpoint page include:
- `BusinessName`
- `AddressLine1` to `AddressLine4`
- `PostCode`
- `RatingValue`
- `RatingKey`
- `RatingDate`
- `BusinessType`
- `BusinessTypeID`
- `FHRSID`
- `LocalAuthorityBusinessID`
- `LocalAuthorityCode`
- `LocalAuthorityName`
- `LocalAuthorityWebSite`
- `LocalAuthorityEmailAddress`
- `SchemeType`
- `NewRatingPending`
- `Phone`
- `RightToReply`
- `Distance`
- `geocode.longitude`
- `geocode.latitude`
- `scores.Hygiene`
- `scores.Structural`
- `scores.ConfidenceInManagement`

### Format notes
- JSON and XML are both first-class response formats in the official help system.
- The public website page separately mentions downloadable open-data XML files grouped by local authority.

## Errors, throttling, and bulk-usage guidance
- Official FAQ guidance documents two separate traffic-management mechanisms:
  - `403` when a client address exceeds an absolute rate limit
  - `429` when requests are resource-intensive or concurrency/queue protections are triggered
- The exact throttling configuration is intentionally unpublished and may change.
- Official best-practice guidance says page sizes above `200` are subject to rate limiting and may trigger `429`.
- The best-practice page recommends:
  - using nightly open-data files for regular full-data downloads
  - applying client-side flow control/sleeps when calling the live API directly
  - scheduling bulk retrieval between `01:00` and `06:00`

## Usage notes
- Always include `x-api-version: 2`; the official help states that requests without a version header do not return data.
- Use lookup endpoints such as `/Authorities`, `/Countries`, `/Regions`, `/BusinessTypes`, `/Ratings`, `/RatingOperators`, `/SchemeTypes`, and `/SortOptions` to discover valid filter values before calling `/Establishments`.
- Welsh responses are available through `Accept-Language: cy-GB`; English is the default.
- For full refreshes, the FSA explicitly prefers open-data file downloads over paginating the live API.

## fireROUTE normalization notes
- Normalize this provider as a header-versioned REST API rooted at `https://api.ratings.food.gov.uk`.
- Preserve official title casing in route paths (`/Authorities`, `/Countries`, `/Establishments`, etc.).
- Treat `/Establishments` as the primary search route and the other families as lookup/support endpoints.
- Preserve the documented throttle-sensitive behavior around large page sizes; do not synthesize unlimited bulk pulls from the live API.
