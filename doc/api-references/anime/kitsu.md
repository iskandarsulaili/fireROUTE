# Kitsu

## Overview
- Provider: Kitsu API
- Category: Anime
- Official docs: `https://kitsu.docs.apiary.io/`
- Base API path: `https://kitsu.io/api/edge`
- OAuth path: `https://kitsu.io/api/oauth`
- Auth: OAuth 2 for authenticated operations; official docs say most public-facing `GET` endpoints do not require authentication
- HTTPS: yes
- Response format: JSON:API (`application/vnd.api+json`)
- Pagination: `page[limit]` and `page[offset]`; default page size `10`, maximum `20`
- Rate limits: no numeric public rate limit was published on the reviewed official docs

## Global request/response notes
- JSON:API headers for resource requests:
  - `Accept: application/vnd.api+json`
  - `Content-Type: application/vnd.api+json`
- Filtering uses `filter[attribute]=value`.
- Search is available on some models with `filter[text]=...`.
- Sorting uses `sort=field` and descending sort uses a leading `-`.
- Includes use `include=relationship` and nested relationship paths use `.`.
- Sparse fieldsets use `fields[resource]=field1,field2`.
- Pagination links are returned in a top-level `links` object such as `first`, `next`, and `last`.
- NSFW/R18 content is hidden for unauthenticated requests and for accounts with NSFW disabled.

## OAuth notes
- Official docs describe OAuth 2 password grant and refresh-token flows.
- Token issuance endpoint: `POST https://kitsu.io/api/oauth/token`
- Documented password-grant body fields:
  - `grant_type=password`
  - `username=<email|slug>`
  - `password=<password>`
- Documented refresh body fields:
  - `grant_type=refresh_token`
  - `refresh_token=<refresh_token>`
- Bearer usage:
  - `Authorization: Bearer &lt;access_token&gt;`
- The docs note app registration is not yet implemented and temporarily publish fallback `CLIENT_ID` and `CLIENT_SECRET` values for current integration use.

## Error/status notes
- Official status-code table:
  - `200` OK
  - `201` Created
  - `204` No Content
  - `400` Bad Request
  - `401` Unauthorized
  - `404` Not Found
  - `406` Not Acceptable
  - `5xx` Server Error
- Token errors use OAuth-style payloads with `error` and `error_description`.

## Route conventions confirmed from the official Apiary reference
- The reference exposes action pages per collection.
- For ordinary resource collections, the inspected action panes use these patterns:
  - Fetch Collection -> `GET /{collection}`
  - Fetch Resource -> `GET /{collection}/{id}`
  - Create Resource -> `POST /{collection}`
  - Update Resource -> `PATCH /{collection}/{id}`
  - Delete Resource -> `DELETE /{collection}/{id}`
- I manually verified this pattern directly on official action panes for:
  - `GET /anime`
  - `POST /media-follows`
  - `PATCH /media-follows/id`
  - `DELETE /media-follows/id`
- I also separately verified the special trending route `GET /trending/anime` from its own official action pane.

## Confirmed endpoint collections
Legend:
- `list` = `GET /collection`
- `get` = `GET /collection/{id}`
- `create` = `POST /collection`
- `update` = `PATCH /collection/{id}`
- `delete` = `DELETE /collection/{id}`

| Docs section | Collection path | Confirmed operations | Notes |
|---|---|---|---|
| Anime | `/anime` | list, get | Main anime collection. |
| Anime | `/episodes` | list, get | Episode resources. |
| Anime | `/trending/anime` | list | Special trending route; not a standard CRUD collection. |
| Manga | `/manga` | list, get | Main manga collection. |
| Manga | `/chapters` | list, get | Chapter resources. |
| Manga | `/trending/manga` | list | Special trending route. |
| Categories | `/categories` | list, get | Category resources. |
| Categories | `/category-favorites` | list, get, create, update, delete | Category favorite records. |
| Media Relations | `/media-relationships` | list, get | Relationship graph between media entries. |
| Media Relations | `/mappings` | list, get | External-site mapping resources. |
| Media Relations | `/franchises` | list, get | Official docs mark as deprecated in favor of media relationships. |
| Media Relations | `/installments` | list, get | Official docs mark as deprecated in favor of media relationships. |
| Media Follows | `/media-follows` | list, get, create, update, delete | Follow records. |
| Media Follows | `/media-attributes` | list, get | Media attribute catalog. |
| Media Follows | `/media-attribute-votes` | list, get, create, update, delete | Votes on media attributes. |
| Streamers | `/streamers` | list, get | Streaming providers. |
| Streamers | `/streaming-links` | list, get | Outbound streaming links. |
| Users | `/blocks` | list, get, create, update, delete | User block relations. |
| Users | `/favorites` | list, get, create, update, delete | Favorite records. |
| Users | `/follows` | list, get, create, update, delete | User follow relations. |
| Users | `/linked-accounts` | list, get, create, update, delete | External linked accounts. |
| Users | `/profile-link-sites` | list, get | Supported profile link site catalog. |
| Users | `/profile-links` | list, get, create, update, delete | User profile links. |
| Users | `/roles` | list, get, create, update, delete | Role resources. |
| Users | `/stats` | list, get, delete | Stats lack create/update actions in the official reference. |
| Users | `/user-roles` | list, get, create, delete | User-role assignments omit update in the official reference. |
| Users | `/users` | list, get, create, update, delete | User resources. |
| User Libraries | `/library-entries` | list, get, create, update, delete | Library entries. |
| User Libraries | `/library-entry-logs` | list, get, create, update, delete | Entry log records. |
| User Libraries | `/library-events` | list, get, delete | Events omit create/update in the official reference. |
| User Libraries | `/list-imports` | list, get, create | Import jobs omit update/delete in the official reference. |
| Reactions | `/media-reaction-votes` | list, get, create, update, delete | Media reaction vote records. |
| Reactions | `/media-reactions` | list, get, create, update, delete | Media reaction resources. |
| Reactions | `/review-likes` | list, get, create, update, delete | Review-like records. |
| Reactions | `/reviews` | list, get, create, update, delete | Reviews. |
| Posts | `/posts` | list, get, create, update, delete | Feed posts. |
| Posts | `/post-likes` | list, get, create, delete | Post-like resources omit update. |
| Posts | `/post-follows` | list, get, create, delete | Post-follow resources omit update. |
| Comments | `/comments` | list, get, create, update, delete | Comments. |
| Comments | `/comment-likes` | list, get, create, delete | Comment-like resources omit update. |
| Characters | `/anime-characters` | list, get, create, update, delete | Anime-character join resources. |
| Characters | `/manga-characters` | list, get, create, update, delete | Manga-character join resources. |
| Characters | `/characters` | list, get, create, update, delete | Character resources. |
| Producers & Staff | `/anime-productions` | list, get, create, update, delete | Anime-production join resources. |
| Producers & Staff | `/anime-staff` | list, get, create, update, delete | Anime staff join resources. |
| Producers & Staff | `/manga-staff` | list, get, create, update, delete | Manga staff join resources. |
| Producers & Staff | `/producers` | list, get, create, update, delete | Producer resources. |
| Producers & Staff | `/people` | list, get, create, update, delete | Person resources. |
| Producers & Staff | `/castings` | list, get, create, update, delete | Casting resources. |
| Groups | `/groups` | list, get, create, update, delete | Group resources. |
| Groups | `/group-action-logs` | list, get | Group action logs. |
| Groups | `/group-bans` | list, get, create, delete | No update action documented. |
| Groups | `/group-categories` | list, get, create, update, delete | Group categories. |
| Groups | `/group-invites` | list, get, create, update, delete | Group invites. |
| Groups | `/group-member-notes` | list, get, create, update, delete | Group member notes. |
| Groups | `/group-members` | list, get, create, update, delete | Group membership resources. |
| Groups | `/group-neighbors` | list, get, create, delete | No update action documented. |
| Groups | `/group-permissions` | list, get, create, delete | No update action documented. |
| Groups | `/group-reports` | list, get, create, update | No delete action documented. |
| Groups | `/group-ticket-messages` | list, get, create, update, delete | Ticket message resources. |
| Groups | `/group-tickets` | list, get, create, update | No delete action documented. |
| Groups | `/leader-chat-messages` | list, get, create, update, delete | Leader-chat message resources. |
| Reports | `/reports` | list, get, create, update, delete | Moderation/report resources. |
| Site Announcements | `/site-announcements` | list, get | Announcement feed. |

## Important usage notes
- The docs explicitly state that filter parameters may be written in either camelCase or snake_case.
- Brackets shown in docs examples are for readability; real URLs must percent-encode them as needed.
- The docs recommend JSON:API client libraries because the API adheres closely to the JSON:API specification.
- `franchises` and `installments` are still documented, but both are marked deprecated in favor of `media-relationships`.

## Route-count note
- The official Apiary reference currently exposes `252` confirmed operations across `64` documented endpoint collections.

## Sources inspected
- `https://kitsu.docs.apiary.io/`
- `https://kitsu.docs.apiary.io/#reference/anime/anime/fetch-collection`
- `https://kitsu.docs.apiary.io/#reference/anime/trending-anime/fetch-collection`
- `https://kitsu.docs.apiary.io/#reference/media-follows/media-follows/create-resource`
- `https://kitsu.docs.apiary.io/#reference/media-follows/media-follows/update-resource`
- `https://kitsu.docs.apiary.io/#reference/media-follows/media-follows/delete-resource`
