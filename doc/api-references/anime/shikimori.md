# Shikimori

## Overview
- Provider: Shikimori API
- Category: Anime
- Official docs: `https://shikimori.one/api/doc`
- Base URLs: `https://shikimori.one/api/v2` and `https://shikimori.io/api/graphql`
- Auth: OAuth 2 for authenticated operations; docs also require a meaningful `User-Agent`
- HTTPS: yes
- Response formats: JSON for REST, GraphQL over HTTP for the preferred GraphQL surface
- Rate limits: `5 rps` and `90 rpm` per the official docs

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| POST | `/api/v2/topics/{topic_id}/ignore` | Ignore a topic. |
| DELETE | `/api/v2/topics/{topic_id}/ignore` | Unignore a topic. |
| POST | `/api/v2/users/{user_id}/ignore` | Ignore a user. |
| DELETE | `/api/v2/users/{user_id}/ignore` | Unignore a user. |
| POST | `/api/v2/abuse_requests/offtopic` | Mark comment as offtopic. |
| POST | `/api/v2/abuse_requests/review` | Convert comment to review. |
| POST | `/api/v2/abuse_requests/abuse` | Report rules abuse. |
| POST | `/api/v2/abuse_requests/spoiler` | Report spoiler content. |
| POST | `/api/v2/episode_notifications` | Notify Shikimori about episode release. |
| GET | `/api/v2/user_rates` | List user rates. |
| GET | `/api/v2/user_rates/{id}` | Show one user rate. |
| POST | `/api/v2/user_rates` | Create a user rate. |
| PATCH | `/api/v2/user_rates/{id}` | Update a user rate. |
| PUT | `/api/v2/user_rates/{id}` | Alternate full update for a user rate. |
| POST | `/api/v2/user_rates/{id}/increment` | Increment watched/read progress by one. |
| DELETE | `/api/v2/user_rates/{id}` | Delete a user rate. |
| POST | `/api/graphql` | Preferred modern GraphQL API surface, exposed via the official playground. |

## Request notes
- The docs explicitly say to prefer GraphQL over the older REST v2/v1 APIs when possible.
- API requests must use HTTPS only.
- The docs warn clients not to mimic a browser and to send the OAuth application name in the `User-Agent` header.

## Integration notes for fireROUTE
- Model GraphQL as a separate adapter surface from the legacy v2 REST endpoints.
- Preserve the published rate limits and `User-Agent` requirement; the docs warn that IPs may be banned otherwise.
- The visible v2 REST docs in this pass cover moderation/ignore/user-rate style operations, not the full site data model.

## Route-count note
- The official docs reviewed in this pass expose `17` confirmed endpoint surfaces: `16` REST operations plus the preferred GraphQL endpoint.

## Sources inspected
- `https://shikimori.one/api/doc`
- `https://shikimori.one/api/doc/graphql`
