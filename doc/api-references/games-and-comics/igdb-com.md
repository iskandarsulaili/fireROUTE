# IGDB.com

## Overview
- Provider: IGDB API
- Category: Games & Comics
- Official docs inspected: `https://api-docs.igdb.com/`
- Official product page inspected: `https://www.igdb.com/api`
- Base URL: `https://api.igdb.com/v4`
- Auth token endpoint: `https://id.twitch.tv/oauth2/token`
- Auth model: Twitch application credentials (`client_credentials` flow), then `Client-ID` plus a bearer-token auth header on API requests
- HTTPS: yes
- Default response format: JSON
- Alternate response format documented: Protocol Buffers by appending `.pb` to endpoint paths
- Confirmed routes: `86`

## Auth, access, and commercial notes
- The official docs require a Twitch account, two-factor authentication, and a Twitch developer application.
- Token creation is documented as:
  - `POST https://id.twitch.tv/oauth2/token`
  - query `client_id=...`
  - query `client_secret=...`
  - query `grant_type=client_credentials`
- API requests then send:
  - `Client-ID` header with the Twitch application client id
  - bearer-token auth header with the access token
- The official docs say the API is free for non-commercial usage under the Twitch Developer Service Agreement.
- The official docs and product page both direct commercial users to partnership/contact flows rather than treating the public terms as the final commercial policy.
- Technical FAQ note from the docs: application access tokens are active for `60 days`, and one application can have up to `25` active access tokens at one time.

## Global request model
- Most documented IGDB API routes use `POST`.
- The request body uses the APICalypse query language rather than query-string filtering.
- The docs explicitly describe these common body operators and patterns:
  - `fields`
  - `exclude`
  - `where`
  - `sort`
  - `search`
  - `limit`
  - `offset`
  - expander syntax for nested objects
- Default page size: `10`
- Maximum `limit`: `500`
- The docs also demonstrate `/{endpoint}/count` route variants for count-only queries, but those are presented as a general pattern rather than as separate fixed reference pages, so they are not included in the `86` fixed-route count below.

## Confirmed route count breakdown
- `78` documented reference entity routes under `/v4/*`
- `1` documented multi-query route
- `2` documented data-dump routes
- `5` documented webhook-management/testing routes
- Total fixed routes confirmed from official docs in this shard: `86`

## Confirmed reference entity routes
All routes in this section are documented as `POST` requests that use APICalypse bodies.

| Method | Path | Notes |
|---|---|---|
| POST | `/v4/age_ratings` | Age ratings. |
| POST | `/v4/age_rating_categories` | Age rating categories. |
| POST | `/v4/age_rating_content_descriptions` | Legacy age rating content descriptions. |
| POST | `/v4/age_rating_content_description_types` | Age rating content-description types. |
| POST | `/v4/age_rating_content_descriptions_v2` | New age rating content descriptions table. |
| POST | `/v4/age_rating_organizations` | Age rating organizations. |
| POST | `/v4/alternative_names` | Alternative game names. |
| POST | `/v4/artworks` | Artwork images. |
| POST | `/v4/artwork_types` | Artwork type catalog. |
| POST | `/v4/characters` | Game characters. |
| POST | `/v4/character_genders` | Character genders. |
| POST | `/v4/character_mug_shots` | Character mug shots. |
| POST | `/v4/character_species` | Character species. |
| POST | `/v4/collections` | Collections/series. |
| POST | `/v4/collection_memberships` | Collection memberships. |
| POST | `/v4/collection_membership_types` | Collection membership types. |
| POST | `/v4/collection_relations` | Collection relations. |
| POST | `/v4/collection_relation_types` | Collection relation types. |
| POST | `/v4/collection_types` | Collection types. |
| POST | `/v4/companies` | Companies. |
| POST | `/v4/company_logos` | Company logos. |
| POST | `/v4/company_sizes` | Company sizes. |
| POST | `/v4/company_statuses` | Company statuses. |
| POST | `/v4/company_types` | Company types. |
| POST | `/v4/company_type_histories` | Company type histories. |
| POST | `/v4/company_websites` | Company websites. |
| POST | `/v4/covers` | Game cover art. |
| POST | `/v4/date_formats` | Date-format table. |
| POST | `/v4/entity_types` | Entity types for reports. |
| POST | `/v4/events` | Gaming events. |
| POST | `/v4/event_logos` | Event logos. |
| POST | `/v4/event_networks` | Event networks/URLs. |
| POST | `/v4/external_games` | External-game IDs and mappings. |
| POST | `/v4/external_game_sources` | External-game sources. |
| POST | `/v4/franchises` | Franchises. |
| POST | `/v4/games` | Games. |
| POST | `/v4/game_engines` | Game engines. |
| POST | `/v4/game_engine_logos` | Game-engine logos. |
| POST | `/v4/game_localizations` | Game localizations. |
| POST | `/v4/game_modes` | Game modes. |
| POST | `/v4/game_release_formats` | Game release formats. |
| POST | `/v4/game_statuses` | Game statuses. |
| POST | `/v4/game_time_to_beats` | Time-to-beat data. |
| POST | `/v4/game_types` | Game types. |
| POST | `/v4/game_versions` | Game versions/editions. |
| POST | `/v4/game_version_features` | Game-version features. |
| POST | `/v4/game_version_feature_values` | Game-version feature values. |
| POST | `/v4/game_videos` | Game videos. |
| POST | `/v4/genres` | Genres. |
| POST | `/v4/involved_companies` | Involved companies. |
| POST | `/v4/keywords` | Keywords. |
| POST | `/v4/languages` | Languages. |
| POST | `/v4/language_supports` | Language support mappings. |
| POST | `/v4/language_support_types` | Language support types. |
| POST | `/v4/multiplayer_modes` | Multiplayer modes. |
| POST | `/v4/network_types` | Network types. |
| POST | `/v4/platforms` | Platforms. |
| POST | `/v4/platform_families` | Platform families. |
| POST | `/v4/platform_logos` | Platform logos. |
| POST | `/v4/platform_types` | Platform types. |
| POST | `/v4/platform_versions` | Platform versions. |
| POST | `/v4/platform_version_companies` | Platform-version companies. |
| POST | `/v4/platform_version_release_dates` | Platform-version release dates. |
| POST | `/v4/platform_websites` | Platform websites. |
| POST | `/v4/player_perspectives` | Player perspectives. |
| POST | `/v4/popularity_primitives` | PopScore primitives. |
| POST | `/v4/popularity_types` | PopScore popularity types. |
| POST | `/v4/regions` | Regions. |
| POST | `/v4/release_dates` | Game release dates. |
| POST | `/v4/release_date_regions` | Release-date regions. |
| POST | `/v4/release_date_statuses` | Release-date statuses. |
| POST | `/v4/reports` | Reports. |
| POST | `/v4/report_types` | Report types. |
| POST | `/v4/screenshots` | Screenshots. |
| POST | `/v4/search` | Cross-entity search endpoint. |
| POST | `/v4/themes` | Themes. |
| POST | `/v4/websites` | Websites. |
| POST | `/v4/website_types` | Website types. |

## Confirmed special routes

| Method | Path | Parameters | Notes |
|---|---|---|---|
| POST | `/v4/multiquery` | APICalypse multi-query body; maximum `10` queries per request | Run multiple endpoint queries in one request. |
| GET | `/v4/dumps` | none documented beyond auth headers | Lists available CSV data dumps. |
| GET | `/v4/dumps/{endpoint}` | path placeholder `{endpoint}` | Returns dump metadata including a presigned CSV download URL and schema metadata. |
| POST | `/v4/{endpoint}/webhooks` | x-www-form-urlencoded body `url`, `method`, `secret` | Registers a webhook for a specific endpoint. |
| GET | `/v4/webhooks` | none documented beyond auth headers | Lists all registered webhooks for the authenticated client. |
| GET | `/v4/webhooks/{webhook_id}` | path placeholder `{webhook_id}` | Retrieves one webhook by id. |
| DELETE | `/v4/webhooks/{webhook_id}` | path placeholder `{webhook_id}` | Deletes one webhook by id. |
| POST | `/v4/{endpoint}/webhooks/test/{webhook_id}` | path placeholder `{webhook_id}`, query `entityId` | Sends a test object to a webhook. |

## Pagination, filtering, and query-language notes
- Pagination is body-based, not query-string-based.
- The docs explicitly say:
  - default `limit` is `10`
  - maximum `limit` is `500`
  - `offset` starts the list at a later position
- Search examples show body syntax like `search "Halo"; fields name,release_date.human;`.
- Count examples use `/{endpoint}/count` plus a body such as `where rating > 75;`.
- Sorting examples use syntax such as `sort rating desc;`.
- Filter examples use `where` clauses and support `&` and `|` combination logic.
- The docs emphasize that an empty request body may only return IDs; integrations should request explicit fields or expanded relations.

## Response and format notes
- JSON is the normal documented response format.
- The docs also support Protocol Buffers by appending `.pb` to the endpoint path, for example `/v4/games.pb`.
- The docs describe a shared protobuf file for generating strongly typed clients.
- Data-dump responses are CSV-oriented and partner-only rather than normal JSON search responses.
- Image responses are not direct binary file routes in the v4 API docs; instead the FAQ says to construct image URLs with `image_id`, for example `https://images.igdb.com/igdb/image/upload/t_{size}/{image_id}.png`.

## Rate limits and operational constraints
- Official rate limit: `4 requests per second`.
- Official concurrency limit: up to `8` open requests at one time.
- Exceeding the request-rate limit is documented to return `429 Too Many Requests`.
- The docs say direct browser access is not supported because IGDB does not provide CORS headers for client-side use.
- The recommended workaround is a backend proxy.

## Webhook notes
- Webhook registration uses `application/x-www-form-urlencoded` body data.
- Documented webhook registration fields:
  - `url` — destination that will receive webhook calls
  - `method` — one of `create`, `delete`, or `update`
  - `secret` — echoed back to the consumer in `X-Secret`
- The docs say webhook events send a single JSON object representing an unexpanded entity.
- Delete events only send the deleted object ID.
- A webhook is marked inactive after `5` failed delivery attempts.
- Re-registering the webhook reactivates it.

## Data-dump notes
- The docs say all endpoints are available as CSV data dumps.
- Data dumps are updated daily.
- Access to data dumps is restricted to data partners.
- `/v4/dumps/{endpoint}` returns a presigned S3 download URL that is valid for `5 minutes`.
- The same response also exposes `schema_version` and schema JSON so downstream tooling can detect structural changes.

## Errors and compatibility notes
- Officially documented explicit error/limit behavior includes:
  - `429 Too Many Requests` when the global request rate is exceeded
- Webhook sections describe inactive delivery behavior after five failures rather than a formal response-body schema.
- Data-dump docs describe partner-only availability but do not publish a richer structured error envelope on the inspected page.
- The docs currently expose many deprecated fields and a migration guide from enum-style fields to table-backed fields; downstream integrations should prefer the newer field names where both old and new names are shown.

## Important usage notes
- The API is intentionally field-selective: clients are expected to request only the fields they need.
- IGDB's APICalypse syntax is central to almost every endpoint; adapters that only know classic REST query strings will underuse the API.
- Search is its own endpoint and is also discussed as a capability across several searchable entities.
- Multi-query is limited to `10` subqueries per request.
- The migration page warns that several old field names are temporary compatibility aliases and will be removed after the migration period.
- The product page positions PopScore and popularity primitives as trend-analysis data updated every 24 hours.

## Integration notes for fireROUTE
- Treat the provider as one shared authenticated API with a very large number of entity-specific `POST` routes under `/v4`.
- Model `Client-ID` and bearer token as mandatory credentials for normal API access.
- Keep APICalypse request bodies as raw text rather than trying to flatten them into ordinary query parameters.
- Preserve `/multiquery`, `/dumps`, and webhook routes as first-class special capabilities, not just documentation footnotes.
- Do not assume browser-side direct access will work; the official docs explicitly say CORS is unsupported.
- Keep an eye on deprecated field names during schema mapping because the docs are actively migrating enum-backed fields to table-backed structures.

## Sources inspected
- `https://api-docs.igdb.com/`
- `https://www.igdb.com/api`
