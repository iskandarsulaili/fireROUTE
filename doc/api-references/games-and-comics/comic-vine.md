# Comic Vine

## Overview
- Provider: Comic Vine API
- Category: Games & Comics
- Official docs: `https://comicvine.gamespot.com/api/documentation`
- Official API landing page: `https://comicvine.gamespot.com/api/`
- Base URL: `https://comicvine.gamespot.com/api`
- Auth: unique Comic Vine API key required; the official API landing page says you must log in to get a Comic Vine API key
- HTTPS: yes
- Response formats: `xml`, `json`, `jsonp`
- Pagination: offset-based; response envelopes include `number_of_total_results`, `number_of_page_results`, `limit`, and `offset`
- Rate limits: `200 requests per resource, per hour` officially supported, plus undocumented velocity detection that can temporarily block resources
- Commercial use: not allowed; the official terms say the API is for non-commercial use only
- Confirmed routes: `42`

## Confirmed endpoint roots

### Detail resource roots
These routes are listed on the official documentation page as detail resources. The public documentation page lists the resource root and documents `format` plus `field_list` for these resource types.

| Method | Path | Documented parameters | Notes |
|---|---|---|---|
| GET | `/character` | `format`, `field_list` | Character detail resource family. |
| GET | `/chat` | `format`, `field_list` | Chat detail resource family. |
| GET | `/concept` | `format`, `field_list` | Concept detail resource family. |
| GET | `/episode` | `format`, `field_list` | Episode detail resource family. |
| GET | `/issue` | `format`, `field_list` | Issue detail resource family. |
| GET | `/location` | `format`, `field_list` | Location detail resource family. |
| GET | `/movie` | `format`, `field_list` | Movie detail resource family. |
| GET | `/object` | `format`, `field_list` | Object detail resource family. |
| GET | `/origin` | `format`, `field_list` | Origin detail resource family. |
| GET | `/person` | `format`, `field_list` | Person detail resource family. |
| GET | `/power` | `format`, `field_list` | Power detail resource family. |
| GET | `/promo` | `format`, `field_list` | Promo detail resource family. |
| GET | `/publisher` | `format`, `field_list` | Publisher detail resource family. |
| GET | `/series` | `format`, `field_list` | Series detail resource family. |
| GET | `/story_arc` | `format`, `field_list` | Story-arc detail resource family. |
| GET | `/team` | `format`, `field_list` | Team detail resource family. |
| GET | `/video` | `format`, `field_list` | Video detail resource family. |
| GET | `/video_type` | `format`, `field_list` | Video-type detail resource family. |
| GET | `/video_category` | `format`, `field_list` | Video-category detail resource family. |
| GET | `/volume` | `format`, `field_list` | Volume detail resource family. |

### Collection resource roots

| Method | Path | Documented parameters | Notes |
|---|---|---|---|
| GET | `/characters` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection; docs say `limit` defaults to `100` and cannot exceed `100`. |
| GET | `/chats` | `format`, `field_list` | Chat collection route; the public docs do not list pagination or filter parameters here. |
| GET | `/concepts` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/episodes` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/issues` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/locations` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/movies` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/objects` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/origins` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/people` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/powers` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/promos` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/publishers` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/series_list` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Series collection route. |
| GET | `/story_arcs` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/teams` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |
| GET | `/videos` | `format`, `api_key`, `field_list`, `limit`, `offset`, `sort`, `subscriber_only`, `video_type`, `filter` | Video collection route with extra documented filters. |
| GET | `/video_types` | `format`, `field_list`, `limit`, `offset` | Video-type collection route. |
| GET | `/video_categories` | `format`, `field_list`, `limit`, `offset` | Video-category collection route. |
| GET | `/volumes` | `format`, `field_list`, `limit`, `offset`, `sort`, `filter` | Standard list/searchable collection. |

### Special routes

| Method | Path | Documented parameters | Notes |
|---|---|---|---|
| GET | `/search` | `format`, `api_key`, `field_list`, `limit`, `offset`, `query`, `resources`, `subscriber_only` | Global search route; docs say `limit` defaults to `10` and cannot exceed `10`. |
| GET | `/types` | `format` | Type-discovery route exposing `detail_resource_name` and `list_resource_name`. |

## Auth, formats, pagination, and errors
- The API landing page says: `You must log in to get a Comic Vine API Key.`
- The same landing page says these APIs provide structured-wiki content in XML and JSON formats and do not expose user-specific data.
- The documentation page adds `jsonp` as a supported output format and explicitly documents `103` as the error for using `jsonp` without `json_callback`.
- Standard response envelope fields documented on the docs page:
  - `status_code`
  - `error`
  - `number_of_total_results`
  - `number_of_page_results`
  - `limit`
  - `offset`
  - `results`
- Official documented `status_code` values:
  - `1` — OK
  - `100` — Invalid API Key
  - `101` — Object Not Found
  - `102` — Error in URL Format
  - `103` — `jsonp` format requires a `json_callback` argument
  - `104` — Filter Error
  - `105` — Subscriber only video is for subscribers only
- A live official request to `https://comicvine.gamespot.com/api/characters/?format=json` without an API key returned JSON with `error: "Invalid API Key"`, `status_code: 100`, `limit: 0`, `offset: 0`, and an empty `results` array.

## Parameter notes
- `format` accepts `xml`, `json`, or `jsonp`.
- `field_list` is the documented payload-thinning parameter and accepts comma-delimited field names.
- `limit` and `offset` are the documented pagination controls where supported.
- `sort` uses the official format `field:direction` where direction is `asc` or `desc`.
- `filter` supports:
  - single filter: `field:value`
  - multiple filters: `field:value,field:value`
  - date filters: `field:start value|end value`
- `resources` on `/search` accepts comma-delimited resource names. The docs list `character`, `concept`, `origin`, `object`, `location`, `issue`, `story_arc`, `volume`, `publisher`, `person`, `team`, and `video`.
- `video_type` on `/videos` filters by video-type ID.
- `subscriber_only` is documented on `/search` and `/videos`, but the official docs literally leave it as `NEED DESCRIPTION`.

## Important usage notes
- The official API landing page says the API is strictly for non-commercial use only.
- The official terms also say Comic Vine can revoke access, ask developers not to build a competing product, and require linking back when using Comic Vine data.
- The landing page recommends caching responses to avoid duplicate requests and stay within rate limits.
- The documentation page lists resource roots, but the summary page does not publish a single universal placeholder pattern for concrete detail-resource IDs; resource payloads instead expose `api_detail_url` links to concrete detail endpoints.
- The public docs only describe read-oriented resource retrieval. No POST, PUT, PATCH, or DELETE operations are documented on the inspected official pages.

## Integration notes for fireROUTE
- Model this provider as a read-only GET API rooted at `https://comicvine.gamespot.com/api`.
- Keep route handling at the official resource-family level shown above; do not invent undocumented mutation routes.
- Implement offset-based pagination using the documented envelope fields rather than guessing page numbers.
- Treat `/search` as a special low-limit route with its own `query` and `resources` filters.
- Handle Comic Vine `status_code` values from the response body in addition to ordinary HTTP status handling.
- Preserve `jsonp` support only when a caller also supplies `json_callback`.

## Sources inspected
- `https://comicvine.gamespot.com/api/documentation`
- `https://comicvine.gamespot.com/api/`
- `https://comicvine.gamespot.com/api/characters/?format=json`
