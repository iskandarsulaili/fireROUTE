# Quran Cloud

Official pages manually reviewed:
- https://alquran.cloud/api

## Overview
- Primary base URL documented on the reviewed page: `https://api.alquran.cloud`
- Additional official base domains documented on the same page:
  - `https://alquran.api.islamic.network`
  - `https://alquran.api.alislam.ru`
- Supported method on all documented endpoints: `GET`
- Response format: JSON
- Authentication: none documented on the reviewed page
- Compression note from the reviewed page: all endpoints support `Accept-Encoding: gzip` or `zstd`

Manual route count confirmed from the reviewed official docs: **14**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/edition` | List available text and audio editions |
| GET | `/v1/quran/{edition}` | Fetch a complete Quran edition |
| GET | `/v1/juz/{juz}/{edition}` | Fetch one Juz |
| GET | `/v1/surah` | List all Surahs |
| GET | `/v1/surah/{surah}/{edition}` | Fetch one Surah in a specific edition |
| GET | `/v1/ayah/{reference}/{edition}` | Fetch one Ayah in one edition |
| GET | `/v1/ayah/{reference}/editions/{edition},{edition}` | Fetch one Ayah in multiple editions |
| GET | `/v1/search/{keyword}/{surah}/{editionOrLanguage}` | Search Quran text |
| GET | `/v1/manzil/{manzil}/{edition}` | Fetch one Manzil |
| GET | `/v1/ruku/{ruku}/{edition}` | Fetch one Ruku |
| GET | `/v1/page/{page}/{edition}` | Fetch one Quran page |
| GET | `/v1/hizbQuarter/{hizb}/{edition}` | Fetch one Hizb Quarter |
| GET | `/v1/sajda/{edition}` | Fetch all Sajda verses for an edition |
| GET | `/v1/meta` | Fetch Quran metadata for Surahs, Pages, Hizbs, and Juzs |

## Confirmed parameters

### General edition behavior
- The reviewed docs state that any endpoint requiring an edition identifier defaults to `quran-uthmani` if the edition is omitted.
- The reviewed page describes `edition` values as edition identifiers such as `en.asad` or `ar.alafasy`.

### `GET /v1/edition`
- Optional query parameters documented on the reviewed page:
  - `format`: `text` or `audio`
  - `language`: 2-digit language code such as `en` or `fr`
  - `type`: edition type such as `versebyverse` or `translation`

### `GET /v1/quran/{edition}`
- Path parameter: `edition`
- The reviewed page documents no additional query parameters for this route.

### Range/group routes with optional slicing
The reviewed docs publish the same optional partial-range controls for these endpoints:
- `GET /v1/juz/{juz}/{edition}`
- `GET /v1/manzil/{manzil}/{edition}`
- `GET /v1/ruku/{ruku}/{edition}`
- `GET /v1/page/{page}/{edition}`
- `GET /v1/hizbQuarter/{hizb}/{edition}`

Documented path parameters vary by route and include one group identifier plus `edition`.

Documented optional query parameters:
- `offset`: skip the first N ayahs within the selected group
- `limit`: cap the number of ayahs returned

### `GET /v1/surah`
- The reviewed page documents this route as the list of all Surahs in the Quran.
- No query parameters were documented on the reviewed page for the list route itself.

### `GET /v1/surah/{surah}/{edition}`
- Path parameters:
  - `surah`
  - `edition`
- No additional query parameters were documented on the reviewed page.

### `GET /v1/ayah/{reference}/{edition}`
- Path parameters:
  - `reference`: either the global ayah number or `surah:ayah` form such as `262` or `2:255`
  - `edition`
- The reviewed docs show that omitting `{edition}` returns the default Arabic text edition.

### `GET /v1/ayah/{reference}/editions/{edition},{edition}`
- Path parameters:
  - `reference`
  - comma-separated edition identifiers after `/editions/`
- The reviewed page documents this route for returning the same Ayah across multiple editions.

### `GET /v1/search/{keyword}/{surah}/{editionOrLanguage}`
- Path parameters:
  - `keyword`
  - `surah`: a Surah number from `1` to `114`, or `all`
  - `editionOrLanguage`: either an edition identifier such as `en.pickthall` or a 2-digit language code such as `en`
- The reviewed page explicitly says only text editions are searchable.

### `GET /v1/sajda/{edition}`
- Path parameter: `edition`
- No additional query parameters were documented on the reviewed page.

### `GET /v1/meta`
- No parameters were documented on the reviewed page.

## Auth and rate limits
- The reviewed page does not document any authentication requirement.
- The reviewed page does not publish numeric rate limits or quota headers.
- The only transport-level optimization explicitly documented is support for `Accept-Encoding: gzip` and `Accept-Encoding: zstd`.

## Pagination, errors, and response notes
- The API docs describe JSON responses across all documented endpoints.
- The reviewed page does not publish conventional page-number pagination.
- Instead, the Juz/Manzil/Ruku/Page/Hizb Quarter routes support partial slicing via `offset` and `limit`.
- The reviewed page did not publish a formal error-status table.
- The docs note that text and audio edition responses differ for `GET /v1/quran/{edition}`.

## Important usage notes
- The reviewed page documents these corpus sizes and structural notes:
  - `30` Juz
  - `114` Surahs
  - `7` Manzils
  - `556` Rukus
  - `604` Pages
  - `240` Hizb Quarters
  - `15` Sajda verses in this API
- The search route defaults to searching all English-language texts when no specific edition or language is provided in the final path segment.
- The Surah list route and the Meta route are useful bootstrap endpoints for building local lookup tables before requesting larger bodies of text.
- The reviewed docs include both text and audio editions under the same route family, so consumers should expect response-shape differences between those edition types.

## fireROUTE notes
- Keep the three documented base domains configurable, but default to `https://api.alquran.cloud`.
- Preserve path-style routing because the official API is heavily path-parameter driven rather than query-driven.
- Expose `offset` and `limit` passthrough on Juz/Manzil/Ruku/Page/Hizb Quarter requests.
- Treat edition resolution as a first-class concern because many routes depend on edition identifiers and silently fall back to `quran-uthmani` when omitted.