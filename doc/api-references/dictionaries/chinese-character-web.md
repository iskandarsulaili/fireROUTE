# Chinese Character Web

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `chinese-character-web`
- Docs used manually:
  - `http://ccdb.hemiola.com/`
- Confirmed API base URL: `http://ccdb.hemiola.com`
- Primary media type: JSON
- Request methods documented on the official page: `GET`, `POST` (`POST` is described as a synonym for `GET`)
- Authentication: none
- Manually confirmed routes in this pass: `25`

## Authentication
From the official homepage/API page:
- no authentication is required
- the service is read-only
- `PUT` and `DELETE` are not supported
- `POST` is documented only as a synonym for `GET`, not as a write method

## Common request/response conventions
- Base URL: `http://ccdb.hemiola.com`
- the official page says the API is "RESTlike" and uses JSON rather than SOAP or XML
- the official page explicitly says CORS is enabled
- filtering is applied with the `filter` query parameter
- field projection is applied with the `fields` query parameter
- `count` switches list-style routes from returning records to returning counts
- radical/stroke routes use `kRSKangXi` by default; adding the `kRSUnicode` parameter switches to Unicode radical/stroke data
- if `/characters` is requested without `fields`, the docs say the default returned field is `string`

## Filter syntax
- Basic filter names documented: `gb`, `big5`, `big5a`, `big5b`, `sjis`, `simplified`, `simplifiable`
- Special non-combinable filters documented: `simplified[]`, `simplifiable[]`
- Operators documented on the official page:
  - `+` = AND
  - `|` = OR
  - `!` = NOT
- the page notes normal precedence `NOT`, then `AND`, then `OR`
- example official compound filter: `gb+simplified|gb+simplifiable`

## Field and format notes
- Unihan-derived fields use their original `k...` names, such as `kDefinition`, `kMandarin`, `kRSKangXi`, and `kRSUnicode`
- extra documented fields added by the service: `uvalue`, `string`, `altMandarin`, `altDefinition`
- count / stroke summary payloads use JSON fields such as `radical`, `strokes`, and `count`

## Manually confirmed endpoint set

### Service metadata
1. `GET|POST /version`
   - returns service / Unicode / backend version information
2. `GET|POST /fields`
   - returns field names from the SQL schema

### Character lookup and search
3. `GET|POST /characters`
   - returns all characters
   - supports `filter`, `fields`, and `count`
4. `GET|POST /characters/mandarin/{value}`
   - search by Mandarin pronunciation
   - docs say pitch is optional, e.g. `peng` or `peng2`
5. `GET|POST /characters/cantonese/{value}`
   - search by Cantonese pronunciation
   - docs say pitch is optional, e.g. `paang` or `paang4`
6. `GET|POST /characters/japanese/{value}`
   - searches both `kJapaneseOn` and `kJapaneseKun`
7. `GET|POST /characters/definition/{value}`
   - case-insensitive grep-like search on `kDefinition`
8. `GET|POST /characters/strokes/{value}`
   - matches on `kTotalStrokes`
9. `GET|POST /characters/string/{value}`
   - looks up each UTF-8 character in the path
   - official warning: about `100ms` per character, so this route is prohibitively slow for long inputs

### Radical-oriented character routes
10. `GET|POST /characters/radicals`
   - returns all radical characters
11. `GET|POST /characters/radicals/singles`
   - returns at most one Kangxi radical per radical index with a variation count
12. `GET|POST /characters/radicals/usage`
   - returns counts of characters per radical
   - optional params: `sort-by-count`, `reverse`
13. `GET|POST /characters/radicals/unused`
   - returns Kangxi radicals not found among the resultant characters
14. `GET|POST /characters/radicals/mismatches`
   - returns characters where `kRSKangXi` and `kRSUnicode` disagree
15. `GET|POST /characters/radicals/{radical}`
   - returns characters using Kangxi radical `1..214`
   - supports `filter`, `fields`, and `count`
   - optional query: `strokes={additionalStrokes}` further narrows the radical result set

### Stroke aggregation routes
16. `GET|POST /strokes`
   - returns total-stroke buckets and counts
   - optional params: `sort-by-count`, `reverse`
17. `GET|POST /strokes/radicals`
   - returns all valid radical / stroke combinations
18. `GET|POST /strokes/radicals/combined`
   - returns each radical index plus a space-separated list of valid stroke counts
19. `GET|POST /strokes/radicals/{radical}`
   - returns total-stroke values for one radical plus additional-stroke data
   - optional params: `sort-by-additional`, `group-by-additional`

### Sound aggregation routes
20. `GET|POST /sounds/mandarin`
   - counts Mandarin sounds with tone stripped
   - optional params: `sort-by-count`, `reverse`
21. `GET|POST /sounds/mandarin/with-pitch`
   - counts Mandarin sounds with tone retained
   - optional params: `sort-by-count`, `reverse`
22. `GET|POST /sounds/cantonese`
   - counts Cantonese sounds with tone stripped
   - optional params: `sort-by-count`, `reverse`
23. `GET|POST /sounds/cantonese/with-pitch`
   - counts Cantonese sounds with tone retained
   - optional params: `sort-by-count`, `reverse`
24. `GET|POST /sounds/japanese-on`
   - counts `kJapaneseOn` sounds
   - optional params: `sort-by-count`, `reverse`
25. `GET|POST /sounds/japanese-kun`
   - counts `kJapaneseKun` sounds
   - optional params: `sort-by-count`, `reverse`

## Pagination
- no pagination parameters are documented on the official page
- list-style browsing is controlled through filters and count/sort options rather than page / cursor parameters

## Rate limits
- the reviewed official page does not publish a numeric rate limit or quota

## Error and response notes
- the official page says responses use JSON
- live browser probes in this pass confirmed `GET /version` returns `application/json`
- live probes to several other documented routes, including `/fields` and `/characters?...`, currently returned `500` with `application/json`
- because the official route catalog is still published on the first-party API page, this file keeps the documented route inventory while preserving the observed runtime instability as an implementation note

## Important usage notes
- the dataset is based on the Unihan Database and is intentionally limited to the `CJK Unified Ideographs` range the maintainer found useful
- the docs emphasize Mandarin use cases, but the backend also exposes Cantonese and Japanese-oriented lookup routes plus broader Unihan-derived data
- the official page explicitly recommends examining returned JSON to understand field naming on count / radical / stroke summaries
- the `/characters/string/{value}` route is officially flagged as slow
- the companion first-party JavaScript helper library is documented at `http://ccdb.hemiola.com/js/CcdbUtil.js`

## Verification notes
This file was manually rebuilt from the current first-party Chinese Character Web API page, plus live browser probes against a small set of documented routes, using browser inspection only.
