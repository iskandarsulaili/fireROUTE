# Materials Platform for Data Science

## Provider metadata
- Category: `Science & Math`
- Provider slug: `materials-platform-for-data-science`
- Description: `Curated experimental and computed inorganic materials data from the PAULING FILE database`
- Official docs/pages used:
  - `https://mpds.io` (official product site)
  - `https://mpds.io/developer` (official MPDS API documentation page reviewed manually in-browser)
  - `https://developer.mpds.io/mpds.schema.json` (official JSON-schema link published from the docs page)
  - `https://api.mpds.io/v0/download/facet` (live official API endpoint checked without credentials during review; returned `403 Forbidden`)
- Public API base URL confirmed from the reviewed official pages: `https://api.mpds.io`
- Auth model: API key in a required `Key` request header, obtained from an MPDS account / subscription
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON by default; plain-text CIF output is also documented
- Rate limits: no numeric quota is published on the reviewed docs page, but the docs explicitly say HTTP `429` means the request rate should be decreased
- Manually confirmed route count: `1`

## API shape and behavior
- The official MPDS docs describe a single REST-alike download endpoint for machine-readable data export.
- The docs say all data downloads go through one endpoint and are shaped entirely by query parameters.
- The standard result unit is an MPDS entry, with response payloads returning arrays of entries plus pagination metadata.
- The docs also note that some data is openly available, but the same reviewed docs page still says the request header must always contain the `Key` string with a valid MPDS API key.
- A live no-key request to the official endpoint returned `403 Forbidden`, which matches the official auth description.

## Canonical endpoint
1. `GET /v0/download/facet`
   - Download MPDS entries that match a query object and optional data-type / pagination / format controls.

## Confirmed parameters
### Query parameters
- `q` - required - JSON-serialized object containing supported search criteria
- `phases` - optional - comma-separated `phase_id` values used to limit the search; the official docs say the count of phase IDs per request cannot exceed `1000`
- `dtype` - optional - data type selector
  - `1` or `MPDSDataTypes.PEER_REVIEWED`
  - `2` or `MPDSDataTypes.MACHINE_LEARNING`
  - `4` or `MPDSDataTypes.AB_INITIO`
  - `7` or `MPDSDataTypes.ALL`
  - default: `1`
- `pagesize` - optional - maximum hits per response; allowed values documented as `10`, `100`, `500`, or `1000`; default: `10`
- `page` - optional - zero-based page number; default: `0`
- `fmt` - optional - output format; documented values are `json` and `cif`; default: `json`

### Search-criteria notes for `q`
- The official docs say `q` may contain reasonable combinations of criteria from the documented MPDS data categories.
- The docs provide examples such as:
  - crystalline-structure style query with `elements`, `classes`, `sgs`, and `props`
  - physical-property style query with `elements`, `classes`, and `props`
- The docs explicitly say MPDS intentionally does not support querying by entry IDs in the public API.

## Authentication notes
- The official docs say: `The header must always contain the Key string with the valid MPDS API key`.
- Documented header example:
  - `Key: a_long_secret_string`
- The docs describe the API as subscription / SLA based and tell readers to contact MPDS to open an account.

## Response and error notes
### JSON success shape documented by MPDS
The docs say JSON responses contain these top-level properties:
- `out` - array of MPDS entries
- `npages` - total page count
- `page` - current page number
- `count` - total hit count
- `error` - should be `null` on success

The docs also show an empty-result response of the form:
- `error: null`
- `out: []`
- `npages: 0`
- `count: 0`
- `page: 0`

### Format note
- `fmt=json` returns structured JSON entries.
- `fmt=cif` returns concatenated CIF text and is meaningful for crystalline structures.

### Error/status notes from the official docs
- `200` - request understood correctly
- `400` - `Wrong parameters`
- `403` - `Forbidden`
- `429` - request rate should be decreased

### Schema notes
- The docs page links an official JSON schema at `https://developer.mpds.io/mpds.schema.json`.
- The reviewed page states that different entry kinds (`S`, `P`, `C`) have their own specific JSON properties.

## Important usage notes
- This provider is a single-endpoint API; routing behavior is controlled by parameters rather than multiple resource paths.
- Preserve zero-based pagination semantics for `page`.
- Preserve the exact `Key` header name.
- Preserve `fmt=json|cif` behavior rather than forcing JSON only.
- Do not model entry-ID lookup routes for fireROUTE; the official docs explicitly advise using the GUI, not the API, for particular entry IDs.

## fireROUTE normalization notes
- Normalize MPDS as a parameter-driven single-route GET provider.
- Preserve the upstream path `/v0/download/facet` exactly.
- Treat `q` as the primary payload-bearing control, even though it is sent in the query string.
- Surface `dtype`, `pagesize`, `page`, `fmt`, and `phases` as first-class optional controls in any adapter.
