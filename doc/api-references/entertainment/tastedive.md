# TasteDive

## Overview
- Provider: TasteDive legacy API
- Category: Entertainment
- Official docs: `https://tastedive.com/read/api`
- Base URL: `https://tastedive.com/api`
- Auth: API key required via the `k` query parameter
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: `300 requests per hour` with an access key, as stated on the official API page
- Lifecycle note: the official page says TasteDive joined Qloo in 2019 and labels this as the legacy API that will continue to be supported until full migration

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/similar` | required `q`, `type`, `k`; optional `info`, `limit`, `slimit` | Returns recommendation results across music, movies, shows, books, games, podcasts, people, places, and brands. |

## Query parameters
- `q` — search query; one or more items separated by commas
  - The docs explicitly allow typed prefixes such as `music:`, `movie:`, `show:`, `podcast:`, `book:`, `game:`, `person:`, `place:`, and `brand:`
  - The docs warn to URL-encode this parameter
- `type` — required result type; documented values are `music`, `movie`, `show`, `podcast`, `book`, `game`, `person`, `place`, `brand`
- `info` — when `1`, the docs say additional information is returned for recommended items; default is `0`
- `limit` — maximum number of recommendations to retrieve; default `20`
- `slimit` — maximum number of search results to retrieve for each query item; should be between `1` and `3`
- `k` — API access key

## Response format
- The docs say the API returns JSON.
- Top-level structure documented on the page:
  - `Similar`
    - `Info` — the searched item(s)
    - `Results` — the recommended items
- Each item in `Info` or `Results` has:
  - `Name`
  - `Type`
- The docs say type values can be `music`, `movie`, `show`, `book`, `game`, `person`, `place`, `brand`.

### Additional fields
The docs contain a wording inconsistency:
- parameter section: extra data is enabled with `info=1`
- response section: extra data is described as appearing when `verbose=1`

The response section lists these additional fields:
- `wTeaser` — item description
- `wUrl` — Wikipedia URL
- `yUrl` — YouTube clip URL
- `yID` — YouTube clip ID

## Error handling
- The legacy API page does not publish a formal HTTP error table or JSON error schema.
- The docs page only documents successful request/response behavior plus access-key requirements.

## Integration notes for fireROUTE
- Model TasteDive as a single GET recommendation endpoint.
- Preserve the docs inconsistency around `info` vs `verbose` in adapter notes; callers may need testing before assuming only one flag name is valid.
- This category file emphasizes TasteDive's broader entertainment use, but the same route also covers music and other taste domains.

## Sources inspected
- `https://tastedive.com/read/api`
