# GurbaniNow

Official pages manually reviewed:
- https://github.com/gurbaninow
- https://github.com/gurbaninow/api-public
- https://github.com/gurbaninow/api-public/wiki/API-Documentation
- https://gurbaninow.com/
- https://api.gurbaninow.com/v2

## Overview
- Primary production base URL documented in the official wiki and confirmed live: `https://api.gurbaninow.com/v2`
- Additional live API root confirmed from the archived source and live host: `https://api.gurbaninow.com/`
- Supported method on the confirmed public surface: `GET`
- Primary response format confirmed from live requests: JSON with `content-type: application/json; charset=utf-8`
- Authentication: none documented in the official wiki and none required by the confirmed live `v2` requests reviewed here
- Rate-limit note: no rate-limit policy was documented in the reviewed wiki/repository, and the reviewed live responses did not expose rate-limit headers
- Product scope described by the official org/site: Gurbani, shabad, bani, line, source, writer, page, and hukamnama retrieval for Sikh scripture search and study
- Official repository status note: the `api-public` repository is archived and marked deprecated, but the documented `https://api.gurbaninow.com/v2` production API still responded during this review

Manual route count confirmed from the reviewed official wiki, archived official source, and live production responses: **15**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v2` | Return the API v2 name/version root payload |
| GET | `/v2/meta/sources` | List scripture sources and their sections |
| GET | `/v2/meta/writers` | List writers |
| GET | `/v2/search/{query}` | Search Gurbani text with filters |
| GET | `/v2/shabad/random` | Redirect to a random shabad resource |
| GET | `/v2/shabad/{shabadId}` | Fetch one shabad by ID |
| GET | `/v2/banis` | List all banis |
| GET | `/v2/banis/{baniId}` | Fetch one bani and its lines |
| GET | `/v2/hukamnama` | Redirect to today's hukamnama |
| GET | `/v2/hukamnama/today` | Fetch today's hukamnama |
| GET | `/v2/hukamnama/{year}/{month}/{day}` | Fetch archived hukamnama for a specific date |
| GET | `/v2/ang/{page}` | Fetch a page/ang for the default or selected source |
| GET | `/v2/ang/{page}/{sourceId}` | Deprecated source-selection alias that redirects to the query-parameter form |
| GET | `/v2/line/{lineId}` | Fetch one line by ID |
| GET | `/v2/convert/{type}/{text}` | Convert GurbaniAkhar and Unicode text |

## Confirmed parameters

### `GET /v2`
- No parameters.
- Live response reviewed here returned JSON like:
  - `name`
  - `version`

### `GET /v2/meta/sources`
- No parameters.
- Returns a JSON array of sources with fields including:
  - `id`
  - `akhar`
  - `unicode`
  - `english`
  - `length`
  - `pageName`
  - `sections`

### `GET /v2/meta/writers`
- No parameters.
- Returns writer metadata including `id`, `akhar`, `unicode`, and `english`.

### `GET /v2/search/{query}`
Required path parameter:
- `query`: search text; the official wiki says URL encoding is recommended

Optional query parameters documented in the official wiki and supported by the archived source:
- `searchtype`: search mode
  - `0` = first letter start (Gurmukhi, default)
  - `1` = first letter anywhere (Gurmukhi)
  - `2` = full word/line (Gurmukhi)
  - `4` = search all words (Gurmukhi)
  - `6` = search any words (Gurmukhi)
- `source`: source ID from `/v2/meta/sources`
- `writer`: writer ID from `/v2/meta/writers`
- `raag`: subsection/section ID
- `ang`: page number filter
- `results`: result count, default `20`, maximum `100`
- `skip`: offset for paginating through search results, default `0`

Important search notes from the official wiki/source:
- The official wiki says GurbaniAkhar and Unicode can be used with search types `0` and `1`.
- The official wiki says search type `2` only supports GurbaniAkhar.
- The archived source rejects unsupported English translation search types `3`, `5`, and `7` with an error.

### `GET /v2/shabad/random`
- No parameters.
- Confirmed live behavior: redirects to `/v2/shabad/{shabadId}`.

### `GET /v2/shabad/{shabadId}`
Required path parameter:
- `shabadId`: shabad identifier such as `02L`

Confirmed response sections from the archived source/live response pattern:
- `shabadinfo`
- `shabad`

### `GET /v2/banis`
- No parameters.
- Returns a JSON list of bani IDs and names.

### `GET /v2/banis/{baniId}`
Required path parameter:
- `baniId`: bani identifier such as `1`

Confirmed response sections from the archived source:
- `baniinfo`
- `bani`

### `GET /v2/hukamnama`
- No parameters.
- Confirmed live behavior: redirects to `/v2/hukamnama/today`.

### `GET /v2/hukamnama/today`
- No parameters.
- Returns today's hukamnama with Gregorian and Nanakshahi date metadata plus hukamnama lines.

### `GET /v2/hukamnama/{year}/{month}/{day}`
Required path parameters:
- `year`
- `month`
- `day`

Important archive note from the official wiki/source:
- Hukamnama archives only go back to year `2002`.

### `GET /v2/ang/{page}`
Required path parameter:
- `page`: page/ang number

Optional query parameter:
- `source`: source ID; the official wiki says the default is `1` for Sri Guru Granth Sahib Ji

Confirmed response sections from the archived source:
- `pageno`
- `source`
- `count`
- `page`

### `GET /v2/ang/{page}/{sourceId}`
Required path parameters:
- `page`
- `sourceId`

Important behavior confirmed from the archived source and a live request:
- This is a deprecated redirect route.
- Legacy source letters are remapped as follows:
  - `G` -> `1`
  - `D` -> `2`
  - `B` -> `3`
  - `N` -> `7`
  - `A` -> `11`
  - `U` -> `11`
- Other values redirect to `/v2/ang/{page}?source={sourceId}`.

### `GET /v2/line/{lineId}`
Required path parameter:
- `lineId`: line identifier such as `YLSG`

Confirmed response section from the archived source:
- `line`

### `GET /v2/convert/{type}/{text}`
Required path parameters:
- `type`:
  - `unicode` = GurbaniAkhar to Unicode
  - `akhar` = Unicode to GurbaniAkhar
- `text`: text to convert; the official wiki says URL encoding is recommended

Important note from the official wiki:
- This endpoint is explicitly marked deprecated; the wiki recommends the `gurmukhi-utils` npm module instead.

## Auth and rate limits
- No API key, bearer token, OAuth flow, or session login was documented in the reviewed official wiki/repository.
- The live `v2` requests reviewed here succeeded without authentication.
- No official rate-limit quota, burst limit, or billing policy was published in the reviewed official pages.
- The reviewed live responses did not expose rate-limit headers.

## Pagination, errors, and response notes
- The API is JSON-first on the reviewed public surface.
- Search pagination is parameter-based rather than cursor-based:
  - `results` controls page size
  - `skip` controls the offset
- Non-search endpoints reviewed here do not document cursor, token, or Link-header pagination.
- Live invalid-input tests returned JSON error payloads shaped like:
  - `error.code`
  - `error.status_code`
  - `error.message`
- Confirmed live error examples during this review:
  - invalid `searchtype` returned HTTP `500` with message `A invalid searchtype was given: 99`
  - `results=101` returned HTTP `500` with message `A invalid results number was given: 101`
- The archived source also documents additional runtime errors for unsupported translation search and unavailable hukamnama dates.
- Core content payloads are richly nested and commonly include source, writer, raag/section, translation, transliteration, line numbering, and first-letter metadata.

## Important usage notes
- The official org describes GurbaniNow as a search engine for Sikh spiritual scriptures.
- The official wiki documents `https://api.gurbaninow.com/v2` as the current production API base.
- Live review confirmed that `/v2/shabad/random`, `/v2/hukamnama`, and `/v2/ang/{page}/{sourceId}` are redirecting convenience or legacy routes rather than distinct payload shapes.
- The archived source shows that random shabad selection is limited to source `1` (Sri Guru Granth Sahib Ji).
- The archived source enriches returned content with multiple translations and transliterations, including English, Punjabi, Spanish, and Devanagari transliteration fields where data exists.
- The official repository README explicitly says the API is deprecated and no support will be provided.
- The live root `https://api.gurbaninow.com/` still advertises docs at the archived repository, but the v1 surface should not be treated as stable: a reviewed live `v1` search request returned HTTP `500`, so fireROUTE should focus on the documented `v2` surface.

## fireROUTE notes
- Use `https://api.gurbaninow.com/v2` as the default base URL.
- Treat the redirecting routes as real GET operations for compatibility, but normalize their final resource forms in downstream examples where possible.
- Expose `searchtype`, `source`, `writer`, `raag`, `ang`, `results`, and `skip` as search parameters.
- Clamp `results` to `100` client-side to avoid a known server error.
- Prefer `/v2/ang/{page}?source={id}` over the deprecated path-style `/v2/ang/{page}/{sourceId}` alias.
- Mark `/v2/convert/{type}/{text}` as deprecated in any generated consumer-facing reference.
- Do not route new integrations to `v1`; the current live behavior did not validate it as production-safe during this review.
