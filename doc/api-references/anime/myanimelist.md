# MyAnimeList

## Overview
- Provider: MyAnimeList API v2
- Category: Anime
- Official docs: `https://myanimelist.net/apiconfig/references/api/v2`
- Base URL: `https://api.myanimelist.net/v2`
- Auth: OAuth 2; the docs include an Authentication section and common `401 invalid_token` error format
- HTTPS: yes
- Response format: JSON
- Pagination: list responses use `data` plus `paging.previous` / `paging.next`; common list parameters include `limit` and `offset`
- Rate limits: no single public numeric limit was visible on the reviewed docs page

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/anime` | Search/list anime; supports common list params and field selection. |
| GET | `/anime/{anime_id}` | Anime detail. |
| GET | `/anime/ranking` | Anime ranking lists. |
| GET | `/anime/season/{year}/{season}` | Seasonal anime listings. |
| GET | `/anime/suggestions` | Authenticated suggestion feed. |
| PATCH | `/anime/{anime_id}/my_list_status` | Update current user's anime list status. |
| DELETE | `/anime/{anime_id}/my_list_status` | Remove anime from current user's list. |
| GET | `/users/{user_name}/animelist` | Public or authorized user animelist retrieval. |
| GET | `/forum/boards` | Forum board listing. |
| GET | `/forum/topic/{topic_id}` | Forum topic detail. |
| GET | `/forum/topics` | Forum topic search/listing. |
| GET | `/manga` | Search/list manga. |
| GET | `/manga/{manga_id}` | Manga detail. |
| GET | `/manga/ranking` | Manga ranking lists. |
| PATCH | `/manga/{manga_id}/my_list_status` | Update current user's manga list status. |
| DELETE | `/manga/{manga_id}/my_list_status` | Remove manga from current user's list. |
| GET | `/users/{user_name}/mangalist` | Public or authorized user mangalist retrieval. |
| GET | `/users/{user_name}` | User profile summary. |

## Common request notes
- Use the `fields` parameter to opt into non-default response fields.
- Some APIs omit NSFW content by default; the docs expose an `nsfw=true|false` parameter for applicable resources.
- Error format is JSON with fields such as `error` and `message`.

## Integration notes for fireROUTE
- Keep anime and manga list-status mutations separate from public browse/search routes.
- Preserve MAL's native pagination object instead of flattening to a custom page schema.
- OAuth is required for list mutation and suggestion-style personalized operations.

## Route-count note
- The official ReDoc page currently exposes `18` confirmed operations.

## Sources inspected
- `https://myanimelist.net/apiconfig/references/api/v2`
