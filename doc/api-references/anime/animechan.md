# AnimeChan

## Overview
- Provider: Animechan
- Category: Anime
- Official docs: `https://animechan.io/docs`
- Base URL: `https://api.animechan.io/v1`
- Auth: optional `x-api-key` header for supporter-tier usage; free unauthenticated access is documented for all published endpoints
- HTTPS: yes
- Response format: JSON with top-level `status` plus either `data` or `error`
- Pagination: supported on quote-list endpoints with `page`; docs say list endpoints return `5` ordered quotes per page
- Rate limits: `5 requests per hour` on the free tier; `1000 requests per hour` with an API key/supporter access

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/anime/{anime_id_or_name}` | Path accepts either numeric anime ID or anime name | Returns anime metadata including `id`, `name`, `episodeCount`, and `summary`. Docs recommend using the numeric ID for accuracy and speed. |
| GET | `/quotes/random` | none | Returns one random quote from any anime/character. |
| GET | `/quotes/random` | `anime=<anime_name>` | Returns one random quote filtered to a specific anime. |
| GET | `/quotes/random` | `character=<character_name>` | Returns one random quote filtered to a specific character. |
| GET | `/quotes` | `anime=<anime_name>`, optional `page=<page_number>` | Returns an array of quote objects for a specific anime. |
| GET | `/quotes` | `character=<character_name>`, optional `page=<page_number>` | Returns an array of quote objects for a specific character. |

## Quote object shape
- All quote endpoints return a `Quote` object with:
  - `status`
  - `data.content`
  - `data.anime.id`
  - `data.anime.name`
  - `data.character.id`
  - `data.character.name`
- Live API responses also include `data.anime.altName` on at least some quotes.

## Auth and usage notes
- The docs say all endpoints are free to use at the default limit.
- For higher hourly limits, clients send `x-api-key: YOUR_API_KEY`.
- The authentication example in the official docs uses:
  - `fetch(`${BASE_URL}/quotes/random?anime=ReLIFE`, { headers: { 'x-api-key': 'YOUR_API_KEY' } })`

## Pagination and filtering notes
- Pagination is documented only for list endpoints returning arrays, specifically the quote-list endpoints.
- The docs show `page` as the pagination parameter.
- Anime and character quote-list operations each return `5` ordered quotes per page.

## Error and format notes
- Success responses use `{"status":"success","data":...}`.
- A live not-found check on the official API returned HTTP `404` with:
  - `{"status":"error","error":{"code":404,"message":"No matching quote found"}}`
- The docs do not publish a broader error-code table beyond the documented success shapes and route descriptions.

## Integration notes for fireROUTE
- Treat `/quotes/random` as one route family with three modes: unfiltered, filtered by `anime`, and filtered by `character`.
- Treat `/quotes` as the paginated list route family with mutually exclusive `anime` vs `character` filters.
- Preserve the provider's native `status` wrapper instead of flattening it away.
- Prefer anime IDs over anime names when the caller already has an ID.

## Route-count note
- The official Animechan docs currently expose `6` confirmed operations.

## Sources inspected
- `https://animechan.io/docs`
- `https://animechan.io/docs/auth`
- `https://animechan.io/docs/anime`
- `https://animechan.io/docs/quote`
- `https://animechan.io/docs/quote/random`
- `https://animechan.io/docs/quote/random-via-anime`
- `https://animechan.io/docs/quote/random-via-character`
- `https://animechan.io/docs/quote/quotes-by-anime`
- `https://animechan.io/docs/quote/quotes-by-character`
- `https://animechan.io/docs/quote/pagination`
- `https://api.animechan.io/v1/quotes/random`
- `https://api.animechan.io/v1/quotes?anime=zzzznotreal&page=999`
