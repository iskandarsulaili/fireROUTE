# Rig Veda

Official pages manually reviewed:
- https://aninditabasu.github.io/indica/
- https://aninditabasu.github.io/indica/topics/api_rv.html
- https://aninditabasu.github.io/indica/topics/openapi_rv.html

## Overview
- Primary base URL documented in the reviewed reference page and OpenAPI sandbox: `https://indica-1hwj.onrender.com/rv/v2/meta`
- Supported method on all documented endpoints: `GET`
- Response format documented by the reference page and OpenAPI spec: JSON arrays of verse-metadata objects; the OpenAPI response description also says unmatched queries return a plain-text message instead of JSON
- Authentication: none documented in the reviewed official pages
- Rate-limit note from the reviewed official pages: no rate-limit policy was published
- Product scope described in the reviewed official pages: verse-by-verse Rig Veda metadata covering mandal, sukta, poetic meter, poet, poet category, addressee, and addressee category

Manual route count confirmed from the reviewed official docs: **9**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/book/{mandal}` | List all verse metadata rows in one mandal/book |
| GET | `/meter/{meter}` | Search verses by poetic meter |
| GET | `/poet/{sungby}` | Search verses by poet name |
| GET | `/poetcategory/{sungbycategory}` | List verses by poet category |
| GET | `/god/{sungfor}` | Search verses by addressed being/object |
| GET | `/god/{sungfor}/{mandal}` | Filter addressed being/object results to one mandal |
| GET | `/godbypoet/{sungfor}/{sungby}` | Filter by addressed being/object plus poet |
| GET | `/godcategory/{sungforcategory}` | List verses by addressed-being/object category |
| GET | `/godcategorybypoetcategory/{sungforcategory}/{sungbycategory}` | Combine addressed-being/object category with poet category |

## Confirmed parameters

### `GET /book/{mandal}`
- Required path parameter:
  - `mandal` — integer book number
- Valid values documented in both the reference page and OpenAPI spec: `1` through `10`

### `GET /meter/{meter}`
- Required path parameter:
  - `meter` — string poetic-meter search term
- The official docs say this search is partial-match and case-insensitive.

### `GET /poet/{sungby}`
- Required path parameter:
  - `sungby` — poet-name search term
- The official docs say this search is partial-match and case-insensitive.

### `GET /poetcategory/{sungbycategory}`
- Required path parameter:
  - `sungbycategory` — poet category string
- Categories documented in the official pages:
  - `animal`
  - `demon male`
  - `divine female`
  - `divine male`
  - `human female`
  - `human male`
- Note: the prose reference page labels the placeholder as `{poetcategory}`, while the OpenAPI sandbox/spec uses `{sungbycategory}`. The path shape is the same; only the placeholder name differs.

### `GET /god/{sungfor}`
- Required path parameter:
  - `sungfor` — addressed being/object search term
- The official docs say this search is partial-match and case-insensitive.

### `GET /god/{sungfor}/{mandal}`
- Required path parameters:
  - `sungfor` — addressed being/object search term
  - `mandal` — integer book number from `1` through `10`
- The official docs again describe `sungfor` matching as partial and case-insensitive.

### `GET /godbypoet/{sungfor}/{sungby}`
- Required path parameters:
  - `sungfor` — addressed being/object search term
  - `sungby` — poet-name search term
- The official docs describe both string parameters as partial-match and case-insensitive.

### `GET /godcategory/{sungforcategory}`
- Required path parameter:
  - `sungforcategory` — addressed-being/object category string
- Categories listed in the prose reference page:
  - `abstract`
  - `animal`
  - `demon male`
  - `divine female`
  - `divine human`
  - `divine male`
  - `human couple`
  - `human female`
  - `human male`
  - `human unborn`
  - `object`
  - `plant`
- Important docs inconsistency: the OpenAPI enum omits `abstract`, but the prose reference page includes it in the published category list.

### `GET /godcategorybypoetcategory/{sungforcategory}/{sungbycategory}`
- Required path parameters:
  - `sungforcategory` — addressed-being/object category
  - `sungbycategory` — poet category
- The prose reference page reuses the category lists from `godcategory` and `poetcategory`.
- Important docs inconsistency: the OpenAPI enum for `sungforcategory` again omits `abstract`, while the prose page includes it.

## Auth and rate limits
- The reviewed official pages do not document any API key, OAuth flow, bearer token, or account requirement.
- The example requests only send `accept: application/json`.
- No published rate-limit, quota, billing, or retry policy was found in the reviewed official pages.

## Pagination, errors, and response notes
- No pagination parameters or cursor/page mechanics are documented.
- The reference page and OpenAPI sandbox describe a single repeated response shape with these fields:
  - `mandal`
  - `sukta`
  - `meter`
  - `sungby`
  - `sungbycategory`
  - `sungfor`
  - `sungforcategory`
- The OpenAPI `200` response description says successful matches return JSON, while unmatched queries return a plain-text message from the API app.
- A live fetch of the official example-style route `GET https://indica-1hwj.onrender.com/rv/v2/meta/god/ganga` returned a JSON array with one object, matching the documented schema.

## Important usage notes
- The official docs position this API as hymn metadata, not full verse text.
- `sukta` is the chapter number within a mandal; the prose reference page includes a mandal-to-sukta count table and notes the highest sukta count reaches `191` in mandals 1 and 10.
- String-search routes are designed for substring matching rather than exact-match-only lookups.
- The provider now documents this API from the live Indica root and topic pages even though the older indexed `html/rv.html` page is gone.

## fireROUTE notes
- Treat the provider as manually documented from the current Indica root plus the live reference/OpenAPI pages, not from the stale `html/rv.html` path.
- Preserve substring/case-insensitive semantics in any caller guidance for `meter`, `sungby`, and `sungfor` searches.
- Record the official docs inconsistency around `abstract` in `sungforcategory`; callers may need to test that value against the live API rather than trusting only the OpenAPI enum.