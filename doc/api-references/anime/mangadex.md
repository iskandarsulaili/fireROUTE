# MangaDex

## Overview
- Provider: MangaDex API
- Category: Anime
- Official docs: `https://api.mangadex.org/docs/`
- Base URL: `https://api.mangadex.org`
- Auth: mixed; many read endpoints are public, while account/user/list/upload/moderation operations require authenticated access
- HTTPS: yes
- Response format: JSON
- Pagination: documented in the official docs as a first-class concept; collection endpoints use list/search pagination controls in the OpenAPI spec
- Rate limits: the inspected docs did not publish a single simple numeric public rate-limit value on the pages reviewed
- Usage policy: the docs state the API is public and free to use, but only for projects that credit MangaDex and scanlation groups and do not run ads or paid services

## Confirmed endpoint families
- The official Swagger/OpenAPI documentation currently exposes `113` operations.
- The table below lists the major route families confirmed during manual review.

| Area | Representative paths confirmed |
|---|---|
| Api clients | `/client`, `/client/{id}`, `/client/{id}/secret` |
| At-home delivery | `/at-home/server/{chapterId}` |
| Authentication | `/auth/login`, `/auth/check`, `/auth/logout`, `/auth/refresh` |
| Authors | `/author`, `/author/{id}` |
| Captcha | `/captcha/solve` |
| Chapters | `/chapter`, `/chapter/{id}`, chapter download/feed/upload routes |
| Covers | `/cover`, `/cover/{mangaOrCoverId}` |
| Custom lists | `/list`, `/list/{id}`, `/list/{id}/follow`, `/manga/{id}/list/{listId}`, `/user/list`, `/user/{id}/list` |
| Feeds | `/user/follows/manga/feed`, `/list/{id}/feed`, `/manga/{id}/feed` |
| Follows | `/user/follows/group`, `/user/follows/group/{id}`, `/user/follows/user`, `/user/follows/user/{id}`, `/user/follows/manga`, `/user/follows/manga/{id}`, `/user/follows/list`, `/user/follows/list/{id}` |
| Forums | `/forums/thread` |
| Health / infra | `/ping` |
| Legacy mapping | `/legacy/mapping` |
| Manga | `/manga`, `/manga/{id}`, `/manga/random`, `/manga/tag`, `/manga/status`, `/manga/{id}/status`, `/manga/{id}/aggregate`, `/manga/{id}/recommendation`, `/manga/draft`, `/manga/draft/{id}`, `/manga/draft/{id}/commit`, `/manga/{mangaId}/relation`, `/manga/{mangaId}/relation/{id}` |
| Ratings | `/rating`, `/rating/{mangaId}` |
| Read markers | `/manga/{id}/read`, `/manga/read`, `/user/history` |
| Reports | `/report`, `/report/reasons/{category}` |
| Scanlation groups | `/group`, `/group/{id}`, `/group/{id}/follow` |
| Settings | `/settings/template`, `/settings/template/{version}` |
| Static / taxonomy data | docs also surface static-data and entity/timestamp/reference-expansion concepts |

## Auth and policy notes
- The docs explicitly distinguish public clients and personal clients.
- The API is public to use, but the acceptable-usage policy requires attribution to MangaDex, attribution to scanlation groups when chapter reading is provided, and prohibits ads or paid services on client apps/sites using the API.
- Upload, account, follow, rating, list-management, and moderation-oriented routes should be treated as authenticated operations.

## Request/response notes
- The docs site exposes both Redoc and Swagger views and links the OpenAPI document at `/docs/static/api.yaml`.
- Manga, chapter, author, group, custom-list, and user/follow resources are all first-class route families rather than query-only variants.
- Because the docs emphasize pagination, reference expansion, timestamps, and reCAPTCHA, adapters should preserve those native concepts instead of flattening the provider into a minimal search-only shape.

## Route-count note
- The Swagger UI currently exposes `113` operations under `https://api.mangadex.org/docs/swagger.html`.

## Integration notes for fireROUTE
- Treat MangaDex as a large multi-surface API rather than a single manga-search endpoint.
- Keep list/follow/rating/read-marker routes distinct from anonymous browse/search routes.
- Respect the official acceptable-usage policy when deciding whether this provider is suitable for downstream public-facing integrations.

## Sources inspected
- `https://api.mangadex.org/docs.html`
- `https://api.mangadex.org/docs/`
- `https://api.mangadex.org/docs/swagger.html`
