# Postali

## Provider metadata
- Category: `Geocoding`
- Provider slug: `postali`
- Official docs used manually:
  - `https://postali.app/api`
  - `https://postali.app/api/docs`
- Public base URL documented by provider: `https://postali.app`
- Transport: `HTTPS`
- Auth model: none; the docs explicitly say there are no API keys, tokens, headers, or registration requirements
- Response formats documented: `JSON UTF-8` with `Content-Type: application/json; charset=utf-8`

## Product and access notes
- The official reference page says the entire `v1` contract is published on a single page.
- Versioning rule from the docs: all routes live under `/api/v1/`, fields may be added inside `v1` but not removed or type-changed, and a future `v2` would coexist for at least `12` months.
- Country routing rule from the docs: each route lives under a country prefix such as `/api/v1/mx/`, `/api/v1/co/`, or `/api/v1/es/`; omitting the country is equivalent to `mx`.
- Cache rule from the docs: deterministic lookups (`cp`, `validate`, `estados`, `municipio`) are served with `Cache-Control: public, max-age=86400, s-maxage=604800`; `/search` and `/bulk` are `no-store`.
- CORS rule from the docs: requests are allowed from any origin.

## Confirmed API surface
The inspected official docs confirm these `8` endpoints:
1. `GET /api/v1/{país}/cp/{codigo}`
2. `GET /api/v1/{país}/validate/{codigo}`
3. `GET /api/v1/{país}/search`
4. `GET /api/v1/{país}/estados`
5. `GET /api/v1/{país}/estado/{slug}`
6. `GET /api/v1/{país}/estado/{slug}/municipios`
7. `GET /api/v1/{país}/municipio/{estado}/{municipio}`
8. `POST /api/v1/{país}/bulk`

## 1) Postal-code lookup
- Method: `GET`
- Path: `/api/v1/{país}/cp/{codigo}`
- Example shown by docs: `https://postali.app/api/v1/mx/cp/06700`
- Purpose: return state, municipality, and all settlements attached to one postal code

Documented path parameter:
- `codigo` - required postal code string in the format of the selected country; docs examples are `06700` (MX), `050001` (CO), `28001` (ES)

Documented response notes:
- returns fields such as `cp`, `estado`, `estado_slug`, `municipio`, `municipio_slug`, and `asentamientos`
- docs explicitly note `ciudad` may be `null`
- docs say `zona` is either `Urbano` or `Rural`

Documented endpoint-specific errors:
- `400 invalid_cp`
- `404 not_found`

## 2) Postal-code validation
- Method: `GET`
- Path: `/api/v1/{país}/validate/{codigo}`
- Example shown by docs: `https://postali.app/api/v1/mx/validate/06700`
- Purpose: lightweight checkout-style validation that only confirms whether a postal code exists and how many settlements it covers

Documented response fields:
- `cp`
- `valid`
- `asentamientos`

Documented endpoint-specific error:
- `400 invalid_cp`

## 3) Search
- Method: `GET`
- Path: `/api/v1/{país}/search`
- Example shown by docs: `https://postali.app/api/v1/mx/search?q=roma&limit=5`
- Purpose: fuzzy search over settlement names, municipalities, and postal codes for UI autocomplete/search

Documented query parameters:
- `q` - required search term; docs say maximum `100` characters
- `limit` - optional integer; default `10`, maximum `50`

Documented response notes:
- response includes `query` and a `results` array
- result examples include `cp`, `nombre`, `tipo`, `municipio`, `estado`, `estado_slug`, `municipio_slug`, and `asenta_slug`

Documented endpoint-specific error:
- `400 invalid_query` - empty `q` or `q` longer than `100` characters

## 4) State list
- Method: `GET`
- Path: `/api/v1/{país}/estados`
- Example shown by docs: `https://postali.app/api/v1/mx/estados`
- Purpose: list first-level administrative areas with precomputed totals

Documented response notes:
- returns `total` plus an `estados` array
- example state rows include `nombre`, `slug`, `total_asentamientos`, and `total_municipios`

## 5) State detail
- Method: `GET`
- Path: `/api/v1/{país}/estado/{slug}`
- Example shown by docs: `https://postali.app/api/v1/mx/estado/jalisco`
- Purpose: return one state's totals and slugged identity

Documented path parameter:
- `slug` - required state slug

Documented response fields:
- `nombre`
- `slug`
- `total_asentamientos`
- `total_municipios`

Documented endpoint-specific error:
- `404 not_found`

## 6) Municipalities within a state
- Method: `GET`
- Path: `/api/v1/{país}/estado/{slug}/municipios`
- Example shown by docs: `https://postali.app/api/v1/mx/estado/jalisco/municipios`
- Purpose: list municipalities for one state, ordered by name, with settlement totals

Documented path parameter:
- `slug` - required state slug

Documented response notes:
- returns `estado`, `estado_slug`, `total`, and a `municipios` array
- municipality rows include `nombre`, `slug`, and `total_asentamientos`

Documented endpoint-specific error:
- `404 not_found`

## 7) Municipality settlements
- Method: `GET`
- Path: `/api/v1/{país}/municipio/{estado}/{municipio}`
- Example shown by docs: `https://postali.app/api/v1/mx/municipio/jalisco/guadalajara`
- Purpose: list settlements for one municipality

Documented path parameters:
- `estado` - required state slug
- `municipio` - required municipality slug

Documented response notes:
- returns `estado`, `estado_slug`, `municipio`, `municipio_slug`, `total_asentamientos`, `truncated`, and `colonias`
- docs explicitly warn that if a municipality has more than `1000` settlements, the response is truncated and callers should inspect `truncated`

Documented endpoint-specific error:
- `404 not_found`

## 8) Bulk lookup
- Method: `POST`
- Path: `/api/v1/{país}/bulk`
- Example shown by docs: `POST https://postali.app/api/v1/mx/bulk`
- Purpose: validate/lookup multiple postal codes in one request

Documented request body:
- JSON object with `cps: ["06700", "44100", "00000"]`

Documented body rules:
- `cps` is required
- `cps` must contain between `1` and `100` items
- every item must be a string in the postal-code format of the selected country

Documented response notes:
- returns `total` and a `results` array
- invalid or nonexistent postal codes do not abort the batch; they return `valid: false` with null administrative fields and `asentamientos: 0`

Documented endpoint-specific errors:
- `400 invalid_query` - empty `cps` or more than `100` items
- `400 invalid_cp` - at least one supplied postal code does not respect the country's format

## Errors, rate limits, pagination, and format notes
- The docs publish a shared JSON error envelope:
  - `error.code`
  - `error.message`
  - `error.docs_url`
- The official shared error table lists:
  - `400 invalid_cp` - bad postal-code format for the selected country
  - `400 invalid_query` - missing/invalid query or body parameter
  - `404 not_found` - missing postal code, state, or municipality
  - `429 rate_limited` - Cloudflare blocked the client IP for too many requests per minute
  - `500 internal_error` - server error
- The official `FAIR USE` section says there is no monthly quota and no paid plan at this time.
- The same section says the only protection is an IP-based Cloudflare rate limit on `/search` and `/bulk`.
- The docs tell clients that if they receive `429`, they should retry with exponential backoff starting at `200 ms`.
- The docs do not describe cursor/page-number pagination for any inspected endpoint.

## Canonical fireROUTE notes
- Preserve Postali's country-prefix routing model exactly; omitting the country prefix is documented as equivalent to `mx`.
- Keep `/validate` distinct from `/cp`: the docs position it as a minimal checkout-style existence check rather than a full settlement lookup.
- Keep `/bulk` distinct from repeated `/validate` calls; the docs explicitly position it as the supported list-processing path and cap it at `100` postal codes.
- Preserve the `truncated` flag on municipality results because the docs explicitly say large municipalities may be clipped.

## Verification notes
- This file was manually rebuilt from the live official Postali API landing page and single-page reference using browser tools only.
