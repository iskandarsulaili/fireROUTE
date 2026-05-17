# Open Government, India

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-india`
- Official docs/pages used:
  - `https://www.data.gov.in/`
  - `https://www.data.gov.in/apis`
  - `https://www.data.gov.in/help`
  - `https://www.data.gov.in/resource/monthly-crude-oil-processed-refineries`
  - `https://api.data.gov.in/resource/8d3b6596-b09e-4077-aebf-425193185a5b?api-key=579b464db66ec23bdd000001cdc3b564546246a772a26393094f5645&offset=0&limit=1&format=json`
  - `https://api.data.gov.in/resource/8d3b6596-b09e-4077-aebf-425193185a5b?api-key=579b464db66ec23bdd000001cdc3b564546246a772a26393094f5645&offset=0&limit=1&format=xml`
  - `https://api.data.gov.in/resource/8d3b6596-b09e-4077-aebf-425193185a5b?offset=0&limit=1&format=json`
  - `https://api.data.gov.in/resource/8d3b6596-b09e-4077-aebf-425193185a5b?api-key=bad&offset=0&limit=1&format=json`
- Current documented API host: `https://api.data.gov.in`
- Current documented API path pattern: `/resource/{resource_uuid}`
- Auth model: API key required in the `api-key` query parameter
- Response formats confirmed from reviewed official pages and live responses: `json`, `xml`, `csv`
- Manually confirmed route count: `1`

## Official usage notes
- The portal homepage says the platform exposes `236,687` APIs and dataset resources for direct access with an API key.
- The reviewed resource page exposes an `API` tab with a `Generate API Key` control, which matches the index-level `apiKey` auth label.
- The same resource page embeds a concrete official example URL pointing to `https://api.data.gov.in/resource/{resource_uuid}` with `api-key`, `offset`, `limit`, and `format` query parameters.
- The reviewed public help page mentions a `How to use Datasets APIs` help item, but the reviewed public pages did not publish a broader route-by-route API manual beyond the per-resource endpoint pattern above.

## Canonical endpoint confirmed from the official site
1. `GET /resource/{resource_uuid}`
   - Base URL: `https://api.data.gov.in`
   - Purpose: return one published resource as a machine-readable dataset payload together with resource metadata and records.
   - Path parameters:
     - `resource_uuid` - required dataset/resource UUID published on the corresponding `data.gov.in/resource/{slug}` page
   - Query parameters explicitly confirmed on reviewed official pages or live official responses:
     - `api-key` - required API key query parameter
     - `offset` - optional row offset
     - `limit` - optional row limit; the official embedded CSV example uses `limit=all`
     - `format` - optional output format; confirmed values on reviewed pages/responses: `json`, `xml`, `csv`
   - Live response shape confirmed with `format=json`:
     - top-level metadata fields such as `index_name`, `title`, `desc`, `created_date`, `updated_date`, `org`, `sector`, `field`, `status`, `total`, `count`, `limit`, `offset`, and `records`
   - Live response shape confirmed with `format=xml`:
     - XML document rooted at `<result>` with repeated `<item>` elements for arrays such as `org`, `sector`, `field`, and `records`

## Parameters, pagination, and format notes
- The reviewed public pages explicitly exposed `offset` and `limit` as the pagination controls for this endpoint.
- The reviewed embedded official example URL uses `limit=all` for CSV export, so the provider clearly supports full-export style retrieval at least for reviewed CSV resources.
- JSON responses include both dataset metadata and the returned `records` array in one payload.
- XML responses serialize the same logical content into XML elements and repeated `<item>` children.
- CSV support was confirmed from the official resource-page example URL, which points to the same `/resource/{resource_uuid}` route with `format=csv`.
- The reviewed public pages did not publish a broader provider-wide list of additional generic query operators such as sorting or field-level filtering, so they are left unconfirmed here.

## Auth, errors, and rate-limit notes
- Auth is query-string based rather than header based on all reviewed official examples.
- A live request without `api-key` returned the JSON error body `{"error": "Authorization field missing"}`.
- A live request with an invalid key returned the JSON error body `{"error": "Key not authorised"}`.
- The reviewed public pages did not publish numeric rate-limit or quota details.
- The reviewed responses did not expose a richer structured error envelope beyond the simple `error` message strings above.

## fireROUTE normalization notes
- Treat `https://api.data.gov.in` as the canonical API host.
- Normalize the provider around the single documented per-resource route pattern `/resource/{resource_uuid}` rather than around the human-facing listing pages on `www.data.gov.in`.
- Keep auth in the query string as `api-key`; the reviewed official pages did not show a header-based alternative.
- Preserve the output-format distinction via the `format` query parameter, because the same canonical route serves JSON, XML, and CSV representations.