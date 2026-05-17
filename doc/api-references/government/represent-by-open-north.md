# Represent by Open North

## Provider metadata
- Category: `Government`
- Provider slug: `represent-by-open-north`
- Official docs/pages used:
  - `https://represent.opennorth.ca/` (official product homepage)
  - `https://represent.opennorth.ca/api/` (official API reference)
- Current public API base URL: `https://represent.opennorth.ca`
- Auth model: no authentication requirement is documented on the official API reference
- Response format: JSON for all endpoints; geospatial boundary-shape routes default to GeoJSON and can also return `kml` or `wkt` via `format` query parameter
- Rate limits: `60 requests per minute` and `86,400 queries/day`; the docs warn that exceeding this may yield HTTP `503` errors
- Manually confirmed route count: `19`

## Access notes
- The official API reference says all endpoints output JSON and supports optional `format=apibrowser` for browsable HTML output plus `pretty=1` for indented JSON.
- The docs also support JSONP via a `callback` query parameter.
- Pagination defaults to 20 results per page and uses `limit`, `offset`, and `meta.next` / `meta.previous` links.
- The official docs strongly recommend latitude/longitude lookups over postal-code lookups for accuracy.

## Canonical endpoints
### Postal-code lookup
1. `GET /postcodes/{postal_code}/`
   - Find representatives and boundaries by postal code.
   - Supports limiting results to specific boundary sets with the `sets` query parameter.

### Boundary-set routes
2. `GET /boundary-sets/`
   - List boundary sets.
3. `GET /boundary-sets/{boundary_set_slug}/`
   - Retrieve one boundary set.

### Boundary routes
4. `GET /boundaries/`
   - List boundaries across all sets.
5. `GET /boundaries/{boundary_set_slug}/`
   - List boundaries from one boundary set.
6. `GET /boundaries/{boundary_set_slug}/{boundary_slug}/`
   - Retrieve one boundary.
7. `GET /boundaries/{boundary_set_slug}/simple_shape`
   - Retrieve simplified shapes for all boundaries in a set.
8. `GET /boundaries/{boundary_set_slug}/shape`
   - Retrieve original shapes for all boundaries in a set.
9. `GET /boundaries/{boundary_set_slug}/centroid`
   - Retrieve centroids for all boundaries in a set.
10. `GET /boundaries/{boundary_set_slug}/{boundary_slug}/simple_shape`
   - Retrieve one boundary's simplified shape.
11. `GET /boundaries/{boundary_set_slug}/{boundary_slug}/shape`
   - Retrieve one boundary's original shape.
12. `GET /boundaries/{boundary_set_slug}/{boundary_slug}/centroid`
   - Retrieve one boundary's centroid.

### Representative-set routes
13. `GET /representative-sets/`
   - List representative sets.
14. `GET /representative-sets/{representative_set_slug}/`
   - Retrieve one representative set.

### Representative routes
15. `GET /representatives/`
   - List representatives across all representative sets.
16. `GET /representatives/{representative_set_slug}/`
   - List representatives from one representative set.
17. `GET /boundaries/{boundary_set_slug}/{boundary_slug}/representatives/`
   - Retrieve representatives for a single boundary.

### Elections and candidates
18. `GET /elections/`
   - List elections.
19. `GET /candidates/`
   - List electoral candidates.

## Parameters
### Shared pagination and formatting parameters
The official docs document these cross-cutting query parameters:
- `limit` - page size; default pagination is 20 results per page
- `offset` - page offset
- `format=apibrowser` - render a browsable HTML representation of the JSON response
- `pretty=1` - indent raw JSON
- `callback` - enable JSONP

### Shared filtering model
- Endpoints support query-parameter filtering on fields documented per resource.
- Substring and match operators are appended as `__querytype` and may use:
  - `iexact`
  - `contains`
  - `icontains`
  - `startswith`
  - `istartswith`
  - `endswith`
  - `iendswith`
  - `isnull`
- The docs provide examples like `/representatives/?first_name=Rodney` and `/representatives/?last_name__istartswith=m`.

### `GET /postcodes/{postal_code}/`
- `postal_code` - required Canadian postal code in uppercase with no spaces
- `sets` - optional comma-separated boundary-set limiter, for example `federal-electoral-districts`

### Boundary-set routes
- `/boundary-sets/` supports filtering by fields such as `name` or `domain`; the docs give `/boundary-sets/?domain=Canada` as an example.

### Boundary routes
Documented query parameters/examples include:
- `sets` - comma-separated list of boundary sets for `/boundaries/`
- `name` - filter boundaries by name
- `external_id` - filter boundaries by machine identifier
- `contains` - latitude/longitude point lookup, for example `45.524,-73.596`
- `touches` - find boundaries that touch the referenced boundary
- `intersects` - find boundaries that intersect the referenced boundary
- `format` - for shape endpoints, `kml` or `wkt`; default geospatial output is GeoJSON

### Representative routes
Documented query parameters/examples include:
- `point` - latitude/longitude point lookup for representatives
- `districts` - comma-separated boundary references for multi-boundary representative lookup
- field filters on `name`, `first_name`, `last_name`, `gender`, `district_name`, `elected_office`, and `party_name`

### Elections and candidates
- The official docs say `/elections/` behaves like `/representative-sets/`.
- The official docs say `/candidates/` behaves like `/representatives/`.

## Response notes
### Pagination envelope
The official docs say paginated responses include:
- `meta.next`
- `meta.previous`
- `meta.total_count`

### Postal-code response notes
The API reference explicitly describes these result groups:
- `boundaries_centroid`
- `boundaries_concordance`
- `representatives_centroid`
- `representatives_concordance`
- `city`
- `province`
- `centroid`

### Boundary response notes
- `external_id` may appear as a machine identifier.
- `metadata` contains unmodified source-shapefile attributes and may be outdated or erroneous.
- `simple_shape` is the officially recommended shape endpoint because it simplifies geometry to tolerance `0.002`.

### Representative response notes
The official field table says only the bolded fields are present in all responses, and documents representative fields including:
- `name`
- `district_name`
- `elected_office`
- `source_url`
- `first_name`
- `last_name`
- `party_name`
- `email`
- `url`
- `photo_url`
- `personal_url`
- `district_id`
- `gender`
- `offices[]` with keys such as `postal`, `tel`, `fax`, and `type`
- `extra`

## Error and reliability notes
- The official docs do not publish a full HTTP error-code matrix.
- They do explicitly warn that exceeding the free quota may produce HTTP `503` responses.
- The official postal-code section warns that postal-code lookups can be inaccurate because postal codes may cross boundaries or change over time.

## Usage notes
- Prefer latitude/longitude queries on boundary and representative endpoints when correctness matters.
- Use `/boundary-sets/` and `/representative-sets/` first to discover valid slugs before calling the set-specific routes.
- For mapping use cases, prefer `simple_shape` unless you specifically need the original geometry.
- Elections and candidates are documented as behaving like the representative-set and representative resources respectively, so the same pagination/filtering conventions carry over.

## fireROUTE normalization notes
- Normalize this provider as a read-only civic-lookup API rooted at `https://represent.opennorth.ca`.
- Preserve trailing slashes on the documented resource paths, because the official examples consistently include them.
- Model postal-code and point-in-polygon lookups as parameterized queries on top of the list/detail routes rather than inventing extra synthetic endpoints.
