# Podio

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `podio`
- Docs/pages reviewed manually:
  - `https://developers.podio.com/doc`
  - `https://developers.podio.com/index/api`
  - `https://developers.podio.com/authentication`
  - `https://developers.podio.com/index/limits`
- Confirmed API base URL: `https://api.podio.com`
- Confirmed API style: versionless REST API rooted at `https://api.podio.com`
- Primary exchange format: JSON over HTTPS
- Manually confirmed route count from the current official operation pages: `403`
- Route-method breakdown confirmed from the current official operation pages:
  - `214` `GET`
  - `95` `POST`
  - `53` `PUT`
  - `41` `DELETE`

## What the official docs confirm
- Podio publishes a large REST API rooted at `https://api.podio.com`.
- The reviewed docs explicitly say the API is RESTful, uses JSON as the exchange format, requires SSL for all communication, and uses OAuth2 for authentication/authorization.
- The docs are slash-aware: collection/list resources commonly use a trailing slash while single-object resources do not.
- The current route inventory visible on the official operation pages totals `403` concrete method+path operations across `39` route families/areas.
- One reviewed widget page prints `GET widget/{ref_type}/{ref_id}` without a leading slash in prose; this appears to be a formatting inconsistency in that single page, so the normalized route should be read as `GET /widget/{ref_type}/{ref_id}` to stay consistent with the rest of the docs.

## Authentication
From the current official authentication guide:
- Podio uses OAuth2.
- Authorization header format:
  - `Authorization: OAuth2 ACCESS_TOKEN`
- Before use, callers must register an application and obtain:
  - `client_id`
  - `client_secret`

### Officially documented auth flows
- Server-side flow
- Client-side flow
- Username & password flow
- App authentication flow

### Token lifecycle notes
- Access token expiry: `8 hours`
- Refresh token expiry: `28 days`
- Official token refresh endpoint:
  - `POST https://api.podio.com/oauth/token/v2`
- Example official refresh body fields:
  - `grant_type`
  - `client_id`
  - `client_secret`
  - `refresh_token`

### OAuth routes directly confirmed from the current route pages (`4`)
- `POST /oauth/token/v2`
- `GET /oauth/scope`
- `POST /oauth/grant/invalidate`
- `POST /oauth/token/invalidate`

## Rate limits
From the current official rate-limit page:
- General limit: `1,000` API calls per hour
- Lower limit for operations explicitly marked `Rate limited` in the reference: `250` API calls per hour
- Limits are enforced per user per API key
- If a caller exceeds the limit, Podio begins returning HTTP `420`

### Official rate-limit headers
- `X-Rate-Limit-Limit`
- `X-Rate-Limit-Remaining`

### Official caveat
- The docs explicitly say the reset time is not currently exposed.

## Request, format, and parameter conventions
From the current official API-conventions page:
- All API communication uses HTTPS.
- JSON is the exchange format.
- IDs and numeric values must be sent as integers, not strings.
- For `GET` requests only, boolean query parameters use:
  - `0` for false
  - `1` for true
- Date format: `YYYY-MM-DD`
- Datetime format: `YYYY-MM-DD HH:MM:SS`
- Dates/times are generally UTC except for user-entered local/naive date values in some item/date contexts.
- Timezones are full zone names such as `Europe/Copenhagen`.
- Locales follow ISO 639-1.

### Common parameter/identifier patterns directly visible in the reviewed docs
- Path ids such as:
  - `app_id`
  - `item_id`
  - `task_id`
  - `space_id`
  - `org_id`
  - `conversation_id`
  - `hook_id`
  - `user_id`
  - `ref_type`
  - `ref_id`
- Query/body conventions seen repeatedly on reviewed list/search/filter pages include route-specific pagination/filter fields such as:
  - `limit`
  - `offset`
  - `silent`
  - filter/search payload objects on POST search/filter routes
- Contact-identification rules are a documented cross-cutting concept in the conventions page, supporting objects like:
  - `{"type":"user","id":...}`
  - `{"type":"profile","id":...}`
  - `{"type":"mail","id":...}`
  - `{"type":"space","id":...}`
  - `{"type":"external","id":{...}}`

## Error notes
- Official rate-limit overages return HTTP `420`.
- The docs emphasize standard HTTP method semantics and JSON request/response handling, but the reviewed general pages do not publish one global error-schema document.
- Many route pages visibly annotate authentication mode (`App Authentication`, `Rate-limited`, etc.) per operation rather than through one shared machine-readable spec.

## Important usage notes
- The API is large and area-organized; the docs explicitly describe areas as functional subsets rather than separate products.
- The Podio frontend itself is described as being built on the same API.
- The docs recommend webhooks instead of polling to reduce request usage.
- The docs explicitly recommend caching and request bundling where possible, including using a `fields` parameter to reduce API usage.
- The docs describe app authentication as the preferred fallback over username/password when user-specific auth is unnecessary.

## Confirmed route surface summary
The current official Podio route pages expose `403` operations across these route families:
- `items` -> `39`
- `tasks` -> `30`
- `applications` -> `26`
- `organizations` -> `22`
- `conversations` -> `22`
- `calendar` -> `20`
- `contacts` -> `18`
- `stream` -> `16`
- `voting` -> `16`
- `users` -> `14`
- `files` -> `13`
- `space-members` -> `12`
- `notifications` -> `12`
- `spaces` -> `12`
- `tags` -> `11`
- `email` -> `10`
- `grants` -> `9`
- `search` -> `9`
- `flows` -> `8`
- `ratings` -> `8`
- `forms` -> `7`
- `comments` -> `6`
- `integrations` -> `6`
- `subscriptions` -> `6`
- `widgets` -> `7` total pages, with one widget route page needing manual normalization as noted above
- plus smaller families including `actions`, `batch`, `embeds`, `friends`, `hooks`, `importer`, `layout`, `linked-accounts`, `oauth-authorization`, `questions`, `recurrence`, `reference`, `reminders`, and `status`

## Representative exact route inventory from the current official docs
The full surface is too large to inline exhaustively here, but the following routes were directly confirmed from current first-party operation pages.

### Applications (`26` routes)
Representative routes:
- `POST /app/{app_id}/activate`
- `POST /app`
- `POST /app/{app_id}/field`
- `POST /app/{app_id}/deactivate`
- `DELETE /app/{app_id}`
- `DELETE /app/{app_id}/field/{field_id}`
- `GET /app`
- `GET /app/{app_id}`
- `GET /app/org/{org_label}/space/{space_label}/{app_label}`
- `GET /app/{app_id}/dependencies`
- `GET /app/{app_id}/field/{field_or_external_id}`
- `GET /app/{app_id}/inverse_dependencies`

### Items (`39` routes)
Representative routes:
- `POST /item/app/{app_id}`
- `POST /item/app/{app_id}/delete`
- `POST /item/app/{app_id}/calculate`
- `POST /item/{item_id}/clone`
- `DELETE /item/{item_id}`
- `DELETE /item/{item_id}/ref`
- `POST /item/app/{app_id}/export/{exporter}`
- `POST /item/app/{app_id}/filter`
- `POST /item/app/{app_id}/filter/{view_id}`
- `GET /item/field/{field_id}/find`
- `GET /item/app/{app_id}/values`
- `GET /item/{item_id}`
- `GET /item/app_item/{app_item_id}`
- `GET /item/app/{app_id}/field/{field_id}/range`
- `PUT /item/{item_id}`
- `PUT /item/{item_id}/value/{field_or_external_id}`

### Tasks (`30` routes)
Representative routes:
- `POST /task/{task_id}/assign`
- `POST /task/{task_id}/complete`
- `POST /task/label`
- `POST /task`
- `POST /task/{ref_type}/{ref_id}`
- `DELETE /task/label/{label_id}`
- `DELETE /task/{task_id}`
- `GET /task/label`
- `GET /task/{task_id}`
- `GET /task/{ref_type}/{ref_id}/count`
- `GET /task/summary`
- `GET /task/org/{org_id}/summary`

### Organizations (`22` routes)
Representative routes:
- `POST /org`
- `POST /org/{org_id}/appstore`
- `DELETE /org/{org_id}/appstore`
- `DELETE /org/{org_id}/member/{user_id}/role`
- `DELETE /org/{org_id}/member/{user_id}`
- `GET /org/admin-orgs/{email}`
- `GET /org/{org_id}/all_spaces`
- `GET /org/{org_id}`
- `GET /org/{org_id}/admin`
- `GET /org/{org_id}/appstore`
- `GET /org/url`
- `GET /org/{org_id}/report/login`

### Conversations (`22` routes)
Representative routes:
- `POST /conversation/{conversation_id}/participant`
- `POST /conversation/{conversation_id}/participant/v2`
- `POST /conversation`
- `POST /conversation/{ref_type}/{ref_id}`
- `POST /conversation/v2`
- `GET /conversation/{conversation_id}`
- `GET /conversation/event/{event_id}`
- `GET /conversation/{conversation_id}/event`
- `GET /conversation`
- `GET /conversation/{ref_type}/{ref_id}`
- `GET /conversation/direct/{user_id}`
- `GET /conversation/{flag}/count`

### Calendar (`20` routes)
Representative routes:
- `POST /calendar/app/{app_id}/filter`
- `GET /calendar/app/{app_id}`
- `GET /calendar/app/{app_id}/ics/{user_id}/{token}`
- `GET /calendar/summary`
- `GET /calendar/personal/summary`
- `GET /calendar/space/{space_id}/summary`
- `GET /calendar/export/linked_account/{linked_account_id}/{ref_type}/{ref_id}`
- `GET /calendar/export/{ref_type}/{ref_id}`
- `GET /calendar`
- `GET /calendar/ics/{user_id}/{token}`
- `GET /calendar/export/linked_account/{linked_account_id}`
- `GET /calendar/export`

### Files (`13` routes)
Representative routes:
- `POST /file/{file_id}/attach`
- `POST /file/{file_id}/copy`
- `DELETE /file/{file_id}`
- `GET /file/{file_id}`
- `GET /file`
- `GET /file/app/{app_id}`
- `GET /file/space/{space_id}`
- `GET /file/space/{space_id}/latest`
- `GET /file/linked_account/{linked_account_id}`
- `POST /file/{file_id}/replace`
- `PUT /file/{file_id}`
- `POST /file`

### Spaces and space membership (`24` routes combined)
Representative routes:
- `POST /space`
- `DELETE /space/{space_id}`
- `GET /space/{space_id}`
- `GET /space/org/{org_id}/available`
- `GET /space/top`
- `PUT /space/{space_id}`
- `POST /space/{space_id}/member`
- `DELETE /space/{space_id}/member/{user_ids}`
- `GET /space/{space_id}/member`
- `GET /space/{space_id}/member/{user_id}`
- `POST /space/{space_id}/join`
- `PUT /space/{space_id}/member/{user_ids}`

### OAuth / hooks / search / users
Representative routes:
- `POST /oauth/token/v2`
- `GET /oauth/scope`
- `POST /oauth/grant/invalidate`
- `POST /oauth/token/invalidate`
- `POST /hook/{ref_type}/{ref_id}`
- `DELETE /hook/{hook_id}`
- `GET /hook/{ref_type}/{ref_id}`
- `POST /hook/{hook_id}/verify/request`
- `POST /hook/{hook_id}/verify/validate`
- `POST /search`
- `GET /search/v2`
- `POST /search/app/{app_id}`
- `GET /search/app/{app_id}/v2`
- `GET /user`
- `GET /user/profile`
- `PUT /user/property`
- `PUT /user/setting/{client_type}/{notification_type}`

## Verification note
This file was rebuilt manually from Podio's current first-party docs after official-doc review of the live area pages, auth guide, API conventions page, and rate-limit page.
