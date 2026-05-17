# Jikan

## Overview
- Provider: Jikan REST API v4
- Category: Anime
- Official docs: `https://docs.api.jikan.moe/`
- Base URL: `https://api.jikan.moe/v4`
- Auth: none; the docs explicitly state that authenticated MyAnimeList write operations are not supported
- HTTPS: yes
- Methods: read-only `GET` only
- Rate limits: `60 requests/minute`, `3 requests/second`, daily limit `Unlimited` per docs
- Caching: all requests are cached for 24 hours according to the docs
- Response format: JSON

## Confirmed endpoint families
The official docs expose a broad read-only surface. During manual review I confirmed the following route patterns directly from the docs site.

| Method | Path | Notes |
|---|---|---|
| GET | `/anime/{id}` | Core anime record. |
| GET | `/anime/{id}/full` | Expanded anime record. |
| GET | `/anime/{id}/characters` | Character relations for an anime. |
| GET | `/anime/{id}/staff` | Staff for an anime. |
| GET | `/anime/{id}/episodes` | Episode listing. |
| GET | `/anime/{id}/episodes/{episode}` | Single episode detail. |
| GET | `/anime/{id}/news` | News related to an anime. |
| GET | `/anime/{id}/forum` | Forum topics for an anime. |
| GET | `/characters/{id}` | Character record. |
| GET | `/characters/{id}/full` | Expanded character record. |
| GET | `/characters/{id}/anime` | Anime appearances for a character. |
| GET | `/characters/{id}/manga` | Manga appearances for a character. |
| GET | `/characters/{id}/voices` | Voice actors. |
| GET | `/characters/{id}/pictures` | Character pictures. |
| GET | `/clubs/{id}` | Club record. |
| GET | `/clubs/{id}/members` | Club members. |
| GET | `/clubs/{id}/staff` | Club staff. |
| GET | `/clubs/{id}/relations` | Club relations. |
| GET | `/genres/anime` | Anime genre list. |
| GET | `/genres/manga` | Manga genre list. |
| GET | `/manga/{id}` | Manga record. |
| GET | `/manga/{id}/full` | Expanded manga record. |
| GET | `/manga/{id}/characters` | Manga characters. |
| GET | `/manga/{id}/news` | Manga-related news. |
| GET | `/manga/{id}/forum` | Manga forum topics. |
| GET | `/manga/{id}/pictures` | Manga pictures. |
| GET | `/manga/{id}/statistics` | Manga statistics. |
| GET | `/manga/{id}/moreinfo` | Additional info block. |
| GET | `/people/{id}` | Person record. |
| GET | `/people/{id}/full` | Expanded person record. |
| GET | `/people/{id}/anime` | Anime roles for a person. |
| GET | `/people/{id}/manga` | Manga roles for a person. |
| GET | `/people/{id}/voices` | Voice roles for a person. |
| GET | `/people/{id}/pictures` | Person pictures. |
| GET | `/producers/{id}` | Producer record. |
| GET | `/producers/{id}/full` | Expanded producer record. |
| GET | `/producers/{id}/external` | External links for producer. |
| GET | `/random/anime` | Random anime. |
| GET | `/random/manga` | Random manga. |
| GET | `/random/characters` | Random character. |
| GET | `/random/people` | Random person. |
| GET | `/random/users` | Random user. |
| GET | `/recommendations/anime` | Anime recommendations. |
| GET | `/recommendations/manga` | Manga recommendations. |
| GET | `/reviews/anime` | Anime reviews. |
| GET | `/reviews/manga` | Manga reviews. |
| GET | `/users/userbyid/{id}` | Resolve a user by MAL numeric id. |
| GET | `/users/{username}` | User profile by username. |
| GET | `/users/{username}/full` | Expanded user profile. |
| GET | `/users/{username}/statistics` | User statistics. |
| GET | `/users/{username}/favorites` | User favorites. |
| GET | `/users/{username}/userupdates` | User updates feed. |
| GET | `/users/{username}/about` | User about text. |
| GET | `/seasons/now` | Current season. |
| GET | `/seasons/{year}/{season}` | Seasonal listing by year and season. |
| GET | `/seasons/upcoming` | Upcoming seasons. |
| GET | `/top/anime` | Top anime. |
| GET | `/top/manga` | Top manga. |
| GET | `/top/people` | Top people. |
| GET | `/top/characters` | Top characters. |
| GET | `/top/reviews` | Top reviews. |
| GET | `/watch/episodes` | Recently added episodes. |
| GET | `/watch/episodes/popular` | Popular recent episodes. |
| GET | `/watch/promos` | Promotional videos. |
| GET | `/watch/promos/popular` | Popular promotional videos. |

## Manual route-count note
- I manually confirmed `69` route patterns surfaced on the docs page during review.
- The table above lists the major route families explicitly captured for fireROUTE reference; the docs page also exposes additional top-level query endpoints for resources such as anime, manga, people, magazines, schedules, and producers.

## Request and response notes
- The docs state that any scalar property with an unknown value is returned as `null`.
- Missing array/object values are returned as empty arrays/objects.
- Unknown scores are returned as `0`.
- Dates and timestamps are returned in ISO 8601 UTC.
- Error responses are returned as JSON.
- Cache-related headers include `Expires`, `Last-Modified`, and `X-Request-Fingerprint` on cacheable single-resource endpoints.

## HTTP status and usage notes
- The docs explicitly mention these status classes/examples:
  - `200 OK`
  - `304 Not Modified`
  - `400 Bad Request`
  - `404 Not Found`
- The service is read-only and cannot be used to update a MyAnimeList account.
- The docs also warn that you can still be rate limited upstream by MyAnimeList itself.

## Integration notes for fireROUTE
- Treat Jikan as a large unauthenticated anime metadata source.
- Preserve GET-only semantics in any adapter.
- Respect published rate limits aggressively because the upstream site is scraped from MyAnimeList.
- Resource families are well suited to raw passthrough mode because the surface area is broad.

## Sources inspected
- `https://docs.api.jikan.moe/`
