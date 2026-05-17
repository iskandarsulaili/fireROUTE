# Jokes One

## Overview
- Provider: Jokes One API
- Category: Games & Comics
- Official docs inspected: `https://jokes.one/api/joke/`
- Official OpenAPI console inspected: `https://api.jokes.one/`
- OpenAPI spec exposed by the official console: `https://api.jokes.one/yaml/jokes.one.openapi.yaml?v9`
- Base URL: `https://api.jokes.one`
- Secondary server listed in the official OpenAPI spec: `http://api.jokes.one`
- Auth: `X-JokesOne-Api-Secret` header for paid/private usage; the product page also says `api_key` can be sent as a query parameter but strongly discourages it
- HTTPS: yes
- Response formats documented: JSON, XML, JSONP
- Confirmed routes: `12`

## Auth and rate limits
- The official product page says public calls do not require an API key.
- The same page explicitly marks the Joke of the Day portion as public/free, with attribution required to `jokes.one` when using the free version.
- The official product page says paid subscriptions should send `X-JokesOne-Api-Secret: YOUR_API_KEY`.
- The official product page also says `api_key=` query auth works as an alternative, but it is strongly discouraged.
- The official OpenAPI spec defines one API-key security scheme named `X-JokesOne-Api-Secret` in the request header.
- Public rate limit on the official product page: `60 API calls a day` with a distribution of `5 calls an hour`.
- Paid-plan rate limits are described as higher according to the selected subscription plan, but no exact per-plan numbers are published on the inspected pages.

## Confirmed endpoints

| Method | Path | Parameters | Auth | Notes |
|---|---|---|---|---|
| GET | `/jod` | optional query `category` | none for public/free use per product page; header supported by console/spec | Returns Joke of the Day; docs mention categories such as animal, blonde, and general JOD. |
| GET | `/jod/categories` | none documented | none for public/free use per product page; header supported by console/spec | Lists Joke of the Day categories. |
| GET | `/joke` | optional query `id` | `X-JokesOne-Api-Secret` in the spec; route is also tagged under Random Jokes | Fetches a joke, optionally by joke id. |
| GET | `/joke/random` | none documented | `X-JokesOne-Api-Secret` | Returns a random joke. |
| GET | `/joke/search` | optional query `category`, `query`, `minlength` default `100`, `maxlength` default `300`, `author`, `private` default `false` | `X-JokesOne-Api-Secret` | Searches jokes with optional filters. |
| GET | `/joke/categories/search` | required query `query`; optional query `start` default `0` | `X-JokesOne-Api-Secret` | Searches joke categories; documented as paged by `start`. |
| PUT | `/joke` | required query `title`, `text`; optional query `author`, `tags` | `X-JokesOne-Api-Secret` | Adds a new joke to the caller's private collection. |
| PATCH | `/joke` | required query `id`; optional query `title`, `text`, `author`, `tags` | `X-JokesOne-Api-Secret` | Updates a joke in the caller's private collection. |
| DELETE | `/joke` | required query `id` | `X-JokesOne-Api-Secret` | Deletes a joke owned by the caller. |
| GET | `/joke/list` | optional query `start` default `0` | `X-JokesOne-Api-Secret` | Lists jokes in the caller's private collection; documented as paged by `start`. |
| POST | `/joke/tags/add` | required query `id`, `tags` | `X-JokesOne-Api-Secret` | Adds one or more comma-separated tags to a joke. |
| POST | `/joke/tags/remove` | required query `id`, `tags` | `X-JokesOne-Api-Secret` | Removes one or more comma-separated tags from a joke. |

## Parameter and behavior notes
- Query parameters are used throughout the documented API; the inspected spec does not define JSON request bodies for these routes.
- `tags` is documented as a comma-separated string on create/update/tag-management routes.
- `start` is the published pagination control for `/joke/categories/search` and `/joke/list`.
- `/joke/search` supports a boolean `private` filter, documented to switch search scope toward the caller's private collection.
- The official docs describe private jokes as a cloud-hosted personal collection feature.

## Response and format notes
- The official product page says the endpoints support JSON, XML, and JSONP.
- The official OpenAPI spec provides JSON and XML examples across the major routes, and `/joke/random` also lists `application/js`.
- Success responses usually use an envelope with top-level `success` metadata and `contents` or `content` payload sections.
- Example list responses include pagination metadata under `success.range.start` and `success.range.end`.

## Error handling
- The inspected official spec documents these error patterns:
  - `401` — `{"error":{"code":401,"message":"Unauthorized"}}`
  - `404` — `{"error":{"code":404,"message":"Not Found: Joke not found"}}` on delete/tag-management style routes when the target joke does not exist
- No `429` or detailed rate-limit response schema was documented on the inspected official pages.

## Important usage notes
- The public product page and the OpenAPI console are not perfectly aligned: the product page says public calls can be made without an API key, while the OpenAPI spec attaches the header-based API-key security scheme to operations. Consumers should be ready to send `X-JokesOne-Api-Secret` whenever available.
- Free/public Joke of the Day use requires attribution to `jokes.one` according to the official product page.
- The docs market the paid/private routes as storage and management for a user's own cloud-native joke collection.

## Integration notes for fireROUTE
- Treat `https://api.jokes.one` as the canonical base URL.
- Model auth as optional for public/free Joke of the Day routes but required for private collection and most search/random routes.
- Preserve `tags` as a comma-separated query string rather than converting it to arrays unless a downstream adapter explicitly transforms it.
- Support JSON as the default response format, but keep XML/JSONP notes because the official docs publish them.
- Implement pagination only where the official docs actually expose `start`.

## Sources inspected
- `https://jokes.one/api/joke/`
- `https://api.jokes.one/`
- `https://api.jokes.one/yaml/jokes.one.openapi.yaml?v9`
