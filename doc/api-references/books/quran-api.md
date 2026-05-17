# Quran-api

Official pages manually reviewed:
- https://github.com/fawazahmed0/quran-api#readme

## Overview
- Primary base URL pattern documented in the reviewed README: `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@{apiVersion}`
- Supported method on all documented endpoints: `GET`
- Response formats documented in the README: `/{endpoint}.json` and `/{endpoint}.min.json`
- Authentication: none documented in the reviewed README
- Rate-limit note from the reviewed README: `No Rate limits`
- Product scope described in the reviewed README: Quran text and translation delivery across 90+ languages and 440+ translations

Manual route count confirmed from the reviewed official README: **11**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/editions` | List all available editions |
| GET | `/editions/{editionName}` | Fetch a complete Quran edition/translation |
| GET | `/editions/{editionName}/{chapterNo}` | Fetch one chapter within an edition |
| GET | `/editions/{editionName}/{chapterNo}/{verseNo}` | Fetch one verse within an edition |
| GET | `/editions/{editionName}/juzs/{juzNo}` | Fetch one Juz within an edition |
| GET | `/editions/{editionName}/rukus/{rukuNo}` | Fetch one Ruku within an edition |
| GET | `/editions/{editionName}/pages/{pageNo}` | Fetch one page within an edition |
| GET | `/editions/{editionName}/manzils/{manzilNo}` | Fetch one Manzil within an edition |
| GET | `/editions/{editionName}/maqras/{maqraNo}` | Fetch one Maqra within an edition |
| GET | `/info` | Fetch Quran-wide structural metadata |
| GET | `/fonts` | List Arabic fonts published by the project |

## Confirmed parameters

### Global URL behavior
- The reviewed README documents the versioned CDN root as `@{apiVersion}` and shows version `1` in all examples.
- Every documented endpoint is available in two suffix forms:
  - `.json`
  - `.min.json`
- The reviewed README explicitly recommends implementing a fallback between the two suffix variants.

### `GET /editions`
- No path parameters.
- Returns the edition catalogue in either `.json` or `.min.json` form.

### `GET /editions/{editionName}`
- Required path parameter:
  - `editionName`: translation/edition identifier such as `ben-muhiuddinkhan`
- The reviewed README also documents transliteration variants by suffixing the edition identifier:
  - `-la` for Latin/Roman script
  - `-lad` for Latin/Roman script with diacritical marks

### `GET /editions/{editionName}/{chapterNo}`
- Required path parameters:
  - `editionName`
  - `chapterNo`
- The reviewed README example uses chapter `5`.

### `GET /editions/{editionName}/{chapterNo}/{verseNo}`
- Required path parameters:
  - `editionName`
  - `chapterNo`
  - `verseNo`
- The reviewed README example uses chapter `5`, verse `10`.

### Grouping routes under an edition
These documented routes all use one edition identifier plus one group number:
- `GET /editions/{editionName}/juzs/{juzNo}`
- `GET /editions/{editionName}/rukus/{rukuNo}`
- `GET /editions/{editionName}/pages/{pageNo}`
- `GET /editions/{editionName}/manzils/{manzilNo}`
- `GET /editions/{editionName}/maqras/{maqraNo}`

Required path parameters vary by route and include:
- `editionName`
- one of `juzNo`, `rukuNo`, `pageNo`, `manzilNo`, or `maqraNo`

### `GET /info`
- No parameters documented in the reviewed README.
- The reviewed README describes this route as metadata for Juzs, Sajdas, Rukus, and other Quran structure counts.

### `GET /fonts`
- No parameters documented in the reviewed README.
- The reviewed README describes this route as the list of Arabic fonts available for rendering the text.

## Auth and rate limits
- The reviewed README does not document any auth headers, API keys, or account registration requirement.
- The reviewed README explicitly says there are no rate limits.
- No pagination quota or billing notes are published in the reviewed README.

## Pagination, errors, and response notes
- The reviewed README documents only `GET` access to static JSON resources served through jsDelivr.
- The reviewed README does not publish a formal error-status table.
- No page-number, cursor, or token pagination mechanism is documented.
- Response shape varies by endpoint family: catalogue/metadata lists, whole-edition payloads, chapter payloads, verse payloads, and font metadata are all documented separately.

## Important usage notes
- The reviewed README says the project exposes 98 language translations and 440+ total translations.
- The reviewed README recommends Arabic fonts from the `/fonts` inventory for Quran text rendering.
- The reviewed README warns that some translations were OCR-derived and may contain mistakes.
- The reviewed README's transliteration suffixes (`-la` and `-lad`) materially change the returned script for an edition.
- Because the project is CDN-backed static content, fireROUTE should treat the versioned base path as part of provider configuration rather than hard-coding only one release.

## fireROUTE notes
- Keep the base URL version configurable and default it to the reviewed README's published v1 pattern.
- Treat `.json` and `.min.json` as representation variants of the same logical route, not separate fireROUTE operations.
- Preserve the edition-first path structure because most useful routes are keyed by edition identifier before section number.
- Expose transliteration suffix handling as a caller-controlled edition choice rather than a separate canonical parameter.